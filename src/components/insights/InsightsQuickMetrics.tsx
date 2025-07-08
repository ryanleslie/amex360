
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function InsightsQuickMetrics() {
  const insightsMetrics = [
    "Closing this week",
    "Due this week",
    "Urgent Balances",
    "Highest Balance",
    "Lowest Balance"
  ]

  return <UnifiedQuickMetrics metricsToShow={insightsMetrics} />
}
