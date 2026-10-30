import React from 'react';

export const LoadingBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Base Wallpaper Image with subtle floating animation */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 animate-island-float"
        style={{
          backgroundImage: "url('/cinematic_loading_bg.jpg')",
          backgroundPosition: 'center 42%',
        }}
      />

      {/* 2. Top-Left Cosmic Starlight Shimmer */}
      <div className="absolute top-0 left-0 w-2/5 h-1/2 bg-gradient-to-br from-indigo-950/60 via-purple-900/20 to-transparent pointer-events-none animate-starlight" />

      {/* 3. Top-Right Radiant Sunrise Flare */}
      <div className="absolute top-0 right-0 w-1/2 h-2/3 bg-radial from-amber-400/25 via-orange-500/10 to-transparent pointer-events-none animate-sunrise-flare" />

      {/* 4. Atmospheric Layered Floating Clouds (Drifting Motes) */}
      <div
        className="absolute bottom-12 inset-x-0 h-44 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-transparent opacity-80 animate-cloud-slow"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 90%, rgba(244, 114, 182, 0.12), transparent 70%)',
        }}
      />

      <div
        className="absolute -bottom-8 -left-20 w-[120%] h-52 opacity-40 animate-cloud-medium pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 75% 70%, rgba(251, 191, 36, 0.18), transparent 50%), radial-gradient(circle at 25% 80%, rgba(56, 189, 248, 0.15), transparent 45%)',
        }}
      />

      {/* 5. Cinematic Vignette Overlay (dark edges for crystal clear text legibility) */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent pointer-events-none" />
    </div>
  );
};
