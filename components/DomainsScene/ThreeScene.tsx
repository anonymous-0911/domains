'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────── Domain Definitions ────────────────────────── */
const DOMAINS_LAYOUT_DESKTOP: Record<string, { xPos: number; yPos: number; rotY: number }> = {
  ds:  { xPos: -5.1, yPos: 0.0, rotY: 0.0 },
  ml:  { xPos: -1.7, yPos: 0.0, rotY: 0.0 },
  nlp: { xPos: 1.7,  yPos: 0.0, rotY: 0.0 },
  cv:  { xPos: 5.1,  yPos: 0.0, rotY: 0.0 },
};

const DOMAINS_LAYOUT_MOBILE: Record<string, { xPos: number; yPos: number; rotY: number }> = {
  ds:  { xPos: -1.70, yPos: 2.15, rotY: 0.0 },
  ml:  { xPos: 1.70,  yPos: 2.15, rotY: 0.0 },
  nlp: { xPos: -1.70, yPos: -2.15, rotY: 0.0 },
  cv:  { xPos: 1.70,  yPos: -2.15, rotY: 0.0 },
};

const DOMAINS = [
  {
    id: 'ds',
    code: 'DS',
    name: '',
    subtitle: 'Data Analytics & Insights',
    interior: '/assets/gates/ds/gate-interior.webp',
    base: '/assets/gates/ds/gate-base.webp',
    glow: '/assets/gates/ds/gate-glow.webp',
    xPos: -5.1,
    yPos: 0.0,
    rotY: 0.0,
  },
  {
    id: 'ml',
    code: 'ML',
    name: '',
    subtitle: 'Adaptive Models & AI',
    interior: '/assets/gates/ml/gate-interior.webp',
    base: '/assets/gates/ml/gate-base.webp',
    glow: '/assets/gates/ml/gate-glow.webp',
    xPos: -1.7,
    yPos: 0.0,
    rotY: 0.0,
  },
  {
    id: 'nlp',
    code: 'NLP',
    name: '',
    subtitle: 'Language & Cognitive AI',
    interior: '/assets/gates/nlp/gate-interior.webp',
    base: '/assets/gates/nlp/gate-base.webp',
    glow: '/assets/gates/nlp/gate-glow.webp',
    xPos: 1.7,
    yPos: 0.0,
    rotY: 0.0,
  },
  {
    id: 'cv',
    code: 'CV',
    name: '',
    subtitle: 'Visual Perception & Spatial AI',
    interior: '/assets/gates/cv/gate-interior.webp',
    base: '/assets/gates/cv/gate-base.webp',
    glow: '/assets/gates/cv/gate-glow.webp',
    xPos: 5.1,
    yPos: 0.0,
    rotY: 0.0,
  },
];

/* ─────────────────────────── Text Texture Creator ────────────────────────── */
function createGateTextTexture(code: string, name: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 256);

  // Main Domain Code (DS, ML, NLP, CV)
  ctx.font = '900 86px "Cinzel", "Trajan Pro", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Golden metallic vertical gradient
  const grad = ctx.createLinearGradient(0, 30, 0, 130);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.25, '#ffe596');
  grad.addColorStop(0.65, '#e2a93b');
  grad.addColorStop(1, '#8e590c');

  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(255, 190, 60, 0.9)';
  ctx.shadowBlur = 24;
  ctx.fillText(code, 256, 85);

  // Domain Full Name Subtitle
  ctx.font = '700 24px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fcdb88';
  ctx.shadowColor = 'rgba(255, 170, 40, 0.7)';
  ctx.shadowBlur = 12;
  ctx.fillText(name, 256, 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ─────────────────────────── Particle System ───────────────────────────── */
function createParticleSystem(
  count: number,
  spread: [number, number, number],
  color: string,
  size: number
) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread[0];
    positions[i * 3 + 1] = Math.random() * spread[1] - 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2] - 2;
    velocities[i * 3] = (Math.random() - 0.5) * 0.004;
    velocities[i * 3 + 1] = Math.random() * 0.008 + 0.002;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size,
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { points: new THREE.Points(geo, mat), velocities };
}

/* ─────────────────────────── Background Shader ─────────────────────────── */
function createBackground(loader: THREE.TextureLoader) {
  const bgTex = loader.load('/assets/background/bg.webp');
  bgTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.generateMipmaps = false;
  bgTex.minFilter = THREE.LinearFilter;

  const geo = new THREE.PlaneGeometry(90, 55);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: bgTex },
      uTime: { value: 0 },
      uGlow: { value: new THREE.Color('#381c04') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec3 uGlow;
      varying vec2 vUv;

      void main() {
        vec4 bg = texture2D(uTexture, vUv);

        // Soft ambient warmth pulse centered behind gates
        float centerDist = length((vUv - vec2(0.5, 0.48)) * vec2(1.0, 1.3));
        float g = smoothstep(0.6, 0.0, centerDist);
        float pulse = 0.85 + 0.15 * sin(uTime * 0.4);

        vec3 finalCol = bg.rgb + uGlow * g * 0.22 * pulse;

        gl_FragColor = vec4(finalCol, 1.0);
      }
    `,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, -20);
  return { mesh, mat };
}

/* ─────────────────────────── Fog Planes ────────────────────────────────── */
function createFogPlane(opacity: number, speed: number) {
  const geo = new THREE.PlaneGeometry(45, 10);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uSpeed: { value: speed },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform float uSpeed;
      varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
        return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y); }
      float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*n(p);p*=2.0;a*=0.5;} return v; }
      void main(){
        vec2 st=vUv*vec2(3.5,1.8)+vec2(uTime*uSpeed,0.0);
        float f=fbm(st);
        float edge=smoothstep(0.0,0.25,vUv.y)*smoothstep(1.0,0.5,vUv.y)
                  *smoothstep(0.0,0.15,vUv.x)*smoothstep(1.0,0.85,vUv.x);
        gl_FragColor=vec4(vec3(0.06,0.11,0.20), f*edge*uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  return { mesh, mat };
}

/* ─────────────────────────── Moving Water Shader ───────────────────────── */
function createWaterSystem(renderTarget: THREE.WebGLRenderTarget) {
  const geo = new THREE.PlaneGeometry(60, 35, 64, 64);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReflectionMap: { value: renderTarget.texture },
      uWaterColor: { value: new THREE.Color('#030814') },
      uDeepColor: { value: new THREE.Color('#010307') },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec4 vScreenPos;
      varying vec3 vWorldPos;

      void main() {
        vUv = uv;
        
        // Gentle wave displacement
        vec3 pos = position;
        float wave1 = sin(pos.x * 1.2 + uTime * 1.5) * cos(pos.y * 1.5 + uTime * 1.2) * 0.08;
        float wave2 = sin(pos.x * 2.5 - uTime * 2.0) * 0.04;
        pos.z += wave1 + wave2;

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = worldPos.xyz;

        vec4 clipPos = projectionMatrix * viewMatrix * worldPos;
        vScreenPos = clipPos;
        gl_Position = clipPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform sampler2D uReflectionMap;
      uniform vec3 uWaterColor;
      uniform vec3 uDeepColor;
      varying vec2 vUv;
      varying vec4 vScreenPos;
      varying vec3 vWorldPos;

      // Pseudo-random noise for water ripple distortion
      float noise(vec2 p) {
        return sin(p.x * 6.0 + uTime * 2.2) * cos(p.y * 8.0 + uTime * 1.8) * 0.015
             + sin(p.x * 14.0 - uTime * 3.5 + p.y * 10.0) * 0.008;
      }

      void main() {
        // Perspective projection screen coordinates
        vec2 screenUv = vScreenPos.xy / vScreenPos.w * 0.5 + 0.5;

        // Animate water normal distortion
        float dX = noise(vUv * 8.0);
        float dY = noise(vUv * 8.0 + vec2(2.4, 1.7));

        vec2 distortedUv = screenUv + vec2(dX, dY * 0.5);
        distortedUv = clamp(distortedUv, 0.001, 0.999);

        // Sample reflected scene
        vec3 refl = texture2D(uReflectionMap, distortedUv).rgb;

        // Depth & distance gradient
        float depth = smoothstep(0.0, 1.0, vUv.y);
        vec3 baseWater = mix(uWaterColor, uDeepColor, depth);

        // Fresnel term (grazing angles reflect more light)
        float fresnel = pow(1.0 - vUv.y, 2.2) * 0.75 + 0.25;

        vec3 finalColor = mix(baseWater, refl * 0.9, fresnel);

        // Shimmering specular highlights on wave crests
        float crest = max(0.0, dX + dY) * 6.0;
        finalColor += vec3(1.0, 0.8, 0.4) * crest * (1.0 - depth);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    depthWrite: true,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -2.5, 0);

  return { mesh, mat };
}

/* ─────────────────────────── Gate Interior Shader ──────────────────────── */
function createInteriorShader(interiorTexture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: interiorTexture },
      uAspectPlane: { value: (2.8 * 0.58) / (4.3 * 0.72) }, // ~0.524
      uAspectTex: { value: 1920.0 / 1080.0 },               // 1.7778
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uAspectPlane;
      uniform float uAspectTex;
      varying vec2 vUv;

      void main() {
        // Cover UV mapping (preserves 16:9 ratio without stretching)
        vec2 uv = vUv;
        float planeAspect = uAspectPlane;
        float texAspect = uAspectTex;

        if (planeAspect < texAspect) {
          float scale = planeAspect / texAspect;
          uv.x = (uv.x - 0.5) * scale + 0.5;
        } else {
          float scale = texAspect / planeAspect;
          uv.y = (uv.y - 0.5) * scale + 0.5;
        }

        vec4 col = texture2D(uTexture, uv);

        // Arch-top soft clipping mask to perfectly fit inside archway
        float normX = abs(vUv.x - 0.5) * 2.0; // 0 at center, 1 at side edges
        float normY = vUv.y;

        float mask = 1.0;

        // Side edge soft fade
        mask *= smoothstep(1.0, 0.82, normX);

        // Bottom edge soft fade
        mask *= smoothstep(0.0, 0.08, normY);

        // Top arch dome curve (vUv.y > 0.62)
        if (normY > 0.62) {
          float domeRadius = length(vec2(normX * 0.8, (normY - 0.62) * 2.4));
          mask *= smoothstep(1.0, 0.75, domeRadius);
        }

        gl_FragColor = vec4(col.rgb, col.a * mask);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}

/* ─────────────────────────── Gate Data & Factory ───────────────────────── */
interface GateData {
  group: THREE.Group;
  interiorMesh: THREE.Mesh;
  baseMesh: THREE.Mesh;
  glowMesh: THREE.Mesh;
  textMesh: THREE.Mesh;
  glowMat: THREE.MeshBasicMaterial;
  baseMat: THREE.MeshBasicMaterial;
  textMat: THREE.MeshBasicMaterial;
  pointLight: THREE.PointLight;
  hoverProgress: number;
  domain: (typeof DOMAINS)[number];
}

function createGate(
  domain: (typeof DOMAINS)[number],
  loader: THREE.TextureLoader
): GateData {
  const group = new THREE.Group();
  group.position.set(domain.xPos, domain.yPos, 0);
  group.rotation.y = domain.rotY;

  // Gate Frame Dimensions
  const W = 2.8;
  const H = 4.3;

  /* 1. Interior Portal World View (Layer 1 - Back) */
  const interiorTex = loader.load(domain.interior);
  interiorTex.colorSpace = THREE.SRGBColorSpace;
  interiorTex.generateMipmaps = false;
  interiorTex.minFilter = THREE.LinearFilter;
  const interiorMat = createInteriorShader(interiorTex);

  // Interior plane sized strictly to fit inside stone arch pillars
  const intW = W * 0.58; // 1.62
  const intH = H * 0.72; // 3.09
  const interiorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(intW, intH),
    interiorMat
  );
  interiorMesh.position.set(0, -0.28, -0.04);
  group.add(interiorMesh);

  /* 2. Gate Glow Effect (Layer 2 - Placed BEHIND Gate Base at z = -0.02) */
  const glowTex = loader.load(domain.glow);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  glowTex.generateMipmaps = false;
  glowTex.minFilter = THREE.LinearFilter;
  const glowMat = new THREE.MeshBasicMaterial({
    map: glowTex,
    transparent: true,
    opacity: 0.0, // Hidden when not hovered
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.08, H * 1.08), glowMat);
  glowMesh.position.set(0, 0, -0.02); // BEHIND gate base structure
  group.add(glowMesh);

  /* 3. Gate Base Archway Structure (Layer 3 - Middle at z = 0.0, exact image colors) */
  const baseTex = loader.load(domain.base);
  baseTex.colorSpace = THREE.SRGBColorSpace;
  baseTex.generateMipmaps = false;
  baseTex.minFilter = THREE.LinearFilter;
  const baseMat = new THREE.MeshBasicMaterial({
    map: baseTex,
    transparent: true,
    alphaTest: 0.02,
  });
  const baseMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), baseMat);
  baseMesh.position.z = 0.0;
  group.add(baseMesh);

  /* 4. Text Label directly on Gate (Layer 4 - Front overlay) */
  const textTex = createGateTextTexture(domain.code, domain.name);
  const textMat = new THREE.MeshBasicMaterial({
    map: textTex,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), textMat);
  textMesh.position.set(0, -1.35, 0.05);
  group.add(textMesh);

  /* 5. Golden Point Light at Base of Gate */
  const pointLight = new THREE.PointLight('#ffaa22', 0.6, 8, 2);
  pointLight.position.set(0, -2.0, 0.8);
  group.add(pointLight);

  return {
    group,
    interiorMesh,
    baseMesh,
    glowMesh,
    textMesh,
    glowMat,
    baseMat,
    textMat,
    pointLight,
    hoverProgress: 0,
    domain,
  };
}

/* ─────────────────────────── Easing Utility ────────────────────────────── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ─────────────────────────── Main Component ────────────────────────────── */
interface ThreeSceneProps {
  onHoverChange?: (id: string | null) => void;
  onDomainSelect?: (id: string | null) => void;
  requestZoomOut?: boolean;
  onZoomOutComplete?: () => void;
}

export default function ThreeScene({ onHoverChange, onDomainSelect, requestZoomOut, onZoomOutComplete }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<string | null>(null);

  // Refs for zoom interaction — stable across renders
  const zoomPhaseRef = useRef<'idle' | 'zooming-in' | 'open' | 'zooming-out'>('idle');
  const zoomProgressRef = useRef(0);
  const zoomGateIdRef = useRef<string | null>(null);
  const zoomCameraFromRef = useRef(new THREE.Vector3(0, 0.4, 11.5));
  const zoomCameraToRef = useRef(new THREE.Vector3());
  const zoomLookAtFromRef = useRef(new THREE.Vector3(0, 0.1, 0));
  const zoomLookAtToRef = useRef(new THREE.Vector3());
  const onDomainSelectRef = useRef(onDomainSelect);
  const onZoomOutCompleteRef = useRef(onZoomOutComplete);
  const requestZoomOutRef = useRef(requestZoomOut);

  // Keep refs in sync with latest props
  useEffect(() => { onDomainSelectRef.current = onDomainSelect; }, [onDomainSelect]);
  useEffect(() => { onZoomOutCompleteRef.current = onZoomOutComplete; }, [onZoomOutComplete]);

  // Handle requestZoomOut prop changes
  useEffect(() => {
    requestZoomOutRef.current = requestZoomOut;
    if (requestZoomOut && zoomPhaseRef.current === 'open') {
      zoomPhaseRef.current = 'zooming-out';
      zoomProgressRef.current = 0;
    }
  }, [requestZoomOut]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    /* ── Scene & Main Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      46,
      mount.clientWidth / mount.clientHeight,
      0.1,
      150
    );
    camera.position.set(0, 0.4, 11.5);
    camera.lookAt(0, 0.1, 0);

    /* ── Mirror Camera & Water Render Target ── */
    const isMobileInit = mount.clientWidth < 768;
    const waterRenderTarget = new THREE.WebGLRenderTarget(
      isMobileInit ? 512 : 1024,
      isMobileInit ? 256 : 512,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );
    const mirrorCamera = new THREE.PerspectiveCamera(
      46,
      mount.clientWidth / mount.clientHeight,
      0.1,
      150
    );

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight('#253048', 0.85));

    const rimLight = new THREE.DirectionalLight('#6a90d8', 1.2);
    rimLight.position.set(0, 12, -14);
    scene.add(rimLight);

    const keyLight = new THREE.DirectionalLight('#ffd070', 0.8);
    keyLight.position.set(0, 10, 10);
    scene.add(keyLight);

    const fillLeft = new THREE.PointLight('#ffaa33', 0.8, 20, 2);
    fillLeft.position.set(-8, -1, 4);
    scene.add(fillLeft);

    const fillRight = new THREE.PointLight('#ffaa33', 0.8, 20, 2);
    fillRight.position.set(8, -1, 4);
    scene.add(fillRight);

    /* ── Texture Loader ── */
    const texLoader = new THREE.TextureLoader();

    /* ── Background ── */
    const { mesh: bgMesh, mat: bgMat } = createBackground(texLoader);
    scene.add(bgMesh);

    /* ── Fog Planes ── */
    const { mesh: fog1, mat: fogMat1 } = createFogPlane(0.38, 0.04);
    fog1.position.set(0, -1.8, -3);
    scene.add(fog1);

    const { mesh: fog2, mat: fogMat2 } = createFogPlane(0.22, 0.025);
    fog2.position.set(0, -0.8, -5);
    fog2.scale.set(1.3, 1.0, 1);
    scene.add(fog2);

    /* ── Moving Water ── */
    const { mesh: waterMesh, mat: waterMat } = createWaterSystem(waterRenderTarget);
    scene.add(waterMesh);

    /* ── Gates ── */
    const gates: GateData[] = DOMAINS.map((d) => createGate(d, texLoader));
    gates.forEach((g) => scene.add(g.group));

    /* ── Particles ── */
    const { points: dust, velocities: dustV } = createParticleSystem(
      140,
      [28, 12, 12],
      '#ffe8b0',
      0.06
    );
    scene.add(dust);

    const { points: embers, velocities: emberV } = createParticleSystem(
      80,
      [20, 10, 8],
      '#ff9822',
      0.08
    );
    scene.add(embers);

    /* ── Raycaster & Hitboxes ── */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const cameraTarget = new THREE.Vector3(0, 0.1, 0);
    const cameraPos = new THREE.Vector3(0, 0.4, 11.5);

    const hitboxes: Array<{ mesh: THREE.Mesh; gate: GateData }> = gates.map((g) => {
      const hbGeo = new THREE.PlaneGeometry(2.8, 4.3);
      const hbMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.FrontSide });
      const hbMesh = new THREE.Mesh(hbGeo, hbMat);
      hbMesh.position.copy(g.group.position);
      hbMesh.rotation.copy(g.group.rotation);
      scene.add(hbMesh);
      return { mesh: hbMesh, gate: g };
    });

    /* ── Dynamic Layout Update (Desktop vs Mobile 2x2) ── */
    const updateLayout = (w: number, h: number) => {
      const isMobile = w < 768;
      const layout = isMobile ? DOMAINS_LAYOUT_MOBILE : DOMAINS_LAYOUT_DESKTOP;

      gates.forEach((g) => {
        const config = layout[g.domain.id];
        if (config) {
          g.group.position.set(config.xPos, config.yPos, 0);
          g.group.rotation.y = config.rotY;
        }
      });

      hitboxes.forEach((h) => {
        h.mesh.position.copy(h.gate.group.position);
        h.mesh.rotation.copy(h.gate.group.rotation);
      });

      if (isMobile) {
        camera.fov = 24;
        waterMesh.position.set(0, -4.8, 0);
        fog1.position.set(0, -4.0, -3);
        fog2.position.set(0, -2.5, -5);
        if (zoomPhaseRef.current === 'idle') {
          cameraPos.set(0, 0.0, 30.0);
          cameraTarget.set(0, 0.0, 0);
        }
      } else {
        camera.fov = 46;
        waterMesh.position.set(0, -2.5, 0);
        fog1.position.set(0, -1.8, -3);
        fog2.position.set(0, -0.8, -5);
        if (zoomPhaseRef.current === 'idle') {
          cameraPos.set(0, 0.4, 11.5);
          cameraTarget.set(0, 0.1, 0);
        }
      }

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      mirrorCamera.aspect = w / h;
      mirrorCamera.fov = camera.fov;
      mirrorCamera.updateProjectionMatrix();
    };

    updateLayout(mount.clientWidth, mount.clientHeight);

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Disable hover raycasting during zoom
      if (zoomPhaseRef.current !== 'idle') {
        mount.style.cursor = 'auto';
        return;
      }

      raycaster.setFromCamera(pointer, camera);
      const meshes = hitboxes.map((h) => h.mesh);
      const hits = raycaster.intersectObjects(meshes);

      if (hits.length > 0) {
        const hitGate = hitboxes.find((h) => h.mesh === hits[0].object)?.gate;
        if (hitGate && hoveredRef.current !== hitGate.domain.id) {
          hoveredRef.current = hitGate.domain.id;
          onHoverChange?.(hitGate.domain.id);
          mount.style.cursor = 'pointer';
        }
      } else {
        if (hoveredRef.current !== null) {
          hoveredRef.current = null;
          onHoverChange?.(null);
          mount.style.cursor = 'auto';
        }
      }

      // Parallax mouse camera offset (only when idle on desktop)
      const isMobile = mount.clientWidth < 768;
      if (isMobile) {
        cameraPos.x = 0.0;
        cameraPos.y = 0.0;
      } else {
        cameraPos.x = THREE.MathUtils.lerp(cameraPos.x, pointer.x * 0.4, 0.05);
        cameraPos.y = THREE.MathUtils.lerp(cameraPos.y, 0.4 + pointer.y * 0.25, 0.05);
      }
    };
    mount.addEventListener('pointermove', onPointerMove);

    /* ── Click Handler for Gate Selection ── */
    const onPointerDown = (e: PointerEvent) => {
      // Only process left clicks
      if (e.button !== 0) return;
      // Block clicks during any animation
      if (zoomPhaseRef.current !== 'idle') return;

      const rect = mount.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const py = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(px, py), camera);
      const meshes = hitboxes.map((h) => h.mesh);
      const hits = raycaster.intersectObjects(meshes);

      if (hits.length > 0) {
        const hitGate = hitboxes.find((h) => h.mesh === hits[0].object)?.gate;
        if (hitGate) {
          // Capture current camera state as the "from" position
          zoomCameraFromRef.current.copy(camera.position);
          zoomLookAtFromRef.current.copy(cameraTarget);

          // Compute zoom target: move camera toward the gate
          const gateWorldPos = new THREE.Vector3();
          hitGate.group.getWorldPosition(gateWorldPos);
          const isMobile = mount.clientWidth < 768;
          zoomCameraToRef.current.set(
            gateWorldPos.x * 0.85,
            gateWorldPos.y + (isMobile ? 0.1 : 0.35),
            isMobile ? 7.2 : 6.0
          );
          zoomLookAtToRef.current.set(
            gateWorldPos.x * 0.85,
            gateWorldPos.y + (isMobile ? 0.1 : 0.35),
            0
          );

          zoomGateIdRef.current = hitGate.domain.id;
          zoomProgressRef.current = 0;
          zoomPhaseRef.current = 'zooming-in';

          // Clear hover state
          hoveredRef.current = null;
          onHoverChange?.(null);
          mount.style.cursor = 'auto';
        }
      }
    };
    mount.addEventListener('pointerdown', onPointerDown);

    /* ── Animation Loop ── */
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      // 1. Camera — handle zoom animation or default parallax
      const phase = zoomPhaseRef.current;

      if (phase === 'zooming-in' || phase === 'zooming-out') {
        const ZOOM_IN_DURATION = 0.8;  // seconds
        const ZOOM_OUT_DURATION = 0.65; // seconds
        const duration = phase === 'zooming-in' ? ZOOM_IN_DURATION : ZOOM_OUT_DURATION;

        zoomProgressRef.current = Math.min(zoomProgressRef.current + delta / duration, 1.0);
        const t = easeInOutCubic(zoomProgressRef.current);

        if (phase === 'zooming-in') {
          camera.position.lerpVectors(zoomCameraFromRef.current, zoomCameraToRef.current, t);
          cameraTarget.lerpVectors(zoomLookAtFromRef.current, zoomLookAtToRef.current, t);
        } else {
          // Reverse: from zoomed position back to original
          camera.position.lerpVectors(zoomCameraToRef.current, zoomCameraFromRef.current, t);
          cameraTarget.lerpVectors(zoomLookAtToRef.current, zoomLookAtFromRef.current, t);
        }
        camera.lookAt(cameraTarget);

        // Also sync cameraPos so parallax doesn't jerk when we resume idle
        cameraPos.copy(camera.position);

        if (zoomProgressRef.current >= 1.0) {
          if (phase === 'zooming-in') {
            zoomPhaseRef.current = 'open';
            // Notify parent that zoom-in is complete
            onDomainSelectRef.current?.(zoomGateIdRef.current);
          } else {
            zoomPhaseRef.current = 'idle';
            zoomGateIdRef.current = null;
            // Reset camera to default parallax origin
            const isMobile = mount.clientWidth < 768;
            cameraPos.set(0, isMobile ? 0.0 : 0.4, isMobile ? 30.0 : 11.5);
            cameraTarget.set(0, isMobile ? 0.0 : 0.1, 0);
            camera.position.copy(cameraPos);
            camera.lookAt(cameraTarget);
            onDomainSelectRef.current?.(null);
            onZoomOutCompleteRef.current?.();
          }
        }
      } else if (phase === 'open') {
        // Keep camera locked at zoom target, no parallax
        camera.lookAt(cameraTarget);
      } else {
        // Default idle: parallax lerp
        camera.position.lerp(cameraPos, delta * 3.0);
        camera.lookAt(cameraTarget);
      }

      // 2. Mirror Camera Sync for Water Reflection
      mirrorCamera.aspect = camera.aspect;
      mirrorCamera.fov = camera.fov;
      mirrorCamera.position.set(camera.position.x, -camera.position.y - 5.0, camera.position.z);
      mirrorCamera.lookAt(cameraTarget.x, -cameraTarget.y - 5.0, cameraTarget.z);
      mirrorCamera.updateProjectionMatrix();

      // Render Reflection
      waterMesh.visible = false;
      renderer.setRenderTarget(waterRenderTarget);
      renderer.clear();
      renderer.render(scene, mirrorCamera);
      renderer.setRenderTarget(null);
      waterMesh.visible = true;

      // 3. Update Shaders
      (bgMat.uniforms.uTime as { value: number }).value = elapsed;
      (fogMat1.uniforms.uTime as { value: number }).value = elapsed;
      (fogMat2.uniforms.uTime as { value: number }).value = elapsed * 0.7;
      (waterMat.uniforms.uTime as { value: number }).value = elapsed;

      // 4. Update Gate States
      gates.forEach((g) => {
        const isHovered = hoveredRef.current === g.domain.id;
        g.hoverProgress = THREE.MathUtils.lerp(
          g.hoverProgress,
          isHovered ? 1.0 : 0.0,
          delta * 7.5
        );
        const p = g.hoverProgress;

        // Gate scale bump on hover (desktop only to prevent mobile touch grid shift)
        const isMobile = mount.clientWidth < 768;
        const s = isMobile ? 1.0 : (1.0 + p * 0.06);
        g.group.scale.set(s, s, s);

        // Gate Glow attached behind gate (opacity 0 when idle -> 1.0 on hover)
        g.glowMat.opacity = p * 1.0;

        // Base light intensity
        g.pointLight.intensity = 0.6 + p * 3.8;
        g.pointLight.color.setStyle(isHovered ? '#ffd455' : '#ffaa22');
      });

      // 5. Particle Systems
      const dPos = dust.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dPos.length / 3; i++) {
        dPos[i * 3] += dustV[i * 3];
        dPos[i * 3 + 1] += dustV[i * 3 + 1];
        if (dPos[i * 3 + 1] > 10) dPos[i * 3 + 1] = -2;
        if (dPos[i * 3] > 14) dPos[i * 3] = -14;
        if (dPos[i * 3] < -14) dPos[i * 3] = 14;
      }
      dust.geometry.attributes.position.needsUpdate = true;

      const ePos = embers.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < ePos.length / 3; i++) {
        ePos[i * 3] += Math.sin(ePos[i * 3 + 1] * 1.5 + elapsed) * 0.003;
        ePos[i * 3 + 1] += emberV[i * 3 + 1];
        if (ePos[i * 3 + 1] > 9) {
          ePos[i * 3 + 1] = -2;
          ePos[i * 3] = (Math.random() - 0.5) * 20;
        }
      }
      embers.geometry.attributes.position.needsUpdate = true;

      // Main Render
      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const isMobile = w < 768;
      updateLayout(w, h);
      renderer.setSize(w, h);
      waterRenderTarget.setSize(isMobile ? 512 : 1024, isMobile ? 256 : 512);
    };
    window.addEventListener('resize', onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      waterRenderTarget.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [onHoverChange]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#020408' }}
    />
  );
}
