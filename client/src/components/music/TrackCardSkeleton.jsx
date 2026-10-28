import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function TrackCardSkeleton() {
  return (
    <div className="flex flex-col rounded-md bg-spotify-surface/40 p-4">
      {/* Square cover art placeholder */}
      <Skeleton className="aspect-square w-full rounded-md" />
      {/* Title skeleton */}
      <Skeleton className="mt-4 h-4 w-3/4 rounded" />
      {/* Artist skeleton */}
      <Skeleton className="mt-2 h-3 w-1/2 rounded" />
    </div>
  );
}
