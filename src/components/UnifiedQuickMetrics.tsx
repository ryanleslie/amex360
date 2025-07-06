
import React, { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MetricCard } from "@/components/metrics/MetricCard"
import { useUnifiedMetricsData } from "@/utils/unifiedMetricsData"
import { useCardBalances } from "@/hooks/useCardBalances"

interface UnifiedQuickMetricsProps {
  metricsToShow: string[]
}

export function UnifiedQuickMetrics({ metricsToShow }: UnifiedQuickMetricsProps) {
  const isMobile = useIsMobile()
  const [openSheet, setOpenSheet] = useState<string | null>(null)
  const { cardBalances, loading, error } = useCardBalances()
  const allMetricsData = useUnifiedMetricsData(cardBalances)

  // Filter and order metrics based on the metricsToShow array
  const displayMetrics = metricsToShow
    .map(metricKey => allMetricsData[metricKey])
    .filter(Boolean) // Remove any undefined metrics

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-5">
        {metricsToShow.map((_, index) => (
          <div key={index} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    console.error('Error loading card balances:', error)
    // Still render metrics with default values
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-5">
      {displayMetrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          metric={metric}
          isMobile={isMobile}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
        />
      ))}
    </div>
  )
}
