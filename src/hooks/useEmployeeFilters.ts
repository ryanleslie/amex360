
import React from 'react'
import { useFilterState } from './useFilterState'
import { EmployeeTransaction } from '@/components/employee/EmployeeTransactionColumns'
import { employeeCardBonuses } from '@/data/staticEmployeeCards'

export function useEmployeeFilters(employeeTransactions: EmployeeTransaction[]) {
  const { filters, updateFilter, updateMultipleFilters } = useFilterState()
  const [showPendingCardsOnly, setShowPendingCardsOnly] = React.useState(false)

  // Get unique card types for the dropdown
  const uniqueCardTypes = React.useMemo(() => {
    const cardTypes = new Set<string>()
    employeeTransactions.forEach(transaction => {
      cardTypes.add(transaction.card_type)
    })
    return Array.from(cardTypes).sort()
  }, [employeeTransactions])

  // Filter transactions based on current state
  const filteredTransactions = React.useMemo(() => {
    let filtered = employeeTransactions

    // State B: Filter by card type only
    if (filters.selectedCardType && filters.selectedCardType !== "all" && (!filters.selectedLastFive || filters.selectedLastFive === "all")) {
      filtered = filtered.filter(transaction => transaction.card_type === filters.selectedCardType)
    }
    
    // State C: Filter by both card type and last five (must match both)
    if (filters.selectedCardType && filters.selectedCardType !== "all" && filters.selectedLastFive && filters.selectedLastFive !== "all") {
      filtered = filtered.filter(transaction => 
        transaction.card_type === filters.selectedCardType && transaction.last_five === filters.selectedLastFive
      )
    }

    return filtered
  }, [employeeTransactions, filters.selectedCardType, filters.selectedLastFive])

  // Determine current state
  const isStateA = (!filters.selectedCardType || filters.selectedCardType === "all") && (!filters.selectedLastFive || filters.selectedLastFive === "all")
  const isStateB = (filters.selectedCardType && filters.selectedCardType !== "all") && (!filters.selectedLastFive || filters.selectedLastFive === "all")
  const isStateC = (filters.selectedCardType && filters.selectedCardType !== "all") && (filters.selectedLastFive && filters.selectedLastFive !== "all")

  const hasAnyFilter = !isStateA || showPendingCardsOnly

  const handleClearAllFilters = () => {
    updateMultipleFilters({
      selectedCardType: 'all',
      selectedLastFive: 'all'
    })
    setShowPendingCardsOnly(false)
  }

  const handleCardDropdownChange = (cardSelection: string) => {
    if (cardSelection === "all") {
      // Go to State A - show all cards
      updateMultipleFilters({
        selectedCardType: 'all',
        selectedLastFive: 'all'
      })
    } else {
      // Go to State B - show card group
      updateMultipleFilters({
        selectedCardType: cardSelection,
        selectedLastFive: 'all'
      })
    }
  }

  const handleCardClick = (lastFive: string, cardType?: string) => {
    console.log('Card clicked:', { lastFive, cardType, currentState: { isStateA, isStateB, isStateC }, currentFilters: filters })
    
    if (isStateC && filters.selectedLastFive === lastFive && filters.selectedCardType === cardType) {
      // Currently on State C with this exact card selected - go back to State B
      updateMultipleFilters({
        selectedLastFive: 'all'
      })
    } else {
      // We need the card type from the clicked card
      // If not provided, find it from the transactions
      let targetCardType = cardType
      if (!targetCardType) {
        const transaction = employeeTransactions.find(t => t.last_five === lastFive && t.card_type)
        targetCardType = transaction?.card_type
      }
      
      console.log('Setting filters to:', { cardType: targetCardType, lastFive })
      
      if (targetCardType) {
        // Go to State C - show specific card (card type + last five)
        updateMultipleFilters({
          selectedCardType: targetCardType,
          selectedLastFive: lastFive
        })
      }
    }
  }

  const handleTotalCardsClick = () => {
    // Toggle the pending cards filter
    setShowPendingCardsOnly(!showPendingCardsOnly)
    // Clear other filters when showing pending cards
    if (!showPendingCardsOnly) {
      updateMultipleFilters({
        selectedCardType: 'all',
        selectedLastFive: 'all'
      })
    }
  }

  // Calculate which cards to show in the list based on current state
  const getCardsToShow = () => {
    let cardsToShow = employeeTransactions

    if (showPendingCardsOnly) {
      // Filter to only show cards with hasBonus: false
      const pendingCardKeys = employeeCardBonuses
        .filter(card => !card.hasBonus)
        .map(card => card.cardKey)
      
      cardsToShow = employeeTransactions.filter(transaction => {
        const cardKey = `${transaction.card_type}-${transaction.last_five}`
        return pendingCardKeys.includes(cardKey)
      })
    } else if (isStateA) {
      // State A: Show all cards
      cardsToShow = employeeTransactions
    } else if (isStateB) {
      // State B: Show only cards of the selected type
      cardsToShow = employeeTransactions.filter(t => t.card_type === filters.selectedCardType)
    } else {
      // State C: Show only the selected card (matching both type and last five)
      cardsToShow = employeeTransactions.filter(t => 
        t.card_type === filters.selectedCardType && t.last_five === filters.selectedLastFive
      )
    }

    return cardsToShow
  }

  const getFilterDisplayText = () => {
    if (showPendingCardsOnly) {
      return "Cards pending award"
    } else if (isStateA) {
      return ""
    } else if (isStateB) {
      return `Business ${filters.selectedCardType}` || ""
    } else if (isStateC) {
      return `Business ${filters.selectedCardType}, ${filters.selectedLastFive}`
    }
    return ""
  }

  const getCardDropdownDisplayText = () => {
    if (isStateA) {
      return "all"
    } else if (isStateB) {
      return filters.selectedCardType || "all"
    } else if (isStateC) {
      return `${filters.selectedCardType} (${filters.selectedLastFive})`
    }
    return "all"
  }

  return {
    filters,
    updateFilter,
    uniqueCardTypes,
    filteredTransactions,
    hasAnyFilter,
    handleClearAllFilters,
    handleCardDropdownChange,
    handleCardClick,
    handleTotalCardsClick,
    getCardsToShow,
    getFilterDisplayText,
    getCardDropdownDisplayText,
    showPendingCardsOnly
  }
}
