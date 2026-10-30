import React, { useEffect, useRef, useState } from 'react';

interface CloudCursorProps {
  isHoveringIsland?: boolean;
  enabled?: boolean;
}

interface MistParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  decay: number;
  color: string;
}

export const CloudCursor: React.FC<CloudCursorProps> = ({
  isHoveringIsland = false,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorAuraRef = useRef<HTMLDivElement | null>(null);

  // Mouse coordinates and smoothed positions
  const mousePos = useRef({ x: -100, y: -100 });
  const auraPos = useRef({ x: -100, y: -100 });
  const isMoving = useRef(false);
  const lastMoveTime = useRef(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClickSparking, setIsClickSparking] = useState(false);

  // Particle pools
  const mistPool = useRef<MistParticle[]>([]);
  const sparkPool = useRef<SparkParticle[]>([]);

  useEffect(() => {
    // Detect touch / mobile devices - disable custom cursor on touch
    if (typeof window !== 'undefined') {
      const touchCheck =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(touchCheck);
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice || !enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      isMoving.current = true;
      lastMoveTime.current = performance.now();

      // Emit subtle soft grey / cloud white mist particles while moving
      if (Math.random() < 0.22) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 0.4;
        const colors = ['#cbd5e1', '#f8fafc', '#e2e8f0', '#7dd3fc'];
        mistPool.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.08,
          radius: 4 + Math.random() * 6,
          alpha: 0.16,
          maxAlpha: 0.16,
          decay: 0.015 + Math.random() * 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });

        // Cap pool size for consistent 60fps performance
        if (mistPool.current.length > 25) {
          mistPool.current.shift();
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClickSparking(true);
      setTimeout(() => setIsClickSparking(false), 300);

      // Spawn subtle electric energy micro-sparks
      const sparkCount = isHoveringIsland ? 5 : 3;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 1.0 + Math.random() * 1.5;
        sparkPool.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: 3 + Math.random() * 4,
          alpha: 0.75,
          decay: 0.05 + Math.random() * 0.03,
          color: Math.random() > 0.4 ? '#38bdf8' : '#f8fafc',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });

    let animationFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Smooth lag interpolation for the aura glow
      auraPos.current.x += (mx - auraPos.current.x) * 0.18;
      auraPos.current.y += (my - auraPos.current.y) * 0.18;

      // Direct DOM transform for zero-latency dot & smoothed aura
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0)`;
      }

      // Check if mouse stopped moving (fade trailing effect smoothly)
      if (performance.now() - lastMoveTime.current > 120) {
        isMoving.current = false;
      }

      // 1. Draw subtle ambient cursor mist halo (compact & reduced glow)
      if (mx > 0 && my > 0) {
        const haloRadius = isHoveringIsland ? 24 : 16;
        const grad = ctx.createRadialGradient(
          auraPos.current.x,
          auraPos.current.y,
          0,
          auraPos.current.x,
          auraPos.current.y,
          haloRadius
        );
        grad.addColorStop(0, isHoveringIsland ? 'rgba(125, 211, 252, 0.08)' : 'rgba(203, 213, 225, 0.05)');
        grad.addColorStop(0.6, isHoveringIsland ? 'rgba(56, 189, 248, 0.02)' : 'rgba(148, 163, 184, 0.015)');
        grad.addColorStop(1, 'rgba(148, 163, 184, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(auraPos.current.x, auraPos.current.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw & update soft trailing mist particles
      for (let i = mistPool.current.length - 1; i >= 0; i--) {
        const p = mistPool.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.25;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          mistPool.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        pGrad.addColorStop(0, p.color);
        pGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw & update interactive micro-spark particles
      for (let i = sparkPool.current.length - 1; i >= 0; i--) {
        const s = sparkPool.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparkPool.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice, enabled, isHoveringIsland]);

  if (isTouchDevice || !enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* 2D Canvas for High-Performance Mist Trail & Energy Micro-Sparks */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Trailing Soft Atmospheric Cloud Aura (Lagged, compact) */}
      <div
        ref={cursorAuraRef}
        className="pointer-events-none absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full transition-transform duration-75 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`w-full h-full rounded-full blur-[2px] transition-all duration-300 ${
            isHoveringIsland
              ? 'bg-sky-400/15 ring-1 ring-sky-300/25 scale-110'
              : 'bg-slate-300/10 ring-1 ring-slate-200/15 scale-90'
          }`}
        />
      </div>

      {/* Main Cloud Cursor Icon (Compact Miniature Cloud) */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none absolute -top-2.5 -left-2.5 w-5 h-5 will-change-transform flex items-center justify-center"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* Animated Miniature Cloud Icon (Reduced size & subtle glow) */}
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-all duration-200 ${
            isHoveringIsland
              ? 'scale-110 filter drop-shadow-[0_0_4px_rgba(56,189,248,0.6)]'
              : 'scale-100 filter drop-shadow-[0_1px_2px_rgba(148,163,184,0.35)]'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cloud Body Path with Crisp Solid Fill and Sky Rim */}
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill={isHoveringIsland ? '#e0f2fe' : '#ffffff'}
            stroke={isHoveringIsland ? '#0284c7' : '#94a3b8'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Interactive Click Ripple Ring */}
        {isClickSparking && (
          <div className="absolute w-6 h-6 rounded-full border border-sky-400 animate-ping opacity-75" />
        )}
      </div>
    </div>
  );
};
