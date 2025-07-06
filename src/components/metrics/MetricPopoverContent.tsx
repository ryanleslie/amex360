
import React from "react"

interface MetricPopoverContentProps {
  metric: any
}

export const MetricPopoverContent = ({ metric }: MetricPopoverContentProps) => {
  const isClosingMetric = metric.title === "Closing this week"
  
  return (
    <div className="space-y-3">
      <div className="font-medium text-sm">{metric.title}</div>
      <div className="text-sm text-muted-foreground">{metric.description}</div>
      
      {metric.cardData && (
        <div className="space-y-2">
          <div className="text-xs font-medium">Account Details:</div>
          {metric.cardData.map((card: any, index: number) => {
            const isNonBusinessCard = !card.name.toLowerCase().includes('business')
            const shouldHighlightDate = isClosingMetric && isNonBusinessCard
            
            return (
              <div 
                key={index} 
                className="flex flex-col gap-1 p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <img src={card.image} alt={card.name} className="w-8 h-5 object-cover rounded" />
                  <div className="text-xs font-medium">
                    {card.name}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-10">
                  {card.lastFive} • {card.balance} • <span className={shouldHighlightDate ? 'text-red-600 font-medium' : ''}>{card.dateInfo}</span>
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
