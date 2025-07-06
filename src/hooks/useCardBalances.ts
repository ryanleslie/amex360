
import { useState, useEffect } from 'react'
import { cardBalanceService, CardBalance } from '@/services/cardBalanceService'

export const useCardBalances = () => {
  const [cardBalances, setCardBalances] = useState<CardBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true)
        const balances = await cardBalanceService.fetchCardBalances()
        setCardBalances(balances)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch card balances:', err)
        setError('Failed to fetch card balances')
      } finally {
        setLoading(false)
      }
    }

    fetchBalances()
  }, [])

  const getBalanceByCardType = (cardType: string): number => {
    const balance = cardBalances.find(b => b.cardType === cardType)
    return balance?.currentBalance || 0
  }

  const refreshBalances = async () => {
    try {
      setLoading(true)
      const balances = await cardBalanceService.fetchCardBalances()
      setCardBalances(balances)
      setError(null)
    } catch (err) {
      console.error('Failed to refresh card balances:', err)
      setError('Failed to refresh card balances')
    } finally {
      setLoading(false)
    }
  }

  return {
    cardBalances,
    loading,
    error,
    getBalanceByCardType,
    refreshBalances
  }
}
