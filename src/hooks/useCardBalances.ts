
import { useState, useEffect } from 'react'
import { cardBalanceService, CardBalance } from '@/services/cardBalanceService'

export const useCardBalances = () => {
  const [cardBalances, setCardBalances] = useState<CardBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCardBalances = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Update Supabase with calculated balances on load
        await cardBalanceService.updateSupabaseBalances()
        
        // Then fetch the calculated balances
        const balances = await cardBalanceService.getCardBalances()
        setCardBalances(balances)
        console.log('Real-time card balances loaded:', balances)
      } catch (err) {
        setError('Failed to load card balances')
        console.error('Error loading card balances:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCardBalances()
  }, [])

  return {
    cardBalances,
    loading,
    error,
    refetch: async () => {
      const fetchCardBalances = async () => {
        try {
          setLoading(true)
          setError(null)
          
          // Update Supabase with latest calculated balances
          await cardBalanceService.updateSupabaseBalances()
          
          // Then fetch the updated balances
          const balances = await cardBalanceService.getCardBalances()
          setCardBalances(balances)
        } catch (err) {
          setError('Failed to load card balances')
          console.error('Error loading card balances:', err)
        } finally {
          setLoading(false)
        }
      }
      fetchCardBalances()
    }
  }
}
