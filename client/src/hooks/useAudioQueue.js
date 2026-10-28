import { useState, useRef, useEffect, useCallback } from 'react';

function shuffleTracks(tracks, activeIndex) {
  if (!tracks || tracks.length <= 1) return [...tracks];
  const active = tracks[activeIndex];
  const remaining = tracks.filter((_, i) => i !== activeIndex);
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  return [active, ...remaining];
}

export function useAudioQueue(onTrackChange) {
  const [playlist, setPlaylist] = useState([]);
  const [originalPlaylist, setOriginalPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  const onTrackChangeRef = useRef(onTrackChange);
  useEffect(() => {
    onTrackChangeRef.current = onTrackChange;
  }, [onTrackChange]);

  const stateRef = useRef({ playlist, originalPlaylist, currentIndex, isShuffle, repeatMode });
  useEffect(() => {
    stateRef.current = { playlist, originalPlaylist, currentIndex, isShuffle, repeatMode };
  }, [playlist, originalPlaylist, currentIndex, isShuffle, repeatMode]);

  const currentTrack = currentIndex >= 0 && playlist[currentIndex] ? playlist[currentIndex] : null;

  const updateCurrentIndex = useCallback((idx) => {
    stateRef.current.currentIndex = idx;
    setCurrentIndex(idx);
  }, []);

  const updatePlaylist = useCallback((updater) => {
    setPlaylist((prev) => {
      const nextList = typeof updater === 'function' ? updater(prev) : updater;
      stateRef.current.playlist = nextList;
      return nextList;
    });
  }, []);

  const playPlaylist = useCallback((tracks, startIndex = 0, seekTime = 0) => {
    if (!tracks || tracks.length === 0) return;
    const safeIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));

    stateRef.current.originalPlaylist = tracks;
    setOriginalPlaylist(tracks);

    if (stateRef.current.isShuffle) {
      const shuffled = shuffleTracks(tracks, safeIndex);
      stateRef.current.playlist = shuffled;
      stateRef.current.currentIndex = 0;
      setPlaylist(shuffled);
      setCurrentIndex(0);
      onTrackChangeRef.current?.(shuffled[0], seekTime);
    } else {
      stateRef.current.playlist = tracks;
      stateRef.current.currentIndex = safeIndex;
      setPlaylist(tracks);
      setCurrentIndex(safeIndex);
      onTrackChangeRef.current?.(tracks[safeIndex], seekTime);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    const { playlist: currentList, originalPlaylist: original, currentIndex: idx, isShuffle: active } = stateRef.current;
    if (original.length === 0) return;
    const playing = currentList[idx];

    if (!active) {
      const targetIdx = original.findIndex((t) => (t._id || t.id) === (playing?._id || playing?.id));
      const shuffled = shuffleTracks(original, targetIdx !== -1 ? targetIdx : 0);
      stateRef.current.playlist = shuffled;
      stateRef.current.currentIndex = 0;
      stateRef.current.isShuffle = true;
      setPlaylist(shuffled);
      setCurrentIndex(0);
      setIsShuffle(true);
    } else {
      const originalIdx = original.findIndex((t) => (t._id || t.id) === (playing?._id || playing?.id));
      const targetIdx = originalIdx !== -1 ? originalIdx : 0;
      stateRef.current.playlist = original;
      stateRef.current.currentIndex = targetIdx;
      stateRef.current.isShuffle = false;
      setPlaylist(original);
      setCurrentIndex(targetIdx);
      setIsShuffle(false);
    }
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      const next = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      stateRef.current.repeatMode = next;
      return next;
    });
  }, []);

  const getNextTrackIndex = useCallback((isManual = false) => {
    const { playlist: list, currentIndex: idx, repeatMode: repeat } = stateRef.current;
    if (list.length === 0) return { nextIndex: -1, shouldLoopCurrent: false };

    if (!isManual && repeat === 'one') {
      return { nextIndex: idx, shouldLoopCurrent: true };
    }

    if (isManual) {
      const next = (idx + 1) % list.length;
      return { nextIndex: next, shouldLoopCurrent: false };
    }

    let next = idx + 1;
    if (next >= list.length) {
      if (repeat === 'all') next = 0;
      else return { nextIndex: -1, shouldLoopCurrent: false };
    }
    return { nextIndex: next, shouldLoopCurrent: false };
  }, []);

  const getPreviousTrackIndex = useCallback(() => {
    const { playlist: list, currentIndex: idx } = stateRef.current;
    if (list.length === 0) return -1;
    if (list.length === 1) return 0;
    return idx > 0 ? idx - 1 : list.length - 1;
  }, []);

  return {
    playlist,
    currentIndex,
    currentTrack,
    isShuffle,
    repeatMode,
    setPlaylist: updatePlaylist,
    setCurrentIndex: updateCurrentIndex,
    playPlaylist,
    toggleShuffle,
    cycleRepeatMode,
    getNextTrackIndex,
    getPreviousTrackIndex,
  };
}
