'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Award, Sparkles, Compass } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-zaad-950 text-white">
      
      {/* Cinematic Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=2000&q=90"
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
        <div className="inline-flex items-center gap-2 bg-zaad-900/80 border border-gold-500/40 px-4 py-1.5 rounded-full mb-8 shadow-gold-glow animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs font-semibold tracking-wider text-gold-300">
            المحصول الملكي الحصري • إصدار شتاء 2026
          </span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ivory-50 leading-[1.2] mb-6 max-w-4xl mx-auto">
          زاد ليست مجرد عسل..
          <span className="block text-gold-400 font-serif font-normal mt-2">
            بل إرثٌ من النقاء الملكي
          </span>
        </h1>

        {/* Subtitle Statement */}
        <p className="text-base sm:text-xl text-ivory-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          نقاءٌ مطلق مستخلص يدوياً من أودية دوعن وجبال عسير العذراء، غير مبستر وبإنزيمات حية كاملة، موثق بشهادات فحص مخبري مستقلة لكل برطمان.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-400 text-zaad-950 font-bold text-sm rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 gold-shimmer-btn"
          >
            <span>استكشاف المحصول الملكي</span>
            <ArrowLeft className="w-4 h-4 text-zaad-950" />
          </Link>

          <Link
            href="/story"
            className="w-full sm:w-auto px-8 py-4 bg-zaad-900/80 hover:bg-zaad-800 text-ivory-100 border border-gold-400/40 hover:border-gold-400 font-semibold text-sm rounded-full backdrop-blur-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>ميثاق وقصة زاد</span>
          </Link>
        </div>

        {/* Trust Credentials Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-zaad-800/80 max-w-3xl mx-auto text-right sm:text-center">
          
          <div className="flex items-center sm:flex-col justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-ivory-100">98.6%+ نقاء أحادي الزهرة</div>
              <div className="text-xs text-ivory-400 mt-0.5">موثق بالفحص المجهري لحبوب اللقاح</div>
            </div>
          </div>

          <div className="flex items-center sm:flex-col justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-ivory-100">0% تسخين أو معالجة حرارية</div>
              <div className="text-xs text-ivory-400 mt-0.5">خام بالكامل بكامل خواصه العلاجية</div>
            </div>
          </div>

          <div className="flex items-center sm:flex-col justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-ivory-100">أصل جغرافي معتمد (GIS)</div>
              <div className="text-xs text-ivory-400 mt-0.5">من أودية دوعن وجبال عسير الشاهقة</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
