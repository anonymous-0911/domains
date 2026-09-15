export interface DomainItem {
  id: 'ds' | 'ml' | 'nlp' | 'cv';
  code: string;
  name: string;
  subtitle: string;
  description: string;
  base: string;
  glow: string;
  interior: string;
  position: [number, number, number];
  rotation: [number, number, number];
  // Extendable interface for future 3D model support
  modelPath?: string;
}

export const DOMAIN_ASSETS: Record<'ds' | 'ml' | 'nlp' | 'cv', DomainItem> = {
  ds: {
    id: 'ds',
    code: 'DS',
    name: 'Data Science',
    subtitle: 'Data Analytics & Insights',
    description: 'Transform raw data into strategic intelligence and predictive power.',
    base: '/assets/gates/ds/gate-base.webp',
    glow: '/assets/gates/ds/gate-glow.webp',
    interior: '/assets/gates/ds/gate-interior.webp',
    position: [-4.6, 0.15, -0.4],
    rotation: [0, 0.08, 0],
  },
  ml: {
    id: 'ml',
    code: 'ML',
    name: 'Machine Learning',
    subtitle: 'Adaptive Models & Intelligence',
    description: 'Autonomous algorithms that learn, optimize, and synthesize complex patterns.',
    base: '/assets/gates/ml/gate-base.webp',
    glow: '/assets/gates/ml/gate-glow.webp',
    interior: '/assets/gates/ml/gate-interior.webp',
    position: [-1.55, -0.15, 0.1],
    rotation: [0, 0.03, 0],
  },
  nlp: {
    id: 'nlp',
    code: 'NLP',
    name: 'Natural Language Processing',
    subtitle: 'Language & Cognitive Synthesis',
    description: 'Deciphering human semantics, generative text, and linguistic structures.',
    base: '/assets/gates/nlp/gate-base.webp',
    glow: '/assets/gates/nlp/gate-glow.webp',
    interior: '/assets/gates/nlp/gate-interior.webp',
    position: [1.55, -0.15, 0.1],
    rotation: [0, -0.03, 0],
  },
  cv: {
    id: 'cv',
    code: 'CV',
    name: 'Computer Vision',
    subtitle: 'Visual Perception & Spatial AI',
    description: 'Empowering machines to interpret, analyze, and map visual reality.',
    base: '/assets/gates/cv/gate-base.webp',
    glow: '/assets/gates/cv/gate-glow.webp',
    interior: '/assets/gates/cv/gate-interior.webp',
    position: [4.6, 0.15, -0.4],
    rotation: [0, -0.08, 0],
  },
};

export const PARTICLES_ASSETS = {
  dust: '/particles/dust.png',
  ember: '/particles/ember.png',
};

export const TEXTURES_ASSETS = {
  waterNormal: '/textures/water-normal.jpg',
};
