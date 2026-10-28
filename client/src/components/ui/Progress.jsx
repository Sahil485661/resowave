import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ value = 0, className, ...props }) {
  const percentage = Math.max(0, Math.min(value, 100));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-spotify-highlight',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-spotify-green transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
