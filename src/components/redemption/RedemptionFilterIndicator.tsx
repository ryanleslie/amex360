
import { X } from "lucide-react"

interface RedemptionFilterIndicatorProps {
  hasAnyFilter: boolean
  getFilterDisplayText: () => string
  onClearAllFilters: () => void
}

export function RedemptionFilterIndicator({
  hasAnyFilter,
  getFilterDisplayText,
  onClearAllFilters
}: RedemptionFilterIndicatorProps) {
  if (!hasAnyFilter) return null

  const filterText = getFilterDisplayText()

  return (
    <div className="mt-2">
      <span className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
        Filtered by: {filterText}
        <button 
          onClick={onClearAllFilters}
          className="hover:bg-gray-200 rounded p-0.5"
          title="Clear all filters"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    </div>
  )
}
