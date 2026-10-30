import React, { useState } from 'react';
import {
  Layout,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sunrise,
  Menu,
  X,
  Sparkles,
  Award,
  Briefcase,
  Layers,
  Code2,
  GraduationCap,
  Users,
  GitBranch,
  BookOpen,
  Mail,
  FolderGit2,
  Gamepad2,
  Compass,
  FileText,
  ChevronUp,
} from 'lucide-react';
import type { IslandId, ViewMode, CloudTheme } from '../../types';
import { navigationConfig } from '../../data/navigationConfig';

interface CloudNavbarProps {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  activeIsland: IslandId | null;
  onSelectIsland: (id: IslandId) => void;
  onOpenGame: () => void;
  onOpenJourney: () => void;
  onToggleHero?: () => void;
  showHero?: boolean;
  isIncidentActive: boolean;
  isResolved: boolean;
  isAudioPlaying: boolean;
  isAudioMuted?: boolean;
  onToggleAudio: () => void;
  onReplayAudio?: () => void;
  onToggleMute?: () => void;
  theme?: CloudTheme;
  onThemeChange?: (theme: CloudTheme) => void;
  onOpenSkillsConsole?: () => void;
  onOpenJournal?: () => void;
  onOpenCV?: () => void;
  onOpenTour?: () => void;
}

export const CloudNavbar: React.FC<CloudNavbarProps> = ({
  viewMode,
  onToggleViewMode,
  activeIsland,
  onSelectIsland,
  onOpenGame,
  onOpenJourney,
  showHero = false,
  isIncidentActive,
  isResolved,
  isAudioPlaying,
  isAudioMuted = false,
  onToggleAudio,
  onReplayAudio,
  onToggleMute,
  theme = 'sunrise',
  onThemeChange,
  onOpenCV,
  onOpenTour,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('navmenu') === 'open';
    }
    return false;
  });

  // Icon mapping for top primary navigation items
  const getNavIcon = (id: IslandId) => {
    switch (id) {
      case 'home':
        return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
      case 'projects':
        return <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'skills':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'experience':
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case 'achievements':
        return <Award className="w-3.5 h-3.5 text-yellow-400" />;
      case 'leadership':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
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
        return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const handleSelect = (id: IslandId) => {
    onSelectIsland(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none select-none">
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-3">
          
          {/* ==================== TOP LEFT: BRANDING ==================== */}
          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            <button
              onClick={() => handleSelect('home')}
              className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-2.5 border border-sky-400/30 hover:border-sky-400/60 transition-all shadow-lg group bg-slate-950/80 backdrop-blur-xl"
              title="Pamuda's World - Home Island (Colombo, Sri Lanka)"
            >
              {/* Authentic Pamuda P Logo */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-1 flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <img
                  src="/favicon.png"
                  alt="Pamuda's P Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/FaviconDesign1.png';
                  }}
                />
              </div>
              <div className="text-left">
                <div className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  Pamuda's World
                </div>
                <div className="text-[10px] text-sky-300 font-medium hidden sm:block">
                  Home Island • Colombo, Sri Lanka
                </div>
              </div>
            </button>
          </div>

          {/* ==================== TOP CENTRE: MAIN NAVIGATION (EXACTLY 5 ITEMS) ==================== */}
          {!showHero && (
            <nav
              aria-label="Primary Island Navigation"
              className="hidden md:flex items-center gap-1 glass-panel px-2 py-1.5 rounded-2xl pointer-events-auto border border-white/10 shadow-xl bg-slate-950/80 backdrop-blur-xl animate-fade-in"
            >
              {navigationConfig.top.map((item) => {
                const isActive =
                  activeIsland === item.id ||
                  (item.id === 'home' && (activeIsland === 'home' || activeIsland === 'identity' || activeIsland === 'about'));
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30 border border-sky-300/40 scale-105'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                    }`}
                    title={`${item.destination}`}
                  >
                    {getNavIcon(item.id)}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* ==================== TOP RIGHT: CONTROLS (THEME, AUDIO, VIEW PORTFOLIO) ==================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">

            {/* Compact Theme Controls (Desktop/Tablet) */}
            {onThemeChange && (
              <div className="hidden lg:flex items-center glass-panel p-1 rounded-xl border border-white/10 gap-0.5 bg-slate-950/70 shadow">
                <button
                  onClick={() => onThemeChange('sunrise')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    theme === 'sunrise'
                      ? 'bg-amber-500/30 text-amber-300 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Sunrise / Sunset Theme (Auto-switched by local timezone: 5-9 AM & 5-8 PM)"
                  aria-label="Sunrise Theme"
                >
                  <Sunrise className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onThemeChange('daylight')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    theme === 'daylight'
                      ? 'bg-sky-500/30 text-sky-300 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Daylight Theme (Auto-switched by local timezone: 9 AM - 5 PM)"
                  aria-label="Daylight Theme"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onThemeChange('night')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    theme === 'night'
                      ? 'bg-indigo-500/30 text-indigo-300 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Night Theme (Auto-switched by local timezone: 8 PM - 5 AM)"
                  aria-label="Night Theme"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Single Unified Audio Control Button: Shows Unmute or Mute, with solid visible filling in #fa6506 and pulse when muted */}
            <button
              onClick={onToggleMute || onToggleAudio}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 ${
                isAudioMuted
                  ? 'bg-[#fa6506] hover:bg-[#e05600] text-white font-extrabold border border-orange-300/40 shadow-[0_0_20px_rgba(250,101,6,0.75)] ring-2 ring-[#fa6506]/80 animate-pulse'
                  : 'text-sky-300 bg-slate-900/90 hover:bg-slate-800 border border-sky-400/40 text-slate-200'
              }`}
              title={isAudioMuted ? 'Click to Unmute Welcome Narration' : 'Click to Mute Audio'}
              aria-label={isAudioMuted ? 'Click to Unmute Welcome Narration' : 'Click to Mute Audio'}
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white shrink-0 stroke-[2.5]" />
                  <span className="font-extrabold text-white">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-bold text-sky-300">Mute</span>
                </>
              )}
            </button>

            {/* Interactive Navigation Tour Button (Desktop/Tablet) */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold glass-panel bg-slate-900/90 hover:bg-slate-800 text-sky-300 hover:text-white border border-sky-400/30 hover:border-sky-400/60 transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                title="Launch Guided 3D Navigation Tour"
                aria-label="Launch Guided 3D Navigation Tour"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Tour</span>
              </button>
            )}

            {/* View Portfolio Button (Prominent & Accessible on desktop/tablet, available in bottom menu on mobile) */}
            <button
              onClick={onToggleViewMode}
              className="hidden md:inline-flex btn-primary text-xs py-2 px-3 sm:px-4 items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform shrink-0"
              title={viewMode === '3d' ? 'Switch to 2D Portfolio Mode' : "Switch to Pamuda's World 3D"}
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="font-bold">
                {viewMode === '3d' ? 'View Portfolio' : "Enter 3D World"}
              </span>
            </button>

            {/* Desktop Navigation Hamburger (Hidden on mobile since center bottom button is primary) */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="hidden p-2 rounded-xl glass-panel border border-white/10 text-slate-200 hover:text-white bg-slate-950/80 shadow"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE BOTTOM-CENTER NAVIGATION BUTTON ==================== */}
      {!showHero && (
        <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none md:hidden select-none">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="pointer-events-auto h-12 px-5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-[0_10px_30px_rgba(2,132,199,0.5),0_0_20px_rgba(56,189,248,0.35)] border border-sky-300/60 hover:scale-105 active:scale-95 transition-all ring-2 ring-sky-400/30"
            title="Open Island Navigation & Menu"
            aria-label="Open Island Navigation & Menu"
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold tracking-wide">Explore Islands</span>
            <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-sky-200">
              <ChevronUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* ==================== MOBILE NAVIGATION BOTTOM SHEET ==================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[140] md:hidden pointer-events-auto animate-fade-in select-none">
          {/* Dimmed Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/75"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Bottom Sheet Sheet */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto glass-panel bg-slate-950/98 border-t border-sky-400/40 rounded-t-[32px] p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.25)] space-y-4">
            {/* Drag Handle Indicator */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700/80 mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img src="/favicon.png" alt="Pamuda's P Logo" className="w-5 h-5 object-contain" />
                <span className="font-display font-bold text-white text-sm">Pamuda's World Navigation</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Tour Action Card (Mobile) */}
            {onOpenTour && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTour();
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-sky-500/20 via-blue-600/25 to-indigo-600/20 border border-sky-400/40 text-white flex items-center justify-between group active:scale-[0.98] transition shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/30 flex items-center justify-center text-sky-300">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold font-display text-white group-hover:text-sky-200">
                      Guided 3D Navigation Tour
                    </div>
                    <div className="text-[10px] text-sky-300/80 font-mono">
                      1-minute controls & features tour
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-1 rounded-lg border border-sky-400/30">
                  Start
                </span>
              </button>
            )}

            {/* Primary Destinations (Top 5) */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold mb-2">
                Main Destinations
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navigationConfig.top.map((item) => {
                  const isActive = activeIsland === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-slate-200 bg-slate-900/80 hover:bg-slate-800'
                      }`}
                    >
                      {getNavIcon(item.id)}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Destinations (Bottom 6) */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-2">
                More Island Destinations
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navigationConfig.bottom.map((item) => {
                  const isActive = activeIsland === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-slate-200 bg-slate-900/80 hover:bg-slate-800'
                      }`}
                    >
                      {getNavIcon(item.id)}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Controls: Audio & Theme */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Atmosphere & Audio
              </div>
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-xs text-slate-300 font-medium">Welcome Narration</span>
                <button
                  onClick={onToggleMute || onToggleAudio}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isAudioMuted
                      ? 'bg-[#fa6506] hover:bg-[#e05600] text-white font-extrabold border border-orange-300/40 shadow-[0_0_16px_rgba(250,101,6,0.7)] ring-2 ring-[#fa6506]/80 animate-pulse'
                      : 'text-sky-300 bg-sky-500/20 border border-sky-400/40'
                  }`}
                  title={isAudioMuted ? 'Click to Unmute Welcome Narration' : 'Click to Mute Audio'}
                >
                  {isAudioMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      <span className="font-extrabold text-white">Unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Mute</span>
                    </>
                  )}
                </button>
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              {onThemeChange && (
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => onThemeChange('sunrise')}
                    className={`py-1.5 rounded-lg text-xs font-semibold ${theme === 'sunrise' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                  >
                    Sunrise
                  </button>
                  <button
                    onClick={() => onThemeChange('daylight')}
                    className={`py-1.5 rounded-lg text-xs font-semibold ${theme === 'daylight' ? 'bg-sky-500 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
                  >
                    Daylight
                  </button>
                  <button
                    onClick={() => onThemeChange('night')}
                    className={`py-1.5 rounded-lg text-xs font-semibold ${theme === 'night' ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
                  >
                    Night
                  </button>
                </div>
              )}
            </div>

            {/* View Portfolio Mode Switch (Mobile Drawer) */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleViewMode();
                }}
                className="w-full py-2.5 px-4 rounded-2xl btn-primary text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Layout className="w-4 h-4" />
                <span>{viewMode === '3d' ? 'Switch to 2D Executive Portfolio' : "Enter Pamuda's World 3D"}</span>
              </button>
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onOpenGame();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  Play CloudOps Game
                </span>
                <span className="text-[10px] uppercase font-mono">SRE Simulation</span>
              </button>

              <button
                onClick={() => {
                  onOpenJourney();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  Personal Journey
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400">Story</span>
              </button>

              {onOpenCV && (
                <button
                  onClick={() => {
                    onOpenCV();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Verified CV
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
