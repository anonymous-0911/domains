'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PARTICLES_ASSETS } from '@/lib/assets';

export const Particles: React.FC = () => {
  const dustTexture = useTexture(PARTICLES_ASSETS.dust);
  const emberTexture = useTexture(PARTICLES_ASSETS.ember);

  const dustRef = useRef<THREE.Points>(null);
  const emberRef = useRef<THREE.Points>(null);

  // Generate dust positions & speeds
  const { dustPositions, dustSpeeds } = useMemo(() => {
    const count = 140;
    const dustPositions = new Float32Array(count * 3);
    const dustSpeeds = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 32;
      dustPositions[i * 3 + 1] = Math.random() * 12 - 2;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      dustSpeeds[i * 3] = (Math.random() - 0.5) * 0.005;
      dustSpeeds[i * 3 + 1] = Math.random() * 0.004 + 0.001;
      dustSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return { dustPositions, dustSpeeds };
  }, []);

  // Generate ember positions & speeds
  const { emberPositions, emberSpeeds } = useMemo(() => {
    const count = 80;
    const emberPositions = new Float32Array(count * 3);
    const emberSpeeds = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 24;
      emberPositions[i * 3 + 1] = Math.random() * 10 - 2;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;

      emberSpeeds[i * 3] = (Math.random() - 0.5) * 0.008;
      emberSpeeds[i * 3 + 1] = Math.random() * 0.012 + 0.006;
      emberSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return { emberPositions, emberSpeeds };
  }, []);

  // Build geometries once
  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(dustPositions.slice(), 3));
    return geo;
  }, [dustPositions]);

  const emberGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(emberPositions.slice(), 3));
    return geo;
  }, [emberPositions]);

  useFrame(() => {
    // Animate Dust particles
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += dustSpeeds[i * 3];
        positions[i * 3 + 1] += dustSpeeds[i * 3 + 1];
        positions[i * 3 + 2] += dustSpeeds[i * 3 + 2];

        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -2;
        if (positions[i * 3] > 16) positions[i * 3] = -16;
        if (positions[i * 3] < -16) positions[i * 3] = 16;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Ember particles
    if (emberRef.current) {
      const positions = emberRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(positions[i * 3 + 1] * 2.0) * 0.003;
        positions[i * 3 + 1] += emberSpeeds[i * 3 + 1];

        if (positions[i * 3 + 1] > 9) {
          positions[i * 3 + 1] = -2;
          positions[i * 3] = (Math.random() - 0.5) * 24;
        }
      }
      emberRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Floating Dust */}
      <points ref={dustRef} geometry={dustGeo}>
        <pointsMaterial
          size={0.4}
          map={dustTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Rising Golden Embers */}
      <points ref={emberRef} geometry={emberGeo}>
        <pointsMaterial
          size={0.45}
          map={emberTexture}
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffb338"
          sizeAttenuation
        />
      </points>
    </group>
  );
};
