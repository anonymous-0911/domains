'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DomainItem } from '@/lib/assets';
import { GateGlow } from './GateGlow';

interface GateProps {
  domain: DomainItem;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
  renderMode?: '2d-layered' | '3d-model';
}

export const Gate: React.FC<GateProps> = ({
  domain,
  isHovered,
  onHover,
  onSelect,
  renderMode = '2d-layered',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const baseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Load all 3 image layers for this gate
  const [interiorTex, baseTex, glowTex] = useTexture([
    domain.interior,
    domain.base,
    domain.glow,
  ]);

  // Current animated progress values (scale & glow interpolation)
  const currentProgress = useRef(0);

  useFrame((_, delta) => {
    const targetProgress = isHovered ? 1 : 0;
    // Smooth lerp interpolation
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      targetProgress,
      delta * 8.0
    );

    const progress = currentProgress.current;

    // Smoothly scale gate
    if (groupRef.current) {
      const scaleVal = 1.0 + progress * 0.05; // 1.0 -> 1.05x
      groupRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }

    // Brighten base material on hover
    if (baseMatRef.current) {
      baseMatRef.current.emissiveIntensity = 0.05 + progress * 0.3;
    }

    // Increase point light intensity on hover
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 0.6 + progress * 3.0;
    }
  });

  const width = 3.6;
  const height = 5.4;

  return (
    <group
      ref={groupRef}
      position={domain.position}
      rotation={domain.rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(domain.id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(domain.id);
      }}
    >
      {/* Warm golden point light at base of gate */}
      <pointLight
        ref={pointLightRef}
        position={[0, -2.5, 1.0]}
        color="#ffb732"
        intensity={0.6}
        distance={8}
        decay={2}
      />

      {renderMode === '2d-layered' ? (
        <>
          {/* Layer 1: Gate Interior (Portal World View) */}
          <mesh position={[0, 0, -0.04]}>
            <planeGeometry args={[width * 0.92, height * 0.92]} />
            <meshBasicMaterial
              map={interiorTex}
              toneMapped={false}
            />
          </mesh>

          {/* Layer 2: Gate Base (Physical Archway Structure) */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              ref={baseMatRef}
              map={baseTex}
              transparent
              alphaTest={0.05}
              roughness={0.6}
              metalness={0.3}
              emissive={new THREE.Color('#ffb732')}
              emissiveIntensity={0.05}
            />
          </mesh>

          {/* Layer 3: Gate Glow (Additive Magical Emissive Map) — receives live ref */}
          <GateGlow
            glowTexture={glowTex}
            glowIntensity={currentProgress}
            width={width}
            height={height}
          />

          {/* Domain Code Label Floating Inside Arch Bottom */}
          <Text
            position={[0, -1.8, 0.12]}
            fontSize={0.45}
            font="https://fonts.gstatic.com/s/cinzel/v19/8vIJ7ww63mVu7gt79A737Q.woff"
            color={isHovered ? '#ffffff' : '#ffd98c'}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
          >
            {domain.code}
          </Text>
        </>
      ) : (
        /* Placeholder hook for future GLTF 3D model component */
        <mesh>
          <boxGeometry args={[3, 5, 1]} />
          <meshStandardMaterial color="gold" />
        </mesh>
      )}
    </group>
  );
};
