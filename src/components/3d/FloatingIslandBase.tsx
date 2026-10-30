import React, { useMemo, useRef } from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingIslandBaseProps {
  position: [number, number, number];
  radius?: number;
  height?: number;
  accentColor?: string;
  isActive?: boolean;
  isHovered?: boolean;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: () => void;
  children?: React.ReactNode;
  hasWaterfalls?: boolean;
  waterfallPositions?: Array<[number, number, number, number]>; // [x, y, z, rotationY]
  palmCount?: number;
  cloudPlacement?: 'bottomWaterfalls' | 'keel';
}

// Reusable Tropical Palm Tree
export const TropicalPalm: React.FC<{
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}> = ({ position, scale = 1, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Curved Palm Trunk Segments */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.8, 7]} />
        <meshStandardMaterial color="#6b4423" roughness={0.9} />
      </mesh>
      <mesh position={[0.08, 1.1, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.055, 0.07, 0.8, 7]} />
        <meshStandardMaterial color="#573418" roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 1.75, 0]} rotation={[0, 0, -0.25]} castShadow>
        <cylinderGeometry args={[0.04, 0.055, 0.7, 7]} />
        <meshStandardMaterial color="#4a2c13" roughness={0.9} />
      </mesh>

      {/* Palm Fronds Crown */}
      <group position={[0.3, 2.05, 0]}>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={i} rotation={[0, rad, 0]}>
              <mesh position={[0.45, 0.05, 0]} rotation={[0, 0, -0.45]} castShadow>
                <boxGeometry args={[0.9, 0.02, 0.22]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#15803d' : '#22c55e'} roughness={0.6} />
              </mesh>
              <mesh position={[0.85, -0.2, 0]} rotation={[0, 0, -0.75]} castShadow>
                <boxGeometry args={[0.6, 0.015, 0.16]} />
                <meshStandardMaterial color="#16a34a" roughness={0.6} />
              </mesh>
            </group>
          );
        })}
        {/* Coconut Cluster */}
        <mesh position={[0, -0.05, 0.04]} castShadow>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#3e2310" roughness={0.9} />
        </mesh>
        <mesh position={[-0.04, -0.05, -0.03]} castShadow>
          <sphereGeometry args={[0.055, 6, 6]} />
          <meshStandardMaterial color="#3e2310" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// Reusable Waterfall Stream Component with smooth rendering and depthWrite: false
const WaterfallStream: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  height?: number;
  width?: number;
}> = ({ position, rotationY = 0, height = 5.5, width = 0.9 }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const foamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle rhythmic shimmer
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.78 + Math.sin(state.clock.elapsedTime * 6) * 0.08;
    }
    if (foamRef.current) {
      foamRef.current.rotation.y += 0.03;
      foamRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.12);
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Crest Foam Lip */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[width * 1.15, 0.12, 0.25]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Main Falling Water Stream */}
      <mesh ref={waterRef} position={[0, -height / 2, 0.08]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.82}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cascading White Foam Strands */}
      <mesh position={[0, -height / 2, 0.09]}>
        <planeGeometry args={[width * 0.7, height]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e0f2fe"
          emissiveIntensity={0.8}
          roughness={0.3}
          transparent
          opacity={0.55}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom Mist & Cloud Spray Cloudlet */}
      <mesh ref={foamRef} position={[0, -height, 0.15]}>
        <sphereGeometry args={[width * 0.75, 12, 10]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#bae6fd"
          emissiveIntensity={0.5}
          roughness={0.9}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export const FloatingIslandBase: React.FC<FloatingIslandBaseProps> = ({
  position,
  radius = 3.8,
  height = 1.3,
  accentColor = '#38bdf8',
  isActive = false,
  isHovered = false,
  onClick,
  onPointerOver,
  onPointerOut,
  children,
  hasWaterfalls = false,
  waterfallPositions = [],
  palmCount = 4,
  cloudPlacement = 'keel',
}) => {
  const rockKeelDepth = radius * 1.35;
  const cloudSkirtRef = useRef<THREE.Group>(null);
  const hoverFactor = useRef<number>(0);

  // Check if clouds should be placed at the bottom layer of waterfalls (for Home Island)
  const isBottomWaterfalls = cloudPlacement === 'bottomWaterfalls' || (hasWaterfalls && radius > 4.5);

  // Organic mist puffs data with varied radii, heights, and autonomous drifting parameters
  const mistPuffs = useMemo(() => {
    const puffs: Array<{
      basePos: [number, number, number];
      scale: [number, number, number];
      rot: [number, number, number];
      phase: number;
      speed: number;
      driftRadius: number;
    }> = [];
    const count = isBottomWaterfalls
      ? Math.max(16, Math.floor(radius * 3.0))
      : Math.max(12, Math.floor(radius * 2.8));

    for (let i = 0; i < count; i++) {
      // Natural organic angular distribution with irregular offsets
      const angle = (i / count) * Math.PI * 2 + ((i * 17) % 7) * 0.16;

      let r: number;
      let y: number;
      let sx: number;
      let sy: number;
      let sz: number;

      if (isBottomWaterfalls) {
        // Home Island: clouds appear at the bottom layer of the waterfalls where the cascades plunge
        r = radius * (0.82 + ((i * 7) % 5) * 0.14 + Math.sin(i * 2.3) * 0.12);
        y = -rockKeelDepth * (0.94 + ((i * 3) % 4) * 0.08); // Right at the waterfall termination layer
        sx = radius * (0.82 + ((i * 3) % 4) * 0.14);
        sy = radius * (0.34 + ((i * 2) % 3) * 0.08); // Deep, billowy, solid cloud volume
        sz = radius * (0.82 + ((i * 5) % 4) * 0.14);
      } else {
        // All surrounding islands: clouds positioned at the bottom part cradling the rocky keel tip
        r = radius * (0.58 + ((i * 7) % 5) * 0.12 + Math.sin(i * 2.3) * 0.10);
        y = -rockKeelDepth * (0.84 + ((i * 3) % 4) * 0.06); // At the bottom part of the island keel
        sx = radius * (0.72 + ((i * 3) % 4) * 0.12);
        sy = radius * (0.28 + ((i * 2) % 3) * 0.06); // Thick, fluffy cloud puffs cradling the underside
        sz = radius * (0.72 + ((i * 5) % 4) * 0.12);
      }

      puffs.push({
        basePos: [x(angle, r), y, z(angle, r)],
        scale: [sx, sy, sz],
        rot: [0.08 * Math.sin(i), (i * Math.PI) / 3.2, 0.08 * Math.cos(i)],
        phase: (i * 1.414) % (Math.PI * 2),
        speed: 0.35 + (i % 3) * 0.15,
        driftRadius: 0.14 + (i % 4) * 0.08,
      });
    }
    return puffs;

    function x(ang: number, rad: number) {
      return Math.cos(ang) * rad;
    }
    function z(ang: number, rad: number) {
      return Math.sin(ang) * rad;
    }
  }, [radius, height, rockKeelDepth, isBottomWaterfalls]);

  // Continuous autonomous mist movement: auto-rotates in circular track,
  // positions NEVER change or displace when hovered (free natural movement)
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (cloudSkirtRef.current) {
      // Auto-move in island circular track continuously
      cloudSkirtRef.current.rotation.y += delta * 0.055;
      cloudSkirtRef.current.scale.set(1.0, 1.0, 1.0); // Never displace or scale on hover

      // Each cloud puff moves freely in 3D with its own autonomous wave frequencies
      // Reduced transparency (solid ~0.95 opacity) for thick, visible fluffy cloud shapes
      cloudSkirtRef.current.children.forEach((child: any, idx) => {
        const puff = mistPuffs[idx];
        if (puff && child.isMesh) {
          child.position.x = puff.basePos[0] + Math.sin(time * puff.speed + puff.phase) * puff.driftRadius;
          child.position.y = puff.basePos[1] + Math.cos(time * (puff.speed * 0.8) + puff.phase) * (puff.driftRadius * 0.5);
          child.position.z = puff.basePos[2] + Math.sin(time * (puff.speed * 0.6) + puff.phase * 1.7) * puff.driftRadius;

          if (child.material) {
            child.material.opacity = Math.min(0.98, Math.max(0.92, 0.95 + Math.sin(time * 0.4 + puff.phase) * 0.03));
          }
        }
      });
    }
  });

  // Procedural rock crag spurs for a realistic craggy underside
  const rockSpurs = useMemo(() => {
    const spurs: Array<{
      pos: [number, number, number];
      scale: [number, number, number];
      rot: [number, number, number];
    }> = [];
    const count = Math.max(7, Math.floor(radius * 2.2));
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i % 2 === 0 ? 0.2 : -0.15);
      const r = radius * (0.45 + (i % 3) * 0.16);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = -height * 0.4 - (i % 4) * (rockKeelDepth * 0.18);
      const sy = rockKeelDepth * (0.45 + ((i * 7) % 5) * 0.12);
      const sx = radius * (0.28 + ((i * 3) % 4) * 0.08);
      const sz = radius * (0.28 + ((i * 5) % 4) * 0.08);
      spurs.push({
        pos: [x, y, z],
        scale: [sx, sy, sz],
        rot: [0.1 * Math.sin(i), (i * Math.PI) / 3, 0.1 * Math.cos(i)],
      });
    }
    return spurs;
  }, [radius, height, rockKeelDepth]);

  // Perimeter rocks & terrain detail along the island edge
  const edgeRocks = useMemo(() => {
    const rocks: Array<{
      pos: [number, number, number];
      scale: [number, number, number];
      rot: [number, number, number];
    }> = [];
    const count = Math.max(6, Math.floor(radius * 2.0));
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + ((i * 13) % 7) * 0.1;
      const r = radius * (0.88 + ((i * 5) % 4) * 0.04);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = height * 0.45;
      const s = 0.25 + ((i * 3) % 5) * 0.08;
      rocks.push({
        pos: [x, y, z],
        scale: [s * 1.3, s * 0.85, s],
        rot: [0.2, (i * Math.PI) / 4, 0.1],
      });
    }
    return rocks;
  }, [radius, height]);

  // Palm positions along the island perimeter
  const palms = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      scale: number;
      rot: [number, number, number];
    }> = [];
    for (let i = 0; i < palmCount; i++) {
      const angle = (i / palmCount) * Math.PI * 2 + ((i * 17) % 5) * 0.3;
      const r = radius * (0.65 + ((i * 7) % 3) * 0.09);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const s = 0.75 + ((i * 11) % 4) * 0.15;
      list.push({
        pos: [x, height * 0.5, z],
        scale: s,
        rot: [0, (i * Math.PI) / 2.5, 0],
      });
    }
    return list;
  }, [radius, height, palmCount]);

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.05}
      floatIntensity={0.18}
      position={position}
    >
      <group
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {/* ==================== 1. NATURAL FERTILE GRASSY PLATEAU ==================== */}
        {/* Upper Grassland Surface (Rich Green Lawn with Smooth Emissive Glow on Active/Hover) */}
        <mesh position={[0, height * 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius * 1.05, height * 0.35, 32]} />
          <meshStandardMaterial
            color="#15803d"
            emissive={isActive ? accentColor : isHovered ? accentColor : '#000000'}
            emissiveIntensity={isActive ? 0.32 : isHovered ? 0.18 : 0}
            roughness={0.78}
            metalness={0.04}
          />
        </mesh>

        {/* Organic Rolling Grassy Knolls / Subtle Hills */}
        <mesh position={[-radius * 0.32, height * 0.65, -radius * 0.28]} castShadow receiveShadow>
          <sphereGeometry args={[radius * 0.45, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#16a34a" roughness={0.8} />
        </mesh>
        <mesh position={[radius * 0.35, height * 0.6, radius * 0.25]} castShadow receiveShadow>
          <sphereGeometry args={[radius * 0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#14532d" roughness={0.85} />
        </mesh>
        <mesh position={[radius * 0.05, height * 0.55, -radius * 0.4]} castShadow receiveShadow>
          <sphereGeometry args={[radius * 0.32, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>

        {/* Earth / Dirt Cliff Transition Band */}
        <mesh position={[0, height * 0.15, 0]} castShadow>
          <cylinderGeometry args={[radius * 1.05, radius * 0.98, height * 0.4, 28]} />
          <meshStandardMaterial color="#453229" roughness={0.95} />
        </mesh>

        {/* Natural Coastline Perimeter Boulders */}
        {edgeRocks.map((rock, idx) => (
          <mesh
            key={`edge-rock-${idx}`}
            position={rock.pos}
            scale={rock.scale}
            rotation={rock.rot}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#334155' : '#475569'} roughness={0.9} />
          </mesh>
        ))}

        {/* Tropical Palm Trees along the Island Border */}
        {palms.map((palm, idx) => (
          <TropicalPalm
            key={`island-palm-${idx}`}
            position={palm.pos}
            scale={palm.scale}
            rotation={palm.rot}
          />
        ))}

        {/* ==================== 2. CRAGGY ROCKY KEEL & CLIFF UNDERSIDE ==================== */}
        {/* Main Upper Rocky Cliff Facet */}
        <mesh position={[0, -height * 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[radius * 0.98, radius * 0.82, height * 0.8, 18]} />
          <meshStandardMaterial color="#24283b" roughness={0.92} metalness={0.1} />
        </mesh>

        {/* Stratified Craggy Rock Underbelly Conical Keel */}
        <mesh position={[0, -rockKeelDepth * 0.45, 0]} castShadow>
          <coneGeometry args={[radius * 0.84, rockKeelDepth * 0.85, 12]} />
          <meshStandardMaterial color="#1e202e" roughness={0.95} metalness={0.08} />
        </mesh>

        {/* Organic Hanging Rock Crag Spurs (Stalactite rock roots) */}
        {rockSpurs.map((spur, idx) => (
          <mesh
            key={`spur-${idx}`}
            position={spur.pos}
            scale={spur.scale}
            rotation={spur.rot}
            castShadow
          >
            <coneGeometry args={[0.45, 1.2, 7]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#1e2235' : '#282d42'}
              roughness={0.94}
            />
          </mesh>
        ))}

        {/* Bottom Floating Island Keel Tip (Crystalline Root) */}
        <mesh position={[0, -rockKeelDepth * 0.92, 0]}>
          <octahedronGeometry args={[radius * 0.16, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* ==================== 3. ANIMATED WATERFALLS ==================== */}
        {hasWaterfalls &&
          waterfallPositions.map(([wx, wy, wz, wrot], idx) => (
            <WaterfallStream
              key={`wf-${idx}`}
              position={[wx, wy, wz]}
              rotationY={wrot}
              height={rockKeelDepth * 1.05}
              width={radius * 0.35}
            />
          ))}

        {/* ==================== 4. AMBIENT NATURAL DRIFTING MIST ==================== */}
        {/* Continuous organic stratified cloud wisps moving freely on their own, unaffected by hover */}
        {/* Reduced transparency (~0.95 opacity) for thick, fluffy, realistic white clouds */}
        <group ref={cloudSkirtRef} position={[0, 0, 0]}>
          {mistPuffs.map((puff, idx) => (
            <mesh
              key={`mist-puff-${idx}`}
              position={puff.basePos}
              scale={puff.scale}
              rotation={puff.rot}
            >
              <sphereGeometry args={[1, 20, 14]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.92}
                metalness={0.0}
                transparent
                opacity={0.95}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>

        {/* Island Specific Content & Structures */}
        <group position={[0, height * 0.5, 0]}>{children}</group>
      </group>
    </Float>
  );
};
