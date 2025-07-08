import { parseTransactionData } from "@/utils/transactionParser"
import { STARTING_BALANCES, getStartingBalance } from "@/data/starting_balances"
import { Transaction } from "@/types/transaction"

export interface CalculatedBalance {
  cardType: string
  lastFive: string
  plaid_account_id: string
  calculatedBalance: number
  transactionCount: number
  lastTransactionDate: string | null
}

export class BalanceCalculator {
  private transactions: Transaction[] = []

  constructor() {
    this.transactions = parseTransactionData()
  }

  calculateRealTimeBalances(): CalculatedBalance[] {
    const results: CalculatedBalance[] = []

    for (const startingBalance of STARTING_BALANCES) {
      const calculatedBalance = this.calculateBalanceForCard(
        startingBalance.cardType,
        startingBalance.lastFive,
        startingBalance.startingBalance,
        startingBalance.baselineDate
      )
      
      results.push(calculatedBalance)
    }

    return results
  }

  private calculateBalanceForCard(
    cardType: string, 
    lastFive: string, 
    startingBalance: number,
    baselineDate: string
  ): CalculatedBalance {
    // Filter transactions for this specific card since baseline date
    const cardTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      const baseline = new Date(baselineDate)
      
      // Match by account_type (cardType) and last_five
      const isMatchingCard = transaction.account_type === cardType && 
                            transaction.last_five === lastFive
      
      // Only include transactions after baseline date
      const isAfterBaseline = transactionDate > baseline
      
      return isMatchingCard && isAfterBaseline
    })

    // Calculate balance by processing transactions
    let currentBalance = startingBalance
    
    cardTransactions.forEach(transaction => {
      if (transaction.amount < 0) {
        // Negative amount = charge/purchase = INCREASES balance owed
        currentBalance += Math.abs(transaction.amount)
      } else {
        // Positive amount = payment = DECREASES balance owed
        currentBalance -= transaction.amount
      }
    })

    // Find the most recent transaction date
    const sortedTransactions = cardTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const lastTransactionDate = sortedTransactions.length > 0 
      ? sortedTransactions[0].date 
      : null

    const startingBalanceData = getStartingBalance(cardType, lastFive)

    return {
      cardType,
      lastFive,
      plaid_account_id: startingBalanceData?.plaid_account_id || `unknown_${lastFive}`,
      calculatedBalance: Math.round(currentBalance * 100) / 100, // Round to 2 decimal places
      transactionCount: cardTransactions.length,
      lastTransactionDate
    }
  }

  // Get calculated balance for a specific card
  getBalanceForCard(cardType: string, lastFive: string): CalculatedBalance | null {
    const startingBalance = getStartingBalance(cardType, lastFive)
    if (!startingBalance) return null

    return this.calculateBalanceForCard(
      cardType,
      lastFive, 
      startingBalance.startingBalance,
      startingBalance.baselineDate
    )
  }
}

// Export singleton instance
export const balanceCalculator = new BalanceCalculator()