import React, { useState, lazy, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { PlayerBar } from '../player/PlayerBar';
import { QueueDrawer } from '../player/QueueDrawer';
import { EqualizerModal } from '../player/EqualizerModal';
import { ShareModal } from '../music/ShareModal';
import { MobileNav } from './MobileNav';
import { MobileMiniPlayer } from '../player/MobileMiniPlayer';
import { MobilePlayerSheet } from '../player/MobilePlayerSheet';

const LyricsView = lazy(() =>
  import('../player/LyricsView').then((m) => ({ default: m.LyricsView }))
);

export function AppLayout({
  children,
  currentTab = 'home',
  onSelectTab,
  user = null,
  onUploadClick,
  onLoginClick,
  onLogout,
  onCreatePlaylistClick,
}) {
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [shareModalTrack, setShareModalTrack] = useState(null);
  const [isMobilePlayerOpen, setIsMobilePlayerOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-black font-sans text-white select-none">
      {/* Top Application Area: Sidebar + Scrollable Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          user={user}
          onCreatePlaylistClick={onCreatePlaylistClick}
          onLoginClick={onLoginClick}
        />
        <MainContent
          user={user}
          onUploadClick={onUploadClick}
          onLoginClick={onLoginClick}
          onLogout={onLogout}
          onProfileClick={() => onSelectTab?.('profile')}
        >
          {children}
        </MainContent>
      </div>

      {/* Persistent Desktop PlayerBar */}
      <PlayerBar
        isQueueOpen={isQueueOpen}
        onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
        isLyricsOpen={isLyricsOpen}
        onToggleLyrics={() => setIsLyricsOpen((prev) => !prev)}
        isEqualizerOpen={isEqualizerOpen}
        onToggleEqualizer={() => setIsEqualizerOpen((prev) => !prev)}
        onShareClick={(track) => setShareModalTrack(track)}
      />

      {/* Up Next Slide-over Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* Equalizer & Audio Settings Modal */}
      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
      />

      {/* Share Track Modal */}
      <ShareModal
        isOpen={Boolean(shareModalTrack)}
        track={shareModalTrack}
        onClose={() => setShareModalTrack(null)}
      />

      {/* Real-time Synced Lyrics Overlay View (Lazy Loaded) */}
      {isLyricsOpen && (
        <Suspense fallback={null}>
          <LyricsView
            isOpen={isLyricsOpen}
            onClose={() => setIsLyricsOpen(false)}
          />
        </Suspense>
      )}

      {/* Mobile Mini-Player above bottom nav */}
      {!isMobilePlayerOpen && (
        <MobileMiniPlayer onExpand={() => setIsMobilePlayerOpen(true)} />
      )}

      {/* Mobile Full-Screen Expandable Sheet */}
      <MobilePlayerSheet
        isOpen={isMobilePlayerOpen}
        onClose={() => setIsMobilePlayerOpen(false)}
        onOpenLyrics={() => setIsLyricsOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar (< 768px) - hidden when full player sheet is open */}
      {!isMobilePlayerOpen && (
        <MobileNav
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          user={user}
        />
      )}
    </div>
  );
}
