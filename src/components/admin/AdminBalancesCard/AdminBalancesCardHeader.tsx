import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RefreshCw, Link, MoreVertical, ArrowUpDown, List } from 'lucide-react';
import { CardBalance } from '@/services/cardBalanceService';

interface AdminBalancesCardHeaderProps {
  cardCount: number;
  onRefresh: () => void;
  onConnect: () => void;
  isRefreshing: boolean;
  isCreatingToken: boolean;
  cardBalances: CardBalance[];
  onOrderByAmount: () => void;
  onOrderByCardList: () => void;
}

export function AdminBalancesCardHeader({
  cardCount,
  onRefresh,
  onConnect,
  isRefreshing,
  isCreatingToken,
  cardBalances,
  onOrderByAmount,
  onOrderByCardList
}: AdminBalancesCardHeaderProps) {
  
  // Get the Business Platinum Card's last calculated timestamp
  const getLastCalculatedTime = () => {
    const businessPlatinumCard = cardBalances.find(
      card => card.cardType === 'Business Platinum Card'
    );
    
    if (businessPlatinumCard?.last_synced) {
      const calculatedDate = new Date(businessPlatinumCard.last_synced);
      return calculatedDate.toLocaleString('en-US', {
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
        <div className="ml-auto hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <MoreVertical className="h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={onOrderByAmount}
                className="gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Order by amount
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onOrderByCardList}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Order by card list
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                disabled={true}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh & Sync
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled={true}
                className="gap-2"
              >
                <Link className="h-4 w-4" />
                Connect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Last calculated: {getLastCalculatedTime()}
      </p>
      <div className="flex sm:hidden justify-center mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem 
              onClick={onOrderByAmount}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Order by amount
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onOrderByCardList}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Order by card list
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              disabled={true}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh & Sync
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={true}
              className="gap-2"
            >
              <Link className="h-4 w-4" />
              Connect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}