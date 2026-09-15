'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FOG_FRAG = `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = vUv * vec2(4.0, 2.0);
    st.x += uTime * uSpeed;
    st.y += sin(uTime * 0.1) * 0.1;
    float n = fbm(st);
    float edgeAlpha = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
    float sideAlpha = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
    float alpha = n * edgeAlpha * sideAlpha * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const FOG_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const makeFogMat = (opacity: number) =>
  new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 0.05 },
      uColor: { value: new THREE.Color('#0c1322') },
      uOpacity: { value: opacity },
    },
    vertexShader: FOG_VERT,
    fragmentShader: FOG_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

export const Fog: React.FC = () => {
  // Each layer gets its own independent material instance
  const fogMat1 = useMemo(() => makeFogMat(0.35), []);
  const fogMat2 = useMemo(() => makeFogMat(0.22), []);

  useFrame((_, delta) => {
    fogMat1.uniforms.uTime.value += delta;
    fogMat2.uniforms.uTime.value += delta * 0.65; // slightly offset speed
  });

  return (
    <group position={[0, -1.2, -2.5]}>
      {/* Primary Low-lying Fog layer */}
      <mesh position={[0, -0.5, 0]}>
        <planeGeometry args={[36, 10]} />
        <primitive object={fogMat1} attach="material" />
      </mesh>

      {/* Secondary Distant Mist layer */}
      <mesh position={[0, 0.5, -3]} scale={[1.4, 1.2, 1]}>
        <planeGeometry args={[36, 12]} />
        <primitive object={fogMat2} attach="material" />
      </mesh>
    </group>
  );
};
