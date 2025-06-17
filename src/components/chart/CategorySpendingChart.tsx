
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
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

export const description = "A donut chart showing spending breakdown by category"

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

interface CategorySpendingChartProps {
  onDateClick?: (date: string) => void;
  selectedTimeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export function CategorySpendingChart({ 
  onDateClick, 
  selectedTimeRange = "ytd", 
  onTimeRangeChange 
}: CategorySpendingChartProps) {
  const [timeRange, setTimeRange] = React.useState(selectedTimeRange)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setTimeRange(selectedTimeRange);
  }, [selectedTimeRange])

  // Animation effect to indicate scrollable content
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const animateScroll = () => {
      // Small bounce animation to indicate scrollability
      container.scrollTo({ top: 20, behavior: 'smooth' });
      setTimeout(() => {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    };

    // Start animation after a short delay
    const timer = setTimeout(animateScroll, 1500);

    return () => clearTimeout(timer);
  }, [timeRange]); // Re-run when time range changes

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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Donut Chart Card - Takes 3/5 of the width */}
      <Card className="bg-gradient-to-b from-white to-gray-100 lg:col-span-3">
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

      {/* Category Table Card - Takes 2/5 of the width */}
      <Card className="bg-gradient-to-b from-white to-gray-100 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Category Breakdown</CardTitle>
          <CardDescription>
            Detailed spending by category {getTimeRangeLabel()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border relative">
            <style>
              {`
                .scroll-container {
                  scrollbar-width: thin;
                  scrollbar-color: transparent transparent;
                  scroll-behavior: smooth;
                }
                .scroll-container:hover {
                  scrollbar-color: #d1d5db transparent;
                }
                .scroll-container::-webkit-scrollbar {
                  width: 6px;
                }
                .scroll-container::-webkit-scrollbar-track {
                  background: transparent;
                }
                .scroll-container::-webkit-scrollbar-thumb {
                  background-color: transparent;
                  border-radius: 20px;
                  transition: background-color 0.2s ease;
                }
                .scroll-container:hover::-webkit-scrollbar-thumb {
                  background-color: #d1d5db;
                }
                .scroll-indicator {
                  position: absolute;
                  right: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                  pointer-events: none;
                  opacity: 0.6;
                  animation: bounce 2s infinite;
                  z-index: 10;
                }
                @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% {
                    transform: translateY(-50%);
                  }
                  40% {
                    transform: translateY(-40%);
                  }
                  60% {
                    transform: translateY(-60%);
                  }
                }
              `}
            </style>
            <div 
              ref={scrollContainerRef}
              className="scroll-container overflow-y-auto max-h-96"
            >
              <Table>
                <TableBody>
                  {categoryData?.length ? (
                    categoryData.map((category, index) => (
                      <TableRow key={category.category} className="h-11">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{category.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{category.percentage}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center"
                      >
                        No data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Scroll indicator - only show if there are more than 8 categories */}
            {categoryData?.length > 8 && (
              <div className="scroll-indicator">
                <div className="w-2 h-4 bg-gray-400 rounded-full opacity-50" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
