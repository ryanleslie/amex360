
import { supabase } from "@/integrations/supabase/client"

export const balanceUpdateService = {
  async updateCardBalances(): Promise<{ success: boolean; message: string }> {
    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-balances-api', {
        method: 'GET'
      })

      if (error) {
        console.error('Error calling balance update API:', error)
        return {
          success: false,
          message: `Failed to update balances: ${error.message}`
        }
      }

      console.log('Balance update API response:', data)
      
      return {
        success: true,
        message: 'Card balances updated successfully'
      }
    } catch (error) {
      console.error('Unexpected error updating balances:', error)
      return {
        success: false,
        message: 'An unexpected error occurred while updating balances'
      }
    }
  }
}
