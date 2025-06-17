
"use client"

import * as React from "react"
import { useCategorySpendingData } from "@/hooks/useCategorySpendingData"
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export const description = "A pie chart showing spending by category"

interface CategorySpendingChartProps {
  onDateClick?: (date: string) => void;
  selectedTimeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#ffb347",
  "#87ceeb",
  "#dda0dd",
  "#98fb98"
]

export function CategorySpendingChart({ 
  onDateClick, 
  selectedTimeRange = "ytd", 
  onTimeRangeChange 
}: CategorySpendingChartProps) {
  const [timeRange, setTimeRange] = React.useState(selectedTimeRange)

  React.useEffect(() => {
    setTimeRange(selectedTimeRange);
  }, [selectedTimeRange])

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    onTimeRangeChange?.(newTimeRange);
  };

  const { categoryData, totalSpend } = useCategorySpendingData(timeRange)

  const getTimeRangeLabel = () => {
    if (timeRange === "ytd") return "(YTD)"
    if (timeRange === "90d") return "(90d)"
    if (timeRange === "30d") return "(30d)"
    if (timeRange === "7d") return "(7d)"
    return "(90d)"
  }

  const chartConfig = categoryData.reduce((config, item, index) => {
    config[item.category] = {
      label: item.category,
      color: COLORS[index % COLORS.length]
    }
    return config
  }, {} as any)

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader className="flex flex-col space-y-4 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Spending by category</CardTitle>
          <CardDescription>
            Total spend {getTimeRangeLabel()}: ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardDescription>
        </div>
        
        <TimeRangeSelector 
          timeRange={timeRange} 
          onTimeRangeChange={handleTimeRangeChange} 
        />
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => 
                  `${category} ${(percent * 100).toFixed(1)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                      name
                    ]}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
