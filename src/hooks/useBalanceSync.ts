import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBalanceSync = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Call the plaid-get-accounts function to fetch fresh data
      const { error: refreshError } = await supabase.functions.invoke('plaid-get-accounts');
      
      if (refreshError) {
        throw refreshError;
      }

      // Call success callback if provided
      onSuccess?.();

      toast({
        title: "Balances Updated",
        description: "Successfully refreshed account balances from Plaid",
      });
    } catch (error) {
      console.error('Error refreshing balances:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh account balances. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSyncBalances = async () => {
    setIsSyncing(true);
    try {
      // Call the sync-card-balances function
      const { data, error: syncError } = await supabase.functions.invoke('sync-card-balances');
      
      if (syncError) {
        throw syncError;
      }

      // Call success callback if provided
      onSuccess?.();

      toast({
        title: "Balances Synced",
        description: `Successfully synced ${data?.synced || 0} card balances from Plaid`,
      });
    } catch (error) {
      console.error('Error syncing balances:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync card balances. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    handleRefresh,
    handleSyncBalances,
    isRefreshing,
    isSyncing
  };
};