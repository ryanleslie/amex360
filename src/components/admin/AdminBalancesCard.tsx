
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useCardBalances } from '@/hooks/useCardBalances';
import { balanceUpdateService } from '@/services/balanceUpdateService';
import { CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function AdminBalancesCard() {
  const { cardBalances, loading, error, refetch } = useCardBalances();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateBalances = async () => {
    setIsUpdating(true);
    try {
      const result = await balanceUpdateService.updateCardBalances();
      
      if (result.success) {
        toast.success(result.message);
        // Refetch the data after successful update
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update balances');
      console.error('Error updating balances:', error);
    } finally {
      setIsUpdating(false);
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
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Card Balances</h3>
            <Badge variant="outline">
              {cardBalances.length} cards
            </Badge>
          </div>
          
          <Button 
            onClick={handleUpdateBalances}
            disabled={isUpdating}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update Balances'}
          </Button>
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
                    </div>
                  </div>
                  
                  <div className="text-lg font-semibold tabular-nums">
                    {balance.currentBalance !== null 
                      ? `$${balance.currentBalance.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}` 
                      : 'N/A'
                    }
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    ID: {balance.ID}
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
