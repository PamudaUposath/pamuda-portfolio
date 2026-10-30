import React from 'react';
import { ArrowRight, Play, ExternalLink, Award, Users, Cloud, Compass } from 'lucide-react';

interface HeroOverlayProps {
  onEnter3D: () => void;
  onEnter2D: () => void;
  onOpenJourney: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  onEnter3D,
  onEnter2D,
  onOpenJourney,
}) => {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Cinematic subtle vignette backdrop centered on the modal */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.45)_0%,rgba(2,6,23,0.75)_100%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Cinematic Centered Welcome Panel */}
      <aside
        aria-label="Welcome to Pamuda's World"
        className="pointer-events-auto w-full max-w-md sm:max-w-lg lg:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 lg:p-8 bg-[#0F172A]/92 backdrop-blur-2xl border border-sky-400/30 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(2,132,199,0.25)] transition-all duration-300 animate-fade-in text-center space-y-3.5 sm:space-y-4"
      >
        {/* Header: Original P Logo + Introduction Badge */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-1 flex items-center justify-center shadow-lg shadow-sky-500/30 overflow-hidden shrink-0 border border-sky-300/30">
            <img
              src="/favicon.png"
              alt="Pamuda P Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/FaviconDesign1.png';
              }}
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-sky-950/70 border border-sky-400/30 text-[9px] sm:text-[11px] font-mono font-semibold tracking-wider text-sky-300 uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Welcome to Pamuda's World</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-xl sm:text-3xl font-extrabold font-display text-[#F8FAFC] tracking-tight leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] text-center">
          Pamuda U. de A. Goonatilake
        </h1>

        {/* Professional Tagline */}
        <p className="text-xs sm:text-base font-semibold text-[#7DD3FC] leading-snug text-center">
          Building Software. Exploring Cloud. Learning Reliability.
        </p>

        {/* Short Introduction */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal text-center">
          I'm a Computer Science undergraduate at the University of Jaffna, Sri Lanka, passionate about software engineering, cloud computing, DevOps, and building reliable systems.
        </p>

        {/* Professional Highlights (Verified & Compact Badges) */}
        <div className="pt-0.5 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-slate-900/80 border border-indigo-400/30 text-indigo-300 text-[10px] sm:text-[11px] font-medium shadow-sm">
            <Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
            <span>Founding AWS Student Builder Group Leader at University of Jaffna</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-slate-900/80 border border-sky-400/30 text-sky-300 text-[10px] sm:text-[11px] font-medium shadow-sm">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 shrink-0" />
            <span>Project Vice Chair (Finance & Partnerships) of IEEE StudPro 9.0</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-slate-900/80 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-medium shadow-sm">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span>AWS Certified Cloud Practitioner</span>
            
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-slate-900/80 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-medium shadow-sm">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span>1x Salesforce certified</span>
            
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="pt-1.5 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
          {/* Primary: Enter Pamuda's World */}
          <button
            onClick={onEnter3D}
            className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#0284C7] hover:bg-sky-500 active:bg-sky-700 text-[#F8FAFC] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(2,132,199,0.4)] hover:shadow-[0_10px_30px_rgba(2,132,199,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Enter Pamuda's World 3D Experience"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Enter Pamuda's World</span>
          </button>

          {/* Secondary: View Portfolio */}
          <button
            onClick={onEnter2D}
            className="px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-sky-400/50 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="View 2D Executive Portfolio"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>View Portfolio</span>
          </button>
        </div>

        {/* Subtle Personal Journey Link */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center">
          <button
            onClick={onOpenJourney}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-sky-300 hover:text-amber-300 transition-colors group focus:outline-none"
            aria-label="Discover My Journey: From Sri Lanka to the Cloud"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400 group-hover:text-amber-300 transition-colors" />
            <span>Discover My Journey</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>
    </div>
  );
};
