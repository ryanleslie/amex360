
import React from "react"
import { EmployeeCardList } from "./EmployeeCardList"
import { EmployeeTransaction } from "./EmployeeTransactionColumns"
import { employeeCardBonuses } from "@/data/staticEmployeeCards"

interface EmployeeCardSectionProps {
  selectedLastFive?: string
  handleCardClick: (lastFive: string, cardType?: string) => void
  cardsToShow: EmployeeTransaction[]
  selectedCardType?: string
  showPendingCardsOnly: boolean
}

export function EmployeeCardSection({
  selectedLastFive,
  handleCardClick,
  cardsToShow,
  selectedCardType,
  showPendingCardsOnly
}: EmployeeCardSectionProps) {
  // Determine which card image to show
  const getCardImageType = () => {
    // Case B: Single card selected
    if (selectedLastFive && selectedCardType) {
      return selectedCardType
    }
    
    // Case A: Cards pending award filter
    if (showPendingCardsOnly) {
      // Get unique card types from the filtered cards
      const uniqueCardTypes = [...new Set(cardsToShow.map(card => card.card_type))]
      
      // Only show image if all cards are the same type
      if (uniqueCardTypes.length === 1) {
        return uniqueCardTypes[0]
      }
      
      // Multiple card types - don't show image
      return null
    }
    
    // Default case - show first card type if any cards exist
    if (cardsToShow.length > 0) {
      const uniqueCardTypes = [...new Set(cardsToShow.map(card => card.card_type))]
      if (uniqueCardTypes.length === 1) {
        return uniqueCardTypes[0]
      }
    }
    
    return null
  }

  return (
    <div className="lg:col-span-1">
      <EmployeeCardList 
        selectedCard={selectedLastFive}
        onCardClick={handleCardClick}
        transactions={cardsToShow}
        selectedCardType={selectedCardType}
        cardImageType={getCardImageType()}
      />
    </div>
  )
}
