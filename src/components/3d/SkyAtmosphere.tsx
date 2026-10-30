import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CloudTheme } from '../../types';

interface SkyAtmosphereProps {
  isIncidentActive: boolean;
  isResolved: boolean;
  theme?: CloudTheme;
}

// Custom Celestial Atmospheric Sky Dome Shader
const SkyDomeShader = {
  uniforms: {
    topColor: { value: new THREE.Color('#0284c7') },
    midColor: { value: new THREE.Color('#7dd3fc') },
    bottomColor: { value: new THREE.Color('#fed7aa') },
    groundColor: { value: new THREE.Color('#bae6fd') },
    sunColor: { value: new THREE.Color('#fef08a') },
    sunPosition: { value: new THREE.Vector3(50, 32, -30).normalize() },
    offset: { value: 30 },
    exponent: { value: 0.65 },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    varying vec3 vSunDirection;
    uniform vec3 sunPosition;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vSunDirection = normalize(sunPosition);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 midColor;
    uniform vec3 bottomColor;
    uniform vec3 groundColor;
    uniform vec3 sunColor;
    varying vec3 vWorldPosition;
    varying vec3 vSunDirection;
    uniform float offset;
    uniform float exponent;

    void main() {
      vec3 viewDir = normalize(vWorldPosition);
      float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
      
      vec3 sky;
      if (h > 0.35) {
        float f = clamp((h - 0.35) / 0.65, 0.0, 1.0);
        sky = mix(midColor, topColor, pow(f, exponent));
      } else if (h > 0.0) {
        float f = clamp(h / 0.35, 0.0, 1.0);
        sky = mix(bottomColor, midColor, pow(f, 0.8));
      } else {
        float f = clamp((h + 0.3) / 0.3, 0.0, 1.0);
        sky = mix(groundColor, bottomColor, f);
      }

      float sunDot = max(dot(viewDir, vSunDirection), 0.0);
      float sunGlow = pow(sunDot, 128.0) * 2.4;
      float sunHalo = pow(sunDot, 6.0) * 0.6;
      
      sky += sunColor * (sunGlow + sunHalo);

      gl_FragColor = vec4(sky, 1.0);
    }
  `,
};

export const SkyAtmosphere: React.FC<SkyAtmosphereProps> = ({
  isIncidentActive,
  isResolved,
  theme = 'sunrise',
}) => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const skyMatRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    return {
      topColor: { value: new THREE.Color('#0284c7') },
      midColor: { value: new THREE.Color('#7dd3fc') },
      bottomColor: { value: new THREE.Color('#fed7aa') },
      groundColor: { value: new THREE.Color('#bae6fd') },
      sunColor: { value: new THREE.Color('#fef08a') },
      sunPosition: { value: new THREE.Vector3(50, 32, -30).normalize() },
      offset: { value: 20 },
      exponent: { value: 0.7 },
    };
  }, []);

  useFrame((_, delta) => {
    if (skyMatRef.current) {
      const u = skyMatRef.current.uniforms;

      if (isIncidentActive && !isResolved) {
        // Storm Sky: Deep Charcoal Indigo & Volcanic Crimson Horizon
        u.topColor.value.lerp(new THREE.Color('#090d16'), delta * 2.5);
        u.midColor.value.lerp(new THREE.Color('#1e1b4b'), delta * 2.5);
        u.bottomColor.value.lerp(new THREE.Color('#7f1d1d'), delta * 2.5);
        u.groundColor.value.lerp(new THREE.Color('#18181b'), delta * 2.5);
        u.sunColor.value.lerp(new THREE.Color('#ef4444'), delta * 2.5);
      } else if (isResolved) {
        // Celebration Bloom
        u.topColor.value.lerp(new THREE.Color('#0284c7'), delta * 2.5);
        u.midColor.value.lerp(new THREE.Color('#7dd3fc'), delta * 2.5);
        u.bottomColor.value.lerp(new THREE.Color('#fef08a'), delta * 2.5);
        u.groundColor.value.lerp(new THREE.Color('#bae6fd'), delta * 2.5);
        u.sunColor.value.lerp(new THREE.Color('#ffffff'), delta * 2.5);
      } else {
        if (theme === 'night') {
          // Night: Deep Cosmic Sapphire & Silver Moonlight
          u.topColor.value.lerp(new THREE.Color('#020617'), delta * 2);
          u.midColor.value.lerp(new THREE.Color('#0b1329'), delta * 2);
          u.bottomColor.value.lerp(new THREE.Color('#1e1b4b'), delta * 2);
          u.groundColor.value.lerp(new THREE.Color('#020617'), delta * 2);
          u.sunColor.value.lerp(new THREE.Color('#93c5fd'), delta * 2);
        } else if (theme === 'daylight') {
          // Daylight: Bright Azure, Cyan, Warm White Sun
          u.topColor.value.lerp(new THREE.Color('#0284c7'), delta * 2);
          u.midColor.value.lerp(new THREE.Color('#38bdf8'), delta * 2);
          u.bottomColor.value.lerp(new THREE.Color('#bae6fd'), delta * 2);
          u.groundColor.value.lerp(new THREE.Color('#f0f9ff'), delta * 2);
          u.sunColor.value.lerp(new THREE.Color('#ffffff'), delta * 2);
        } else {
          // Golden Hour / Sunset (Matching Reference Image)
          u.topColor.value.lerp(new THREE.Color('#0284c7'), delta * 2);
          u.midColor.value.lerp(new THREE.Color('#7dd3fc'), delta * 2);
          u.bottomColor.value.lerp(new THREE.Color('#fed7aa'), delta * 2);
          u.groundColor.value.lerp(new THREE.Color('#fde68a'), delta * 2);
          u.sunColor.value.lerp(new THREE.Color('#fef08a'), delta * 2);
        }
      }
    }

    if (sunLightRef.current && ambientLightRef.current && hemiLightRef.current) {
      if (isIncidentActive && !isResolved) {
        sunLightRef.current.color.lerp(new THREE.Color('#f87171'), delta * 2);
        sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, 1.2, delta * 2);
        ambientLightRef.current.color.lerp(new THREE.Color('#1e1b4b'), delta * 2);
        ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, 0.4, delta * 2);
        hemiLightRef.current.color.lerp(new THREE.Color('#ef4444'), delta * 2);
        hemiLightRef.current.groundColor.lerp(new THREE.Color('#18181b'), delta * 2);
      } else if (isResolved) {
        sunLightRef.current.color.lerp(new THREE.Color('#fffbeb'), delta * 2);
        sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, 2.8, delta * 2);
        ambientLightRef.current.color.lerp(new THREE.Color('#f0f9ff'), delta * 2);
        ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, 1.1, delta * 2);
        hemiLightRef.current.color.lerp(new THREE.Color('#bae6fd'), delta * 2);
        hemiLightRef.current.groundColor.lerp(new THREE.Color('#fef3c7'), delta * 2);
      } else {
        if (theme === 'night') {
          sunLightRef.current.color.lerp(new THREE.Color('#bfdbfe'), delta * 2);
          sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, 0.9, delta * 2);
          ambientLightRef.current.color.lerp(new THREE.Color('#0f172a'), delta * 2);
          ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, 0.5, delta * 2);
          hemiLightRef.current.color.lerp(new THREE.Color('#38bdf8'), delta * 2);
          hemiLightRef.current.groundColor.lerp(new THREE.Color('#020617'), delta * 2);
        } else if (theme === 'daylight') {
          sunLightRef.current.color.lerp(new THREE.Color('#ffffff'), delta * 2);
          sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, 2.5, delta * 2);
          ambientLightRef.current.color.lerp(new THREE.Color('#e0f2fe'), delta * 2);
          ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, 1.0, delta * 2);
          hemiLightRef.current.color.lerp(new THREE.Color('#38bdf8'), delta * 2);
          hemiLightRef.current.groundColor.lerp(new THREE.Color('#bae6fd'), delta * 2);
        } else {
          // Warm Golden Sunset Sunlight (Matching Reference Image)
          sunLightRef.current.color.lerp(new THREE.Color('#fff7ed'), delta * 2);
          sunLightRef.current.intensity = THREE.MathUtils.lerp(sunLightRef.current.intensity, 2.6, delta * 2);
          ambientLightRef.current.color.lerp(new THREE.Color('#fef3c7'), delta * 2);
          ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, 0.95, delta * 2);
          hemiLightRef.current.color.lerp(new THREE.Color('#7dd3fc'), delta * 2);
          hemiLightRef.current.groundColor.lerp(new THREE.Color('#fed7aa'), delta * 2);
        }
      }
    }
  });

  const fogColor = useMemo(() => {
    if (isIncidentActive && !isResolved) return '#090d16';
    if (isResolved) return '#bae6fd';
    if (theme === 'night') return '#0b1329';
    if (theme === 'daylight') return '#bae6fd';
    return '#fde68a';
  }, [isIncidentActive, isResolved, theme]);

  return (
    <>
      {/* 360-Degree Atmospheric Celestial Sky Dome */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[450, 36, 24]} />
        <shaderMaterial
          ref={skyMatRef}
          vertexShader={SkyDomeShader.vertexShader}
          fragmentShader={SkyDomeShader.fragmentShader}
          uniforms={uniforms}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Visible Golden Sun Disc with Warm Sunset Glow (Matching Reference Image) */}
      {theme !== 'night' && !isIncidentActive && (
        <group position={[50, 32, -30]}>
          {/* Radiant Sun Sphere */}
          <mesh>
            <sphereGeometry args={[4.8, 32, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Golden Sun Corona Disc */}
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <ringGeometry args={[4.6, 9.5, 32]} />
            <meshBasicMaterial
              color="#fef08a"
              transparent
              opacity={0.55}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <ringGeometry args={[9.5, 16.0, 32]} />
            <meshBasicMaterial
              color="#fb923c"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Night Sky Stars */}
      {theme === 'night' && !isIncidentActive && (
        <Stars
          radius={280}
          depth={60}
          count={3500}
          factor={4}
          saturation={0}
          fade
          speed={0.8}
        />
      )}

      {/* Primary Directional Sun Light (Shining from Upper Right) */}
      <directionalLight
        ref={sunLightRef}
        position={[50, 35, -25]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={220}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0003}
      />

      {/* Tropospheric Diffuse Ambient Light */}
      <ambientLight ref={ambientLightRef} intensity={0.95} color="#fef3c7" />

      {/* Hemispheric Sky-to-Cloud Bounce Light */}
      <hemisphereLight
        ref={hemiLightRef}
        args={['#7dd3fc', '#fed7aa', 0.9]}
      />

      {/* Horizon Fill Light */}
      <directionalLight
        position={[-35, 15, -35]}
        color={
          isIncidentActive && !isResolved
            ? '#991b1b'
            : theme === 'night'
            ? '#38bdf8'
            : '#ffedd5'
        }
        intensity={theme === 'night' ? 0.4 : 0.65}
      />

      {/* Soft Depth Fog */}
      <fog attach="fog" args={[fogColor, 50, 300]} />
    </>
  );
};
