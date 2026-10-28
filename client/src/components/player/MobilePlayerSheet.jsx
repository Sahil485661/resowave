import React from 'react';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, Loader2, Mic2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useFavorites } from '@/hooks/useFavorites';
import { formatTime } from '@/lib/formatTime';
import { cn } from '@/lib/utils';

export function MobilePlayerSheet({ isOpen, onClose, onOpenLyrics }) {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    toggleShuffle,
    cycleRepeatMode,
  } = useAudio();

  const { isLiked, toggleLike } = useFavorites();

  if (!isOpen || !currentTrack) return null;
  const liked = isLiked(currentTrack._id || currentTrack.id);
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[60] md:hidden bg-gradient-to-b from-spotify-surface via-spotify-base to-black px-6 pt-6 pb-12 pb-[max(3rem,env(safe-area-inset-bottom))] flex flex-col justify-between animate-in slide-in-from-bottom duration-300 select-none overflow-y-auto">
      {/* Top Bar with Down Chevron */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white active:scale-95 transition-transform"
          aria-label="Close player"
        >
          <ChevronDown className="h-7 w-7" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-white/70">
          Now Playing
        </span>
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenLyrics?.();
          }}
          className="p-2 text-white/80 hover:text-white active:scale-95 transition-transform"
          title="Lyrics"
          aria-label="Open lyrics"
        >
          <Mic2 className="h-5 w-5" />
        </button>
      </div>

      {/* Center: Large Album Cover */}
      <div className="my-auto flex flex-col items-center py-4">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="aspect-square w-full max-h-[36vh] max-w-[300px] rounded-2xl object-cover shadow-2xl"
        />
      </div>

      {/* Bottom Segment: Meta, Scrubber & Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="truncate text-xl font-black text-white">{currentTrack.title}</h2>
            <p className="truncate text-sm font-semibold text-spotify-subtext">{currentTrack.artist}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleLike(currentTrack)}
            className={cn('p-2 transition-transform active:scale-125', liked ? 'text-spotify-green' : 'text-spotify-subtext')}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('h-6 w-6', liked && 'fill-current')} />
          </button>
        </div>

        {/* Seek Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1.5 w-full rounded-full bg-spotify-highlight focus:outline-none"
            style={{
              background: `linear-gradient(to right, #1DB954 ${percentage}%, #4d4d4d ${percentage}%)`,
            }}
            aria-label="Seek track position"
          />
          <div className="flex justify-between text-xs tabular-nums text-spotify-subtext">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Big Touch-Friendly Controls */}
        <div className="flex items-center justify-between px-2 pt-2">
          <button
            type="button"
            onClick={toggleShuffle}
            className={cn('p-2 transition-colors active:scale-95', isShuffle ? 'text-spotify-green' : 'text-spotify-subtext')}
            aria-label="Toggle shuffle"
          >
            <Shuffle className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={playPrevious}
            className="p-2 text-white active:scale-95 transition-transform"
            aria-label="Previous track"
          >
            <SkipBack className="h-7 w-7 fill-white" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black active:scale-95 transition-transform shadow-xl"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isBuffering ? (
              <Loader2 className="h-8 w-8 animate-spin text-black" />
            ) : isPlaying ? (
              <Pause className="h-8 w-8 fill-black" />
            ) : (
              <Play className="h-8 w-8 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => playNext(true)}
            className="p-2 text-white active:scale-95 transition-transform"
            aria-label="Next track"
          >
            <SkipForward className="h-7 w-7 fill-white" />
          </button>

          <button
            type="button"
            onClick={cycleRepeatMode}
            className={cn('p-2 transition-colors active:scale-95', repeatMode !== 'off' ? 'text-spotify-green' : 'text-spotify-subtext')}
            aria-label="Cycle repeat mode"
          >
            {repeatMode === 'one' ? <Repeat1 className="h-6 w-6" /> : <Repeat className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
