
import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  spending: {
    label: "Spending",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface CategoryChartDisplayProps {
  data: Array<{ category: string; spending: number }>
  onDateClick?: (date: string) => void
}

// Define colors for the donut chart segments
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
]

export function CategoryChartDisplay({ data, onDateClick }: CategoryChartDisplayProps) {
  const handleChartClick = (entry: any) => {
    if (entry && onDateClick) {
      console.log("Chart clicked, category:", entry.category);
      onDateClick(entry.category);
    }
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="spending"
            onClick={handleChartClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Category: ${value}`}
                formatter={(value, name, props) => [
                  `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  "Spending"
                ]}
                indicator="dot"
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
