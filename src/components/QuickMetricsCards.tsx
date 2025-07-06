
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function QuickMetricsCards() {
  const dashboardMetrics = [
    "Active Card Accounts",
    "Total Current Balance",
    "Total Annual Fees",
    "Highest Credit Limit",
    "Available Line of Credit"
  ]

  return <UnifiedQuickMetrics metricsToShow={dashboardMetrics} />
}
