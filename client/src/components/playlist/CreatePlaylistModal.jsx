import React, { useState } from 'react';
import { X, ListMusic } from 'lucide-react';
import { usePlaylists } from '@/hooks/usePlaylists';
import { Input } from '@/components/ui/Input';

export function CreatePlaylistModal({ isOpen, onClose, onCreated }) {
  const { createPlaylist } = usePlaylists();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const pl = createPlaylist({ name, description });
    setName('');
    setDescription('');
    onCreated?.(pl);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-spotify-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-spotify-green" />
            <h3 className="text-base font-bold text-white">Create New Playlist</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-spotify-subtext hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-spotify-subtext">Name</label>
            <Input
              placeholder="My Playlist #1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-spotify-subtext">Description (Optional)</label>
            <textarea
              placeholder="Give your playlist a catchy description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 flex w-full rounded-md border border-white/10 bg-spotify-highlight/60 px-3 py-2 text-sm text-white placeholder:text-spotify-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-spotify-green h-20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-spotify-subtext hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-full bg-spotify-green px-6 py-2 text-xs font-bold text-black hover:bg-spotify-green-hover disabled:opacity-50 transition-all shadow"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
