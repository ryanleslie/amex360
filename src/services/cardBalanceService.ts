
import { supabase } from "@/integrations/supabase/client"

export interface CardBalance {
  ID: string
  cardType: string
  currentBalance: number | null
}

export class CardBalanceService {
  private static balances: CardBalance[] = []
  private static lastFetch: number = 0
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch all card balances from Supabase
   */
  static async fetchBalances(): Promise<CardBalance[]> {
    try {
      console.log("CardBalanceService: Fetching balances from Supabase...")
      const { data, error } = await supabase
        .from('card_balances')
        .select('*')

      if (error) {
        console.error('CardBalanceService: Error fetching card balances:', error)
        return []
      }

      console.log("CardBalanceService: Raw data from Supabase:", data)
      this.balances = data || []
      this.lastFetch = Date.now()
      
      console.log(`CardBalanceService: Cached ${this.balances.length} balances`)
      return this.balances
    } catch (error) {
      console.error('CardBalanceService: Failed to fetch card balances:', error)
      return []
    }
  }

  /**
   * Get all card balances with optional caching
   */
  static async getBalances(useCache: boolean = true): Promise<CardBalance[]> {
    const now = Date.now()
    const isCacheValid = useCache && (now - this.lastFetch) < this.CACHE_DURATION

    if (isCacheValid && this.balances.length > 0) {
      console.log("CardBalanceService: Using cached balances")
      return this.balances
    }

    console.log("CardBalanceService: Cache invalid or empty, fetching fresh data")
    return await this.fetchBalances()
  }

  /**
   * Get balance for a specific card by card type
   */
  static async getBalanceByCardType(cardType: string): Promise<number | null> {
    console.log(`CardBalanceService: Looking for balance for cardType: "${cardType}"`)
    const balances = await this.getBalances()
    
    // Try exact match first
    let cardBalance = balances.find(balance => 
      balance.cardType.toLowerCase() === cardType.toLowerCase()
    )
    
    if (!cardBalance) {
      // Try partial matches for common variations
      cardBalance = balances.find(balance => {
        const balanceType = balance.cardType.toLowerCase()
        const searchType = cardType.toLowerCase()
        return balanceType.includes(searchType) || searchType.includes(balanceType)
      })
    }
    
    if (cardBalance) {
      console.log(`CardBalanceService: Found balance for ${cardType}: ${cardBalance.currentBalance}`)
      return cardBalance.currentBalance
    }
    
    console.log(`CardBalanceService: No balance found for ${cardType}`)
    console.log("Available card types:", balances.map(b => b.cardType))
    return null
  }

  /**
   * Get balance for a specific card by last five digits
   */
  static async getBalanceByLastFive(lastFive: string): Promise<number | null> {
    console.log(`CardBalanceService: Looking for balance for lastFive: "${lastFive}"`)
    const balances = await this.getBalances()
    
    // Try to match by ID if it contains the last five digits
    const cardBalance = balances.find(balance => 
      balance.ID.includes(lastFive) || balance.cardType.includes(lastFive)
    )
    
    if (cardBalance) {
      console.log(`CardBalanceService: Found balance for lastFive ${lastFive}: ${cardBalance.currentBalance}`)
      return cardBalance.currentBalance
    }
    
    console.log(`CardBalanceService: No balance found for lastFive ${lastFive}`)
    return null
  }

  /**
   * Get formatted balance string for display
   */
  static formatBalance(balance: number | null): string {
    if (balance === null || balance === undefined) {
      return '$0.00'
    }
    
    return `$${balance.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  /**
   * Clear the cache to force fresh data on next request
   */
  static clearCache(): void {
    console.log("CardBalanceService: Clearing cache")
    this.balances = []
    this.lastFetch = 0
  }

  /**
   * Get all card types that have balance data
   */
  static async getAvailableCardTypes(): Promise<string[]> {
    const balances = await this.getBalances()
    return balances.map(balance => balance.cardType)
  }
}
