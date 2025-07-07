import React, { useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlaidLinkFlow = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isCreatingToken, setIsCreatingToken] = useState(false);

  const onPlaidSuccess = useCallback(async (public_token: string, metadata: any) => {
    try {
      // Exchange the public token for an access token
      const { error: exchangeError } = await supabase.functions.invoke('plaid-exchange-token', {
        body: { public_token }
      });
      
      if (exchangeError) {
        throw exchangeError;
      }

      // Call success callback if provided
      onSuccess?.();

      toast({
        title: "Account Connected",
        description: "Successfully connected your account to Plaid",
      });
    } catch (error) {
      console.error('Error exchanging token:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect account. Please try again.",
        variant: "destructive",
      });
    }
    // Reset link token after use
    setLinkToken(null);
  }, [onSuccess, toast]);

  const onEvent = useCallback((eventName: string, metadata: any) => {
    console.log('Plaid Link event:', eventName, metadata);
  }, []);

  const onExit = useCallback((err: any, metadata: any) => {
    console.log('Plaid Link exit:', err, metadata);
    setLinkToken(null); // Reset link token on exit
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onEvent,
    onExit,
  });

  const handleConnect = async () => {
    if (!linkToken) {
      setIsCreatingToken(true);
      try {
        // Create a link token for Plaid
        const { data, error: linkError } = await supabase.functions.invoke('plaid-create-link-token');
        
        if (linkError) {
          throw linkError;
        }

        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to create Plaid connection. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCreatingToken(false);
      }
    } else if (ready) {
      open();
    }
  };

  // Auto-open Plaid Link when token is ready
  React.useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return {
    handleConnect,
    isCreatingToken
  };
};