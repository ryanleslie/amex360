import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Link, Database } from 'lucide-react';

interface AdminBalancesCardHeaderProps {
  cardCount: number;
  onRefresh: () => void;
  onConnect: () => void;
  onSyncIds: () => void;
  isRefreshing: boolean;
  isCreatingToken: boolean;
  isSyncingIds: boolean;
}

export function AdminBalancesCardHeader({
  cardCount,
  onRefresh,
  onConnect,
  onSyncIds,
  isRefreshing,
  isCreatingToken,
  isSyncingIds
}: AdminBalancesCardHeaderProps) {
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
            onClick={onSyncIds}
            disabled={isSyncingIds}
            className="gap-2"
          >
            <Database className={`h-4 w-4 ${isSyncingIds ? 'animate-spin' : ''}`} />
            {isSyncingIds ? 'Syncing...' : 'Sync IDs'}
          </Button>
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
      <div className="flex sm:hidden items-center gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onSyncIds}
          disabled={isSyncingIds}
          className="gap-2 flex-1"
        >
          <Database className={`h-4 w-4 ${isSyncingIds ? 'animate-spin' : ''}`} />
          {isSyncingIds ? 'Syncing...' : 'Sync IDs'}
        </Button>
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