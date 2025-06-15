import { staticTxnData } from "@/data/staticTxnData";
import { getTimeRangeDescription } from "@/utils/cardDataUtils";
import { getPrimaryCardByType, generateDisplayNameWithLastFive } from "@/data/staticPrimaryCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardAccountItem } from "@/components/CardAccountItem";
import { transactionFilterService } from "@/services/transactionFilterService";
import { FilterState } from "@/hooks/useFilterState";
import * as React from "react";

interface CardAccountsProps {
  onCardClick?: (cardName: string) => void;
  selectedTimeRange?: string;
  transactionDropdownSelection?: string;
  filters: FilterState;
}

export function CardAccounts({ 
  onCardClick, 
  selectedTimeRange = "ytd",
  transactionDropdownSelection = "all",
  filters
}: CardAccountsProps) {
  // Use the centralized filtering service to get filtered transactions
  const allCardData = React.useMemo(() => {
    // Create filter state for card calculations (don't include card filter itself to show all cards)
    const cardFilters: FilterState = {
      ...filters,
      selectedCard: "all" // Always show all cards, but apply other filters
    };
    
    const filteredTransactions = transactionFilterService.getFilteredTransactions(cardFilters);
    
    // Calculate card amounts based on active filters
    const cardAmounts = filteredTransactions.reduce((acc, transaction) => {
      const account = transaction.account;
      
      // Include transaction based on active filters
      let shouldInclude = false;
      
      if (filters.expenseFilter && transaction.amount < 0) {
        // Include expenses when expense filter is active
        shouldInclude = true;
      } else if (filters.creditFilter && transaction.amount > 0) {
        // Include credits when credit filter is active
        shouldInclude = true;
      } else if (!filters.expenseFilter && !filters.creditFilter && transaction.amount < 0) {
        // Default behavior: show expenses when no specific filter is active
        shouldInclude = true;
      }
      
      if (shouldInclude) {
        if (!acc[account]) {
          acc[account] = 0;
        }
        acc[account] += Math.abs(transaction.amount);
      }
      
      return acc;
    }, {} as Record<string, number>);

    // Process card data using primary card display names
    const cardData = Object.entries(cardAmounts)
      .map(([account, amount]: [string, number]) => {
        // Try to get the primary card display name first
        const primaryCard = getPrimaryCardByType(account);
        let displayName = account.replace(/\bcard\b/gi, '').trim().replace(/\s*(\([^)]+\))/, '\n$1');
        
        if (primaryCard) {
          // Use the configured display name from primary cards
          displayName = primaryCard.displayName.replace(/\bcard\b/gi, '').trim().replace(/\s*(\([^)]+\))/, '\n$1');
        } else {
          // Fallback to existing logic for cards not in primary config
          if (account.toLowerCase().includes('amazon business prime')) {
            displayName = displayName.replace(/\bbusiness\b/gi, '').trim().replace(/\s+/g, ' ');
          }
        }
        
        return {
          name: displayName,
          fullName: account,
          amount
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return cardData;
  }, [filters]);

  // Filter cards based on transaction dropdown selection only
  const cardData = React.useMemo(() => {
    if (transactionDropdownSelection === "all") {
      return allCardData;
    }
    
    return allCardData.filter(card => card.fullName === transactionDropdownSelection);
  }, [allCardData, transactionDropdownSelection]);

  // Calculate dynamic height based on filtered card count
  const dynamicHeight = React.useMemo(() => {
    const baseHeight = 200; // Minimum height for header and padding
    const cardHeight = 120; // Approximate height per card including spacing
    const maxHeight = 830; // Original maximum height
    
    const calculatedHeight = baseHeight + (cardData.length * cardHeight);
    return Math.min(calculatedHeight, maxHeight);
  }, [cardData.length]);

  const handleCardClick = (cardName: string) => {
    if (onCardClick) {
      onCardClick(cardName);
    }
  };

  // Determine which card is selected based on dropdown selection only
  const getSelectedCard = (card: any) => {
    if (transactionDropdownSelection === "all") return false;
    return card.fullName === transactionDropdownSelection;
  };

  // Get appropriate description based on active filters
  const getFilterDescription = () => {
    if (filters.selectedDate) {
      const [year, month, day] = filters.selectedDate.split('-').map(Number);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `(${monthNames[month - 1]} ${day}, ${year})`;
    }
    return getTimeRangeDescription(selectedTimeRange);
  };

  return (
    <Card 
      className="bg-gradient-to-b from-white to-gray-100 flex flex-col transition-all duration-300 ease-in-out"
      style={{ height: `${dynamicHeight}px` }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Card accounts</CardTitle>
        <CardDescription>
          Total spending by card {getFilterDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4 pb-6">
            {cardData.map((card, index) => (
              <div key={card.fullName} className="p-1">
                <CardAccountItem
                  card={card}
                  index={index}
                  onCardClick={handleCardClick}
                  isSelected={getSelectedCard(card)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
