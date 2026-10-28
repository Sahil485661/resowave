import React from 'react';
import { X, Disc3, Music2, Heart, Sparkles, ArrowRight } from 'lucide-react';

export function GuestWelcomeModal({ isOpen, onClose, onLogin, onRegister }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 select-none">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-spotify-surface via-spotify-base to-black p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button - Instagram / Facebook style dismiss */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-spotify-subtext hover:bg-white/15 hover:text-white transition-all active:scale-95"
          title="Continue as guest"
          aria-label="Close dialog and continue browsing as guest"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-xl">
            <img src="/favicon.png" alt="Resowave Logo" className="h-11 w-11 rounded-xl object-contain shadow-md" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Log in to Resowave
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-spotify-subtext max-w-sm">
            Listen to millions of songs, build your personal library, and experience real-time synced lyrics.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <Music2 className="h-5 w-5 text-spotify-green mb-1.5" />
            <span className="text-xs font-bold text-white">Free Streaming</span>
            <span className="text-[10px] text-spotify-subtext mt-0.5">Instant playback</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <Heart className="h-5 w-5 text-pink-400 mb-1.5" />
            <span className="text-xs font-bold text-white">Liked Songs</span>
            <span className="text-[10px] text-spotify-subtext mt-0.5">Save your favorites</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <Sparkles className="h-5 w-5 text-amber-400 mb-1.5" />
            <span className="text-xs font-bold text-white">Custom Playlists</span>
            <span className="text-[10px] text-spotify-subtext mt-0.5">Create & organize</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-spotify-green py-3 text-sm font-bold text-black hover:bg-spotify-green-hover hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-spotify-green/20 cursor-pointer"
          >
            <span>Log in to your account</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="flex w-full items-center justify-center rounded-full border border-white/20 bg-transparent py-3 text-sm font-bold text-white hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all cursor-pointer"
          >
            Sign up free
          </button>
        </div>

        {/* Guest Dismiss Option */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-spotify-subtext hover:text-white transition-colors underline underline-offset-4"
          >
            Not now, continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
}
