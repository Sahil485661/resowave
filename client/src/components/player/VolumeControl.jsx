import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export function VolumeControl({ volume = 0.7, onVolumeChange, onToggleMute }) {
  const percentage = Math.round(volume * 100);

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const Icon = getVolumeIcon();

  return (
    <div className="flex w-1/4 min-w-[180px] items-center justify-end gap-2">
      <button
        type="button"
        onClick={onToggleMute}
        className="text-spotify-subtext hover:text-white transition-colors"
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
      >
        <Icon className="h-5 w-5" />
      </button>

      <div className="group relative flex w-24 items-center">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange?.(Number(e.target.value))}
          className="h-1 w-full rounded-full bg-spotify-highlight focus:outline-none"
          style={{
            background: `linear-gradient(to right, #1DB954 ${percentage}%, #4d4d4d ${percentage}%)`,
          }}
          aria-label="Volume slider"
        />
      </div>
    </div>
  );
}
