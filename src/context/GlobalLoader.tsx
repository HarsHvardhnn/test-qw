import React from 'react';

const GlobalLoader = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-[6px] border-blue-200 border-t-blue-500 border-r-blue-500 rounded-full animate-spin shadow-lg shadow-blue-500/50"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 border-[6px] border-blue-400 border-b-blue-600 border-l-blue-600 rounded-full animate-spin-reverse shadow-md shadow-blue-600/50"></div>
          
          {/* Inner pulse */}
          <div className="absolute inset-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-25"></div>
        </div>
      </div>
    );
  };
  
  export default GlobalLoader;