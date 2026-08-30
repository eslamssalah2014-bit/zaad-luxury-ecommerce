'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Send,
  ExternalLink,
  ShieldCheck,
  Award,
  Clock,
  Heart,
  Quote,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { CmsSettingsDocument } from '@/types/cms';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CmsSettingsDocument;
  onPublish: () => void;
  isPublishing?: boolean;
}

export default function LivePreviewModal({
  isOpen,
  onClose,
  settings,
  onPublish,
  isPublishing = false
}: LivePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'home' | 'story'>('home');

  if (!isOpen) return null;

  const deviceWidthClasses = {
    desktop: 'w-full max-w-full',
    tablet: 'w-[768px] max-w-full',
    mobile: 'w-[390px] max-w-full'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zaad-950/90 backdrop-blur-md animate-fade-in font-arabic">
      <div className="bg-ivory-100 w-full h-[95vh] rounded-3xl shadow-2xl border border-gold-500/40 flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-zaad-950 text-ivory-100 border-b border-zaad-800 flex items-center justify-between">
          
          {/* Left: Device Switchers */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gold-400 font-bold hidden sm:inline">وضع المعاينة:</span>
            <div className="bg-zaad-900 border border-gold-500/30 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  device === 'desktop' ? 'bg-gold-500 text-zaad-950' : 'text-ivory-300 hover:text-white'
                }`}
                title="شاشة كمبيوتر"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden md:inline">سطح المكتب</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  device === 'tablet' ? 'bg-gold-500 text-zaad-950' : 'text-ivory-300 hover:text-white'
                }`}
                title="جهاز لوحي"
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden md:inline">لوحي (Tablet)</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  device === 'mobile' ? 'bg-gold-500 text-zaad-950' : 'text-ivory-300 hover:text-white'
                }`}
                title="هاتف جوال"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden md:inline">جوال (Mobile)</span>
              </button>
            </div>
          </div>

          {/* Center: Page Switcher */}
          <div className="flex items-center gap-1 bg-zaad-900 border border-gold-500/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'home' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-ivory-300'
              }`}
            >
              الصفحة الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'story' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-ivory-300'
              }`}
            >
              صفحة القصة والتراث
            </button>
          </div>

          {/* Right: Publish & Close */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPublish}
              disabled={isPublishing}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-zaad-950 font-bold text-xs rounded-xl shadow-gold-glow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'جاري النشر...' : 'نشر التعديلات الحالية الآن'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-ivory-400 hover:text-white hover:bg-zaad-900 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Viewport Frame */}
        <div className="flex-1 bg-charcoal-900 p-4 sm:p-6 overflow-y-auto flex justify-center">
          <div
            className={`transition-all duration-300 shadow-2xl bg-ivory-100 rounded-2xl overflow-hidden flex flex-col border border-ivory-300 ${deviceWidthClasses[device]}`}
          >
            
            {/* 1. Dynamic Announcement Bar */}
            {settings.announcementBar.isEnabled && (
              <div
                style={{
                  backgroundColor: settings.announcementBar.backgroundColor,
                  color: settings.announcementBar.textColor
                }}
                className="text-xs py-2 px-4 border-b border-gold-500/20 tracking-wide text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span className="font-medium">{settings.announcementBar.messageTextAr}</span>
                  {settings.announcementBar.secondaryTextAr && (
                    <span className="text-gold-400 font-bold mr-2">{settings.announcementBar.secondaryTextAr}</span>
                  )}
                </div>
              </div>
            )}

            {/* 2. Dynamic Header */}
            <div className="bg-ivory-50/95 py-3 px-6 border-b border-ivory-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-400 bg-white p-0.5">
                  <Image src={settings.navigation.logoUrl || '/images/zaad-logo.png'} alt="ZAAD" fill className="object-contain" />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-zaad-900">
                    {settings.navigation.brandNameAr || 'زاد'}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-xs font-bold text-zaad-900">
                {settings.navigation.items.filter(i => i.isVisible).map(item => (
                  <span key={item.id} className="hover:text-gold-600 cursor-pointer">{item.nameAr}</span>
                ))}
              </div>
            </div>

            {/* 3. Page Content */}
            {activeTab === 'home' ? (
              <div className="flex-1 space-y-0">
                
                {/* Hero Section */}
                <section className="relative py-20 bg-zaad-950 text-white text-center overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={settings.hero.backgroundImageUrl || '/images/zaad-nature-honey-clover.jpg'}
                      alt="Hero"
                      fill
                      className="object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zaad-950 via-zaad-950/70 to-zaad-900/60"></div>
                  </div>

                  <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-zaad-900/80 border border-gold-500/40 px-4 py-1 rounded-full text-xs text-gold-300">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      <span>{settings.hero.badgeTextAr}</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                      {settings.hero.headlineAr}
                      <span className="block text-gold-400 font-normal mt-1">
                        {settings.hero.headlineHighlightAr}
                      </span>
                    </h1>

                    <p className="text-sm sm:text-base text-ivory-300 font-light max-w-xl mx-auto">
                      {settings.hero.descriptionAr}
                    </p>

                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button className="px-6 py-3 bg-gold-500 text-zaad-950 font-bold text-xs rounded-full shadow-lg">
                        {settings.hero.primaryCtaTextAr}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Trust Pillars */}
                <section className="py-8 bg-white border-b border-ivory-300 px-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {settings.hero.trustPillars.map(p => (
                      <div key={p.id} className="p-3">
                        <div className="text-xl font-bold text-zaad-900">{p.value}</div>
                        <div className="text-xs font-bold text-zaad-800">{p.labelAr}</div>
                        {p.sublabelAr && <div className="text-[10px] text-charcoal-700/70">{p.sublabelAr}</div>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dynamic Homepage Sections */}
                {settings.homepageSections.filter(s => s.isVisible).map(sec => (
                  <section
                    key={sec.id}
                    style={{ backgroundColor: sec.backgroundColor, color: sec.textColor }}
                    className="py-16 px-6 border-b border-gold-500/20"
                  >
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
                      {sec.imageUrl && (
                        <div className="w-full md:w-1/2">
                          <div className="relative h-[280px] sm:h-[340px] rounded-2xl overflow-hidden shadow-xl border border-gold-500/30 flex items-center justify-center p-2 bg-black/30">
                            <Image src={sec.imageUrl} alt={sec.titleAr} fill className="object-contain object-center" />
                          </div>
                        </div>
                      )}
                      <div className="w-full md:w-1/2 space-y-4 text-right">
                        {sec.subtitleAr && (
                          <span className="text-xs font-bold text-gold-400 bg-black/30 px-3 py-1 rounded-full border border-gold-500/30">
                            {sec.subtitleAr}
                          </span>
                        )}
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold">{sec.titleAr}</h3>
                        <p className="text-xs sm:text-sm leading-relaxed opacity-90">{sec.bodyAr}</p>
                        {sec.quoteAr && (
                          <div className="bg-black/30 border-r-4 border-gold-400 p-4 rounded-xl text-gold-300 font-serif text-xs">
                            &ldquo;{sec.quoteAr}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                ))}

              </div>
            ) : (
              /* Story Page Preview */
              <div className="p-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="text-xs font-bold text-gold-700 tracking-wider uppercase block">
                    {settings.storyPage.metaBadgeAr}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zaad-900">
                    {settings.storyPage.mainTitleAr}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                    {settings.storyPage.mainSubtitleAr}
                  </p>
                </div>

                <div className="space-y-8">
                  {settings.storyPage.chapters.filter(c => c.isVisible).map(ch => (
                    <div key={ch.id} className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                      {ch.imageUrl && (
                        <div className="w-full md:w-1/3">
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-ivory-200">
                            <Image src={ch.imageUrl} alt={ch.titleAr} fill className="object-cover" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 space-y-2 text-right">
                        <span className="text-[11px] font-bold text-gold-700 bg-gold-50 px-2.5 py-0.5 rounded-full border border-gold-200">
                          {ch.periodTagAr}
                        </span>
                        <h4 className="font-serif text-xl font-bold text-zaad-900">{ch.titleAr}</h4>
                        {ch.descriptionParagraphs.map((p, idx) => (
                          <p key={idx} className="text-xs text-charcoal-700 leading-relaxed">{p}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Dynamic Footer */}
            <footer className="bg-zaad-950 text-ivory-200 p-8 border-t-2 border-gold-600/40 text-xs">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-ivory-50">{settings.footer.brandSloganAr}</h4>
                  <p className="text-ivory-400 text-[11px] leading-relaxed max-w-sm">{settings.footer.aboutTextAr}</p>
                </div>
                {settings.footer.columns.map(col => (
                  <div key={col.id} className="space-y-2">
                    <h5 className="font-bold text-gold-300">{col.titleAr}</h5>
                    <ul className="space-y-1 text-ivory-400 text-[11px]">
                      {col.links.map(l => (
                        <li key={l.id}>{l.labelAr}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-zaad-800 pt-4 text-center text-[10px] text-ivory-400">
                {settings.footer.copyrightTextAr}
              </div>
            </footer>

          </div>
        </div>

      </div>
    </div>
  );
}
