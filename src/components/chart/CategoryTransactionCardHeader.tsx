
import * as React from "react"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { X } from "lucide-react"

interface CategoryTransactionCardHeaderProps {
  timeRange: string
  selectedCategory?: string
  onClearFilter?: () => void
  selectedTimeRange?: string
  onClearTimeRangeFilter?: () => void
  totalAmount: number
  transactionCount: number
}

export function CategoryTransactionCardHeader({
  timeRange,
  selectedCategory,
  onClearFilter,
  selectedTimeRange,
  onClearTimeRangeFilter,
  totalAmount,
  transactionCount
}: CategoryTransactionCardHeaderProps) {
  const hasFilter = selectedCategory && selectedCategory !== "all"
  const hasTimeRangeFilter = selectedTimeRange && selectedTimeRange !== "ytd"

  const getTimeRangeShort = () => {
    if (timeRange === "YTD") return "YTD"
    if (timeRange === "Last 90 days") return "90d"
    if (timeRange === "Last 30 days") return "30d"
    if (timeRange === "Last 7 days") return "7d"
    return timeRange
  }

  const getCombinedFilterLabel = () => {
    const parts = []
    
    // Add time range if not YTD
    if (hasTimeRangeFilter) {
      parts.push(getTimeRangeShort())
    }
    
    // Add category filter if present
    if (hasFilter) {
      parts.push(selectedCategory)
    }
    
    return parts.join(", ")
  }

  const handleClearAllFilters = () => {
    if (hasTimeRangeFilter && onClearTimeRangeFilter) {
      onClearTimeRangeFilter()
    }
    if (hasFilter && onClearFilter) {
      onClearFilter()
    }
  }

  const hasActiveFilter = hasFilter || hasTimeRangeFilter

  return (
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">Transactions by category</CardTitle>
          {hasActiveFilter ? (
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                Filtered by: {getCombinedFilterLabel()}
                <button 
                  onClick={handleClearAllFilters}
                  className="hover:bg-gray-200 rounded p-0.5"
                  title="Clear filters"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          ) : (
            <CardDescription>
              Recent transaction activity ({getTimeRangeShort()})
            </CardDescription>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-500">
            spent on {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </CardHeader>
  )
}
