'use client';

import React from 'react';
import { DOMAIN_ASSETS, DomainItem } from '@/lib/assets';

interface DomainLabelProps {
  hoveredDomain: string | null;
  onSelectDomain?: (id: string) => void;
}

export const DomainLabel: React.FC<DomainLabelProps> = ({
  hoveredDomain,
  onSelectDomain,
}) => {
  const activeItem: DomainItem | undefined = hoveredDomain
    ? DOMAIN_ASSETS[hoveredDomain as keyof typeof DOMAIN_ASSETS]
    : undefined;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-4xl px-4 flex flex-col items-center select-none">
      {/* Dynamic Info Panel on Hover */}
      <div
        className={`transition-all duration-500 ease-out transform ${
          activeItem
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
        } bg-slate-950/75 backdrop-blur-md border border-amber-500/30 rounded-xl px-6 py-4 text-center max-w-lg shadow-[0_0_40px_rgba(217,119,6,0.25)]`}
      >
        {activeItem && (
          <>
            <div className="text-amber-400 text-xs tracking-[0.3em] font-semibold uppercase mb-1">
              {activeItem.subtitle}
            </div>
            <div className="title-domains text-2xl md:text-3xl tracking-[0.2em] font-bold mb-1">
              {activeItem.name}
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed opacity-90">
              {activeItem.description}
            </p>
          </>
        )}
      </div>

      {/* Floating domain code indicators across bottom */}
      <div className="flex items-center justify-center gap-8 md:gap-16 mt-4 pointer-events-auto">
        {(Object.keys(DOMAIN_ASSETS) as Array<keyof typeof DOMAIN_ASSETS>).map((key) => {
          const item = DOMAIN_ASSETS[key];
          const isHovered = hoveredDomain === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectDomain?.(item.id)}
              className={`group relative px-4 py-2 flex flex-col items-center transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'
              }`}
            >
              <span
                className={`label-gold text-lg md:text-2xl transition-all duration-300 ${
                  isHovered ? 'label-glow-active' : ''
                }`}
              >
                {item.code}
              </span>
              <span
                className={`h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-all duration-300 ${
                  isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
