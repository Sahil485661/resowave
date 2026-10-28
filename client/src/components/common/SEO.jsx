import React from 'react';
import { usePageSEO, DEFAULT_PAGE_TITLE, ROUTE_TITLES } from '@/hooks/usePageSEO';

/**
 * Lightweight, zero-dependency declarative SEO component for React SPA.
 * Manages document title and Open Graph description without external libraries.
 *
 * @example
 * <SEO currentTab={currentTab} currentTrack={currentTrack} isPlaying={isPlaying} />
 * or
 * <SEO title="Custom Page | ResoWave" description="Custom page description" />
 */
export function SEO({ currentTab = 'home', currentTrack = null, isPlaying = false, title = null, description = null }) {
  usePageSEO({
    currentTab,
    currentTrack,
    isPlaying,
    customTitle: title,
    description,
  });

  return null;
}

export { usePageSEO, DEFAULT_PAGE_TITLE, ROUTE_TITLES };
export default SEO;
