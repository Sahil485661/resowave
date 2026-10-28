import { useEffect, useRef } from 'react';

export const DEFAULT_PAGE_TITLE = 'ResoWave | High-Fidelity Cloud Audio Streaming Platform';

export const ROUTE_TITLES = {
  home: 'ResoWave | Stream Your Favorite Tracks',
  search: 'Search Songs & Artists | ResoWave',
  liked: 'Your Liked Songs | ResoWave',
  studio: 'Artist Dashboard & Upload | ResoWave',
  profile: 'User Profile & Stats | ResoWave',
};

/**
 * Custom lightweight hook to manage document title & meta tags dynamically.
 * Updates document.title based on the active tab and now-playing audio state.
 * Reverts cleanly when playback stops or components unmount.
 *
 * @param {Object} options
 * @param {string} options.currentTab - Active route/tab key ('home', 'search', etc.)
 * @param {Object|null} options.currentTrack - Currently loaded audio track
 * @param {boolean} options.isPlaying - Whether audio is actively playing
 * @param {string} [options.customTitle] - Optional custom title override
 * @param {string} [options.description] - Optional meta description override
 */
export function usePageSEO({ currentTab = 'home', currentTrack = null, isPlaying = false, customTitle = null, description = null } = {}) {
  const previousTitleRef = useRef(document.title);

  useEffect(() => {
    // 1. Determine base route title
    let baseTitle = ROUTE_TITLES[currentTab];

    if (!baseTitle) {
      if (typeof currentTab === 'string') {
        if (currentTab.startsWith('playlist:')) {
          baseTitle = 'Playlist | ResoWave';
        } else if (currentTab.startsWith('track:')) {
          baseTitle = 'Track Details | ResoWave';
        }
      }
    }

    if (!baseTitle) {
      baseTitle = customTitle || DEFAULT_PAGE_TITLE;
    }

    // 2. Prepend playback title when actively playing
    let finalTitle = baseTitle;
    if (isPlaying && currentTrack) {
      const trackName = currentTrack.title || currentTrack.musicName || 'Playing';
      const artistName =
        typeof currentTrack.artist === 'string'
          ? currentTrack.artist
          : currentTrack.artistName || currentTrack.artist?.name || 'Artist';

      finalTitle = `▶ ${trackName} • ${artistName} | ResoWave`;
    }

    // 3. Update document title
    document.title = finalTitle;

    // 4. Update meta description if provided
    if (description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', description);
      }
      let ogDescTag = document.querySelector('meta[property="og:description"]');
      if (ogDescTag) {
        ogDescTag.setAttribute('content', description);
      }
    }

    // Cleanup on unmount or transition
    return () => {
      document.title = DEFAULT_PAGE_TITLE;
    };
  }, [currentTab, currentTrack, isPlaying, customTitle, description]);
}
