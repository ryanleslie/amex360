
import { useState, useEffect } from 'react';
import { plaidService, PlaidAccountBalance } from '@/services/plaidService';

export const usePlaidAccounts = () => {
  const [plaidAccounts, setPlaidAccounts] = useState<PlaidAccountBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaidAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const accounts = await plaidService.getPlaidAccounts();
        setPlaidAccounts(accounts);
        console.log('Plaid accounts loaded:', accounts);
      } catch (err) {
        setError('Failed to load Plaid accounts');
        console.error('Error loading Plaid accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaidAccounts();
  }, []);

  return {
    plaidAccounts,
    loading,
    error,
    refetch: () => {
      const fetchPlaidAccounts = async () => {
        try {
          setLoading(true);
          setError(null);
          const accounts = await plaidService.getPlaidAccounts();
          setPlaidAccounts(accounts);
        } catch (err) {
          setError('Failed to load Plaid accounts');
          console.error('Error loading Plaid accounts:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPlaidAccounts();
    }
  };
};
