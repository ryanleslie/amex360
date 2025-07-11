import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RefreshCw, Link, MoreVertical, ArrowUpDown, List, CircleDollarSign, Percent } from 'lucide-react';
import { CardBalance } from '@/services/cardBalanceService';

interface AdminBalancesCardHeaderProps {
  cardCount: number;
  onRefresh: () => void;
  onConnect: () => void;
  isRefreshing: boolean;
  isCreatingToken: boolean;
  cardBalances: CardBalance[];
  lastCalculated: Date | null;
  onOrderByAmount: () => void;
  onOrderByCardList: () => void;
  onOrderByLimit: () => void;
  onOrderByApr: () => void;
}

export function AdminBalancesCardHeader({
  cardCount,
  onRefresh,
  onConnect,
  isRefreshing,
  isCreatingToken,
  cardBalances,
  lastCalculated,
  onOrderByAmount,
  onOrderByCardList,
  onOrderByLimit,
  onOrderByApr
}: AdminBalancesCardHeaderProps) {
  
  // Calculate total balance and format timestamp
  const getBalanceSummary = () => {
    const totalBalance = cardBalances.reduce((sum, card) => {
      return sum + (card.currentBalance || 0);
    }, 0);
    
    const formattedTotal = `$${Math.abs(totalBalance).toLocaleString()}`;
    
    if (!lastCalculated) {
      return `${formattedTotal} as of never`;
    }
    
    const formattedDate = lastCalculated.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${formattedTotal} as of ${formattedDate}`;
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
                Sort by balance
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onOrderByCardList}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Sort by card list
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onOrderByLimit}
                className="gap-2"
              >
                <CircleDollarSign className="h-4 w-4" />
                Sort by limit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onOrderByApr}
                className="gap-2"
              >
                <Percent className="h-4 w-4" />
                Sort by APR
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
        {getBalanceSummary()}
      </p>
      <div className="sm:hidden mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
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
              Sort by balance
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onOrderByCardList}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Sort by card list
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onOrderByLimit}
              className="gap-2"
            >
              <CircleDollarSign className="h-4 w-4" />
              Sort by limit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onOrderByApr}
              className="gap-2"
            >
              <Percent className="h-4 w-4" />
              Sort by APR
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