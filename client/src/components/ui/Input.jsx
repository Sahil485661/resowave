import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md border border-white/10 bg-spotify-highlight/60 px-3 py-2 text-sm text-white placeholder:text-spotify-muted transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-white/20 focus-visible:border-spotify-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-spotify-green disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
