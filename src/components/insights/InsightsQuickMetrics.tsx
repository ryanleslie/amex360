
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function InsightsQuickMetrics() {
  const insightsMetrics = [
    "Closing this week",
    "Due this week",
    "Annual Fee",
    "No Annual Fee",
    "Brand Partner Cards"
  ]

  return <UnifiedQuickMetrics metricsToShow={insightsMetrics} />
}
