import { useEffect } from 'react';
import { useAudio } from './useAudio';

/**
 * Global Keyboard shortcuts listener for Spotify player.
 * Space: Play/Pause
 * ArrowRight: Seek +5s
 * ArrowLeft: Seek -5s
 * M: Toggle Mute
 */
export function useKeyboardShortcuts() {
  const { currentTrack, currentTime, togglePlay, seek, toggleMute } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // DO NOT trigger shortcuts when typing in inputs/textareas
      if (isTyping) return;

      // DO NOT trigger audio actions if no track is loaded
      if (!currentTrack) {
        if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
          return;
        }
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;

        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;

        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 5));
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTrack, currentTime, togglePlay, seek, toggleMute]);
}
