'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { TEXTURES_ASSETS } from '@/lib/assets';

export const Water: React.FC = () => {
  const normalMap = useTexture(TEXTURES_ASSETS.waterNormal);
  
  React.useEffect(() => {
    if (normalMap) {
      normalMap.wrapS = THREE.RepeatWrapping;
      normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(6, 6);
    }
  }, [normalMap]);

  useFrame((_, delta) => {
    if (normalMap) {
      normalMap.offset.x += delta * 0.015;
      normalMap.offset.y += delta * 0.01;
    }
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.55, 0]}
      receiveShadow
    >
      <planeGeometry args={[60, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mirror={0.65}
        mixBlur={0.8}
        mixStrength={1.8}
        roughness={0.35}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#060913"
        metalness={0.8}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.3, 0.3)}
      />
    </mesh>
  );
};
