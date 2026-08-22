'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowLeft, RefreshCw, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

interface HoneyFinderQuizProps {
  products: Product[];
}

export default function HoneyFinderQuiz({ products }: HoneyFinderQuizProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState<string>('');
  const [texture, setTexture] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [recommendation, setRecommendation] = useState<Product | null>(null);

  const handleSelectObjective = (val: string) => {
    setObjective(val);
    setStep(2);
  };

  const handleSelectTexture = (val: string) => {
    setTexture(val);
    setStep(3);
  };

  const handleSelectRecipient = (val: string) => {
    setRecipient(val);
    // Find best match
    let match: Product | undefined;
    if (val === 'gift' || objective === 'gift') {
      match = products.find(p => p.slug === 'royal-zaad-reserve-box');
    } else if (texture === 'creamy' || objective === 'relax') {
      match = products.find(p => p.slug === 'white-mountain-honey');
    } else if (texture === 'dark' || objective === 'minerals') {
      match = products.find(p => p.slug === 'wild-samar-honey');
    } else if (objective === 'energy') {
      match = products.find(p => p.slug === 'pure-royal-jelly-extract');
    } else {
      match = products.find(p => p.slug === 'royal-sidr-doan');
    }
    setRecommendation(match || products[0]);
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setObjective('');
    setTexture('');
    setRecipient('');
    setRecommendation(null);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-ivory-100 to-ivory-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Box Container */}
        <div className="bg-zaad-900 text-ivory-100 rounded-3xl p-8 sm:p-12 border-2 border-gold-500/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Gold Ring */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Quiz Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-zaad-800 border border-gold-400/40 px-3.5 py-1 rounded-full text-gold-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مستشار التذوق والنقاء الذكي</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ivory-50">
              اكتشف المحصول الملكي الأنسب لاحتياجك
            </h2>
            <p className="text-xs sm:text-sm text-ivory-300 mt-2 font-light">
              أجب عن ٣ أسئلة بسيطة ليرشدك خبراؤنا إلى النكهة والخصائص العلاجية الملائمة لذوقك.
            </p>
          </div>

          {/* Step Progress */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-10 bg-gold-400' : s < step ? 'w-6 bg-zaad-700' : 'w-4 bg-zaad-800'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Objective */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-gold-300 text-center mb-6">
                الخطوة الأولى: ما هي غايتكم الأساسية من اقتناء العسل؟
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSelectObjective('immunity')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-right transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">مناعة فائقة ونقاء يومي</div>
                  <div className="text-xs text-ivory-400 mt-1">عسل سدر أحادي الزهرة غني بالإنزيمات الحية</div>
                </button>

                <button
                  onClick={() => handleSelectObjective('minerals')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-right transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">غني بالحديد والمعادن والجهاز الهضمي</div>
                  <div className="text-xs text-ivory-400 mt-1">عسل سمر بري جبلي داكن معتق</div>
                </button>

                <button
                  onClick={() => handleSelectObjective('relax')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-right transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">استرخاء، نضارة، وقوام كريمي ناعم</div>
                  <div className="text-xs text-ivory-400 mt-1">عسل المروج البيضاء القرغيزي النادر</div>
                </button>

                <button
                  onClick={() => handleSelectObjective('gift')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-right transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">إهداء فاخر لنخبة وكبار الشخصيات</div>
                  <div className="text-xs text-ivory-400 mt-1">صندوق الاحتياط الملكي الخشبي المذهب</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Sensory Profile */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-gold-300 text-center mb-6">
                الخطوة الثانية: ما هو طابع التذوق والقوام المفضل لديكم؟
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleSelectTexture('amber')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-center transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">عنبري حريري</div>
                  <div className="text-xs text-ivory-400 mt-1">نكهة خشبية دافئة وحلاوة موزونة</div>
                </button>

                <button
                  onClick={() => handleSelectTexture('dark')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-center transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">داكن مدخن</div>
                  <div className="text-xs text-ivory-400 mt-1">قوام ثقيل ونكهة قوية مركّزة</div>
                </button>

                <button
                  onClick={() => handleSelectTexture('creamy')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-center transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">أبيض مخفوق</div>
                  <div className="text-xs text-ivory-400 mt-1">قوام مخملي كالحرير يذوب في الفم</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Recipient */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-gold-300 text-center mb-6">
                الخطوة الثالثة: لمن تعد هذه المقتناة؟
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleSelectRecipient('self')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-center transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">لاقتنائي الشخصي</div>
                  <div className="text-xs text-ivory-400 mt-1">لتعزيز نمط الحياة الصحي</div>
                </button>

                <button
                  onClick={() => handleSelectRecipient('family')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-center transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">لكافة أفراد الأسرة</div>
                  <div className="text-xs text-ivory-400 mt-1">طبيعي وآمن ومغذي</div>
                </button>

                <button
                  onClick={() => handleSelectRecipient('gift')}
                  className="bg-zaad-800/80 hover:bg-zaad-800 border border-gold-500/30 hover:border-gold-400 p-4 rounded-xl text-center transition-all group"
                >
                  <div className="text-sm font-bold text-ivory-100 group-hover:text-gold-300">إهداء مرموق</div>
                  <div className="text-xs text-ivory-400 mt-1">مع بطاقة وصندوق ملكي</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && recommendation && (
            <div className="bg-zaad-950/80 rounded-2xl p-6 sm:p-8 border border-gold-500/40 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                
                <div className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-gold-400/40 bg-zaad-900">
                  <Image
                    src={recommendation.images[0]}
                    alt={recommendation.nameAr}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-right space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>توصية الخبير المخصصة لك</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory-50">
                    {recommendation.nameAr}
                  </h3>
                  <p className="text-xs text-ivory-300 leading-relaxed font-light">
                    {recommendation.shortDescAr}
                  </p>
                  <div className="text-gold-400 font-bold text-base pt-1">
                    {formatPrice(recommendation.price)}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-zaad-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={resetQuiz}
                  className="text-xs text-ivory-400 hover:text-white flex items-center gap-1.5 transition-colors order-2 sm:order-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة الاختيار مجدداً</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <Link
                    href={`/product/${recommendation.slug}`}
                    className="flex-1 sm:flex-none text-xs text-ivory-200 hover:text-white border border-gold-500/40 px-4 py-2.5 rounded-lg text-center font-medium"
                  >
                    معاينة شهادة الفحص
                  </Link>
                  <button
                    onClick={() => addItem(recommendation, 1)}
                    className="flex-1 sm:flex-none bg-gold-500 hover:bg-gold-400 text-zaad-950 px-6 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>اقتناء الآن</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
