import { CardBalance } from '@/services/cardBalanceService';
import { getCardImage } from '@/utils/cardImageUtils';

interface AdminBalancesCardGridProps {
  cardBalances: CardBalance[];
}

export function AdminBalancesCardGrid({ cardBalances }: AdminBalancesCardGridProps) {
  // Sort card balances in descending order (highest to lowest)
  const sortedCardBalances = [...cardBalances].sort((a, b) => {
    const balanceA = a.currentBalance || 0;
    const balanceB = b.currentBalance || 0;
    return balanceB - balanceA;
  });

  if (sortedCardBalances.length === 0) {
    return (
      <div className="col-span-full text-center text-muted-foreground py-4 animate-fade-in">
        No card balances found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
      {sortedCardBalances.map((balance, index) => (
        <div
          key={balance.ID}
          className="p-4 border rounded-lg bg-gradient-to-b from-white to-gray-50 space-y-3 animate-fade-in overflow-hidden"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <div className="font-medium text-sm">
            <div className="break-words">{balance.cardType}</div>
            {balance.institutionName && (
              <div className="text-xs text-muted-foreground font-normal break-words">
                {balance.institutionName}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img 
                src={getCardImage(balance.cardType)} 
                alt={balance.cardType}
                className="w-12 h-8 object-cover rounded border flex-shrink-0"
              />
              <div className="text-lg font-semibold tabular-nums min-w-0 flex-1">
                {balance.currentBalance !== null 
                  ? `$${balance.currentBalance.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}` 
                  : 'N/A'
                }
              </div>
            </div>
            {balance.availableBalance !== null && balance.availableBalance !== undefined && balance.availableBalance !== balance.currentBalance && (
              <div className="text-sm text-muted-foreground ml-[60px] break-words">
                Available: ${balance.availableBalance.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            )}
            {balance.creditLimit !== null && balance.creditLimit !== undefined && (
              <div className="text-sm text-muted-foreground ml-[60px] break-words">
                Limit: ${balance.creditLimit.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            )}
          </div>
          
          {balance.accountType && balance.accountSubtype && (
            <div className="text-xs text-muted-foreground break-all">
              {balance.accountType} • {balance.accountSubtype}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}