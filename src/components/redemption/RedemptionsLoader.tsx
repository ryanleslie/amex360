
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
          <div className="w-48 h-48 mx-auto">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
