
import { supabase } from "@/integrations/supabase/client"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"

export interface CardBalance {
  ID: string
  cardType: string
  currentBalance: number | null
  plaid_account_id?: string | null
  accountName?: string
  accountType?: string
  accountSubtype?: string
  availableBalance?: number | null
  creditLimit?: number | null
  institutionName?: string
  last_synced?: string | null
  primaryCard?: {
    lastFive: string
    annualFee: number
    interestRate: string
    closingDate: number
    dueDate: number
    limitType: string
  }
}

export const cardBalanceService = {
  async getCardBalances(): Promise<CardBalance[]> {
    try {
      const { balanceCalculator } = await import('./balanceCalculator')
      const primaryCards = getAllPrimaryCards()
      
      // Calculate balances in memory
      const calculatedBalances = balanceCalculator.calculateRealTimeBalances()
      
      // Map calculated balances with primary card details
      return calculatedBalances.map(balance => {
        const primaryCard = primaryCards.find(
          card => card.plaid_account_id === balance.plaid_account_id
        )
        
        if (!primaryCard) {
          // Return basic balance info if no primary card match
          return {
            ID: balance.plaid_account_id,
            cardType: balance.cardType,
            currentBalance: balance.calculatedBalance,
            plaid_account_id: balance.plaid_account_id,
            last_synced: balance.lastCalculated
          }
        }
        
        return {
          ID: balance.plaid_account_id,
          cardType: balance.cardType,
          currentBalance: balance.calculatedBalance,
          plaid_account_id: balance.plaid_account_id,
          last_synced: balance.lastCalculated,
          primaryCard: {
            lastFive: primaryCard.lastFive,
            annualFee: primaryCard.annualFee,
            interestRate: primaryCard.interestRate,
            closingDate: primaryCard.closingDate,
            dueDate: primaryCard.dueDate,
            limitType: primaryCard.limitType
          }
        }
      })
      
    } catch (error) {
      console.error('Failed to calculate card balances:', error)
      return []
    }
  }
}
