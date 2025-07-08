import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Link } from 'lucide-react';

interface AdminBalancesCardHeaderProps {
  cardCount: number;
  onRefresh: () => void;
  onConnect: () => void;
  isRefreshing: boolean;
  isCreatingToken: boolean;
}

export function AdminBalancesCardHeader({
  cardCount,
  onRefresh,
  onConnect,
  isRefreshing,
  isCreatingToken
}: AdminBalancesCardHeaderProps) {
  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Card Balances</h3>
        <Badge variant="outline">
          {cardCount} cards
        </Badge>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh & Sync'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onConnect}
          disabled={isCreatingToken}
          className="gap-2"
        >
          <Link className="h-4 w-4" />
          <span className="hidden sm:inline">{isCreatingToken ? 'Creating Token...' : 'Connect'}</span>
        </Button>
      </div>
    </div>
  );
}