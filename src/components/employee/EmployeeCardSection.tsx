
import React from "react"
import { EmployeeCardList } from "./EmployeeCardList"
import { EmployeeTransaction } from "./EmployeeTransactionColumns"

interface EmployeeCardSectionProps {
  selectedLastFive?: string
  handleCardClick: (lastFive: string, cardType?: string) => void
  cardsToShow: EmployeeTransaction[]
  selectedCardType?: string
}

export function EmployeeCardSection({
  selectedLastFive,
  handleCardClick,
  cardsToShow,
  selectedCardType
}: EmployeeCardSectionProps) {
  return (
    <div className="lg:col-span-1">
      <EmployeeCardList 
        selectedCard={selectedLastFive}
        onCardClick={handleCardClick}
        transactions={cardsToShow}
        selectedCardType={selectedCardType}
      />
    </div>
  )
}
