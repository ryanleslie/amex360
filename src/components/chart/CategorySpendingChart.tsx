
import React from "react";
import { CategoryChartCard } from "./CategoryChartCard";
import { CategoryTransactionCard } from "./CategoryTransactionCard";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { useCategorySpendingData } from "@/hooks/useCategorySpendingData";
import { useFilterState } from "@/hooks/useFilterState";

export function CategorySpendingChart() {
  const { filters, updateFilter, clearAllFilters } = useFilterState("ytd");
  const { 
    chartData, 
    categories, 
    totalSpend, 
    transactionCount,
    swapTransactions 
  } = useCategorySpendingData(filters.selectedTimeRange);

  const handleTimeRangeChange = (newTimeRange: string) => {
    console.log("CategorySpendingChart: Time range changing to:", newTimeRange);
    updateFilter("selectedTimeRange", newTimeRange);
  };

  const handleCategoryChange = (category: string) => {
    console.log("CategorySpendingChart: Category changing to:", category);
    updateFilter("selectedCard", category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Insights</h1>
          <p className="text-muted-foreground">
            Analyze spending patterns across different categories
          </p>
        </div>
        <TimeRangeSelector
          timeRange={filters.selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          swapTransactions={swapTransactions}
        />
      </div>

      {/* Chart Card */}
      <CategoryChartCard
        data={chartData}
        timeRange={filters.selectedTimeRange}
        totalSpend={totalSpend}
        transactionCount={transactionCount}
        selectedCategory={filters.selectedCard}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />

      {/* Transaction Table */}
      <CategoryTransactionCard
        timeRange={filters.selectedTimeRange}
        selectedCategory={filters.selectedCard}
        onCategoryChange={handleCategoryChange}
        onTimeRangeChange={handleTimeRangeChange}
        categories={categories}
      />
    </div>
  );
}
