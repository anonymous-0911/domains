'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/DomainsScene/ThreeScene'), {
  ssr: false,
  loading: () => <div style={{ position: 'absolute', inset: 0, background: '#020408' }} />,
});

const DOMAIN_INFO: Record<string, { code: string; name: string; subtitle: string; description: string }> = {
  ds: {
    code: 'DS',
    name: 'Data Science',
    subtitle: 'Data Analytics & Insights',
    description: 'Problem Statement'
  },
  ml: {
    code: 'ML',
    name: 'Machine Learning',
    subtitle: 'Adaptive Models & AI',
    description: 'Problem Statement'},
  nlp: {
    code: 'NLP',
    name: 'Natural Language Processing',
    subtitle: 'Language & Cognitive AI',
    description: 'Problem Statement'
  },
  cv: {
    code: 'CV',
    name: 'Computer Vision',
    subtitle: 'Visual Perception & Spatial AI',
    description: 'Problem Statement'
  },
};

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [requestZoomOut, setRequestZoomOut] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [cardExiting, setCardExiting] = useState(false);

  const handleHover = useCallback((id: string | null) => {
    setHovered(id);
  }, []);

  // Called by ThreeScene when zoom-in completes (id) or zoom-out completes (null)
  const handleDomainSelect = useCallback((id: string | null) => {
    if (id) {
      setSelectedDomain(id);
      // Small delay so the backdrop renders first, then the card animates in
      requestAnimationFrame(() => setCardVisible(true));
    } else {
      setSelectedDomain(null);
      setCardVisible(false);
      setCardExiting(false);
    }
  }, []);

  // Called by ThreeScene when zoom-out animation finishes
  const handleZoomOutComplete = useCallback(() => {
    setRequestZoomOut(false);
  }, []);

  // Trigger close: start card exit animation, then tell ThreeScene to zoom out
  const triggerClose = useCallback(() => {
    if (!selectedDomain || requestZoomOut) return;
    setCardExiting(true);
    // Wait for card exit animation (400ms) then trigger camera zoom-out
    setTimeout(() => {
      setRequestZoomOut(true);
    }, 350);
  }, [selectedDomain, requestZoomOut]);

  // Escape key handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDomain && !requestZoomOut) {
        triggerClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedDomain, requestZoomOut, triggerClose]);

  const domainData = selectedDomain ? DOMAIN_INFO[selectedDomain] : null;

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#020408',
        fontFamily: "'Michroma', sans-serif",
      }}
    >
      {/* 3D WebGL Scene */}
      <ThreeScene
        onHoverChange={handleHover}
        onDomainSelect={handleDomainSelect}
        requestZoomOut={requestZoomOut}
        onZoomOutComplete={handleZoomOutComplete}
      />

      {/* DOMAINS Header Title & Subtitle */}
      <div className="header-container">
        <h1 className="header-title">
          DOMAINS
        </h1>
        <p className={`header-subtitle ${selectedDomain ? 'hidden' : ''}`}>
          {hovered ? `${DOMAIN_INFO[hovered]?.name} — ${DOMAIN_INFO[hovered]?.subtitle}` : 'SELECT A REALM TO ENTER'}
        </p>
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(2,4,8,0.55) 75%, rgba(1,2,5,0.96) 100%)',
        }}
      />

      {/* Bottom dark gradient transition */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '10%',
          zIndex: 15,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(2,4,8,0.9) 0%, transparent 100%)',
        }}
      />

      {/* ─── Door Zoom Interaction: Backdrop ─── */}
      {selectedDomain && (
        <div
          className={`backdrop-realm ${cardVisible && !cardExiting ? 'backdrop-visible' : ''}`}
          onClick={triggerClose}
        />
      )}

      {/* ─── Door Zoom Interaction: Problem Statement Card ─── */}
      {selectedDomain && domainData && cardVisible && (
        <div
          className={`problem-card ${cardExiting ? 'card-exiting' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="problem-card__realm-badge">
            REALM
          </div>
          <h2 className="problem-card__code">
            {domainData.code}
          </h2>
          <h3 className="problem-card__name">
            {domainData.name}
          </h3>
          <div className="problem-card__divider" />
          <p className="problem-card__description">
            {domainData.description}
          </p>
        </div>
      )}
    </main>
  );
}
