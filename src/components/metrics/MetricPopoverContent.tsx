
import React from "react"

interface MetricPopoverContentProps {
  metric: any
}

export const MetricPopoverContent = ({ metric }: MetricPopoverContentProps) => {
  const isClosingMetric = metric.title === "Closing this week"
  const isNoAnnualFeeMetric = metric.title === "No Annual Fee"
  const isAnnualFeeMetric = metric.title === "Annual Fee" || metric.title === "Total Annual Fees"
  const isCreditLimitMetric = metric.title === "Highest Credit Limit" || metric.title === "Lowest Pay Over Time Limit"
  const isBrandPartnerMetric = metric.title === "Brand Partner Cards"
  
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
            // For Annual Fee cards, show amount as "annual fee" format
            // For Credit Limit cards, show amount as "preset limit" format
            // For Brand Partner cards, show amount as "preset limit • multiple" format
            let cardDescription
            if (isNoAnnualFeeMetric) {
              cardDescription = `${card.lastFive} • ${card.type.split('•')[1]?.trim() || card.type}`
            } else if (isAnnualFeeMetric) {
              cardDescription = `${card.lastFive} • ${card.amount} annual fee • ${card.type.split('•')[1]?.trim() || card.type.split('•')[0]?.trim()}`
            } else if (isCreditLimitMetric) {
              cardDescription = `${card.lastFive} • ${card.amount} ${card.type.replace(' • ', ' ')}`
            } else if (isBrandPartnerMetric) {
              cardDescription = `${card.lastFive} • ${card.amount} ${card.type.replace(' • ', ' ')}`
            } else {
              cardDescription = `${card.lastFive} • ${card.amount} • ${card.type}`
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
                    {shouldHighlightClosing ? (
                      <>
                        {card.lastFive} • {card.amount} • <span className="text-red-600 font-medium">{card.type}</span>
                      </>
                    ) : (
                      <span>{cardDescription}</span>
                    )}
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
