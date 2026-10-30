import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { IslandId } from '../../types';
import { islandNames } from '../../types';
import { ISLANDS } from '../../data/islands';
import { FloatingIslandBase } from './FloatingIslandBase';
import { orbitStore } from '../../hooks/useOrbitState';

interface ArchipelagoProps {
  activeIsland: IslandId | null;
  onSelectIsland: (id: IslandId) => void;
  isIncidentActive: boolean;
  isResolved: boolean;
  onHoverIsland?: (id: IslandId | null) => void;
  showLabels?: boolean;
  onDiscoverEasterEgg?: () => void;
}

interface Island3DLabelProps {
  label: string;
  sublabel?: string;
  icon?: string;
  isActive: boolean;
  isHovered: boolean;
  isHomeIsland?: boolean;
  position?: [number, number, number];
  color?: string;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  occludeRef?: React.RefObject<THREE.Group | null>;
}

const Island3DLabel: React.FC<Island3DLabelProps> = ({
  label,
  sublabel,
  icon,
  isActive,
  isHovered,
  isHomeIsland = false,
  position = [0, 0.4, 2.8],
  onClick,
  onPointerOver,
  onPointerOut,
  occludeRef,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isRaycastOccluded, setIsRaycastOccluded] = useState<boolean>(false);
  const [isBehindHomeOccluded, setIsBehindHomeOccluded] = useState<boolean>(false);

  // Reusable vectors for performance (avoiding GC in 60fps loop)
  const vCamRight = useRef(new THREE.Vector3());
  const vCamDir = useRef(new THREE.Vector3());
  const vCamUp = useRef(new THREE.Vector3());
  const vTargetWorld = useRef(new THREE.Vector3());
  const homeCenter = useRef(new THREE.Vector3(0, 1.8, 0));
  const vHomeNdc = useRef(new THREE.Vector3());
  const vLabelNdc = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (!groupRef.current || !groupRef.current.parent) return;

    // 1. DYNAMIC CAMERA-RELATIVE POSITIONING
    // Calculate camera-horizontal right & forward vectors
    camera.matrixWorld.extractBasis(vCamRight.current, vCamUp.current, vCamDir.current);
    vCamRight.current.y = 0;
    vCamRight.current.normalize();

    camera.getWorldDirection(vCamDir.current);
    vCamDir.current.y = 0;
    vCamDir.current.normalize();

    // Island origin in world space
    const islandWorldPos = new THREE.Vector3();
    groupRef.current.parent.getWorldPosition(islandWorldPos);

    // Determine if this island is located behind Home Island relative to the camera
    const distToCam = camera.position.distanceTo(islandWorldPos);
    const homeDistToCam = camera.position.distanceTo(homeCenter.current);
    const isBehindHome = !isHomeIsland && distToCam > homeDistToCam + 1.6;

    // Offsets from island center:
    // When an island is clicked, its label sits behind the island on its back side as an elevated backdrop.
    // In overview mode, islands behind Home Island have their labels on their outer flank and properly occluded behind Home Island's 3D structures.
    let leftDist: number;
    let frontDist: number;
    let heightDist: number;

    if (isActive) {
      // User request: "once click on the island, that islands label need to be show behind the island in back side of the island"
      leftDist = isHomeIsland ? 1.6 : 0.0;
      frontDist = isHomeIsland ? -3.2 : -2.2; // Positioned on the back side behind the island's structures
      heightDist = isHomeIsland ? 3.8 : 2.6; // Elevated backdrop hovering over the back rim
    } else if (isHomeIsland) {
      leftDist = 5.6;
      frontDist = 1.0;
      heightDist = 0.8;
    } else if (isBehindHome) {
      // Background island: determine outer flank relative to Home Island
      const lateralFromHome = islandWorldPos.clone().sub(homeCenter.current).dot(vCamRight.current);
      // If to the right of Home Island, offset to the right flank (negative leftDist)
      // If to the left of Home Island, offset to the left flank (positive leftDist)
      const flankDirection = lateralFromHome >= 0 ? -1 : 1;
      leftDist = flankDirection * 3.8;
      frontDist = -0.2; // backward in depth
      heightDist = 2.4; // elevated in the open sky
    } else {
      // Foreground / side islands
      leftDist = 3.8;
      frontDist = 0.6;
      heightDist = 0.8;
    }

    // Compute desired world position towards camera-relative position
    vTargetWorld.current.copy(islandWorldPos)
      .addScaledVector(vCamRight.current, -leftDist) // horizontal offset
      .addScaledVector(vCamDir.current, -frontDist);  // depth offset (negative = behind island)
    vTargetWorld.current.y = islandWorldPos.y + heightDist;

    // Convert into parent island group's local coordinate space
    const localTarget = groupRef.current.parent.worldToLocal(vTargetWorld.current.clone());
    groupRef.current.position.lerp(localTarget, 0.25);

    // 2. MATHEMATICAL OCCLUSION DETECTION BEHIND HOME ISLAND & LOTUS TOWER:
    // User request: "when island behind the home island, that behind island's label also appear behind the 3d objects in the home island"
    if (!isHomeIsland && isBehindHome && !isActive) {
      vHomeNdc.current.copy(homeCenter.current).project(camera);
      vLabelNdc.current.copy(vTargetWorld.current).project(camera);

      // Home Island and Lotus Tower project to a central silhouette in screen space
      const screenDistX = Math.abs(vLabelNdc.current.x - vHomeNdc.current.x);
      const isBehindSilhouette =
        screenDistX < 0.24 &&
        vLabelNdc.current.y <= vHomeNdc.current.y + 0.38 &&
        vLabelNdc.current.y >= vHomeNdc.current.y - 0.28;

      if (isBehindSilhouette !== isBehindHomeOccluded) {
        setIsBehindHomeOccluded(isBehindSilhouette);
      }
    } else if (isBehindHomeOccluded) {
      setIsBehindHomeOccluded(false);
    }
  });

  const isHighlighted = isActive || isHovered;
  const isOccluded = isRaycastOccluded || isBehindHomeOccluded;

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        distanceFactor={isActive ? 30 : 38}
        zIndexRange={[10, 1]}
        occlude={isHomeIsland || !occludeRef ? undefined : [occludeRef as any]}
        onOcclude={setIsRaycastOccluded}
      >
        <button
          onClick={onClick}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          className={`transition-all duration-300 select-none whitespace-nowrap text-center cursor-pointer rounded-lg border shadow-lg backdrop-blur-sm ${
            isOccluded
              ? 'opacity-0 pointer-events-none scale-75'
              : 'opacity-100 pointer-events-auto scale-100'
          } ${
            isActive
              ? 'px-3 py-1.5 bg-slate-950/95 border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-105'
              : isHovered
              ? 'px-2.5 py-1 bg-slate-950/95 border-sky-300 text-white shadow-[0_0_16px_rgba(56,189,248,0.6)] scale-105'
              : 'px-2 py-0.5 bg-slate-950/85 border-sky-400/30 text-slate-200 hover:border-sky-300 hover:text-white'
          }`}
          title={`Explore ${label}`}
        >
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold font-display tracking-tight leading-snug">
            {icon && <span className="text-xs leading-none">{icon}</span>}
            <span>{label}</span>
          </div>
          {sublabel && (
            <div className="text-[8px] font-mono text-sky-300/90 font-medium leading-none mt-0.5">
              {sublabel}
            </div>
          )}
        </button>
      </Html>
    </group>
  );
};

export const SriLankanArchipelago: React.FC<ArchipelagoProps> = ({
  activeIsland,
  onSelectIsland,
  isIncidentActive,
  isResolved,
  onHoverIsland,
  showLabels = true,
  onDiscoverEasterEgg,
}) => {
  const [hoveredIsland, setHoveredIsland] = useState<IslandId | null>(null);

  // Rotating animation refs
  const homeGroupRef = useRef<THREE.Group>(null);
  const lotusSpireGlowRef = useRef<THREE.Mesh>(null);
  const openSourceGlobeRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);
  const satelliteDishRef = useRef<THREE.Group>(null);
  const leadershipHoloRef = useRef<THREE.Group>(null);

  const orbitGroupRef = useRef<THREE.Group>(null);
  const autoCloudTrackRef = useRef<THREE.Group>(null);
  const currentOrbitAngle = useRef<number>(orbitStore.getAngle());
  const [isHomeMounted, setIsHomeMounted] = useState<boolean>(false);

  useEffect(() => {
    if (homeGroupRef.current) {
      setIsHomeMounted(true);
    }
  }, []);

  useFrame((_, delta) => {
    // 1. Home Island self-rotation: slowly revolves around its own vertical axis
    if (homeGroupRef.current) {
      homeGroupRef.current.rotation.y += delta * 0.022;
    }

    // 2. All surrounding islands move in a circle around Home Island
    // Continuously rotate when in overview mode and not hovering an island
    if (!activeIsland && !hoveredIsland) {
      orbitStore.setTargetAngle(orbitStore.getTargetAngle() + delta * 0.035);
    }

    // Smooth damping for orbital surrounding island rotation
    const target = orbitStore.getTargetAngle();
    currentOrbitAngle.current = THREE.MathUtils.damp(currentOrbitAngle.current, target, 5.0, delta);
    orbitStore.setAngle(currentOrbitAngle.current);
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = currentOrbitAngle.current;
    }
    // Auto-move clouds along the island circular track
    if (autoCloudTrackRef.current) {
      autoCloudTrackRef.current.rotation.y += delta * 0.045;
    }
    if (lotusSpireGlowRef.current) {
      lotusSpireGlowRef.current.rotation.y += delta * 1.2;
    }
    if (openSourceGlobeRef.current) {
      openSourceGlobeRef.current.rotation.y += delta * 0.7;
    }
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 0.6;
    }
    if (satelliteDishRef.current) {
      satelliteDishRef.current.rotation.y += delta * 0.45;
    }
    if (leadershipHoloRef.current) {
      leadershipHoloRef.current.rotation.y += delta * 0.8;
      leadershipHoloRef.current.rotation.x += delta * 0.3;
    }
  });

  const handlePointerOver = (id: IslandId, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setHoveredIsland(id);
    if (onHoverIsland) onHoverIsland(id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredIsland(null);
    if (onHoverIsland) onHoverIsland(null);
    document.body.style.cursor = 'default';
  };

  const getIsland = (id: IslandId) => ISLANDS.find((i) => i.id === id) || ISLANDS[0];

  // Helper to determine if an island label should be rendered:
  // - When all modals/popups are closed and in overview: all island labels are shown.
  // - When an island is clicked: ONLY that island's label is displayed (positioned behind the island).
  const shouldShowLabel = (id: IslandId) => {
    if (!showLabels) return false;
    if (!activeIsland) return true;
    if (id === 'home') {
      return activeIsland === 'home' || activeIsland === 'identity' || activeIsland === 'about';
    }
    return activeIsland === id;
  };

  return (
    <group>
      {/* =========================================================================
          1. CENTRAL ISLAND: HOME ISLAND (Colombo, Sri Lanka)
          Features: Colombo Lotus Tower, Modern City Skyline, Central Lagoon,
          Cascading Waterfalls, Tropical Palms, Waterfront Promenade
          Self-rotating slowly around its own central Y-axis
          ========================================================================= */}
      <group ref={homeGroupRef} position={getIsland('home').position}>
        <FloatingIslandBase
          position={[0, 0, 0]}
          radius={5.6}
          height={1.5}
          accentColor="#38bdf8"
          cloudPlacement="bottomWaterfalls"
          isActive={activeIsland === 'home' || activeIsland === 'identity' || activeIsland === 'about'}
        isHovered={hoveredIsland === 'home' || hoveredIsland === 'identity'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('home');
        }}
        onPointerOver={(e) => handlePointerOver('home', e)}
        onPointerOut={handlePointerOut}
        hasWaterfalls={true}
        waterfallPositions={[
          [0, 0, 5.2, 0],             // Southern main waterfall
          [4.6, 0, 1.8, Math.PI / 3],  // Eastern secondary waterfall
          [-4.6, 0, 1.8, -Math.PI / 3],// Western secondary waterfall
          [0, 0, -5.2, Math.PI],       // Northern cliff cascade
        ]}
        palmCount={6}
      >
        {/* ==================== CENTRAL TURQUOISE LAGOON / WATER ==================== */}
        <mesh position={[0, 0.05, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0, 3.2, 32]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={0.35}
            roughness={0.1}
            metalness={0.6}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Curved Waterfront Sand Promenade Rim */}
        <mesh position={[0, 0.06, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.15, 3.5, 32]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>

        {/* ==================== COLOMBO LOTUS TOWER (CENTRAL MONUMENT) ==================== */}
        <group position={[0, 0.1, -1.2]}>
          {/* Flared Pedestal Base (Lotus Base) */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 1.1, 0.7, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Slender Fluted Stem/Shaft (Cyan-Green Tower Body) */}
          <mesh position={[0, 2.7, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.38, 4.0, 24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.5} />
          </mesh>
          {/* Shaft Structural Rings */}
          {[1.2, 2.0, 2.8, 3.6, 4.4].map((y, i) => (
            <mesh key={`lotus-ring-${i}`} position={[0, y, 0]}>
              <torusGeometry args={[0.26 + (5.0 - y) * 0.02, 0.03, 8, 24]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
            </mesh>
          ))}

          {/* Green Lotus Calyx / Leaf Base beneath Petals */}
          <mesh position={[0, 4.85, 0]} castShadow>
            <cylinderGeometry args={[0.85, 0.3, 0.45, 24]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>

          {/* Iconic Multi-Tier Lotus Bud Observation Pod (Magenta / Crimson Petals) */}
          <mesh position={[0, 5.45, 0]} castShadow>
            <sphereGeometry args={[1.05, 24, 20, 0, Math.PI * 2, 0, Math.PI / 1.4]} />
            <meshStandardMaterial
              color="#e11d48"
              emissive="#be123c"
              emissiveIntensity={0.8}
              roughness={0.25}
              metalness={0.35}
            />
          </mesh>

          {/* Observation Deck Promenade Ring */}
          <mesh position={[0, 5.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.06, 1.18, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
          </mesh>

          {/* Upper Telecommunications Needle Spire Mast */}
          <mesh position={[0, 6.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.12, 1.8, 14]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh ref={lotusSpireGlowRef} position={[0, 7.6, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={2.4} />
          </mesh>
          <pointLight position={[0, 7.65, 0]} color="#38bdf8" intensity={2.5} distance={8} />
        </group>

        {/* ==================== COLOMBO MODERN CITY SKYLINE ==================== */}
        {/* Western Modern High-Rise Tower 1 */}
        <group position={[-1.8, 0.1, -1.8]}>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 2.8, 1.0]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.15} />
          </mesh>
          {[-0.8, -0.3, 0.2, 0.7, 1.2].map((y, idx) => (
            <mesh key={`win-w1-${idx}`} position={[0, y + 0.8, 0.51]}>
              <planeGeometry args={[0.85, 0.12]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
            </mesh>
          ))}
          {/* Rooftop Helipad */}
          <mesh position={[0, 2.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.42, 16]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Eastern Curved Glass Skyline Tower 2 */}
        <group position={[1.9, 0.1, -1.8]}>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.7, 3.2, 20]} />
            <meshStandardMaterial color="#0369a1" metalness={0.8} roughness={0.2} />
          </mesh>
          {[-1.0, -0.4, 0.2, 0.8, 1.4].map((y, idx) => (
            <mesh key={`win-e1-${idx}`} position={[0, y + 0.8, 0]}>
              <torusGeometry args={[0.58 + (2.0 - y) * 0.02, 0.025, 6, 20]} />
              <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>

        {/* Mid-Rise Colombo Tech Hub 3 */}
        <group position={[-2.8, 0.1, -0.5]}>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 1.8, 0.9]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.82, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.6]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
          </mesh>
        </group>

        {/* Mid-Rise Colombo Waterfront Tower 4 */}
        <group position={[2.8, 0.1, -0.5]}>
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 2.0, 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
          </mesh>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('home') && (
          <Island3DLabel
            label={islandNames.home}
            sublabel="Colombo, Sri Lanka"
            icon="🏠"
            isActive={activeIsland === 'home' || activeIsland === 'identity' || activeIsland === 'about'}
            isHovered={hoveredIsland === 'home' || hoveredIsland === 'identity'}
            isHomeIsland={true}
            position={[0, 0.4, 4.4]}
            onClick={() => onSelectIsland('home')}
            onPointerOver={() => handlePointerOver('home')}
            onPointerOut={handlePointerOut}
          />
        )}
      </FloatingIslandBase>
    </group>

      {/* Auto-Drifting Fluffy Cloud Ring along the Circular Island Track */}
      <group ref={autoCloudTrackRef}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const angle = (idx / 8) * Math.PI * 2;
          const r = 21.0 + (idx % 2 === 0 ? 1.6 : -1.4);
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const y = -3.6 + (idx % 3) * 0.35;
          return (
            <mesh key={`auto-track-cloud-${idx}`} position={[x, y, z]} scale={[4.2, 1.4, 4.2]}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.92}
                metalness={0.0}
                transparent
                opacity={0.96}
                depthWrite={false}
              />
            </mesh>
          );
        })}
      </group>

      {/* Orbital Rotating Group for Surrounding 10 Islands around Fixed Home Island */}
      <group ref={orbitGroupRef}>

      {/* =========================================================================
          2. UPPER LEFT: PROJECTS ISLAND
          Features: Large Glowing Laptop with IDE Screen & Cloud Network, Construction Crane,
          Code Terminal, Development Tech Crates, Tropical Palms
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('projects').position}
        radius={3.6}
        height={1.3}
        accentColor="#ff9900"
        isActive={activeIsland === 'projects'}
        isHovered={hoveredIsland === 'projects'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('projects');
        }}
        onPointerOver={(e) => handlePointerOver('projects', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        {/* Large Glowing Modern Laptop */}
        <group position={[0, 0.1, -0.2]} scale={[1.4, 1.4, 1.4]}>
          {/* Laptop Base (Metallic Keyboard Deck) */}
          <mesh position={[0, 0.05, 0.55]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.08, 1.3]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Keyboard Inset Deck */}
          <mesh position={[0, 0.1, 0.45]}>
            <boxGeometry args={[1.65, 0.02, 0.75]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Key Rows Illumination */}
          {[-0.2, -0.07, 0.06, 0.19].map((z, rowIdx) => (
            <mesh key={`key-row-${rowIdx}`} position={[0, 0.115, 0.45 + z]}>
              <boxGeometry args={[1.55, 0.015, 0.09]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
            </mesh>
          ))}
          {/* Trackpad */}
          <mesh position={[0, 0.1, 0.98]}>
            <boxGeometry args={[0.65, 0.015, 0.32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Laptop Screen Display (Angled ~115 degrees) */}
          <group position={[0, 0.09, -0.1]} rotation={[-0.42, 0, 0]}>
            {/* Display Lid Bezel */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[1.9, 1.3, 0.06]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Illuminated High-Res Screen */}
            <mesh position={[0, 0.65, 0.035]}>
              <planeGeometry args={[1.76, 1.16]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={0.95}
                roughness={0.2}
              />
            </mesh>
            {/* Code Syntax Lines on Screen */}
            {[-0.38, -0.22, -0.06, 0.1, 0.26, 0.42].map((y, idx) => (
              <mesh key={`code-line-${idx}`} position={[-0.25, 0.65 + y, 0.038]}>
                <planeGeometry args={[idx % 2 === 0 ? 0.95 : 0.65, 0.06]} />
                <meshStandardMaterial
                  color={idx === 1 ? '#f59e0b' : idx === 3 ? '#10b981' : '#ffffff'}
                  emissive={idx === 1 ? '#f59e0b' : idx === 3 ? '#10b981' : '#ffffff'}
                  emissiveIntensity={1.2}
                />
              </mesh>
            ))}
            {/* Screen Architecture Graph Nodes */}
            <mesh position={[0.5, 0.8, 0.04]}>
              <circleGeometry args={[0.1, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0.5, 0.5, 0.04]}>
              <circleGeometry args={[0.08, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
            </mesh>
          </group>
        </group>

        {/* Development Construction Crane */}
        <group position={[-1.7, 0.1, -1.3]} scale={[0.7, 0.7, 0.7]}>
          {/* Vertical Lattice Mast */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[0.18, 3.6, 0.18]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Horizontal Jib Boom */}
          <mesh position={[0.6, 3.5, 0]} castShadow>
            <boxGeometry args={[2.0, 0.14, 0.14]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Hoist Cable & Hook */}
          <mesh position={[1.4, 2.7, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.6, 6]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('projects') && (
          <Island3DLabel
            label={islandNames.projects}
            sublabel="Verified Software"
            icon="📁"
            isActive={activeIsland === 'projects'}
            isHovered={hoveredIsland === 'projects'}
            position={[0, 0.2, 3.6]}
            onClick={() => onSelectIsland('projects')}
            onPointerOver={() => handlePointerOver('projects')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          3. UPPER MIDDLE-LEFT: SKILLS ISLAND
          Features: AWS Cloud Computing Datacenter, Multi-Tier Server Racks with LEDs,
          Floating Illuminated 3D AWS Cloud Logo, Glass Server Pavilion
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('skills').position}
        radius={3.5}
        height={1.3}
        accentColor="#06b6d4"
        isActive={activeIsland === 'skills'}
        isHovered={hoveredIsland === 'skills'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('skills');
        }}
        onPointerOver={(e) => handlePointerOver('skills', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        {/* Modern Glass Datacenter Pavilion Base */}
        <mesh position={[0, 0.1, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.2, 2.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* 3 Illuminated Server Rack Cabinets */}
        {[-0.8, 0, 0.8].map((x, idx) => (
          <group key={`rack-${idx}`} position={[x, 0.2, -0.2]}>
            {/* Server Frame */}
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.65, 1.8, 0.7]} />
              <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Glass Front Door */}
            <mesh position={[0, 0.9, 0.36]}>
              <planeGeometry args={[0.58, 1.7]} />
              <meshStandardMaterial color="#0284c7" transparent opacity={0.4} roughness={0.1} />
            </mesh>
            {/* Blinking Blade Indicator LEDs */}
            {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
              <mesh key={`led-${idx}-${i}`} position={[0, 0.9 + y, 0.37]}>
                <boxGeometry args={[0.48, 0.08, 0.02]} />
                <meshStandardMaterial
                  color={i === 1 ? '#f59e0b' : idx === 1 ? '#38bdf8' : '#10b981'}
                  emissive={i === 1 ? '#f59e0b' : idx === 1 ? '#38bdf8' : '#10b981'}
                  emissiveIntensity={1.4}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Floating Illuminated 3D AWS Cloud Logo */}
        <group position={[0, 2.45, -0.2]}>
          {/* Puffy Cloud Geometry */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.55, 16, 14]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.45, -0.1, 0]}>
            <sphereGeometry args={[0.4, 14, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.45, -0.1, 0]}>
            <sphereGeometry args={[0.4, 14, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[1.1, 0.25, 0.45]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>

          {/* Golden "aws" letters emblem on front */}
          <mesh position={[0, 0, 0.52]}>
            <planeGeometry args={[0.65, 0.28]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('skills') && (
          <Island3DLabel
            label={islandNames.skills}
            sublabel="Cloud & DevOps"
            icon="💻"
            isActive={activeIsland === 'skills'}
            isHovered={hoveredIsland === 'skills'}
            position={[0, 0.2, 3.5]}
            onClick={() => onSelectIsland('skills')}
            onPointerOver={() => handlePointerOver('skills')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          4. UPPER MIDDLE-RIGHT: EXPERIENCE ISLAND
          Features: Modern Executive Corporate Boardroom Pavilion, Circular Conference Table,
          Professional Figures in Collaboration, Timeline Milestone Pillars
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('experience').position}
        radius={3.5}
        height={1.3}
        accentColor="#3b82f6"
        isActive={activeIsland === 'experience'}
        isHovered={hoveredIsland === 'experience'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('experience');
        }}
        onPointerOver={(e) => handlePointerOver('experience', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        {/* Executive Conference Pavilion Canopy */}
        <group position={[0, 0.1, -0.2]}>
          {/* Polished Teak / Marble Pavilion Floor */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.9, 2.05, 0.12, 28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Curved Modern Architectural Roof Pillars */}
          {[-1.3, 1.3].map((x, i) => (
            <mesh key={`pillar-${i}`} position={[x, 1.1, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 2.2, 12]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.6} />
            </mesh>
          ))}
          {/* Modern Floating Canopy Ceiling */}
          <mesh position={[0, 2.25, 0]} castShadow>
            <boxGeometry args={[2.9, 0.14, 2.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Large Executive Conference Table */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.12, 24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Table Pedestal */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.45, 0.4, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.7} />
          </mesh>

          {/* Central Holographic Milestone Display on Table */}
          <mesh position={[0, 0.8, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
          </mesh>

          {/* Miniature Executive Figures around the Conference Table */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = Math.cos(rad) * 1.3;
            const z = Math.sin(rad) * 1.3;
            return (
              <group key={`exec-${i}`} position={[x, 0.4, z]}>
                {/* Chair */}
                <mesh position={[0, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.25, 0.4, 0.25]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                {/* Person Torso & Head */}
                <mesh position={[0, 0.55, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.11, 0.35, 8]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#38bdf8' : '#f8fafc'} />
                </mesh>
                <mesh position={[0, 0.82, 0]} castShadow>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color="#fed7aa" />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('experience') && (
          <Island3DLabel
            label={islandNames.experience}
            sublabel="Engineering Roles"
            icon="💼"
            isActive={activeIsland === 'experience'}
            isHovered={hoveredIsland === 'experience'}
            position={[0, 0.2, 3.5]}
            onClick={() => onSelectIsland('experience')}
            onPointerOver={() => handlePointerOver('experience')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          5. UPPER RIGHT: ACHIEVEMENTS ISLAND
          Features: Massive Gleaming Golden Trophy with Twin Handles, Star Finial,
          Tiered Obsidian Pedestal Base, Award Commendation Stands
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('achievements').position}
        radius={3.6}
        height={1.3}
        accentColor="#eab308"
        isActive={activeIsland === 'achievements'}
        isHovered={hoveredIsland === 'achievements'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('achievements');
        }}
        onPointerOver={(e) => handlePointerOver('achievements', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        {/* Tiered Obsidian & Gold Pedestal Base */}
        <group position={[0, 0.1, -0.2]}>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.3, 1.5, 0.4, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.0, 1.2, 0.2, 24]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.15} metalness={0.9} />
          </mesh>

          {/* Massive Golden Trophy (Matching Reference Image) */}
          <group ref={trophyRef} position={[0, 0.55, 0]}>
            {/* Fluted Cup Base & Stem */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.55, 0.5, 18]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.24, 0.4, 18]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* Main Trophy Chalice Cup Body */}
            <mesh position={[0, 1.55, 0]} castShadow>
              <cylinderGeometry args={[0.85, 0.35, 1.3, 24]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={0.25}
                metalness={0.95}
                roughness={0.08}
              />
            </mesh>

            {/* Twin Ornate Curved Handles */}
            {[-1, 1].map((dir, i) => (
              <mesh key={`handle-${i}`} position={[dir * 0.95, 1.55, 0]} rotation={[0, 0, dir * 0.5]}>
                <torusGeometry args={[0.45, 0.08, 12, 20, Math.PI * 1.3]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
              </mesh>
            ))}

            {/* Trophy Top Star Finial */}
            <mesh position={[0, 2.35, 0]}>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#fef08a"
                emissiveIntensity={1.8}
                metalness={0.9}
              />
            </mesh>
          </group>

          {/* Flanking Award Plaques on Pedestals */}
          {[-1.5, 1.5].map((x, i) => (
            <group key={`plaque-${i}`} position={[x, 0.2, 0.6]}>
              <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[0.45, 0.6, 0.1]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.3, 0.06]}>
                <circleGeometry args={[0.14, 16]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('achievements') && (
          <Island3DLabel
            label={islandNames.achievements}
            sublabel="Awards & Honors"
            icon="🏆"
            isActive={activeIsland === 'achievements'}
            isHovered={hoveredIsland === 'achievements'}
            position={[0, 0.2, 3.6]}
            onClick={() => onSelectIsland('achievements')}
            onPointerOver={() => handlePointerOver('achievements')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          6. MIDDLE LEFT: LEADERSHIP ISLAND
          Features: Community Keynote Amphitheater, Tiered Seating, Speaker Podium,
          AWS Student Builder Group Presentation Screen, Rotating Community Hologram
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('leadership').position}
        radius={3.6}
        height={1.3}
        accentColor="#f59e0b"
        isActive={activeIsland === 'leadership'}
        isHovered={hoveredIsland === 'leadership'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('leadership');
        }}
        onPointerOver={(e) => handlePointerOver('leadership', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        <group position={[0, 0.1, -0.2]}>
          {/* Keynote Presentation Stage */}
          <mesh position={[0, 0.2, 0.7]} castShadow receiveShadow>
            <cylinderGeometry args={[1.3, 1.45, 0.35, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Keynote Podium */}
          <mesh position={[0, 0.6, 1.1]} castShadow>
            <boxGeometry args={[0.35, 0.6, 0.25]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Central Rotating Community Hologram Sphere */}
          <group ref={leadershipHoloRef} position={[0, 1.1, 0.6]}>
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={1.4}
                wireframe
              />
            </mesh>
            <mesh>
              <ringGeometry args={[0.42, 0.48, 24]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={1.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Semicircular Tiered Amphitheater Seating behind Stage */}
          {[1.6, 2.1, 2.6].map((tierRadius, tierIdx) => (
            <mesh
              key={`tier-${tierIdx}`}
              position={[0, 0.15 + tierIdx * 0.25, -0.3]}
              rotation={[-Math.PI / 2, 0, Math.PI]}
            >
              <ringGeometry args={[tierRadius - 0.25, tierRadius + 0.15, 24, 1, 0, Math.PI]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
          ))}

          {/* AWS Student Builder Group Presentation Screen */}
          <group position={[0, 1.5, -1.8]}>
            <mesh castShadow>
              <boxGeometry args={[2.5, 1.3, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[2.35, 1.15]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={0.85}
              />
            </mesh>
            {/* Screen Banner Details */}
            <mesh position={[0, 0.25, 0.06]}>
              <planeGeometry args={[1.8, 0.2]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} />
            </mesh>
          </group>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('leadership') && (
          <Island3DLabel
            label={islandNames.leadership}
            sublabel="AWS Student Builders"
            icon="👥"
            isActive={activeIsland === 'leadership'}
            isHovered={hoveredIsland === 'leadership'}
            position={[0, 0.2, 3.6]}
            onClick={() => onSelectIsland('leadership')}
            onPointerOver={() => handlePointerOver('leadership')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          7. MIDDLE RIGHT: PUBLICATIONS ISLAND
          Features: Giant Open Research Journal with Scientific Charts, Telemetry Plots,
          Gold-Nibbed Fountain Pen, Research Scrolls, Inkwell
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('publications').position}
        radius={3.5}
        height={1.3}
        accentColor="#6366f1"
        isActive={activeIsland === 'publications'}
        isHovered={hoveredIsland === 'publications'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('publications');
        }}
        onPointerOver={(e) => handlePointerOver('publications', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        {/* Giant Open Hardbound Research Book */}
        <group position={[0, 0.45, -0.2]} rotation={[-0.2, 0, 0]}>
          {/* Leather Book Spine & Cover */}
          <mesh position={[0, -0.06, 0]} castShadow>
            <boxGeometry args={[2.5, 0.12, 1.7]} />
            <meshStandardMaterial color="#312e81" roughness={0.6} />
          </mesh>

          {/* Left Page (Slightly Angled) */}
          <group position={[-0.58, 0.02, 0]} rotation={[0, 0, 0.08]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.08, 1.55]} />
              <meshStandardMaterial color="#fffef9" roughness={0.8} />
            </mesh>
            {/* Scientific Plot Graph on Left Page */}
            <mesh position={[0, 0.05, -0.2]}>
              <planeGeometry args={[0.85, 0.65]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
            </mesh>
            {/* Printed Text Columns */}
            {[-0.3, 0, 0.3].map((z, idx) => (
              <mesh key={`txt-l-${idx}`} position={[0, 0.05, 0.35 + z * 0.4]}>
                <planeGeometry args={[0.85, 0.06]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            ))}
          </group>

          {/* Right Page (Slightly Angled) */}
          <group position={[0.58, 0.02, 0]} rotation={[0, 0, -0.08]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.08, 1.55]} />
              <meshStandardMaterial color="#fffef9" roughness={0.8} />
            </mesh>
            {/* Bar Charts on Right Page */}
            {[ -0.25, -0.05, 0.15, 0.35].map((x, idx) => (
              <mesh key={`bar-${idx}`} position={[x, 0.05, -0.2]}>
                <planeGeometry args={[0.12, 0.2 + idx * 0.12]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
              </mesh>
            ))}
          </group>

          {/* Classic Golden-Nibbed Fountain Pen resting across the right page */}
          <group position={[0.4, 0.15, 0.2]} rotation={[0, 0.4, -0.15]}>
            {/* Pen Barrel */}
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.4, 10]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Golden Trim & Nib */}
            <mesh position={[0, 0.72, 0]}>
              <coneGeometry args={[0.04, 0.14, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        </group>

        {/* Rolled Research Scroll and Inkwell */}
        <group position={[-1.6, 0.1, 0.6]}>
          <mesh rotation={[0, 0.3, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.8, 14]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('publications') && (
          <Island3DLabel
            label={islandNames.publications}
            sublabel="Research Articles"
            icon="📖"
            isActive={activeIsland === 'publications'}
            isHovered={hoveredIsland === 'publications'}
            position={[0, 0.2, 3.5]}
            onClick={() => onSelectIsland('publications')}
            onPointerOver={() => handlePointerOver('publications')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          8. LOWER LEFT: OPEN SOURCE ISLAND
          Features: Circular Glowing GitHub Octocat Neon Portal, Rotating Illuminated Earth Globe,
          Connected Coding Laptops, PR Merge Badges
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('opensource').position}
        radius={3.6}
        height={1.3}
        accentColor="#14b8a6"
        isActive={activeIsland === 'opensource'}
        isHovered={hoveredIsland === 'opensource'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('opensource');
        }}
        onPointerOver={(e) => handlePointerOver('opensource', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        <group position={[0, 0.1, -0.2]}>
          {/* Circular Glowing GitHub Octocat Neon Ring Portal */}
          <group position={[0, 1.4, -0.8]}>
            <mesh>
              <torusGeometry args={[1.3, 0.12, 16, 32]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={1.8}
                metalness={0.8}
              />
            </mesh>
            {/* Center Octocat Head Silhouette Emblem */}
            <mesh position={[0, 0, 0]}>
              <circleGeometry args={[0.75, 24]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
            {/* Stylised Octocat Ears */}
            <mesh position={[-0.4, 0.6, 0.02]} rotation={[0, 0, 0.35]}>
              <coneGeometry args={[0.2, 0.35, 4]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[0.4, 0.6, 0.02]} rotation={[0, 0, -0.35]}>
              <coneGeometry args={[0.2, 0.35, 4]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
            </mesh>
          </group>

          {/* Rotating Holographic Earth Globe in Foreground */}
          <group ref={openSourceGlobeRef} position={[0, 0.9, 0.6]}>
            <mesh castShadow>
              <sphereGeometry args={[0.65, 24, 20]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.65}
                roughness={0.2}
                metalness={0.7}
              />
            </mesh>
            {/* Glowing Wireframe Latitude / Longitude Rings */}
            <mesh>
              <sphereGeometry args={[0.67, 16, 12]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={1.5}
                wireframe
              />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.88, 0.03, 8, 32]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.8} />
            </mesh>
          </group>

          {/* Flanking Coding Terminals */}
          {[-1.3, 1.3].map((x, i) => (
            <mesh key={`term-${i}`} position={[x, 0.25, 0.4]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
              <boxGeometry args={[0.55, 0.4, 0.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
          ))}
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('opensource') && (
          <Island3DLabel
            label={islandNames.opensource}
            sublabel="Global Repos"
            icon="🌐"
            isActive={activeIsland === 'opensource'}
            isHovered={hoveredIsland === 'opensource'}
            position={[0, 0.2, 3.6]}
            onClick={() => onSelectIsland('opensource')}
            onPointerOver={() => handlePointerOver('opensource')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          9. LOWER MIDDLE-LEFT: EDUCATION ISLAND
          Features: Classic University Architecture with Red Terracotta Roof, Clock Tower,
          Colonnaded Archway, Graduation Cap (Mortarboard), Diploma Scrolls
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('education').position}
        radius={3.7}
        height={1.3}
        accentColor="#8b5cf6"
        isActive={activeIsland === 'education'}
        isHovered={hoveredIsland === 'education'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('education');
        }}
        onPointerOver={(e) => handlePointerOver('education', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        <group position={[0, 0.1, -0.4]}>
          {/* Main Classical University Academic Hall */}
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 1.4, 1.2]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.7} />
          </mesh>
          {/* Red Terracotta Hipped Roof */}
          <mesh position={[0, 1.6, 0]} castShadow>
            <coneGeometry args={[1.8, 0.65, 4]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.6} />
          </mesh>

          {/* Central Clock Tower */}
          <group position={[0, 1.6, 0]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[0.8, 1.2, 0.8]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.7} />
            </mesh>
            {/* Tower Pyramid Roof */}
            <mesh position={[0, 1.45, 0]} castShadow>
              <coneGeometry args={[0.6, 0.6, 4]} />
              <meshStandardMaterial color="#991b1b" roughness={0.5} />
            </mesh>
            {/* Clock Face */}
            <mesh position={[0, 0.75, 0.41]}>
              <circleGeometry args={[0.18, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Arched Colonnade Portico on Front */}
          {[-1.0, -0.5, 0, 0.5, 1.0].map((x, idx) => (
            <mesh key={`col-${idx}`} position={[x, 0.5, 0.68]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 1.0, 10]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Prominent Academic Graduation Cap (Mortarboard) in Foreground */}
        <group position={[1.4, 0.35, 1.0]} scale={[1.2, 1.2, 1.2]}>
          {/* Cap Skull Cap */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.3, 0.22, 14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          {/* Diamond Square Mortarboard */}
          <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[0.7, 0.04, 0.7]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          {/* Golden Tassel Button & Cord */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          <mesh position={[0.22, 0.18, 0.15]}>
            <cylinderGeometry args={[0.02, 0.03, 0.25, 6]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('education') && (
          <Island3DLabel
            label={islandNames.education}
            sublabel="University of Jaffna"
            icon="🎓"
            isActive={activeIsland === 'education'}
            isHovered={hoveredIsland === 'education'}
            position={[0, 0.2, 2.9]}
            onClick={() => onSelectIsland('education')}
            onPointerOver={() => handlePointerOver('education')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          10. LOWER MIDDLE-RIGHT: CERTIFICATIONS ISLAND
          Features: Large Golden-Framed AWS Certified Cloud Practitioner Certificate on Easel,
          Gold Wax Seal & Red Ribbon, Stacks of Credential Books
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('certifications').position}
        radius={3.6}
        height={1.3}
        accentColor="#10b981"
        isActive={activeIsland === 'certifications'}
        isHovered={hoveredIsland === 'certifications'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('certifications');
        }}
        onPointerOver={(e) => handlePointerOver('certifications', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        {/* Large Ornate Framed Certificate on Artist Easel (Matching Reference) */}
        <group position={[0, 0.35, -0.2]}>
          {/* Wooden Easel Legs */}
          {[-0.6, 0.6].map((x, i) => (
            <mesh key={`easel-${i}`} position={[x, 0.6, -0.1]} rotation={[0.2, 0, i === 0 ? -0.15 : 0.15]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 0.6, -0.5]} rotation={[-0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>

          {/* Golden Picture Frame */}
          <group position={[0, 0.85, 0.15]} rotation={[-0.15, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.0, 1.45, 0.08]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Inner Parchment Certificate Sheet */}
            <mesh position={[0, 0, 0.045]}>
              <planeGeometry args={[1.78, 1.25]} />
              <meshStandardMaterial color="#fffef9" roughness={0.85} />
            </mesh>
            {/* AWS Logo Header Bar */}
            <mesh position={[0, 0.38, 0.05]}>
              <planeGeometry args={[0.9, 0.18]} />
              <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.6} />
            </mesh>
            {/* Certificate Text Lines */}
            {[-0.15, 0, 0.15].map((y, idx) => (
              <mesh key={`cert-line-${idx}`} position={[0, y, 0.05]}>
                <planeGeometry args={[1.2, 0.05]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))}
            {/* Golden Wax Seal & Red Ribbon */}
            <mesh position={[0.55, -0.38, 0.06]}>
              <circleGeometry args={[0.16, 20]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.55, -0.5, 0.055]} rotation={[0, 0, 0.2]}>
              <planeGeometry args={[0.1, 0.22]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        </group>

        {/* Stacks of Credential Books / Binders */}
        <group position={[-1.4, 0.1, 0.8]}>
          {[0, 0.12, 0.24].map((y, idx) => (
            <mesh key={`book-${idx}`} position={[0, y + 0.06, 0]} rotation={[0, idx * 0.3, 0]} castShadow>
              <boxGeometry args={[0.65, 0.1, 0.85]} />
              <meshStandardMaterial color={idx === 1 ? '#0284c7' : '#10b981'} roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('certifications') && (
          <Island3DLabel
            label={islandNames.certifications}
            sublabel="AWS & Tech Credentials"
            icon="📜"
            isActive={activeIsland === 'certifications'}
            isHovered={hoveredIsland === 'certifications'}
            position={[0, 0.2, 2.9]}
            onClick={() => onSelectIsland('certifications')}
            onPointerOver={() => handlePointerOver('certifications')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>

      {/* =========================================================================
          11. LOWER RIGHT: CONTACT ISLAND
          Features: Large Glowing Blue Digital Envelope Terminal, Radio Lattice Antenna Tower
          with Blinking Red Beacon, Rotating Satellite Dish Scanner
          ========================================================================= */}
      <FloatingIslandBase
        position={getIsland('contact').position}
        radius={3.5}
        height={1.3}
        accentColor="#ec4899"
        isActive={activeIsland === 'contact'}
        isHovered={hoveredIsland === 'contact'}
        onClick={(e) => {
          e.stopPropagation();
          onSelectIsland('contact');
        }}
        onPointerOver={(e) => handlePointerOver('contact', e)}
        onPointerOut={handlePointerOut}
        palmCount={3}
      >
        <group position={[0, 0.2, -0.2]}>
          {/* Large Glowing Digital Postal Envelope (Matching Reference) */}
          <group position={[-0.4, 0.85, 0.2]} rotation={[-0.15, 0.2, 0]}>
            {/* Envelope Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.8, 1.2, 0.12]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* White Postal Flap Outline */}
            <mesh position={[0, 0.1, 0.07]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.75, 0.75, 0.02]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
            </mesh>
          </group>

          {/* Telecommunication Radio Tower */}
          <group position={[1.4, 0, -1.0]}>
            <mesh position={[0, 1.4, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.25, 2.8, 4]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Blinking Red Tower Beacon */}
            <mesh position={[0, 2.85, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
            </mesh>
            <pointLight position={[0, 2.9, 0]} color="#ef4444" intensity={1.5} distance={4} />

            {/* Rotating Satellite Dish Scanner */}
            <group ref={satelliteDishRef} position={[0, 1.8, 0.2]}>
              <mesh rotation={[Math.PI / 3, 0, 0]} castShadow>
                <cylinderGeometry args={[0.35, 0.05, 0.15, 14]} />
                <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.3} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Billboard 3D Label */}
        {shouldShowLabel('contact') && (
          <Island3DLabel
            label={islandNames.contact}
            sublabel="Direct Message & CV"
            icon="✉️"
            isActive={activeIsland === 'contact'}
            isHovered={hoveredIsland === 'contact'}
            position={[0, 0.2, 3.5]}
            onClick={() => onSelectIsland('contact')}
            onPointerOver={() => handlePointerOver('contact')}
            onPointerOut={handlePointerOut}
            occludeRef={isHomeMounted ? homeGroupRef : undefined}
          />
        )}
      </FloatingIslandBase>
      </group>
    </group>
  );
};
