'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, History, Crown, ArrowLeft, Sparkles, Quote } from 'lucide-react';

export default function BrandStoryScroll() {
  const valueCards = [
    {
      number: '01',
      tag: 'الشغف والإتقان',
      icon: Heart,
      title: 'إرث من الشغف لا من التجارة',
      content:
        'لم تولد زاد من خطة تجارية أو دراسة سوق، بل بدأت من شغف حقيقي بتربية النحل والحفاظ على جودة العسل كما خلقته الطبيعة. رحلة امتدت عبر الأجيال، حملت معها قيم الإتقان والأمانة والحرص على تقديم الأفضل.',
      highlight: 'بعض العلامات التجارية تُبنى بالأفكار... أما زاد فبُنيت بالشغف.',
      isDark: true,
    },
    {
      number: '02',
      tag: 'النقاء المطلق',
      icon: ShieldCheck,
      title: 'من الخلية إلى المائدة كما خلقته الطبيعة',
      content:
        'نؤمن أن الطبيعة قدّمت لنا الكمال بالفعل، ولذلك نحافظ على العسل في صورته الأصيلة دون إضافات أو مكونات تغير من هويته. ليصل إليك بطعمه الطبيعي وقيمته كما خرج من الخلية.',
      highlight: 'العسل يأتي من النحلة إليك... كما أرادته الطبيعة.',
      isDark: false,
    },
    {
      number: '03',
      tag: 'أصالة التراث',
      icon: History,
      title: 'أكثر من أربعة عقود من الخبرة المتوارثة',
      content:
        'منذ ثمانينيات القرن الماضي، تراكمت الخبرة جيلاً بعد جيل، ليس في إنتاج العسل فقط، بل في فهم مواسمه وخصائصه واختيار أفضل المحاصيل. إرث من المعرفة والثقة استمر لأكثر من أربعين عاماً.',
      highlight: 'خبرة لا تُكتسب في سنوات قليلة... بل تُبنى عبر الأجيال.',
      isDark: true,
    },
    {
      number: '04',
      tag: 'الجودة الملكية',
      icon: Crown,
      title: 'انتقاء ملكي لأفضل المحاصيل',
      content:
        'ليست كل المحاصيل تحمل اسم زاد. نختار بعناية ما ينسجم مع معاييرنا في النقاء والجودة والطعم والقيمة الغذائية، لنقدم مجموعة منتقاة تليق بمن يبحث عن الأفضل.',
      highlight: 'الفخامة الحقيقية تبدأ من حسن الاختيار.',
      isDark: false,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-ivory-100/70 via-ivory-50 to-ivory-100/80">
      
      {/* Luxury Background Glow & Texture */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-gold-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
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
          
          <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed font-light mb-8">
            أكثر من مجرد عسل طبيعي... فلسفة متوارثة من الجودة والأصالة.
          </p>

          {/* Section Intro Statement */}
          <div className="bg-white/80 backdrop-blur-sm border border-gold-400/30 rounded-2xl py-4 px-6 sm:px-10 max-w-2xl mx-auto shadow-sm">
            <p className="font-serif text-base sm:text-lg text-zaad-900 font-semibold leading-relaxed">
              &ldquo;ما يميز زاد ليس ما نبيعه فقط... بل الطريقة التي نختار بها ما نقدمه.&rdquo;
            </p>
          </div>
        </div>

        {/* 4 Alternating Premium Value Cards Grid (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-20">
          {valueCards.map((card, idx) => {
            const Icon = card.icon;
            const isDark = card.isDark;

            return (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 sm:p-10 border transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col justify-between overflow-hidden group ${
                  isDark
                    ? 'bg-gradient-to-br from-zaad-950 via-zaad-900 to-zaad-950 text-ivory-100 border-gold-500/30 shadow-2xl hover:border-gold-400 hover:shadow-gold-glow-lg'
                    : 'bg-gradient-to-br from-white via-ivory-50 to-white text-charcoal-900 border-ivory-300 shadow-luxury hover:border-gold-400/60 hover:shadow-gold-glow'
                }`}
              >
                {/* Large Background Decorative Number */}
                <span
                  className={`font-mono text-7xl sm:text-8xl font-black absolute top-3 left-6 select-none pointer-events-none transition-opacity duration-300 ${
                    isDark
                      ? 'text-gold-400/10 group-hover:text-gold-400/15'
                      : 'text-zaad-950/5 group-hover:text-zaad-950/10'
                  }`}
                >
                  {card.number}
                </span>

                <div className="relative z-10">
                  {/* Top Bar with Circular Icon Badge & Tag */}
                  <div className="flex items-center justify-between mb-8 pb-5 border-b border-ivory-200/20">
                    <div className="flex items-center gap-3.5">
                      {/* Circular Premium Badge */}
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                          isDark
                            ? 'bg-ivory-100 text-zaad-900 border border-gold-400/50 shadow-gold-glow/20'
                            : 'bg-gradient-to-br from-gold-400 to-gold-600 text-zaad-950 border border-gold-300 shadow-md'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span
                        className={`text-xs font-bold px-3.5 py-1 rounded-full border ${
                          isDark
                            ? 'text-gold-300 bg-zaad-800/80 border-gold-500/30'
                            : 'text-gold-800 bg-gold-50 border-gold-200'
                        }`}
                      >
                        {card.tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3
                    className={`font-serif text-2xl sm:text-3xl font-bold mb-4 leading-snug ${
                      isDark ? 'text-ivory-50' : 'text-zaad-900'
                    }`}
                  >
                    {card.title}
                  </h3>

                  {/* Card Content */}
                  <p
                    className={`text-sm sm:text-base leading-relaxed font-light mb-8 ${
                      isDark ? 'text-ivory-300/90' : 'text-charcoal-700/90'
                    }`}
                  >
                    {card.content}
                  </p>
                </div>

                {/* Luxury Quote Ribbon / Signature Statement */}
                <div
                  className={`relative z-10 rounded-2xl p-4 sm:p-5 border-r-4 shadow-sm transition-all duration-300 ${
                    isDark
                      ? 'bg-zaad-900/90 border-gold-400 text-gold-200'
                      : 'bg-gold-50/80 border-gold-600 text-zaad-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Quote
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDark ? 'text-gold-400' : 'text-gold-600'
                      }`}
                    />
                    <p className="font-serif text-sm sm:text-base font-semibold leading-relaxed">
                      &ldquo;{card.highlight}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Closing Full-Width Luxury Banner */}
        <div className="bg-gradient-to-r from-zaad-950 via-zaad-900 to-zaad-950 text-ivory-100 rounded-3xl p-8 sm:p-12 border-2 border-gold-500/40 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-center md:text-right">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 bg-zaad-900/80 px-3.5 py-1 rounded-full border border-gold-400/30">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>إرث الأجيال الممتد</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory-50 leading-tight">
                أكثر من أربعة عقود من الشغف والخبرة والجودة المتوارثة.
              </h3>
            </div>

            <div className="shrink-0">
              <Link
                href="/story"
                className="inline-flex items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-sm font-bold px-9 py-4 rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all gold-shimmer-btn"
              >
                <span>اكتشف قصة زاد</span>
                <ArrowLeft className="w-4 h-4 text-zaad-950" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
