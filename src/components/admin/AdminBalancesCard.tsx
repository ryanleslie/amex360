
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCardBalances } from '@/hooks/useCardBalances';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, RefreshCw, Link } from 'lucide-react';

export function AdminBalancesCard() {
  const { cardBalances, loading, error, refetch } = useCardBalances();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Call the plaid-get-accounts function to fetch fresh data
      const { error: refreshError } = await supabase.functions.invoke('plaid-get-accounts');
      
      if (refreshError) {
        throw refreshError;
      }

      // Refetch the card balances from our local data
      await refetch();

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

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Create a link token for Plaid
      const { data, error: linkError } = await supabase.functions.invoke('plaid-create-link-token');
      
      if (linkError) {
        throw linkError;
      }

      // For now, just show a success message - in a full implementation,
      // you would open the Plaid Link component here
      toast({
        title: "Link Token Created",
        description: "Plaid link token created successfully. Link token: " + data.link_token.substring(0, 20) + "...",
      });
    } catch (error) {
      console.error('Error creating link token:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to create Plaid connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Card Balances</h3>
          <div className="text-center text-muted-foreground animate-pulse">Loading balances...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Card Balances</h3>
          <div className="text-center text-destructive">{error}</div>
        </div>
      </Card>
    );
  }

  // Sort card balances in descending order (highest to lowest)
  const sortedCardBalances = [...cardBalances].sort((a, b) => {
    const balanceA = a.currentBalance || 0;
    const balanceB = b.currentBalance || 0;
    return balanceB - balanceA;
  });

  return (
    <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="space-y-4">
        <div className="flex items-center gap-2 animate-fade-in">
          <h3 className="text-lg font-semibold">Card Balances</h3>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">
              {cardBalances.length} cards
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnect}
              disabled={isConnecting}
              className="gap-2"
            >
              <Link className="h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[560px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
            {sortedCardBalances.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-4 animate-fade-in">
                No card balances found
              </div>
            ) : (
              sortedCardBalances.map((balance, index) => (
                <div
                  key={balance.ID}
                  className="p-4 border rounded-lg bg-gradient-to-b from-white to-gray-50 space-y-3 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="font-medium text-sm">
                      {balance.cardType}
                      {balance.institutionName && (
                        <div className="text-xs text-muted-foreground font-normal">
                          {balance.institutionName}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-lg font-semibold tabular-nums">
                      {balance.currentBalance !== null 
                        ? `$${balance.currentBalance.toLocaleString('en-US', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` 
                        : 'N/A'
                      }
                    </div>
                    {balance.availableBalance !== null && balance.availableBalance !== undefined && balance.availableBalance !== balance.currentBalance && (
                      <div className="text-sm text-muted-foreground">
                        Available: ${balance.availableBalance.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    )}
                    {balance.creditLimit !== null && balance.creditLimit !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        Limit: ${balance.creditLimit.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {balance.accountType && balance.accountSubtype ? 
                      `${balance.accountType} • ${balance.accountSubtype}` : 
                      `ID: ${balance.ID}`
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
