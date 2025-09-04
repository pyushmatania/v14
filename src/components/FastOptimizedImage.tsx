import React, { useState, memo } from 'react';

interface FastOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const FastOptimizedImage: React.FC<FastOptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={`transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'opacity-50' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Simple loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Simple error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-xs text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">!</span>
            </div>
            <div>Image unavailable</div>
          </div>
        </div>
      )}
    </div>
  );
});

FastOptimizedImage.displayName = 'FastOptimizedImage';

export default FastOptimizedImage;

