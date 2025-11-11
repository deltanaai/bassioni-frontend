import React from "react";

const SuspenseContainer = () => {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center"></div>
    </div>
  );
};

export default SuspenseContainer;
