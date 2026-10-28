import React from 'react';
import { formatTime } from '@/lib/formatTime';

export function ProgressBar({
  currentTime = 0,
  duration = 0,
  onSeek,
  disabled = false,
}) {
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = (e) => {
    const nextSeconds = Number(e.target.value);
    onSeek?.(nextSeconds);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 text-right text-[11px] tabular-nums text-spotify-subtext">
        {formatTime(currentTime)}
      </span>

      {/* Interactive slider track with group hover green transition */}
      <div className="group relative flex flex-1 items-center">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleChange}
          disabled={disabled || duration === 0}
          className="h-1 w-full rounded-full bg-spotify-highlight focus:outline-none"
          style={{
            background: `linear-gradient(to right, #1DB954 ${percentage}%, #4d4d4d ${percentage}%)`,
          }}
          aria-label="Seek track position"
        />
      </div>

      <span className="w-10 text-left text-[11px] tabular-nums text-spotify-subtext">
        {formatTime(duration)}
      </span>
    </div>
  );
}
