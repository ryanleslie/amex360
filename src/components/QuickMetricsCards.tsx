
import React from "react"
import { UnifiedQuickMetrics } from "@/components/UnifiedQuickMetrics"

export function QuickMetricsCards() {
  const dashboardMetrics = [
    "Active Card Accounts",
    "Highest Credit Limit",
    "Lowest Pay Over Time Limit",
    "Available Line of Credit",
    "Brand Partner Cards"
  ]

  return <UnifiedQuickMetrics metricsToShow={dashboardMetrics} />
}
