'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, History, Sparkles } from 'lucide-react';

export default function BrandStoryScroll() {
  const steps = [
    {
      icon: History,
      number: '٠١',
      titleAr: 'البداية في ثمانينيات القرن الماضي',
      descAr: 'لم تبدأ زاد كشركة ولا كمشروع تجاري، بل بدأت كهواية أحبها جدي وأخلص لها. كان يقضي ساعات طويلة بين المناحل، يحرص على أن يبقى العسل نقيًا خالصًا كما خلقته الطبيعة ويقدمه للأقارب والمعارف.',
      image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: Heart,
      number: '٠٢',
      titleAr: 'كبر المنحل.. وذكريات الطفولة',
      descAr: 'ومع تزايد الطلب، كبر المنحل حفاظًا على الجودة التي وثق بها الناس. كبرت أنا أيضًا على هذا العسل حاضرًا على مائدتنا اليومية، وشهدت الفرق الذي يصنعه المنتج الصادق الواصل من الخلية دون إضافات.',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: Sparkles,
      number: '٠٣',
      titleAr: 'ولادة زاد واستمرار الإرث',
      descAr: 'لم يكن الهدف إنشاء علامة تجارية، بل الحفاظ على إرث عائلي ممتد لأكثر من أربعين عاماً على النهج ذاته، ووعدنا البسيط الصادق: "العسل يأتي من النحلة إليك... كما أرادته الطبيعة."',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <section className="py-24 bg-ivory-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
            إرث الأصالة المتوارث
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            قصة زاد
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          <p className="text-sm sm:text-base text-charcoal-800/80 leading-relaxed font-light">
            لم تبدأ زاد كشركة، ولا كمشروع تجاري.. بل بدأت كحكاية شغف وإخلاص امتدت لأكثر من أربعين عاماً.
          </p>
        </div>

        {/* Narrative Steps Grid */}
        <div className="space-y-20">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;

            return (
              <div
                key={idx}
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <div className="relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-luxury border-2 border-ivory-300 group">
                    <Image
                      src={step.image}
                      alt={step.titleAr}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 right-6 bg-zaad-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-gold-400/40 text-gold-300 font-mono text-sm font-bold">
                      {step.number} / قصة زاد
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-zaad-800 text-gold-400 flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
                    {step.titleAr}
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal-800/80 leading-relaxed">
                    {step.descAr}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/story"
                      className="inline-flex items-center gap-2 text-xs font-bold text-zaad-800 hover:text-gold-600 transition-colors group"
                    >
                      <span>قراءة قصة زاد الكاملة والإرث المتوارث</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Final Quote Box */}
        <div className="mt-20 text-center">
          <div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-gold-500/20 via-gold-500/40 to-gold-500/20 shadow-xl">
            <div className="bg-white px-8 sm:px-14 py-8 rounded-2xl border border-gold-400/50 space-y-2">
              <span className="text-xs text-charcoal-700/70 block uppercase tracking-wider">الخاتمة المميزة</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
                زاد... حيث يلتقي النقاء بالفخامة.
              </h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
