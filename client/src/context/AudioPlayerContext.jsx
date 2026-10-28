import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { formatTime } from '@/lib/formatTime';
import { initWebAudio, setEqualizerGains, executeCrossfade, cancelActiveCrossfade } from '@/lib/webAudioEngine';
import { getSavedVolume, saveVolume, getRecentlyPlayed, addRecentlyPlayed, getTotalTracksPlayed } from '@/lib/audioStorage';
import { useAudioEffects } from '@/hooks/useAudioEffects';
import { useAudioQueue } from '@/hooks/useAudioQueue';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof window !== 'undefined') {
    const a = new Audio();
    a.crossOrigin = 'anonymous';
    a.preload = 'metadata';
    audioRef.current = a;
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(() => getSavedVolume());
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => getRecentlyPlayed());
  const [totalTracksPlayed, setTotalTracksPlayed] = useState(() => getTotalTracksPlayed());

  const effects = useAudioEffects(audioRef);

  const safePlay = useCallback(() => {
    if (!audioRef.current) return;
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {}
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name !== 'AbortError') console.warn('Playback notice:', error);
        setIsPlaying(false);
        setIsBuffering(false);
      });
    }
  }, []);

  const loadAndPlayTrack = useCallback((track, seekTime = 0) => {
    const audio = audioRef.current;
    if (!audio || !track || !track.musicUrl) return;

    const oldSrc = audio.src;
    const oldTime = audio.currentTime;

    if (!audio.paused && oldSrc && effects.crossfadeDuration > 0 && seekTime === 0) {
      executeCrossfade({ outgoingUrl: oldSrc, outgoingTime: oldTime, duration: effects.crossfadeDuration });
    }

    setIsBuffering(true);
    audio.pause();
    audio.src = track.musicUrl;
    audio.playbackRate = effects.playbackSpeed || 1.0;
    audio.preservesPitch = true;

    if (seekTime > 0) {
      const onCanPlaySeek = () => {
        try {
          audio.currentTime = seekTime;
          setCurrentTime(seekTime);
        } catch {}
        audio.removeEventListener('canplay', onCanPlaySeek);
      };
      audio.addEventListener('canplay', onCanPlaySeek);
    }

    const updated = addRecentlyPlayed(track);
    setRecentlyPlayed(updated);
    setTotalTracksPlayed(getTotalTracksPlayed());

    safePlay();
  }, [effects.crossfadeDuration, effects.playbackSpeed, safePlay]);

  const queue = useAudioQueue(loadAndPlayTrack);

  // Initialize Web Audio and initial EQ
  useEffect(() => {
    if (audioRef.current) {
      initWebAudio(audioRef.current);
      setEqualizerGains(effects.eqSettings.gains);
    }
  }, []);

  const playNext = useCallback((isManual = true) => {
    const { nextIndex, shouldLoopCurrent } = queue.getNextTrackIndex(isManual);
    if (shouldLoopCurrent) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        safePlay();
      }
      return;
    }
    if (nextIndex === -1) {
      setIsPlaying(false);
      return;
    }
    const nextTrack = queue.playlist[nextIndex];
    if (nextTrack) {
      queue.setCurrentIndex(nextIndex);
      loadAndPlayTrack(nextTrack);
    }
  }, [queue, loadAndPlayTrack, safePlay]);

  const playPrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIndex = queue.getPreviousTrackIndex();
    if (prevIndex === -1) return;
    const prevTrack = queue.playlist[prevIndex];
    if (prevTrack) {
      queue.setCurrentIndex(prevIndex);
      loadAndPlayTrack(prevTrack);
    }
  }, [queue, loadAndPlayTrack]);

  const stop = useCallback(() => {
    cancelActiveCrossfade();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      audio.load();
    }
    queue.setCurrentIndex(-1);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [queue]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !queue.currentTrack) return;
    if (audio.paused) safePlay();
    else audio.pause();
  }, [queue.currentTrack, safePlay]);

  const seek = useCallback((seconds) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(seconds, duration || 0));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  }, [duration]);

  const setVolumeLevel = useCallback((val) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(val, 1));
    audioRef.current.volume = clamped;
    setVolume(clamped);
    saveVolume(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const playNextRef = useRef(playNext);
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Volume synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Offline / Online alerts
  useEffect(() => {
    const handleOffline = () => {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        toast.warning('No internet connection. Playback paused.', { duration: 4000 });
      }
    };
    const handleOnline = () => toast.success('Internet connection restored.', { duration: 2500 });

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [isPlaying]);

  // Native HTML5 listeners attached once on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsBuffering(false);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onCanPlay = () => setIsBuffering(false);
    const onEnded = () => playNextRef.current?.(false);
    const onError = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const value = {
    playlist: queue.playlist,
    currentIndex: queue.currentIndex,
    currentTrack: queue.currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    volume: isMuted ? 0 : volume,
    isMuted,
    isShuffle: queue.isShuffle,
    repeatMode: queue.repeatMode,
    playbackSpeed: effects.playbackSpeed,
    crossfadeDuration: effects.crossfadeDuration,
    eqSettings: effects.eqSettings,
    recentlyPlayed,
    totalTracksPlayed,
    playbackProgress: duration > 0 ? (currentTime / duration) * 100 : 0,
    audioElement: audioRef.current,
    playPlaylist: queue.playPlaylist,
    playTrack: (t) => queue.playPlaylist([t], 0),
    playTrackAtTime: (t, time) => queue.playPlaylist([t], 0, time),
    playNext: () => playNext(true),
    playPrevious,
    togglePlay,
    stop,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle: queue.toggleShuffle,
    cycleRepeatMode: queue.cycleRepeatMode,
    setPlaybackSpeed: effects.setPlaybackSpeedLevel,
    setCrossfadeDuration: effects.setCrossfadeDurationLevel,
    applyEqPreset: effects.applyEqPreset,
    setCustomEqGain: effects.setCustomEqGain,
    jumpToQueueIndex: (idx) => {
      queue.setCurrentIndex(idx);
      const target = queue.playlist[idx];
      if (target) loadAndPlayTrack(target);
    },
    removeFromQueue: (id) => queue.setPlaylist((prev) => prev.filter((t, i) => i <= queue.currentIndex || (t._id || t.id) !== id)),
    clearUpcomingQueue: () => queue.setPlaylist((prev) => prev.slice(0, queue.currentIndex + 1)),
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioPlayerContext);
  if (!context) throw new Error('useAudio must be used within an AudioPlayerProvider');
  return context;
}
