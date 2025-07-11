
import React from "react";
import Lottie from "lottie-react";

interface DashboardLoaderProps {
  animationData: any;
}

export const DashboardLoader = ({ animationData }: DashboardLoaderProps) => {
  return (
    <div className="text-center">
      {animationData && (
        <Lottie
          animationData={animationData}
          className="w-32 h-32 mx-auto"
          loop={true}
          autoplay={true}
        />
      )}
    </div>
  );
};
