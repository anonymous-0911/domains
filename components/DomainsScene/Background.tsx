'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Background: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom shader for procedural dark atmospheric haze & gradient
  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorTop: { value: new THREE.Color('#080d1a') },
        uColorBottom: { value: new THREE.Color('#020305') },
        uColorGlow: { value: new THREE.Color('#3b2308') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorTop;
        uniform vec3 uColorBottom;
        uniform vec3 uColorGlow;
        varying vec2 vUv;

        // Simple pseudo noise
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          // Vertical gradient base
          vec3 color = mix(uColorBottom, uColorTop, vUv.y);

          // Subtle horizontal atmospheric haze pulse
          float noiseFactor = sin(vUv.x * 3.0 + uTime * 0.2) * cos(vUv.y * 2.0 + uTime * 0.15);
          float glowCenter = smoothstep(0.0, 0.7, 1.0 - length(vUv - vec2(0.5, 0.4)));
          
          color += uColorGlow * glowCenter * 0.15 * (0.8 + 0.2 * noiseFactor);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <planeGeometry args={[60, 40]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};
