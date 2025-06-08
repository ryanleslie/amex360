
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Info } from "lucide-react"
import { getCardImage } from "@/utils/cardImageUtils"

const cardDetails = {
  highestCreditLimit: [
    {
      name: "Delta SkyMiles® Reserve",
      lastFive: "-1006",
      amount: "$30,000",
      type: "hard limit",
      image: getCardImage("delta")
    },
    {
      name: "Business Green Rewards",
      lastFive: "-2007", 
      amount: "$30,000",
      type: "pay over time",
      image: getCardImage("green")
    }
  ],
  lowestCreditLimit: [
    {
      name: "Business Classic Gold",
      lastFive: "-1002",
      amount: "$2,000", 
      type: "pay over time",
      image: getCardImage("gold -1002")
    },
    {
      name: "Business White Gold",
      lastFive: "-1000",
      amount: "$2,000",
      type: "pay over time", 
      image: getCardImage("gold -1000")
    }
  ],
    businessCreditLimit: [
    {
      name: "Business Line of Credit",
      lastFive: "-4156",
      amount: "$2,000,000", 
      type: "installment",
      image: getCardImage("business blueprint")
    },
    {
      name: "Business White Gold",
      lastFive: "-1000",
      amount: "$2,000",
      type: "pay over time", 
      image: getCardImage("gold -1000")
    }
  ],
  brandPartners: [
    {
      name: "Delta SkyMiles® Reserve - 3x",
      lastFive: "-1006",
      amount: "$30,000",
      type: "limit",
      image: getCardImage("delta")
    },
    {
      name: "Marriott Bonvoy Business - 6x",
      lastFive: "-1009",
      amount: "$5,000",
      type: "limit",
      image: getCardImage("marriott")
    },
    {
      name: "Hilton Honors Business - 12x", 
      lastFive: "-9003",
      amount: "$5,000",
      type: "limit",
      image: getCardImage("hilton")
    },
    {
      name: "Amazon Business Prime - 5x",
      lastFive: "-2003",
      amount: "$6,000",
      type: "limit",
      image: getCardImage("amazon")
    }
  ]
}

const metricsData = [
  {
    title: "Active Card Accounts",
    value: "13",
    description: "Total number of active corporate card accounts",
    dataSource: "Card Management System",
    lastUpdated: "Real-time",
    calculationMethod: "Count of all active card accounts with non-zero limits",
    cardData: null
  },
  {
    title: "Highest Credit Limit",
    value: "$30k",
    description: "The highest credit limit among all active cards",
    dataSource: "Credit Management System",
    lastUpdated: "Updated daily",
    calculationMethod: "Maximum credit limit across all active accounts",
    cardData: cardDetails.highestCreditLimit
  },
  {
    title: "Lowest Pay Over Time Limit",
    value: "$2k",
    description: "The lowest pay over time limit across all accounts",
    dataSource: "Credit Management System", 
    lastUpdated: "Updated daily",
    calculationMethod: "Minimum pay over time limit for active accounts",
    cardData: cardDetails.lowestCreditLimit
  },
  {
    title: "Available Line of Credit",
    value: "$2,000,000",
    description: "Total available business line of credit",
    dataSource: "Underwriting System",
    lastUpdated: "Real-time",
    calculationMethod: "Sum of (credit limit - current balance) for BLOC account",
    cardData: cardDetails.businessCreditLimit
  },
  {
    title: "Brand Partner Cards",
    value: "4",
    description: "Number of active brand partner card programs",
    dataSource: "Partner Management System",
    lastUpdated: "Updated weekly", 
    calculationMethod: "Count of active brand partnership agreements",
    cardData: cardDetails.brandPartners
  }
]

const MetricTooltipContent = ({ metric }: { metric: typeof metricsData[0] }) => (
  <div className="space-y-3 max-w-xs">
    <div className="font-medium">{metric.title}</div>
    <div className="text-sm text-muted-foreground">{metric.description}</div>
    
    {metric.cardData && (
      <div className="space-y-2">
        <div className="text-xs font-medium">Account Details:</div>
        {metric.cardData.map((card: any, index: number) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <img src={card.image} alt={card.name} className="w-8 h-5 object-cover rounded" />
            <div className="text-xs">
              <div className="font-medium">{card.name}</div>
              {card.lastFive && (
                <div className="text-muted-foreground">
                  {card.lastFive} • {card.amount} {card.type}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
    
    <div className="text-xs space-y-1 pt-2 border-t">
      <div><span className="font-medium">Source:</span> {metric.dataSource}</div>
      <div><span className="font-medium">Updated:</span> {metric.lastUpdated}</div>
      <div><span className="font-medium">Method:</span> {metric.calculationMethod}</div>
    </div>
  </div>
)

const MetricSheetContent = ({ metric }: { metric: typeof metricsData[0] }) => (
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

export function QuickMetricsCards() {
  const isMobile = useIsMobile()
  const [openSheet, setOpenSheet] = useState<string | null>(null)

  const renderMetricCard = (metric: typeof metricsData[0], index: number) => {
    const cardContent = (
      <Card className="p-4 bg-gradient-to-b from-white to-gray-100 relative group cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-semibold text-gray-900">
            {metric.value}
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
      <TooltipProvider key={metric.title}>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-sm">
            <MetricTooltipContent metric={metric} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-5">
      {metricsData.map((metric, index) => renderMetricCard(metric, index))}
    </div>
  )
}
