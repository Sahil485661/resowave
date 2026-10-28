import React, { useState, useRef, useMemo } from 'react';
import { X, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAudio } from '@/hooks/useAudio';
import { formatTime } from '@/lib/formatTime';

export function ShareModal({ isOpen, onClose, track }) {
  const { currentTime, currentTrack } = useAudio();
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const isCurrentPlaying = currentTrack && (currentTrack._id || currentTrack.id) === (track?._id || track?.id);
  const activeSecond = Math.floor(isCurrentPlaying ? currentTime : 0);

  const shareUrl = useMemo(() => {
    if (!track) return '';
    const trackId = track._id || track.id;
    const base = `${window.location.origin}/?track=${trackId}`;
    if (includeTimestamp && activeSecond > 0) {
      return `${base}&t=${activeSecond}`;
    }
    return base;
  }, [track, includeTimestamp, activeSecond]);

  if (!isOpen || !track) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Manual fallback selection if clipboard permission denied
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Listen to "${track.title}" by ${track.artist} on Resowave`,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md rounded-2xl bg-spotify-surface border border-white/10 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-spotify-green" />
            <h2 className="text-base font-bold text-white">Share Track</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-spotify-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Track Preview Capsule */}
        <div className="flex items-center gap-3 rounded-xl bg-black/40 p-3 border border-white/5">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-white">{track.title}</h3>
            <p className="truncate text-xs text-spotify-subtext">{track.artist}</p>
          </div>
        </div>

        {/* Timestamp Toggle */}
        {activeSecond > 0 && (
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="h-4 w-4 rounded accent-spotify-green cursor-pointer"
            />
            <span className="text-xs text-white/90">
              Start at current timestamp (
              <span className="font-mono text-spotify-green font-bold">
                {formatTime(activeSecond)}
              </span>
              )
            </span>
          </label>
        )}

        {/* Share Link Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-spotify-green select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-spotify-green" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-spotify-green py-2.5 text-xs font-bold text-black hover:scale-105 active:scale-95 transition-transform shadow-lg"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Share via Device</span>
        </button>
      </div>
    </div>
  );
}
