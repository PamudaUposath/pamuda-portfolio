import React, { useRef, useEffect } from 'react';
import {
  Users,
  GitBranch,
  GraduationCap,
  Layers,
  BookOpen,
  Mail,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import type { IslandId } from '../../types';
import { navigationConfig } from '../../data/navigationConfig';
import { orbitStore } from '../../hooks/useOrbitState';

interface CloudBottomDockProps {
  activeIsland: IslandId | null;
  onSelectIsland: (id: IslandId) => void;
}

export const CloudBottomDock: React.FC<CloudBottomDockProps> = ({
  activeIsland,
  onSelectIsland,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active item into view when selected on smaller screens
  useEffect(() => {
    if (!activeIsland || !scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector(`[data-nav-id="${activeIsland}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIsland]);

  const getBottomIcon = (id: IslandId) => {
    switch (id) {
      case 'leadership':
        return <Users className="w-3.5 h-3.5 text-yellow-400" />;
      case 'opensource':
        return <GitBranch className="w-3.5 h-3.5 text-teal-400" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
      case 'certifications':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'publications':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
      case 'contact':
        return <Mail className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return null;
    }
  };

  return (
    <nav
      aria-label="Secondary Island Navigation Dock"
      className="hidden md:flex fixed bottom-4 inset-x-0 z-40 justify-center px-4 pointer-events-none select-none"
    >
      <div
        ref={scrollRef}
        className="pointer-events-auto max-w-[calc(100vw-4rem)] sm:max-w-max glass-panel bg-slate-950/85 backdrop-blur-xl border border-sky-400/25 shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_20px_rgba(56,189,248,0.12)] rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none transition-all duration-300"
      >
        {/* Rotate Islands Left (Anticlockwise) Button */}
        <button
          onClick={() => orbitStore.rotateDelta(-0.28)}
          className="p-1.5 rounded-xl text-slate-300 hover:text-sky-300 hover:bg-slate-800/80 transition-all shrink-0 hover:scale-105 active:scale-95 border border-transparent hover:border-sky-400/30"
          title="Orbit Islands Left (or use Mouse Wheel)"
          aria-label="Orbit Islands Left"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-white/10 shrink-0 mx-0.5" />

        {navigationConfig.bottom.map((item) => {
          const isActive = activeIsland === item.id;
          return (
            <button
              key={item.id}
              data-nav-id={item.id}
              onClick={() => onSelectIsland(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 group ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-500/30 border border-sky-300/40 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 hover:-translate-y-0.5'
              }`}
              title={`${item.destination}`}
            >
              <span className="group-hover:scale-110 transition-transform">
                {getBottomIcon(item.id)}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="w-px h-4 bg-white/10 shrink-0 mx-0.5" />

        {/* Rotate Islands Right (Clockwise) Button */}
        <button
          onClick={() => orbitStore.rotateDelta(0.28)}
          className="p-1.5 rounded-xl text-slate-300 hover:text-sky-300 hover:bg-slate-800/80 transition-all shrink-0 hover:scale-105 active:scale-95 border border-transparent hover:border-sky-400/30"
          title="Orbit Islands Right (or use Mouse Wheel)"
          aria-label="Orbit Islands Right"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};
