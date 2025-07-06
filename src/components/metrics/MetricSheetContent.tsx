
import React from "react"

interface MetricSheetContentProps {
  metric: any
}

export const MetricSheetContent = ({ metric }: MetricSheetContentProps) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{metric.title}</h3>
      <div className="text-3xl font-bold text-primary mt-2">{metric.value}</div>
    </div>
    <div className="space-y-3">
      <div>
        <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
        <p className="text-sm">{metric.description}</p>
      </div>
      
      {metric.cardData && (
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Account Details</h4>
          <div className="space-y-3">
            {metric.cardData.map((card: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img src={card.image} alt={card.name} className="w-12 h-8 object-cover rounded" />
                <div>
                  <div className="font-medium text-sm">{card.name}</div>
                  {card.lastFive && (
                    <div className="text-xs text-muted-foreground">
                      {card.lastFive} • {card.amount} {card.type}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="font-medium text-sm text-muted-foreground">Data Source</h4>
        <p className="text-sm">{metric.dataSource}</p>
      </div>
      <div>
        <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
        <p className="text-sm">{metric.lastUpdated}</p>
      </div>
      <div>
        <h4 className="font-medium text-sm text-muted-foreground">Calculation Method</h4>
        <p className="text-sm">{metric.calculationMethod}</p>
      </div>
    </div>
  </div>
)
