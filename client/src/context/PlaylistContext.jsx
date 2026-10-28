import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const PlaylistContext = createContext(null);
const STORAGE_KEY = 'spotify_user_playlists';

const DEFAULT_PLAYLISTS = [
  {
    id: 'pl-chill',
    name: 'Chill Vibes & Beats',
    description: 'Relaxing ambient and lo-fi melodies to ease your mind.',
    trackIds: ['seed-1', 'seed-3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pl-coding',
    name: 'Deep Focus Coding',
    description: 'Zero distractions, pure flow state tracks.',
    trackIds: ['seed-2'],
    createdAt: new Date().toISOString(),
  },
];

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PLAYLISTS;
    } catch {
      return DEFAULT_PLAYLISTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (err) {
      console.warn('Failed to persist playlists:', err);
    }
  }, [playlists]);

  const createPlaylist = useCallback(({ name, description = '' }) => {
    if (!name?.trim()) return null;
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      trackIds: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    toast.success(`Created playlist "${newPlaylist.name}"`);
    return newPlaylist;
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    toast.success('Playlist deleted');
  }, []);

  const addTrackToPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        if (p.trackIds.includes(trackId)) {
          toast.info(`Track is already in "${p.name}"`);
          return p;
        }
        toast.success(`Added to "${p.name}"`);
        return { ...p, trackIds: [...p.trackIds, trackId] };
      })
    );
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        toast.info(`Removed track from "${p.name}"`);
        return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
      })
    );
  }, []);

  const getPlaylist = useCallback(
    (playlistId) => playlists.find((p) => p.id === playlistId),
    [playlists]
  );

  const value = {
    playlists,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    getPlaylist,
  };

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}
