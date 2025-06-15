
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateFilterIndicator } from "../transaction/DateFilterIndicator"
import { TimeRangeFilterIndicator } from "../transaction/TimeRangeFilterIndicator"
import { FilterState } from "@/hooks/useFilterState"
import { X } from "lucide-react"

interface RewardCardHeaderProps {
  selectedDate?: string
  onClearDateFilter?: () => void
  selectedTimeRange?: string
  onClearTimeRangeFilter?: () => void
  filters: FilterState
  onClearCardFilter?: () => void
}

export function RewardCardHeader({
  selectedDate,
  onClearDateFilter,
  selectedTimeRange,
  onClearTimeRangeFilter,
  filters,
  onClearCardFilter
}: RewardCardHeaderProps) {
  const getCardDisplayName = (cardName: string) => {
    return cardName.replace(/\b(card|Rewards)\b/gi, '').trim()
  }

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "ytd": return "YTD"
      case "90d": return "90d"
      case "30d": return "30d"
      case "7d": return "7d"
      default: return "YTD"
    }
  }

  const hasCardFilter = filters.selectedCard && filters.selectedCard !== "all"
  const hasTimeRangeFilter = selectedTimeRange && selectedTimeRange !== "ytd"
  const hasDateFilter = selectedDate

  // If there's a selected date and card filter, show combined filter
  if (hasDateFilter && hasCardFilter && onClearDateFilter && onClearCardFilter) {
    const cardDisplayName = getCardDisplayName(filters.selectedCard)
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
    
    const handleClearAll = () => {
      if (onClearDateFilter) onClearDateFilter()
      if (onClearCardFilter) onClearCardFilter()
    }

    return (
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Award history</CardTitle>
        <div className="mt-2">
          <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
            Filtered by: {formattedDate}, {cardDisplayName}
            <button 
              onClick={handleClearAll}
              className="hover:bg-gray-200 rounded p-0.5"
              title="Clear filters"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      </CardHeader>
    )
  }

  // If there's only a selected date, use the DateFilterIndicator component
  if (hasDateFilter && onClearDateFilter) {
    return (
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Award history</CardTitle>
        <DateFilterIndicator 
          selectedDate={selectedDate}
          onClear={onClearDateFilter}
        />
      </CardHeader>
    )
  }

  // Show unified filter indicator when card filter is active (with or without time range)
  if (hasCardFilter && onClearCardFilter) {
    const timeRangeLabel = getTimeRangeLabel(selectedTimeRange || "ytd")
    const cardDisplayName = getCardDisplayName(filters.selectedCard)
    
    const handleClearAll = () => {
      if (onClearCardFilter) onClearCardFilter()
      if (hasTimeRangeFilter && onClearTimeRangeFilter) onClearTimeRangeFilter()
    }

    return (
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Award history</CardTitle>
        <div className="mt-2">
          <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
            Filtered by: {timeRangeLabel}, {cardDisplayName}
            <button 
              onClick={handleClearAll}
              className="hover:bg-gray-200 rounded p-0.5"
              title="Clear filters"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      </CardHeader>
    )
  }

  // If there's only a time range filter (not YTD), use the TimeRangeFilterIndicator
  if (hasTimeRangeFilter && onClearTimeRangeFilter) {
    return (
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Award history</CardTitle>
        <TimeRangeFilterIndicator 
          timeRange={selectedTimeRange}
          onClear={onClearTimeRangeFilter}
        />
      </CardHeader>
    )
  }

  // Default state with no active filters
  return (
    <CardHeader className="pb-2">
      <CardTitle className="text-xl font-semibold">Award history</CardTitle>
      <CardDescription className="mb-0">
        Bonus points awarded (YTD)
      </CardDescription>
    </CardHeader>
  )
}
