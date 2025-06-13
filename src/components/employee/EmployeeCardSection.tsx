
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
</EmployeeCardSectionProps>

Now I need to update the EmployeeCardList to accept and use the cardImageType prop:

<lov-write file_path="src/components/employee/EmployeeCardList.tsx">
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeCardItem } from "./EmployeeCardItem"
import { EmployeeCardSearch } from "./EmployeeCardSearch"
import { EmployeeTransaction } from "./EmployeeTransactionColumns"
import { getCardImage } from "@/utils/cardImageUtils"

interface EmployeeCardListProps {
  selectedCard?: string
  onCardClick: (lastFive: string, cardType?: string) => void
  transactions: EmployeeTransaction[]
  selectedCardType?: string
  cardImageType?: string | null
}

export function EmployeeCardList({ 
  selectedCard, 
  onCardClick, 
  transactions,
  selectedCardType,
  cardImageType 
}: EmployeeCardListProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isSearchVisible, setIsSearchVisible] = React.useState(false)

  // Group transactions by card (card_type + last_five combination)
  const cardGroups = React.useMemo(() => {
    const groups = new Map<string, EmployeeTransaction[]>()
    
    transactions.forEach(transaction => {
      const cardKey = `${transaction.card_type}-${transaction.last_five}`
      if (!groups.has(cardKey)) {
        groups.set(cardKey, [])
      }
      groups.get(cardKey)!.push(transaction)
    })
    
    return Array.from(groups.entries()).map(([cardKey, txns]) => ({
      cardKey,
      card_type: txns[0].card_type,
      last_five: txns[0].last_five,
      transactions: txns,
      totalAmount: txns.reduce((sum, txn) => sum + txn.amount, 0),
      transactionCount: txns.length
    }))
  }, [transactions])

  // Filter cards based on search term
  const filteredCards = React.useMemo(() => {
    if (!searchTerm) return cardGroups
    
    return cardGroups.filter(card =>
      card.last_five.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.card_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [cardGroups, searchTerm])

  // Sort cards by last five digits
  const sortedCards = React.useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      const aLastFive = a.last_five.replace(/^-/, '')
      const bLastFive = b.last_five.replace(/^-/, '')
      return aLastFive.localeCompare(bLastFive)
    })
  }, [filteredCards])

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
    if (isSearchVisible) {
      setSearchTerm("")
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Employee Cards</CardTitle>
          {cardImageType && (
            <div className="flex-shrink-0">
              <img 
                src={getCardImage(cardImageType)} 
                alt={cardImageType}
                className="h-12 w-19 object-cover rounded"
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sortedCards.length} card{sortedCards.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={toggleSearch}
            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isSearchVisible ? 'Hide' : 'Search'}
          </button>
        </div>
        
        <EmployeeCardSearch
          value={searchTerm}
          onChange={setSearchTerm}
          isVisible={isSearchVisible}
        />
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {sortedCards.map((card) => (
          <EmployeeCardItem
            key={card.cardKey}
            card_type={card.card_type}
            last_five={card.last_five}
            totalAmount={card.totalAmount}
            transactionCount={card.transactionCount}
            isSelected={selectedCard === card.last_five && selectedCardType === card.card_type}
            onClick={() => onCardClick(card.last_five, card.card_type)}
          />
        ))}
        {sortedCards.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No cards found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
