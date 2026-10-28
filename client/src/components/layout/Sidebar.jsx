import React from 'react';
import { Home, Search, Library, Plus, Disc3, Radio, Sliders, ListMusic, User } from 'lucide-react';
import { usePlaylists } from '@/hooks/usePlaylists';
import { NavItem } from './NavItem';
import { cn } from '@/lib/utils';

export function Sidebar({ currentTab = 'home', onSelectTab, user, onCreatePlaylistClick, onLoginClick }) {
  const { playlists } = usePlaylists();

  const handleCreateClick = () => {
    if (!user) {
      onLoginClick?.();
    } else {
      onCreatePlaylistClick?.();
    }
  };

  return (
    <aside className="hidden md:flex h-full w-64 flex-col gap-2 p-2 select-none flex-shrink-0">
      {/* Top Main Navigation Section */}
      <div className="flex flex-col rounded-lg bg-spotify-base p-3">
        <div className="mb-4 flex items-center gap-2.5 px-3 pt-1 text-white">
          <img src="/favicon.png" alt="Resowave Logo" className="h-7 w-7 rounded-lg object-contain shadow-sm" />
          <span className="text-lg font-bold tracking-tight">Resowave</span>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem
            icon={Home}
            label="Home"
            active={currentTab === 'home'}
            onClick={() => onSelectTab?.('home')}
          />
          <NavItem
            icon={Search}
            label="Search"
            active={currentTab === 'search'}
            onClick={() => onSelectTab?.('search')}
          />
          {user?.role === 'artist' && (
            <NavItem
              icon={Sliders}
              label="Artist Studio"
              active={currentTab === 'studio'}
              onClick={() => onSelectTab?.('studio')}
              badge="Artist"
            />
          )}
          {user && (
            <NavItem
              icon={User}
              label="Profile & Stats"
              active={currentTab === 'profile'}
              onClick={() => onSelectTab?.('profile')}
            />
          )}
        </nav>
      </div>

      {/* Library & Playlists Section */}
      <div className="flex flex-1 flex-col rounded-lg bg-spotify-base p-3 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 text-spotify-subtext">
          <div className="flex items-center gap-3 font-semibold text-white">
            <Library className="h-6 w-6" />
            <span>Your Library</span>
          </div>
          <button
            type="button"
            onClick={handleCreateClick}
            className="rounded-full p-1.5 hover:bg-spotify-highlight hover:text-white transition-colors"
            title={user ? 'Create playlist' : 'Log in to create playlist'}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Library List */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-1">
          <NavItem
            icon={Radio}
            label="Liked Songs"
            active={currentTab === 'liked'}
            onClick={() => onSelectTab?.('liked')}
            badge="Auto"
          />

          {user ? (
            <div className="pt-2 border-t border-white/5 space-y-0.5">
              {playlists.map((pl) => {
                const tabKey = `playlist:${pl.id}`;
                const isActive = currentTab === tabKey;
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => onSelectTab?.(tabKey)}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold truncate transition-colors text-left',
                      isActive
                        ? 'text-spotify-green bg-spotify-surface'
                        : 'text-spotify-subtext hover:text-white hover:bg-spotify-surface/40'
                    )}
                  >
                    <ListMusic className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{pl.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-lg bg-spotify-surface/30 p-3 mt-3 border border-white/5">
              <p className="text-xs font-bold text-white">Build your library</p>
              <p className="text-[11px] text-spotify-subtext leading-relaxed">
                Log in to create playlists and see your saved songs.
              </p>
              <button
                type="button"
                onClick={onLoginClick}
                className="mt-1 self-start rounded-full bg-white px-3.5 py-1 text-xs font-bold text-black hover:scale-105 active:scale-95 transition-all shadow"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
