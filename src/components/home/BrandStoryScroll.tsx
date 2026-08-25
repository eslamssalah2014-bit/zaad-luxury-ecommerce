'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  History,
  Crown,
  ArrowLeft,
  Sparkles,
  Quote,
  Award,
  Clock
} from 'lucide-react';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { HomepageSection } from '@/types/cms';

interface BrandStoryScrollProps {
  initialSections?: HomepageSection[];
}

export default function BrandStoryScroll({ initialSections }: BrandStoryScrollProps) {
  const sections = (initialSections || DEFAULT_CMS_SETTINGS.homepageSections).filter(s => s.isVisible);

  return (
    <div className="relative overflow-hidden font-arabic">

      {/* =========================================================================
          SECTION 1: Header & Luxury Trust Pillars
      ========================================================================= */}
      <section className="py-20 bg-ivory-50 border-b border-ivory-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-zaad-900/90 border border-gold-500/40 px-4 py-1.5 rounded-full mb-5 shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-bold text-gold-300 tracking-wider">
                فلسفة دار زاد • معايير التميز
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
              لماذا زاد مختلفة؟
            </h2>

            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-6"></div>

            <p className="text-base sm:text-xl text-charcoal-800/80 leading-relaxed font-light">
              أكثر من مجرد عسل طبيعي... فلسفة متوارثة من الجودة والأصالة.
            </p>
          </div>

          {/* Luxury Trust Pillars Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-luxury">
            
            <div className="flex flex-col items-center text-center p-4 border-b sm:border-b-0 sm:border-l border-ivory-200 last:border-l-0">
              <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex items-center justify-center mb-3 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-zaad-900">+40</span>
              <span className="text-xs font-bold text-zaad-800 mt-1">عاماً من الخبرة</span>
              <span className="text-[11px] text-charcoal-700/70 mt-0.5">منذ ثمانينيات القرن الماضي</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 border-b sm:border-b-0 sm:border-l border-ivory-200 last:border-l-0">
              <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex items-center justify-center mb-3 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-zaad-900">100%</span>
              <span className="text-xs font-bold text-zaad-800 mt-1">منتجات طبيعية</span>
              <span className="text-[11px] text-charcoal-700/70 mt-0.5">عسل نقي بدون إضافات</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:border-l border-ivory-200 last:border-l-0">
              <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex items-center justify-center mb-3 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-zaad-900">0%</span>
              <span className="text-xs font-bold text-zaad-800 mt-1">إضافات أو خلط</span>
              <span className="text-[11px] text-charcoal-700/70 mt-0.5">كما خلقته الطبيعة</span>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex items-center justify-center mb-3 shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">إرث</span>
              <span className="text-xs font-bold text-zaad-800 mt-1">متوارث عبر الأجيال</span>
              <span className="text-[11px] text-charcoal-700/70 mt-0.5">شغف لا ينتهي</span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          DYNAMIC HOMEPAGE SECTIONS
      ========================================================================= */}
      {sections.map((sec) => {
        const isDark = sec.backgroundColor?.startsWith('#0') || sec.backgroundColor?.includes('zaad') || sec.backgroundColor === '#07160c';
        const isImageLeft = sec.imagePosition === 'left';

        return (
          <section
            key={sec.id}
            style={{
              backgroundColor: sec.backgroundColor || (isDark ? '#07160c' : '#ffffff'),
              color: sec.textColor || (isDark ? '#fbf8f1' : '#0f2918')
            }}
            className={`py-24 sm:py-32 border-b relative overflow-hidden ${
              isDark ? 'border-gold-500/30' : 'border-ivory-300'
            }`}
          >
            {/* Subtle Ambient Radial Shimmer on Dark Sections */}
            {isDark && (
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className={`flex flex-col items-center gap-12 lg:gap-16 ${
                isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}>
                
                {/* Image Container */}
                {sec.imageUrl && (
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className={`relative w-full aspect-[16/10] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 group ${
                      isDark
                        ? 'border-gold-500/30 bg-zaad-950/80'
                        : 'border-ivory-300 bg-ivory-100 flex items-center justify-center'
                    }`}>
                      <Image
                        src={sec.imageUrl}
                        alt={sec.imageAltAr || sec.titleAr}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={90}
                      />
                      {isDark && (
                        <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/30 via-transparent to-transparent pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Container */}
                <div className={`w-full ${sec.imageUrl ? 'lg:w-1/2' : 'max-w-3xl mx-auto text-center'} space-y-6 text-right`}>
                  
                  {/* Badge */}
                  {sec.subtitleAr && (
                    <div className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1 rounded-full border ${
                      isDark
                        ? 'text-gold-400 bg-zaad-900/90 border-gold-500/30'
                        : 'text-gold-700 bg-gold-50 border-gold-200'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      <span>{sec.subtitleAr}</span>
                    </div>
                  )}

                  <h3 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
                    isDark ? 'text-ivory-50' : 'text-zaad-900'
                  }`}>
                    {sec.titleAr}
                  </h3>

                  {sec.bodyAr && (
                    <p className={`text-base sm:text-lg leading-relaxed font-light ${
                      isDark ? 'text-ivory-300/90' : 'text-charcoal-700/90'
                    }`}>
                      {sec.bodyAr}
                    </p>
                  )}

                  {/* Feature Bullets */}
                  {sec.features && sec.features.length > 0 && (
                    <div className={`border rounded-2xl p-4 sm:p-5 space-y-1.5 font-serif text-sm sm:text-base ${
                      isDark
                        ? 'bg-zaad-900/60 border-gold-500/20 text-gold-300'
                        : 'bg-gold-50/60 border-gold-200 text-gold-800'
                    }`}>
                      {sec.features.map((feat, fIdx) => (
                        <p key={fIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                          <span>{feat}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Stats Grid if defined */}
                  {sec.stats && sec.stats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {sec.stats.map(st => (
                        <div key={st.id} className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm text-center">
                          <span className="font-mono text-xl font-bold text-zaad-900 block">{st.value}</span>
                          <span className="text-xs text-charcoal-700/80 mt-1 block font-medium">{st.labelAr}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quote Box */}
                  {sec.quoteAr && (
                    <div className={`p-5 rounded-2xl shadow-sm border-r-4 ${
                      isDark
                        ? 'bg-zaad-900/90 border-gold-400 shadow-inner'
                        : 'bg-gold-50/80 border-gold-500'
                    }`}>
                      <div className="flex items-start gap-3">
                        <Quote className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                        <p className={`font-serif text-base sm:text-lg font-bold leading-relaxed ${
                          isDark ? 'text-gold-200' : 'text-zaad-950'
                        }`}>
                          &ldquo;{sec.quoteAr}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA Link */}
                  {sec.ctaTextAr && (
                    <div className="pt-2">
                      <Link
                        href={sec.ctaLink || '/story'}
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors group ${
                          isDark ? 'text-gold-400 hover:text-gold-300' : 'text-zaad-900 hover:text-gold-600'
                        }`}
                      >
                        <span>{sec.ctaTextAr}</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </section>
        );
      })}

      {/* =========================================================================
          FINAL LUXURY STATEMENT DIVIDER
      ========================================================================= */}
      <section className="py-24 bg-zaad-950 text-ivory-100 border-b-2 border-gold-500/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 justify-center">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-400"></span>
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold-400"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50 leading-tight">
            زاد... حيث يلتقي النقاء بالفخامة
          </h2>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-4"></div>

          <p className="text-base sm:text-xl text-ivory-300 font-light max-w-2xl mx-auto leading-relaxed">
            منتجات طبيعية مختارة بعناية، بمعايير جودة صارمة وتجربة استثنائية تليق بمن يقدّر الأفضل.
          </p>

          <div className="pt-4">
            <Link
              href="/story"
              className="inline-flex items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-sm font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all gold-shimmer-btn"
            >
              <span>اكتشف قصة زاد</span>
              <ArrowLeft className="w-4 h-4 text-zaad-950" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
