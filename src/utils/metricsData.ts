
import React from "react"
import { transactionFilterService } from "@/services/transaction"
import { getAllPrimaryCards, getBrandPartnerCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"

export const useMetricsData = () => {
  // Get dynamic card count from transaction filter service
  const activeCardCount = React.useMemo(() => {
    return transactionFilterService.getUniqueCardAccounts().length
  }, [])

  // Calculate total annual fees dynamically from primary cards
  const totalAnnualFeesData = React.useMemo(() => {
    const primaryCards = getAllPrimaryCards()
    
    if (primaryCards.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const totalFees = primaryCards.reduce((sum, card) => sum + card.annualFee, 0)
    
    const cardDetails = primaryCards.map(card => ({
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

  const cardDetails = {
    businessCreditLimit: [
      {
        name: "Business Line of Credit",
        lastFive: "-4156",
        amount: "$2,000,000", 
        type: "installment",
        image: getCardImage("bloc")
      },
    ]
  }

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
      title: "Available Line of Credit",
      value: "$2M",
      description: "Total available business line of credit",
      dataSource: "Underwriting System",
      lastUpdated: "Real-time",  
      calculationMethod: "Sum of (credit limit - current balance)",
      cardData: cardDetails.businessCreditLimit
    }
  ]

  return metricsData
}
