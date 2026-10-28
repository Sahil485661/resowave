import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, Trash2, Clock, Music, ListMusic, MinusCircle } from 'lucide-react';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { fetchAllMusic } from '@/api/music.api';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { formatTime } from '@/lib/formatTime';
import { cn } from '@/lib/utils';

export function PlaylistView({ playlistId, onBackToHome, onLoginClick }) {
  const { user } = useAuth();
  const { getPlaylist, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();
  const { currentTrack, isPlaying, playPlaylist, togglePlay } = useAudio();
  const [allTracks, setAllTracks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const playlist = getPlaylist(playlistId);

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
      }
    }
    loadTracks();
    return () => { mounted = false; };
  }, []);

  const playlistTracks = useMemo(() => {
    if (!playlist) return [];
    return allTracks.filter((t) => playlist.trackIds.includes(t._id));
  }, [allTracks, playlist]);

  if (!user) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 select-none">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 mx-auto mb-4 text-spotify-green">
          <ListMusic className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Please log in to view this playlist</h3>
        <p className="mt-2 text-xs text-spotify-subtext leading-relaxed">
          Custom playlists and library collections are tied to your Resowave account.
        </p>
        <button
          type="button"
          onClick={() => onLoginClick?.('login')}
          className="mt-6 rounded-full bg-spotify-green px-8 py-3 text-sm font-bold text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-spotify-green/20"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="py-20 text-center select-none">
        <h3 className="text-xl font-bold text-white">Playlist not found</h3>
        <button
          type="button"
          onClick={onBackToHome}
          className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-bold text-black hover:scale-105 transition-transform"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePlayPlaylist = () => {
    if (playlistTracks.length === 0) return;
    playPlaylist(playlistTracks, 0);
  };

  const handleDeleteConfirm = () => {
    deletePlaylist(playlist.id);
    setShowDeleteModal(false);
    onBackToHome?.();
  };

  return (
    <div className="-mx-6 -mt-2 space-y-6 pb-16 select-none">
      {/* Playlist Hero Banner */}
      <div className="flex items-end gap-6 bg-gradient-to-b from-emerald-800 via-emerald-950/60 to-spotify-base px-6 pb-6 pt-12">
        <div className="flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-lg bg-spotify-highlight shadow-2xl">
          <ListMusic className="h-20 w-20 text-spotify-green" />
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/90">Public Playlist</span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl truncate">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-xs text-white/70 line-clamp-2 max-w-xl">{playlist.description}</p>
          )}
          <div className="mt-1 flex items-center gap-2 text-xs font-medium text-white/80">
            <span>{playlistTracks.length} {playlistTracks.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Playlist Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={playlistTracks.length === 0}
            onClick={handlePlayPlaylist}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-spotify-green text-black hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform shadow-xl"
            aria-label="Play playlist"
          >
            <Play className="h-6 w-6 fill-black translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded p-2 text-spotify-muted hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Delete playlist"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Tracks List */}
        {playlistTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-spotify-surface/30 py-20 text-center">
            <Music className="h-12 w-12 text-spotify-muted mb-3" />
            <h3 className="text-base font-bold text-white">This playlist is empty</h3>
            <p className="mt-1 text-xs text-spotify-subtext">Find songs in Search or Home and add them to this playlist.</p>
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
              {playlistTracks.map((track, idx) => {
                const isCurrent = (currentTrack?._id && currentTrack._id === track._id) || (currentTrack?.id && currentTrack.id === track._id);
                return (
                  <div
                    key={track._id}
                    onClick={() => playPlaylist(playlistTracks, idx)}
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
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrackFromPlaylist(playlist.id, track._id);
                        }}
                        className="text-spotify-muted hover:text-red-400 p-1 transition-colors"
                        title="Remove from playlist"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        isOpen={showDeleteModal}
        title="Delete Playlist?"
        description={`Are you sure you want to delete "${playlist.name}"? Tracks inside will remain safe in ImageKit.`}
        confirmText="Delete playlist"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
