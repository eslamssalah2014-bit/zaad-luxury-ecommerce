'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Award, Sparkles, Compass } from 'lucide-react';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { HeroConfig } from '@/types/cms';

interface HeroSectionProps {
  initialHero?: HeroConfig;
}

export default function HeroSection({ initialHero }: HeroSectionProps) {
  const hero = initialHero || DEFAULT_CMS_SETTINGS.hero;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-zaad-950 text-white">
      
      {/* Cinematic Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.backgroundImageUrl || '/images/zaad-nature-honey-clover.jpg'}
          alt="عسل زاد الملكي النقي"
          fill
          className="object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
          priority
        />
        {/* Deep Green & Obsidian Luxury Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-zaad-950 via-zaad-950/70 to-zaad-900/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,22,12,0.85)_100%)]"></div>
      </div>

      {/* Decorative Gold Ambient Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
        
        {/* Luxury Top Tag */}
        {hero.badgeTextAr && (
          <div className="inline-flex items-center gap-2 bg-zaad-900/80 border border-gold-500/40 px-4 py-1.5 rounded-full mb-8 shadow-gold-glow animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-semibold tracking-wider text-gold-300">
              {hero.badgeTextAr}
            </span>
          </div>
        )}

        {/* Cinematic Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ivory-50 leading-[1.2] mb-6 max-w-4xl mx-auto">
          {hero.headlineAr}
          {hero.headlineHighlightAr && (
            <span className="block text-gold-400 font-serif font-normal mt-2">
              {hero.headlineHighlightAr}
            </span>
          )}
        </h1>

        {/* Subtitle Statement */}
        <p className="text-base sm:text-xl text-ivory-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.descriptionAr}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          {hero.primaryCtaTextAr && (
            <Link
              href={hero.primaryCtaLink || '/shop'}
              className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-400 text-zaad-950 font-bold text-sm rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 gold-shimmer-btn"
            >
              <span>{hero.primaryCtaTextAr}</span>
              <ArrowLeft className="w-4 h-4 text-zaad-950" />
            </Link>
          )}

          {hero.secondaryCtaTextAr && (
            <Link
              href={hero.secondaryCtaLink || '/story'}
              className="w-full sm:w-auto px-8 py-4 bg-zaad-900/80 hover:bg-zaad-800 text-ivory-100 border border-gold-400/40 hover:border-gold-400 font-semibold text-sm rounded-full backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>{hero.secondaryCtaTextAr}</span>
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}
