
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function InsightsQuickMetrics() {
  const insightsMetrics = [
    "Closing this week",
    "Due this week",
    "No Annual Fee",
    "Annual Fee",
    "Total Annual Fees"
  ]

  return <UnifiedQuickMetrics metricsToShow={insightsMetrics} />
}
