
import { supabase } from "@/integrations/supabase/client"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"
import { balanceCalculator, CalculatedBalance } from "@/services/balanceCalculator"

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
      
      // Calculate real-time balances using transaction data
      const calculatedBalances = balanceCalculator.calculateRealTimeBalances()
      
      // Map calculated balances with primary card details
      return calculatedBalances
        .map(calculatedBalance => {
          const primaryCard = primaryCards.find(
            card => card.plaid_account_id === calculatedBalance.plaid_account_id ||
                   card.lastFive === calculatedBalance.lastFive
          )
          
          if (!primaryCard) {
            // Return basic balance info if no primary card match
            return {
              ID: `calc_${calculatedBalance.lastFive}`,
              cardType: calculatedBalance.cardType,
              currentBalance: calculatedBalance.calculatedBalance,
              plaid_account_id: calculatedBalance.plaid_account_id,
              last_synced: calculatedBalance.lastTransactionDate
            }
          }
          
          return {
            ID: `calc_${calculatedBalance.lastFive}`,
            cardType: calculatedBalance.cardType,
            currentBalance: calculatedBalance.calculatedBalance,
            plaid_account_id: calculatedBalance.plaid_account_id,
            last_synced: calculatedBalance.lastTransactionDate,
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
      console.error('Failed to calculate card balances:', error)
      return []
    }
  },

  async updateSupabaseBalances(): Promise<void> {
    try {
      const calculatedBalances = balanceCalculator.calculateRealTimeBalances()
      
      for (const balance of calculatedBalances) {
        // Upsert calculated balance to Supabase
        const { error } = await supabase
          .from('card_balances')
          .upsert({
            ID: `calc_${balance.lastFive}`,
            cardType: balance.cardType,
            currentBalance: balance.calculatedBalance,
            plaid_account_id: balance.plaid_account_id,
            last_synced: new Date().toISOString()
          }, {
            onConflict: 'ID'
          })
        
        if (error) {
          console.error(`Error updating balance for ${balance.cardType}:`, error)
        }
      }
      
      console.log('Successfully updated card balances in Supabase')
    } catch (error) {
      console.error('Failed to update Supabase balances:', error)
    }
  }
}
