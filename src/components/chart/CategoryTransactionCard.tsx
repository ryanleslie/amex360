
import * as React from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { CategoryTransactionCardHeader } from "./CategoryTransactionCardHeader"
import { CategoryTransactionCardControls } from "./CategoryTransactionCardControls"
import { CategoryTransactionTable } from "./CategoryTransactionTable"
import { useCategoryTransactionData } from "@/hooks/useCategoryTransactionData"

interface CategoryTransactionCardProps {
  timeRange: string
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  categories: string[]
}

export function CategoryTransactionCard({ 
  timeRange,
  selectedCategory,
  onCategoryChange,
  categories
}: CategoryTransactionCardProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  // Get filtered transactions based on time range and selected category
  const transactions = useCategoryTransactionData(timeRange, selectedCategory === "all" ? undefined : selectedCategory)

  const getTimeRangeLabel = () => {
    if (timeRange === "ytd") return "YTD"
    if (timeRange === "90d") return "Last 90 days"
    if (timeRange === "30d") return "Last 30 days"
    if (timeRange === "7d") return "Last 7 days"
    return "90 days"
  }

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CategoryTransactionCardHeader
        timeRange={getTimeRangeLabel()}
        selectedCategory={selectedCategory}
      />
      <CardContent>
        <div className="w-full">
          <CategoryTransactionCardControls
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            selectedCategory={selectedCategory || "all"}
            categories={categories}
            onCategoryChange={onCategoryChange || (() => {})}
          />
          <CategoryTransactionTable
            transactions={transactions}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
          />
        </div>
      </CardContent>
    </Card>
  )
}
