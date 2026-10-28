import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0];

export function SpeedControl({ disabled = false }) {
  const { playbackSpeed, setPlaybackSpeed } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-center rounded px-2 py-1 text-xs font-bold transition-colors disabled:opacity-40',
          playbackSpeed !== 1.0
            ? 'text-spotify-green bg-white/10'
            : 'text-spotify-subtext hover:text-white hover:bg-white/5'
        )}
        title="Playback Speed"
      >
        {playbackSpeed}x
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-20 rounded-lg bg-spotify-surface border border-white/10 p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col gap-0.5">
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => {
                  setPlaybackSpeed(speed);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between rounded px-2 py-1.5 text-xs font-semibold transition-colors',
                  playbackSpeed === speed
                    ? 'text-spotify-green bg-white/10'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
              >
                <span>{speed}x</span>
                {speed === 1.0 && <span className="text-[10px] text-spotify-muted">Std</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
