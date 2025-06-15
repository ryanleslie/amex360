
import React from "react";
import { RedemptionsHeader } from "./RedemptionsHeader";
import { RedemptionMetricsCards } from "./RedemptionMetricsCards";
import { RedemptionCarouselCard } from "./RedemptionCarouselCard";
import { RedemptionCard } from "./RedemptionCard";
import { RedemptionDestinationList } from "./RedemptionDestinationList";
import { FilterState } from "@/hooks/useFilterState";

interface RedemptionsContentProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  updateMultipleFilters: (updates: Partial<FilterState>) => void;
  isVisible: boolean;
  numbersKey: number;
  showContent: boolean;
}

export function RedemptionsContent({
  filters,
  updateFilter,
  updateMultipleFilters,
  isVisible,
  numbersKey,
  showContent
}: RedemptionsContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-8">
      <RedemptionsHeader />
      
      <div className={`space-y-6 ${showContent ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Metrics Cards */}
        <RedemptionMetricsCards 
          filters={filters}
          isVisible={isVisible}
          numbersKey={numbersKey}
        />

        {/* Chart and Table Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Carousel Card */}
          <RedemptionCarouselCard />
          
          {/* Redemption Table */}
          <RedemptionCard 
            filters={filters}
          />
        </div>

        {/* Destination List */}
        <RedemptionDestinationList />
      </div>
    </div>
  );
}
