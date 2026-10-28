import React from 'react';
import { X, Check, Plus, FolderPlus } from 'lucide-react';
import { usePlaylists } from '@/hooks/usePlaylists';

export function AddToPlaylistModal({ isOpen, track, onClose, onCreateNew }) {
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist } = usePlaylists();

  if (!isOpen || !track) return null;
  const trackId = track._id || track.id;

  const handleToggle = (playlist) => {
    const isAlreadyIn = playlist.trackIds.includes(trackId);
    if (isAlreadyIn) {
      removeTrackFromPlaylist(playlist.id, trackId);
    } else {
      addTrackToPlaylist(playlist.id, trackId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-xl border border-white/10 bg-spotify-surface p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white truncate pr-2">
            Add to Playlist
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-spotify-subtext hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-3 max-h-60 overflow-y-auto space-y-1">
          {playlists.map((pl) => {
            const inPlaylist = pl.trackIds.includes(trackId);
            return (
              <button
                key={pl.id}
                type="button"
                onClick={() => handleToggle(pl)}
                className="flex w-full items-center justify-between p-2.5 rounded-md hover:bg-white/10 transition-colors text-left"
              >
                <div className="min-w-0 pr-2">
                  <p className="truncate text-sm font-semibold text-white">{pl.name}</p>
                  <p className="text-xs text-spotify-subtext">{pl.trackIds.length} songs</p>
                </div>
                {inPlaylist ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-spotify-green text-black">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateNew?.();
            }}
            className="flex items-center gap-2 text-xs font-bold text-spotify-subtext hover:text-white py-1 transition-colors"
          >
            <FolderPlus className="h-4 w-4 text-spotify-green" />
            <span>New playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}
