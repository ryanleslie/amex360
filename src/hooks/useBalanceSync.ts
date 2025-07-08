import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBalanceSync = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('🔄 Starting balance refresh...');
    
    try {
      // Call the plaid-get-accounts function to fetch fresh data
      console.log('📡 Invoking plaid-get-accounts function...');
      const { data, error: refreshError } = await supabase.functions.invoke('plaid-get-accounts');
      
      console.log('📊 Function response:', { data, error: refreshError });
      
      if (refreshError) {
        console.error('❌ Function error:', refreshError);
        throw refreshError;
      }

      if (!data) {
        console.warn('⚠️ Function returned no data');
        throw new Error('No data returned from plaid-get-accounts function');
      }

      console.log('✅ Function completed successfully:', data);

      // Call success callback if provided
      onSuccess?.();

      toast({
        title: "Balances Updated",
        description: `Successfully refreshed ${data?.accounts?.length || 0} account balances from Plaid`,
      });
    } catch (error) {
      console.error('💥 Error refreshing balances:', error);
      console.error('💥 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: "Refresh Failed",
        description: `Failed to refresh account balances: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
      console.log('🏁 Refresh process completed');
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