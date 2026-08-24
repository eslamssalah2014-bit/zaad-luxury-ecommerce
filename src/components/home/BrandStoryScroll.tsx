'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, History, Crown, ArrowLeft, Sparkles } from 'lucide-react';

export default function BrandStoryScroll() {
  const valueCards = [
    {
      number: '٠١',
      tag: 'الشغف والإتقان',
      icon: Heart,
      title: 'إرث من الشغف لا من التجارة',
      content:
        'لم تولد زاد من خطة تجارية أو دراسة سوق، بل بدأت من شغف حقيقي بتربية النحل والحفاظ على جودة العسل كما خلقته الطبيعة. رحلة امتدت عبر الأجيال، حملت معها قيم الإتقان والأمانة والحرص على تقديم الأفضل.',
      highlight: 'بعض العلامات التجارية تُبنى بالأفكار... أما زاد فبُنيت بالشغف.',
    },
    {
      number: '٠٢',
      tag: 'النقاء الطبيعي',
      icon: ShieldCheck,
      title: 'من الخلية إلى المائدة كما خلقته الطبيعة',
      content:
        'نؤمن أن الطبيعة قدّمت لنا الكمال بالفعل، ولذلك نحافظ على العسل في صورته الأصيلة دون إضافات أو مكونات تغير من هويته. ليصل إليك بطعمه الطبيعي وقيمته كما خرج من الخلية.',
      highlight: 'العسل يأتي من النحلة إليك... كما أرادته الطبيعة.',
    },
    {
      number: '٠٣',
      tag: 'أصالة التراث',
      icon: History,
      title: 'أكثر من أربعة عقود من الخبرة المتوارثة',
      content:
        'منذ ثمانينيات القرن الماضي، تراكمت الخبرة جيلاً بعد جيل، ليس في إنتاج العسل فقط، بل في فهم مواسمه وخصائصه واختيار أفضل المحاصيل. إرث من المعرفة والثقة استمر لأكثر من أربعين عاماً.',
      highlight: 'خبرة لا تُكتسب في سنوات قليلة... بل تُبنى عبر الأجيال.',
    },
    {
      number: '٠٤',
      tag: 'الجودة الملكية',
      icon: Crown,
      title: 'انتقاء ملكي لأفضل المحاصيل',
      content:
        'ليست كل المحاصيل تحمل اسم زاد. نختار بعناية ما ينسجم مع معاييرنا في النقاء والجودة والطعم والقيمة الغذائية، لنقدم مجموعة منتقاة تليق بمن يبحث عن الأفضل.',
      highlight: 'الفخامة الحقيقية تبدأ من حسن الاختيار.',
    },
  ];

  return (
    <section className="py-24 bg-ivory-50 relative overflow-hidden">
      
      {/* Background Decorative Flourish */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span className="text-xs font-bold text-gold-700 tracking-wider">
              فلسفة دار زاد • معايير التميز
            </span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            لماذا زاد مختلفة؟
          </h2>
          
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          
          <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed font-light">
            أكثر من مجرد عسل طبيعي... فلسفة متوارثة من الجودة والأصالة.
          </p>
        </div>

        {/* 4 Premium Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-20">
          {valueCards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-ivory-300 shadow-luxury hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Card Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-ivory-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zaad-900 text-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-gold-700 bg-gold-50 px-3 py-1 rounded-full border border-gold-200/80">
                        {card.tag}
                      </span>
                    </div>
                    <span className="font-mono text-lg font-bold text-gold-600">
                      {card.number}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-2xl sm:text-2xl font-bold text-zaad-900 mb-4 leading-snug">
                    {card.title}
                  </h3>

                  {/* Card Content */}
                  <p className="text-sm sm:text-base text-charcoal-700/90 leading-relaxed font-light mb-6">
                    {card.content}
                  </p>
                </div>

                {/* Highlight Quote Box */}
                <div className="bg-ivory-50 border-r-4 border-gold-500 p-4 sm:p-5 rounded-2xl shadow-inner mt-2">
                  <p className="font-serif text-sm sm:text-base font-semibold text-zaad-900 leading-relaxed">
                    &ldquo;{card.highlight}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Curiosity & Heritage CTA Box */}
        <div className="bg-gradient-to-r from-zaad-950 via-zaad-900 to-zaad-950 text-ivory-100 rounded-3xl p-8 sm:p-12 border-2 border-gold-500/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow Circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 bg-zaad-900/80 px-3.5 py-1 rounded-full border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>إرث الأجيال الممتد</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-50 leading-tight">
              لكل إرث حكاية...
            </h3>

            <p className="text-sm sm:text-base text-ivory-300 font-light leading-relaxed max-w-2xl mx-auto">
              اكتشف كيف بدأت رحلة زاد منذ أكثر من أربعة عقود، وكيف تحوّل الشغف إلى إرث نحافظ عليه حتى اليوم.
            </p>

            <div className="pt-2">
              <Link
                href="/story"
                className="inline-flex items-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-sm font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-gold-glow-lg transition-all gold-shimmer-btn"
              >
                <span>اقرأ قصة زاد</span>
                <ArrowLeft className="w-4 h-4 text-zaad-950" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
