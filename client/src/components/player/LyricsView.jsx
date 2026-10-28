import React, { useMemo, useEffect, useRef } from 'react';
import { X, Mic2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useExtractColor } from '@/hooks/useExtractColor';
import { parseLrc } from '@/lib/lrcParser';
import { AudioVisualizer } from './AudioVisualizer';
import { cn } from '@/lib/utils';

// Built-in demo synced LRC lines for sample tracks
const DEFAULT_LRC = `
[00:00.00] ♪ Instrumental Intro ♪
[00:04.00] I'm tryna put you in the worst mood, ah
[00:08.50] P1 cleaner than your church shoes, ah
[00:12.00] Milli point two just to hurt you, ah
[00:16.00] All red Lamb' just to tease you, ah
[00:20.00] None of these toys on lease too, ah
[00:24.00] Made your whole year in a week too, ah
[00:28.00] Main bitch out of your league too, ah
[00:32.00] Side bitch out of your league too, ah
[00:36.00] Look what you've done
[00:40.00] I'm a motherfuckin' starboy
[00:44.50] Look what you've done
[00:48.00] I'm a motherfuckin' starboy
[00:52.00] Every day a star is born, clap if this feel like you
[00:56.00] House so empty, need a centerpiece
[01:00.00] Twenty racks a table cut from ebony
[01:04.00] Cut that ivory into skinny pieces
[01:08.00] Then she clean it with her face, man, I love my baby
`;

export function LyricsView({ isOpen, onClose }) {
  const { currentTrack, currentTime, seek } = useAudio();
  const { rgb } = useExtractColor(currentTrack?.coverUrl);
  const activeLineRef = useRef(null);

  const lyrics = useMemo(() => {
    return parseLrc(currentTrack?.lrc || DEFAULT_LRC);
  }, [currentTrack]);

  // Find active line index based on current playback timestamp
  const activeIndex = useMemo(() => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        return i;
      }
    }
    return 0;
  }, [lyrics, currentTime]);

  // Center active lyric line with smooth scroll
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!isOpen || !currentTrack) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl select-none animate-in fade-in duration-300"
      style={{
        background: `radial-gradient(circle at 50% 20%, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.45) 0%, #000 85%)`,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <Mic2 className="h-6 w-6 text-spotify-green animate-pulse" />
          <div>
            <h2 className="text-base font-extrabold text-white">{currentTrack.title}</h2>
            <p className="text-xs text-spotify-subtext">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <AudioVisualizer className="h-8 w-28 hidden sm:block" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lyrics view"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Synced Scrollable Lyrics Container */}
      <div className="flex-1 overflow-y-auto px-6 py-20 text-center space-y-7 scroll-smooth">
        {lyrics.map((line, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <p
              key={`${line.time}-${index}`}
              ref={isActive ? activeLineRef : null}
              onClick={() => seek(line.time)}
              className={cn(
                'cursor-pointer text-2xl sm:text-3xl font-extrabold tracking-tight transition-all duration-300 py-2 hover:opacity-100',
                isActive
                  ? 'text-white scale-105 drop-shadow-[0_0_24px_rgba(29,185,84,0.6)]'
                  : isPast
                  ? 'text-white/60 opacity-60'
                  : 'text-white/30 opacity-30'
              )}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
