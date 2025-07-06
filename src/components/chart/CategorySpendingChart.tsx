
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
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")

  const handleTimeRangeChange = (newTimeRange: string) => {
    console.log("CategorySpendingChart: Time range changing to:", newTimeRange)
    onTimeRangeChange?.(newTimeRange);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "all" : category)
  }

  const { categoryData, totalSpend } = useCategorySpendingData(selectedTimeRange)

  const getTimeRangeLabel = () => {
    if (selectedTimeRange === "ytd") return "(YTD)"
    if (selectedTimeRange === "90d") return "(90d)"
    if (selectedTimeRange === "30d") return "(30d)"
    if (selectedTimeRange === "7d") return "(7d)"
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 lg:px-6">
        <CategoryChartCard
          categoryData={categoryData}
          totalSpend={totalSpend}
          timeRange={selectedTimeRange}
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
      
      <div className="px-4 lg:px-6">
        <CategoryTransactionCard
          timeRange={selectedTimeRange}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onTimeRangeChange={handleTimeRangeChange}
          categories={allCategories}
        />
      </div>
    </div>
  )
}
