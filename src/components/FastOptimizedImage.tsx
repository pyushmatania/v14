import React, { useState, memo, useCallback, useMemo } from 'react';

interface FastOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const FastOptimizedImage: React.FC<FastOptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Memoize optimized src for better performance
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    // For TMDB images, optimize the URL
    if (src.includes('image.tmdb.org')) {
      const baseUrl = src.split('?')[0];
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (quality) params.set('q', quality.toString());
      return `${baseUrl}?${params.toString()}`;
    }
    
    return src;
  }, [src, width, quality]);

  // Memoize srcSet for responsive images
  const srcSet = useMemo(() => {
    if (!src || !src.includes('image.tmdb.org')) return undefined;
    
    const baseUrl = src.split('?')[0];
    const sizes = ['300', '500', '780', '1280', '1920'];
    return sizes
      .map(size => `${baseUrl}?w=${size}&q=${quality} ${size}w`)
      .join(', ');
  }, [src, quality]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && isLoading && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )}
      
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'opacity-50' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          willChange: 'opacity',
          transform: 'translateZ(0)', // Hardware acceleration
        }}
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

