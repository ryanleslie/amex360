import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Link } from 'lucide-react';
import { CardBalance } from '@/services/cardBalanceService';

interface AdminBalancesCardHeaderProps {
  cardCount: number;
  onRefresh: () => void;
  onConnect: () => void;
  isRefreshing: boolean;
  isCreatingToken: boolean;
  cardBalances: CardBalance[];
}

export function AdminBalancesCardHeader({
  cardCount,
  onRefresh,
  onConnect,
  isRefreshing,
  isCreatingToken,
  cardBalances
}: AdminBalancesCardHeaderProps) {
  
  // Get the Business Platinum Card's last sync timestamp
  const getLastSyncTime = () => {
    const businessPlatinumCard = cardBalances.find(
      card => card.cardType === 'Business Platinum Card'
    );
    
    if (businessPlatinumCard?.last_synced) {
      const syncDate = new Date(businessPlatinumCard.last_synced);
      return syncDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    
    return 'Never';
  };
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Card Balances</h3>
          <Badge variant="outline">
            {cardCount} cards
          </Badge>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh & Sync'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onConnect}
            disabled={isCreatingToken}
            className="gap-2"
          >
            <Link className="h-4 w-4" />
            {isCreatingToken ? 'Creating Token...' : 'Connect'}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Last sync: {getLastSyncTime()}
      </p>
      <div className="flex sm:hidden items-center gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2 flex-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh & Sync'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onConnect}
          disabled={isCreatingToken}
          className="gap-2 flex-1"
        >
          <Link className="h-4 w-4" />
          {isCreatingToken ? 'Creating Token...' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}