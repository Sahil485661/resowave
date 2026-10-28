import React from 'react';
import { Play, Pause, Music, Heart, MoreHorizontal, Loader2, Share2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';

export function TrackCard({
  track,
  isActive = false,
  isPlaying = false,
  onPlayToggle,
  onMoreOptions,
  onShare,
}) {
  const { isLiked, toggleLike } = useFavorites();
  const { isBuffering } = useAudio();
  const trackId = track?._id || track?.id;
  const liked = isLiked(trackId);
  const isThisActiveAndPlaying = isActive && isPlaying;
  const isThisBuffering = isActive && isBuffering;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(track);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    onMoreOptions?.(track);
  };

  return (
    <div
      onClick={onPlayToggle}
      className={cn(
        'group relative flex flex-col rounded-md bg-spotify-surface/40 p-4 transition-all duration-200 cursor-pointer hover:bg-spotify-surface/80',
        isActive && 'bg-spotify-surface/90 shadow-md'
      )}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-spotify-highlight shadow-md">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-spotify-surface to-spotify-highlight text-spotify-muted">
            <Music className="h-12 w-12" />
          </div>
        )}

        {/* Floating Green Play/Pause/Buffer Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlayToggle();
          }}
          className={cn(
            'absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-spotify-green text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-spotify-green-hover',
            isThisActiveAndPlaying || isThisBuffering
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          )}
          aria-label={isThisActiveAndPlaying ? 'Pause song' : 'Play song'}
        >
          {isThisBuffering ? (
            <Loader2 className="h-5 w-5 animate-spin text-black" />
          ) : isThisActiveAndPlaying ? (
            <Pause className="h-5 w-5 fill-black" />
          ) : (
            <Play className="h-5 w-5 fill-black translate-x-0.5" />
          )}
        </button>

        {/* Equalizer indicator */}
        {isThisActiveAndPlaying && !isThisBuffering && (
          <div className="absolute top-2 left-2 flex items-end gap-0.5 rounded bg-black/60 px-1.5 py-1">
            <span className="h-3 w-0.5 animate-pulse bg-spotify-green" />
            <span className="h-4 w-0.5 animate-pulse bg-spotify-green delay-75" />
            <span className="h-2 w-0.5 animate-pulse bg-spotify-green delay-150" />
          </div>
        )}
      </div>

      {/* Track Meta Details */}
      <div className="mt-3 flex items-start justify-between gap-1">
        <div className="flex flex-col min-w-0 flex-1">
          <h3
            className={cn(
              'truncate text-sm font-bold transition-colors',
              isActive ? 'text-spotify-green' : 'text-white group-hover:text-white'
            )}
            title={track.title}
          >
            {track.title}
          </h3>
          <p className="mt-1 truncate text-xs text-spotify-subtext" title={track.artist}>
            {track.artist}
          </p>
        </div>

        {/* Action icons: Heart, Share & Add */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleLikeClick}
            className={cn(
              'p-1 transition-colors',
              liked ? 'text-spotify-green' : 'text-spotify-muted hover:text-white opacity-0 group-hover:opacity-100'
            )}
            title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
          </button>

          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare(track);
              }}
              className="p-1 text-spotify-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Share track"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}

          {onMoreOptions && (
            <button
              type="button"
              onClick={handleMoreClick}
              className="p-1 text-spotify-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Add to playlist"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
