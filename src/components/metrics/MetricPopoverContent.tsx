
import React from "react"

interface MetricPopoverContentProps {
  metric: any
}

export const MetricPopoverContent = ({ metric }: MetricPopoverContentProps) => {
  const isClosingMetric = metric.title === "Closing this week"
  const isDueThisWeekMetric = metric.title === "Due this week"
  const isNoAnnualFeeMetric = metric.title === "No Annual Fee"
  const isAnnualFeeMetric = metric.title === "Annual Fee" || metric.title === "Total Annual Fees"
  const isCreditLimitMetric = metric.title === "Highest Credit Limit" || metric.title === "Lowest Pay Over Time Limit"
  const isBrandPartnerMetric = metric.title === "Brand Partner Cards"
  const isAvailableCreditMetric = metric.title === "Available Line of Credit"
  
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
            
            // Format card details based on metric type
            let cardDetails
            if (isNoAnnualFeeMetric) {
              cardDetails = card.type.split('•')[1]?.trim() || card.type
            } else if (isAnnualFeeMetric) {
              cardDetails = `${card.amount} annual fee • ${card.type.split('•')[1]?.trim() || card.type.split('•')[0]?.trim()}`
            } else if (isCreditLimitMetric) {
              cardDetails = `${card.amount} ${card.type.replace(' • ', ' ')}`
            } else if (isBrandPartnerMetric) {
              cardDetails = `${card.amount} ${card.type}`
            } else if (isAvailableCreditMetric) {
              cardDetails = `${card.amount} ${card.type}`
            } else if (isClosingMetric || isDueThisWeekMetric) {
              cardDetails = `${card.amount} balance • ${card.type}`
            } else {
              cardDetails = `${card.amount} • ${card.type}`
            }
            
            return (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <img src={card.image} alt={card.name} className="w-8 h-5 object-cover rounded" />
                <div className="text-xs">
                  <div className="font-medium">
                    {card.name} ({card.lastFive})
                  </div>
                  <div className="text-muted-foreground">
                    {shouldHighlightClosing ? (
                      <>
                        {card.amount} balance • <span className="text-red-600 font-medium">{card.type}</span>
                      </>
                    ) : (
                      <span>{cardDetails}</span>
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
