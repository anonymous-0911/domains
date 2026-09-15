'use client';

import React from 'react';
import { DOMAIN_ASSETS } from '@/lib/assets';
import { Gate } from './Gate';

interface GatesProps {
  hoveredDomain: string | null;
  onHoverDomain: (id: string | null) => void;
  onSelectDomain?: (id: string) => void;
}

export const Gates: React.FC<GatesProps> = ({
  hoveredDomain,
  onHoverDomain,
  onSelectDomain,
}) => {
  const domainKeys = (Object.keys(DOMAIN_ASSETS) as Array<keyof typeof DOMAIN_ASSETS>);

  return (
    <group position={[0, 0.4, 0]}>
      {domainKeys.map((key) => {
        const item = DOMAIN_ASSETS[key];
        return (
          <Gate
            key={item.id}
            domain={item}
            isHovered={hoveredDomain === item.id}
            onHover={onHoverDomain}
            onSelect={onSelectDomain}
          />
        );
      })}
    </group>
  );
};
