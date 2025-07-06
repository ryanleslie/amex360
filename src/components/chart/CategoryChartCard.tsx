
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
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
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string;
}

export function CategoryChartCard({ 
  categoryData, 
  totalSpend, 
  timeRange, 
  timeRangeLabel, 
  colors, 
  onTimeRangeChange,
  onCategoryClick,
  selectedCategory
}: CategoryChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof SVGElement) {
        e.target.blur();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof SVGElement) {
        e.preventDefault();
      }
    };

    const chartContainer = chartRef.current;
    if (chartContainer) {
      chartContainer.addEventListener('focusout', handleFocusOut);
      chartContainer.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('focusout', handleFocusOut);
        chartContainer.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []);

  const handlePieClick = (data: any, index: number) => {
    if (onCategoryClick) {
      onCategoryClick(data.category)
    }
  }

  // Responsive chart configuration
  const getChartConfig = () => {
    if (isMobile) {
      return {
        outerRadius: "70%",
        innerRadius: "40%",
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      };
    }
    return {
      outerRadius: "90%",
      innerRadius: "50%",
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    };
  };

  const chartConfig = getChartConfig();

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-col space-y-4 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0 px-4 md:px-6">
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

      <CardContent className="px-2 md:px-4 lg:px-6">
        <div className="w-full aspect-square max-h-[300px] md:max-h-[350px] lg:max-h-[400px]" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={chartConfig.margin}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={chartConfig.outerRadius}
                innerRadius={chartConfig.innerRadius}
                fill="#8884d8"
                dataKey="amount"
                stroke="none"
                strokeWidth={0}
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]}
                    stroke={selectedCategory === entry.category ? "#000" : "none"}
                    strokeWidth={selectedCategory === entry.category ? 2 : 0}
                  />
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
