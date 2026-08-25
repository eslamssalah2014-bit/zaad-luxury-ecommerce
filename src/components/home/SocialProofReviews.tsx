'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { TestimonialsSectionConfig, CmsTestimonialItem } from '@/types/cms';

export default function SocialProofReviews() {
  const [config, setConfig] = useState<TestimonialsSectionConfig>(DEFAULT_CMS_SETTINGS.testimonials);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const res = await fetch('/api/cms/content');
        const json = await res.json();
        if (isMounted && json.success && json.data?.testimonials) {
          setConfig(json.data.testimonials);
        }
      } catch (err) {
        console.warn('Testimonials using default luxury fallback:', err);
      }
    }
    loadTestimonials();
    return () => { isMounted = false; };
  }, []);

  if (!config.isEnabled) return null;

  const visibleItems = (config.items || [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order)
    .slice(0, config.displayCount || 6);

  if (visibleItems.length === 0) return null;

  const isDark =
    config.backgroundColor?.startsWith('#0') ||
    config.backgroundColor?.includes('zaad') ||
    config.backgroundColor === '#07160c';

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % visibleItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + visibleItems.length) % visibleItems.length);
  };

  return (
    <section
      style={{
        backgroundColor: config.backgroundColor || (isDark ? '#07160c' : '#faf7f0'),
        color: config.textColor || (isDark ? '#fbf8f1' : '#0f2918')
      }}
      className={`py-24 relative overflow-hidden transition-colors duration-300 font-arabic border-t ${
        isDark ? 'border-gold-500/30' : 'border-ivory-300'
      }`}
    >
      {/* Subtle Background Radial Shimmer */}
      {isDark && (
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          {config.subtitleAr && (
            <span className={`text-xs font-bold tracking-widest uppercase mb-2 block ${
              isDark ? 'text-gold-400' : 'text-gold-600'
            }`}>
              {config.subtitleAr}
            </span>
          )}

          <h2 className={`font-serif text-3xl sm:text-5xl font-bold leading-tight ${
            isDark ? 'text-ivory-50' : 'text-zaad-900'
          }`}>
            {config.mainTitleAr}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto my-5"></div>

          {config.descriptionAr && (
            <p className={`text-sm sm:text-base leading-relaxed font-light ${
              isDark ? 'text-ivory-300/90' : 'text-charcoal-700/80'
            }`}>
              {config.descriptionAr}
            </p>
          )}
        </div>

        {/* =========================================================================
            LAYOUT 1: GRID MODE
        ========================================================================= */}
        {config.layoutType === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleItems.map((item) => (
              <TestimonialCard key={item.id} item={item} isDark={isDark} />
            ))}
          </div>
        )}

        {/* =========================================================================
            LAYOUT 2: CAROUSEL / SLIDER MODE
        ========================================================================= */}
        {config.layoutType === 'carousel' && (
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(${carouselIndex * 100}%)` }}
              >
                {visibleItems.map((item) => (
                  <div key={item.id} className="w-full shrink-0 px-2">
                    <TestimonialCard item={item} isDark={isDark} isFeatured />
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            {visibleItems.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevSlide}
                  aria-label="السابق"
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                    isDark
                      ? 'bg-zaad-900/80 border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-zaad-950'
                      : 'bg-white border-ivory-300 text-zaad-900 hover:bg-gold-500 hover:text-zaad-950 shadow-sm'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {visibleItems.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCarouselIndex(dotIdx)}
                      aria-label={`شريحة ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        carouselIndex === dotIdx
                          ? 'w-7 bg-gold-500'
                          : isDark
                          ? 'w-2 bg-zaad-800'
                          : 'w-2 bg-ivory-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  aria-label="التالي"
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                    isDark
                      ? 'bg-zaad-900/80 border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-zaad-950'
                      : 'bg-white border-ivory-300 text-zaad-900 hover:bg-gold-500 hover:text-zaad-950 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

function TestimonialCard({
  item,
  isDark,
  isFeatured = false
}: {
  item: CmsTestimonialItem;
  isDark: boolean;
  isFeatured?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative group ${
        isDark
          ? 'bg-zaad-900/70 border-gold-500/30 text-ivory-100 hover:border-gold-400/60 shadow-xl'
          : 'bg-white border-ivory-300 text-charcoal-800 hover:border-gold-300 shadow-luxury'
      } ${isFeatured ? 'sm:p-12' : ''}`}
    >
      <Quote className={`w-10 h-10 absolute top-6 left-6 pointer-events-none transition-transform group-hover:scale-110 duration-300 ${
        isDark ? 'text-gold-400/15' : 'text-gold-500/15'
      }`} />

      <div className="space-y-4 relative z-10 text-right">
        
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (item.rating || 5)
                  ? 'fill-gold-400 text-gold-400'
                  : isDark
                  ? 'text-zaad-800'
                  : 'text-ivory-300'
              }`}
            />
          ))}
        </div>

        {/* Heading */}
        <h3 className={`font-serif font-bold leading-snug ${
          isFeatured ? 'text-xl sm:text-2xl' : 'text-lg'
        } ${isDark ? 'text-ivory-50' : 'text-zaad-900'}`}>
          {item.headingAr}
        </h3>

        {/* Content */}
        <p className={`leading-relaxed font-light ${
          isFeatured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
        } ${isDark ? 'text-ivory-200/90' : 'text-charcoal-700/90'}`}>
          &ldquo;{item.contentAr}&rdquo;
        </p>

      </div>

      {/* Author & Footer */}
      <div className={`pt-6 mt-6 border-t flex items-center justify-between relative z-10 ${
        isDark ? 'border-zaad-800/80' : 'border-ivory-200'
      }`}>
        <div className="flex items-center gap-3.5">
          
          {/* Avatar or Initials */}
          {item.customerImageUrl ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-400/50 shrink-0">
              <Image
                src={item.customerImageUrl}
                alt={item.customerName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 ${
              isDark
                ? 'bg-zaad-800 text-gold-300 border-gold-500/40'
                : 'bg-gold-50 text-zaad-900 border-gold-200'
            }`}>
              {item.customerName.charAt(0) || 'م'}
            </div>
          )}

          <div className="text-right">
            <h4 className={`text-sm font-bold leading-none ${
              isDark ? 'text-ivory-100' : 'text-zaad-900'
            }`}>
              {item.customerName}
            </h4>
            {item.customerTitleAr && (
              <p className={`text-xs mt-1 font-light ${
                isDark ? 'text-gold-300/80' : 'text-gold-700'
              }`}>
                {item.customerTitleAr}
              </p>
            )}
            {item.productPurchasedAr && !item.customerTitleAr && (
              <p className={`text-[11px] mt-1 ${
                isDark ? 'text-ivory-400' : 'text-charcoal-500'
              }`}>
                {item.productPurchasedAr}
              </p>
            )}
          </div>

        </div>

        <div className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${
          isDark
            ? 'text-gold-300 bg-zaad-950/80 border-gold-500/40'
            : 'text-gold-800 bg-gold-50/90 border-gold-200'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
          <span className="hidden sm:inline">مقتني معتمد</span>
        </div>
      </div>

    </div>
  );
}
