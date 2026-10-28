import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { EQUALIZER_PRESETS } from '@/lib/webAudioEngine';
import { cn } from '@/lib/utils';

export function EqualizerModal({ isOpen, onClose }) {
  const {
    eqSettings,
    applyEqPreset,
    setCustomEqGain,
    crossfadeDuration,
    setCrossfadeDuration,
  } = useAudio();

  if (!isOpen) return null;

  const currentPreset = eqSettings?.preset || 'flat';
  const gains = eqSettings?.gains || { low: 0, mid: 0, high: 0 };

  const bands = [
    { key: 'low', label: 'Bass', freq: '320 Hz' },
    { key: 'mid', label: 'Midrange', freq: '1 kHz' },
    { key: 'high', label: 'Treble', freq: '3.2 kHz' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md rounded-2xl bg-spotify-surface border border-white/10 p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-spotify-green" />
            <div>
              <h2 className="text-base font-bold text-white">Equalizer & Audio Settings</h2>
              <p className="text-xs text-spotify-subtext">3-Band hardware tone shaping & crossfade</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-spotify-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Chips */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-spotify-subtext">Preset Profiles</label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {Object.entries(EQUALIZER_PRESETS).map(([key, data]) => {
              const isActive = currentPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyEqPreset(key)}
                  className={cn(
                    'rounded-full px-3.5 py-1 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-spotify-green text-black font-bold shadow-md'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {data.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Band Sliders */}
        <div className="space-y-4 rounded-xl bg-black/40 p-4 border border-white/5">
          {bands.map(({ key, label, freq }) => {
            const val = gains[key] || 0;
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    {label} <span className="text-spotify-muted font-normal">({freq})</span>
                  </span>
                  <span className="tabular-nums font-mono text-spotify-green font-bold">
                    {val > 0 ? `+${val}` : val} dB
                  </span>
                </div>
                <input
                  type="range"
                  min={-12}
                  max={12}
                  step={1}
                  value={val}
                  onChange={(e) => setCustomEqGain(key, Number(e.target.value))}
                  className="w-full accent-spotify-green cursor-pointer h-1.5 rounded-full bg-spotify-highlight"
                />
              </div>
            );
          })}
        </div>

        {/* Crossfade Duration Slider */}
        <div className="space-y-2 border-t border-white/5 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Crossfade Duration</span>
            <span className="font-mono text-spotify-green font-bold tabular-nums">
              {crossfadeDuration === 0 ? 'Off (0s)' : `${crossfadeDuration} seconds`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={crossfadeDuration}
            onChange={(e) => setCrossfadeDuration(Number(e.target.value))}
            className="w-full accent-spotify-green cursor-pointer h-1.5 rounded-full bg-spotify-highlight"
          />
          <p className="text-[11px] text-spotify-muted">
            Smoothly overlaps consecutive songs when switching or ending tracks.
          </p>
        </div>

        {/* Reset button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              applyEqPreset('flat');
              setCrossfadeDuration(2);
            }}
            className="flex items-center gap-1.5 text-xs text-spotify-subtext hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
}
