
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CounterpartyData {
  name: string
  outboundTotal: number
  count: number
}

interface CounterpartyListItemProps {
  counterparty: CounterpartyData
  index: number
  isSelected: boolean
  onClick: (counterparty: CounterpartyData) => void
}

export function CounterpartyListItem({ 
  counterparty, 
  index, 
  isSelected, 
  onClick 
}: CounterpartyListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleClick = () => {
    onClick(counterparty)
  }

  // Format the outbound total with comma separators
  const formattedOutboundTotal = counterparty.outboundTotal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return (
    <Card 
      className="bg-gradient-to-b from-white to-gray-50 transition-all hover:shadow-md animate-fade-in cursor-pointer"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {getInitials(counterparty.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="text-sm font-medium leading-tight">
              {counterparty.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {counterparty.count} transactions
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              Outbound Total
            </div>
            <div className="text-lg font-bold tabular-nums" style={{ color: '#00175a' }}>
              ${formattedOutboundTotal}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
