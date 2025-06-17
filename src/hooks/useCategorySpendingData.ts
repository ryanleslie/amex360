
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"

export const useCategorySpendingData = (timeRange: string) => {
  // Get all transactions for the time range
  const allTransactions = React.useMemo(() => {
    return transactionFilterService.getTransactionsForCalculations(timeRange)
  }, [timeRange])

  // Process data to group by category and calculate daily spending
  const processedData = React.useMemo(() => {
    // Filter to only debit transactions (expenses) with valid categories
    const debitTransactions = allTransactions.filter(transaction => 
      transaction.amount < 0 && 
      transaction.category && 
      transaction.category.trim() !== ''
    )

    // Group by date and category
    const dailyByCategory = debitTransactions.reduce((acc, transaction) => {
      const date = transaction.date
      const category = transaction.category!
      
      if (!acc[date]) {
        acc[date] = {}
      }
      if (!acc[date][category]) {
        acc[date][category] = 0
      }
      acc[date][category] += Math.abs(transaction.amount)
      
      return acc
    }, {} as Record<string, Record<string, number>>)

    // Convert to chart data format - sum all categories per day
    return Object.entries(dailyByCategory)
      .map(([date, categories]) => ({
        date,
        totalSpend: Math.round(Object.values(categories).reduce((sum, amount) => sum + amount, 0) * 100) / 100
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [allTransactions])

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (processedData.length === 0) return []
    
    // Get the latest date from the data
    const latestDate = processedData[processedData.length - 1].date
    
    let startDate: string
    const today = new Date(latestDate)
    
    if (timeRange === "ytd") {
      // Year to date - start from January 1st of the current year
      startDate = `${today.getFullYear()}-01-01`
    } else if (timeRange === "90d") {
      const date90DaysAgo = new Date(today)
      date90DaysAgo.setDate(date90DaysAgo.getDate() - 90)
      startDate = date90DaysAgo.toISOString().split('T')[0]
    } else if (timeRange === "30d") {
      const date30DaysAgo = new Date(today)
      date30DaysAgo.setDate(date30DaysAgo.getDate() - 30)
      startDate = date30DaysAgo.toISOString().split('T')[0]
    } else if (timeRange === "7d") {
      const date7DaysAgo = new Date(today)
      date7DaysAgo.setDate(date7DaysAgo.getDate() - 7)
      startDate = date7DaysAgo.toISOString().split('T')[0]
    } else {
      startDate = processedData[0].date
    }
    
    return processedData.filter(item => item.date >= startDate)
  }, [processedData, timeRange])

  const totalSpendForPeriod = filteredData.reduce((sum, item) => sum + item.totalSpend, 0)
  const averageDailySpend = filteredData.length > 0 ? totalSpendForPeriod / filteredData.length : 0

  return {
    filteredData,
    averageDailySpend
  }
}
