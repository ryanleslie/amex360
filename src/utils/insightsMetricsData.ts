
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

  // Calculate no annual fee cards dynamically from primary cards
  const noAnnualFeeCardsData = React.useMemo(() => {
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

  // Calculate cards closing this week
  const closingThisWeekData = React.useMemo(() => {
    const primaryCards = getAllPrimaryCards()
    const today = new Date()
    const currentDay = today.getDate()
    
    // Get cards that close within the next 7 days
    const cardsClosingThisWeek = primaryCards.filter(card => {
      const daysUntilClosing = card.closingDate >= currentDay 
        ? card.closingDate - currentDay 
        : (30 - currentDay) + card.closingDate // Handle month rollover
      return daysUntilClosing <= 7 && daysUntilClosing >= 0
    })
    
    const cardDetails = cardsClosingThisWeek.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `${card.closingDate}${card.closingDate === 1 || card.closingDate === 21 || card.closingDate === 31 ? 'st' : card.closingDate === 2 || card.closingDate === 22 ? 'nd' : card.closingDate === 3 || card.closingDate === 23 ? 'rd' : 'th'}`,
      type: "closes",
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort by closing date
    cardDetails.sort((a, b) => {
      const dateA = parseInt(a.amount)
      const dateB = parseInt(b.amount)
      return dateA - dateB
    })

    return {
      count: cardsClosingThisWeek.length,
      cards: cardDetails
    }
  }, [])

  // Calculate cards due this week
  const dueThisWeekData = React.useMemo(() => {
    const primaryCards = getAllPrimaryCards()
    const today = new Date()
    const currentDay = today.getDate()
    
    // Get cards that are due within the next 7 days
    const cardsDueThisWeek = primaryCards.filter(card => {
      const daysUntilDue = card.dueDate >= currentDay 
        ? card.dueDate - currentDay 
        : (30 - currentDay) + card.dueDate // Handle month rollover
      return daysUntilDue <= 7 && daysUntilDue >= 0
    })
    
    const cardDetails = cardsDueThisWeek.map(card => ({
      name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
      lastFive: `-${card.lastFive}`,
      amount: `${card.dueDate}${card.dueDate === 1 || card.dueDate === 21 || card.dueDate === 31 ? 'st' : card.dueDate === 2 || card.dueDate === 22 ? 'nd' : card.dueDate === 3 || card.dueDate === 23 ? 'rd' : 'th'}`,
      type: "due",
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort by due date
    cardDetails.sort((a, b) => {
      const dateA = parseInt(a.amount)
      const dateB = parseInt(b.amount)
      return dateA - dateB
    })

    return {
      count: cardsDueThisWeek.length,
      cards: cardDetails
    }
  }, [])

  // Calculate annual fee cards dynamically from primary cards
  const annualFeeCardsData = React.useMemo(() => {
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
    cardDetails.sort((a, b) => b.annualFee - a.annualFee)

    return {
      count: cardsWithFees.length,
      cards: cardDetails
    }
  }, [])

  const metricsData = [
    {
      title: "Closing this week",
      value: closingThisWeekData.count.toString(),
      description: "Cards with closing dates in the next 7 days",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards closing within 7 days of current date",
      cardData: closingThisWeekData.cards
    },
    {
      title: "Due this week",
      value: dueThisWeekData.count.toString(),
      description: "Cards with payment due dates in the next 7 days",
      dataSource: "Primary Cards Configuration", 
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards with payments due within 7 days of current date",
      cardData: dueThisWeekData.cards
    },
    {
      title: "No Annual Fee",
      value: noAnnualFeeCardsData.count.toString(),
      description: "Number of cards with no annual fee",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of primary cards with $0 annual fee",
      cardData: noAnnualFeeCardsData.cards
    },
    {
      title: "Annual Fee",
      value: annualFeeCardsData.count.toString(),
      description: "Number of cards with annual fees",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily", 
      calculationMethod: "Count of primary cards with annual fees greater than $0",
      cardData: annualFeeCardsData.cards
    },
    {
      title: "Total Annual Fees",
      value: totalAnnualFeesData.amount,
      description: "Sum of all annual fees across active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Sum of annual fees for all primary card accounts",
      cardData: totalAnnualFeesData.cards
    }
  ]

  return metricsData
}
