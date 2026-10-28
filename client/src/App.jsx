import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { PlaylistProvider } from '@/context/PlaylistContext';
import { AudioPlayerProvider, useAudio } from '@/context/AudioPlayerContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePageSEO } from '@/hooks/usePageSEO';
import { AppLayout } from '@/components/layout/AppLayout';
import { RouteLoadingSkeleton } from '@/components/layout/RouteLoadingSkeleton';
import { AppModals } from '@/components/modals/AppModals';
import { GuestWelcomeModal } from '@/components/auth/GuestWelcomeModal';
import { Home } from '@/pages/Home';

// Lazy-loaded routes for code-splitting
const Search = lazy(() => import('@/pages/Search').then((m) => ({ default: m.Search })));
const ArtistStudio = lazy(() => import('@/pages/ArtistStudio').then((m) => ({ default: m.ArtistStudio })));
const LikedSongs = lazy(() => import('@/pages/LikedSongs').then((m) => ({ default: m.LikedSongs })));
const PlaylistView = lazy(() => import('@/pages/PlaylistView').then((m) => ({ default: m.PlaylistView })));
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })));
const TrackView = lazy(() => import('@/pages/TrackView').then((m) => ({ default: m.TrackView })));

function ResowaveApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState(null);

  // Guest welcome popup state (dismissible like Instagram/Facebook)
  const [isGuestModalDismissed, setIsGuestModalDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      sessionStorage.getItem('resowave_guest_modal_dismissed') === 'true' ||
      sessionStorage.getItem('spotify_guest_modal_dismissed') === 'true'
    );
  });

  const { user, logout } = useAuth();
  const { stop, currentTrack, isPlaying } = useAudio();
  useKeyboardShortcuts();
  usePageSEO({ currentTab, currentTrack, isPlaying });

  const openAuth = (mode = 'login') => {
    const validMode = typeof mode === 'string' && mode.toLowerCase() === 'register' ? 'register' : 'login';
    setAuthInitialMode(validMode);
    setIsAuthOpen(true);
  };

  const handleDismissGuestModal = () => {
    try {
      sessionStorage.setItem('resowave_guest_modal_dismissed', 'true');
    } catch {}
    setIsGuestModalDismissed(true);
  };

  // Parse deep-link parameters (?track=id&t=seconds)
  const [deepLinkParams] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('track');
    if (trackId) {
      const t = parseInt(params.get('t') || '0', 10);
      return { trackId, timestamp: isNaN(t) ? 0 : t };
    }
    return null;
  });

  useEffect(() => {
    if (deepLinkParams) setCurrentTab(`track:${deepLinkParams.trackId}`);
  }, [deepLinkParams]);

  const newTrackHandlerRef = useRef(null);
  const isPlaylistTab = currentTab.startsWith('playlist:');
  const selectedPlaylistId = isPlaylistTab ? currentTab.replace('playlist:', '') : null;
  const isTrackTab = currentTab.startsWith('track:');
  const selectedTrackId = isTrackTab ? currentTab.replace('track:', '') : null;

  const handleLogout = async () => {
    stop();
    await logout();
    setCurrentTab('home');
  };

  return (
    <>
      <AppLayout
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onUploadClick={() => setIsUploadOpen(true)}
        onLoginClick={(mode = 'login') => openAuth(mode)}
        onLogout={handleLogout}
        onCreatePlaylistClick={() => {
          if (!user) openAuth('login');
          else setIsCreatePlaylistOpen(true);
        }}
      >
        <Suspense fallback={<RouteLoadingSkeleton />}>
          {currentTab === 'home' && (
            <Home
              onUploadRequest={() => setIsUploadOpen(true)}
              onNewTrackRef={newTrackHandlerRef}
              onAddToPlaylist={(t) => setAddToPlaylistTrack(t)}
            />
          )}
          {currentTab === 'search' && <Search />}
          {currentTab === 'studio' && <ArtistStudio onUploadClick={() => setIsUploadOpen(true)} />}
          {currentTab === 'liked' && (
            <LikedSongs onLoginClick={(mode = 'login') => openAuth(mode)} />
          )}
          {currentTab === 'profile' && <Profile onLogoutRequest={handleLogout} />}
          {isPlaylistTab && (
            <PlaylistView
              playlistId={selectedPlaylistId}
              onBackToHome={() => setCurrentTab('home')}
              onLoginClick={(mode = 'login') => openAuth(mode)}
            />
          )}
          {isTrackTab && (
            <TrackView
              trackId={selectedTrackId}
              initialTimestamp={deepLinkParams?.timestamp || 0}
              onBackToHome={() => setCurrentTab('home')}
            />
          )}
        </Suspense>

        <AppModals
          isUploadOpen={isUploadOpen}
          onCloseUpload={() => setIsUploadOpen(false)}
          onUploadSuccess={(newTrack) => newTrackHandlerRef.current?.(newTrack)}
          isAuthOpen={isAuthOpen}
          onCloseAuth={() => setIsAuthOpen(false)}
          authInitialMode={authInitialMode}
          isCreatePlaylistOpen={isCreatePlaylistOpen}
          onCloseCreatePlaylist={() => setIsCreatePlaylistOpen(false)}
          onPlaylistCreated={(pl) => setCurrentTab(`playlist:${pl.id}`)}
          addToPlaylistTrack={addToPlaylistTrack}
          onCloseAddToPlaylist={() => setAddToPlaylistTrack(null)}
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />
      </AppLayout>

      {/* Dismissible Centered Welcome/Login Modal for Unauthenticated Visitors */}
      {!user && !isGuestModalDismissed && (
        <GuestWelcomeModal
          isOpen={true}
          onClose={handleDismissGuestModal}
          onLogin={() => {
            handleDismissGuestModal();
            openAuth('login');
          }}
          onRegister={() => {
            handleDismissGuestModal();
            openAuth('register');
          }}
        />
      )}
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <PlaylistProvider>
          <AudioPlayerProvider>
            <Toaster richColors position="top-right" theme="dark" />
            <ResowaveApp />
          </AudioPlayerProvider>
        </PlaylistProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
