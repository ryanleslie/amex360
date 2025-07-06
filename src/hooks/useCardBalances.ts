
import { useState, useEffect } from 'react'
import { CardBalanceService, type CardBalance } from '@/services/cardBalanceService'

export function useCardBalances() {
  const [balances, setBalances] = useState<CardBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await CardBalanceService.getBalances(false) // Force fresh data
      setBalances(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances')
      console.error('Error in useCardBalances:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalances()
  }, [])

  const getBalanceByCardType = (cardType: string): number | null => {
    const balance = balances.find(b => 
      b.cardType.toLowerCase() === cardType.toLowerCase()
    )
    return balance?.currentBalance ?? null
  }

  const getBalanceByLastFive = (lastFive: string): number | null => {
    const balance = balances.find(b => 
      b.ID.includes(lastFive) || b.cardType.includes(lastFive)
    )
    return balance?.currentBalance ?? null
  }

  const formatBalance = (balance: number | null): string => {
    return CardBalanceService.formatBalance(balance)
  }

  return {
    balances,
    loading,
    error,
    refetch: fetchBalances,
    getBalanceByCardType,
    getBalanceByLastFive,
    formatBalance
  }
}
