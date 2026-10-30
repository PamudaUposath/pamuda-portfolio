import React, { useState } from 'react';
import {
  Compass,
  X,
  Home,
  Zap,
  Cpu,
  Award,
  BookOpen,
  Globe2,
  PhoneCall,
  Gamepad2,
  FileText,
  Bookmark,
  Users,
} from 'lucide-react';
import type { IslandId } from '../../types';

interface CloudNavigationWheelProps {
  onSelectIsland: (id: IslandId) => void;
  onReturnOverview: () => void;
  onOpenSkillsConsole: () => void;
  onOpenGame: () => void;
  onOpenCV: () => void;
  onOpenJournal: () => void;
  activeIsland: IslandId | null;
  onOpenChange?: (open: boolean) => void;
}

export const CloudNavigationWheel: React.FC<CloudNavigationWheelProps> = ({
  onSelectIsland,
  onReturnOverview,
  onOpenSkillsConsole,
  onOpenGame,
  onOpenCV,
  onOpenJournal,
  activeIsland,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('wheel') === 'open';
  });

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) onOpenChange(open);
  };

  const wheelItems = [
    {
      id: 'overview',
      label: 'Sky Overview',
      icon: <Home className="w-4 h-4 text-sky-300" />,
      action: () => {
        onReturnOverview();
        setIsOpen(false);
      },
      color: 'hover:border-sky-400 hover:text-sky-300',
    },
    {
      id: 'projects',
      label: 'Projects Island',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => {
        onSelectIsland('projects');
        setIsOpen(false);
      },
      color: 'hover:border-amber-400 hover:text-amber-300',
    },
    {
      id: 'skills-console',
      label: 'Skills Console',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onOpenSkillsConsole();
        setIsOpen(false);
      },
      color: 'hover:border-cyan-400 hover:text-cyan-300',
    },
    {
      id: 'leadership',
      label: 'Leadership Island',
      icon: <Users className="w-4 h-4 text-yellow-400" />,
      action: () => {
        onSelectIsland('leadership');
        setIsOpen(false);
      },
      color: 'hover:border-yellow-400 hover:text-yellow-300',
    },
    {
      id: 'achievements',
      label: 'Achievements Island',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      action: () => {
        onSelectIsland('achievements');
        setIsOpen(false);
      },
      color: 'hover:border-amber-400 hover:text-amber-300',
    },
    {
      id: 'education',
      label: 'Education Island',
      icon: <BookOpen className="w-4 h-4 text-purple-400" />,
      action: () => {
        onSelectIsland('education');
        setIsOpen(false);
      },
      color: 'hover:border-purple-400 hover:text-purple-300',
    },
    {
      id: 'opensource',
      label: 'Open Source Island',
      icon: <Globe2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onSelectIsland('opensource');
        setIsOpen(false);
      },
      color: 'hover:border-emerald-400 hover:text-emerald-300',
    },
    {
      id: 'contact',
      label: 'Contact Island',
      icon: <PhoneCall className="w-4 h-4 text-pink-400" />,
      action: () => {
        onSelectIsland('contact');
        setIsOpen(false);
      },
      color: 'hover:border-pink-400 hover:text-pink-300',
    },
    {
      id: 'home',
      label: 'Home Island',
      icon: <Home className="w-4 h-4 text-sky-400" />,
      action: () => {
        onSelectIsland('home');
        setIsOpen(false);
      },
      color: 'hover:border-sky-400 hover:text-sky-300',
    },
    {
      id: 'certifications',
      label: 'Certifications Island',
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onSelectIsland('certifications');
        setIsOpen(false);
      },
      color: 'hover:border-emerald-400 hover:text-emerald-300',
    },
    {
      id: 'journal',
      label: 'Cloud Journal',
      icon: <Bookmark className="w-4 h-4 text-blue-400" />,
      action: () => {
        onOpenJournal();
        setIsOpen(false);
      },
      color: 'hover:border-blue-400 hover:text-blue-300',
    },
    {
      id: 'cv',
      label: 'Official CV',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onOpenCV();
        handleSetIsOpen(false);
      },
      color: 'hover:border-emerald-400 hover:text-emerald-300',
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* Radial Wheel Modal Backdrop & HUD */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md animate-fade-in flex items-center justify-center p-4 pointer-events-auto"
          onClick={() => handleSetIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900/95 border border-sky-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.25)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-white">
                    Cloud Navigation Wheel
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Fast-Jump Celestial Wayfinder
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSetIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close navigation wheel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Radial Waypoints Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {wheelItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    handleSetIsOpen(false);
                  }}
                  className={`p-3 rounded-2xl bg-slate-950/70 border border-white/10 transition-all flex flex-col items-center justify-center text-center gap-2 group hover:scale-105 active:scale-95 shadow-md ${item.color}`}
                >
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white font-display">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] font-mono text-slate-400">
                Click any waypoint to smoothly traverse the cloudverse
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Compass Dial Trigger Button */}
      <button
        onClick={() => handleSetIsOpen(!isOpen)}
        className="glass-panel p-3.5 rounded-2xl border border-sky-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(56,189,248,0.3)] flex items-center gap-2.5 text-white hover:scale-110 active:scale-95 transition-all group"
        title="Open Cloud Navigation Wheel"
        aria-label="Open Cloud Navigation Wheel"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/40 group-hover:rotate-45 transition-transform duration-300">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-bold font-display hidden sm:inline text-sky-200 group-hover:text-white">
          Wayfinder
        </span>
      </button>
    </div>
  );
};
