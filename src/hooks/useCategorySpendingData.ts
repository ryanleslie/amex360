
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"

export const useCategorySpendingData = (timeRange: string) => {
  // Get category spending data from the centralized service
  const processedData = React.useMemo(() => {
    const allTransactions = transactionFilterService.getFilteredTransactions({
      selectedCard: "all",
      globalFilter: "",
      selectedTimeRange: timeRange
    })

    // Filter to only include expenses (negative amounts)
    const expenseTransactions = allTransactions.filter(transaction => transaction.amount < 0)

    // Group transactions by category and sum spending
    const categorySpending = expenseTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other'
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Math.abs(transaction.amount) // Use absolute value for spending
      return acc
    }, {} as Record<string, number>)

    // Convert to array format for chart
    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        spending: amount
      }))
      .sort((a, b) => b.spending - a.spending) // Sort by spending descending
  }, [timeRange])

  const totalSpending = processedData.reduce((sum, item) => sum + item.spending, 0)

  return {
    filteredData: processedData,
    totalSpending
  }
}
