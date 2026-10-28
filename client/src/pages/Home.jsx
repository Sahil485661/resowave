import React, { useState, useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { fetchAllMusic } from '@/api/music.api';
import { TrackCard } from '@/components/music/TrackCard';
import { TrackCardSkeleton } from '@/components/music/TrackCardSkeleton';
import { Music2 } from 'lucide-react';

export function Home({ onUploadRequest, onNewTrackRef, onAddToPlaylist }) {
  const { currentTrack, isPlaying, playPlaylist, playTrack, togglePlay } = useAudio();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeTrack = (raw) => ({
    _id: raw._id || raw.id,
    id: raw._id || raw.id,
    musicName: raw.musicName || raw.title || 'Untitled Track',
    title: raw.musicName || raw.title || 'Untitled Track',
    artist: raw.artist?.name || raw.artist?.userName || (typeof raw.artist === 'string' ? raw.artist : 'Unknown Artist'),
    musicUrl: raw.musicUrl || raw.audioUrl,
    coverUrl: raw.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    duration: raw.duration || 0,
    fileId: raw.fileId,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadMusicFeed() {
      try {
        setIsLoading(true);
        const data = await fetchAllMusic();
        if (isMounted) {
          const rawList = Array.isArray(data) ? data : (data?.musics || []);
          setTracks(rawList.map(normalizeTrack));
        }
      } catch (err) {
        console.error('Failed to fetch real music feed:', err);
        if (isMounted) setTracks([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadMusicFeed();
    return () => { isMounted = false; };
  }, []);

  // Prepend newly uploaded tracks seamlessly
  useEffect(() => {
    if (onNewTrackRef) {
      onNewTrackRef.current = (rawNewTrack) => {
        const normalized = normalizeTrack(rawNewTrack);
        setTracks((prev) => [normalized, ...prev]);
      };
    }
  }, [onNewTrackRef]);

  const handleTrackClick = (track, index) => {
    const isCurrent = (currentTrack?._id && currentTrack._id === track._id) || (currentTrack?.id && currentTrack.id === track._id);
    if (isCurrent) {
      togglePlay();
    } else {
      playPlaylist(tracks, index);
    }
  };

  return (
    <div className="space-y-8 select-none">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Good evening</h1>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
            Recently Added & Popular
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TrackCardSkeleton key={i} />
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-spotify-surface/40 py-16 text-center border border-white/5">
            <Music2 className="h-12 w-12 text-spotify-muted" />
            <h3 className="mt-3 text-base font-bold text-white">No tracks available yet</h3>
            <p className="mt-1 text-xs text-spotify-subtext">Be the first artist to publish a track!</p>
            {onUploadRequest && (
              <button
                type="button"
                onClick={onUploadRequest}
                className="mt-4 rounded-full bg-spotify-green px-6 py-2 text-xs font-bold text-black hover:scale-105 transition-transform"
              >
                Upload Track
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tracks.map((track, index) => {
              const isActive = (currentTrack?._id && currentTrack._id === track._id) || (currentTrack?.id && currentTrack.id === track._id);
              return (
                <TrackCard
                  key={track._id || index}
                  track={track}
                  isActive={isActive}
                  isPlaying={isPlaying}
                  onPlayToggle={() => handleTrackClick(track, index)}
                  onMoreOptions={() => onAddToPlaylist?.(track)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
