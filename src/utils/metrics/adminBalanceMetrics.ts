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
      const today = new Date()
      const currentMonth = today.toLocaleString('default', { month: 'long' })
      return {
        name: balance.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : balance.cardType,
        lastFive: primaryCard ? `-${primaryCard.lastFive}` : "",
        amount: `$${(balance.currentBalance || 0).toLocaleString()} balance`,
        type: `closing ${currentMonth} ${primaryCard?.closingDate}`,
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
      const today = new Date()
      const currentMonth = today.toLocaleString('default', { month: 'long' })
      return {
        name: balance.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : balance.cardType,
        lastFive: primaryCard ? `-${primaryCard.lastFive}` : "",
        amount: `$${(balance.currentBalance || 0).toLocaleString()} balance`,
        type: `closing ${currentMonth} ${primaryCard?.closingDate}`,
        image: getCardImage(balance.cardType.toLowerCase())
      }
    })

    return {
      amount: `$${minBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances, primaryCards])

  // Calculate urgent balances (all non-business balances closing this week)
  const urgentBalanceData = React.useMemo((): MetricResult => {
    const today = new Date()
    const currentDay = today.getDate()
    
    // Get cards closing this week (non-business)
    const cardsClosingThisWeek = primaryCards.filter(card => {
      const isNonBusiness = !card.cardType.toLowerCase().includes('business')
      const daysUntilClosing = card.closingDate >= currentDay 
        ? card.closingDate - currentDay 
        : (30 - currentDay) + card.closingDate
      return isNonBusiness && daysUntilClosing <= 7 && daysUntilClosing >= 0
    })

    if (cardsClosingThisWeek.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    // Get balances for these cards (only cards with balance > 0)
    const urgentCardBalances = cardBalances.filter(balance => 
      cardsClosingThisWeek.some(card => card.plaid_account_id === balance.plaid_account_id) &&
      (balance.currentBalance || 0) > 0
    )

    if (urgentCardBalances.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    // Calculate total of all urgent balances
    const totalUrgentBalance = urgentCardBalances.reduce((sum, card) => sum + (card.currentBalance || 0), 0)
    const currentMonth = today.toLocaleString('default', { month: 'long' })
    
    // Create card details for all urgent cards
    const cardDetails = urgentCardBalances.map(balance => {
      const primaryCard = primaryCards.find(card => card.plaid_account_id === balance.plaid_account_id)
      return {
        name: balance.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : balance.cardType,
        lastFive: primaryCard ? `-${primaryCard.lastFive}` : "",
        amount: `$${(balance.currentBalance || 0).toLocaleString()}`,
        type: `closing ${currentMonth} ${primaryCard?.closingDate || ''}`,
        image: getCardImage(balance.cardType.toLowerCase()),
        dueDate: primaryCard?.dueDate || 99 // Use 99 as fallback for sorting
      }
    })

    // Sort by due date ascending
    cardDetails.sort((a, b) => a.dueDate - b.dueDate)

    return {
      amount: `$${totalUrgentBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances, primaryCards])

  return {
    highestBalanceData,
    lowestBalanceData,
    urgentBalanceData
  }
}