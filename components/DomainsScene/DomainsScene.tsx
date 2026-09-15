'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { Background } from './Background';
import { Water } from './Water';
import { Fog } from './Fog';
import { SceneLights } from './SceneLights';
import { Gates } from '../Gates/Gates';
import { Particles } from '../Effects/Particles';
import { Bloom } from '../Effects/Bloom';

interface DomainsSceneProps {
  hoveredDomain: string | null;
  onHoverDomain: (id: string | null) => void;
  onSelectDomain?: (id: string) => void;
}

// Camera parallax controller
const ParallaxCamera: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state, delta) => {
    if (cameraRef.current) {
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.2;

      cameraRef.current.position.x = THREE.MathUtils.lerp(
        cameraRef.current.position.x,
        targetX,
        delta * 2.0
      );
      cameraRef.current.position.y = THREE.MathUtils.lerp(
        cameraRef.current.position.y,
        0.5 + targetY,
        delta * 2.0
      );
      cameraRef.current.lookAt(0, 0.2, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0.5, 10]}
      fov={52}
      near={0.1}
      far={120}
    />
  );
};

// Wraps in its own Suspense so the gates load independently from particles/water
const SceneContent: React.FC<DomainsSceneProps> = ({
  hoveredDomain,
  onHoverDomain,
  onSelectDomain,
}) => {
  return (
    <>
      <ParallaxCamera />

      {/* Lights: always render first */}
      <SceneLights hoveredDomain={hoveredDomain} />

      {/* Background gradient — no textures, renders immediately */}
      <Background />

      {/* Texture-dependent elements in Suspense */}
      <Suspense fallback={null}>
        <Fog />
        <Water />
        <Gates
          hoveredDomain={hoveredDomain}
          onHoverDomain={onHoverDomain}
          onSelectDomain={onSelectDomain}
        />
        <Particles />
      </Suspense>

      {/* Post-processing */}
      <Suspense fallback={null}>
        <Bloom />
      </Suspense>
    </>
  );
};

export const DomainsScene: React.FC<DomainsSceneProps> = (props) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0" style={{ background: '#030508' }}>
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          alpha: false,
        }}
        dpr={[1, 2]}
        shadows={false}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
};
