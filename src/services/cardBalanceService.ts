
import { supabase } from "@/integrations/supabase/client"

export interface CardBalance {
  ID: string
  cardType: string
  currentBalance: number | null
}

export const cardBalanceService = {
  async getCardBalances(): Promise<CardBalance[]> {
    try {
      const { data, error } = await supabase
        .from('card_balances')
        .select('*')
        
      if (error) {
        console.error('Error fetching card balances:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Failed to fetch card balances:', error)
      return []
    }
  }
}
