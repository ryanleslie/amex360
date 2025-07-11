
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

  // Calculate total preset credit limit
  const totalPresetCreditLimitData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const presetCards = primaryCards.filter(card => card.limitType === "preset")
    
    if (presetCards.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const totalLimit = presetCards.reduce((sum, card) => sum + card.creditLimit, 0)
    
    const cardDetails = presetCards.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.creditLimit.toLocaleString()}`,
      type: `${card.limitType} limit • ${card.interestRate} APR`,
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort by credit limit descending
    const sortedCardDetails = cardDetails.sort((a, b) => {
      const amountA = parseInt(a.amount.replace(/[$,]/g, ''))
      const amountB = parseInt(b.amount.replace(/[$,]/g, ''))
      return amountB - amountA
    })

    return {
      amount: `$${(totalLimit / 1000).toFixed(0)}K`,
      cards: sortedCardDetails
    }
  }, [])

  // Calculate total pay over time limit
  const totalPayOverTimeLimitData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const payOverTimeCards = primaryCards.filter(card => card.limitType === "pay over time")
    
    if (payOverTimeCards.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const totalLimit = payOverTimeCards.reduce((sum, card) => sum + card.creditLimit, 0)
    
    const cardDetails = payOverTimeCards.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.creditLimit.toLocaleString()}`,
      type: `${card.limitType} limit • ${card.interestRate} APR`,
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort by credit limit descending
    const sortedCardDetails = cardDetails.sort((a, b) => {
      const amountA = parseInt(a.amount.replace(/[$,]/g, ''))
      const amountB = parseInt(b.amount.replace(/[$,]/g, ''))
      return amountB - amountA
    })

    return {
      amount: `$${(totalLimit / 1000).toFixed(0)}K`,
      cards: sortedCardDetails
    }
  }, [])

  return {
    highestCreditLimitData,
    lowestPayOverTimeLimitData,
    totalPresetCreditLimitData,
    totalPayOverTimeLimitData
  }
}
