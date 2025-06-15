
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
            className="w-32 h-32 mx-auto"
            loop={true}
            autoplay={true}
          />
        )}
      </div>
    </div>
  );
}
