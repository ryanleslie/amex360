import React from "react"
import { transactionFilterService } from "@/services/transaction"
import { getAllPrimaryCards, getBrandPartnerCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { useCardBalances } from "@/hooks/useCardBalances"

export const useUnifiedMetricsData = () => {
  const { cardBalances } = useCardBalances()

  // Get dynamic card count from transaction filter service
  const activeCardCount = React.useMemo(() => {
    return transactionFilterService.getUniqueCardAccounts().length
  }, [])

  // Helper function to get balance for a card with specific matching logic
  const getCardBalance = React.useCallback((cardType: string) => {
    // Handle specific card type mappings
    const getMatchingCardType = (cardType: string) => {
      const normalizedCardType = cardType.toLowerCase()
      
      // Specific mapping for Business Blue Plus cards
      if (normalizedCardType.includes('business blue plus i') && !normalizedCardType.includes('ii')) {
        return 'Business Blue Plus I'
      }
      if (normalizedCardType.includes('business blue plus ii')) {
        return 'Business Blue Plus II'
      }
      
      return cardType
    }
    
    const targetCardType = getMatchingCardType(cardType)
    
    const balance = cardBalances.find(card => {
      const cardTypeLower = card.cardType.toLowerCase()
      const targetLower = targetCardType.toLowerCase()
      
      // Exact match first
      if (cardTypeLower === targetLower) {
        return true
      }
      
      // For Business Blue Plus cards, be more specific
      if (targetLower.includes('business blue plus i') && !targetLower.includes('ii')) {
        return cardTypeLower === 'business blue plus i'
      }
      if (targetLower.includes('business blue plus ii')) {
        return cardTypeLower === 'business blue plus ii'
      }
      
      // General matching for other cards
      return cardTypeLower.includes(targetLower) || targetLower.includes(cardTypeLower)
    })
    
    return balance?.currentBalance || 0
  }, [cardBalances])

  // Calculate total current balances from Supabase data
  const totalCurrentBalanceData = React.useMemo(() => {
    if (cardBalances.length === 0) {
      return {
        amount: "$0",
        cards: []
      }
    }

    const totalBalance = cardBalances.reduce((sum, card) => {
      return sum + (card.currentBalance || 0)
    }, 0)

    const cardDetails = cardBalances.map(card => ({
      name: card.cardType,
      lastFive: "",
      amount: `$${(card.currentBalance || 0).toLocaleString()}`,
      type: "current balance",
      image: getCardImage(card.cardType.toLowerCase())
    }))

    // Sort by balance (highest first)
    cardDetails.sort((a, b) => {
      const balanceA = parseInt(a.amount.replace('$', '').replace(',', ''))
      const balanceB = parseInt(b.amount.replace('$', '').replace(',', ''))
      return balanceB - balanceA
    })

    return {
      amount: `$${totalBalance.toLocaleString()}`,
      cards: cardDetails
    }
  }, [cardBalances])

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
      cards: cardDetails.map(card => ({
        ...card,
        type: `${card.type} • ${card.multiple}`
      }))
    }
  }, [])

  // Calculate cards closing this week
  const closingThisWeekData = React.useMemo(() => {
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
  const dueThisWeekData = React.useMemo(() => {
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

  // Static business credit limit data
  const businessCreditLimitData = {
    cards: [
      {
        name: "Business Line of Credit",
        lastFive: "-4156",
        amount: "$2,000,000", 
        type: "installment",
        image: getCardImage("bloc")
      },
    ]
  }

  // All available metrics
  const allMetrics = {
    "Active Card Accounts": {
      title: "Active Card Accounts",
      value: activeCardCount.toString(),
      description: "Total number of active card accounts",
      dataSource: "Transaction Data System",
      lastUpdated: "Real-time",
      calculationMethod: "Count of unique card accounts from transaction data",
      cardData: null
    },
    "Total Current Balance": {
      title: "Total Current Balance",
      value: totalCurrentBalanceData.amount,
      description: "Total current balance across all cards",
      dataSource: "Card Balance Database",
      lastUpdated: "Real-time",
      calculationMethod: "Sum of current balances from card_balances table",
      cardData: totalCurrentBalanceData.cards
    },
    "Highest Credit Limit": {
      title: "Highest Credit Limit",
      value: highestCreditLimitData.amount,
      description: "The highest credit limit among all active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Maximum credit limit across all primary card accounts",
      cardData: highestCreditLimitData.cards
    },
    "Lowest Pay Over Time Limit": {
      title: "Lowest Pay Over Time Limit",
      value: lowestPayOverTimeLimitData.amount,
      description: "The lowest pay over time limit across all accounts",
      dataSource: "Primary Cards Configuration", 
      lastUpdated: "Updated daily",
      calculationMethod: "Minimum pay over time limit for active accounts",
      cardData: lowestPayOverTimeLimitData.cards
    },
    "Available Line of Credit": {
      title: "Available Line of Credit",
      value: "$2M",
      description: "Total available business line of credit",
      dataSource: "Underwriting System",
      lastUpdated: "Real-time",  
      calculationMethod: "Sum of (credit limit - current balance)",
      cardData: businessCreditLimitData.cards
    },
    "Brand Partner Cards": {
      title: "Brand Partner Cards",
      value: brandPartnerCardsData.count.toString(),
      description: "Number of active brand partner card programs",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily", 
      calculationMethod: "Count of primary cards with brand partner status",
      cardData: brandPartnerCardsData.cards
    },
    "Closing this week": {
      title: "Closing this week",
      value: closingThisWeekData.count.toString(),
      description: "Cards with closing dates in the next 7 days",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards closing within 7 days of current date",
      cardData: closingThisWeekData.cards
    },
    "Due this week": {
      title: "Due this week",
      value: dueThisWeekData.count.toString(),
      description: "Cards with payment due dates in the next 7 days",
      dataSource: "Primary Cards Configuration", 
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards with payments due within 7 days of current date",
      cardData: dueThisWeekData.cards
    },
    "No Annual Fee": {
      title: "No Annual Fee",
      value: noAnnualFeeCardsData.count.toString(),
      description: "Number of cards with no annual fee",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of primary cards with $0 annual fee",
      cardData: noAnnualFeeCardsData.cards
    },
    "Annual Fee": {
      title: "Annual Fee",
      value: annualFeeCardsData.count.toString(),
      description: "Number of cards with annual fees",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily", 
      calculationMethod: "Count of primary cards with annual fees greater than $0",
      cardData: annualFeeCardsData.cards
    },
    "Total Annual Fees": {
      title: "Total Annual Fees",
      value: totalAnnualFeesData.amount,
      description: "Sum of all annual fees across active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Sum of annual fees for all primary card accounts",
      cardData: totalAnnualFeesData.cards
    }
  }

  return allMetrics
}
