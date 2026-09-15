'use client';

import React from 'react';

export const DomainsTitle: React.FC = () => {
  return (
    <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center select-none w-full px-4">
      <h1 className="title-domains text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.25em] sm:tracking-[0.35em] uppercase font-black transition-all duration-700">
        DOMAINS
      </h1>
      <p className="text-gold-subtle text-xs sm:text-sm tracking-[0.4em] uppercase opacity-75 mt-2 font-medium">
        Select A Realm To Begin
      </p>
    </div>
  );
};
