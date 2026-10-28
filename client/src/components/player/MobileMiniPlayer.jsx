import React from 'react';
import { Play, Pause, Heart, Music, SkipForward } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

export function MobileMiniPlayer({ onExpand }) {
  const { currentTrack, isPlaying, togglePlay, playNext, playbackProgress } = useAudio();
  const { isLiked, toggleLike } = useFavorites();

  if (!currentTrack) return null;
  const liked = isLiked(currentTrack._id || currentTrack.id);

  return (
    <div
      onClick={onExpand}
      className="fixed bottom-[72px] left-2 right-2 z-40 md:hidden overflow-hidden rounded-lg bg-spotify-highlight/95 border border-white/10 p-2 shadow-2xl backdrop-blur-md cursor-pointer select-none"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {currentTrack.coverUrl ? (
            <img
              src={currentTrack.coverUrl}
              alt=""
              className="h-10 w-10 rounded object-cover flex-shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-spotify-surface text-spotify-muted flex-shrink-0">
              <Music className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">{currentTrack.title}</p>
            <p className="truncate text-[11px] text-spotify-subtext">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(currentTrack);
            }}
            className={cn('p-1.5 transition-colors active:scale-95', liked ? 'text-spotify-green' : 'text-spotify-subtext')}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform active:scale-95 shadow-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-black" />
            ) : (
              <Play className="h-4 w-4 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playNext(true);
            }}
            className="p-1.5 text-white/80 hover:text-white transition-colors active:scale-95"
            aria-label="Next track"
          >
            <SkipForward className="h-5 w-5 fill-white" />
          </button>
        </div>
      </div>

      {/* Mini Progress Bar on Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-spotify-green transition-all duration-200"
          style={{ width: `${playbackProgress}%` }}
        />
      </div>
    </div>
  );
}
