import React, { useState, useEffect } from 'react';
import { Play, Pause, Share2, ArrowLeft, Clock, Music } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { fetchAllMusic } from '@/api/music.api';
import { formatTime } from '@/lib/formatTime';
import { ShareModal } from '@/components/music/ShareModal';
import { cn } from '@/lib/utils';

export function TrackView({ trackId, initialTimestamp = 0, onBackToHome }) {
  const [track, setTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { currentTrack, isPlaying, playTrackAtTime, togglePlay } = useAudio();

  useEffect(() => {
    let mounted = true;
    async function loadTrack() {
      try {
        const tracks = await fetchAllMusic();
        if (mounted && Array.isArray(tracks)) {
          const match = tracks.find((t) => (t._id || t.id) === trackId);
          if (match) {
            const formatted = {
              _id: match._id || match.id,
              id: match._id || match.id,
              title: match.musicName || match.title || 'Untitled',
              artist: match.artist?.userName || match.artist?.name || 'Artist',
              musicUrl: match.musicUrl,
              coverUrl: match.coverUrl,
            };
            setTrack(formatted);

            // Auto-play at specified timestamp if coming from a deep link
            playTrackAtTime(formatted, initialTimestamp);
          }
        }
      } catch (err) {
        console.error('Failed to load track from deep-link:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadTrack();
    return () => { mounted = false; };
  }, [trackId, initialTimestamp]);

  const isCurrent = track && (currentTrack?._id || currentTrack?.id) === (track._id || track.id);
  const isPlayingCurrent = isCurrent && isPlaying;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-spotify-subtext">
        Loading track...
      </div>
    );
  }

  if (!track) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Track not found</h2>
        <button
          type="button"
          onClick={onBackToHome}
          className="rounded-full bg-white px-6 py-2 text-xs font-bold text-black hover:scale-105 transition-transform"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="-mx-6 -mt-2 space-y-8 pb-16 select-none">
      {/* Top Back Button */}
      <div className="px-6 pt-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-bold text-spotify-subtext hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </button>
      </div>

      {/* Main Track Hero Showcase */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 px-6 pb-6 pt-4">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="aspect-square w-56 sm:w-64 rounded-xl object-cover shadow-2xl"
        />
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-spotify-green">
            Track Deep-Link
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {track.title}
          </h1>
          <p className="text-base font-semibold text-spotify-subtext">{track.artist}</p>
          {initialTimestamp > 0 && (
            <div className="inline-flex items-center gap-1.5 self-center sm:self-start rounded-full bg-spotify-green/20 px-3 py-1 text-xs font-bold text-spotify-green">
              <Clock className="h-3.5 w-3.5" />
              <span>Playing from {formatTime(initialTimestamp)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 px-6">
        <button
          type="button"
          onClick={() => {
            if (isCurrent) togglePlay();
            else playTrackAtTime(track, initialTimestamp);
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-spotify-green text-black hover:scale-105 active:scale-95 transition-transform shadow-xl"
        >
          {isPlayingCurrent ? (
            <Pause className="h-6 w-6 fill-black" />
          ) : (
            <Play className="h-6 w-6 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          title="Share track"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        track={track}
      />
    </div>
  );
}
