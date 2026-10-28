import React, { useState } from 'react';
import { X, User, Camera } from 'lucide-react';
import { toast } from 'sonner';

export function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [displayName, setDisplayName] = useState(user?.name || user?.userName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    onSave({ name: displayName.trim(), avatarUrl: avatarUrl.trim() });
    toast.success('Profile updated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm rounded-2xl bg-spotify-surface border border-white/10 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h2 className="text-base font-bold text-white">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-spotify-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-spotify-highlight overflow-hidden border-2 border-white/10 shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-spotify-muted" />
                )}
              </div>
            </div>
            <p className="text-[11px] text-spotify-muted">Avatar URL preview</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-spotify-green"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/80">Avatar Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-spotify-green"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-1.5 text-xs font-bold text-white/80 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-spotify-green px-5 py-1.5 text-xs font-bold text-black hover:scale-105 active:scale-95 transition-transform"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
