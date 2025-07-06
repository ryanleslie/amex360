
import React from "react"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useFeeMetrics = () => {
  // Calculate total annual fees dynamically from primary cards (excluding $0 fees)
  const totalAnnualFeesData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const cardsWithFees = primaryCards.filter(card => card.annualFee > 0)
    
    if (cardsWithFees.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const totalFees = cardsWithFees.reduce((sum, card) => sum + card.annualFee, 0)
    
    const cardDetails = cardsWithFees.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.annualFee.toLocaleString()}`,
      type: `annual fee • ${card.interestRate} APR`,
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort cards by annual fee (highest first)
    cardDetails.sort((a, b) => {
      const feeA = parseInt(a.amount.replace('$', '').replace(',', ''))
      const feeB = parseInt(b.amount.replace('$', '').replace(',', ''))
      return feeB - feeA
    })

    return {
      amount: `$${totalFees.toLocaleString()}`,
      cards: cardDetails
    }
  }, [])

  return {
    totalAnnualFeesData
  }
}
