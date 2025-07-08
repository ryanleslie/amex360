
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"
import { useAuth } from "@/contexts/AuthContext"

export function InsightsQuickMetrics() {
  const { isAdmin } = useAuth()

  const userInsightsMetrics = [
    "Closing this week",
    "Due this week",
    "Annual Fee",
    "No Annual Fee",
    "Brand Partners"
  ]

  const adminInsightsMetrics = [
    "Closing this week",
    "Due this week", 
    "Highest Balance",
    "Lowest Balance",
    "Urgent Balances"
  ]

  const metricsToShow = isAdmin ? adminInsightsMetrics : userInsightsMetrics

  return <UnifiedQuickMetrics metricsToShow={metricsToShow} />
}
