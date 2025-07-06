
import { Transaction } from "@/types/transaction"
import { transactionFilterService } from "@/services/transaction"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"

export interface CardBalance {
  cardType: string
  lastFive: string
  balance: number
  creditLimit: number
  availableCredit: number
}

class CardBalanceService {
  private static instance: CardBalanceService
  private cardBalances: Map<string, CardBalance> = new Map()
  private isInitialized = false

  private constructor() {}

  public static getInstance(): CardBalanceService {
    if (!CardBalanceService.instance) {
      CardBalanceService.instance = new CardBalanceService()
    }
    return CardBalanceService.instance
  }

  public async initializeBalances(): Promise<void> {
    if (this.isInitialized) return

    console.log("Initializing card balances...")
    
    try {
      // Get all transactions
      const allTransactions = transactionFilterService.getAllTransactions()
      console.log("Total transactions for balance calculation:", allTransactions.length)
      
      // Get all primary cards
      const primaryCards = getAllPrimaryCards()
      console.log("Primary cards:", primaryCards.length)
      
      // Initialize balances for all primary cards
      primaryCards.forEach(card => {
        const cardKey = this.getCardKey(card.cardType, card.lastFive)
        
        // Calculate balance for this card by summing all transactions
        const cardTransactions = allTransactions.filter(t => 
          this.matchesCard(t, card.cardType, card.lastFive)
        )
        
        // Sum all transactions (positive = credits/payments, negative = expenses)
        const balance = cardTransactions.reduce((sum, transaction) => {
          return sum + transaction.amount
        }, 0)
        
        // Balance should be positive for amounts owed (expenses exceed payments)
        const actualBalance = Math.abs(balance)
        
        const cardBalance: CardBalance = {
          cardType: card.cardType,
          lastFive: card.lastFive,
          balance: actualBalance,
          creditLimit: card.creditLimit,
          availableCredit: Math.max(0, card.creditLimit - actualBalance)
        }
        
        this.cardBalances.set(cardKey, cardBalance)
        
        console.log(`Card ${card.cardType} (${card.lastFive}): Balance $${actualBalance.toFixed(2)}, Transactions: ${cardTransactions.length}`)
      })
      
      this.isInitialized = true
      console.log("Card balances initialized successfully")
      
    } catch (error) {
      console.error("Error initializing card balances:", error)
    }
  }

  private getCardKey(cardType: string, lastFive: string): string {
    return `${cardType.toLowerCase()}-${lastFive}`
  }

  private matchesCard(transaction: Transaction, cardType: string, lastFive: string): boolean {
    // Match by last five digits
    if (transaction.last_five === lastFive) {
      return true
    }
    
    // Also try to match by account type if last_five doesn't match exactly
    const accountType = transaction.account_type?.toLowerCase() || transaction.account?.toLowerCase() || ''
    const normalizedCardType = cardType.toLowerCase()
    
    // Simple matching - can be enhanced with more sophisticated logic
    return accountType.includes(normalizedCardType.split(' ')[0]) || 
           normalizedCardType.includes(accountType.split(' ')[0])
  }

  public getCardBalance(cardType: string, lastFive: string): number {
    if (!this.isInitialized) {
      console.warn("Card balances not initialized, returning 0")
      return 0
    }
    
    const cardKey = this.getCardKey(cardType, lastFive)
    const cardBalance = this.cardBalances.get(cardKey)
    
    return cardBalance?.balance || 0
  }

  public getCardBalanceFormatted(cardType: string, lastFive: string): string {
    const balance = this.getCardBalance(cardType, lastFive)
    return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  public getAllCardBalances(): CardBalance[] {
    return Array.from(this.cardBalances.values())
  }

  public async refreshBalances(): Promise<void> {
    this.isInitialized = false
    this.cardBalances.clear()
    await this.initializeBalances()
  }
}

export const cardBalanceService = CardBalanceService.getInstance()
