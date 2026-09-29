import React, { useEffect, useRef } from 'react';

interface MiniWireframeGlobeProps {
  size?: number;
  className?: string;
}

export const MiniWireframeGlobe: React.FC<MiniWireframeGlobeProps> = ({
  size = 56,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const render = () => {
      rotation += 0.015;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.42;

      // Outer Glow Circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const rad = (lat * Math.PI) / 180;
        const latR = r * Math.cos(rad);
        const latY = cy + r * Math.sin(rad);

        ctx.beginPath();
        ctx.ellipse(cx, latY, latR, latR * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Longitude rotated lines
      for (let lon = 0; lon < 180; lon += 45) {
        const lonRad = ((lon + rotation * 50) * Math.PI) / 180;
        const scaleX = Math.cos(lonRad);

        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(r * scaleX), r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = scaleX > 0 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Equator highlight
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.25, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 50, 70, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`inline-block ${className}`}
    />
  );
};
