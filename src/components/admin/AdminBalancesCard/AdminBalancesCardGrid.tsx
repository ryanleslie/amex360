import { CardBalance } from '@/services/cardBalanceService';
import { getCardImage } from '@/utils/cardImageUtils';
import { primaryCardsConfig } from '@/data/primaryCardsData';

interface AdminBalancesCardGridProps {
  cardBalances: CardBalance[];
  sortOrder: 'amount' | 'cardList' | 'limit' | 'apr';
}

export function AdminBalancesCardGrid({ cardBalances, sortOrder }: AdminBalancesCardGridProps) {
  // Sort card balances based on the selected order
  const sortedCardBalances = [...cardBalances].sort((a, b) => {
    if (sortOrder === 'amount') {
      // Sort by amount (highest to lowest)
      const balanceA = a.currentBalance || 0;
      const balanceB = b.currentBalance || 0;
      return balanceB - balanceA;
    } else if (sortOrder === 'limit') {
      // Sort by credit limit (highest to lowest)
      const primaryCardA = primaryCardsConfig.find(card => card.cardType === a.cardType);
      const primaryCardB = primaryCardsConfig.find(card => card.cardType === b.cardType);
      const limitA = a.creditLimit || primaryCardA?.creditLimit || 0;
      const limitB = b.creditLimit || primaryCardB?.creditLimit || 0;
      return limitB - limitA;
    } else if (sortOrder === 'apr') {
      // Sort by APR: cards with balances > 0 first (highest APR to lowest), then cards with 0 balances (by APR)
      const balanceA = a.currentBalance || 0;
      const balanceB = b.currentBalance || 0;
      const hasBalanceA = balanceA > 0;
      const hasBalanceB = balanceB > 0;
      
      // If one has balance and other doesn't, prioritize the one with balance
      if (hasBalanceA && !hasBalanceB) return -1;
      if (!hasBalanceA && hasBalanceB) return 1;
      
      // Both have same balance status, sort by APR (highest to lowest)
      const primaryCardA = primaryCardsConfig.find(card => card.cardType === a.cardType);
      const primaryCardB = primaryCardsConfig.find(card => card.cardType === b.cardType);
      const aprA = parseFloat(primaryCardA?.interestRate?.replace('%', '') || '0');
      const aprB = parseFloat(primaryCardB?.interestRate?.replace('%', '') || '0');
      return aprB - aprA;
    } else {
      // Sort by card list order (primary_cards.csv)
      const indexA = primaryCardsConfig.findIndex(card => 
        card.cardType === a.cardType
      );
      const indexB = primaryCardsConfig.findIndex(card => 
        card.cardType === b.cardType
      );
      
      // If card not found in CSV, put it at the end
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      // Sort by CSV order
      return indexA - indexB;
    }
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
          key={`${balance.ID}-${sortOrder}`}
          className="p-4 border rounded-lg bg-gradient-to-b from-white to-gray-50 space-y-2 animate-fade-in overflow-hidden"
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
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={getCardImage(balance.cardType)} 
                alt={balance.cardType}
                className="w-12 h-8 object-contain rounded border flex-shrink-0"
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
            
            {/* Credit limit and limit type - left justified to align with card name */}
            {(() => {
              const primaryCard = primaryCardsConfig.find(card => card.cardType === balance.cardType);
              const creditLimit = balance.creditLimit || primaryCard?.creditLimit;
              const limitType = primaryCard?.limitType;
              const interestRate = primaryCard?.interestRate;
              
              if (creditLimit !== null && creditLimit !== undefined) {
                return (
                  <div className="text-xs text-muted-foreground break-words">
                    ${creditLimit.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                    {limitType && (
                      <span className="ml-1">{limitType} limit</span>
                    )}
                    {interestRate && (
                      <span className="ml-1">• {interestRate} APR</span>
                    )}
                  </div>
                );
              }
              return null;
            })()}
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