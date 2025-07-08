
import React from "react"
import { getAllPrimaryCards, getBrandPartnerCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useCardTypeMetrics = () => {
  // Calculate brand partner cards dynamically from primary cards
  const brandPartnerCardsData = React.useMemo((): MetricResult => {
    const brandPartnerCards = getBrandPartnerCards()
    
    const cardDetails = brandPartnerCards.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.creditLimit.toLocaleString()}`,
      type: `${card.limitType} limit`,
      image: getCardImage(card.cardType.toLowerCase()),
      multiple: card.partnerMultiple ? `${card.partnerMultiple}x` : "N/A",
      creditLimit: card.creditLimit
    }))

    // Sort by credit limit (highest first)
    cardDetails.sort((a, b) => b.creditLimit! - a.creditLimit!)

    return {
      count: brandPartnerCards.length,
      cards: cardDetails.map(card => ({
        ...card,
        type: `${card.type} • ${card.multiple}`
      }))
    }
  }, [])

  // Calculate no annual fee cards dynamically from primary cards
  const noAnnualFeeCardsData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const cardsWithoutFees = primaryCards.filter(card => card.annualFee === 0)
    
    const cardDetails = cardsWithoutFees.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.annualFee.toLocaleString()}`,
      type: `annual fee • ${card.interestRate} APR`,
      image: getCardImage(card.cardType.toLowerCase())
    }))

    return {
      count: cardsWithoutFees.length,
      cards: cardDetails
    }
  }, [])

  // Calculate annual fee cards dynamically from primary cards
  const annualFeeCardsData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const cardsWithFees = primaryCards.filter(card => card.annualFee > 0)
    
    const cardDetails = cardsWithFees.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.annualFee.toLocaleString()}`,
      type: `annual fee • ${card.interestRate} APR`,
      image: getCardImage(card.cardType.toLowerCase()),
      annualFee: card.annualFee
    }))

    // Sort by annual fee (highest first)
    cardDetails.sort((a, b) => b.annualFee! - a.annualFee!)

    return {
      count: cardsWithFees.length,
      cards: cardDetails
    }
  }, [])

  return {
    brandPartnerCardsData,
    noAnnualFeeCardsData,
    annualFeeCardsData
  }
}
