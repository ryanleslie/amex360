
import React from "react";
import { useFilterState } from "@/hooks/useFilterState";
import { RedemptionsLoader } from "@/components/redemption/RedemptionsLoader";
import { RedemptionsContent } from "@/components/redemption/RedemptionsContent";

const Redemptions = () => {
  const { filters, updateFilter, updateMultipleFilters } = useFilterState("ytd");
  const [isVisible, setIsVisible] = React.useState(false);
  const [numbersKey, setNumbersKey] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [animationData, setAnimationData] = React.useState(null);
  const [showContent, setShowContent] = React.useState(false);
  const [showLottie, setShowLottie] = React.useState(false);

  React.useEffect(() => {
    // Load the loading-geo-b animation
    fetch("/loading-geo-b.json")
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Failed to load animation:", error));

    // a. delay loading by .5 seconds
    const initialDelay = setTimeout(() => {
      // b. start lottie
      setShowLottie(true);
      
      // c. load page for 2 seconds while lottie plays
      // d. only render page after lottie plays for 2 seconds
      const lottieTimer = setTimeout(() => {
        setIsLoading(false);
        setIsVisible(true);
        // Start showing content with staggered animations
        setTimeout(() => setShowContent(true), 100);
      }, 2000);

      return () => clearTimeout(lottieTimer);
    }, 500);

    return () => clearTimeout(initialDelay);
  }, []);

  React.useEffect(() => {
    setNumbersKey(prev => prev + 1);
  }, [filters.selectedTimeRange, filters.selectedDate, filters.selectedCard]);

  if (isLoading) {
    return (
      <RedemptionsLoader 
        animationData={animationData}
        showLottie={showLottie}
      />
    );
  }

  return (
    <div className="flex-1">
      <RedemptionsContent
        filters={filters}
        updateFilter={updateFilter}
        updateMultipleFilters={updateMultipleFilters}
        isVisible={isVisible}
        numbersKey={numbersKey}
        showContent={showContent}
      />
    </div>
  );
};

export default Redemptions;
