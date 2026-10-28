import React from 'react';
import { ListMusic, Mic2, SlidersHorizontal, Share2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { TrackInfo } from './TrackInfo';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SpeedControl } from './SpeedControl';
import { cn } from '@/lib/utils';

export function PlayerBar({
  isQueueOpen = false,
  onToggleQueue,
  isLyricsOpen = false,
  onToggleLyrics,
  isEqualizerOpen = false,
  onToggleEqualizer,
  onShareClick,
}) {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    playNext,
    playPrevious,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
  } = useAudio();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 hidden md:flex h-20 bg-spotify-surface border-t border-white/5 px-4 items-center justify-between select-none">
      {/* Left: Track Information */}
      <TrackInfo track={currentTrack} />

      {/* Center: Playback Controls & Progress Bar */}
      <div className="flex flex-1 max-w-[680px] flex-col items-center gap-1.5 px-4">
        <PlayerControls
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          disabled={!currentTrack}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          onPlayPause={togglePlay}
          onNext={playNext}
          onPrevious={playPrevious}
          onToggleShuffle={toggleShuffle}
          onCycleRepeat={cycleRepeatMode}
        />
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          disabled={!currentTrack}
          onSeek={seek}
        />
      </div>

      {/* Right: Audio Effects, Lyrics, Queue & Volume */}
      <div className="flex w-1/4 min-w-[280px] items-center justify-end gap-2">
        <SpeedControl disabled={!currentTrack} />

        <button
          type="button"
          onClick={() => onShareClick?.(currentTrack)}
          disabled={!currentTrack}
          className="p-1.5 rounded text-spotify-subtext hover:text-white transition-colors disabled:opacity-40"
          title="Share track"
        >
          <Share2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleEqualizer}
          className={cn(
            'p-1.5 rounded transition-colors',
            isEqualizerOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white'
          )}
          title="Equalizer & Crossfade"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleLyrics}
          disabled={!currentTrack}
          className={cn(
            'p-1.5 rounded transition-colors disabled:opacity-40',
            isLyricsOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white'
          )}
          title="Lyrics"
        >
          <Mic2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleQueue}
          className={cn(
            'p-1.5 rounded transition-colors',
            isQueueOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white'
          )}
          title="Play queue"
        >
          <ListMusic className="h-4 w-4" />
        </button>

        <VolumeControl
          volume={isMuted ? 0 : volume}
          onVolumeChange={setVolumeLevel}
          onToggleMute={toggleMute}
        />
      </div>
    </footer>
  );
}
