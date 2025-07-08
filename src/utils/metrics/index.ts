
import React from "react"
import { transactionFilterService } from "@/services/transaction"
import { MetricData } from "./types"
import { useBalanceMetrics } from "./balanceMetrics"
import { useCreditLimitMetrics } from "./creditLimitMetrics"
import { useCardTypeMetrics } from "./cardTypeMetrics"
import { useDateBasedMetrics } from "./dateBasedMetrics"
import { useFeeMetrics } from "./feeMetrics"
import { getStaticMetrics } from "./staticMetrics"
import { useAdminBalanceMetrics } from "./adminBalanceMetrics"

export const useUnifiedMetricsData = () => {
  const { totalCurrentBalanceData, getCardBalance } = useBalanceMetrics()
  const { highestCreditLimitData, lowestPayOverTimeLimitData } = useCreditLimitMetrics()
  const { brandPartnerCardsData, noAnnualFeeCardsData, annualFeeCardsData } = useCardTypeMetrics()
  const { closingThisWeekData, dueThisWeekData } = useDateBasedMetrics(getCardBalance)
  const { totalAnnualFeesData } = useFeeMetrics()
  const { businessCreditLimitData } = getStaticMetrics()
  const { highestBalanceData, lowestBalanceData, urgentBalanceData } = useAdminBalanceMetrics()

  // Get dynamic card count from transaction filter service
  const activeCardCount = React.useMemo(() => {
    return transactionFilterService.getUniqueCardAccounts().length
  }, [])

  // All available metrics
  const allMetrics: Record<string, MetricData> = {
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
      value: totalCurrentBalanceData.amount!,
      description: "Total current balance across all cards",
      dataSource: "Card Balance Database",
      lastUpdated: "Real-time",
      calculationMethod: "Sum of current balances from card_balances table",
      cardData: totalCurrentBalanceData.cards
    },
    "Highest Credit Limit": {
      title: "Highest Credit Limit",
      value: highestCreditLimitData.amount!,
      description: "The highest credit limit among all active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Maximum credit limit across all primary card accounts",
      cardData: highestCreditLimitData.cards
    },
    "Lowest Pay Over Time Limit": {
      title: "Lowest Pay Over Time Limit",
      value: lowestPayOverTimeLimitData.amount!,
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
    "Brand Partnerships": {
      title: "Brand Partnerships",
      value: brandPartnerCardsData.count!.toString(),
      description: "Number of active brand partner card programs",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily", 
      calculationMethod: "Count of primary cards with brand partner status",
      cardData: brandPartnerCardsData.cards
    },
    "Closing this week": {
      title: "Closing this week",
      value: closingThisWeekData.count!.toString(),
      description: "Cards with closing dates in the next 7 days",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards closing within 7 days of current date",
      cardData: closingThisWeekData.cards
    },
    "Due this week": {
      title: "Due this week",
      value: dueThisWeekData.count!.toString(),
      description: "Cards with payment due dates in the next 7 days",
      dataSource: "Primary Cards Configuration", 
      lastUpdated: "Updated daily",
      calculationMethod: "Count of cards with payments due within 7 days of current date",
      cardData: dueThisWeekData.cards
    },
    "No Annual Fee": {
      title: "No Annual Fee",
      value: noAnnualFeeCardsData.count!.toString(),
      description: "Number of cards with no annual fee",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Count of primary cards with $0 annual fee",
      cardData: noAnnualFeeCardsData.cards
    },
    "Annual Fee": {
      title: "Annual Fee",
      value: annualFeeCardsData.count!.toString(),
      description: "Number of cards with annual fees",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily", 
      calculationMethod: "Count of primary cards with annual fees greater than $0",
      cardData: annualFeeCardsData.cards
    },
    "Total Annual Fees": {
      title: "Total Annual Fees",
      value: totalAnnualFeesData.amount!,
      description: "Sum of all annual fees across active cards",
      dataSource: "Primary Cards Configuration",
      lastUpdated: "Updated daily",
      calculationMethod: "Sum of annual fees for all primary card accounts",
      cardData: totalAnnualFeesData.cards
    },
    "Highest Balance": {
      title: "Highest Balance",
      value: highestBalanceData.amount!,
      description: "Highest current balance across all cards",
      dataSource: "Card Balance Database",
      lastUpdated: "Real-time",
      calculationMethod: "Maximum current balance from card_balances table",
      cardData: highestBalanceData.cards
    },
    "Lowest Balance": {
      title: "Lowest Balance",
      value: lowestBalanceData.amount!,
      description: "Lowest current balance across all cards",
      dataSource: "Card Balance Database",
      lastUpdated: "Real-time",
      calculationMethod: "Minimum current balance from card_balances table",
      cardData: lowestBalanceData.cards
    },
    "Urgent Balance": {
      title: "Urgent Balance",
      value: urgentBalanceData.amount!,
      description: "Highest non-business balance closing this week",
      dataSource: "Card Balance Database",
      lastUpdated: "Real-time",
      calculationMethod: "Maximum balance among non-business cards closing within 7 days",
      cardData: urgentBalanceData.cards
    }
  }

  return allMetrics
}

// Re-export types for backward compatibility
export * from "./types"
