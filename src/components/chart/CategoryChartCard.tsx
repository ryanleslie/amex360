
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TimeRangeSelector } from "@/components/chart/TimeRangeSelector"
import { CustomTooltip } from "@/components/chart/CustomTooltip"

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryChartCardProps {
  categoryData: CategoryData[];
  totalSpend: number;
  timeRange: string;
  timeRangeLabel: string;
  colors: string[];
  onTimeRangeChange: (timeRange: string) => void;
}

export function CategoryChartCard({ 
  categoryData, 
  totalSpend, 
  timeRange, 
  timeRangeLabel, 
  colors, 
  onTimeRangeChange 
}: CategoryChartCardProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 lg:col-span-3">
      <CardHeader className="flex flex-col space-y-4 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Spending by category</CardTitle>
          <CardDescription>
            Total spend {timeRangeLabel}: ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardDescription>
        </div>
        
        <TimeRangeSelector 
          timeRange={timeRange} 
          onTimeRangeChange={onTimeRangeChange} 
        />
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        <div className="h-[400px] w-full [&_.recharts-pie-sector]:!outline-none [&_.recharts-pie-sector]:focus:!outline-none [&_svg]:!outline-none [&_svg]:focus:!outline-none">
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
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
