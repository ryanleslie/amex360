
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
      const { data, error } = await supabase
        .from('card_balances')
        .select('*')

      if (error) {
        console.error('Error fetching card balances:', error)
        return []
      }

      this.balances = data || []
      this.lastFetch = Date.now()
      
      return this.balances
    } catch (error) {
      console.error('Failed to fetch card balances:', error)
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
      return this.balances
    }

    return await this.fetchBalances()
  }

  /**
   * Get balance for a specific card by card type
   */
  static async getBalanceByCardType(cardType: string): Promise<number | null> {
    const balances = await this.getBalances()
    const cardBalance = balances.find(balance => 
      balance.cardType.toLowerCase() === cardType.toLowerCase()
    )
    
    return cardBalance?.currentBalance ?? null
  }

  /**
   * Get balance for a specific card by last five digits
   */
  static async getBalanceByLastFive(lastFive: string): Promise<number | null> {
    const balances = await this.getBalances()
    
    // Try to match by ID if it contains the last five digits
    const cardBalance = balances.find(balance => 
      balance.ID.includes(lastFive) || balance.cardType.includes(lastFive)
    )
    
    return cardBalance?.currentBalance ?? null
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
