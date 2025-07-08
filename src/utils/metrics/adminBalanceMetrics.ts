import React from "react"
import { useCardBalances } from "@/hooks/useCardBalances"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useAdminBalanceMetrics = () => {
  const { cardBalances } = useCardBalances()
  const primaryCards = getAllPrimaryCards()

  // Calculate highest balance
  const highestBalanceData = React.useMemo((): MetricResult => {
    if (cardBalances.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const maxBalance = Math.max(...cardBalances.map(card => card.currentBalance || 0))
    const cardsWithMaxBalance = cardBalances.filter(card => (card.currentBalance || 0) === maxBalance)
    
    const cardDetails = cardsWithMaxBalance.map(balance => {
      const primaryCard = primaryCards.find(card => card.plaid_account_id === balance.plaid_account_id)
      return {
        name: balance.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : balance.cardType,
        lastFive: primaryCard ? `-${primaryCard.lastFive}` : "",
        amount: `$${(balance.currentBalance || 0).toLocaleString()}`,
        type: "current balance",
        image: getCardImage(balance.cardType.toLowerCase())
      }
    })

    return {
      amount: `$${maxBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances, primaryCards])

  // Calculate lowest balance (excluding zero balances)
  const lowestBalanceData = React.useMemo((): MetricResult => {
    const nonZeroBalances = cardBalances.filter(card => (card.currentBalance || 0) > 0)
    
    if (nonZeroBalances.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const minBalance = Math.min(...nonZeroBalances.map(card => card.currentBalance || 0))
    const cardsWithMinBalance = nonZeroBalances.filter(card => (card.currentBalance || 0) === minBalance)
    
    const cardDetails = cardsWithMinBalance.map(balance => {
      const primaryCard = primaryCards.find(card => card.plaid_account_id === balance.plaid_account_id)
      return {
        name: balance.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : balance.cardType,
        lastFive: primaryCard ? `-${primaryCard.lastFive}` : "",
        amount: `$${(balance.currentBalance || 0).toLocaleString()}`,
        type: "current balance",
        image: getCardImage(balance.cardType.toLowerCase())
      }
    })

    return {
      amount: `$${minBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances, primaryCards])

  // Calculate urgent balance (highest non-business balance closing this week)
  const urgentBalanceData = React.useMemo((): MetricResult => {
    const today = new Date()
    const currentDay = today.getDate()
    
    console.log('Urgent Balance Debug:', {
      today: today.toISOString(),
      currentDay,
      totalPrimaryCards: primaryCards.length,
      totalCardBalances: cardBalances.length
    })
    
    // Get cards closing this week (non-business)
    const cardsClosingThisWeek = primaryCards.filter(card => {
      const isNonBusiness = !card.cardType.toLowerCase().includes('business')
      const daysUntilClosing = card.closingDate >= currentDay 
        ? card.closingDate - currentDay 
        : (30 - currentDay) + card.closingDate
      const closingThisWeek = daysUntilClosing <= 7 && daysUntilClosing >= 0
      
      console.log('Card closing check:', {
        cardType: card.cardType,
        closingDate: card.closingDate,
        isNonBusiness,
        daysUntilClosing,
        closingThisWeek
      })
      
      return isNonBusiness && closingThisWeek
    })

    if (cardsClosingThisWeek.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    console.log('Cards closing this week:', cardsClosingThisWeek.length, cardsClosingThisWeek.map(c => ({ cardType: c.cardType, closingDate: c.closingDate, plaid_account_id: c.plaid_account_id })))

    if (cardsClosingThisWeek.length === 0) {
      console.log('No cards closing this week found')
      return {
        amount: "$0",
        cards: []
      }
    }

    // Get balances for these cards
    const urgentCardBalances = cardBalances.filter(balance => 
      cardsClosingThisWeek.some(card => card.plaid_account_id === balance.plaid_account_id)
    )

    console.log('Urgent card balances found:', urgentCardBalances.length, urgentCardBalances.map(b => ({ cardType: b.cardType, currentBalance: b.currentBalance, plaid_account_id: b.plaid_account_id })))

    if (urgentCardBalances.length === 0) {
      console.log('No balances found for cards closing this week')
      return {
        amount: "$0",
        cards: []
      }
    }

    const maxUrgentBalance = Math.max(...urgentCardBalances.map(card => card.currentBalance || 0))
    const urgentCard = urgentCardBalances.find(card => (card.currentBalance || 0) === maxUrgentBalance)
    
    if (!urgentCard) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const primaryCard = primaryCards.find(card => card.plaid_account_id === urgentCard.plaid_account_id)
    const currentMonth = today.toLocaleString('default', { month: 'long' })
    
    const cardDetails = [{
      name: urgentCard.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : urgentCard.cardType,
      lastFive: primaryCard ? `-${primaryCard.lastFive}` : "",
      amount: `$${(urgentCard.currentBalance || 0).toLocaleString()}`,
      type: `closing ${currentMonth} ${primaryCard?.closingDate}`,
      image: getCardImage(urgentCard.cardType.toLowerCase())
    }]

    return {
      amount: `$${maxUrgentBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances, primaryCards])

  return {
    highestBalanceData,
    lowestBalanceData,
    urgentBalanceData
  }
}