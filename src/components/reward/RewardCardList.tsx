
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

  // Group rewards by card name (ignoring last_five for filtering), but display with last five
  const allCardData = React.useMemo(() => {
    // Group by "card" only, sum points per card name
    const byCard: Record<string, { cardName: string; points: number; lastFiveSet: Set<string> }> = {};
    rewardFilterService.getFilteredRewards({
      ...filters,
      selectedCard: "all"
    }).forEach(reward => {
      const key = reward.card;
      if (!byCard[key]) {
        byCard[key] = { cardName: key, points: 0, lastFiveSet: new Set() };
      }
      byCard[key].points += reward.points;
      if (reward.last_five && reward.last_five.length > 0) {
        byCard[key].lastFiveSet.add(reward.last_five);
      }
    });

    return Object.values(byCard)
      .map(item => {
        // Prepare displayName: show all last five numbers found for card, or just card name
        let displayName = item.cardName;
        if (item.lastFiveSet.size > 0) {
          displayName += ' ' + Array.from(item.lastFiveSet).map(l5 => `(${l5})`).join(', ')
        }
        return {
          name: item.cardName,
          points: item.points,
          displayName,
          cardOnly: item.cardName,
          lastFives: Array.from(item.lastFiveSet),
        };
      })
      .sort((a, b) => b.points - a.points)
  }, [filters])

  // Filtering by card: use only card name (ignore last five)
  const cardData = React.useMemo(() => {
    if (filters.selectedCard === "all" || !filters.selectedCard) {
      return allCardData;
    }
    // Remove any last five from selectedCard filter (e.g. "Business Blue Plus I (-12345)" -> "Business Blue Plus I")
    const cardName = filters.selectedCard.match(/^(.*?)(?: \(-?\d{5}\))?$/)?.[1]?.trim() || filters.selectedCard;
    return allCardData.filter(card => card.name === cardName);
  }, [allCardData, filters.selectedCard])

  // Dynamic height stays the same
  const dynamicHeight = React.useMemo(() => {
    const baseHeight = 200
    const cardHeight = 120
    const maxHeight = 830
    const calculatedHeight = baseHeight + (cardData.length * cardHeight)
    return Math.min(calculatedHeight, maxHeight)
  }, [cardData.length])

  // When a card is clicked, filter by card name only (ignore last five)
  const handleCardClick = (card: any) => {
    if (!onCardClick) return
    const isSelected = (filters.selectedCard !== "all") && (card.name === (filters.selectedCard.match(/^(.*?)(?: \(-?\d{5}\))?$/)?.[1]?.trim() || filters.selectedCard));
    if (isSelected) {
      onCardClick("all");
    } else {
      onCardClick(card.name); // filter by name only, not displayName
    }
  }

  // Highlight if card name matches (ignore last five)
  const getSelectedCard = (card: any) => {
    if (!filters.selectedCard || filters.selectedCard === "all") return false;
    const cardName = filters.selectedCard.match(/^(.*?)(?: \(-?\d{5}\))?$/)?.[1]?.trim() || filters.selectedCard;
    return card.name === cardName;
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

  // Remove 'card' from display name for reward card list
  const getDisplayName = (d: string) =>
    d.replace(/\bcard\b/gi, '').replace(/\s+/g, ' ').trim()

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
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4 pb-6">
            {cardData.map((card, index) => (
              <div key={card.name} className="p-1">
                <Card
                  // Remove ANY ring for selection/focus/active
                  className="bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md animate-fade-in ring-0 focus:ring-0 focus-visible:ring-0"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                  tabIndex={0}
                  onClick={() => handleCardClick(card)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
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
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

