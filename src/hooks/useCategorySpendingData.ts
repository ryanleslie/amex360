
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"

export const useCategorySpendingData = (timeRange: string) => {
  // Get all transactions for the time range
  const allTransactions = React.useMemo(() => {
    return transactionFilterService.getTransactionsForCalculations(timeRange)
  }, [timeRange])

  // Process data to group by category for the donut chart
  const categoryData = React.useMemo(() => {
    // Filter to only debit transactions (expenses) with valid categories
    const debitTransactions = allTransactions.filter(transaction => 
      transaction.amount < 0 && 
      transaction.category && 
      transaction.category.trim() !== ''
    )

    // Group by category and sum amounts
    const categoryTotals = debitTransactions.reduce((acc, transaction) => {
      const category = transaction.category!
      
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Math.abs(transaction.amount)
      
      return acc
    }, {} as Record<string, number>)

    // Calculate total spend for percentage calculations
    const totalSpend = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    // Convert to array format for the donut chart
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / totalSpend) * 100 * 100) / 100
      }))
      .sort((a, b) => b.amount - a.amount) // Sort by amount descending
  }, [allTransactions])

  const totalSpend = categoryData.reduce((sum, item) => sum + item.amount, 0)

  return {
    categoryData,
    totalSpend
  }
}
