import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { CloudTheme } from '../../types';

interface OverviewBackgroundObjectsProps {
  isIncidentActive?: boolean;
  isResolved?: boolean;
  theme?: CloudTheme;
}

// 1. Orbital Cloud Satellite (Communication & SRE Telemetry)
const CloudSatellite: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  orbitSpeed?: number;
  isIncidentActive?: boolean;
  isResolved?: boolean;
}> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
  orbitSpeed = 0.2,
  isIncidentActive = false,
  isResolved = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle orbital wobble
      groupRef.current.rotation.y += delta * orbitSpeed * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
    if (dishRef.current) {
      dishRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15 + 0.3;
    }
    if (beaconRef.current) {
      // SRE Status Pulse: Rapid alert pulse during incidents, calm steady glow when resolved
      const t = state.clock.elapsedTime;
      const freq = isIncidentActive ? 8 : 2.5;
      beaconRef.current.intensity = 0.8 + Math.sin(t * freq) * 0.6;
    }
  });

  const beaconColor = isIncidentActive && !isResolved ? '#ef4444' : isResolved ? '#10b981' : '#38bdf8';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Central Satellite Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.0, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gold Thermal Blanket Foil Accents */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.15, 0.06, 1.7]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Solar Panel Wing Arrays (Left & Right) */}
      {/* Left Wing Mount & Panel */}
      <group position={[-2.4, 0, 0]}>
        <mesh position={[1.1, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[2.0, 0.05, 1.2]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.6}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Photovoltaic Grid Tracery */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[1.9, 0.02, 1.1]} />
          <meshStandardMaterial color="#38bdf8" wireframe />
        </mesh>
      </group>

      {/* Right Wing Mount & Panel */}
      <group position={[2.4, 0, 0]}>
        <mesh position={[-1.1, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[2.0, 0.05, 1.2]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.6}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Photovoltaic Grid Tracery */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[1.9, 0.02, 1.1]} />
          <meshStandardMaterial color="#38bdf8" wireframe />
        </mesh>
      </group>

      {/* Parabolic Antenna Dish (Tracking ground cloud stations) */}
      <group ref={dishRef} position={[0, -0.6, 0.4]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.08, 0.25, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Antenna Feed Horn Spire */}
        <mesh position={[0, -0.2, 0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      </group>

      {/* Telemetry Status Beacon LED */}
      <mesh position={[0, 0.58, -0.7]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={beaconColor} emissive={beaconColor} emissiveIntensity={2.5} />
      </mesh>
      <pointLight ref={beaconRef} position={[0, 0.65, -0.7]} color={beaconColor} intensity={1.5} distance={8} />
    </group>
  );
};

// 2. Distributed Cloud Architecture Node (Kubernetes / AWS Microservice Pod)
const CloudArchitectureNode: React.FC<{
  position: [number, number, number];
  scale?: number;
  color?: string;
  wireColor?: string;
  rotationSpeed?: number;
}> = ({
  position,
  scale = 1.0,
  color = '#0284c7',
  wireColor = '#38bdf8',
  rotationSpeed = 0.4,
}) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * rotationSpeed * 0.8;
      outerRingRef.current.rotation.y += delta * rotationSpeed;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * rotationSpeed * 1.2;
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 2.0) * 0.08;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4} position={position}>
      <group scale={[scale, scale, scale]}>
        {/* Outer Translucent Protective Hexagonal/Octahedral Grid */}
        <mesh ref={outerRingRef}>
          <octahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={0.65}
            emissive={wireColor}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Inner Glowing Microservice Data Core */}
        <mesh ref={coreRef}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={color}
            emissive={wireColor}
            emissiveIntensity={1.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Orbiting Telemetry Rings */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.7, 0.03, 8, 32]} />
          <meshStandardMaterial color={wireColor} emissive={wireColor} emissiveIntensity={1.2} />
        </mesh>
      </group>
    </Float>
  );
};

// 3. High-Altitude Atmospheric Cloud Relay Drone / Station
const CloudRelayDrone: React.FC<{
  position: [number, number, number];
  scale?: number;
}> = ({ position, scale = 1.0 }) => {
  const droneRef = useRef<THREE.Group>(null);
  const rotorRef1 = useRef<THREE.Mesh>(null);
  const rotorRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (droneRef.current) {
      // Gentle broad circular cruise in the distant clouds
      const t = state.clock.elapsedTime * 0.15;
      droneRef.current.position.x = position[0] + Math.sin(t) * 4.5;
      droneRef.current.position.z = position[2] + Math.cos(t) * 3.5;
    }
    if (rotorRef1.current) rotorRef1.current.rotation.y += delta * 18;
    if (rotorRef2.current) rotorRef2.current.rotation.y += delta * 18;
  });

  return (
    <group ref={droneRef} position={position} scale={[scale, scale, scale]}>
      {/* Sleek Aerodynamic Fuselage */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.45, 2.2, 10]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Aerodynamic Forward Dome */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.3, 10, 10]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>

      {/* Communication Wing Relays */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 4.2, 0.6]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Twin Lift Nacelles & Holographic Spin Discs */}
      <mesh ref={rotorRef1} position={[-2.1, 0.2, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.02, 12]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} wireframe />
      </mesh>
      <mesh ref={rotorRef2} position={[2.1, 0.2, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.02, 12]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} wireframe />
      </mesh>

      {/* Underside Telemetry Pod */}
      <mesh position={[0, -0.4, 0.2]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

export const OverviewBackgroundObjects: React.FC<OverviewBackgroundObjectsProps> = ({
  isIncidentActive = false,
  isResolved = false,
}) => {
  return (
    <group>
      {/* =========================================================================
          1. DISTANT ORBITAL SATELLITES (CLOUD & SRE INFRASTRUCTURE)
          Positioned in the distant upper atmosphere (z: -45 to -75, y: 22 to 34)
          ========================================================================= */}
      {/* Upper-Left Telemetry Satellite */}
      <CloudSatellite
        position={[-36, 26, -55]}
        rotation={[0.3, 0.8, -0.2]}
        scale={1.4}
        orbitSpeed={0.3}
        isIncidentActive={isIncidentActive}
        isResolved={isResolved}
      />

      {/* Upper-Right Global AWS Communication Relay Satellite */}
      <CloudSatellite
        position={[38, 29, -62]}
        rotation={[-0.2, -0.7, 0.15]}
        scale={1.6}
        orbitSpeed={0.25}
        isIncidentActive={isIncidentActive}
        isResolved={isResolved}
      />

      {/* Deep Center-North Orbital High-Altitude Transponder */}
      <CloudSatellite
        position={[-6, 34, -75]}
        rotation={[0.4, 0.2, -0.1]}
        scale={1.2}
        orbitSpeed={0.18}
        isIncidentActive={isIncidentActive}
        isResolved={isResolved}
      />

      {/* =========================================================================
          2. DISTRIBUTED CLOUD ARCHITECTURE NODES (KUBERNETES & AWS PODS)
          Drifting gently between distant cloud horizons
          ========================================================================= */}
      {/* Far-Left Kubernetes Pod (Cyan Core) */}
      <CloudArchitectureNode
        position={[-42, 16, -42]}
        scale={1.2}
        color="#0284c7"
        wireColor="#38bdf8"
        rotationSpeed={0.45}
      />

      {/* Far-Right AWS Microservice Node (Amber/Orange Core) */}
      <CloudArchitectureNode
        position={[44, 18, -48]}
        scale={1.3}
        color="#d97706"
        wireColor="#fbbf24"
        rotationSpeed={0.38}
      />

      {/* Mid-High Distant Node (Deep Sky Blue) */}
      <CloudArchitectureNode
        position={[22, 28, -68]}
        scale={1.1}
        color="#0369a1"
        wireColor="#7dd3fc"
        rotationSpeed={0.5}
      />

      {/* Far-West Edge Data Broker Node */}
      <CloudArchitectureNode
        position={[-28, 12, -50]}
        scale={0.95}
        color="#6366f1"
        wireColor="#a5b4fc"
        rotationSpeed={0.42}
      />

      {/* =========================================================================
          3. HIGH-ALTITUDE CELESTIAL CLOUD RELAY DRONE
          Cruises peacefully across the distant sunrise clouds
          ========================================================================= */}
      <CloudRelayDrone position={[14, 22, -45]} scale={1.1} />
    </group>
  );
};

