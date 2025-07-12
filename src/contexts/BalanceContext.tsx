import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { cardBalanceService, CardBalance } from '@/services/cardBalanceService'

interface BalanceContextType {
  cardBalances: CardBalance[]
  loading: boolean
  error: string | null
  lastCalculated: Date | null
  refetch: () => Promise<void>
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

interface BalanceProviderProps {
  children: ReactNode
}

export function BalanceProvider({ children }: BalanceProviderProps) {
  const [cardBalances, setCardBalances] = useState<CardBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastCalculated, setLastCalculated] = useState<Date | null>(null)

  const calculateBalances = async () => {
    try {
      setLoading(true)
      setError(null)
      const balances = await cardBalanceService.getCardBalances()
      setCardBalances(balances)
      setLastCalculated(new Date())
      console.log('Card balances calculated globally:', balances)
    } catch (err) {
      setError('Failed to calculate card balances')
      console.error('Error calculating card balances:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate balances once on provider initialization
  useEffect(() => {
    calculateBalances()
  }, [])

  const refetch = async () => {
    await calculateBalances()
  }

  const value = {
    cardBalances,
    loading,
    error,
    lastCalculated,
    refetch
  }

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalanceContext() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within a BalanceProvider')
  }
  return context
}