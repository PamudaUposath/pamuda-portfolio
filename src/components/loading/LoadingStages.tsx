import React from 'react';
import {
  Cloud,
  Box,
  Compass,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { LOADING_STAGES } from '../../hooks/useAppLoading';

interface LoadingStagesProps {
  currentStageIndex: number;
}

export const LoadingStages: React.FC<LoadingStagesProps> = ({ currentStageIndex }) => {
  const getStageIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 1:
        return <Box className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 2:
        return <Compass className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 3:
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 4:
        return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-6 select-none">
      {/* Desktop / Tablet Horizontal Timeline Layout */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 items-start relative">
        {LOADING_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center text-center relative group"
            >
              {/* Connecting Dashed Line (drawn behind the node icon) */}
              {idx < LOADING_STAGES.length - 1 && (
                <div
                  className={`hidden sm:block absolute top-4 left-1/2 w-full h-[1px] -z-10 border-t-2 border-dashed transition-colors duration-500 ${
                    isCompleted
                      ? 'border-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                      : 'border-slate-700/60'
                  }`}
                />
              )}

              {/* Stage Icon Node */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? 'bg-sky-500/25 text-sky-300 border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-110'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/70 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                    : 'bg-slate-900/80 text-slate-500 border border-slate-700/50'
                }`}
              >
                {getStageIcon(idx)}

                {/* Pulsing ring on active node */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full border border-sky-400/60 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Stage Label */}
              <div className="mt-2 space-y-0.5">
                <span
                  className={`block text-[10px] sm:text-xs font-semibold leading-tight transition-colors duration-300 ${
                    isActive
                      ? 'text-sky-300 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </span>

                {/* Glowing Cyan Underline Indicator for Active Stage */}
                {isActive && (
                  <div className="w-6 sm:w-8 h-0.5 mx-auto bg-gradient-to-r from-transparent via-sky-400 to-transparent rounded-full shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
