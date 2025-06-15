
import React from "react";
import { RedemptionMetricsCards } from "@/components/redemption/RedemptionMetricsCards";
import { RedemptionCarouselCard } from "@/components/redemption/RedemptionCarouselCard";
import { RedemptionTable } from "@/components/redemption/RedemptionTable";
import { RedemptionDestinationList } from "@/components/redemption/RedemptionDestinationList";

const Redemptions = () => {
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    const tid = setTimeout(() => setShowContent(true), 350);
    return () => clearTimeout(tid);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 mb-8">
      {/* Header */}
      <div className="flex justify-center items-center my-1 pb-2">
        {/* (Optional header content) */}
      </div>
      {/* Metrics Cards */}
      <div className="mt-0 px-4 lg:px-6">
        <RedemptionMetricsCards isVisible numbersKey={1} />
      </div>
      {/* Carousel Row */}
      <div className={`mt-8 px-4 lg:px-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <RedemptionCarouselCard />
      </div>
      {/* Table and Card List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6">
        <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <RedemptionTable />
        </div>
        <div className={`lg:col-span-1 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <RedemptionDestinationList />
        </div>
      </div>
    </div>
  );
};

export default Redemptions;
