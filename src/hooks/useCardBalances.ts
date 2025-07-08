
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
        // Calculate balances in memory on page load
        const balances = await cardBalanceService.getCardBalances()
        setCardBalances(balances)
        console.log('Card balances calculated:', balances)
      } catch (err) {
        setError('Failed to calculate card balances')
        console.error('Error calculating card balances:', err)
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
        // Recalculate balances in memory
        const balances = await cardBalanceService.getCardBalances()
        setCardBalances(balances)
      } catch (err) {
        setError('Failed to calculate card balances')
        console.error('Error calculating card balances:', err)
      } finally {
        setLoading(false)
      }
    }
  }
}
