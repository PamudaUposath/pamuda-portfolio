import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import * as THREE from 'three';

interface CloudFieldProps {
  isIncidentActive: boolean;
  isResolved: boolean;
  theme?: 'sunrise' | 'daylight' | 'night';
}

interface CloudPuff {
  pos: [number, number, number];
  scale: [number, number, number];
  rot: [number, number, number];
}

export const CloudField: React.FC<CloudFieldProps> = ({
  isIncidentActive,
  isResolved,
  theme = 'sunrise',
}) => {
  const oceanGroupRef = useRef<THREE.Group>(null);
  const horizonGroupRef = useRef<THREE.Group>(null);
  const motesMeshRef = useRef<THREE.InstancedMesh>(null);

  // Dynamic colors based on time/incident/theme
  const { cloudMainColor, oceanFloorColor } = useMemo(() => {
    if (isIncidentActive && !isResolved) {
      return {
        cloudMainColor: '#581c1c',
        oceanFloorColor: '#090d16',
      };
    }
    if (isResolved) {
      return {
        cloudMainColor: '#ffffff',
        oceanFloorColor: '#bae6fd',
      };
    }
    if (theme === 'night') {
      return {
        cloudMainColor: '#1e293b',       // Deep midnight cloud
        oceanFloorColor: '#020617',      // Cosmic ocean floor
      };
    }
    if (theme === 'daylight') {
      return {
        cloudMainColor: '#ffffff',       // Pure daylight cumulus
        oceanFloorColor: '#7dd3fc',
      };
    }
    // Warm golden-hour sunrise (Matching Reference Image)
    return {
      cloudMainColor: '#fffef9',
      oceanFloorColor: '#fed7aa',
    };
  }, [isIncidentActive, isResolved, theme]);

  // Vast rolling cloud sea bed beneath the archipelago
  const oceanPuffs: CloudPuff[] = useMemo(() => {
    const list: CloudPuff[] = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const radius = 9 + Math.random() * 65;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -8.5 - Math.random() * 3.0;
      // Flatter, wider elliptical puffs create rolling natural cloud blanket
      const sx = 7 + Math.random() * 10;
      const sy = 2.2 + Math.random() * 2.5;
      const sz = 7 + Math.random() * 10;
      list.push({
        pos: [x, y, z],
        scale: [sx, sy, sz],
        rot: [0, Math.random() * Math.PI, 0],
      });
    }
    return list;
  }, []);

  // Distant horizon billowing cloud banks (Soft mountain vistas behind the archipelago)
  const horizonPuffs: CloudPuff[] = useMemo(() => {
    const list: CloudPuff[] = [];
    // Distant northern cloud wall
    for (let i = 0; i < 24; i++) {
      const x = -75 + (i / 24) * 150 + (Math.random() - 0.5) * 8;
      const z = -65 - Math.random() * 25;
      const y = -3 + Math.random() * 7;
      list.push({
        pos: [x, y, z],
        scale: [18 + Math.random() * 12, 6 + Math.random() * 8, 16 + Math.random() * 12],
        rot: [0, Math.random() * Math.PI, 0],
      });
    }
    return list;
  }, []);

  // Sunlit atmospheric motes
  const moteCount = 140;
  const [moteDummy, moteData] = useMemo(() => {
    const d = new THREE.Object3D();
    const data = Array.from({ length: moteCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 90,
        Math.random() * 24 - 4,
        (Math.random() - 0.5) * 90
      ),
      scale: 0.08 + Math.random() * 0.18,
      speedX: 0.12 + Math.random() * 0.3,
      wavePhase: Math.random() * Math.PI * 2,
    }));
    return [d, data];
  }, [moteCount]);

  useFrame((state, delta) => {
    // Gentle rotation of the vast ocean and horizon cloud banks
    if (oceanGroupRef.current) {
      oceanGroupRef.current.rotation.y += delta * 0.012;
    }
    if (horizonGroupRef.current) {
      horizonGroupRef.current.rotation.y -= delta * 0.005;
    }

    // Atmospheric sunlit golden motes
    if (motesMeshRef.current) {
      const time = state.clock.elapsedTime;
      moteData.forEach((m, idx) => {
        m.pos.x += Math.sin(time * 0.4 + m.wavePhase) * 0.03;
        m.pos.y += Math.cos(time * 0.3 + m.wavePhase) * 0.02;

        moteDummy.position.copy(m.pos);
        moteDummy.scale.setScalar(m.scale * (1 + Math.sin(time * 2 + m.wavePhase) * 0.2));
        moteDummy.updateMatrix();
        motesMeshRef.current!.setMatrixAt(idx, moteDummy.matrix);
      });
      motesMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* =========================================================================
          1. THE GREAT CLOUD OCEAN (Vast undulating cloud sea below islands)
          ========================================================================= */}
      <group ref={oceanGroupRef} position={[0, -8, 0]}>
        {/* Procedural Billowing Cloud Domes */}
        {oceanPuffs.map((puff, idx) => (
          <mesh
            key={`ocean-${idx}`}
            position={puff.pos}
            scale={puff.scale}
            rotation={puff.rot}
            receiveShadow
          >
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial
              color={cloudMainColor}
              roughness={0.96}
              metalness={0.0}
              transparent
              opacity={0.88}
            />
          </mesh>
        ))}

        {/* Deep Horizon Cloud Ocean Circular Floor (No sharp square edges) */}
        <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[260, 48]} />
          <meshStandardMaterial
            color={oceanFloorColor}
            roughness={0.98}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Soft Cloud Layers inside the ocean */}
        <Cloud
          position={[0, 0.8, 0]}
          opacity={0.7}
          speed={0.1}
          segments={24}
          color={cloudMainColor}
          scale={[5.0, 1.4, 5.0]}
        />
        <Cloud
          position={[32, 0.5, -18]}
          opacity={0.65}
          speed={0.12}
          segments={22}
          color={cloudMainColor}
          scale={[4.5, 1.2, 4.5]}
        />
        <Cloud
          position={[-32, 0.5, 18]}
          opacity={0.65}
          speed={0.12}
          segments={22}
          color={cloudMainColor}
          scale={[4.5, 1.2, 4.5]}
        />
      </group>

      {/* =========================================================================
          2. DISTANT HORIZON CUMULUS VISTAS (Soft cloud mountain walls on the horizon)
          ========================================================================= */}
      <group ref={horizonGroupRef}>
        {horizonPuffs.map((puff, idx) => (
          <mesh
            key={`horizon-${idx}`}
            position={puff.pos}
            scale={puff.scale}
            rotation={puff.rot}
            castShadow
          >
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial
              color={cloudMainColor}
              roughness={0.92}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          3. SOFT CENTRAL ATMOSPHERIC CLOUD BED (Gentle ethereal mist beneath Home Island)
          ========================================================================= */}
      <group position={[0, -3.2, 0]}>
        {/* Defined, lush atmospheric under-cloud for Home Island (reduced transparency) */}
        <Cloud
          position={[0, -0.4, 0]}
          opacity={0.68}
          speed={0.12}
          segments={20}
          color={cloudMainColor}
          scale={[4.2, 0.65, 4.2]}
        />
      </group>

      {/* =========================================================================
          4. SUNLIT ATMOSPHERIC MOTES
          ========================================================================= */}
      <instancedMesh
        ref={motesMeshRef}
        args={[undefined, undefined, moteCount]}
      >
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial
          color={isIncidentActive && !isResolved ? '#fca5a5' : '#fef08a'}
          transparent
          opacity={0.65}
        />
      </instancedMesh>
    </group>
  );
};
