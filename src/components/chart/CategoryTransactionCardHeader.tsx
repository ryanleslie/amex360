
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
  const isYTD = timeRange === "YTD"

  const getTimeRangeShort = () => {
    if (timeRange === "YTD") return "YTD"
    if (timeRange === "Last 90 days") return "90d"
    if (timeRange === "Last 30 days") return "30d"
    if (timeRange === "Last 7 days") return "7d"
    return timeRange
  }

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Transaction History</CardTitle>
          {!isYTD ? (
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                Filtered by: {getTimeRangeShort()}{hasFilter && `, ${selectedCategory}`}
                {onClearTimeRangeFilter && (
                  <button 
                    onClick={onClearTimeRangeFilter}
                    className="hover:bg-gray-200 rounded p-0.5"
                    title="Clear time range filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                {hasFilter && onClearFilter && (
                  <button 
                    onClick={onClearFilter}
                    className="hover:bg-gray-200 rounded p-0.5 ml-1"
                    title="Clear category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            </div>
          ) : (
            <CardDescription>
              Recent transaction activity (YTD)
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
