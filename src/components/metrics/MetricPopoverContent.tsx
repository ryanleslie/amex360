
import React from "react"

interface MetricPopoverContentProps {
  metric: any
}

export const MetricPopoverContent = ({ metric }: MetricPopoverContentProps) => {
  const isClosingMetric = metric.title === "Closing this week"
  const isNoAnnualFeeMetric = metric.title === "No Annual Fee"
  
  return (
    <div className="space-y-3">
      <div className="font-medium text-sm">{metric.title}</div>
      <div className="text-sm text-muted-foreground">{metric.description}</div>
      
      {metric.cardData && (
        <div className="space-y-2">
          <div className="text-xs font-medium">Account Details:</div>
          {metric.cardData.map((card: any, index: number) => {
            const isNonBusinessCard = !card.name.toLowerCase().includes('business')
            const shouldHighlightClosing = isClosingMetric && isNonBusinessCard && card.type.includes('closing')
            
            // For No Annual Fee cards, show only last five and APR
            const cardDescription = isNoAnnualFeeMetric 
              ? `${card.lastFive} • ${card.type.split('•')[1]?.trim() || card.type}`
              : `${card.lastFive} • ${card.amount} • ${card.type}`
            
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
                    <span className={shouldHighlightClosing ? 'text-red-600 font-medium' : ''}>
                      {cardDescription}
                    </span>
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
