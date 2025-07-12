
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function QuickMetricsCards() {
  const dashboardMetrics = [
    "Active Card Accounts",
    "Total Annual Fees",
    "Total Preset Credit Limit",
    "Total Pay Over Time Limit",
    "Available Line of Credit"
  ]

  return <UnifiedQuickMetrics metricsToShow={dashboardMetrics} />
}
