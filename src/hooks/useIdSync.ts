import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useIdSync = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [isSyncingIds, setIsSyncingIds] = useState(false);

  const handleSyncIds = async () => {
    setIsSyncingIds(true);
    console.log('🔄 Starting ID sync...');
    
    try {
      // Call the sync-plaid-ids function
      console.log('📡 Invoking sync-plaid-ids function...');
      const { data, error: syncError } = await supabase.functions.invoke('sync-plaid-ids');
      
      console.log('📊 Function response:', { data, error: syncError });
      
      if (syncError) {
        console.error('❌ Function error:', syncError);
        throw syncError;
      }

      if (!data) {
        console.warn('⚠️ Function returned no data');
        throw new Error('No data returned from sync-plaid-ids function');
      }

      console.log('✅ Function completed successfully:', data);

      // Call success callback if provided
      onSuccess?.();

      toast({
        title: "IDs Synced",
        description: `Successfully synced ${data?.updated || 0} card balance records with new Plaid IDs`,
      });
    } catch (error) {
      console.error('💥 Error syncing IDs:', error);
      console.error('💥 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: "Sync Failed",
        description: `Failed to sync Plaid IDs: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSyncingIds(false);
      console.log('🏁 ID sync process completed');
    }
  };

  return {
    handleSyncIds,
    isSyncingIds
  };
};