'use client';

import React from 'react';
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
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function BrandStoryScroll() {
  return (
    <div className="relative overflow-hidden">

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
          SECTION 2: إرث من الشغف لا من التجارة (White Background Split Section)
      ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white border-b border-ivory-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Image (Right Side in RTL) */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-ivory-300 group bg-ivory-100 flex items-center justify-center">
                <Image
                  src="/images/zaad-heritage-beekeepers.jpg"
                  alt="إرث تربية النحل - زاد"
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content (Left Side in RTL) */}
            <div className="w-full lg:w-1/2 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-700 bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
                <Heart className="w-3.5 h-3.5 text-gold-600" />
                <span>الفلسفة الأولى • البدايات والشغف</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zaad-900 leading-tight">
                إرث من الشغف لا من التجارة
              </h3>

              <p className="text-base sm:text-lg text-charcoal-700/90 leading-relaxed font-light">
                لم تبدأ زاد كخطة تجارية أو مشروع استثماري، بل بدأت من شغف حقيقي بتربية النحل والمحافظة على جودة العسل كما خلقته الطبيعة. امتد هذا الشغف عبر الأجيال ليصبح إرثًا نحمله اليوم بكل فخر.
              </p>

              {/* Highlighted Quote Box */}
              <div className="bg-gold-50/80 border-r-4 border-gold-500 p-5 rounded-2xl shadow-sm">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <p className="font-serif text-base sm:text-lg font-bold text-zaad-950 leading-relaxed">
                    &ldquo;بعض العلامات التجارية تُبنى بالأفكار... أما زاد فبُنيت بالشغف.&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/story"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zaad-900 hover:text-gold-600 transition-colors group"
                >
                  <span>اكتشف قصة زاد التراثية الكاملة</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: من الخلية إلى المائدة كما خلقته الطبيعة (Deep ZAAD Green)
      ========================================================================= */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-zaad-950 via-zaad-900 to-zaad-950 text-ivory-100 border-b border-gold-500/30 relative overflow-hidden">
        
        {/* Subtle Ambient Radial Shimmer */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
            
            {/* Large Immersive Image (Left Side in RTL) */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-500/30 group bg-zaad-950/80">
                <Image
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85"
                  alt="أقراص شمع العسل النقي الخام"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Content (Right Side in RTL) */}
            <div className="w-full lg:w-1/2 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 bg-zaad-900/90 px-3.5 py-1 rounded-full border border-gold-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>النقاء المطلق • ميثاق الطبيعة</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight">
                من الخلية إلى المائدة كما خلقته الطبيعة
              </h3>

              <p className="text-base sm:text-lg text-ivory-300/90 leading-relaxed font-light">
                نؤمن أن الطبيعة قدمت لنا الكمال بالفعل، لذلك نحافظ على العسل في صورته الأصيلة دون إضافات أو معالجات تفقده هويته وقيمته الطبيعية.
              </p>

              {/* Poetic Philosophy Strip */}
              <div className="bg-zaad-900/60 border border-gold-500/20 rounded-2xl p-4 sm:p-5 space-y-1.5 text-gold-300 font-serif text-sm sm:text-base">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                  <span>لا نضيف شيئاً...</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                  <span>ولا ننزع شيئاً...</span>
                </p>
                <p className="flex items-center gap-2 font-bold text-gold-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                  <span>نحافظ فقط على ما منحته الطبيعة.</span>
                </p>
              </div>

              {/* Highlighted Quote Box */}
              <div className="bg-zaad-900/90 border-r-4 border-gold-400 p-5 rounded-2xl shadow-inner">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <p className="font-serif text-base sm:text-lg font-bold text-gold-200 leading-relaxed">
                    &ldquo;العسل يأتي من النحلة إليك... كما أرادته الطبيعة.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: أكثر من أربعة عقود من الخبرة المتوارثة (Timeline & Stats)
      ========================================================================= */}
      <section className="py-24 sm:py-32 bg-ivory-100/90 border-b border-ivory-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Image (Right Side in RTL) */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-ivory-300 group bg-ivory-200/50">
                <Image
                  src="/images/zaad-childhood-memories.jpg"
                  alt="أربعة عقود من الخبرة المتوارثة - زاد"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content (Left Side in RTL) */}
            <div className="w-full lg:w-1/2 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-700 bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
                <History className="w-3.5 h-3.5 text-gold-600" />
                <span>أصالة التراث • أربعة عقود</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zaad-900 leading-tight">
                أكثر من أربعة عقود من الخبرة المتوارثة
              </h3>

              <p className="text-base sm:text-lg text-charcoal-700/90 leading-relaxed font-light">
                منذ ثمانينيات القرن الماضي تراكمت المعرفة والخبرة جيلاً بعد جيل، ليس فقط في إنتاج العسل، بل في فهم مواسمه واختيار أفضل المحاصيل والمحافظة على أعلى مستويات الجودة.
              </p>

              {/* Luxury Timeline / Statistics Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm text-center">
                  <span className="font-mono text-xl font-bold text-zaad-900 block">+40 عاماً</span>
                  <span className="text-xs text-charcoal-700/80 mt-1 block font-medium">من الخبرة</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm text-center">
                  <span className="font-serif text-lg font-bold text-zaad-900 block">ثمانينيات</span>
                  <span className="text-xs text-charcoal-700/80 mt-1 block font-medium">القرن الماضي</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm text-center">
                  <span className="font-serif text-lg font-bold text-zaad-900 block">أجيال متعاقبة</span>
                  <span className="text-xs text-charcoal-700/80 mt-1 block font-medium">من الشغف</span>
                </div>
              </div>

              {/* Highlighted Quote Box */}
              <div className="bg-gold-50/80 border-r-4 border-gold-500 p-5 rounded-2xl shadow-sm">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <p className="font-serif text-base sm:text-lg font-bold text-zaad-950 leading-relaxed">
                    &ldquo;خبرة لا تُكتسب في سنوات قليلة... بل تُبنى عبر الأجيال.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: انتقاء ملكي لأفضل المحاصيل (Luxury Curation Section)
      ========================================================================= */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-zaad-950 via-zaad-900 to-zaad-950 text-ivory-100 border-b border-gold-500/30 relative overflow-hidden">
        
        {/* Subtle Ambient Radial Shimmer */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
            
            {/* Large Luxury Image (Left Side in RTL) */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-500/30 group bg-zaad-950/80">
                <Image
                  src="/images/zaad-story-hero-banner.jpg"
                  alt="انتقاء ملكي لمحاصيل عسل زاد"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Content (Right Side in RTL) */}
            <div className="w-full lg:w-1/2 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 bg-zaad-900/90 px-3.5 py-1 rounded-full border border-gold-500/30">
                <Crown className="w-3.5 h-3.5 text-gold-400" />
                <span>المحصول الملكي • معايير صارمة</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight">
                انتقاء ملكي لأفضل المحاصيل
              </h3>

              <p className="text-base sm:text-lg text-ivory-300/90 leading-relaxed font-light">
                ليست كل المحاصيل تحمل اسم زاد. نختار بعناية ما ينسجم مع معاييرنا في النقاء والجودة والطعم والقيمة الغذائية لنقدم مجموعة منتقاة لمن يبحث عن الأفضل.
              </p>

              {/* Highlighted Quote Box */}
              <div className="bg-zaad-900/90 border-r-4 border-gold-400 p-5 rounded-2xl shadow-inner">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <p className="font-serif text-base sm:text-lg font-bold text-gold-200 leading-relaxed">
                    &ldquo;الفخامة الحقيقية تبدأ من حسن الاختيار.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Luxury Statement Divider Banner
      ========================================================================= */}
      <section className="py-24 bg-zaad-950 text-ivory-100 border-b-2 border-gold-500/40 relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          {/* Gold Ornamental Header */}
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
