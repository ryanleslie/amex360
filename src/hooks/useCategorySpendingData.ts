
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"

export const useCategorySpendingData = (timeRange: string) => {
  // Get all transactions for the time range
  const allTransactions = React.useMemo(() => {
    return transactionFilterService.getTransactionsForCalculations(timeRange)
  }, [timeRange])

  // Process data to group by category for the donut chart
  const categoryData = React.useMemo(() => {
    // Filter to transactions with valid categories (both debits and credits)
    const transactionsWithCategories = allTransactions.filter(transaction => 
      transaction.category && 
      transaction.category.trim() !== ''
    )

    // Group by category and sum amounts (credits reduce the category total)
    const categoryTotals = transactionsWithCategories.reduce((acc, transaction) => {
      const category = transaction.category!
      
      if (!acc[category]) {
        acc[category] = 0
      }
      
      // For debits (expenses), add the absolute amount
      // For credits, subtract the amount (reducing the category total)
      if (transaction.amount < 0) {
        acc[category] += Math.abs(transaction.amount)
      } else {
        acc[category] -= transaction.amount
      }
      
      return acc
    }, {} as Record<string, number>)

    // Add uncategorized debit transactions if they exist
    const uncategorizedDebits = allTransactions.filter(transaction => 
      transaction.amount < 0 && 
      (!transaction.category || transaction.category.trim() === '')
    )

    if (uncategorizedDebits.length > 0) {
      const uncategorizedTotal = uncategorizedDebits.reduce(
        (sum, transaction) => sum + Math.abs(transaction.amount), 
        0
      )
      categoryTotals['Uncategorized'] = uncategorizedTotal
    }

    // Filter out categories with zero or negative totals and calculate total spend
    const validCategories = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
    
    const totalSpend = validCategories.reduce((sum, [_, amount]) => sum + amount, 0)

    // Convert to array format for the donut chart
    return validCategories
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / totalSpend) * 100 * 100) / 100
      }))
      .sort((a, b) => b.amount - a.amount) // Sort by amount descending
  }, [allTransactions])

  // Calculate total spend from all debit transactions minus categorized credits
  const totalSpend = React.useMemo(() => {
    return categoryData.reduce((sum, category) => sum + category.amount, 0)
  }, [categoryData])

  return {
    categoryData,
    totalSpend: Math.round(totalSpend * 100) / 100
  }
}
