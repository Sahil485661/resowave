import { useState, useCallback } from 'react';
import { setEqualizerGains, EQUALIZER_PRESETS } from '@/lib/webAudioEngine';
import {
  getSavedSpeed,
  saveSpeed,
  getSavedCrossfade,
  saveCrossfade,
  getSavedEqSettings,
  saveEqSettings,
} from '@/lib/audioStorage';

export function useAudioEffects(audioRef) {
  const [playbackSpeed, setPlaybackSpeed] = useState(() => getSavedSpeed());
  const [crossfadeDuration, setCrossfadeDuration] = useState(() => getSavedCrossfade());
  const [eqSettings, setEqSettings] = useState(() => getSavedEqSettings());

  const setPlaybackSpeedLevel = useCallback((speed) => {
    const clamped = Math.max(0.5, Math.min(speed, 2.5));
    if (audioRef.current) {
      audioRef.current.playbackRate = clamped;
      audioRef.current.preservesPitch = true;
    }
    setPlaybackSpeed(clamped);
    saveSpeed(clamped);
  }, [audioRef]);

  const setCrossfadeDurationLevel = useCallback((sec) => {
    const clamped = Math.max(0, Math.min(sec, 5));
    setCrossfadeDuration(clamped);
    saveCrossfade(clamped);
  }, []);

  const applyEqPreset = useCallback((presetKey) => {
    const preset = EQUALIZER_PRESETS[presetKey] || EQUALIZER_PRESETS.flat;
    const newSettings = {
      preset: presetKey,
      gains: { low: preset.low, mid: preset.mid, high: preset.high },
    };
    setEqSettings(newSettings);
    saveEqSettings(newSettings);
    setEqualizerGains(newSettings.gains);
  }, []);

  const setCustomEqGain = useCallback((band, value) => {
    setEqSettings((prev) => {
      const newGains = { ...prev.gains, [band]: value };
      const newSettings = { preset: 'custom', gains: newGains };
      saveEqSettings(newSettings);
      setEqualizerGains(newGains);
      return newSettings;
    });
  }, []);

  return {
    playbackSpeed,
    crossfadeDuration,
    eqSettings,
    setPlaybackSpeedLevel,
    setCrossfadeDurationLevel,
    applyEqPreset,
    setCustomEqGain,
  };
}
