import React from 'react';
import { X, Play, Music, ListMusic, Trash2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';

export function QueueDrawer({ isOpen, onClose }) {
  const {
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    jumpToQueueIndex,
    removeFromQueue,
    clearUpcomingQueue,
  } = useAudio();

  if (!isOpen) return null;

  const upcomingTracks = currentIndex >= 0 ? playlist.slice(currentIndex + 1) : [];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-spotify-surface border-l border-white/10 p-5 shadow-2xl animate-in slide-in-from-right duration-200 select-none pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-spotify-green" />
          <h2 className="text-base font-bold text-white">Play Queue</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-spotify-subtext hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pt-3">
        {/* Now Playing Segment */}
        {currentTrack && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-spotify-subtext mb-2">
              Now Playing
            </h3>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-2.5">
              <img
                src={currentTrack.coverUrl}
                alt=""
                className="h-12 w-12 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-spotify-green">{currentTrack.title}</p>
                <p className="truncate text-xs text-spotify-subtext">{currentTrack.artist}</p>
              </div>
              {isPlaying && (
                <div className="flex items-end gap-0.5 px-2">
                  <span className="h-3 w-0.5 animate-pulse bg-spotify-green" />
                  <span className="h-4 w-0.5 animate-pulse bg-spotify-green delay-75" />
                  <span className="h-2 w-0.5 animate-pulse bg-spotify-green delay-150" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Up Segment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-spotify-subtext">
              Next Up ({upcomingTracks.length})
            </h3>
            {upcomingTracks.length > 0 && (
              <button
                type="button"
                onClick={clearUpcomingQueue}
                className="flex items-center gap-1 text-[11px] font-semibold text-spotify-muted hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear queue</span>
              </button>
            )}
          </div>

          {upcomingTracks.length === 0 ? (
            <div className="py-12 text-center text-xs text-spotify-muted">
              <Music className="h-8 w-8 mx-auto mb-2 text-spotify-highlight" />
              <p>No upcoming tracks in queue.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {upcomingTracks.map((track, i) => {
                const absoluteIndex = currentIndex + 1 + i;
                return (
                  <div
                    key={`${track._id}-${i}`}
                    onClick={() => jumpToQueueIndex(absoluteIndex)}
                    className="group flex items-center justify-between rounded-md p-2 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <img
                        src={track.coverUrl}
                        alt=""
                        className="h-9 w-9 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white group-hover:text-spotify-green">
                          {track.title}
                        </p>
                        <p className="truncate text-[11px] text-spotify-subtext">{track.artist}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(track._id);
                      }}
                      className="p-1 text-spotify-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from queue"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
