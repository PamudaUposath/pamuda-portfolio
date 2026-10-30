import React from 'react';

interface LoadingProgressProps {
  progress: number;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="relative z-20 w-full max-w-xl mx-auto px-4 flex flex-col items-center space-y-2 select-none">
      {/* 1. Track Bar + Percentage Container */}
      <div className="w-full flex items-center gap-3.5">
        {/* Track */}
        <div className="flex-1 h-3 sm:h-3.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/40 p-[2px] shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Fill with Cyan to Gold Gradient */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(56,189,248,0.7)] relative"
            style={{ width: `${clampedProgress}%` }}
          >
            {/* Shimmer Scan Highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-75 progress-scan-gradient" />
          </div>
        </div>

        {/* Numeric Percentage */}
        <div className="font-mono font-bold text-xs sm:text-sm text-sky-200 min-w-[3rem] text-right drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
          {clampedProgress}%
        </div>
      </div>

      {/* 2. Subtitle Below Bar */}
      <div className="text-xs sm:text-sm font-display font-semibold text-white tracking-wide flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
        <span>Loading Pamuda's World...</span>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping inline-block" />
      </div>
    </div>
  );
};
