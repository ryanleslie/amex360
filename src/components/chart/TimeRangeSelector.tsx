
import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAvailableTimeRanges } from "@/hooks/useAvailableTimeRanges"
import { SwapTransaction } from "@/utils/swapParser"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface TimeRangeSelectorProps {
  timeRange: string
  onTimeRangeChange: (timeRange: string) => void
  swapTransactions?: SwapTransaction[]
}

export function TimeRangeSelector({ timeRange, onTimeRangeChange, swapTransactions }: TimeRangeSelectorProps) {
  const isMobile = useIsMobile()
  const availableRanges = useAvailableTimeRanges(swapTransactions)

  const handleTimeRangeChange = (newTimeRange: string) => {
    onTimeRangeChange(newTimeRange)
  }

  // If no ranges are available, don't render the component
  if (availableRanges.length === 0) {
    return null
  }

  // If current time range is not available, switch to YTD (which should always be available if component renders)
  React.useEffect(() => {
    if (!availableRanges.includes(timeRange) && availableRanges.includes("ytd")) {
      onTimeRangeChange("ytd")
    }
  }, [availableRanges, timeRange, onTimeRangeChange])

  const getTimeRangeOptions = () => {
    const options = []
    
    if (availableRanges.includes("ytd")) {
      options.push({ value: "ytd", label: "YTD" })
    }
    if (availableRanges.includes("90d")) {
      options.push({ value: "90d", label: "Last 90 days" })
    }
    if (availableRanges.includes("30d")) {
      options.push({ value: "30d", label: "Last 30 days" })
    }
    if (availableRanges.includes("7d")) {
      options.push({ value: "7d", label: "Last 7 days" })
    }
    
    return options
  }

  const options = getTimeRangeOptions()

  return (
    <div className="flex justify-start md:justify-end">
      <ToggleGroup
        type="single"
        value={timeRange}
        onValueChange={handleTimeRangeChange}
        variant="outline"
        className="hidden *:data-[slot=toggle-group-item]:!px-4 md:flex"
      >
        {options.map(option => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Select value={timeRange} onValueChange={handleTimeRangeChange}>
        <SelectTrigger
          className="flex w-40 md:hidden"
          aria-label="Select a value"
        >
          <SelectValue placeholder="YTD" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} className="rounded-lg">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
