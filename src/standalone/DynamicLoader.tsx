import React, { useState, useEffect } from "react";

export const DynamicLoader = ({ isLoading, onComplete, onError }) => {
  const [currentText, setCurrentText] = useState("");
  const loadingTexts = [
    "Analyzing your meeting transcripts...",
    "Identifying key topics discussed...",
    "Matching items from inventory...",
    "Generating comprehensive summary...",
    "Almost there, finalizing your results...",
    "Processing audio data...",
    "Extracting important discussion points...",
    "Organizing information for your review...",
  ];

  useEffect(() => {
    if (!isLoading) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setCurrentText(loadingTexts[currentIndex]);
      currentIndex = (currentIndex + 1) % loadingTexts.length;
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isLoading]);

  return isLoading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <h3 className="text-xl text-white font-medium mb-2">
          Generating Summary
        </h3>
        <p className="text-gray-300 mb-4">{currentText}</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  ) : null;
};
