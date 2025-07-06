
import React from "react"

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
                  {card.lastFive && (
                    <div className="text-muted-foreground">
                      {card.lastFive} • {card.amount} • <span className={shouldHighlightDate ? 'text-red-600 font-medium' : ''}>{card.type}</span>
                    </div>
                  )}
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
