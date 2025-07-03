
import * as React from "react"
import { Button } from "@/components/ui/button"

interface TimeRangeSelectorProps {
  selectedTimeRange: string
  onTimeRangeChange: (timeRange: string) => void
}

export function TimeRangeSelector({ selectedTimeRange, onTimeRangeChange }: TimeRangeSelectorProps) {
  const timeRanges = [
    { value: "ytd", label: "YTD" },
    { value: "90d", label: "90d" },
    { value: "30d", label: "30d" },
    { value: "7d", label: "7d" }
  ]

  return (
    <div className="flex gap-2">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={selectedTimeRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeRangeChange(range.value)}
          className="text-xs"
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
