import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `spotify_liked_tracks_${user._id || user.id}` : null;

  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    if (!storageKey) return [];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever user logs in or out, synchronize likedTrackIds with that user's storage
  useEffect(() => {
    if (!user) {
      setLikedTrackIds([]);
      return;
    }
    try {
      const key = `spotify_liked_tracks_${user._id || user.id}`;
      const saved = localStorage.getItem(key);
      setLikedTrackIds(saved ? JSON.parse(saved) : []);
    } catch {
      setLikedTrackIds([]);
    }
  }, [user]);

  // Persist likedTrackIds when user is authenticated
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(likedTrackIds));
    } catch (err) {
      console.warn('Failed to persist liked tracks:', err);
    }
  }, [likedTrackIds, storageKey]);

  const isLiked = useCallback(
    (trackId) => {
      if (!user || !trackId) return false;
      return likedTrackIds.includes(trackId);
    },
    [user, likedTrackIds]
  );

  const toggleLike = useCallback(
    async (track) => {
      if (!user) {
        toast.info('Please log in first to save songs to your library', { duration: 3000 });
        return;
      }
      if (!track) return;
      const trackId = track._id || track.id;
      if (!trackId) return;

      const wasLiked = likedTrackIds.includes(trackId);
      const nextLikedIds = wasLiked
        ? likedTrackIds.filter((id) => id !== trackId)
        : [...likedTrackIds, trackId];

      // 1. Optimistic UI update instantly
      setLikedTrackIds(nextLikedIds);
      if (!wasLiked) {
        toast.success(`Saved to Liked Songs`, { duration: 1800 });
      } else {
        toast.info(`Removed from Liked Songs`, { duration: 1800 });
      }

      // 2. Synchronize with backend API
      try {
        await api.post(`/music/like/${trackId}`);
      } catch (err) {
        if (err.response?.status !== 404) {
          setLikedTrackIds(likedTrackIds);
          toast.error('Failed to update favorites. Rolled back.');
        }
      }
    },
    [user, likedTrackIds]
  );

  const value = {
    likedTrackIds: user ? likedTrackIds : [],
    isLiked,
    toggleLike,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
