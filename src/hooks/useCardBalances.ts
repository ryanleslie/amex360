
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
        // Use syncAndGetBalances to ensure we have the latest calculated balances
        const balances = await cardBalanceService.syncAndGetBalances()
        setCardBalances(balances)
        console.log('Card balances loaded and synced:', balances)
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
      try {
        setLoading(true)
        setError(null)
        // Use syncAndGetBalances to ensure we have the latest calculated balances
        const balances = await cardBalanceService.syncAndGetBalances()
        setCardBalances(balances)
      } catch (err) {
        setError('Failed to load card balances')
        console.error('Error loading card balances:', err)
      } finally {
        setLoading(false)
      }
    }
  }
}
