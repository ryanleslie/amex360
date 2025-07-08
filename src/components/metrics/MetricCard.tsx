
import React from "react"
import { Card } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Info } from "lucide-react"
import { useCountUp } from "@/hooks/useCountUp"
import { MetricPopoverContent } from "./MetricPopoverContent"
import { MetricSheetContent } from "./MetricSheetContent"

interface MetricCardProps {
  metric: any
  isMobile: boolean
  openSheet: string | null
  setOpenSheet: (value: string | null) => void
}

export const MetricCard = ({ metric, isMobile, openSheet, setOpenSheet }: MetricCardProps) => {
  // Check if this is a balance metric that should be animated
  const isBalanceMetric = metric.title === "Urgent Balances" || 
                         metric.title === "Highest Balance" || 
                         metric.title === "Lowest Balance"
  
  // Extract numeric value for count up animation
  const numericValue = isBalanceMetric ? 
    parseFloat(metric.value.replace(/[$,]/g, '')) : 0
  
  const animatedValue = useCountUp({ 
    end: numericValue, 
    duration: 1000,
    decimals: 0 
  })
  
  // Format the animated value back to currency
  const displayValue = isBalanceMetric ? 
    `$${animatedValue.toLocaleString()}` : 
    metric.value

  const cardContent = (
    <Card className="p-4 bg-gradient-to-b from-white to-gray-100 relative group cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-1">
        <div className="text-2xl font-semibold text-gray-900">
          {displayValue}
        </div>
        <div className="text-sm font-medium text-gray-600">
          {metric.title}
        </div>
      </div>
      <Info className="absolute top-2 right-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  )

  if (isMobile) {
    return (
      <Sheet key={metric.title} open={openSheet === metric.title} onOpenChange={(open) => setOpenSheet(open ? metric.title : null)}>
        <SheetTrigger asChild>
          {cardContent}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto max-h-[80vh]">
          <MetricSheetContent metric={metric} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover key={metric.title}>
      <PopoverTrigger asChild>
        {cardContent}
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-auto min-w-[8rem]">
        <MetricPopoverContent metric={metric} />
      </PopoverContent>
    </Popover>
  )
}
