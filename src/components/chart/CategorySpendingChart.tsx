
"use client"

import * as React from "react"
import { useCategorySpendingData } from "@/hooks/useCategorySpendingData"
import { useCategoryTransactionData } from "@/hooks/useCategoryTransactionData"
import { CategoryChartCard } from "@/components/chart/CategoryChartCard"
import { CategoryTable } from "@/components/chart/CategoryTable"
import { CategoryTransactionTable } from "@/components/chart/CategoryTransactionTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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

export function CategorySpendingChart({ 
  onDateClick, 
  selectedTimeRange = "ytd", 
  onTimeRangeChange 
}: CategorySpendingChartProps) {
  const [timeRange, setTimeRange] = React.useState(selectedTimeRange)
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined)
  const [globalFilter, setGlobalFilter] = React.useState("")

  React.useEffect(() => {
    setTimeRange(selectedTimeRange);
  }, [selectedTimeRange])

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    onTimeRangeChange?.(newTimeRange);
    // Clear category selection when time range changes
    setSelectedCategory(undefined);
  };

  const handleCategoryClick = (category: string) => {
    // Toggle category selection
    setSelectedCategory(prev => prev === category ? undefined : category);
  };

  const { categoryData, totalSpend } = useCategorySpendingData(timeRange)
  const transactionData = useCategoryTransactionData(timeRange, selectedCategory)

  const getTimeRangeLabel = () => {
    if (timeRange === "ytd") return "(YTD)"
    if (timeRange === "90d") return "(90d)"
    if (timeRange === "30d") return "(30d)"
    if (timeRange === "7d") return "(7d)"
    return "(90d)"
  }

  const timeRangeLabel = getTimeRangeLabel()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <CategoryChartCard
          categoryData={categoryData}
          totalSpend={totalSpend}
          timeRange={timeRange}
          timeRangeLabel={timeRangeLabel}
          colors={COLORS}
          onTimeRangeChange={handleTimeRangeChange}
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
        
        <CategoryTable
          categoryData={categoryData}
          colors={COLORS}
          timeRangeLabel={timeRangeLabel}
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
      </div>
      
      <Card className="bg-gradient-to-b from-white to-gray-100">
        <CardHeader className="flex flex-col space-y-4 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">
              Category Transactions
              {selectedCategory && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  - {selectedCategory}
                </span>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedCategory 
                ? `Transactions for ${selectedCategory} ${timeRangeLabel}`
                : `All transactions ${timeRangeLabel}`
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search transactions..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(undefined)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Clear Filter
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CategoryTransactionTable
            transactions={transactionData}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
        </CardContent>
      </Card>
    </div>
  )
}
