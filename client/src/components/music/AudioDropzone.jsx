import React, { useRef, useState } from 'react';
import { UploadCloud, Music, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = 'audio/mpeg, audio/wav, audio/ogg, audio/aac, audio/flac, .mp3, .wav, .ogg, .aac, .flac';

export function AudioDropzone({ selectedFile, onSelectFile, onClear, disabled = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('audio/') || /\.(mp3|wav|ogg|aac|flac)$/i.test(file.name))) {
      onSelectFile(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-spotify-green/40 bg-spotify-green/5 p-4 transition-colors">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-spotify-green/20 text-spotify-green">
            <Music className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{selectedFile.name}</p>
            <p className="text-xs text-spotify-subtext">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={onClear}
            className="rounded p-1 text-spotify-subtext hover:bg-white/10 hover:text-white"
            aria-label="Remove selected audio file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        'group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-spotify-highlight/30 px-6 py-8 text-center transition-all cursor-pointer',
        isDragOver ? 'border-spotify-green bg-spotify-green/10 scale-[1.01]' : 'hover:border-white/30 hover:bg-spotify-highlight/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify-highlight text-spotify-subtext group-hover:text-white group-hover:scale-110 transition-all">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-semibold text-white">Click or drag & drop audio track</p>
      <p className="mt-1 text-xs text-spotify-muted">MP3, WAV, OGG, AAC, or FLAC (Max 20MB)</p>
    </div>
  );
}
