
import React from "react"
import { useCardBalances } from "@/hooks/useCardBalances"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useBalanceMetrics = () => {
  const { cardBalances } = useCardBalances()

  // Helper function to get balance for a card with specific matching logic
  const getCardBalance = React.useCallback((cardType: string) => {
    // Normalize strings for comparison
    const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ')
    
    const targetNormalized = normalize(cardType)
    
    const balance = cardBalances.find(card => {
      const cardNormalized = normalize(card.cardType)
      
      // 1. Exact match (case-insensitive, normalized spaces)
      if (cardNormalized === targetNormalized) {
        return true
      }
      
      // 2. Handle specific card conflicts to avoid substring matching issues
      // Charles Schwab Platinum Card vs Platinum Card
      if (targetNormalized.includes('charles schwab platinum card')) {
        return cardNormalized === 'charles schwab platinum card'
      }
      if (targetNormalized === 'platinum card' && !targetNormalized.includes('charles schwab')) {
        return cardNormalized === 'platinum card' && !cardNormalized.includes('charles schwab')
      }
      
      // 3. Business Blue Plus specific handling
      if (targetNormalized.includes('business blue plus i') && !targetNormalized.includes('ii')) {
        return cardNormalized === 'business blue plus i'
      }
      if (targetNormalized.includes('business blue plus ii')) {
        return cardNormalized === 'business blue plus ii'
      }
      
      // 4. More specific fuzzy matching - only if one completely contains the other
      // and they're not conflicting variants
      const isConflictingPlatinum = (
        (targetNormalized.includes('platinum') || cardNormalized.includes('platinum')) &&
        targetNormalized !== cardNormalized
      )
      
      if (!isConflictingPlatinum) {
        // Only match if one string completely contains the other (avoiding partial matches)
        const targetContainsCard = targetNormalized.includes(cardNormalized)
        const cardContainsTarget = cardNormalized.includes(targetNormalized)
        
        // Ensure it's not a partial word match by checking word boundaries
        if (targetContainsCard || cardContainsTarget) {
          const words1 = targetNormalized.split(' ')
          const words2 = cardNormalized.split(' ')
          
          // Check if all words from the shorter string exist in the longer string
          const shorterWords = words1.length <= words2.length ? words1 : words2
          const longerWords = words1.length > words2.length ? words1 : words2
          
          return shorterWords.every(word => longerWords.includes(word))
        }
      }
      
      return false
    })
    
    // Add debug logging to help identify matching issues
    if (!balance) {
      console.warn(`No balance found for card: "${cardType}". Available cards:`, 
        cardBalances.map(c => c.cardType))
    } else {
      console.log(`Matched "${cardType}" to "${balance.cardType}" with balance: $${balance.currentBalance}`)
    }
    
    return balance?.currentBalance || 0
  }, [cardBalances])

  // Calculate total current balances from calculated data
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
