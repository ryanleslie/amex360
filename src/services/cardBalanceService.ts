
import { supabase } from "@/integrations/supabase/client"

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
}

export const cardBalanceService = {
  async getCardBalances(): Promise<CardBalance[]> {
    try {
      // First try to get Plaid accounts
      const { data: plaidAccounts, error: plaidError } = await supabase
        .from('plaid_accounts')
        .select('*')
        
      if (!plaidError && plaidAccounts && plaidAccounts.length > 0) {
        // Map Plaid accounts to CardBalance format
        return plaidAccounts.map(account => ({
          ID: account.id,
          cardType: account.account_name,
          currentBalance: account.current_balance,
          accountName: account.account_name,
          accountType: account.account_type,
          accountSubtype: account.account_subtype,
          availableBalance: account.available_balance,
          creditLimit: account.credit_limit,
          institutionName: account.institution_name
        }))
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
