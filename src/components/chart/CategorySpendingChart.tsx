
"use client"

import * as React from "react"
import { useCategorySpendingData } from "@/hooks/useCategorySpendingData"
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const description = "A donut chart showing spending breakdown by category"

interface CategorySpendingChartProps {
  onDateClick?: (date: string) => void;
  selectedTimeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
}

// Colors for the donut chart segments - deep blue palette
const COLORS = [
  '#012a4a', // Prussian blue
  '#013a63', // Indigo dye
  '#01497c', // Indigo dye (variant)
  '#014f86', // Indigo dye (variant 2)
  '#2a6f97', // UCLA blue
  '#2c7da0', // Cerulean
  '#468faf', // Air force blue
  '#61a5c2', // Air superiority blue
  '#89c2d9', // Sky blue
  '#a9d6e5', // Light blue
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

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
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius="90%"
                innerRadius="50%"
                fill="#8884d8"
                dataKey="amount"
                stroke="none"
                strokeWidth={0}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
