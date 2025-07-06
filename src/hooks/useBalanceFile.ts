
import { useState, useEffect } from 'react'
import { BalanceFileService, BalanceData } from '@/services/balanceFileService'
import { useAuth } from '@/contexts/AuthContext'

export function useBalanceFile() {
  const { user, loading: authLoading } = useAuth()
  const [balances, setBalances] = useState<BalanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't initialize if auth is still loading or user is not authenticated
    if (authLoading || !user) {
      console.log("useBalanceFile: Skipping balance file initialization - user not authenticated")
      setIsLoading(false)
      return
    }

    const initializeBalanceFile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to load existing file first
        let loadedBalances = BalanceFileService.loadBalanceFile()
        
        // If no valid file exists, create a new one
        if (loadedBalances.length === 0) {
          console.log("useBalanceFile: Creating new balance file...")
          loadedBalances = await BalanceFileService.createBalanceFile()
        }
        
        setBalances(loadedBalances)
        console.log(`useBalanceFile: Initialized with ${loadedBalances.length} balances`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize balance file')
        console.error('useBalanceFile: Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeBalanceFile()
  }, [user, authLoading])

  const refreshBalanceFile = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      setError(null)
      const newBalances = await BalanceFileService.createBalanceFile()
      setBalances(newBalances)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh balance file')
      console.error('useBalanceFile: Refresh error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    balances,
    isLoading,
    error,
    refreshBalanceFile
  }
}
