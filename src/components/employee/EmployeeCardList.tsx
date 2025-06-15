import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmployeeTransaction } from "./EmployeeTransactionColumns"
import { EmployeeCardItem } from "./EmployeeCardItem"
import { EmployeeCardSearch } from "./EmployeeCardSearch"
import { useEmployeeCardData } from "@/hooks/useEmployeeCardData"

interface EmployeeCardListProps {
  selectedCard?: string
  onCardClick?: (lastFive: string, cardType?: string) => void
  transactions: EmployeeTransaction[]
  selectedCardType?: string
}

export function EmployeeCardList({ selectedCard, onCardClick, transactions, selectedCardType }: EmployeeCardListProps) {
  const [lastFiveFilter, setLastFiveFilter] = React.useState("")

  // Clear search filter when a specific card is selected
  React.useEffect(() => {
    if (selectedCard && selectedCard !== "all") {
      setLastFiveFilter("")
    }
  }, [selectedCard])

  // Use the custom hook for card data processing
  const { filteredCardData } = useEmployeeCardData(transactions, selectedCardType, lastFiveFilter)

  // Check if a specific card is selected (not just a card type)
  const isSpecificCardSelected = selectedCard && selectedCard !== "all" && selectedCardType && selectedCardType !== "all"

  // Calculate dynamic height based on filtered card count and search bar visibility
  const dynamicHeight = React.useMemo(() => {
    const baseHeight = 200
    const cardHeight = 120
    const maxHeight = 830
    
    const calculatedHeight = baseHeight + (filteredCardData.length * cardHeight)
    return Math.min(calculatedHeight, maxHeight)
  }, [filteredCardData.length])

  // Calculate scroll area height (subtract space for search bar only if it's visible)
  const scrollAreaHeight = React.useMemo(() => {
    if (isSpecificCardSelected) {
      return "100%" // No search bar space to subtract
    }
    const searchBarHeight = 56 // height of search input + margin
    return `calc(100% - ${searchBarHeight}px)`
  }, [isSpecificCardSelected])

  const handleCardClick = (card: any) => {
    if (!onCardClick) return
    
    console.log('Card clicked in list:', { card, selectedCard, selectedCardType })
    
    // Check if this specific card (type + last five combination) is selected
    const isSelected = selectedCard === card.lastFive && selectedCardType === card.cardType
    
    if (isSelected) {
      // If this card is currently selected, pass the card info to allow toggle back to card type
      onCardClick(card.lastFive, card.cardType)
    } else {
      // Pass both the lastFive and cardType to ensure correct filtering
      onCardClick(card.lastFive, card.cardType)
    }
  }

  return (
    <Card 
      className="bg-gradient-to-b from-white to-gray-100 flex flex-col transition-all duration-300 ease-in-out"
      style={{ height: `${dynamicHeight}px` }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Employee cards</CardTitle>
        <CardDescription>
          Total spending by card (last 5 digits)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <EmployeeCardSearch
          value={lastFiveFilter}
          onChange={setLastFiveFilter}
          isVisible={!isSpecificCardSelected}
        />
        <ScrollArea className="pr-2" style={{ height: scrollAreaHeight }}>
          <div className="space-y-4 pt-3 pb-6">
            {filteredCardData.map((card, index) => {
              const isCardSelected = selectedCard === card.lastFive && selectedCardType === card.cardType
              
              return (
                <EmployeeCardItem
                  key={card.cardKey}
                  card={card}
                  index={index}
                  isCardSelected={isCardSelected}
                  selectedCard={selectedCard}
                  selectedCardType={selectedCardType}
                  onCardClick={handleCardClick}
                />
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
