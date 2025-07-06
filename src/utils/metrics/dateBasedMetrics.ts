
import React from "react"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const useDateBasedMetrics = (getCardBalance: (cardType: string) => number) => {
  // Calculate cards closing this week
  const closingThisWeekData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.toLocaleString('default', { month: 'long' })
    
    // Get cards that close within the next 7 days
    const cardsClosingThisWeek = primaryCards.filter(card => {
      const daysUntilClosing = card.closingDate >= currentDay 
        ? card.closingDate - currentDay 
        : (30 - currentDay) + card.closingDate // Handle month rollover
      return daysUntilClosing <= 7 && daysUntilClosing >= 0
    })
    
    const cardDetails = cardsClosingThisWeek.map(card => {
      const balance = getCardBalance(card.cardType)
      return {
        name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
        lastFive: `-${card.lastFive}`,
        amount: `$${balance.toLocaleString()}`,
        type: `closing ${currentMonth} ${card.closingDate}`,
        image: getCardImage(card.cardType.toLowerCase())
      }
    })

    // Sort by closing date
    cardDetails.sort((a, b) => {
      const dateA = parseInt(a.type.split(' ')[2])
      const dateB = parseInt(b.type.split(' ')[2])
      return dateA - dateB
    })

    return {
      count: cardsClosingThisWeek.length,
      cards: cardDetails
    }
  }, [getCardBalance])

  // Calculate cards due this week
  const dueThisWeekData = React.useMemo((): MetricResult => {
    const primaryCards = getAllPrimaryCards()
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.toLocaleString('default', { month: 'long' })
    
    // Get cards that are due within the next 7 days
    const cardsDueThisWeek = primaryCards.filter(card => {
      const daysUntilDue = card.dueDate >= currentDay 
        ? card.dueDate - currentDay 
        : (30 - currentDay) + card.dueDate // Handle month rollover
      return daysUntilDue <= 7 && daysUntilDue >= 0
    })
    
    const cardDetails = cardsDueThisWeek.map(card => {
      const balance = getCardBalance(card.cardType)
      return {
        name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
        lastFive: `-${card.lastFive}`,
        amount: `$${balance.toLocaleString()}`,
        type: `due ${currentMonth} ${card.dueDate}`,
        image: getCardImage(card.cardType.toLowerCase())
      }
    })

    // Sort by due date
    cardDetails.sort((a, b) => {
      const dateA = parseInt(a.type.split(' ')[2])
      const dateB = parseInt(b.type.split(' ')[2])
      return dateA - dateB
    })

    return {
      count: cardsDueThisWeek.length,
      cards: cardDetails
    }
  }, [getCardBalance])

  return {
    closingThisWeekData,
    dueThisWeekData
  }
}
