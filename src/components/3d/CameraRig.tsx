import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { IslandId } from '../../types';
import { ISLANDS } from '../../data/islands';
import { orbitStore, zoomStore } from '../../hooks/useOrbitState';

interface CameraRigProps {
  activeIsland: IslandId | null;
  showHero?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({ activeIsland, showHero = false }) => {
  const controlsRef = useRef<any>(null);
  const isInitialized = useRef<boolean>(false);
  const currentZoomDist = useRef<number>(zoomStore.getZoomDist());
  // Overview camera target position and look-at target
  const targetPos = useRef(new THREE.Vector3(0, 18.5, 48.0));
  const targetLook = useRef(new THREE.Vector3(0, 1.6, 0));

  // User interaction and smooth camera transition state
  const prevActiveIsland = useRef<IslandId | null>(activeIsland);
  const prevShowHero = useRef<boolean>(showHero);
  const isTransitioning = useRef<boolean>(false);
  const transitionTimer = useRef<number>(0);

  // Trigger smooth transition whenever viewer selects an island or returns to overview
  useEffect(() => {
    if (activeIsland !== prevActiveIsland.current || showHero !== prevShowHero.current) {
      prevActiveIsland.current = activeIsland;
      prevShowHero.current = showHero;
      isTransitioning.current = true;
      transitionTimer.current = 0;
    }
  }, [activeIsland, showHero]);

  // Hook into OrbitControls start event so viewer manual drag immediately takes control
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onUserStart = () => {
      isTransitioning.current = false;
    };
    controls.addEventListener('start', onUserStart);
    return () => {
      controls.removeEventListener('start', onUserStart);
    };
  }, []);

  useFrame((state, delta) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const controls = controlsRef.current;
    if (!controls) return;

    // Smoothly damp interactive overview zoom distance
    const targetZoom = zoomStore.getTargetZoomDist();
    currentZoomDist.current = THREE.MathUtils.damp(currentZoomDist.current, targetZoom, 5.0, delta);
    zoomStore.setZoomDist(currentZoomDist.current);

    // Immediately initialize camera composition on the very first frame
    if (!isInitialized.current) {
      if (activeIsland) {
        const island = ISLANDS.find((i) => i.id === activeIsland);
        if (island) {
          let worldX = island.position[0];
          let worldY = island.position[1];
          let worldZ = island.position[2];
          if (island.id !== 'home' && island.id !== 'identity' && island.id !== 'about') {
            const orbitAngle = orbitStore.getAngle();
            const cosA = Math.cos(orbitAngle);
            const sinA = Math.sin(orbitAngle);
            worldX = island.position[0] * cosA + island.position[2] * sinA;
            worldZ = -island.position[0] * sinA + island.position[2] * cosA;
          }
          if (isDesktop) {
            targetPos.current.set(worldX + 5.6, worldY + 9.2, worldZ + 19.5);
            targetLook.current.set(worldX + 5.6, worldY + 1.2, worldZ);
          } else {
            targetPos.current.set(worldX, worldY + 11.0, worldZ + 22.0);
            targetLook.current.set(worldX, worldY - 4.2, worldZ);
          }
        }
      } else if (showHero) {
        if (isDesktop) {
          targetPos.current.set(-7.5, 18.5, 48.0);
          targetLook.current.set(-7.5, 1.6, 0);
        } else {
          targetPos.current.set(0, 20.0, 52.0);
          targetLook.current.set(0, 2.0, 0);
        }
      } else {
        if (isDesktop) {
          targetPos.current.set(0, 18.5, 48.0);
          targetLook.current.set(0, 1.6, 0);
        } else {
          targetPos.current.set(0, 20.0, 52.0);
          targetLook.current.set(0, 1.8, 0);
        }
      }
      state.camera.position.copy(targetPos.current);
      controls.target.copy(targetLook.current);
      controls.update();
      isInitialized.current = true;
      return;
    }

    // Calculate current framing targets for transitions & look-at tracking
    if (activeIsland) {
      const island = ISLANDS.find((i) => i.id === activeIsland);
      if (island) {
        let worldX = island.position[0];
        let worldY = island.position[1];
        let worldZ = island.position[2];

        // Surrounding 10 islands rotate around fixed Home Island [0, 1.8, 0]
        if (island.id !== 'home' && island.id !== 'identity' && island.id !== 'about') {
          const orbitAngle = orbitStore.getAngle();
          const cosA = Math.cos(orbitAngle);
          const sinA = Math.sin(orbitAngle);
          worldX = island.position[0] * cosA + island.position[2] * sinA;
          worldZ = -island.position[0] * sinA + island.position[2] * cosA;
        }

        if (isDesktop) {
          targetPos.current.set(worldX + 5.6, worldY + 9.2, worldZ + 19.5);
          targetLook.current.set(worldX + 5.6, worldY + 1.2, worldZ);
        } else {
          targetPos.current.set(worldX, worldY + 11.0, worldZ + 22.0);
          targetLook.current.set(worldX, worldY - 4.2, worldZ);
        }
      }
    } else if (showHero) {
      if (isDesktop) {
        targetPos.current.set(-7.5, 18.5, 48.0);
        targetLook.current.set(-7.5, 1.6, 0);
      } else {
        targetPos.current.set(0, 20.0, 52.0);
        targetLook.current.set(0, 2.0, 0);
      }
    } else {
      targetLook.current.set(0, 1.6, 0);
    }

    // If transitioning between overview and selected island:
    if (isTransitioning.current) {
      transitionTimer.current += delta;
      state.camera.position.lerp(targetPos.current, delta * 3.8);
      controls.target.lerp(targetLook.current, delta * 4.2);
      controls.update();

      if (
        state.camera.position.distanceTo(targetPos.current) < 0.25 ||
        transitionTimer.current > 1.4
      ) {
        isTransitioning.current = false;
      }
      return;
    }

    // Normal interactive mode:
    // Update target center smoothly
    controls.target.lerp(targetLook.current, delta * 3.5);

    // In overview mode, apply zoom scaling while strictly preserving the viewer's adjusted X and Y angles
    if (!activeIsland) {
      const offset = state.camera.position.clone().sub(controls.target);
      const currentDist = offset.length();
      if (currentDist > 0.001) {
        const newDist = THREE.MathUtils.damp(currentDist, targetZoom, 5.0, delta);
        offset.setLength(newDist);
        state.camera.position.copy(controls.target).add(offset);
      }
    }

    // Allow viewer to adjust X and Y axis camera angles via OrbitControls mouse & touch drag
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={true}
      rotateSpeed={0.8}
      enablePan={true}
      panSpeed={0.7}
      enableZoom={activeIsland !== null}
      minDistance={12}
      maxDistance={120}
      minPolarAngle={Math.PI / 12} // Allows looking from high overhead (X-axis elevation ~15 deg)
      maxPolarAngle={Math.PI / 2 + 0.04} // Prevents dipping below low cloud sea
      enableDamping={true}
      dampingFactor={0.06}
    />
  );
};
