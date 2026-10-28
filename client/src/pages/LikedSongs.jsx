import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Play, Pause, Clock, Music, Lock, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { fetchAllMusic } from '@/api/music.api';
import { cn } from '@/lib/utils';

export function LikedSongs({ onLoginClick }) {
  const { likedTrackIds, toggleLike } = useFavorites();
  const { currentTrack, isPlaying, playPlaylist, togglePlay } = useAudio();
  const { user } = useAuth();
  const [allTracks, setAllTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadTracks();
    return () => { mounted = false; };
  }, []);

  const likedTracks = useMemo(() => {
    if (!user) return [];
    return allTracks.filter((t) => likedTrackIds.includes(t._id));
  }, [user, allTracks, likedTrackIds]);

  const handlePlayLikedQueue = () => {
    if (likedTracks.length === 0) return;
    playPlaylist(likedTracks, 0);
  };

  // If user is not logged in, enforce empty library and prompt login first
  if (!user) {
    return (
      <div className="-mx-6 -mt-2 space-y-6 pb-16 select-none">
        {/* Banner */}
        <div className="flex items-end gap-6 bg-gradient-to-b from-indigo-900/60 via-indigo-950/40 to-spotify-base px-6 pb-6 pt-12">
          <div className="flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 shadow-2xl opacity-60">
            <Heart className="h-20 w-20 fill-white text-white shadow-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">Playlist</span>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">Liked Songs</h1>
            <p className="mt-1 text-xs font-medium text-spotify-subtext">
              0 songs • Private to your account
            </p>
          </div>
        </div>

        {/* Forced Login Screen */}
        <div className="px-6 flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-4 text-spotify-green">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Please log in first to access your library</h2>
          <p className="mt-2 text-sm text-spotify-subtext leading-relaxed">
            Your liked songs and personal playlists are saved securely to your Resowave account. Log in or create an account to start building your collection.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => onLoginClick?.('login')}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-spotify-green py-3 text-sm font-bold text-black hover:bg-spotify-green-hover hover:scale-105 active:scale-95 transition-all shadow-lg shadow-spotify-green/20"
            >
              <span>Log In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onLoginClick?.('register')}
              className="flex w-full items-center justify-center rounded-full border border-white/20 bg-transparent py-3 text-sm font-bold text-white hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-6 -mt-2 space-y-6 pb-16 select-none">
      {/* Resowave Signature Liked Songs Banner */}
      <div className="flex items-end gap-6 bg-gradient-to-b from-indigo-800 via-indigo-950/60 to-spotify-base px-6 pb-6 pt-12">
        <div className="flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 shadow-2xl">
          <Heart className="h-20 w-20 fill-white text-white shadow-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white/90">Playlist</span>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">Liked Songs</h1>
          <div className="mt-1 flex items-center gap-2 text-xs font-medium text-white/80">
            <span className="font-bold text-white">{user?.name || user?.userName || 'Listener'}</span>
            <span>•</span>
            <span>{likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Play Action Controls */}
        {likedTracks.length > 0 && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePlayLikedQueue}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-spotify-green text-black hover:scale-105 active:scale-95 transition-transform shadow-xl"
              aria-label="Play liked songs"
            >
              <Play className="h-6 w-6 fill-black translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Tracks Table */}
        {isLoading ? (
          <div className="py-20 text-center text-spotify-subtext">Loading favorites...</div>
        ) : likedTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-spotify-surface/30 py-20 text-center">
            <Heart className="h-14 w-14 text-spotify-muted mb-3" />
            <h3 className="text-lg font-bold text-white">Songs you like will appear here</h3>
            <p className="mt-1 text-xs text-spotify-subtext">Save songs by tapping the heart icon anywhere in the player.</p>
          </div>
        ) : (
          <div className="rounded-lg bg-spotify-surface/20 p-2">
            <div className="grid grid-cols-[36px_1fr_1fr_60px] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-spotify-subtext border-b border-white/5">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span className="flex justify-end"><Clock className="h-4 w-4" /></span>
            </div>
            <div className="mt-1 divide-y divide-white/5">
              {likedTracks.map((track, idx) => {
                const isCurrent = (currentTrack?._id && currentTrack._id === track._id) || (currentTrack?.id && currentTrack.id === track._id);
                return (
                  <div
                    key={track._id}
                    onClick={() => playPlaylist(likedTracks, idx)}
                    className={cn(
                      'group grid grid-cols-[36px_1fr_1fr_60px] items-center px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-sm',
                      isCurrent && 'bg-white/5'
                    )}
                  >
                    <span className="text-spotify-subtext group-hover:hidden">{idx + 1}</span>
                    <button type="button" className="hidden group-hover:flex items-center text-white">
                      {isCurrent && isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
                    </button>
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <img src={track.coverUrl} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" />
                      <span className={cn('truncate font-medium', isCurrent ? 'text-spotify-green' : 'text-white')}>{track.title}</span>
                    </div>
                    <span className="truncate text-spotify-subtext pr-4">{track.artist}</span>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track);
                        }}
                        className="text-spotify-green p-1 hover:scale-110 transition-transform"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
