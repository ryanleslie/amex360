
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  totalSpend: {
    label: "Total Spend",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartDisplayProps {
  data: Array<{ date: string; totalSpend: number }>
  onDateClick?: (date: string) => void
}

export function ChartDisplay({ data, onDateClick }: ChartDisplayProps) {
  const handleChartClick = (chartData: any) => {
    if (chartData && chartData.activePayload && chartData.activePayload[0] && onDateClick) {
      const clickedDate = chartData.activePayload[0].payload.date;
      console.log("Chart clicked, date:", clickedDate);
      onDateClick(clickedDate);
    }
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={data} onClick={handleChartClick}>
        <defs>
          <linearGradient id="fillTotalSpend" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-totalSpend)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-totalSpend)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value + 'T00:00:00') // Add time to prevent timezone issues
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }}
        />
        <ChartTooltip
          cursor={false}
          defaultIndex={-1}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                const date = new Date(value + 'T00:00:00') // Add time to prevent timezone issues
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }}
              formatter={(value) => [
                `Total Spend: $${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                ""
              ]}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="totalSpend"
          type="monotone"
          fill="url(#fillTotalSpend)"
          stroke="#000000"
          strokeWidth={1}
        />
      </AreaChart>
    </ChartContainer>
  )
}
