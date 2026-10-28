import React from 'react';
import { useAudio } from '@/hooks/useAudio';
import { useExtractColor } from '@/hooks/useExtractColor';
import { Header } from './Header';

export function MainContent({
  children,
  user,
  onUploadClick,
  onLoginClick,
  onLogout,
  onProfileClick,
}) {
  const { currentTrack } = useAudio();
  const { rgb } = useExtractColor(currentTrack?.coverUrl);

  const dynamicBackgroundStyle = {
    background: `linear-gradient(180deg, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6) 0%, #121212 100%)`,
    transition: 'background 0.5s ease-in-out',
  };

  return (
    <main className="relative flex flex-1 flex-col overflow-y-auto rounded-lg bg-spotify-base md:mr-2 md:my-2">
      {/* Dynamic Ambient Spotify Color Header */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={dynamicBackgroundStyle}
      />

      {/* Persistent Glassmorphism Header */}
      <Header
        user={user}
        onUploadClick={onUploadClick}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
      />

      {/* Scrollable View Content with safe mobile/desktop padding */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 pb-36 md:pb-28 pt-2">
        {children}
      </div>
    </main>
  );
}
