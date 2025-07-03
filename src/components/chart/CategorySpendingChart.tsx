
"use client"

import * as React from "react"
import { useCategorySpendingData } from "@/hooks/useCategorySpendingData"
import { CategoryChartCard } from "@/components/chart/CategoryChartCard"
import { CategoryTable } from "@/components/chart/CategoryTable"
import { CategoryTransactionCard } from "@/components/chart/CategoryTransactionCard"

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
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")

  React.useEffect(() => {
    setTimeRange(selectedTimeRange);
  }, [selectedTimeRange])

  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    onTimeRangeChange?.(newTimeRange);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "all" : category)
  }

  const { categoryData, totalSpend } = useCategorySpendingData(timeRange)

  const getTimeRangeLabel = () => {
    if (timeRange === "ytd") return "(YTD)"
    if (timeRange === "90d") return "(90d)"
    if (timeRange === "30d") return "(30d)"
    if (timeRange === "7d") return "(7d)"
    return "(90d)"
  }

  const timeRangeLabel = getTimeRangeLabel()

  // Get all unique categories for the dropdown (including "Uncategorized" if it exists)
  const allCategories = React.useMemo(() => {
    const categories = categoryData.map(item => item.category)
    return categories
  }, [categoryData])

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
      
      <CategoryTransactionCard
        timeRange={timeRange}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={allCategories}
      />
    </div>
  )
}
