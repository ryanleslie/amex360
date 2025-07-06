
import { Card, CardContent } from "@/components/ui/card";
import { getCardImage } from "@/utils/cardImageUtils";
import { CardData } from "@/utils/cardDataUtils";
import { formatDisplayCardName } from "@/utils/transactionUtils";
import { transactionFilterService } from "@/services/transactionFilterService";
import { FilterState } from "@/hooks/useFilterState";
import * as React from "react";

interface CardAccountItemProps {
  card: CardData;
  index: number;
  onCardClick: (cardName: string) => void;
  isSelected: boolean;
  filters: FilterState;
}

export function CardAccountItem({ card, index, onCardClick, isSelected, filters }: CardAccountItemProps) {
  const handleClick = () => {
    if (isSelected) {
      // If this card is already selected, toggle to "all"
      onCardClick('all');
    } else {
      // If this card is not selected, select it using default logic
      onCardClick(card.fullName);
    }
  };

  // Use standard formatter for display name
  const getDisplayName = (cardName: string) => formatDisplayCardName(cardName);

  // Calculate maximum point multiple and sum for selected card
  const cardPointDetails = React.useMemo(() => {
    if (!isSelected) return null;

    const cardFilters: FilterState = {
      ...filters,
      selectedCard: card.fullName
    };
    
    const filteredTransactions = transactionFilterService.getFilteredTransactions(cardFilters);
    
    // Find maximum point multiple for this card
    const maxPointMultiple = Math.max(...filteredTransactions.map(t => t.point_multiple || 1));
    
    // Sum transactions that have the maximum point multiple
    const maxPointTransactions = filteredTransactions.filter(t => 
      (t.point_multiple || 1) === maxPointMultiple && t.amount < 0
    );
    
    const sumAtMaxPoints = maxPointTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return {
      maxPointMultiple,
      sumAtMaxPoints
    };
  }, [isSelected, card.fullName, filters]);

  return (
    <Card 
      className="bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <img 
              src={getCardImage(card.fullName)} 
              alt="Card placeholder" 
              className="w-16 h-10 object-cover rounded"
            />
            <div className="text-sm font-medium leading-tight whitespace-pre-line">
              {getDisplayName(card.name)}
            </div>
          </div>
          <div className="flex items-center justify-end sm:justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Total spend
              </p>
              <div className="text-lg font-bold tabular-nums">
                ${card.amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>
          </div>
        </div>
        
        {isSelected && cardPointDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-muted-foreground">
              The maximum point value of <span className="font-semibold text-foreground">{cardPointDetails.maxPointMultiple}x</span> was earned on{' '}
              <span className="font-semibold text-foreground">
                ${cardPointDetails.sumAtMaxPoints.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>{' '}
              of transactions on this card.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
