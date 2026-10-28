import { useState, useEffect } from 'react';

const FALLBACK_RGB = [30, 30, 30];
const colorCache = new Map();

/**
 * Extracts the dominant RGB color from an image URL using an offscreen canvas.
 * Guaranteed safe against CORS security errors and unhandled network failures.
 * @param {string|null} imageUrl
 * @returns {{ rgb: number[], rgbString: string }}
 */
export function useExtractColor(imageUrl) {
  const [rgb, setRgb] = useState(FALLBACK_RGB);

  useEffect(() => {
    if (!imageUrl) {
      setRgb(FALLBACK_RGB);
      return;
    }

    if (colorCache.has(imageUrl)) {
      setRgb(colorCache.get(imageUrl));
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (isMounted) setRgb(FALLBACK_RGB);
          return;
        }

        // Downscale to 10x10 for performance and noise reduction
        canvas.width = 10;
        canvas.height = 10;
        ctx.drawImage(img, 0, 0, 10, 10);

        const imgData = ctx.getImageData(0, 0, 10, 10).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          // Filter out near-black or transparent pixels
          if (imgData[i + 3] > 128 && (imgData[i] > 20 || imgData[i + 1] > 20 || imgData[i + 2] > 20)) {
            r += imgData[i];
            g += imgData[i + 1];
            b += imgData[i + 2];
            count++;
          }
        }

        const dominant = count > 0
          ? [Math.round(r / count), Math.round(g / count), Math.round(b / count)]
          : FALLBACK_RGB;

        colorCache.set(imageUrl, dominant);
        if (isMounted) setRgb(dominant);
      } catch (err) {
        // Fallback gracefully on CORS SecurityError
        if (isMounted) setRgb(FALLBACK_RGB);
      }
    };

    img.onerror = () => {
      if (isMounted) setRgb(FALLBACK_RGB);
    };

    img.src = imageUrl;

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return {
    rgb,
    rgbString: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
    rgbaHeaderString: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.55)`,
  };
}
