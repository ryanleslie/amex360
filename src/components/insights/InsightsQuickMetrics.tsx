
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"
import { useAuth } from "@/contexts/AuthContext"

export function InsightsQuickMetrics() {
  const { user } = useAuth()
  const isAdmin = user?.user_metadata?.role === 'admin'

  const userInsightsMetrics = [
    "Closing this week",
    "Due this week",
    "Annual Fee",
    "No Annual Fee",
    "Brand Partner Cards"
  ]

  const adminInsightsMetrics = [
    "Closing this week",
    "Due this week", 
    "Highest Balance",
    "Lowest Balance",
    "Urgent Balance"
  ]

  const metricsToShow = isAdmin ? adminInsightsMetrics : userInsightsMetrics

  return <UnifiedQuickMetrics metricsToShow={metricsToShow} />
}
