
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBalanceContext } from '@/contexts/BalanceContext';
import { usePlaidLinkFlow } from '@/hooks/usePlaidLink';
import { useBalanceSync } from '@/hooks/useBalanceSync';
import { AdminBalancesCardHeader } from './AdminBalancesCardHeader';
import { AdminBalancesCardGrid } from './AdminBalancesCardGrid';

export function AdminBalancesCard() {
  const { cardBalances, loading, error, refetch, lastCalculated } = useBalanceContext();
  const [sortOrder, setSortOrder] = useState<'amount' | 'cardList' | 'limit' | 'apr'>('amount');
  
  const { handleConnect, isCreatingToken } = usePlaidLinkFlow(refetch);
  const { handleRefresh, isRefreshing } = useBalanceSync(refetch);

  const handleOrderByAmount = () => {
    setSortOrder('amount');
  };

  const handleOrderByCardList = () => {
    setSortOrder('cardList');
  };

  const handleOrderByLimit = () => {
    setSortOrder('limit');
  };

  const handleOrderByApr = () => {
    setSortOrder('apr');
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


  return (
    <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="space-y-4">
          <AdminBalancesCardHeader
            cardCount={cardBalances.length}
            onRefresh={handleRefresh}
            onConnect={handleConnect}
            isRefreshing={isRefreshing}
            isCreatingToken={isCreatingToken}
            cardBalances={cardBalances}
            lastCalculated={lastCalculated}
            onOrderByAmount={handleOrderByAmount}
            onOrderByCardList={handleOrderByCardList}
            onOrderByLimit={handleOrderByLimit}
            onOrderByApr={handleOrderByApr}
          />

          <ScrollArea className="h-[560px]">
            <AdminBalancesCardGrid cardBalances={cardBalances} sortOrder={sortOrder} />
          </ScrollArea>
        </div>
    </Card>
  );
}
