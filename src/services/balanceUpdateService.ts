
import { supabase } from "@/integrations/supabase/client"

export const balanceUpdateService = {
  async updateCardBalances(): Promise<{ success: boolean; message: string }> {
    try {
      // Get the session token from localStorage (your custom auth system)
      const sessionToken = localStorage.getItem('session_token')
      
      if (!sessionToken) {
        return {
          success: false,
          message: 'Authentication required to update balances'
        }
      }

      // Verify the session is still valid
      const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .select('user_id, expires_at')
        .eq('session_token', sessionToken)
        .single()

      if (sessionError || !session) {
        return {
          success: false,
          message: 'Invalid session. Please log in again.'
        }
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        return {
          success: false,
          message: 'Session expired. Please log in again.'
        }
      }

      // Call the external Supabase edge function with session token
      const response = await fetch('https://yspnncmfqtmyeenwtwwz.supabase.co/functions/v1/get-balances-api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        }
      })

      if (!response.ok) {
        console.error('Error calling balance update API:', response.statusText)
        return {
          success: false,
          message: `Failed to update balances: ${response.statusText}`
        }
      }

      const data = await response.json()
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
