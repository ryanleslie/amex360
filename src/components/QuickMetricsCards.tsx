
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function QuickMetricsCards() {
  const dashboardMetrics = [
    "Total Annual Fees",
    "Active Card Accounts",
    "Highest Credit Limit",
    "Lowest Pay Over Time Limit",
    "Available Line of Credit"
  ]

  return <UnifiedQuickMetrics metricsToShow={dashboardMetrics} />
}
