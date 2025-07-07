import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Link } from 'lucide-react';

interface AdminBalancesCardHeaderProps {
  cardCount: number;
  onRefresh: () => void;
  onSyncBalances: () => void;
  onConnect: () => void;
  isRefreshing: boolean;
  isSyncing: boolean;
  isCreatingToken: boolean;
}

export function AdminBalancesCardHeader({
  cardCount,
  onRefresh,
  onSyncBalances,
  onConnect,
  isRefreshing,
  isSyncing,
  isCreatingToken
}: AdminBalancesCardHeaderProps) {
  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <h3 className="text-lg font-semibold">Card Balances</h3>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline">
          {cardCount} cards
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSyncBalances}
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Balances'}
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
  );
}