
import { useState, useEffect } from 'react'
import { CardBalanceService } from '@/services/cardBalanceService'

export function useCardBalance(cardType?: string, lastFive?: string) {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cardType && !lastFive) return

    const fetchBalance = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let balanceValue: number | null = null
        
        if (cardType) {
          balanceValue = await CardBalanceService.getBalanceByCardType(cardType)
        } else if (lastFive) {
          balanceValue = await CardBalanceService.getBalanceByLastFive(lastFive)
        }
        
        setBalance(balanceValue)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance')
        console.error('Error in useCardBalance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [cardType, lastFive])

  const formattedBalance = CardBalanceService.formatBalance(balance)

  return {
    balance,
    formattedBalance,
    loading,
    error
  }
}
