/**
 * Audio Engine LocalStorage Persistence Utilities
 */

const KEYS = {
  VOLUME: 'spotify_persisted_volume',
  SPEED: 'spotify_playback_speed',
  CROSSFADE: 'spotify_crossfade_duration',
  EQ: 'spotify_equalizer_settings',
  RECENTLY_PLAYED: 'spotify_recently_played',
  STATS_PLAYED: 'spotify_total_tracks_played',
};

export function getSavedVolume(defaultVal = 0.7) {
  try {
    const saved = localStorage.getItem(KEYS.VOLUME);
    return saved !== null ? parseFloat(saved) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function saveVolume(val) {
  try {
    localStorage.setItem(KEYS.VOLUME, val.toString());
  } catch {}
}

export function getSavedSpeed(defaultVal = 1.0) {
  try {
    const saved = localStorage.getItem(KEYS.SPEED);
    return saved !== null ? parseFloat(saved) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function saveSpeed(val) {
  try {
    localStorage.setItem(KEYS.SPEED, val.toString());
  } catch {}
}

export function getSavedCrossfade(defaultVal = 2) {
  try {
    const saved = localStorage.getItem(KEYS.CROSSFADE);
    return saved !== null ? parseInt(saved, 10) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function saveCrossfade(val) {
  try {
    localStorage.setItem(KEYS.CROSSFADE, val.toString());
  } catch {}
}

export function getSavedEqSettings() {
  try {
    const saved = localStorage.getItem(KEYS.EQ);
    return saved ? JSON.parse(saved) : { preset: 'flat', gains: { low: 0, mid: 0, high: 0 } };
  } catch {
    return { preset: 'flat', gains: { low: 0, mid: 0, high: 0 } };
  }
}

export function saveEqSettings(settings) {
  try {
    localStorage.setItem(KEYS.EQ, JSON.stringify(settings));
  } catch {}
}

export function getRecentlyPlayed() {
  try {
    const saved = localStorage.getItem(KEYS.RECENTLY_PLAYED);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addRecentlyPlayed(track) {
  if (!track || (!track._id && !track.id)) return [];
  try {
    const id = track._id || track.id;
    const current = getRecentlyPlayed();
    const filtered = current.filter((t) => (t._id || t.id) !== id);
    const updated = [track, ...filtered].slice(0, 10);
    localStorage.setItem(KEYS.RECENTLY_PLAYED, JSON.stringify(updated));

    // Increment play count
    const total = getTotalTracksPlayed() + 1;
    localStorage.setItem(KEYS.STATS_PLAYED, total.toString());
    return updated;
  } catch {
    return [];
  }
}

export function getTotalTracksPlayed() {
  try {
    const count = localStorage.getItem(KEYS.STATS_PLAYED);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}
