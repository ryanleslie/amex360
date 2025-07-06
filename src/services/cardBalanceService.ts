
import { supabase } from "@/integrations/supabase/client"
import { transactionFilterService } from "@/services/transaction"

interface CardBalance {
  cardType: string
  currentBalance: number | null
}

export const cardBalanceService = {
  // Fetch card balances from Supabase
  async getCardBalances(): Promise<Record<string, number | null>> {
    const { data, error } = await supabase
      .from('card_balances')
      .select('cardType, currentBalance')
    
    if (error) {
      console.error('Error fetching card balances:', error)
      return {}
    }
    
    const balanceMap: Record<string, number | null> = {}
    data?.forEach(balance => {
      balanceMap[balance.cardType] = balance.currentBalance
    })
    
    return balanceMap
  },

  // Calculate balance from transaction data for a specific card
  calculateCardBalance(cardType: string, lastFive: string): number {
    const transactions = transactionFilterService.getTransactions()
    
    // Filter transactions for this specific card
    const cardTransactions = transactions.filter(transaction => {
      const transactionLastFive = transaction.cardAccount?.slice(-4) || ''
      return transaction.cardAccount?.toLowerCase().includes(cardType.toLowerCase()) ||
             transactionLastFive === lastFive
    })
    
    // Sum all transactions (negative amounts are debits, positive are credits)
    const balance = cardTransactions.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0)
    }, 0)
    
    return balance
  },

  // Get balance for a card, prioritizing Supabase data over calculated data
  async getCardBalance(cardType: string, lastFive: string): Promise<number> {
    const supabaseBalances = await this.getCardBalances()
    
    // Check if we have a balance from Supabase
    const supabaseBalance = supabaseBalances[cardType]
    if (supabaseBalance !== null && supabaseBalance !== undefined) {
      return supabaseBalance
    }
    
    // Fallback to calculated balance from transaction data
    return this.calculateCardBalance(cardType, lastFive)
  }
}
