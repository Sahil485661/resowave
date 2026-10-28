import React from 'react';
import { Heart, Music2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

export function TrackInfo({ track }) {
  const { isLiked, toggleLike } = useFavorites();
  const trackId = track?._id || track?.id;
  const liked = isLiked(trackId);

  if (!track) {
    return (
      <div className="flex w-1/4 min-w-[180px] items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded bg-spotify-surface text-spotify-muted">
          <Music2 className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-spotify-muted font-medium">No track selected</span>
          <span className="text-[11px] text-spotify-muted/70">Pick a song to play</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-1/4 min-w-[180px] items-center gap-3">
      {track.coverUrl ? (
        <img
          src={track.coverUrl}
          alt={track.title || 'Track Cover'}
          className="h-14 w-14 rounded object-cover shadow-sm flex-shrink-0"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded bg-spotify-surface text-spotify-subtext flex-shrink-0">
          <Music2 className="h-6 w-6" />
        </div>
      )}

      <div className="flex flex-col overflow-hidden mr-2">
        <span className="truncate text-xs font-semibold text-white hover:underline cursor-pointer">
          {track.title || 'Untitled'}
        </span>
        <span className="truncate text-[11px] text-spotify-subtext hover:underline hover:text-white cursor-pointer">
          {track.artist || track.artistName || 'Unknown Artist'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => toggleLike(track)}
        className={cn(
          'transition-colors p-1',
          liked ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
        )}
        aria-label={liked ? 'Unlike track' : 'Like track'}
        title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
      >
        <Heart className={cn('h-4 w-4 transition-transform active:scale-125', liked && 'fill-current')} />
      </button>
    </div>
  );
}
