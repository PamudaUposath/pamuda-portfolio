import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppLoading } from '../../hooks/useAppLoading';
import { LoadingBackground } from './LoadingBackground';
import { LoadingBranding } from './LoadingBranding';
import { LoadingProgress } from './LoadingProgress';
import { LoadingStages } from './LoadingStages';
import { LoadingFallback } from './LoadingFallback';
import '../../styles/loading.css';

interface CinematicLoadingScreenProps {
  onEnter: () => void;
  onSkipTo2D: () => void;
}

export const CinematicLoadingScreen: React.FC<CinematicLoadingScreenProps> = ({
  onEnter,
  onSkipTo2D,
}) => {
  const {
    progress,
    currentStageIndex,
    isReady,
    webGLSupported,
    error,
    retry,
  } = useAppLoading();

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    if (isReady && !error && webGLSupported) {
      // Smooth fade-out transition sequence into the 3D world
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        const enterTimer = setTimeout(() => {
          onEnter();
        }, 700);
        return () => clearTimeout(enterTimer);
      }, 500);

      return () => clearTimeout(fadeTimer);
    }
  }, [isReady, error, webGLSupported, onEnter]);

  // Handle hardware acceleration failure or unrecoverable error
  if (!webGLSupported || error) {
    return (
      <LoadingFallback
        error={error}
        onRetry={retry}
        onSkipTo2D={onSkipTo2D}
      />
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Pamuda's World"
      className={`fixed inset-0 z-[120] flex flex-col justify-between overflow-hidden bg-slate-950 transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Cinematic Background with Animated Sky, Islands & Waterfalls */}
      <LoadingBackground />

      {/* 2. Top-Centre Branding Area */}
      <LoadingBranding />

      {/* 3. Bottom Interactive Progress Area */}
      <div className="relative z-20 flex flex-col items-center space-y-6 pb-6 sm:pb-8 md:pb-10 w-full">
        {/* Real Progress Bar */}
        <LoadingProgress progress={progress} />

        {/* Five Interactive Loading Stages */}
        <LoadingStages currentStageIndex={currentStageIndex} />

        {/* 4. Accessible 2D Portfolio Shortcut */}
        <div className="pt-1">
          <button
            onClick={onSkipTo2D}
            className="group px-4 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/10 hover:border-sky-400/40 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:scale-105 active:scale-95"
            title="Open 2D Executive Portfolio"
          >
            <span>Skip 3D and View Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
