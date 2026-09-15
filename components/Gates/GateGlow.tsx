'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GateGlowProps {
  glowTexture: THREE.Texture;
  glowIntensity: React.MutableRefObject<number>; // Pass ref so it reads live value every frame
  width?: number;
  height?: number;
}

export const GateGlow: React.FC<GateGlowProps> = ({
  glowTexture,
  glowIntensity,
  width = 3.6,
  height = 5.6,
}) => {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.15 + glowIntensity.current * 0.85;
    }
  });

  return (
    <mesh position={[0, 0, 0.05]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={glowTexture}
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
};
