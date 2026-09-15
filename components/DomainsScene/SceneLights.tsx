'use client';

import React from 'react';

interface SceneLightsProps {
  hoveredDomain: string | null;
}

export const SceneLights: React.FC<SceneLightsProps> = ({ hoveredDomain }) => {
  return (
    <>
      {/* Dark Cinematic Ambient */}
      <ambientLight intensity={0.35} color="#2a3550" />

      {/* Rim Light from far back - blue cold contrast */}
      <directionalLight
        position={[0, 14, -12]}
        intensity={1.0}
        color="#7fa8e8"
      />

      {/* Warm golden key light from top-front */}
      <directionalLight
        position={[2, 10, 8]}
        intensity={0.6}
        color="#ffd080"
      />
      <directionalLight
        position={[-2, 10, 8]}
        intensity={0.6}
        color="#ffd080"
      />

      {/* Wide warm fill at center ground level */}
      <pointLight
        position={[0, -1.5, 4]}
        color="#c87820"
        intensity={1.2}
        distance={20}
        decay={2}
      />

      {/* Left side warm accent */}
      <pointLight
        position={[-6, -1, 2]}
        color="#ffaa33"
        intensity={0.8}
        distance={10}
        decay={2}
      />

      {/* Right side warm accent */}
      <pointLight
        position={[6, -1, 2]}
        color="#ffaa33"
        intensity={0.8}
        distance={10}
        decay={2}
      />
    </>
  );
};
