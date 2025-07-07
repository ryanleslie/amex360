
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Loader2 } from 'lucide-react';
import { plaidService } from '@/services/plaidService';
import { useToast } from '@/hooks/use-toast';

interface PlaidLinkButtonProps {
  onSuccess?: () => void;
}

export function PlaidLinkButton({ onSuccess }: PlaidLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlaidLink = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Create link token
      const linkToken = await plaidService.createLinkToken();
      
      // Initialize Plaid Link
      // Note: In a real implementation, you'd use the Plaid Link SDK
      // For now, we'll show a message about setting up Plaid Link
      toast({
        title: "Plaid Integration Ready",
        description: "Link token created successfully. Plaid Link SDK integration needed for full connection flow.",
      });
      
    } catch (error) {
      console.error('Error with Plaid Link:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize account connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, onSuccess]);

  return (
    <Button 
      onClick={handlePlaidLink}
      disabled={isLoading}
      size="sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Link2 className="h-4 w-4 mr-2" />
      )}
      Connect Account
    </Button>
  );
}
