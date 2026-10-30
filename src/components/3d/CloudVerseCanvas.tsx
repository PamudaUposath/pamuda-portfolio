import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SkyAtmosphere } from './SkyAtmosphere';
import { CloudField } from './CloudField';
import { OverviewBackgroundObjects } from './OverviewBackgroundObjects';
import { SriLankanArchipelago } from './SriLankanArchipelago';
import { CameraRig } from './CameraRig';
import type { IslandId, CloudTheme } from '../../types';
import { orbitStore, zoomStore } from '../../hooks/useOrbitState';

interface CloudVerseCanvasProps {
  activeIsland: IslandId | null;
  onSelectIsland: (id: IslandId) => void;
  isIncidentActive: boolean;
  isResolved: boolean;
  onHoverIsland?: (id: IslandId | null) => void;
  showLabels?: boolean;
  theme?: CloudTheme;
  showHero?: boolean;
  onDiscoverEasterEgg?: () => void;
}

export const CloudVerseCanvas: React.FC<CloudVerseCanvasProps> = ({
  activeIsland,
  onSelectIsland,
  isIncidentActive,
  isResolved,
  onHoverIsland,
  showLabels = true,
  theme = 'sunrise',
  showHero = false,
  onDiscoverEasterEgg,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredIslandRef = useRef<IslandId | null>(null);
  const lastIslandScrollTime = useRef<number>(0);

  const handleHoverIsland = (id: IslandId | null) => {
    hoveredIslandRef.current = id;
    if (onHoverIsland) {
      onHoverIsland(id);
    }
  };

  // Context-aware mouse wheel listener:
  // - If cursor is hovering an island: scrolling moves to the next/previous island in rotation
  // - If cursor is outside of any island: scrolling zooms the world in and out
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (activeIsland) return; // Allow normal modal scrolling when an island info panel is open

      e.preventDefault();

      const isHoveringIsland = hoveredIslandRef.current !== null;

      if (isHoveringIsland) {
        // User request: "hover an island and scroll need to move to next island as a rotation"
        // 10 surrounding islands arranged along circular orbit: angular step is 36 deg = (2 * PI / 10)
        const islandStep = (2 * Math.PI) / 10;
        const direction = e.deltaY > 0 ? 1 : -1;

        const now = performance.now();
        // Throttle so each mouse wheel notch advances by exactly 1 island step smoothly
        if (now - lastIslandScrollTime.current > 160) {
          lastIslandScrollTime.current = now;
          const currentTarget = orbitStore.getTargetAngle();
          // Snap cleanly to the next island position
          const nextTarget = Math.round((currentTarget + direction * islandStep) / islandStep) * islandStep;
          orbitStore.setTargetAngle(nextTarget);
        }
      } else {
        // User request: "but outside of the island scrolling can be zoom in and out the world"
        const zoomDelta = (e.deltaY > 0 ? 1 : -1) * 3.8;
        zoomStore.zoomDelta(zoomDelta);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [activeIsland]);

  const skyColor =
    isIncidentActive && !isResolved
      ? '#090d16'
      : theme === 'night'
      ? '#020617'
      : theme === 'daylight'
      ? '#0284c7'
      : '#0369a1';

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      <Canvas
        camera={{ position: [0, 18.5, 48.0], fov: 46, near: 0.1, far: 1400 }}
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
      >
        {/* Sky Background Color */}
        <color attach="background" args={[skyColor]} />

        {/* Atmospheric Sunlight, Sky & Fog */}
        <SkyAtmosphere
          isIncidentActive={isIncidentActive}
          isResolved={isResolved}
          theme={theme}
        />

        {/* Billowing Cloud Ocean, Island Cloud Skirts & Motes */}
        <CloudField
          isIncidentActive={isIncidentActive}
          isResolved={isResolved}
          theme={theme}
        />

        {/* Thematic Background Celestial Objects: Cloud Satellites & Microservice Architecture Nodes */}
        <OverviewBackgroundObjects
          isIncidentActive={isIncidentActive}
          isResolved={isResolved}
          theme={theme}
        />

        {/* Sri Lankan-Inspired Sculpted Floating Archipelago */}
        <SriLankanArchipelago
          activeIsland={activeIsland}
          onSelectIsland={onSelectIsland}
          isIncidentActive={isIncidentActive}
          isResolved={isResolved}
          onHoverIsland={handleHoverIsland}
          showLabels={showLabels}
          onDiscoverEasterEgg={onDiscoverEasterEgg}
        />

        {/* Cinematic Camera Rig & Orbit Controls */}
        <CameraRig activeIsland={activeIsland} showHero={showHero} />
      </Canvas>
    </div>
  );
};
