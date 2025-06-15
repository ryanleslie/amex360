
import React, { useState } from "react";
import { RedemptionsHeader } from "./RedemptionsHeader";
import { RedemptionMetricsCards } from "./RedemptionMetricsCards";
import { RedemptionCarouselCard } from "./RedemptionCarouselCard";
import { RedemptionCard } from "./RedemptionCard";
import { RedemptionPartnerList } from "./RedemptionPartnerList";
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
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handlePartnerChange = (partner: string) => {
    setSelectedPartner(partner);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-8">
      <RedemptionsHeader />
      
      <div className={`space-y-6 transition-all duration-700 delay-100 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Metrics Cards with same responsive pattern as Index */}
        <div className="px-0">
          <RedemptionMetricsCards 
            filters={filters}
            isVisible={isVisible}
            numbersKey={numbersKey}
            onCategoryFilter={handleCategoryFilter}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Destinations Carousel - Full Width with consistent padding */}
        <div className={`transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <RedemptionCarouselCard />
        </div>

        {/* Table and Partner List Row - Consistent with Index page layout */}
        <div className={`transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Redemption Table - 2/3 width */}
            <div className="lg:col-span-2">
              <RedemptionCard 
                filters={filters}
                selectedPartner={selectedPartner}
                onPartnerChange={handlePartnerChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryFilter}
              />
            </div>
            
            {/* Top Partners List - 1/3 width */}
            <div className="lg:col-span-1">
              <RedemptionPartnerList 
                selectedPartner={selectedPartner}
                onPartnerClick={handlePartnerChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
