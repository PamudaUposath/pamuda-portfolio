import React from 'react';

export const LoadingBranding: React.FC = () => {
  return (
    <div className="relative z-20 flex flex-col items-center text-center space-y-3 pt-6 sm:pt-8 md:pt-10 select-none">
      {/* 1. Pamuda's Original P Logo Badge with Pulsing Cyan Halo */}
      <div className="relative group">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-slate-950/90 border-2 border-sky-400/80 p-2 sm:p-2.5 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.4)] animate-cyan-glow transition-transform duration-500 group-hover:scale-105">
          <img
            src="/favicon.png"
            alt="Pamuda's P Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(56,189,248,0.5)]"
            onError={(e) => {
              e.currentTarget.src = '/FaviconDesign1.png';
            }}
          />
        </div>
        {/* Subtle Ambient Glow Behind Badge */}
        <div className="absolute -inset-1 rounded-3xl bg-sky-400/20 blur-xl pointer-events-none -z-10" />
      </div>

      {/* 2. Heading: Pamuda's World */}
      <div className="space-y-1.5 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight drop-shadow-md">
          <span className="text-white">Pamuda's </span>
          <span className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]">
            World
          </span>
        </h1>

        {/* 3. Approved Tagline */}
        <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium tracking-wide max-w-xl mx-auto drop-shadow">
          Building Software. Exploring Cloud. Learning Reliability.
        </p>
      </div>
    </div>
  );
};
