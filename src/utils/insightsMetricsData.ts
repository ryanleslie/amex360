
import React from "react"
import { transactionFilterService } from "@/services/transaction"
import { getAllPrimaryCards, getBrandPartnerCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"

export const useInsightsMetricsData = () => {
  // Calculate total annual fees dynamically from primary cards (excluding $0 fees)
  const totalAnnualFeesData = React.useMemo(() => {
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
      type: "annual fee",
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

  // Calculate no annual fee cards dynamically from primary cards
  const noAnnualFeeCardsData = React.useMemo(() => {
    const primaryCards = getAllPrimaryCards()
    const cardsWithoutFees = primaryCards.filter(card => card.annualFee === 0)
    
    const cardDetails = cardsWithoutFees.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `$${card.annualFee.toLocaleString()}`,
      type: "annual fee",
      image: getCardImage(card.cardType.toLowerCase())
    }))

    return {
      count: cardsWithoutFees.length,
      cards: cardDetails
    }
  }, [])

  // Get dynamic card count from transaction filter service
  const activeCardCount = React.useMemo(() => {
    return transactionFilterService.getUniqueCardAccounts().length
  }, [])

  // Calculate highest credit limit dynamically from primary cards
  const highestCreditLimitData = React.useMemo(() => {
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
  const lowestPayOverTimeLimitData = React.useMemo(() => {
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

  // Calculate brand partner cards dynamically from primary cards
  const brandPartnerCardsData = React.useMemo(() => {
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
    cardDetails.sort((a, b) => b.creditLimit - a.creditLimit)

    return {
      count: brandPartnerCards.length,
      cards: cardDetails
    }
  }, [])

  const metricsData = [
    {
      title: "Total Annual Fees",
      value: totalAnnualFeesData.amount,
      description: "Sum of all annual fees across active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Sum of annual fees for all primary card accounts",
      cardData: totalAnnualFeesData.cards
    },
    {
      title: "No Annual Fee Cards",
      value: noAnnualFeeCardsData.count.toString(),
      description: "Number of cards with no annual fee",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of primary cards with $0 annual fee",
      cardData: noAnnualFeeCardsData.cards
    },
    {
      title: "Active Card Accounts",
      value: activeCardCount.toString(),
      description: "Total number of active card accounts",
      dataSource: "Transaction Data System",
      lastUpdated: "Real-time",
      calculationMethod: "Count of unique card accounts from transaction data",
      cardData: null
    },
    {
      title: "Highest Credit Limit",
      value: highestCreditLimitData.amount,
      description: "The highest credit limit among all active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Maximum credit limit across all primary card accounts",
      cardData: highestCreditLimitData.cards
    },
    {
      title: "Lowest Pay Over Time Limit",
      value: lowestPayOverTimeLimitData.amount,
      description: "The lowest pay over time limit across all accounts",
      dataSource: "Primary Cards Configuration", 
      lastUpdated: "Updated daily",
      calculationMethod: "Minimum pay over time limit for active accounts",
      cardData: lowestPayOverTimeLimitData.cards
    },
    {
      title: "Brand Partner Cards",
      value: brandPartnerCardsData.count.toString(),
      description: "Number of active brand partner card programs",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily", 
      calculationMethod: "Count of primary cards with brand partner status",
      cardData: brandPartnerCardsData.cards.map(card => ({
        ...card,
        type: `${card.type} • ${card.multiple}`
      }))
    }
  ]

  return metricsData
}
