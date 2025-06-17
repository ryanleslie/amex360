
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  totalSpend: {
    label: "Total Spend",
    color: "hsl(var(--chart-1))",
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
      className="aspect-auto h-[400px] w-full"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
        onClick={handleChartClick}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Area
          dataKey="totalSpend"
          type="natural"
          fill="var(--color-totalSpend)"
          fillOpacity={0.4}
          stroke="var(--color-totalSpend)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
