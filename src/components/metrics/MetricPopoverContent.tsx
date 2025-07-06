
import React from "react"
import { cardBalanceService } from "@/services/cardBalanceService"

interface MetricPopoverContentProps {
  metric: any
}

export const MetricPopoverContent = ({ metric }: MetricPopoverContentProps) => {
  const isClosingOrDueMetric = metric.title === "Closing this week" || metric.title === "Due this week"
  
  return (
    <div className="space-y-3">
      <div className="font-medium text-sm">{metric.title}</div>
      <div className="text-sm text-muted-foreground">{metric.description}</div>
      
      {metric.cardData && (
        <div className="space-y-2">
          <div className="text-xs font-medium">Account Details:</div>
          {metric.cardData.map((card: any, index: number) => {
            const isNonBusinessCard = !card.name.toLowerCase().includes('business')
            const shouldHighlightDate = isClosingOrDueMetric && isNonBusinessCard
            
            // Get card balance for closing/due metrics
            let balanceText = card.amount
            if (isClosingOrDueMetric && card.cardType) {
              const balance = cardBalanceService.formatBalance(card.cardType)
              const dateText = card.amount // This contains "Closing/Due [Month] [Day]"
              balanceText = `${card.lastFive} • ${balance} • ${dateText}`
            }
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <img src={card.image} alt={card.name} className="w-8 h-5 object-cover rounded" />
                <div className="text-xs">
                  <div className="font-medium">
                    {card.name}
                  </div>
                  <div className="text-muted-foreground">
                    <span className={shouldHighlightDate ? 'text-red-600 font-medium' : ''}>{balanceText}</span> {card.type}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      <div className="text-xs space-y-1 pt-2 border-t">
        <div><span className="font-medium">Source:</span> {metric.dataSource}</div>
        <div><span className="font-medium">Updated:</span> {metric.lastUpdated}</div>
        <div><span className="font-medium">Method:</span> {metric.calculationMethod}</div>
      </div>
    </div>
  )
}
