import React from 'react';
import { Home, Search, Library, Sliders, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav({ currentTab, onSelectTab, user }) {
  const isLibraryActive = currentTab === 'liked' || currentTab.startsWith('playlist:');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-16 bg-black/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-2 select-none">
      <button
        type="button"
        onClick={() => onSelectTab('home')}
        className={cn(
          'flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors',
          currentTab === 'home' ? 'text-white' : 'text-spotify-muted hover:text-white'
        )}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('search')}
        className={cn(
          'flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors',
          currentTab === 'search' ? 'text-white' : 'text-spotify-muted hover:text-white'
        )}
      >
        <Search className="h-5 w-5" />
        <span>Search</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('liked')}
        className={cn(
          'flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors',
          isLibraryActive ? 'text-white' : 'text-spotify-muted hover:text-white'
        )}
      >
        <Library className="h-5 w-5" />
        <span>Library</span>
      </button>

      {user?.role === 'artist' && (
        <button
          type="button"
          onClick={() => onSelectTab('studio')}
          className={cn(
            'flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors',
            currentTab === 'studio' ? 'text-spotify-green' : 'text-spotify-muted hover:text-white'
          )}
        >
          <Sliders className="h-5 w-5" />
          <span>Studio</span>
        </button>
      )}

      {user && (
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className={cn(
            'flex flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors',
            currentTab === 'profile' ? 'text-spotify-green' : 'text-spotify-muted hover:text-white'
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>
      )}
    </nav>
  );
}
