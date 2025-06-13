
import React from "react"
import { EmployeeCardList } from "./EmployeeCardList"
import { EmployeeTransaction } from "./EmployeeTransactionColumns"

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
  // Determine which card image to show based on the filtered transactions
  const getCardImageType = () => {
    // Case 1: Single specific card selected (both card type and last five are selected)
    if (selectedLastFive && selectedLastFive !== "all" && selectedCardType && selectedCardType !== "all") {
      return selectedCardType
    }
    
    // Case 2: Check if all cards in the current list are the same type
    if (cardsToShow.length > 0) {
      const uniqueCardTypes = [...new Set(cardsToShow.map(card => card.card_type))]
      
      // Only show image if there's exactly one unique card type
      if (uniqueCardTypes.length === 1) {
        return uniqueCardTypes[0]
      }
    }
    
    // Multiple card types or no cards - don't show any image
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
