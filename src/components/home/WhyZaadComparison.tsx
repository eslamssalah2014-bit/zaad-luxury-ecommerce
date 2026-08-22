'use client';

import React from 'react';
import { Check, X, ShieldAlert, Sparkles, Award } from 'lucide-react';

export default function WhyZaadComparison() {
  const comparisonData = [
    {
      criterionAr: 'المعالجة الحرارية والبسترة',
      commercial: 'تسخين عالي (65-75°م) لإطالة عمر الرف مما يقضي على الإنزيمات الحية المفيدة',
      zaad: 'خام 100% بدون أي تسخين، مع الاحتفاظ الكامل بإنزيمات الدياستيز والإنفرتيز الحية',
    },
    {
      criterionAr: 'نسبة الرطوبة الطبيعية',
      commercial: 'تتجاوز 18-21% مما يجعله خفيفاً وعرضة للتخمر ويتطلب بسترة صناعية',
      zaad: 'فائقة الانخفاض (13.8% - 14.5%) نتيجة نضوج تام داخل الخلية يمنحه كثافة وقواماً مخملياً',
    },
    {
      criterionAr: 'نقاء طيف حبوب اللقاح',
      commercial: 'أعسال تجارية مجهولة المصدر مخلوطة من مناشئ متعددة مستوردة',
      zaad: 'أحادي الزهرة موثق مجهرياً (أكثر من 98.6% سدر دوعني أو سمر بري نقي)',
    },
    {
      criterionAr: 'مركب هيدروكسي ميثيل فورفورال (HMF)',
      commercial: 'مرتفع نتيجة التخزين والتسخين (غالباً فوق 40-60 ملغ/كغ)',
      zaad: 'شبه منعدم (أقل من 2.5 ملغ/كغ) مما يثبت طزاجة المحصول الفائقة ونقاءه الطبيعي',
    },
    {
      criterionAr: 'التوثيق المخبري للعميل',
      commercial: 'لا تتوفر أي شهادات فحص مستقلة يمكن للعميل الاطلاع عليها',
      zaad: 'شهادة فحص مخبري أوروبي معتمدة برقم تشغيلة باركود لكل برطمان مباشرة',
    },
    {
      criterionAr: 'وعاء الحفظ والتغليف',
      commercial: 'عبوات بلاستيكية تفقد العسل خواصه وتتفاعل مع الأحماض الأمينية',
      zaad: 'زجاج كريستالي إيطالي معتم واقٍ من الأشعة فوق البنفسجية وصندوق إهداء فاخر',
    }
  ];

  return (
    <section className="py-24 bg-zaad-950 text-ivory-100 relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-zaad-800/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-3.5 py-1 rounded-full text-gold-400 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>معايير المقارنة الصارمة</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50 leading-tight">
            لماذا تختلف دار زاد عن الأسواق التجارية؟
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          <p className="text-sm sm:text-base text-ivory-300 font-light leading-relaxed">
            الفرق بين العسل المعالج تجارياً والرحيق الملكي الخام يكمن في التفاصيل العلمية والمخبرية الدقيقة.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="bg-zaad-900/80 rounded-2xl border border-gold-500/20 shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Table Headers */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-zaad-800 bg-zaad-950/60 p-6 text-sm font-bold text-ivory-200">
            <div className="md:col-span-4 text-gold-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>المعيار المخبري والنوعي</span>
            </div>
            <div className="md:col-span-4 text-charcoal-400 flex items-center gap-2 mt-2 md:mt-0 text-red-400/80">
              <ShieldAlert className="w-4 h-4" />
              <span>الأعسال التجارية الشائعة</span>
            </div>
            <div className="md:col-span-4 text-gold-400 flex items-center gap-2 mt-2 md:mt-0 font-serif text-base">
              <Award className="w-4 h-4 text-gold-400" />
              <span>محصول دار زاد الملكي (ZAAD)</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zaad-800/80">
            {comparisonData.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 hover:bg-zaad-800/30 transition-colors text-xs sm:text-sm"
              >
                {/* Criterion */}
                <div className="md:col-span-4 font-bold text-ivory-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                  <span>{row.criterionAr}</span>
                </div>

                {/* Commercial */}
                <div className="md:col-span-4 text-ivory-400 bg-black/20 p-3 rounded-lg md:bg-transparent md:p-0 flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{row.commercial}</span>
                </div>

                {/* ZAAD Reserve */}
                <div className="md:col-span-4 text-ivory-100 bg-zaad-800/60 p-3 rounded-lg md:bg-transparent md:p-0 flex items-start gap-2 border border-gold-500/20 md:border-0 font-medium">
                  <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-gold-100">{row.zaad}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
