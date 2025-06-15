
import React from "react";

export function RedemptionsHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center gap-3 mb-4">
        <img 
          src="https://i.imgur.com/dTz9vVm.png" 
          alt="Points" 
          className="h-8 w-8" 
        />
        <h1 className="text-4xl font-bold" style={{ color: '#00175a' }}>
          Redemptions
        </h1>
      </div>
      <p className="text-gray-600 text-lg">
        Track your point redemptions and travel destinations
      </p>
    </div>
  );
}
