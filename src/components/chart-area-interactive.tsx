
"use client"

import * as React from "react"
import { useChartData } from "@/hooks/useChartData"
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector"
import { ChartDisplay } from "@/components/chart/ChartDisplay"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const description = "An interactive area chart showing daily spending"

interface ChartAreaInteractiveProps {
  onDateClick?: (date: string) => void;
  selectedTimeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
}

export function ChartAreaInteractive({ 
  onDateClick, 
  selectedTimeRange = "ytd", 
  onTimeRangeChange 
}: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState(selectedTimeRange)

  React.useEffect(() => {
    setTimeRange(selectedTimeRange);
  }, [selectedTimeRange])

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    onTimeRangeChange?.(newTimeRange);
  };

  const { filteredData, averageDailySpend } = useChartData(timeRange)

  const getTimeRangeLabel = () => {
    if (timeRange === "ytd") return "(YTD)"
    if (timeRange === "90d") return "(90d)"
    if (timeRange === "30d") return "(30d)"
    if (timeRange === "7d") return "(7d)"
    return "(90d)"
  }

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader className="flex flex-col space-y-4 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Daily Spend by Time Period</CardTitle>
          <CardDescription>
            Average daily spend {getTimeRangeLabel()}: ${averageDailySpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardDescription>
        </div>
        
        <TimeRangeSelector 
          timeRange={timeRange} 
          onTimeRangeChange={handleTimeRangeChange} 
        />
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        <ChartDisplay data={filteredData} onDateClick={onDateClick} />
      </CardContent>
    </Card>
  )
}
