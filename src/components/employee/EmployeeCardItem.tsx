
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useEmployeeBonus } from "@/hooks/useEmployeeBonusContext"
import { formatDisplayCardName } from "@/utils/transactionUtils"

interface CardData {
  name: string
  fullName: string
  amount: number
  cardType: string
  lastFive: string
  count: number
  displayName: string
  cardKey: string
}

interface EmployeeCardItemProps {
  card: CardData
  index: number
  isCardSelected: boolean
  selectedCard?: string
  selectedCardType?: string
  onCardClick: (card: CardData) => void
}

// Fixed employee card image for all cards in the list
const EMPLOYEE_CARD_IMAGE = "https://icm.aexp-static.com/acquisition/card-art/NUS000000322_160x102_straight_withname.png"

export function EmployeeCardItem({ 
  card, 
  index, 
  isCardSelected, 
  selectedCard, 
  selectedCardType, 
  onCardClick 
}: EmployeeCardItemProps) {
  const { toggleCardBonus, isCardBonusActive } = useEmployeeBonus()
  
  const isBonusActive = isCardBonusActive(card.cardKey)
  
  // Debug logging
  console.log('Card debug info:', {
    cardKey: card.cardKey,
    isBonusActive,
    isCardSelected,
    cardType: card.cardType,
    lastFive: card.lastFive
  })

  const handleSwitchChange = (cardKey: string) => {
    console.log('Switch toggled for card:', cardKey)
    toggleCardBonus(cardKey)
  }

  const handleCardClick = () => {
    onCardClick(card)
  }

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount)
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(absAmount)
    return amount >= 0 ? `+${formatted}` : formatted
  }

  const displayLastFive = card.lastFive
  const amountTextColor = card.amount >= 0 ? "text-[#008767]" : ""

  // Apply consistent displayName formatting
  const displayCardName = `${formatDisplayCardName(card.cardType)}\n(${displayLastFive})`

  return (
    <Card 
      key={card.cardKey}
      className="bg-gradient-to-b from-white to-gray-50 transition-all hover:shadow-md animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <CardContent className="p-4">
        <div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex items-center gap-4 flex-1">
            <img 
              src={EMPLOYEE_CARD_IMAGE} 
              alt="Employee card" 
              className="w-16 h-10 object-cover rounded"
            />
            <div className="text-sm font-medium leading-tight whitespace-pre-line">
              {displayCardName}
            </div>
          </div>
          <div className="flex items-center justify-end sm:justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {card.count} transactions
              </p>
              <div className="flex items-center gap-2">
                {isBonusActive && (
                  <img 
                    src="https://i.imgur.com/dTz9vVm.png" 
                    alt="Boost active" 
                    className="w-4 h-4"
                  />
                )}
                <div className={`text-lg font-bold tabular-nums ${amountTextColor}`}>
                  {formatAmount(card.amount)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isCardSelected && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                +15,000 bonus awarded
              </span>
              <div onClick={(e) => e.stopPropagation()}>
                <Switch 
                  checked={isBonusActive}
                  onCheckedChange={() => handleSwitchChange(card.cardKey)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
