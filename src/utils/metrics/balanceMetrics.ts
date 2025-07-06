
import React from "react"
import { useCardBalances } from "@/hooks/useCardBalances"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useBalanceMetrics = () => {
  const { cardBalances } = useCardBalances()

  // Helper function to get balance for a card with specific matching logic
  const getCardBalance = React.useCallback((cardType: string) => {
    // Handle specific card type mappings
    const getMatchingCardType = (cardType: string) => {
      const normalizedCardType = cardType.toLowerCase()
      
      // Specific mapping for Business Blue Plus cards
      if (normalizedCardType.includes('business blue plus i') && !normalizedCardType.includes('ii')) {
        return 'Business Blue Plus I'
      }
      if (normalizedCardType.includes('business blue plus ii')) {
        return 'Business Blue Plus II'
      }
      
      return cardType
    }
    
    const targetCardType = getMatchingCardType(cardType)
    
    const balance = cardBalances.find(card => {
      const cardTypeLower = card.cardType.toLowerCase()
      const targetLower = targetCardType.toLowerCase()
      
      // Exact match first
      if (cardTypeLower === targetLower) {
        return true
      }
      
      // For Business Blue Plus cards, be more specific
      if (targetLower.includes('business blue plus i') && !targetLower.includes('ii')) {
        return cardTypeLower === 'business blue plus i'
      }
      if (targetLower.includes('business blue plus ii')) {
        return cardTypeLower === 'business blue plus ii'
      }
      
      // General matching for other cards
      return cardTypeLower.includes(targetLower) || targetLower.includes(cardTypeLower)
    })
    
    return balance?.currentBalance || 0
  }, [cardBalances])

  // Calculate total current balances from Supabase data
  const totalCurrentBalanceData = React.useMemo((): MetricResult => {
    if (cardBalances.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const totalBalance = cardBalances.reduce((sum, card) => {
      return sum + (card.currentBalance || 0)
    }, 0)

    const cardDetails = cardBalances.map(card => ({
      name: card.cardType,
      lastFive: "",
      amount: `$${(card.currentBalance || 0).toLocaleString()}`,
      type: "current balance",
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort by balance (highest first)
    cardDetails.sort((a, b) => {
      const balanceA = parseInt(a.amount.replace('$', '').replace(',', ''))
      const balanceB = parseInt(b.amount.replace('$', '').replace(',', ''))
      return balanceB - balanceA
    })

    return {
      amount: `$${totalBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances])

  return {
    totalCurrentBalanceData,
    getCardBalance
  }
}
