
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

  const getShortTimeRange = (timeRange: string) => {
    if (timeRange.toLowerCase().includes('ytd')) return 'YTD'
    if (timeRange.toLowerCase().includes('90')) return '90d'
    if (timeRange.toLowerCase().includes('30')) return '30d'
    if (timeRange.toLowerCase().includes('7')) return '7d'
    return timeRange
  }

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Transaction History</CardTitle>
          {hasFilter ? (
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                Filtered by: {getShortTimeRange(timeRange)}, {selectedCategory}
              </span>
            </div>
          ) : (
            <CardDescription>
              Recent transaction activity ({getShortTimeRange(timeRange)})
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
