import React, { useState } from 'react';
import { User, LogOut, Edit3, Music, Play, Heart, ListMusic, Disc } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAudio } from '@/hooks/useAudio';
import { useFavorites } from '@/hooks/useFavorites';
import { usePlaylists } from '@/hooks/usePlaylists';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { cn } from '@/lib/utils';

export function Profile({ onLogoutRequest }) {
  const { user, setUser } = useAuth();
  const { recentlyPlayed, totalTracksPlayed, playTrack } = useAudio();
  const { likedTrackIds } = useFavorites();
  const { playlists } = usePlaylists();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleProfileSave = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    try {
      localStorage.setItem('spotify_user_session', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="-mx-6 -mt-2 space-y-8 pb-16 select-none">
      {/* Profile Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-gradient-to-b from-spotify-surface via-spotify-base to-black px-6 pb-6 pt-10">
        <div className="flex h-36 w-36 sm:h-44 sm:w-44 flex-shrink-0 items-center justify-center rounded-full bg-spotify-highlight overflow-hidden shadow-2xl border-4 border-white/5">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-20 w-20 text-spotify-muted" />
          )}
        </div>

        <div className="flex flex-col gap-2 text-center sm:text-left flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-spotify-green">Profile</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {user?.name || user?.userName || 'Resowave User'}
          </h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-spotify-subtext">
            <span>{user?.email || 'listener@resowave.local'}</span>
            <span>•</span>
            <span className="rounded bg-spotify-green/20 px-2 py-0.5 text-[10px] font-bold uppercase text-spotify-green tracking-wider">
              {user?.role || 'Listener'}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={onLogoutRequest}
              className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Analytics & Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-spotify-surface/40 p-5 border border-white/5 flex items-center gap-4">
            <div className="rounded-lg bg-spotify-green/20 p-3 text-spotify-green">
              <Disc className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tabular-nums">{totalTracksPlayed}</p>
              <p className="text-xs font-semibold text-spotify-subtext">Tracks Played</p>
            </div>
          </div>

          <div className="rounded-xl bg-spotify-surface/40 p-5 border border-white/5 flex items-center gap-4">
            <div className="rounded-lg bg-pink-500/20 p-3 text-pink-400">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tabular-nums">{likedTrackIds.length}</p>
              <p className="text-xs font-semibold text-spotify-subtext">Liked Songs</p>
            </div>
          </div>

          <div className="rounded-xl bg-spotify-surface/40 p-5 border border-white/5 flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/20 p-3 text-blue-400">
              <ListMusic className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tabular-nums">{playlists.length}</p>
              <p className="text-xs font-semibold text-spotify-subtext">Playlists Created</p>
            </div>
          </div>
        </div>

        {/* Recently Played List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Recently Played</h2>
          {recentlyPlayed.length === 0 ? (
            <p className="text-xs text-spotify-muted">No recently played tracks yet. Start listening!</p>
          ) : (
            <div className="rounded-lg bg-spotify-surface/20 divide-y divide-white/5">
              {recentlyPlayed.map((track, i) => (
                <div
                  key={`${track._id || track.id}-${i}`}
                  onClick={() => playTrack(track)}
                  className="group flex items-center justify-between px-4 py-2.5 rounded hover:bg-white/10 transition-colors cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <img src={track.coverUrl} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white group-hover:text-spotify-green transition-colors">
                        {track.title}
                      </p>
                      <p className="truncate text-xs text-spotify-subtext">{track.artist}</p>
                    </div>
                  </div>
                  <button type="button" className="text-spotify-subtext group-hover:text-white p-1">
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />
    </div>
  );
}
