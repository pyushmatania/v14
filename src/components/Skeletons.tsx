import React from 'react';
import LoadingSpinner from './LoadingSpinner';

type Classable = { className?: string };

export const SkeletonBlock: React.FC<Classable> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-300 dark:bg-gray-700 ${className}`} />
);

export const SkeletonText: React.FC<{ lines?: number } & Classable> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <SkeletonBlock key={idx} className={`h-3 ${idx === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<Classable> = ({ className = 'h-10 w-10' }) => (
  <div className={`animate-pulse rounded-full bg-gray-300 dark:bg-gray-700 ${className}`} />
);

export const SkeletonCard: React.FC<Classable> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 ${className}`}>
    <SkeletonBlock className="h-40 w-full rounded-lg mb-4" />
    <SkeletonBlock className="h-4 w-3/4 mb-2" />
    <SkeletonBlock className="h-3 w-1/2" />
    <div className="mt-4 flex gap-2">
      <SkeletonBlock className="h-8 w-20" />
      <SkeletonBlock className="h-8 w-24" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number; className?: string }> = ({ count = 8, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, idx) => (
      <SkeletonCard key={idx} />
    ))}
  </div>
);

export const SkeletonRow: React.FC<{ items?: number; itemWidthClass?: string; className?: string }> = ({ items = 6, itemWidthClass = 'w-48', className = '' }) => (
  <div className={`flex gap-4 overflow-hidden ${className}`}>
    {Array.from({ length: items }).map((_, idx) => (
      <div key={idx} className={`${itemWidthClass} shrink-0`}>
        <SkeletonCard />
      </div>
    ))}
  </div>
);

export const SkeletonHero: React.FC = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center pt-12 md:pt-16">
    <div className="text-center px-4 w-full max-w-5xl">
      <SkeletonBlock className="h-10 w-64 mx-auto mb-6" />
      <SkeletonBlock className="h-6 w-96 max-w-full mx-auto mb-4" />
      <SkeletonBlock className="h-6 w-80 max-w-full mx-auto mb-6" />
      <div className="flex justify-center gap-4">
        <SkeletonBlock className="h-10 w-32" />
        <SkeletonBlock className="h-10 w-32" />
      </div>
    </div>
  </section>
);

// Page-level skeletons
export const PageSkeleton: React.FC = () => (
  <div className="min-h-screen px-4 md:px-6 py-8">
    <SkeletonText lines={2} className="mb-6" />
    <SkeletonGrid />
  </div>
);

// Browse/ProjectCatalog specific skeleton
export const BrowseSkeleton: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
    <LoadingSpinner 
      variant="entertainment" 
      size="md" 
      text="Loading Browse..." 
    />
  </div>
);

export const CommunitySkeleton: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
    <LoadingSpinner 
      variant="entertainment" 
      size="md" 
      text="Loading Community..." 
    />
  </div>
);

export default {
  SkeletonBlock,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonGrid,
  SkeletonRow,
  SkeletonHero,
  PageSkeleton,
  BrowseSkeleton,
  CommunitySkeleton,
};


