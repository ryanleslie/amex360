
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
    <div className="max-w-7xl mx-auto px-6 mb-8">
      {/* Header with Logo */}
      <RedemptionsHeader />
      
      {/* Metrics Cards - reduced top margin */}
      <div className="mt-0 px-4 lg:px-6">
        <RedemptionMetricsCards
          filters={filters}
          isVisible={isVisible}
          numbersKey={numbersKey}
          onCategoryFilter={handleCategoryFilter}
          selectedCategory={selectedCategory}
        />
      </div>
      
      {/* Chart - Full Width Row with fade-in animation */}
      <div className={`mt-8 px-4 lg:px-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <RedemptionCarouselCard />
      </div>
      
      {/* Table and Card List Row with staggered fade-in animations */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6">
        <div 
          className={`lg:col-span-2 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <RedemptionCard 
            filters={filters}
            selectedPartner={selectedPartner}
            onPartnerChange={handlePartnerChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryFilter}
          />
        </div>
        <div className={`lg:col-span-1 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <RedemptionPartnerList 
            selectedPartner={selectedPartner}
            onPartnerClick={handlePartnerChange}
          />
        </div>
      </div>
    </div>
  );
}
