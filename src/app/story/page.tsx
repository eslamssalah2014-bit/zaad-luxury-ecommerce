'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Heart, History, Award, CheckCircle2 } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
            إرث الأصالة المتوارث
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-zaad-900 leading-tight">
            قصة زاد
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          <p className="text-base sm:text-lg text-charcoal-700/90 font-light leading-relaxed">
            لم تبدأ زاد كشركة، ولا كمشروع تجاري.. بل بدأت كحكاية شغف وإخلاص امتدت لأكثر من أربعين عاماً.
          </p>
        </div>

        {/* Hero Banner Image */}
        <div className="relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-500/20 mb-16">
          <Image
            src="/images/zaad-story-hero-banner.jpg"
            alt="عسل نوارة زاد وإرث النحالة العائلي"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/80 via-zaad-950/20 to-transparent"></div>
          <div className="absolute bottom-8 right-8 left-8 text-ivory-100 max-w-2xl">
            <span className="text-xs text-gold-400 font-mono tracking-wider block mb-1">من ثمانينيات القرن الماضي وحتى اليوم</span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold">إرثٌ عائلي من النقاء الخالص</h2>
          </div>
        </div>

        {/* Story Narrative Sections */}
        <div className="space-y-16 text-charcoal-800 leading-relaxed font-light text-base sm:text-lg">
          
          {/* Section 1: The Beginning */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-ivory-300 shadow-sm">
            <div className="md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                <History className="w-3.5 h-3.5" />
                <span>البدايات الأولى في ثمانينيات القرن الماضي</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900 leading-snug">
                هواية أحبها الجد وأخلص لها
              </h3>
              <p className="text-charcoal-700 leading-relaxed">
                بدأت الحكاية في ثمانينيات القرن الماضي، حين كان جدي يمارس تربية النحل كهواية أحبها وأخلص لها. كان يقضي ساعات طويلة بين المناحل، يتابع النحل بعناية ويحرص على أن يبقى العسل كما خلقته الطبيعة؛ نقيًا، خالصًا، دون أي إضافات أو تدخلات.
              </p>
              <p className="text-charcoal-700 leading-relaxed">
                لم يكن يبيع العسل في ذلك الوقت، بل كان يقدمه للأقارب والأصدقاء والمعارف. ومع مرور السنوات، أصبح الجميع ينتظر موسم العسل بشغف، لما عرفوه فيه من نقاء وجودة وطعم مختلف يصعب العثور عليه في الأسواق.
              </p>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full aspect-[3/4] max-h-[540px] rounded-2xl overflow-hidden border border-ivory-300 shadow-md bg-ivory-50 flex items-center justify-center">
                <Image
                  src="/images/zaad-heritage-beekeepers.jpg"
                  alt="زاد منذ أكثر من 10 أعوام - تراث تربية النحل"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Section 2: Growing with Memories */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zaad-950 text-ivory-100 p-8 sm:p-12 rounded-3xl border border-gold-500/30 shadow-2xl">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative h-72 rounded-2xl overflow-hidden border border-gold-500/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
                  alt="عسل زاد الصافي"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7 space-y-5 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 bg-gold-950/80 px-3 py-1 rounded-full border border-gold-500/30">
                <Heart className="w-3.5 h-3.5 text-gold-400" />
                <span>ذكريات الطفولة والمائدة العائلية</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50 leading-snug">
                عسلٌ كبرنا معه وعرفنا قيمته
              </h3>
              <p className="text-ivory-300 font-light text-sm sm:text-base leading-relaxed">
                ومع تزايد الطلب من المحيطين به، كبر المنحل عامًا بعد عام، ليس بدافع التجارة، بل بدافع الحفاظ على جودة المنتج الذي أحبّه الناس ووثقوا به.
              </p>
              <p className="text-ivory-300 font-light text-sm sm:text-base leading-relaxed">
                كبرت أنا أيضًا على هذا العسل. كان حاضرًا على مائدتنا، وجزءًا من ذكرياتنا اليومية. عرفت قيمته قبل أن أعرف معنى العلامات التجارية، وشهدت بنفسي الفرق الذي يصنعه المنتج الطبيعي الصادق الذي يصل من النحلة إلى الإنسان دون تغيير أو إضافات.
              </p>
            </div>
          </div>

          {/* Section 3: Birth of ZAAD & The Heritage */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-ivory-300 shadow-sm space-y-8">
            <div className="max-w-3xl mx-auto space-y-6 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-600 bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>من السؤال الصادق إلى ولادة زاد</span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-zaad-900 leading-tight">
                استمرار النهج.. بعد رحيل الجد
              </h3>

              <div className="bg-ivory-50 p-6 sm:p-8 rounded-2xl border-r-4 border-gold-500 text-right space-y-4 shadow-inner">
                <p className="text-base sm:text-lg text-zaad-900 font-serif italic leading-relaxed">
                  وبعد رحيل جدي، بقي السؤال حاضرًا في ذهني:
                </p>
                <p className="text-lg sm:text-xl font-bold text-gold-700 font-serif leading-relaxed">
                  &ldquo;لماذا تبقى هذه التجربة محصورة في دائرة صغيرة من الأقارب والمعارف، بينما يستحق المزيد من الناس أن يتذوقوا هذا النقاء؟&rdquo;
                </p>
              </div>

              <div className="space-y-4 text-charcoal-700 text-right leading-relaxed pt-2">
                <p className="text-lg font-bold text-zaad-900">
                  ومن هنا وُلدت زاد.
                </p>
                <p>
                  ولم يكن الهدف إنشاء علامة تجارية جديدة، بل الحفاظ على إرث عائلي امتد لعقود، والاستمرار على النهج نفسه الذي بدأ به جدي منذ أكثر من أربعين عامًا: عسل طبيعي خالص، يُنتج بعناية، ويصل إليك كما خرج من الخلية.
                </p>
                <p className="pt-2 text-base text-zaad-900 font-medium">
                  في زاد، نؤمن أن أفضل ما يمكن أن نقدمه ليس وصفًا تسويقيًا، بل وعدًا بسيطًا وصادقًا:
                </p>
              </div>

              {/* The Simple & Honest Promise Box */}
              <div className="bg-gradient-to-r from-zaad-900 via-zaad-950 to-zaad-900 text-ivory-50 p-8 sm:p-10 rounded-3xl border-2 border-gold-500/50 shadow-2xl text-center space-y-4">
                <span className="text-xs font-mono text-gold-400 uppercase tracking-widest block">
                  وعد دار زاد الصادق
                </span>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-300 leading-snug">
                  &ldquo;العسل يأتي من النحلة إليك... كما أرادته الطبيعة.&rdquo;
                </p>
              </div>

              {/* Highlight Final Signature Quote */}
              <div className="pt-6 pb-2">
                <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-gold-500/20 via-gold-500/40 to-gold-500/20">
                  <div className="bg-white px-8 py-5 rounded-xl border border-gold-400/40 shadow-sm">
                    <span className="text-xs text-charcoal-700/70 block mb-1">الخاتمة المميزة</span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-zaad-900">
                      زاد... حيث يلتقي النقاء بالفخامة.
                    </h4>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-sm font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all gold-shimmer-btn"
                >
                  <span>استكشاف المحصول الملكي المتاح الآن</span>
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
