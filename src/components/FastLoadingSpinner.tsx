import React from 'react';

interface FastLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'premium' | 'entertainment';
}

const FastLoadingSpinner: React.FC<FastLoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const variantClasses = {
    default: 'border-gray-300 border-t-indigo-600',
    premium: 'border-gray-300 border-t-yellow-500',
    entertainment: 'border-gray-300 border-t-purple-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      {/* Simple spinning circle */}
      <div className={`${sizeClasses[size]} border-2 ${variantClasses[variant]} rounded-full animate-spin`} />
      
      {/* Simple text */}
      {text && (
        <div className={`${textSizes[size]} text-gray-600 dark:text-gray-400 font-medium`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default FastLoadingSpinner;

