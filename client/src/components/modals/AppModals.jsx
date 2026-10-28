import React from 'react';
import { UploadModal } from '@/components/music/UploadModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { CreatePlaylistModal } from '@/components/playlist/CreatePlaylistModal';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';

export function AppModals({
  isUploadOpen,
  onCloseUpload,
  onUploadSuccess,
  isAuthOpen,
  onCloseAuth,
  authInitialMode = 'login',
  isCreatePlaylistOpen,
  onCloseCreatePlaylist,
  onPlaylistCreated,
  addToPlaylistTrack,
  onCloseAddToPlaylist,
  onOpenCreatePlaylist,
}) {
  return (
    <>
      <UploadModal
        isOpen={isUploadOpen}
        onClose={onCloseUpload}
        onSuccess={onUploadSuccess}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={onCloseAuth}
        initialMode={authInitialMode}
      />
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={onCloseCreatePlaylist}
        onCreated={onPlaylistCreated}
      />
      <AddToPlaylistModal
        isOpen={Boolean(addToPlaylistTrack)}
        track={addToPlaylistTrack}
        onClose={onCloseAddToPlaylist}
        onCreateNew={onOpenCreatePlaylist}
      />
    </>
  );
}
