import React from 'react';
import { User, Upload, LogOut } from 'lucide-react';

export function Header({
  user = null,
  onUploadClick,
  onLoginClick,
  onLogout,
  onProfileClick,
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between px-6 bg-spotify-base/70 backdrop-blur-md transition-colors duration-200">
      {/* Left spacing without accessibility navigation buttons */}
      <div className="flex items-center" />

      {/* Right side controls: Role Actions & User Profile */}
      <div className="flex items-center gap-3">
        {user?.role === 'artist' && (
          <button
            type="button"
            onClick={onUploadClick}
            className="flex items-center gap-2 rounded-full bg-spotify-surface px-4 py-2 text-xs font-bold text-white hover:bg-spotify-highlight hover:scale-105 transition-all shadow-sm"
          >
            <Upload className="h-4 w-4 text-spotify-green" />
            <span>Upload Track</span>
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onProfileClick}
              className="flex items-center gap-2 rounded-full bg-black/60 p-1 pr-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              title="View profile & settings"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-spotify-surface text-spotify-subtext overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="text-xs font-semibold text-white">{user.name || user.userName}</span>
              <span className="rounded bg-spotify-green/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-spotify-green tracking-wider">
                {user.role}
              </span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-spotify-subtext hover:text-white hover:bg-spotify-highlight transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onLoginClick?.('register')}
              className="text-sm font-bold text-spotify-subtext hover:text-white transition-colors cursor-pointer"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => onLoginClick?.('login')}
              className="rounded-full bg-white px-7 py-2.5 text-sm font-bold text-black hover:scale-105 hover:bg-white/90 transition-all shadow cursor-pointer"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
