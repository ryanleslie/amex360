
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlaidAccounts } from '@/hooks/usePlaidAccounts';
import { CreditCard, Building2, Info } from 'lucide-react';

export function AdminBalancesCard() {
  const { plaidAccounts, loading, error } = usePlaidAccounts();

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Balances</h3>
          <div className="text-center text-muted-foreground animate-pulse">Loading balances...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Balances</h3>
          <div className="text-center text-destructive">{error}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="space-y-4">
        <div className="flex items-center gap-2 animate-fade-in">
          <h3 className="text-lg font-semibold">Account Balances</h3>
          <Badge variant="outline" className="ml-auto">
            {plaidAccounts.length} accounts
          </Badge>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
          <Info className="h-4 w-4" />
          <span className="text-sm">Currently displaying data from card_balances table. Plaid integration in progress.</span>
        </div>

        <ScrollArea className="h-[560px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
            {plaidAccounts.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-4 animate-fade-in">
                No account balances found. Connect your accounts to see balances.
              </div>
            ) : (
              plaidAccounts.map((account, index) => (
                <div
                  key={account.id}
                  className="p-4 border rounded-lg bg-gradient-to-b from-white to-gray-50 space-y-3 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="font-medium text-sm">
                      {account.account_name}
                    </div>
                  </div>
                  
                  <div className="text-lg font-semibold tabular-nums">
                    {account.current_balance !== null 
                      ? `$${account.current_balance.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}` 
                      : 'N/A'
                    }
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {account.institution_name || 'Unknown Institution'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {account.account_type} • {account.account_subtype || 'Other'}
                    </div>
                    {account.available_balance !== null && (
                      <div className="text-xs text-muted-foreground">
                        Available: ${account.available_balance.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    )}
                    {account.credit_limit !== null && (
                      <div className="text-xs text-muted-foreground">
                        Limit: ${account.credit_limit.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    )}
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
