import { transactionFilterService } from "@/services/transaction"
import { Transaction } from "@/types/transaction"
import { getAllPrimaryCards } from "@/data/staticPrimaryCards"

export class CardBalanceService {
  private static instance: CardBalanceService
  private cardBalances: Map<string, number> = new Map()
  private isInitialized: boolean = false

  private constructor() {}

  public static getInstance(): CardBalanceService {
    if (!CardBalanceService.instance) {
      CardBalanceService.instance = new CardBalanceService()
    }
    return CardBalanceService.instance
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    console.log('Initializing CardBalanceService...')
    
    try {
      // Initialize all primary cards with zero balance first
      const primaryCards = getAllPrimaryCards()
      console.log(`Initializing ${primaryCards.length} primary cards`)
      
      primaryCards.forEach(card => {
        this.cardBalances.set(card.cardType, 0)
        console.log(`Initialized ${card.cardType} with balance: 0`)
      })

      // Get all transactions from the transaction filter service
      const allTransactions = transactionFilterService.getAllTransactions()
      console.log(`Processing ${allTransactions.length} transactions for balance calculation`)

      // Log first few transactions to see the data structure
      console.log('Sample transactions:', allTransactions.slice(0, 3))

      // Calculate balances by card type (will update the initialized balances)
      this.calculateBalances(allTransactions)
      
      this.isInitialized = true
      console.log('CardBalanceService initialized successfully')
      console.log('Card balances:', Object.fromEntries(this.cardBalances))
    } catch (error) {
      console.error('Error initializing CardBalanceService:', error)
    }
  }

  private calculateBalances(transactions: Transaction[]): void {
    // Don't clear existing balances - we want to keep the initialized zero balances
    
    // Group transactions by account_type and calculate running balance
    transactions.forEach((transaction, index) => {
      const cardType = transaction.account_type
      if (!cardType) {
        console.log(`Transaction ${index} missing account_type:`, transaction)
        return
      }

      const currentBalance = this.cardBalances.get(cardType) || 0
      // Add the transaction amount (negative for expenses, positive for payments/credits)
      const newBalance = currentBalance + transaction.amount
      this.cardBalances.set(cardType, newBalance)

      // Log first few transactions for each card type
      if (index < 10 || (currentBalance === 0 && transaction.amount !== 0)) {
        console.log(`${cardType}: ${currentBalance} + ${transaction.amount} = ${newBalance}`)
      }
    })
    
    // Log final balances
    console.log('Final calculated balances:')
    this.cardBalances.forEach((balance, cardType) => {
      console.log(`${cardType}: ${this.formatBalance(cardType)}`)
    })
  }

  public getCardBalance(cardType: string): number {
    if (!this.isInitialized) {
      console.warn('CardBalanceService not initialized. Call initialize() first.')
      return 0
    }

    const balance = this.cardBalances.get(cardType) || 0
    console.log(`Getting balance for ${cardType}: ${balance}`)
    return balance
  }

  public getAllCardBalances(): Record<string, number> {
    if (!this.isInitialized) {
      console.warn('CardBalanceService not initialized. Call initialize() first.')
      return {}
    }

    return Object.fromEntries(this.cardBalances)
  }

  public getAvailableCardTypes(): string[] {
    if (!this.isInitialized) {
      console.warn('CardBalanceService not initialized. Call initialize() first.')
      return []
    }

    return Array.from(this.cardBalances.keys())
  }

  public formatBalance(cardType: string): string {
    const balance = this.getCardBalance(cardType)
    const absBalance = Math.abs(balance)
    
    // Format as currency
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(absBalance)

    // Return with appropriate sign (positive balances are credits, negative are debts)
    const result = balance >= 0 ? `+${formatted}` : `-${formatted}`
    console.log(`Formatted balance for ${cardType}: ${balance} -> ${result}`)
    return result
  }
}

// Export singleton instance
export const cardBalanceService = CardBalanceService.getInstance()
