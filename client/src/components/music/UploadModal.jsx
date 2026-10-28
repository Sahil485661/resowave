import React, { useState } from 'react';
import { X, Loader2, Disc } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { AudioDropzone } from './AudioDropzone';
import { uploadMusic } from '@/api/music.api';

export function UploadModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleReset = () => {
    setTitle('');
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (isUploading) return;
    handleReset();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a track title');
      return;
    }
    if (!file) {
      toast.error('Please select an audio file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await uploadMusic({
        title: title.trim(),
        file,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      toast.success(response.message || 'Track uploaded successfully!');
      handleReset();
      onSuccess?.(response.music);
      onClose?.();
    } catch (error) {
      const errorMsg = error.userMessage || error.response?.data?.message || 'Failed to upload music track';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl border border-white/10 bg-spotify-surface p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Disc className="h-6 w-6 text-spotify-green animate-spin-slow" />
            <h2 className="text-lg font-bold text-white">Upload Artist Track</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="rounded p-1 text-spotify-subtext hover:text-white disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-spotify-subtext">
              Track Title
            </label>
            <Input
              placeholder="e.g. Blinding Lights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-spotify-subtext">
              Audio File
            </label>
            <AudioDropzone
              selectedFile={file}
              onSelectFile={setFile}
              onClear={() => setFile(null)}
              disabled={isUploading}
            />
          </div>

          {/* Real-time upload progress bar */}
          {isUploading && (
            <div className="space-y-2 rounded-lg bg-spotify-highlight/40 p-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-spotify-subtext">Uploading to Cloud...</span>
                <span className="text-spotify-green">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-semibold text-spotify-subtext hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title || !file}
              className="flex items-center gap-2 rounded-full bg-spotify-green px-6 py-2.5 text-sm font-bold text-black hover:bg-spotify-green-hover hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isUploading ? 'Uploading...' : 'Publish Track'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
