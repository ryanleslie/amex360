import { Transaction } from "@/types/transaction"
import { FilterState } from "@/hooks/useFilterState"
import { TransactionDataProcessor } from "./TransactionDataProcessor"
import { TransactionFilters } from "./TransactionFilters"
import { TransactionCalculations } from "./TransactionCalculations"

export class TransactionFilterService {
  private static instance: TransactionFilterService
  private allTransactions: Transaction[]

  private constructor() {
    // Parse and cache all transactions once
    this.allTransactions = TransactionDataProcessor.processStaticData()
  }

  public static getInstance(): TransactionFilterService {
    if (!TransactionFilterService.instance) {
      TransactionFilterService.instance = new TransactionFilterService()
    }
    return TransactionFilterService.instance
  }

  public getAllTransactions(): Transaction[] {
    return this.allTransactions
  }

  public getFilteredTransactions(filters: FilterState): Transaction[] {
    let filtered = [...this.allTransactions]
    
    console.log("All transactions count:", filtered.length)
    console.log("Current filters:", filters)
    
    // Apply either time range OR date filter (mutually exclusive)
    if (filters.selectedDate) {
      // If a specific date is selected, use only that date
      filtered = TransactionFilters.applyDateFilter(filtered, filters.selectedDate)
      console.log("After date filter:", filtered.length)
    } else {
      // Otherwise, apply time range filter
      filtered = TransactionFilters.applyTimeRangeFilter(filtered, filters.selectedTimeRange)
      console.log("After time range filter:", filtered.length)
    }
    
    // Apply card filter
    filtered = TransactionFilters.applyCardFilter(filtered, filters.selectedCard)
    console.log("After card filter:", filtered.length)
    
    // Apply expense/credit filters
    filtered = TransactionFilters.applyExpenseCreditFilters(filtered, filters)
    console.log("After expense/credit filter:", filtered.length)
    
    return filtered
  }

  public getUniqueCardAccounts(): string[] {
    return TransactionDataProcessor.getUniqueCardAccounts(this.allTransactions)
  }

  public getTransactionsForCalculations(timeRange: string): Transaction[] {
    return this.getFilteredTransactions({ 
      selectedCard: "all", 
      globalFilter: "", 
      selectedTimeRange: timeRange 
    })
  }

  public getDailySpendingData(timeRange: string): Array<{ date: string; totalSpend: number }> {
    const transactions = this.getTransactionsForCalculations(timeRange)
    return TransactionCalculations.getDailySpendingData(transactions, timeRange)
  }

  public refreshData(): void {
    console.log("Refreshing transaction data from CSV...")
    try {
      // Reload transactions from CSV
      this.allTransactions = TransactionDataProcessor.processStaticData()
      console.log(`Refreshed ${this.allTransactions.length} transactions`)
    } catch (error) {
      console.error("Failed to refresh transaction data:", error)
      throw new Error("Failed to refresh transaction data")
    }
  }
}
