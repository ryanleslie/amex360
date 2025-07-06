
import { supabase } from "@/integrations/supabase/client"

export interface CardBalance {
  cardType: string
  currentBalance: number | null
  ID: string
}

export const cardBalanceService = {
  async fetchCardBalances(): Promise<CardBalance[]> {
    const { data, error } = await supabase
      .from('card_balances')
      .select('*')
    
    if (error) {
      console.error('Error fetching card balances:', error)
      return []
    }
    
    return data || []
  },

  async getBalanceByCardType(cardType: string): Promise<number> {
    const { data, error } = await supabase
      .from('card_balances')
      .select('currentBalance')
      .eq('cardType', cardType)
      .single()
    
    if (error) {
      console.error(`Error fetching balance for ${cardType}:`, error)
      return 0
    }
    
    return data?.currentBalance || 0
  }
}
