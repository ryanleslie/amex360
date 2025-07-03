
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"
import { Transaction } from "@/types/transaction"

export const useCategoryTransactionData = (timeRange: string, selectedCategory?: string) => {
  return React.useMemo(() => {
    // Get all transactions for the time range
    const allTransactions = transactionFilterService.getTransactionsForCalculations(timeRange)
    
    // If no category is selected, return all transactions
    if (!selectedCategory) {
      return allTransactions
    }
    
    // Filter by selected category
    const filteredTransactions = allTransactions.filter(transaction => {
      if (selectedCategory === "Uncategorized") {
        return !transaction.category || transaction.category.trim() === ""
      }
      return transaction.category === selectedCategory
    })
    
    return filteredTransactions
  }, [timeRange, selectedCategory])
}
