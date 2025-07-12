
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function QuickMetricsCards() {
  const dashboardMetrics = [
    "Active Card Accounts",
    "Total Annual Fees",
    "Total Pay Over Time Limit",
    "Total Preset Credit Limit",
    "Available Line of Credit"
  ]

  return <UnifiedQuickMetrics metricsToShow={dashboardMetrics} />
}
