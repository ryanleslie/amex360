
import * as React from "react"
import { transactionFilterService } from "@/services/transactionFilterService"

export const useCategorySpendingData = (timeRange: string) => {
  // Get daily spending data grouped by category from the centralized service
  const processedData = React.useMemo(() => {
    return transactionFilterService.getDailySpendingData("ytd") // Get all YTD data first
  }, [])

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
