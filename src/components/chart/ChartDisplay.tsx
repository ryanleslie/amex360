
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

interface ChartDisplayProps {
  data: Array<{ category: string; spending: number }>
  onDateClick?: (date: string) => void
}

export function ChartDisplay({ data, onDateClick }: ChartDisplayProps) {
  const handleChartClick = (chartData: any) => {
    if (chartData && chartData.activePayload && chartData.activePayload[0] && onDateClick) {
      const clickedCategory = chartData.activePayload[0].payload.category;
      console.log("Chart clicked, category:", clickedCategory);
      onDateClick(clickedCategory);
    }
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[400px] w-full"
    >
      <BarChart data={data} onClick={handleChartClick} margin={{ bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Category: ${value}`}
              formatter={(value) => [
                `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                "Spending"
              ]}
              indicator="dot"
            />
          }
        />
        <Bar
          dataKey="spending"
          fill="var(--color-spending)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
