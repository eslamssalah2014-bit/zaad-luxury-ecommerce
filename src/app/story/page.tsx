'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Mountain, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
            سجل الأصالة والتوثيق
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            زاد.. قصة نَقَاءٍ لا يعرف المساومة
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-6"></div>
          <p className="text-sm sm:text-base text-charcoal-700/80 font-light leading-relaxed">
            لم نبتكر مفهوم العسل، لكننا أعدنا صياغة مفهوم النقاء والتوثيق المخبري لنعيد لهذه الثروة قيمتها التاريخية والملكية.
          </p>
        </div>

        {/* Hero Banner Image */}
        <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-500/20 mb-16">
          <Image
            src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1600&q=85"
            alt="أودية دوعن وجبال عسير"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/80 via-zaad-950/20 to-transparent"></div>
          <div className="absolute bottom-8 right-8 left-8 text-ivory-100 max-w-2xl">
            <span className="text-xs text-gold-400 font-mono tracking-wider block mb-1">الموطن الأصلي • دوعن وعسير</span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold">حيث تلتقي عراقة الأرض بحكمة النحل</h2>
          </div>
        </div>

        {/* Story Paragraphs & Pillars */}
        <div className="space-y-16 text-charcoal-800 leading-relaxed font-light text-sm sm:text-base">
          
          {/* Section 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-ivory-300 shadow-sm">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold text-gold-600">الفصل الأول: البدايات والفلسفة</span>
              <h3 className="font-serif text-2xl font-bold text-zaad-900">
                لماذا تأسست دار زاد؟
              </h3>
              <p>
                تأسست دار زاد استجابة لواقع السوق المعاصر الذي طغت عليه المنتجات التجارية المعالجة حرارياً، والأعسال المخلوطة التي فقدت هويتها وقيمتها الشفائية. رأينا أن المستهلك الباحث عن النقاء الحقيقي يستحق داراً تلتزم بالشفافية المطلقة وتضع بين يديه التحليل العلمي الدقيق لكل قطرة.
              </p>
              <p>
                زاد ليست مجرد علامة تجارية؛ إنها ميثاق شرف يربط بين جهد النحال في وعورة الجبال، وثقة المقتني الباحث عن أرفع مراتب الجودة.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="relative h-64 rounded-2xl overflow-hidden border border-ivory-300">
                <Image
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
                  alt="عسل زاد"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zaad-950 text-ivory-100 p-8 sm:p-10 rounded-3xl border border-gold-500/30 shadow-2xl">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative h-64 rounded-2xl overflow-hidden border border-gold-500/30">
                <Image
                  src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
                  alt="حرفة النحالة"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7 space-y-4 order-1 md:order-2">
              <span className="text-xs font-bold text-gold-400">الفصل الثاني: بروتوكول الجني الملكي</span>
              <h3 className="font-serif text-2xl font-bold text-ivory-50">
                الحرفة اليدوية بلا أي تسخين صناعي
              </h3>
              <p className="text-ivory-300 font-light text-xs sm:text-sm">
                نعتمد بروتوكولاً صارماً يمنع تعريض العسل لأي درجة حرارة تفوق حرارة الخلية الطبيعية (35°م). يتم جني الأقراص الناضجة فقط التي ختمها النحل بالشمع الطبيعي، مما يضمن تدني نسبة الرطوبة واكتمال التركيبة الحيوية للإنزيمات.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-zaad-900 p-3 rounded-lg border border-zaad-800 text-gold-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>فلترة طبيعية بالجاذبية</span>
                </div>
                <div className="bg-zaad-900 p-3 rounded-lg border border-zaad-800 text-gold-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>تعبئة في غرف معقمة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-ivory-300 shadow-sm space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-gold-600">الفصل الثالث: الثقة الموثقة</span>
              <h3 className="font-serif text-2xl font-bold text-zaad-900">
                التحليل الكروماتوغرافي المستقل
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-700/80">
                لا نكتفي بوعود الجودة الشفهية؛ بل نرسل عينات من كل محصول إلى مختبرات ألمانية وسويسرية معتمدة لفحص طيف حبوب اللقاح والإنزيمات.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
              <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300">
                <div className="font-mono text-2xl font-bold text-zaad-900">0%</div>
                <div className="text-xs font-bold text-zaad-800 mt-1">تغذية سكرية</div>
                <p className="text-[10px] text-charcoal-700/70 mt-0.5">موثق بنسبة السكروز الحر</p>
              </div>

              <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300">
                <div className="font-mono text-2xl font-bold text-zaad-900">&lt; 14.5%</div>
                <div className="text-xs font-bold text-zaad-800 mt-1">نسبة الرطوبة</div>
                <p className="text-[10px] text-charcoal-700/70 mt-0.5">قوام كثيف طبيعي معتق</p>
              </div>

              <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300">
                <div className="font-mono text-2xl font-bold text-zaad-900">100%</div>
                <div className="text-xs font-bold text-zaad-800 mt-1">إنزيمات حية نشطة</div>
                <p className="text-[10px] text-charcoal-700/70 mt-0.5">بدون أي معالجة حرارية</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-gold-glow transition-all gold-shimmer-btn"
              >
                <span>استكشاف المحصول الملكي المتاح الآن</span>
                <ArrowLeft className="w-4 h-4 text-gold-300" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
