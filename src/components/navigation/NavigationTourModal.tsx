import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Rotate3d,
  Layers,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Smartphone,
  MousePointer,
} from 'lucide-react';
import type { IslandId } from '../../types';

interface NavigationTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIsland?: (id: IslandId | null) => void;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  desktopTip: string;
  mobileTip: string;
  islandFocus: IslandId | null;
}

export const NavigationTourModal: React.FC<NavigationTourModalProps> = ({
  isOpen,
  onClose,
  onSelectIsland,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const touch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(touch);
    }
  }, []);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      badge: 'Welcome to Pamuda\'s World',
      title: 'Sri Lankan Cloudverse',
      subtitle: '11 Sculpted Celestial Floating Islands',
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      content:
        'Explore 11 celestial floating islands inspired by Sri Lankan landscapes and landmarks! At the center floats Home Island (Colombo, with the iconic Lotus Tower and lush waterfalls), representing software engineering, cloud architecture, and DevOps.',
      desktopTip:
        'The 10 surrounding islands continuously orbit around Home Island in a celestial circular track.',
      mobileTip:
        'All 10 surrounding islands orbit smoothly around Home Island in real time on mobile.',
      islandFocus: 'home',
    },
    {
      id: 'camera',
      badge: 'Camera Freedom',
      title: '360° Free Angles & Zoom',
      subtitle: 'Rotate, Tilt & Zoom Everywhere',
      icon: <Rotate3d className="w-5 h-5 text-amber-400" />,
      content:
        'You have full freedom to explore the world from any angle in 3D. Tilt high overhead down to sea level, and rotate 360° around the entire archipelago.',
      desktopTip:
        'Click & drag with your mouse to rotate and tilt. Scroll your mouse wheel in open sky to zoom in and out.',
      mobileTip:
        'Touch & drag with one finger to rotate your view in 3D. Pinch with two fingers to zoom in and out smoothly.',
      islandFocus: null,
    },
    {
      id: 'orbit',
      badge: 'Island Navigation',
      title: 'Celestial Orbit & Island Stepping',
      subtitle: 'Cycle Island by Island',
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      content:
        'Travel cleanly from one island to the next! Surrounding islands orbit automatically, but pause whenever you hover or interact with them.',
      desktopTip:
        'Hover your cursor over any island and use your mouse wheel to snap directly to the next island in 36° orbit steps!',
      mobileTip:
        'Tap the Left (←) and Right (→) arrows on the bottom dock to step through the orbital ring.',
      islandFocus: 'projects',
    },
    {
      id: 'wayfinder',
      badge: 'Fast-Jump Celestial Wayfinder',
      title: 'Navigation Wheel Dial',
      subtitle: 'Instant Travel in One Click',
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      content:
        'Want to jump straight to a specific island, CV, or tool? The Wayfinder gives you instant access to all 11 destinations without having to search.',
      desktopTip:
        'Click the Compass Dial in the bottom-left corner to open the radial Fast-Jump Wayfinder at any time.',
      mobileTip:
        'Tap the Wayfinder dial in the bottom-left corner to instantly fast-travel across the cloudverse.',
      islandFocus: null,
    },
    {
      id: 'interactive',
      badge: 'Interactive Systems',
      title: 'CloudOps SRE Simulator & Portfolios',
      subtitle: 'Hands-On Incident Simulation',
      icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
      content:
        'Click any island to open detailed project briefs, architectures, and credentials. Test your site reliability skills in the interactive CloudOps Game, or switch to the 2D Executive Portfolio anytime!',
      desktopTip:
        'Click "Play CloudOps Game" (bottom-right) for an SRE simulation, or "View Portfolio" (top-right) for the 2D layout.',
      mobileTip:
        'Tap "Play CloudOps Game" at bottom-right, or use the top menu to view the full 2D executive portfolio.',
      islandFocus: null,
    },
  ];

  // Whenever step changes, update 3D island camera framing
  useEffect(() => {
    if (!isOpen) return;
    const step = tourSteps[currentStep];
    if (onSelectIsland && step) {
      onSelectIsland(step.islandFocus);
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const current = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('cloudverse_navigation_tour_seen', 'true');
    } catch {
      // Ignore local storage error in private browsing
    }
    if (onSelectIsland) {
      onSelectIsland(null); // Return smoothly to Sky Overview
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[130] bg-slate-950/25 flex items-center justify-center p-4 pointer-events-auto animate-fade-in select-none"
      onClick={handleComplete}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Navigation Tour"
    >
      <div
        className="relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl p-4 sm:p-6 bg-slate-900/95 border border-sky-400/40 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(56,189,248,0.25)] space-y-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Step Indicator & Close Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                {current.badge}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
          </div>

          {/* Close / Skip button */}
          <button
            onClick={handleComplete}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close / Skip Tour"
            aria-label="Close / Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Pill Indicator */}
        <div className="flex items-center gap-1.5 pt-1">
          {tourSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'flex-1 bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_8px_#38bdf8]'
                  : idx < currentStep
                  ? 'w-4 sm:w-6 bg-sky-600/70'
                  : 'w-2 sm:w-3 bg-slate-800'
              }`}
              title={`Jump to step ${idx + 1}: ${step.title}`}
              aria-label={`Step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Step Content */}
        <div className="space-y-2 pt-1 text-left">
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">
            {current.title}
          </h3>
          <h4 className="text-xs sm:text-sm font-semibold text-sky-300">
            {current.subtitle}
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {current.content}
          </p>
        </div>

        {/* Device-Specific Tips Card (Context-Aware for Mobile vs Desktop) */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/70 border border-sky-400/25 space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
            {isTouchDevice ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Mobile Touch Tip</span>
              </>
            ) : (
              <>
                <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                <span>Desktop Control Tip</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isTouchDevice ? current.mobileTip : current.desktopTip}
          </p>
        </div>

        {/* Action Controls: Back, Next/Finish, Skip */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/10">
          {/* Skip Tour Button */}
          <button
            onClick={handleComplete}
            className="text-xs text-slate-400 hover:text-slate-200 transition font-medium px-2 py-1.5 rounded-lg hover:bg-slate-800/50 shrink-0"
          >
            Skip
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {/* Previous Step */}
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {/* Next / Finish Tour */}
            <button
              onClick={handleNext}
              className="h-9 sm:h-10 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/30 ring-1 ring-sky-300/40 shrink-0 whitespace-nowrap"
            >
              <span>{isLastStep ? 'Start Exploring!' : 'Next'}</span>
              {isLastStep ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
