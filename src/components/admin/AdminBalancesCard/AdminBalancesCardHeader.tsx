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
  );
}