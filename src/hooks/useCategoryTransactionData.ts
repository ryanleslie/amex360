
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"
import { Transaction } from "@/types/transaction"

export const useCategoryTransactionData = (timeRange: string, selectedCategory?: string) => {
  return React.useMemo(() => {
    // Get all transactions for the time range
    const allTransactions = transactionFilterService.getTransactionsForCalculations(timeRange)
    
    // Filter out transactions with NULL or empty categories
    const transactionsWithCategories = allTransactions.filter(transaction => 
      transaction.category && transaction.category.trim() !== ""
    )
    
    // If no category is selected, return all transactions with categories
    if (!selectedCategory) {
      return transactionsWithCategories
    }
    
    // Filter by selected category (excluding uncategorized since we already filtered those out)
    const filteredTransactions = transactionsWithCategories.filter(transaction => {
      return transaction.category === selectedCategory
    })
    
    return filteredTransactions
  }, [timeRange, selectedCategory])
}
