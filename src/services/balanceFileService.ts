
import { supabase } from "@/integrations/supabase/client"

export interface BalanceData {
  cardType: string
  currentBalance: number | null
  lastUpdated: string
}

export class BalanceFileService {
  private static readonly BALANCE_FILE_KEY = 'card_balances_data'
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch balances from Supabase and store in local file/storage
   */
  static async createBalanceFile(): Promise<BalanceData[]> {
    try {
      console.log("BalanceFileService: Creating balance file from Supabase...")
      
      const { data, error } = await supabase
        .from('card_balances')
        .select('*')

      if (error) {
        console.error('BalanceFileService: Error fetching card balances:', error)
        return []
      }

      const balanceData: BalanceData[] = (data || []).map(item => ({
        cardType: item.cardType,
        currentBalance: item.currentBalance,
        lastUpdated: new Date().toISOString()
      }))

      // Store in localStorage as our "file"
      localStorage.setItem(this.BALANCE_FILE_KEY, JSON.stringify({
        data: balanceData,
        timestamp: Date.now()
      }))

      console.log(`BalanceFileService: Created balance file with ${balanceData.length} entries`)
      return balanceData
    } catch (error) {
      console.error('BalanceFileService: Failed to create balance file:', error)
      return []
    }
  }

  /**
   * Load balances from the local file
   */
  static loadBalanceFile(): BalanceData[] {
    try {
      const stored = localStorage.getItem(this.BALANCE_FILE_KEY)
      if (!stored) {
        console.log("BalanceFileService: No balance file found")
        return []
      }

      const parsed = JSON.parse(stored)
      const now = Date.now()
      
      // Check if cache is still valid
      if (now - parsed.timestamp > this.CACHE_DURATION) {
        console.log("BalanceFileService: Balance file expired")
        return []
      }

      console.log(`BalanceFileService: Loaded ${parsed.data.length} balances from file`)
      return parsed.data
    } catch (error) {
      console.error('BalanceFileService: Failed to load balance file:', error)
      return []
    }
  }

  /**
   * Get balance for a specific card type from the file
   */
  static getBalanceByCardType(cardType: string, balances: BalanceData[]): number | null {
    const balance = balances.find(b => 
      b.cardType.toLowerCase() === cardType.toLowerCase()
    )
    
    if (!balance) {
      // Try partial match
      const partialMatch = balances.find(b => {
        const balanceType = b.cardType.toLowerCase()
        const searchType = cardType.toLowerCase()
        return balanceType.includes(searchType) || searchType.includes(balanceType)
      })
      return partialMatch?.currentBalance ?? null
    }
    
    return balance.currentBalance
  }

  /**
   * Format balance for display
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
   * Clear the balance file
   */
  static clearBalanceFile(): void {
    localStorage.removeItem(this.BALANCE_FILE_KEY)
    console.log("BalanceFileService: Balance file cleared")
  }
}
