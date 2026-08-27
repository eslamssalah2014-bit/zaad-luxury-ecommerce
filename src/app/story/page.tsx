import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Heart, History, Award, CheckCircle2 } from 'lucide-react';
import { getCmsSettings } from '@/lib/services/cmsService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StoryPage() {
  const cmsSettings = await getCmsSettings(false);
  const story = cmsSettings.storyPage;
  const visibleChapters = (story.chapters || []).filter((c) => c.isVisible);

  return (
    <div className="min-h-screen bg-ivory-100 py-12 font-arabic">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          {story.metaBadgeAr && (
            <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
              {story.metaBadgeAr}
            </span>
          )}
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-zaad-900 leading-tight">
            {story.mainTitleAr}
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          <p className="text-base sm:text-lg text-charcoal-700/90 font-light leading-relaxed">
            {story.mainSubtitleAr}
          </p>
        </div>

        {/* Hero Banner Image */}
        {story.heroBannerImageUrl && (
          <div className="relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-500/20 mb-16">
            <Image
              src={story.heroBannerImageUrl}
              alt={story.heroBannerTitleAr || 'عسل زاد'}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/80 via-zaad-950/20 to-transparent"></div>
            <div className="absolute bottom-8 right-8 left-8 text-ivory-100 max-w-2xl">
              {story.heroBannerSubtitleAr && (
                <span className="text-xs text-gold-400 font-mono tracking-wider block mb-1">
                  {story.heroBannerSubtitleAr}
                </span>
              )}
              <h2 className="font-serif text-xl sm:text-3xl font-bold">{story.heroBannerTitleAr}</h2>
            </div>
          </div>
        )}

        {/* Story Narrative Sections */}
        <div className="space-y-16 text-charcoal-800 leading-relaxed font-light text-base sm:text-lg">
          
          {visibleChapters.map((chapter, idx) => {
            const isDark = idx % 2 === 1;

            return (
              <div
                key={chapter.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl shadow-sm border ${
                  isDark
                    ? 'bg-zaad-950 text-ivory-100 border-gold-500/30 shadow-2xl'
                    : 'bg-white text-charcoal-800 border-ivory-300'
                }`}
              >
                {/* Text Content */}
                <div className={`space-y-5 ${chapter.imageUrl ? (isDark ? 'md:col-span-7 order-1 md:order-2' : 'md:col-span-7') : 'col-span-12'}`}>
                  {chapter.periodTagAr && (
                    <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${
                      isDark
                        ? 'text-gold-400 bg-gold-950/80 border-gold-500/30'
                        : 'text-gold-600 bg-gold-50 border-gold-200'
                    }`}>
                      <History className="w-3.5 h-3.5" />
                      <span>{chapter.periodTagAr}</span>
                    </div>
                  )}

                  <h3 className={`font-serif text-2xl sm:text-3xl font-bold leading-snug ${
                    isDark ? 'text-ivory-50' : 'text-zaad-900'
                  }`}>
                    {chapter.titleAr}
                  </h3>

                  {(chapter.descriptionParagraphs || []).map((p, pIdx) => (
                    <p key={pIdx} className={isDark ? 'text-ivory-300 font-light text-sm sm:text-base leading-relaxed' : 'text-charcoal-700 leading-relaxed'}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Image */}
                {chapter.imageUrl && (
                  <div className={`flex flex-col items-center ${isDark ? 'md:col-span-5 order-2 md:order-1' : 'md:col-span-5'}`}>
                    <div className={`relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[500px] rounded-2xl overflow-hidden shadow-md ${
                      isDark ? 'border border-gold-500/30 bg-zaad-900' : 'border border-ivory-300 bg-ivory-50'
                    }`}>
                      <Image
                        src={chapter.imageUrl}
                        alt={chapter.titleAr}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    </div>
                    {chapter.imageCaptionAr && (
                      <p className={`text-xs text-center mt-3 font-serif tracking-wide ${
                        isDark ? 'text-gold-300/80' : 'text-charcoal-700/70'
                      }`}>
                        {chapter.imageCaptionAr}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Brand Promise Strip */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-ivory-300 shadow-sm space-y-8">
            <div className="max-w-3xl mx-auto space-y-6 text-center">
              
              <div className="bg-gradient-to-r from-zaad-900 via-zaad-950 to-zaad-900 text-ivory-50 p-8 sm:p-10 rounded-3xl border-2 border-gold-500/50 shadow-2xl text-center space-y-4">
                <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                  وعد دار زاد الصادق
                </span>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-300 leading-snug">
                  &ldquo;العسل يأتي من النحلة إليك... كما أرادته الطبيعة.&rdquo;
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-sm font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all gold-shimmer-btn"
                >
                  <span>استكشاف المنتجات الطبيعية المتاحة الآن</span>
                  <ArrowLeft className="w-4 h-4 text-zaad-950" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
