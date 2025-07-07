
import { supabase } from "@/integrations/supabase/client"

export const balanceUpdateService = {
  async updateCardBalances(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('Starting balance update process...')
      
      // Get the session token from localStorage (your custom auth system)
      const sessionToken = localStorage.getItem('session_token')
      
      if (!sessionToken) {
        console.log('No session token found')
        return {
          success: false,
          message: 'Authentication required to update balances'
        }
      }

      console.log('Session token found, verifying...')
      
      // Verify the session is still valid
      const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .select('user_id, expires_at')
        .eq('session_token', sessionToken)
        .single()

      if (sessionError || !session) {
        console.log('Session verification failed:', sessionError)
        return {
          success: false,
          message: 'Invalid session. Please log in again.'
        }
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        console.log('Session expired')
        return {
          success: false,
          message: 'Session expired. Please log in again.'
        }
      }

      console.log('Session valid, calling balance update function...')

      // Call the edge function using Supabase client
      const { data, error } = await supabase.functions.invoke('get-balances-api', {
        method: 'GET'
      })
      
      if (error) {
        console.error('Supabase function invoke error:', error)
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
