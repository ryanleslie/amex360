
import React, { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MetricCard } from "@/components/metrics/MetricCard"
import { useMetricsData } from "@/utils/metricsData"

export function InsightsQuickMetrics() {
  const isMobile = useIsMobile()
  const [openSheet, setOpenSheet] = useState<string | null>(null)
  const metricsData = useMetricsData()

  return (
    <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-5">
      {metricsData.map((metric, index) => (
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
