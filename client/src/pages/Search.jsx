import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X, Play, Pause, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAudio } from '@/hooks/useAudio';
import { fetchAllMusic } from '@/api/music.api';
import { Input } from '@/components/ui/Input';
import { formatTime } from '@/lib/formatTime';
import { cn } from '@/lib/utils';

const BROWSE_GENRES = [
  { name: 'Podcasts', color: 'from-orange-600 to-amber-700' },
  { name: 'Made For You', color: 'from-blue-700 to-indigo-900' },
  { name: 'Charts', color: 'from-purple-600 to-pink-800' },
  { name: 'New Releases', color: 'from-emerald-600 to-teal-800' },
  { name: 'Discover', color: 'from-rose-600 to-red-800' },
  { name: 'Live Events', color: 'from-violet-600 to-purple-900' },
];

export function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [allTracks, setAllTracks] = useState([]);
  const { currentTrack, isPlaying, playPlaylist, togglePlay } = useAudio();

  useEffect(() => {
    let mounted = true;
    async function loadTracks() {
      try {
        const data = await fetchAllMusic();
        if (mounted && Array.isArray(data)) {
          setAllTracks(
            data.map((t) => ({
              _id: t._id || t.id,
              id: t._id || t.id,
              title: t.musicName || t.title || 'Untitled',
              artist: t.artist?.userName || t.artist?.name || 'Artist',
              musicUrl: t.musicUrl,
              coverUrl: t.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80',
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load search tracks:', err);
      }
    }
    loadTracks();
    return () => { mounted = false; };
  }, []);

  const filteredTracks = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    return allTracks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
  }, [allTracks, debouncedQuery]);

  const handleRowPlay = (index) => {
    const selected = filteredTracks[index];
    const isCurrent = (currentTrack?._id && currentTrack._id === selected._id) || (currentTrack?.id && currentTrack.id === selected._id);
    if (isCurrent) {
      togglePlay();
    } else {
      playPlaylist(filteredTracks, index);
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-spotify-muted pointer-events-none" />
        <Input
          type="text"
          placeholder="What do you want to play?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 pr-10 rounded-full bg-spotify-surface border-transparent focus-visible:border-white focus-visible:bg-spotify-highlight text-sm text-white"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spotify-muted hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results View */}
      {debouncedQuery.trim() ? (
        filteredTracks.length > 0 ? (
          <div className="rounded-lg bg-spotify-surface/20 p-2">
            <div className="grid grid-cols-[36px_1fr_1fr_60px] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-spotify-subtext border-b border-white/5">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span className="flex justify-end"><Clock className="h-4 w-4" /></span>
            </div>
            <div className="mt-1 divide-y divide-white/5">
              {filteredTracks.map((track, idx) => {
                const isCurrent = (currentTrack?._id && currentTrack._id === track._id) || (currentTrack?.id && currentTrack.id === track._id);
                const isRowPlaying = isCurrent && isPlaying;
                return (
                  <div
                    key={track._id}
                    onClick={() => handleRowPlay(idx)}
                    className={cn(
                      'group grid grid-cols-[36px_1fr_1fr_60px] items-center px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-sm',
                      isCurrent && 'bg-white/5'
                    )}
                  >
                    <span className="text-spotify-subtext group-hover:hidden">{idx + 1}</span>
                    <button type="button" className="hidden group-hover:flex items-center text-white">
                      {isRowPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
                    </button>
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <img src={track.coverUrl} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" />
                      <span className={cn('truncate font-medium', isCurrent ? 'text-spotify-green' : 'text-white')}>{track.title}</span>
                    </div>
                    <span className="truncate text-spotify-subtext pr-4">{track.artist}</span>
                    <span className="text-xs text-spotify-muted flex justify-end tabular-nums">3:45</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-white">No tracks found matching "{debouncedQuery}"</h3>
            <p className="mt-2 text-sm text-spotify-subtext">Please make sure words are spelled correctly or use fewer keywords.</p>
          </div>
        )
      ) : (
        /* Browse Categories when idle */
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Browse all</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {BROWSE_GENRES.map((g) => (
              <div
                key={g.name}
                onClick={() => setQuery(g.name)}
                className={cn('relative aspect-square overflow-hidden rounded-lg p-4 font-bold text-white bg-gradient-to-br transition-transform hover:scale-105 cursor-pointer shadow-lg', g.color)}
              >
                <span className="text-lg">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
