import React from 'react';

interface SimplePreloaderProps {
  text?: string;
}

const SimplePreloader: React.FC<SimplePreloaderProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Simple spinning circle */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        
        {/* Simple text */}
        <div className="text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </div>
      </div>
    </div>
  );
};

export default SimplePreloader;

