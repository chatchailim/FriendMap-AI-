import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { HeadPoint } from '../types/friendmap';

interface FaceThumbnailProps {
  photoUrl?: string;
  head?: HeadPoint;
  customPhotoUrl?: string;
  size?: number; // In px (default 36)
  fallbackText?: string;
  className?: string;
  ringColor?: string;
}

export const FaceThumbnail: React.FC<FaceThumbnailProps> = ({
  photoUrl,
  head,
  customPhotoUrl,
  size = 36,
  fallbackText = '',
  className = '',
  ringColor,
}) => {
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // If a custom portrait photo was uploaded for this person specifically
  if (customPhotoUrl && !hasError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={customPhotoUrl}
          alt={fallbackText}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Draw face crop onto canvas from main photo
  useEffect(() => {
    if (!photoUrl || !head || !canvasRef.current) return;

    let isMounted = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!isMounted) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);

      // Crop radius with safety padding
      const cropRadiusFactor = 1.35;
      const r = Math.max(0.02, (head.radius || 0.025) * cropRadiusFactor);
      
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      // Calculate pixel crop coordinates
      const cx = head.x * naturalW;
      const cy = head.y * naturalH;
      const cropDim = r * 2 * Math.min(naturalW, naturalH);

      const sx = Math.max(0, cx - cropDim / 2);
      const sy = Math.max(0, cy - cropDim / 2);
      const sw = Math.min(naturalW - sx, cropDim);
      const sh = Math.min(naturalH - sy, cropDim);

      // Clear & Draw
      ctx.clearRect(0, 0, size, size);
      
      // Circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
      ctx.restore();
    };

    img.onerror = () => {
      if (isMounted) setHasError(true);
    };

    img.src = photoUrl;

    return () => {
      isMounted = false;
    };
  }, [photoUrl, head?.x, head?.y, head?.radius, size]);

  // Fallback if no photo or error
  if (!photoUrl || !head || hasError) {
    const initial = fallbackText ? fallbackText.trim().slice(0, 1).toUpperCase() : '';
    return (
      <div
        className={`rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold shrink-0 select-none ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.4) }}
      >
        {initial || <User className="w-1/2 h-1/2 text-slate-500" />}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border border-slate-700/80 bg-slate-800 shadow-sm transition-transform hover:scale-110 ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: ringColor || undefined,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block w-full h-full object-cover"
      />
    </div>
  );
};
