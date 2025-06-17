
import * as React from "react"
import { transactionFilterService } from "@/services/transaction"

export const useCategorySpendingData = (timeRange: string) => {
  const processedData = React.useMemo(() => {
    const transactions = transactionFilterService.getTransactionsForCalculations(timeRange)
    
    // Filter out transactions with NULL/undefined categories and only include expenses (negative amounts)
    const expenseTransactions = transactions.filter(transaction => 
      transaction.category && 
      transaction.category.trim() !== '' && 
      transaction.amount < 0
    )
    
    // Group by category and sum spending
    const categorySpending = expenseTransactions.reduce((acc, transaction) => {
      const category = transaction.category!
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Math.abs(transaction.amount)
      return acc
    }, {} as Record<string, number>)
    
    // Convert to array format suitable for charts
    return Object.entries(categorySpending)
      .map(([category, spending]) => ({
        category,
        spending
      }))
      .sort((a, b) => b.spending - a.spending) // Sort by spending descending
  }, [timeRange])

  const totalSpending = processedData.reduce((sum, item) => sum + item.spending, 0)

  return {
    data: processedData,
    totalSpending
  }
}
