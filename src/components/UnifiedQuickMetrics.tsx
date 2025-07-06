
import React, { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MetricCard } from "@/components/metrics/MetricCard"
import { useUnifiedMetricsData } from "@/utils/unifiedMetricsData"

interface UnifiedQuickMetricsProps {
  metricsToShow: string[]
}

export function UnifiedQuickMetrics({ metricsToShow }: UnifiedQuickMetricsProps) {
  const isMobile = useIsMobile()
  const [openSheet, setOpenSheet] = useState<string | null>(null)
  const allMetricsData = useUnifiedMetricsData()

  // Filter and order metrics based on the metricsToShow array
  const displayMetrics = metricsToShow
    .map(metricKey => allMetricsData[metricKey])
    .filter(Boolean) // Remove any undefined metrics

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
