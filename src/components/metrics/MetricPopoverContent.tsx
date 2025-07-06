
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
            const shouldHighlight = isClosingOrDueMetric && isNonBusinessCard
            
            return (
              <div 
                key={index} 
                className={`flex items-center gap-2 p-2 rounded ${
                  shouldHighlight ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                }`}
              >
                <img src={card.image} alt={card.name} className="w-8 h-5 object-cover rounded" />
                <div className="text-xs">
                  <div className={`font-medium ${shouldHighlight ? 'text-red-700' : ''}`}>
                    {card.name}
                  </div>
                  {card.lastFive && (
                    <div className={`${shouldHighlight ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {card.lastFive} • {card.amount} {card.type}
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
