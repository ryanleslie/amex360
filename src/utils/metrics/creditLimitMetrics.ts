
import React from "react"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useCreditLimitMetrics = () => {
  // Calculate highest credit limit dynamically from primary cards
  const highestCreditLimitData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    
    if (primaryCards.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const maxLimit = Math.max(...primaryCards.map(card => card.creditLimit))
    const cardsWithMaxLimit = primaryCards.filter(card => card.creditLimit === maxLimit)
    
    const cardDetails = cardsWithMaxLimit.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.creditLimit.toLocaleString()}`,
      type: `${card.limitType} limit`,
      image: getCardImage(card.cardType.toLowerCase()),
      limitType: card.limitType
    }))

    // Sort cards: preset first, then pay over time
    const sortedCardDetails = cardDetails.sort((a, b) => {
      if (a.limitType === "preset" && b.limitType !== "preset") return -1
      if (a.limitType !== "preset" && b.limitType === "preset") return 1
      return 0
    })

    return {
      amount: `$${(maxLimit / 1000).toFixed(0)}K`,
      cards: sortedCardDetails
    }
  }, [])

  // Calculate lowest pay over time limit dynamically from primary cards
  const lowestPayOverTimeLimitData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const payOverTimeCards = primaryCards.filter(card => card.limitType === "pay over time")
    
    if (payOverTimeCards.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const minLimit = Math.min(...payOverTimeCards.map(card => card.creditLimit))
    const cardsWithMinLimit = payOverTimeCards.filter(card => card.creditLimit === minLimit)
    
    const cardDetails = cardsWithMinLimit.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.creditLimit.toLocaleString()}`,
      type: `${card.limitType} limit`,
      image: getCardImage(card.cardType.toLowerCase())
    }))

    return {
      amount: `$${(minLimit / 1000).toFixed(0)}K`,
      cards: cardDetails
    }
  }, [])

  return {
    highestCreditLimitData,
    lowestPayOverTimeLimitData
  }
}
