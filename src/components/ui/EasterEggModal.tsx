import React, { useEffect } from 'react';
import { Sparkles, Compass, X } from 'lucide-react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJourney: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({
  isOpen,
  onClose,
  onOpenJourney,
}) => {
  // Support closing with Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full rounded-3xl bg-slate-900 border border-amber-400/50 p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.2)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition border border-white/10 z-10"
          aria-label="Close discovery notification"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with isolated icon container - no overlapping */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-2xl shrink-0 border border-amber-300/40">
            {/* Golden Leaf SVG */}
            <svg className="w-7 h-7 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.61 6.24 4.09 8.04L5 22l4.5-1.5c.81.33 1.69.5 2.5.5 5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
            </svg>
          </div>
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Secret Discovery
            </span>
            <h2 id="easter-egg-title" className="text-xl sm:text-2xl font-bold font-display text-white leading-snug">
              You Discovered Where My Journey Began!
            </h2>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-3 text-slate-200 text-xs sm:text-sm leading-relaxed border-y border-white/10 py-4">
          <p>
            You found the <strong className="text-amber-300">Golden Lotus Emblem</strong> resting on{' '}
            <span className="text-white font-semibold">Home Island (Colombo, Sri Lanka)</span>, representing my hometown.
          </p>
          <p>
            Colombo is where my passion for technology first sparked. My academic journey then took me to the{' '}
            <strong className="text-white">University of Jaffna</strong> for my Computer Science degree, where I founded the AWS Student Builder Group with 600+ members,
            conducted microservices reliability research, and stepped onto the global cloud stage.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenJourney();
            }}
            className="btn-primary w-full sm:flex-1 py-3 px-5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-transform"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Explore Personal Journey</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary w-full sm:w-auto py-3 px-5 text-xs sm:text-sm font-semibold"
          >
            Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
