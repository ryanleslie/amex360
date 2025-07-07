
import { supabase } from "@/integrations/supabase/client"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"

export interface CardBalance {
  ID: string
  cardType: string
  currentBalance: number | null
  accountName?: string
  accountType?: string
  accountSubtype?: string
  availableBalance?: number | null
  creditLimit?: number | null
  institutionName?: string
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
      
      // First try to get Plaid accounts
      const { data: plaidAccounts, error: plaidError } = await supabase
        .from('plaid_accounts')
        .select('*')
        
      if (!plaidError && plaidAccounts && plaidAccounts.length > 0) {
        // Map Plaid accounts to CardBalance format using primary card mapping
        return primaryCards
          .map(primaryCard => {
            const plaidAccount = plaidAccounts.find(
              account => account.plaid_account_id === primaryCard.plaid_account_id
            )
            
            if (!plaidAccount) return null
            
            return {
              ID: plaidAccount.id,
              cardType: primaryCard.cardType,
              currentBalance: plaidAccount.current_balance,
              accountName: plaidAccount.account_name,
              accountType: plaidAccount.account_type,
              accountSubtype: plaidAccount.account_subtype,
              availableBalance: plaidAccount.available_balance,
              creditLimit: plaidAccount.credit_limit,
              institutionName: plaidAccount.institution_name,
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
      }
      
      // Fallback to static card_balances if no Plaid data
      const { data: staticBalances, error: staticError } = await supabase
        .from('card_balances')
        .select('*')
        
      if (staticError) {
        console.error('Error fetching card balances:', staticError)
        return []
      }
      
      return staticBalances?.map(balance => ({
        ID: balance.ID,
        cardType: balance.cardType,
        currentBalance: balance.currentBalance
      })) || []
      
    } catch (error) {
      console.error('Failed to fetch card balances:', error)
      return []
    }
  }
}
