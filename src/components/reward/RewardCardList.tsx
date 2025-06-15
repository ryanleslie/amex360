
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
  
  // Updated: Get unique cards by card+last_five (like Index), and show combined display
  const allCardData = React.useMemo(() => {
    // Group by "card + last_five" (or just card if no last_five) for uniqueness and display
    const cardTotals = rewardFilterService.getFilteredRewards({
      ...filters,
      selectedCard: "all"
    }).reduce((acc, reward) => {
      const hasLastFive = reward.last_five && reward.last_five.length > 0
      const cardKey = hasLastFive
        ? `${reward.card} (${reward.last_five})`
        : reward.card
      acc[cardKey] = (acc[cardKey] || 0) + reward.points
      return acc
    }, {} as Record<string, number>)
  
    return Object.entries(cardTotals)
      .map(([cardFull, points]) => {
        // Extract card and last_five for image and friendly display
        const cardNameMatch = cardFull.match(/^(.*?)(?: \((-?\d{5})\))?$/)
        const cardName = cardNameMatch?.[1]?.trim() || cardFull
        const lastFive = cardNameMatch?.[2] || ""
        // For display, render as "Card Name (-12345)" or just "Card Name"
        const displayName = lastFive
          ? `${cardName} (${lastFive})`
          : cardName
        // Show last five on new line (to match subtle formatting from before)
        const displayNameWithNewline = lastFive
          ? `${cardName}\n(${lastFive})`
          : cardName
        return {
          name: cardName,
          fullName: cardFull,  // e.g. "Business Blue Plus I (-12345)"
          points,
          displayName: displayNameWithNewline,
          cardOnly: cardName,
          lastFive: lastFive,
        }
      })
      .sort((a, b) => b.points - a.points)
  }, [filters])

  // Match by fullName, which includes last_five if present.
  const cardData = React.useMemo(() => {
    if (filters.selectedCard === "all") {
      return allCardData
    }
    // Allow selectedCard like "Business Blue Plus I (-13579)" or just "Business Blue Plus I"
    return allCardData.filter(card => card.fullName === filters.selectedCard)
  }, [allCardData, filters.selectedCard])

  // Dynamic height based on filtered card count
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
      onCardClick('all')
    } else {
      onCardClick(card.fullName)
    }
  }

  // Highlight if card is the selected one (match exactly, including last five)
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

  // Map display name for specific cards if needed
  const getDisplayName = (d: string) => d  // Pass-thru for now; can add custom logic if needed

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
                className={`bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md animate-fade-in ${getSelectedCard(card) ? "ring-2 ring-primary" : ""}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
                onClick={() => handleCardClick(card)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Always show image by cardOnly value (just name) */}
                      <img 
                        src={getCardImage(card.cardOnly)} 
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
