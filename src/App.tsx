import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2 } from 'lucide-react';
import { CloudVerseCanvas } from './components/3d/CloudVerseCanvas';
import { CloudNavbar } from './components/ui/CloudNavbar';
import { HeroOverlay } from './components/ui/HeroOverlay';
import { IslandModal } from './components/ui/IslandModal';
import { JourneyModal } from './components/ui/JourneyModal';
import { CloudOpsGame } from './components/game/CloudOpsGame';
import { ExecutivePortfolio } from './components/portfolio2d/ExecutivePortfolio';
import { CloudSkillsConsole } from './components/interactive/CloudSkillsConsole';
import { CloudNavigationWheel } from './components/navigation/CloudNavigationWheel';
import { CloudBottomDock } from './components/navigation/CloudBottomDock';
import { CVViewerModal } from './components/ui/CVViewerModal';
import { CloudJournalModal } from './components/ui/CloudJournalModal';
import { EasterEggModal } from './components/ui/EasterEggModal';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CloudCursor } from './components/interactive/CloudCursor';
import { NavigationTourModal } from './components/navigation/NavigationTourModal';
import type { IslandId, ViewMode, CloudTheme } from './types';
import { ISLANDS } from './data/islands';
import { getTimezoneBasedTheme } from './utils/themeTime';

export function App() {
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === '2d' || p.get('mode') === '3d' || p.get('modal') || p.get('island')) {
        return false;
      }
    }
    return true;
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === '2d') return '2d';
    }
    return '3d';
  });
  const [showHero, setShowHero] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === '2d' || p.get('mode') === '3d' || p.get('modal') || p.get('island')) {
        return false;
      }
    }
    return true;
  });
  const [activeIsland, setActiveIsland] = useState<IslandId | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<IslandId | null>(null);

  // Modals state
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);
  const [isJourneyOpen, setIsJourneyOpen] = useState<boolean>(false);
  const [isSkillsConsoleOpen, setIsSkillsConsoleOpen] = useState<boolean>(false);
  const [isCVOpen, setIsCVOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState<boolean>(false);
  const [isNavWheelOpen, setIsNavWheelOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  // Check if first-time visitor to offer interactive 3D navigation tour
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cloudverse_navigation_tour_seen') === 'true';
    }
    return true;
  });

  // Check if any popup or modal dialog is currently open on top of the 3D scene
  const isAnyModalOpen =
    isGameOpen ||
    isJourneyOpen ||
    isSkillsConsoleOpen ||
    isCVOpen ||
    isJournalOpen ||
    isEasterEggOpen ||
    isNavWheelOpen;

  // User manual theme override (if user explicitly toggled during session)
  const [hasUserSelectedTheme, setHasUserSelectedTheme] = useState<boolean>(false);

  // Atmospheric Themes: automatically detects viewer's local timezone / time of day
  // - Sunrise / Dawn & Sunset: 5am - 9am & 5pm - 8pm
  // - Daylight: 9am - 5pm
  // - Night: 8pm - 5am
  const [theme, setTheme] = useState<CloudTheme>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get('theme');
      if (themeParam === 'night' || themeParam === 'daylight' || themeParam === 'sunrise') {
        return themeParam;
      }
    }
    return getTimezoneBasedTheme();
  });

  const handleThemeChange = (newTheme: CloudTheme) => {
    setTheme(newTheme);
    setHasUserSelectedTheme(true);
    localStorage.setItem('cloudverse-theme', newTheme);
  };

  // SRE Incident State (Alters 3D sky lighting dynamically)
  const [isIncidentActive, setIsIncidentActive] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  // Spoken audio narration with approved welcome narration script
  const OFFICIAL_WELCOME_NARRATION = `Welcome to Pamuda's World!
I'm Pamuda U. de A. Goonatilake, a Computer Science undergraduate at the University of Jaffna, Sri Lanka.
I'm passionate about software development, cloud computing, DevOps, and site reliability engineering. I enjoy building practical applications, exploring AWS technologies, and learning how to create reliable and scalable systems.
As the Founding AWS Student Builder Group Leader at the University of Jaffna, I helped grow a community of more than six hundred members, bringing students together through technical workshops, events, and hands-on learning experiences.
I'm also an AWS Certified Cloud Practitioner and contribute to open-source projects.
Alongside my development work, I'm conducting undergraduate research on how monitoring baselines affect microservice failure detection.
I'm also an active IEEE volunteer, and I currently serve as the Project Vice Chair, Finance & Partnerships, for IEEE StudPro 9.0, where I contribute to financial planning, partnership coordination, and student-focused initiatives.
This interactive world brings together my projects, skills, experiences, and achievements.
Explore the islands, discover what I've built, and learn more about my journey.
Welcome to my world!`;

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true); // Initial state on page load is Muted
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Deep linking & quick parameter routing
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam === 'night' || themeParam === 'daylight' || themeParam === 'sunrise') {
      setTheme(themeParam);
    }
    const modeParam = params.get('mode');
    if (modeParam === '2d') {
      setViewMode('2d');
      setShowHero(false);
      setIsLoading(false);
    } else if (modeParam === '3d') {
      setViewMode('3d');
      setShowHero(false);
      setIsLoading(false);
    }
    const islandParam = params.get('island');
    if (islandParam) {
      setActiveIsland(islandParam as IslandId);
      setShowHero(false);
      setIsLoading(false);
    }
    const modalParam = params.get('modal');
    if (modalParam) {
      setIsLoading(false);
      setShowHero(false);
      if (modalParam === 'skills') setIsSkillsConsoleOpen(true);
      if (modalParam === 'journal') setIsJournalOpen(true);
      if (modalParam === 'cv') setIsCVOpen(true);
      if (modalParam === 'game') setIsGameOpen(true);
      if (modalParam === 'journey') setIsJourneyOpen(true);
      if (modalParam === 'easteregg') setIsEasterEggOpen(true);
      if (modalParam === 'tour') setIsTourOpen(true);
    }

    // Periodically sync theme if timezone hour rolls over into next phase (every minute)
    const timeSyncInterval = setInterval(() => {
      const p = new URLSearchParams(window.location.search);
      if (!hasUserSelectedTheme && !p.get('theme')) {
        const autoTheme = getTimezoneBasedTheme();
        setTheme((prev) => (prev !== autoTheme ? autoTheme : prev));
      }
    }, 60000);

    return () => {
      clearInterval(timeSyncInterval);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(OFFICIAL_WELCOME_NARRATION);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.onend = () => {
      setIsAudioPlaying(false);
      setIsAudioMuted(true);
      speechRef.current = null;
    };
    utterance.onerror = () => {
      setIsAudioPlaying(false);
      setIsAudioMuted(true);
      speechRef.current = null;
    };
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsAudioPlaying(true);
    setIsAudioMuted(false);
  };

  // Single unified audio toggle:
  // - If muted: Unmutes and starts welcome narration fresh from the beginning.
  // - If unmuted: Mutes and stops narration immediately.
  // - When unmuted again: starts script from the beginning.
  const toggleMute = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isAudioMuted) {
      startNarration();
    } else {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      setIsAudioMuted(true);
      speechRef.current = null;
    }
  };

  const toggleAudio = toggleMute;
  const replayAudio = startNarration;

  // Chrome SpeechSynthesis keep-alive so narrations never freeze or cut off
  useEffect(() => {
    let interval: any;
    if (isAudioPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      interval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 7000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAudioPlaying]);

  const handleSelectIsland = (id: IslandId | null) => {
    setActiveIsland(id);
    setShowHero(false);
  };

  const handleEnter3D = () => {
    setShowHero(false);
    setViewMode('3d');
    // If first-time visitor enters 3D mode, launch the navigation tour automatically
    if (!hasSeenTour) {
      setIsTourOpen(true);
      setHasSeenTour(true);
    }
  };

  const handleStartTour = () => {
    setShowHero(false);
    setViewMode('3d');
    setIsTourOpen(true);
    setHasSeenTour(true);
  };

  const handleEnter2D = () => {
    setShowHero(false);
    setViewMode('2d');
  };

  const hoveredIslandData = hoveredIsland
    ? ISLANDS.find((i) => i.id === hoveredIsland)
    : null;

  return (
    <div className={`relative w-full ${viewMode === '3d' ? 'h-screen overflow-hidden' : 'min-h-screen'} font-body text-slate-100 bg-slate-950`}>
      {/* Loading Screen with WebGL Fallback and Skip-to-2D */}
      {isLoading && (
        <LoadingScreen
          onEnter={() => setIsLoading(false)}
          onSkipTo2D={() => {
            setIsLoading(false);
            setViewMode('2d');
            setShowHero(false);
          }}
        />
      )}

      {/* Top Navigation HUD (3D Mode Only) */}
      {viewMode === '3d' && (
        <CloudNavbar
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode('2d')}
          activeIsland={activeIsland}
          onSelectIsland={handleSelectIsland}
          onOpenGame={() => setIsGameOpen(true)}
          onOpenJourney={() => setIsJourneyOpen(true)}
          onToggleHero={() => setShowHero(!showHero)}
          showHero={showHero}
          isIncidentActive={isIncidentActive}
          isResolved={isResolved}
          isAudioPlaying={isAudioPlaying}
          isAudioMuted={isAudioMuted}
          onToggleAudio={toggleAudio}
          onReplayAudio={replayAudio}
          onToggleMute={toggleMute}
          theme={theme}
          onThemeChange={handleThemeChange}
          onOpenSkillsConsole={() => setIsSkillsConsoleOpen(true)}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenCV={() => setIsCVOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
        />
      )}

      {/* VIEW MODE 1: 3D CLOUDVERSE EXPLORER */}
      {viewMode === '3d' && (
        <main className="relative w-full h-full overflow-hidden" id="main-content">
          <h1 className="sr-only">
            Pamuda's World: Interactive 3D Cloud Portfolio by Pamuda U. de A. Goonatilake
          </h1>

          {/* Three.js R3F Canvas */}
          <CloudVerseCanvas
            activeIsland={activeIsland}
            onSelectIsland={handleSelectIsland}
            isIncidentActive={isIncidentActive}
            isResolved={isResolved}
            onHoverIsland={setHoveredIsland}
            showLabels={!showHero && !isAnyModalOpen}
            theme={theme}
            showHero={showHero}
            onDiscoverEasterEgg={() => setIsEasterEggOpen(true)}
          />

          {/* Custom Cloud-Inspired Mist Cursor */}
          <CloudCursor
            isHoveringIsland={hoveredIsland !== null}
            enabled={viewMode === '3d' && !isAnyModalOpen}
          />

          {/* Opening Hero Overlay (Non-intrusive) */}
          {showHero && (
            <HeroOverlay
              onEnter3D={handleEnter3D}
              onEnter2D={handleEnter2D}
              onOpenJourney={() => setIsJourneyOpen(true)}
              onStartTour={handleStartTour}
            />
          )}

          {/* Radial Navigation Wheel (Active in 3D Mode, Left Side) */}
          {!showHero && (
            <CloudNavigationWheel
              isOpen={isNavWheelOpen}
              onOpenChange={setIsNavWheelOpen}
              onSelectIsland={handleSelectIsland}
              onReturnOverview={() => setActiveIsland(null)}
              onOpenSkillsConsole={() => setIsSkillsConsoleOpen(true)}
              onOpenGame={() => setIsGameOpen(true)}
              onOpenCV={() => setIsCVOpen(true)}
              onOpenJournal={() => setIsJournalOpen(true)}
              onOpenTour={() => setIsTourOpen(true)}
              activeIsland={activeIsland}
            />
          )}

          {/* Floating Bottom-Centre Navigation Dock (Remaining 6 Islands) */}
          {!showHero && (
            <CloudBottomDock
              activeIsland={activeIsland}
              onSelectIsland={handleSelectIsland}
            />
          )}

          {/* Bottom Right: Single Dedicated Play CloudOps Game Button */}
          {!showHero && (
            <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 select-none pointer-events-auto">
              <button
                onClick={() => setIsGameOpen(true)}
                className={`glass-panel p-2.5 sm:px-4 sm:py-3 rounded-2xl border shadow-xl flex items-center gap-2.5 transition-all duration-300 group hover:scale-105 active:scale-95 ${
                  isResolved
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/90 shadow-emerald-500/20'
                    : isIncidentActive
                    ? 'bg-rose-950/85 text-rose-200 border-rose-500/60 alert-pulse shadow-rose-500/30'
                    : 'bg-slate-950/80 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-slate-900 shadow-amber-500/15'
                }`}
                title="Play CloudOps Game - Interactive SRE Incident Simulation"
                aria-label="Play CloudOps Game"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:rotate-12 ${
                    isResolved
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isIncidentActive
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold font-display text-white group-hover:text-amber-200 flex items-center gap-1.5">
                    Play CloudOps Game
                    {isIncidentActive && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {isResolved ? 'System Operational' : isIncidentActive ? 'Active Incident' : 'SRE Simulator'}
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Island Detail Drawer (suppressed while navigation tour is active so background remains clear) */}
          <IslandModal
            islandId={!isTourOpen ? activeIsland : null}
            onClose={() => setActiveIsland(null)}
            onOpenJourney={() => {
              setActiveIsland(null);
              setIsJourneyOpen(true);
            }}
          />
        </main>
      )}

      {/* VIEW MODE 2: 2D EXECUTIVE PORTFOLIO */}
      {viewMode === '2d' && (
        <ExecutivePortfolio
          onSwitchTo3D={() => setViewMode('3d')}
          onOpenJourney={() => setIsJourneyOpen(true)}
          onOpenCV={() => setIsCVOpen(true)}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenSkillsConsole={() => setIsSkillsConsoleOpen(true)}
        />
      )}

      {/* Interactive Cloud Skills Workstation Console */}
      <CloudSkillsConsole
        isOpen={isSkillsConsoleOpen}
        onClose={() => setIsSkillsConsoleOpen(false)}
        onSelectProject={(project) => {
          setIsSkillsConsoleOpen(false);
          // Can fast jump to projects island or view mode
          setActiveIsland('projects');
          setShowHero(false);
          setViewMode('3d');
        }}
      />

      {/* Verified CV Viewer Modal */}
      <CVViewerModal
        isOpen={isCVOpen}
        onClose={() => setIsCVOpen(false)}
      />

      {/* Cloud Journal (Research & Publications) Modal */}
      <CloudJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      {/* Hidden Sri Lankan Discovery Easter Egg Modal */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
        onOpenJourney={() => {
          setIsEasterEggOpen(false);
          setIsJourneyOpen(true);
        }}
      />

      {/* CloudOps SRE Simulation Modal */}
      <CloudOpsGame
        isOpen={isGameOpen}
        onClose={() => {
          setIsGameOpen(false);
          // Restore selected theme cleanly after incident simulation
          setIsIncidentActive(false);
        }}
        onIncidentStarted={() => {
          setIsIncidentActive(true);
          setIsResolved(false);
        }}
        onIncidentResolved={() => {
          setIsResolved(true);
          setIsIncidentActive(false);
        }}
        isResolved={isResolved}
      />

      {/* Personal Journey Modal: From Sri Lanka to the Cloud */}
      <JourneyModal
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
      />

      {/* Guided 3D Navigation Tour for 1st-Time Visitors & Mobile Exploration */}
      <NavigationTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectIsland={handleSelectIsland}
      />
    </div>
  );
}

export default App;
