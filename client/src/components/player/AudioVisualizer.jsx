import React, { useRef, useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { initWebAudio, getAnalyser } from '@/lib/webAudioEngine';

export function AudioVisualizer({ className = 'h-10 w-28' }) {
  const { audioElement, isPlaying } = useAudio();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (audioElement) {
      initWebAudio(audioElement);
    }
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 16;
    const dataArray = new Uint8Array(bufferLength);

    const renderBars = () => {
      animationFrameRef.current = requestAnimationFrame(renderBars);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      }

      const barCount = 16;
      const barWidth = Math.floor(width / barCount) - 2;
      let x = 1;

      for (let i = 0; i < barCount; i++) {
        // Sample frequency value or idle animation
        const rawValue = analyser && isPlaying ? dataArray[i * 2] : 4;
        const normalized = Math.max(4, Math.floor((rawValue / 255) * height));

        // Draw smooth rounded Spotify Green bars
        ctx.fillStyle = '#1DB954';
        ctx.beginPath();
        ctx.roundRect(x, height - normalized, barWidth, normalized, [2, 2, 0, 0]);
        ctx.fill();

        x += barWidth + 2;
      }
    };

    renderBars();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={112}
      height={40}
      className={className}
      title="Live audio frequency spectrum"
    />
  );
}
