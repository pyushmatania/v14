import React from 'react';

type Classable = { className?: string };

export const FastSkeletonBlock: React.FC<Classable> = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export const FastSkeletonText: React.FC<{ lines?: number } & Classable> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <FastSkeletonBlock key={idx} className={`h-3 ${idx === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export const FastSkeletonCard: React.FC<Classable> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 ${className}`}>
    <FastSkeletonBlock className="h-32 w-full rounded mb-3" />
    <FastSkeletonBlock className="h-4 w-3/4 mb-2" />
    <FastSkeletonBlock className="h-3 w-1/2" />
  </div>
);

export const FastSkeletonGrid: React.FC<{ count?: number; className?: string }> = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, idx) => (
      <FastSkeletonCard key={idx} />
    ))}
  </div>
);

export const FastSkeletonHero: React.FC = () => (
  <section className="relative min-h-[50vh] flex items-center justify-center pt-12">
    <div className="text-center px-4 w-full max-w-4xl">
      <FastSkeletonBlock className="h-8 w-48 mx-auto mb-4" />
      <FastSkeletonBlock className="h-5 w-80 max-w-full mx-auto mb-4" />
      <FastSkeletonBlock className="h-5 w-64 max-w-full mx-auto mb-6" />
      <div className="flex justify-center gap-3">
        <FastSkeletonBlock className="h-9 w-24" />
        <FastSkeletonBlock className="h-9 w-24" />
      </div>
    </div>
  </section>
);

export const FastPageSkeleton: React.FC = () => (
  <div className="min-h-screen px-4 py-6">
    <FastSkeletonText lines={2} className="mb-6" />
    <FastSkeletonGrid />
  </div>
);

export default {
  FastSkeletonBlock,
  FastSkeletonText,
  FastSkeletonCard,
  FastSkeletonGrid,
  FastSkeletonHero,
  FastPageSkeleton,
};

