
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
}

export function CategoryTransactionCardHeader({
  timeRange,
  selectedCategory
}: CategoryTransactionCardHeaderProps) {
  const hasFilter = selectedCategory && selectedCategory !== "all"

  const getShortTimeRangeFormat = (timeRange: string) => {
    if (timeRange === "YTD") return "YTD"
    if (timeRange === "Last 90 days") return "90d"
    if (timeRange === "Last 30 days") return "30d"
    if (timeRange === "Last 7 days") return "7d"
    return timeRange // fallback to original if no match
  }

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Transaction History</CardTitle>
          {hasFilter ? (
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                Filtered by: {getShortTimeRangeFormat(timeRange)}, {selectedCategory}
              </span>
            </div>
          ) : (
            <CardDescription>
              Recent transaction activity ({getShortTimeRangeFormat(timeRange)})
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
