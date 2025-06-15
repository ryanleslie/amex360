
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRewardCalculations } from "@/hooks/useRewardCalculations"
import { FilterState } from "@/hooks/useFilterState"
import { rewardFilterService } from "@/services/rewardFilterService"
import { getCardImage } from "@/utils/cardImageUtils"
import * as React from "react"

interface RewardCardListProps {
  filters: FilterState
  onCardClick?: (cardName: string) => void
}

export function RewardCardList({ filters, onCardClick }: RewardCardListProps) {
  const calculations = useRewardCalculations(filters)
  
  // Get unique cards and their totals
  const allCardData = React.useMemo(() => {
    const cardTotals = rewardFilterService.getFilteredRewards({
      ...filters,
      selectedCard: "all" // Always show all cards
    }).reduce((acc, reward) => {
      const cardName = reward.card
      acc[cardName] = (acc[cardName] || 0) + reward.points
      return acc
    }, {} as Record<string, number>)

    return Object.entries(cardTotals)
      .map(([card, points]) => ({
        name: card.replace(/\bcard\b/gi, '').replace(/\(-\d+\)/g, '').trim(),
        fullName: card,
        points,
        displayName: card.replace(/\bcard\b/gi, '').trim().replace(/\s*(\([^)]+\))/, '\n$1')
      }))
      .sort((a, b) => b.points - a.points)
  }, [filters])

  // Filter cards based on selected card
  const cardData = React.useMemo(() => {
    if (filters.selectedCard === "all") {
      return allCardData
    }
    
    return allCardData.filter(card => card.fullName === filters.selectedCard)
  }, [allCardData, filters.selectedCard])

  // Calculate dynamic height based on filtered card count
  const dynamicHeight = React.useMemo(() => {
    const baseHeight = 200 // Minimum height for header and padding
    const cardHeight = 120 // Approximate height per card including spacing
    const maxHeight = 830 // Maximum height
    
    const calculatedHeight = baseHeight + (cardData.length * cardHeight)
    return Math.min(calculatedHeight, maxHeight)
  }, [cardData.length])

  const handleCardClick = (card: any) => {
    if (!onCardClick) return
    
    const isSelected = card.fullName === filters.selectedCard
    
    if (isSelected) {
      // If this card is already selected, toggle to "all"
      onCardClick('all')
    } else {
      // If this card is not selected, select it
      onCardClick(card.fullName)
    }
  }

  // Determine which card is selected
  const getSelectedCard = (card: any) => {
    if (filters.selectedCard === "all") return false
    return card.fullName === filters.selectedCard
  }

  const getTimeRangeDescription = () => {
    if (filters.selectedDate) {
      const [year, month, day] = filters.selectedDate.split('-').map(Number)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return `(${monthNames[month - 1]} ${day}, ${year})`
    }
    
    switch (filters.selectedTimeRange) {
      case "ytd": return "(YTD)"
      case "90d": return "(90d)"
      case "30d": return "(30d)"
      case "7d": return "(7d)"
      default: return "(YTD)"
    }
  }

  // Map display name for specific cards
  const getDisplayName = (cardName: string) => {
    if (cardName.includes('Bonvoy Business Amex')) {
      return cardName.replace('Bonvoy Business Amex', 'Marriott Bonvoy Business')
    }
    if (cardName.includes('Amazon Prime')) {
      return cardName.replace('Amazon Prime', 'Amazon Business Prime')
    }
    return cardName
  }

  return (
    <Card 
      className="bg-gradient-to-b from-white to-gray-100 flex flex-col transition-all duration-300 ease-in-out"
      style={{ height: `${dynamicHeight}px` }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Card breakdown</CardTitle>
        <CardDescription>
          Bonus awards by card {getTimeRangeDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 pb-6">
            {cardData.map((card, index) => (
              <Card 
                key={card.fullName}
                className="bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
                onClick={() => handleCardClick(card)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={getCardImage(card.fullName)} 
                        alt="Card placeholder" 
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="text-sm font-medium leading-tight whitespace-pre-line">
                        {getDisplayName(card.displayName)}
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Reward points
                        </p>
                        <div className="text-lg font-bold tabular-nums" style={{ color: '#00175a' }}>
                          {card.points.toLocaleString()} pts
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
