'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShieldCheck, History, Crown, ArrowLeft, Sparkles, Quote } from 'lucide-react';

export default function BrandStoryScroll() {
  const storySections = [
    {
      number: '01',
      tag: 'الشغف والإتقان',
      icon: Heart,
      title: 'إرث من الشغف لا من التجارة',
      content:
        'لم تولد زاد من خطة تجارية أو دراسة سوق، بل بدأت من شغف حقيقي بتربية النحل والحفاظ على جودة العسل كما خلقته الطبيعة. رحلة امتدت عبر الأجيال، حملت معها قيم الإتقان والأمانة والحرص على تقديم الأفضل.',
      highlight: 'بعض العلامات التجارية تُبنى بالأفكار... أما زاد فبُنيت بالشغف.',
      image: '/images/zaad-heritage-beekeepers.jpg',
      imageAlt: 'تربية النحل والمناحل التراثية - زاد',
      imageContain: true,
      imageOnRight: true,
    },
    {
      number: '02',
      tag: 'النقاء المطلق',
      icon: ShieldCheck,
      title: 'من الخلية إلى المائدة كما خلقته الطبيعة',
      content:
        'نؤمن أن الطبيعة قدّمت لنا الكمال بالفعل، ولذلك نحافظ على العسل في صورته الأصيلة دون إضافات أو مكونات تغير من هويته. ليصل إليك بطعمه الطبيعي وقيمته كما خرج من الخلية.',
      highlight: 'العسل يأتي من النحلة إليك... كما أرادته الطبيعة.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'أقراص شمع العسل النقي الخام',
      imageContain: false,
      imageOnRight: false,
    },
    {
      number: '03',
      tag: 'أصالة التراث',
      icon: History,
      title: 'أكثر من أربعة عقود من الخبرة المتوارثة',
      content:
        'منذ ثمانينيات القرن الماضي، تراكمت الخبرة جيلاً بعد جيل، ليس في إنتاج العسل فقط، بل في فهم مواسمه وخصائصه واختيار أفضل المحاصيل. إرث من المعرفة والثقة استمر لأكثر من أربعين عاماً.',
      highlight: 'خبرة لا تُكتسب في سنوات قليلة... بل تُبنى عبر الأجيال.',
      image: '/images/zaad-childhood-memories.jpg',
      imageAlt: 'إرث وخبرة تربية النحل عبر العقود',
      imageContain: false,
      imageOnRight: true,
    },
    {
      number: '04',
      tag: 'الجودة الملكية',
      icon: Crown,
      title: 'انتقاء ملكي لأفضل المحاصيل',
      content:
        'ليست كل المحاصيل تحمل اسم زاد. نختار بعناية ما ينسجم مع معاييرنا في النقاء والجودة والطعم والقيمة الغذائية، لنقدم مجموعة منتقاة تليق بمن يبحث عن الأفضل.',
      highlight: 'الفخامة الحقيقية تبدأ من حسن الاختيار.',
      image: '/images/zaad-story-hero-banner.jpg',
      imageAlt: 'عسل زاد الملكي النادر',
      imageContain: false,
      imageOnRight: false,
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-gradient-to-b from-ivory-100/70 via-ivory-50 to-ivory-100/80">
      
      {/* Ambient Luxury Lighting & Subtle Texture */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-gold-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
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
          <div className="bg-white/90 backdrop-blur-md border border-gold-400/30 rounded-2xl py-4 px-6 sm:px-10 max-w-2xl mx-auto shadow-sm">
            <p className="font-serif text-base sm:text-lg text-zaad-900 font-semibold leading-relaxed">
              &ldquo;ما يميز زاد ليس ما نبيعه فقط... بل الطريقة التي نختار بها ما نقدمه.&rdquo;
            </p>
          </div>
        </div>

        {/* 4 Full-Width Storytelling Sections */}
        <div className="space-y-16 lg:space-y-20 mb-24">
          {storySections.map((section, idx) => {
            const Icon = section.icon;
            const isImageOnRight = section.imageOnRight;

            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-zaad-950 via-zaad-900 to-zaad-950 text-ivory-100 rounded-3xl p-8 sm:p-12 lg:p-14 border-2 border-gold-500/30 shadow-2xl hover:border-gold-400/60 hover:shadow-gold-glow-lg transition-all duration-500 relative overflow-hidden group"
              >
                {/* Subtle Ambient Radial Shimmer */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div
                  className={`flex flex-col ${
                    isImageOnRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center gap-10 lg:gap-14 relative z-10`}
                >
                  {/* Large Story Image (40-50% width) */}
                  <div className="w-full lg:w-5/12 shrink-0 flex justify-center">
                    <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[460px] rounded-2xl overflow-hidden shadow-2xl border border-gold-500/30 bg-zaad-950/60 flex items-center justify-center group/img">
                      <Image
                        src={section.image}
                        alt={section.imageAlt}
                        fill
                        className={`${
                          section.imageContain
                            ? 'object-contain p-2'
                            : 'object-cover group-hover/img:scale-105'
                        } transition-transform duration-700 ease-out`}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      {!section.imageContain && (
                        <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/60 via-transparent to-transparent pointer-events-none"></div>
                      )}
                    </div>
                  </div>

                  {/* Story Content (50-60% width) */}
                  <div className="w-full lg:w-7/12 space-y-6 text-right">
                    
                    {/* Top Row: Circular Icon Badge, Tag, and Big Chapter Number */}
                    <div className="flex items-center justify-between border-b border-zaad-800/80 pb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-ivory-100 text-zaad-900 border border-gold-400/60 flex items-center justify-center shadow-gold-glow/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-zaad-900" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gold-300 bg-zaad-800/90 px-4 py-1.5 rounded-full border border-gold-500/30 shadow-sm">
                          {section.tag}
                        </span>
                      </div>

                      {/* Large Luxury Number */}
                      <span className="font-mono text-4xl sm:text-5xl font-black text-gold-400/40 tracking-wider">
                        {section.number}
                      </span>
                    </div>

                    {/* Luxury Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory-50 leading-snug">
                      {section.title}
                    </h3>

                    {/* Description Text */}
                    <p className="text-base sm:text-lg text-ivory-300/90 leading-relaxed font-light">
                      {section.content}
                    </p>

                    {/* Signature Quote Ribbon */}
                    <div className="bg-zaad-900/90 border-r-4 border-gold-400 p-5 rounded-2xl shadow-inner mt-4">
                      <div className="flex items-start gap-3">
                        <Quote className="w-5 h-5 text-gold-400 shrink-0 mt-1" />
                        <p className="font-serif text-base sm:text-lg font-medium text-gold-200 leading-relaxed">
                          &ldquo;{section.highlight}&rdquo;
                        </p>
                      </div>
                    </div>

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
