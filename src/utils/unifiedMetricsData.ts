
import React from "react"
import { transactionFilterService } from "@/services/transaction"
import { getAllPrimaryCards, getBrandPartnerCards } from "@/data/staticPrimaryCards"
import { getCardImage } from "@/utils/cardImageUtils"
import { CardBalanceService } from "@/services/cardBalanceService"
import { useAuth } from "@/contexts/AuthContext"

export const useUnifiedMetricsData = () => {
  const { user, loading: authLoading } = useAuth()

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
      cards: cardDetails.map(card => ({
        ...card,
        type: `${card.type} • ${card.multiple}`
      }))
    }
  }, [])

  // State for async card data with balances
  const [closingCards, setClosingCards] = React.useState<any>({ count: 0, cards: [] })
  const [dueCards, setDueCards] = React.useState<any>({ count: 0, cards: [] })
  const [isLoadingBalances, setIsLoadingBalances] = React.useState(true)

  // Fetch card balances and calculate closing/due cards - only when authenticated
  React.useEffect(() => {
    // Don't fetch if auth is still loading or user is not authenticated
    if (authLoading || !user) {
      console.log("Skipping card balance fetch - user not authenticated yet")
      setIsLoadingBalances(false)
      return
    }

    const fetchCardDataWithBalances = async () => {
      try {
        setIsLoadingBalances(true)
        console.log("Starting to fetch card balances for authenticated user...")
        
        // Clear cache to ensure fresh data
        CardBalanceService.clearCache()
        
        // Pre-fetch all balances to populate cache
        const allBalances = await CardBalanceService.getBalances(false)
        console.log("Fetched all balances:", allBalances.map(b => ({ cardType: b.cardType, balance: b.currentBalance })))
        
        const primaryCards = getAllPrimaryCards()
        const today = new Date()
        const currentDay = today.getDate()
        const currentMonth = today.toLocaleString('default', { month: 'long' })
        
        // Calculate cards closing this week
        const cardsClosingThisWeek = primaryCards.filter(card => {
          const daysUntilClosing = card.closingDate >= currentDay 
            ? card.closingDate - currentDay 
            : (30 - currentDay) + card.closingDate
          return daysUntilClosing <= 7 && daysUntilClosing >= 0
        })
        
        console.log("Cards closing this week:", cardsClosingThisWeek.map(c => c.cardType))
        
        const closingCardDetails = await Promise.all(
          cardsClosingThisWeek.map(async (card) => {
            console.log(`Fetching balance for closing card: ${card.cardType}`)
            const balance = await CardBalanceService.getBalanceByCardType(card.cardType)
            const formattedBalance = CardBalanceService.formatBalance(balance)
            console.log(`Balance for ${card.cardType}: ${balance} -> ${formattedBalance}`)
            
            return {
              name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
              lastFive: `-${card.lastFive}`,
              amount: `${formattedBalance} • Closing ${currentMonth} ${card.closingDate}`,
              type: "",
              image: getCardImage(card.cardType.toLowerCase()),
              closingDate: card.closingDate
            }
          })
        )

        // Sort by closing date
        closingCardDetails.sort((a, b) => a.closingDate - b.closingDate)

        // Calculate cards due this week
        const cardsDueThisWeek = primaryCards.filter(card => {
          const daysUntilDue = card.dueDate >= currentDay 
            ? card.dueDate - currentDay 
            : (30 - currentDay) + card.dueDate
          return daysUntilDue <= 7 && daysUntilDue >= 0
        })
        
        console.log("Cards due this week:", cardsDueThisWeek.map(c => c.cardType))
        
        const dueCardDetails = await Promise.all(
          cardsDueThisWeek.map(async (card) => {
            console.log(`Fetching balance for due card: ${card.cardType}`)
            const balance = await CardBalanceService.getBalanceByCardType(card.cardType)
            const formattedBalance = CardBalanceService.formatBalance(balance)
            console.log(`Balance for ${card.cardType}: ${balance} -> ${formattedBalance}`)
            
            return {
              name: card.cardType === "Bonvoy Business Amex" ? "Marriott Bonvoy Business" : card.cardType,
              lastFive: `-${card.lastFive}`,
              amount: `${formattedBalance} • Due ${currentMonth} ${card.dueDate}`,
              type: "",
              image: getCardImage(card.cardType.toLowerCase()),
              dueDate: card.dueDate
            }
          })
        )

        // Sort by due date
        dueCardDetails.sort((a, b) => a.dueDate - b.dueDate)

        setClosingCards({
          count: cardsClosingThisWeek.length,
          cards: closingCardDetails
        })
        
        setDueCards({
          count: cardsDueThisWeek.length,
          cards: dueCardDetails
        })
        
        console.log("Updated closing cards:", closingCardDetails)
        console.log("Updated due cards:", dueCardDetails)
        
      } catch (error) {
        console.error("Error fetching card balances:", error)
      } finally {
        setIsLoadingBalances(false)
      }
    }

    fetchCardDataWithBalances()
  }, [user, authLoading]) // Re-run when user authentication state changes

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
      value: (authLoading || !user) ? "..." : (isLoadingBalances ? "..." : closingCards.count.toString()),
      description: "Cards with closing dates in the next 7 days",
      dataSource: "Primary Cards Configuration & Card Balance System",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards closing within 7 days of current date",
      cardData: closingCards.cards
    },
    "Due this week": {
      title: "Due this week",
      value: (authLoading || !user) ? "..." : (isLoadingBalances ? "..." : dueCards.count.toString()),
      description: "Cards with payment due dates in the next 7 days",
      dataSource: "Primary Cards Configuration & Card Balance System", 
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards with payments due within 7 days of current date",
      cardData: dueCards.cards
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
