
export const balanceUpdateService = {
  async updateCardBalances(): Promise<{ success: boolean; message: string }> {
    try {
      // Call the external Supabase edge function directly
      const response = await fetch('https://yspnncmfqtmyeenwtwwz.supabase.co/functions/v1/get-balances-api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
