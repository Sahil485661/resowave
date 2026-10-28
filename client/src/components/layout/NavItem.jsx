import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Atomized navigation link for Sidebar
 */
export function NavItem({ icon: Icon, label, active = false, onClick, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-4 rounded-md px-4 py-3 text-sm font-semibold transition-colors duration-200',
        active
          ? 'text-white bg-spotify-surface'
          : 'text-spotify-subtext hover:text-white hover:bg-spotify-surface/40'
      )}
    >
      <Icon
        className={cn(
          'h-6 w-6 transition-transform duration-200 group-hover:scale-105',
          active ? 'text-white' : 'text-spotify-subtext group-hover:text-white'
        )}
      />
      <span className="truncate">{label}</span>
      {badge && (
        <span className="ml-auto rounded-full bg-spotify-green/20 px-2 py-0.5 text-xs font-medium text-spotify-green">
          {badge}
        </span>
      )}
    </button>
  );
}
