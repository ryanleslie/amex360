import { supabase } from "@/integrations/supabase/client"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"
import { parseTransactionData } from "@/utils/transactionParser"

export interface CalculatedBalance {
  cardType: string
  plaid_account_id: string
  calculatedBalance: number
  lastCalculated: string
}

export const balanceCalculator = {
  /**
   * Calculates real-time balances by processing transactions since starting date
   */
  calculateRealTimeBalances(): CalculatedBalance[] {
    const primaryCards = getAllPrimaryCards()
    const transactions = parseTransactionData()
    const calculatedBalances: CalculatedBalance[] = []

    primaryCards.forEach(card => {
      // Start with the starting balance from CSV
      let currentBalance = card.startingBalance
      
      // Filter transactions for this card that occurred after the starting date
      const cardTransactions = transactions.filter(transaction => {
        // Match by account_type (card name)
        const isMatchingCard = transaction.account_type === card.cardType
        
        // Only process transactions after the starting date
        const transactionDate = new Date(transaction.date)
        const startingDate = new Date(card.startingDate)
        const isAfterStartingDate = transactionDate > startingDate
        
        return isMatchingCard && isAfterStartingDate
      })

      // Process each transaction to calculate current balance
      cardTransactions.forEach(transaction => {
        if (transaction.amount < 0) {
          // Negative amount = charge/purchase = INCREASES balance owed
          currentBalance += Math.abs(transaction.amount)
        } else {
          // Positive amount = payment = DECREASES balance owed
          currentBalance -= transaction.amount
        }
      })

      // Store calculated balance
      calculatedBalances.push({
        cardType: card.cardType,
        plaid_account_id: card.plaid_account_id,
        calculatedBalance: Math.max(0, currentBalance), // Don't allow negative balances
        lastCalculated: new Date().toISOString()
      })
    })

    return calculatedBalances
  },

  /**
   * Updates the card_balances table in Supabase with calculated balances
   */
  async syncCalculatedBalancesToSupabase(): Promise<boolean> {
    try {
      const calculatedBalances = this.calculateRealTimeBalances()
      
      // Update each card balance in the database
      for (const balance of calculatedBalances) {
        const { error } = await supabase
          .from('card_balances')
          .upsert({
            cardType: balance.cardType,
            plaid_account_id: balance.plaid_account_id,
            currentBalance: balance.calculatedBalance,
            last_synced: balance.lastCalculated
          }, {
            onConflict: 'plaid_account_id'
          })

        if (error) {
          console.error(`Error updating balance for ${balance.cardType}:`, error)
          return false
        }
      }

      console.log('Successfully synced calculated balances to Supabase')
      return true
    } catch (error) {
      console.error('Failed to sync calculated balances:', error)
      return false
    }
  }
}