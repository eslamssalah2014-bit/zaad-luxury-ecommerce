'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Feather, Mountain, FlaskConical } from 'lucide-react';

export default function BrandStoryScroll() {
  const steps = [
    {
      icon: Mountain,
      number: '٠١',
      titleAr: 'عزلة الأودية البكر والتربة المعدنية',
      descAr: 'تنتشر خلايانا في أودية دوعن وجبال عسير على ارتفاعات تتجاوز 2500 متر، في بيئات نقية خالية تماماً من الملوثات الصناعية والمبيدات، حيث تتغذى النحلات حصرياً على أزهار السدر والسمر المعمرة.',
      image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: Feather,
      number: '٠٢',
      titleAr: 'حرفة الجني اليدوي والفلترة الباردة',
      descAr: 'نتبع تقاليد متوارثة منذ مئات السنين؛ لا نستخدم أي طرد مركزي ميكانيكي عنيف أو معالجات حرارية قد تفقد العسل إنزيماته الحية. يتم الفلترة الدقيقة بالجاذبية الطبيعية فقط لحفظ حبوب اللقاح والبروبوليس.',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: FlaskConical,
      number: '٠٣',
      titleAr: 'الفحص المخبري المستقل والتوثيق الرقمي',
      descAr: 'تخضع كل تشغيلة محصودة لتحليل كروماتوغرافي وطيفي مستقل في مختبرات أوروبية معتمدة، لقياس نسب الرطوبة، والإنزيمات، والنقاء الزهري، وتوثيقها في شهادة رقمية يمكن لكل عميل فحصها مباشرة.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <section className="py-24 bg-ivory-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
            فلسفة دار زاد • إرث النقاء
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            حكاية تبدأ حيث تنتهي حدود المدن
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          <p className="text-sm sm:text-base text-charcoal-800/80 leading-relaxed font-light">
            في عالم تسوده السرعة والإنتاج التجاري الضخم، تختار زاد التمهل والانحياز للحرفة والتوثيق، لنقدم لكم قطرة لا تشبه سواها.
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
                      {step.number} / رحلة النقاء
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
                      <span>قراءة الوثيقة الكاملة لرحلة المحصول</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
