
import { Input } from "@/components/ui/input"
import { CardFilterDropdown } from "./CardFilterDropdown"
import { getAllPrimaryCards, generateDisplayNameWithLastFive } from "@/data/staticPrimaryCards"

interface TransactionCardControlsProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  selectedCard: string
  creditCards: string[]
  onCardChange: (card: string) => void
}

export function TransactionCardControls({
  globalFilter,
  onGlobalFilterChange,
  selectedCard,
  creditCards,
  onCardChange
}: TransactionCardControlsProps) {
  // Get primary cards data for display names
  const primaryCards = getAllPrimaryCards()
  
  // Map card types to display names
  const getDisplayNames = (cardTypes: string[]) => {
    return cardTypes.map(cardType => {
      const primaryCard = primaryCards.find(card => card.cardType === cardType)
      return primaryCard ? generateDisplayNameWithLastFive(cardType, primaryCard.lastFive) : cardType
    })
  }
  
  // Handle card change by extracting card type from display name
  const handleCardChange = (selectedDisplayName: string) => {
    if (selectedDisplayName === "all") {
      onCardChange("all")
      return
    }
    
    // Find the card type that matches this display name
    const primaryCard = primaryCards.find(card => 
      generateDisplayNameWithLastFive(card.cardType, card.lastFive) === selectedDisplayName
    )
    const cardType = primaryCard ? primaryCard.cardType : selectedDisplayName
    onCardChange(cardType)
  }
  
  // Get current selected display name
  const getSelectedDisplayName = () => {
    if (!selectedCard || selectedCard === "all") {
      return "all"
    }
    
    const primaryCard = primaryCards.find(card => card.cardType === selectedCard)
    return primaryCard ? generateDisplayNameWithLastFive(selectedCard, primaryCard.lastFive) : selectedCard
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
      <Input
        placeholder="Search descriptions..."
        value={globalFilter ?? ""}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
        className="max-w-sm"
      />
      <CardFilterDropdown
        selectedCard={getSelectedDisplayName()}
        creditCards={getDisplayNames(creditCards)}
        onCardChange={handleCardChange}
        showBusinessPrefix={false}
      />
    </div>
  )
}
