
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
      const primaryCards = getAllPrimaryCards()
      
      // Get card balances from the public table (works for both authenticated and guest users)
      const { data: cardBalances, error: balanceError } = await supabase
        .from('card_balances')
        .select('*')
        
      if (balanceError) {
        console.error('Error fetching card balances:', balanceError)
        return []
      }
      
      if (!cardBalances || cardBalances.length === 0) {
        return []
      }
      
      // Map card balances with primary card details
      return cardBalances
        .map(balance => {
          const primaryCard = primaryCards.find(
            card => card.plaid_account_id === balance.plaid_account_id
          )
          
          if (!primaryCard) {
            // Return basic balance info if no primary card match
            return {
              ID: balance.ID,
              cardType: balance.cardType,
              currentBalance: balance.currentBalance,
              plaid_account_id: balance.plaid_account_id,
              last_synced: balance.last_synced
            }
          }
          
          return {
            ID: balance.ID,
            cardType: balance.cardType,
            currentBalance: balance.currentBalance,
            plaid_account_id: balance.plaid_account_id,
            last_synced: balance.last_synced,
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
        .filter(Boolean) as CardBalance[]
      
    } catch (error) {
      console.error('Failed to fetch card balances:', error)
      return []
    }
  }
}
