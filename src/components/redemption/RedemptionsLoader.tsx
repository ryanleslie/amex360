
import React from "react";
import Lottie from "lottie-react";

interface RedemptionsLoaderProps {
  animationData: any;
  showLottie: boolean;
}

export function RedemptionsLoader({ animationData, showLottie }: RedemptionsLoaderProps) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        {animationData && showLottie && (
          <Lottie
            animationData={animationData}
            className="w-28 h-28 mx-auto transform rotate-[10deg]"
            loop={true}
            autoplay={true}
          />
        )}
      </div>
    </div>
  );
}
