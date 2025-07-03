
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

  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Recent transaction activity
          </CardDescription>
          {hasFilter && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                Filtered by: {timeRange}, {selectedCategory}
              </span>
            </div>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
