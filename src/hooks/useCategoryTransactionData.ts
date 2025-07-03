
import * as React from "react"
import { Transaction } from "@/types/transaction"
import { transactionFilterService } from "@/services/transactionFilterService"

export const useCategoryTransactionData = (timeRange: string, selectedCategory?: string) => {
  const filteredTransactions = React.useMemo(() => {
    // Get all transactions for the time range
    const timeFilteredTransactions = transactionFilterService.getTransactionsForCalculations(timeRange)
    
    // If no category is selected, return all transactions
    if (!selectedCategory) {
      return timeFilteredTransactions
    }
    
    // Filter by selected category
    if (selectedCategory === "Uncategorized") {
      return timeFilteredTransactions.filter(transaction => 
        !transaction.category || transaction.category.trim() === ''
      )
    }
    
    return timeFilteredTransactions.filter(transaction => 
      transaction.category === selectedCategory
    )
  }, [timeRange, selectedCategory])

  return filteredTransactions
}
