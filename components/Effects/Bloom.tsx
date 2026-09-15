'use client';

import React from 'react';
import { EffectComposer, Bloom as BloomEffect, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const Bloom: React.FC = () => {
  return (
    <EffectComposer multisampling={4}>
      <BloomEffect
        intensity={0.9}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.85}
      />
      <Vignette
        eskil={false}
        offset={0.2}
        darkness={0.85}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
