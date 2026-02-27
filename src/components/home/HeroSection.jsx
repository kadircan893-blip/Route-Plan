import React from 'react';

const HeroSection = () => {
  return (
    <section className="text-center space-y-6 py-8 md:py-12">
      {/* Main Title */}
      <div className="space-y-4">
        <h1 className="font-sf-pro font-semibold text-4xl md:text-5xl lg:text-6xl text-dark-slate">
          Route-Plan ile Keşfet
        </h1>
        <p className="font-sf-pro font-semibold text-2xl md:text-3xl text-moss-green">
          Smart Journey Planner
        </p>
      </div>

      {/* Subtitle */}
      <p className="font-inter text-base md:text-lg text-dark-slate max-w-2xl mx-auto leading-relaxed">
        AI destekli akıllı seyahat planlayıcı ile hayalinizdeki rotayı oluşturun. 
        Şehrinizi seçin, tercihlerinizi belirleyin ve kişiselleştirilmiş gezi rotanızı keşfedin.
      </p>

      {/* Feature Tags */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <span className="px-4 py-2 bg-soft-mint text-moss-green font-inter font-medium text-sm rounded-full">
          🤖 AI Destekli
        </span>
        <span className="px-4 py-2 bg-soft-mint text-moss-green font-inter font-medium text-sm rounded-full">
          📍 Konum Bazlı
        </span>
        <span className="px-4 py-2 bg-soft-mint text-moss-green font-inter font-medium text-sm rounded-full">
          ⚡ Hızlı Planlama
        </span>
        <span className="px-4 py-2 bg-soft-mint text-moss-green font-inter font-medium text-sm rounded-full">
          🎯 Kişiselleştirilmiş
        </span>
      </div>

      {/* Decorative Wave */}
      <div className="pt-8">
        <svg 
          className="w-full h-8 text-moss-green opacity-20" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;