import React from 'react';
import { AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

interface LoadingFallbackProps {
  error: string | null;
  onRetry: () => void;
  onSkipTo2D: () => void;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  error,
  onRetry,
  onSkipTo2D,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6 text-center select-none animate-fade-in">
      <div className="glass-panel p-6 sm:p-8 max-w-lg w-full rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 bg-slate-950/95">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow-lg shadow-amber-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            The 3D world could not be loaded.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {error ||
              'WebGL 3D hardware acceleration was not detected or took longer than expected. You can retry loading or seamlessly access the complete professional portfolio in 2D Executive Mode.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry 3D World</span>
          </button>

          <button
            onClick={onSkipTo2D}
            className="btn-primary w-full sm:w-auto py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            <span>View 2D Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
