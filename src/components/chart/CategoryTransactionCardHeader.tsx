
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
  onClearTimeRangeFilter?: () => void
}

export function CategoryTransactionCardHeader({
  timeRange,
  selectedCategory,
  onClearFilter,
  onClearTimeRangeFilter
}: CategoryTransactionCardHeaderProps) {
  const hasFilter = selectedCategory && selectedCategory !== "all"

  const getTimeRangeShort = (range: string) => {
    if (range === "YTD") return "YTD"
    if (range === "Last 90 days") return "90d"
    if (range === "Last 30 days") return "30d"
    if (range === "Last 7 days") return "7d"
    return range
  }

  // Check if time range should show as a filter (not YTD)
  const shouldShowTimeRangeFilter = timeRange !== "YTD"

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Transaction History</CardTitle>
          
          {/* Show filters if any are active */}
          {(shouldShowTimeRangeFilter || hasFilter) ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Time range filter */}
              {shouldShowTimeRangeFilter && (
                <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                  Filtered by: {getTimeRangeShort(timeRange)}
                  {onClearTimeRangeFilter && (
                    <button 
                      onClick={onClearTimeRangeFilter}
                      className="hover:bg-gray-200 rounded p-0.5"
                      title="Clear time range filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              )}
              
              {/* Category filter */}
              {hasFilter && (
                <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                  Category: {selectedCategory}
                  {onClearFilter && (
                    <button 
                      onClick={onClearFilter}
                      className="hover:bg-gray-200 rounded p-0.5"
                      title="Clear category filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              )}
            </div>
          ) : (
            <CardDescription>
              Recent transaction activity ({getTimeRangeShort(timeRange)})
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
