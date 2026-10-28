import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlayerControls({
  isPlaying = false,
  isBuffering = false,
  isShuffle = false,
  repeatMode = 'off', // 'off' | 'all' | 'one'
  disabled = false,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
}) {
  const isRepeatActive = repeatMode !== 'off';

  return (
    <div className="flex items-center gap-4">
      {/* Shuffle Mode Toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggleShuffle}
        className={cn(
          'relative p-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
          isShuffle ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
        )}
        title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
        aria-label="Shuffle"
      >
        <Shuffle className="h-4 w-4" />
        {isShuffle && (
          <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-spotify-green" />
        )}
      </button>

      {/* Previous Track */}
      <button
        type="button"
        disabled={disabled}
        onClick={onPrevious}
        className="text-spotify-subtext hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous track"
      >
        <SkipBack className="h-5 w-5 fill-current" />
      </button>

      {/* Main Play / Pause Circle with Buffering Spinner */}
      <button
        type="button"
        disabled={disabled}
        onClick={onPlayPause}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform',
          disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        )}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isBuffering ? (
          <Loader2 className="h-4 w-4 animate-spin text-black" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4 fill-black" />
        ) : (
          <Play className="h-4 w-4 fill-black translate-x-0.5" />
        )}
      </button>

      {/* Next Track */}
      <button
        type="button"
        disabled={disabled}
        onClick={onNext}
        className="text-spotify-subtext hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next track"
      >
        <SkipForward className="h-5 w-5 fill-current" />
      </button>

      {/* 3-State Repeat Mode Toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={onCycleRepeat}
        className={cn(
          'relative p-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
          isRepeatActive ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
        )}
        title={`Repeat: ${repeatMode}`}
        aria-label="Cycle repeat mode"
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="h-4 w-4" />
        ) : (
          <Repeat className="h-4 w-4" />
        )}
        {repeatMode === 'all' && (
          <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-spotify-green" />
        )}
      </button>
    </div>
  );
}
