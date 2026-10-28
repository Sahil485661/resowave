import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink, Copy, Music, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAudio } from '@/hooks/useAudio';
import { fetchAllMusic, deleteMusic } from '@/api/music.api';
import { AlertDialog } from '@/components/ui/AlertDialog';

export function ArtistStudio({ onUploadClick }) {
  const { user } = useAuth();
  const { currentTrack, stop } = useAudio();
  const [myTracks, setMyTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadArtistTracks() {
      try {
        setIsLoading(true);
        const data = await fetchAllMusic();
        if (mounted && Array.isArray(data)) {
          const filtered = data.filter((t) => {
            const artistId = t.artist?._id || t.artist;
            const artistName = t.artist?.userName || t.artist?.name;
            return (
              (user?.id && artistId === user.id) ||
              (user?._id && artistId === user._id) ||
              (user?.userName && artistName === user.userName)
            );
          });
          setMyTracks(filtered);
        }
      } catch (err) {
        toast.error('Failed to load artist catalog');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadArtistTracks();
    return () => { mounted = false; };
  }, [user]);

  const handleCopyUrl = (track) => {
    navigator.clipboard.writeText(track.musicUrl);
    setCopiedId(track._id);
    toast.success('Audio stream URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteMusic(deleteTarget._id);

      // If active track is the one deleted, stop playback and clean state
      const isCurrentlyPlaying =
        (currentTrack?._id && currentTrack._id === deleteTarget._id) ||
        (currentTrack?.id && currentTrack.id === deleteTarget._id);

      if (isCurrentlyPlaying) {
        stop();
      }

      // Update state without full page refresh
      setMyTracks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      toast.success('Track removed permanently from database and storage');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.userMessage || 'Failed to delete track');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Artist Studio</h1>
          <p className="mt-1 text-xs text-spotify-subtext">Manage and monitor your uploaded catalog</p>
        </div>
        <button
          type="button"
          onClick={onUploadClick}
          className="flex items-center gap-2 rounded-full bg-spotify-green px-5 py-2 text-xs font-bold text-black hover:bg-spotify-green-hover hover:scale-105 transition-all shadow"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Track</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-spotify-subtext">Loading catalog...</div>
      ) : myTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-spotify-surface/40 py-20 text-center">
          <Music className="h-12 w-12 text-spotify-muted" />
          <h3 className="mt-4 text-base font-bold text-white">No tracks published yet</h3>
          <p className="mt-1 text-xs text-spotify-subtext">Upload your original master audio files to reach listeners.</p>
        </div>
      ) : (
        <div className="rounded-lg bg-spotify-surface/20 border border-white/5 overflow-hidden">
          <div className="divide-y divide-white/5">
            {myTracks.map((track) => (
              <div key={track._id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="h-12 w-12 rounded bg-spotify-highlight flex items-center justify-center flex-shrink-0 text-spotify-muted">
                    <Music className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-white">{track.musicName || track.title}</h4>
                    <div className="mt-1 flex items-center gap-2">
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={track.musicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-2 text-spotify-subtext hover:text-white hover:bg-white/10"
                    title="Open stream URL in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(track)}
                    className="rounded p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    title="Delete track"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Track Permanently?"
        description={`Are you sure you want to delete "${deleteTarget?.musicName || deleteTarget?.title}"? This action removes it permanently from ImageKit and the database.`}
        confirmText="Delete permanently"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
