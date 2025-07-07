
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlaidAccounts } from '@/hooks/usePlaidAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { Link2, RefreshCw, AlertCircle, Info } from 'lucide-react';

export function PlaidConnectionCard() {
  const { plaidAccounts, loading, error, refetch } = usePlaidAccounts();
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="text-center text-muted-foreground">
          Admin access required to manage Plaid connections.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Account Connections</h3>
            <Badge variant="outline">
              {plaidAccounts.length} accounts
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refetch}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" disabled>
              <Link2 className="h-4 w-4 mr-2" />
              Connect Account
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
          <Info className="h-4 w-4" />
          <span className="text-sm">Currently displaying data from card_balances table. Plaid integration in progress.</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground animate-pulse py-8">
            Loading account connections...
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {plaidAccounts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="space-y-2">
                    <p>No connected accounts found.</p>
                    <p className="text-sm">Connect your bank accounts to start seeing live balance data.</p>
                  </div>
                </div>
              ) : (
                plaidAccounts.map((account, index) => (
                  <div
                    key={account.id}
                    className="p-4 border rounded-lg bg-white space-y-2 animate-fade-in"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{account.account_name}</div>
                      <Badge variant="secondary" className="text-xs">
                        {account.account_type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{account.institution_name || 'Unknown'}</span>
                      <span>{account.account_subtype || 'Other'}</span>
                    </div>
                    
                    <div className="text-right font-semibold">
                      {account.current_balance !== null 
                        ? `$${account.current_balance.toLocaleString('en-US', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` 
                        : 'Balance unavailable'
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
