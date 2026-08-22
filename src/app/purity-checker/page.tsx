'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck, Award, FileText, Download, CheckCircle, MapPin, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '@/types';
import { getLiveProducts } from '@/lib/services/productService';

function PurityCheckerContent() {
  const searchParams = useSearchParams();
  const initialBatch = searchParams.get('batch') || '';

  const [batchInput, setBatchInput] = useState(initialBatch);
  const [searchedProduct, setSearchedProduct] = useState<Product | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = React.useCallback(async (batchToSearch?: string) => {
    const term = (batchToSearch || batchInput).trim().toUpperCase();
    if (!term) return;

    setHasSearched(true);
    setLoading(true);

    try {
      const res = await fetch(`/api/purity-check?batch=${encodeURIComponent(term)}`, { cache: 'no-store' });
      const json = await res.json();

      if (json.success && json.data) {
        const allProds = await getLiveProducts();
        const found = allProds.find(p => p.slug === json.data.productSlug) || allProds.find(p => p.latestLabBatch?.batchNumber?.toUpperCase() === term);
        if (found) {
          setSearchedProduct(found);
          setLoading(false);
          return;
        }
      }

      const allProds = await getLiveProducts();
      const found = allProds.find(p => p.latestLabBatch?.batchNumber?.toUpperCase() === term);
      setSearchedProduct(found || null);
    } catch (e) {
      console.error('Error searching purity batch:', e);
      setSearchedProduct(null);
    } finally {
      setLoading(false);
    }
  }, [batchInput]);

  useEffect(() => {
    if (initialBatch) {
      handleSearch(initialBatch);
    }
  }, [initialBatch, handleSearch]);

  const sampleBatches = [
    { code: 'ZD-2026-SD01', label: 'سدر دوعني ملكي 2026' },
    { code: 'ZD-2026-SM02', label: 'سمر بري معتق 2026' },
    { code: 'ZD-2026-WM03', label: 'عسل المروج البيضاء' },
    { code: 'ZD-2026-ROYAL-BOX', label: 'الاحتياط الملكي' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs font-semibold mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>نظام التوثيق والشفافية المخبرية المفتوحة المباشرة</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            فحص شهادة النقاء المخبرية
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-4"></div>
          <p className="text-xs sm:text-sm text-charcoal-700/80 leading-relaxed font-light">
            أدخل رقم التشغيلة (Batch Number) المطبوع على ختم البرطمان أو العبوة للاطلاع على التحليل الكروماتوغرافي ونسب الإنزيمات الحية الموثقة مخبرياً في قاعدة البيانات الحية.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-luxury max-w-2xl mx-auto mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="أدخل رقم التشغيلة (مثال: ZD-2026-SD01)..."
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-ivory-50 border-2 border-ivory-300 rounded-xl px-4 py-3 font-mono uppercase tracking-wider focus:border-gold-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-4 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow-gold-glow transition-all gold-shimmer-btn shrink-0"
              >
                {loading ? 'جاري الفحص...' : 'فحص التشغيلة'}
              </button>
            </div>

            {/* Quick Sample Clickers */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-charcoal-700/70 text-[11px]">تشغيلات نموذجية للتجربة:</span>
              {sampleBatches.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    setBatchInput(s.code);
                    handleSearch(s.code);
                  }}
                  className="bg-ivory-100 hover:bg-gold-50 text-zaad-900 border border-ivory-300 hover:border-gold-400 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors"
                >
                  {s.code}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Certificate Display Result */}
        {hasSearched && (
          searchedProduct ? (
            <div className="bg-white rounded-3xl border-2 border-gold-400/40 shadow-2xl overflow-hidden animate-fade-in">
              
              {/* Certificate Header Banner */}
              <div className="bg-zaad-950 text-ivory-100 p-8 border-b-2 border-gold-500 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="text-center md:text-right space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-semibold bg-zaad-900 px-3 py-0.5 rounded-full border border-gold-500/30">
                      <Award className="w-3.5 h-3.5" />
                      <span>شهادة تحليل الجودة والنقاء المعتمدة</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50">
                      {searchedProduct.nameAr}
                    </h2>
                    <p className="text-xs text-ivory-300">
                      رقم التشغيلة: <span className="font-mono text-gold-400 font-bold">{searchedProduct.latestLabBatch.batchNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-zaad-900/90 p-4 rounded-2xl border border-gold-500/30 text-xs">
                    <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        مطابق لأعلى مواصفات النقاء
                      </div>
                      <div className="text-ivory-300 mt-0.5">{searchedProduct.latestLabBatch.labName}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Body & Metrics Grid */}
              <div className="p-8 sm:p-10 space-y-8">
                
                {/* Meta details strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-ivory-200 text-xs">
                  <div className="flex items-center gap-2 text-charcoal-800">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-charcoal-700/70 block">المصدر الجغرافي:</span>
                      <strong>{searchedProduct.originRegionAr}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-charcoal-800">
                    <Calendar className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-charcoal-700/70 block">موسم وتاريخ القطاف:</span>
                      <strong>{searchedProduct.latestLabBatch.harvestSeason} ({searchedProduct.latestLabBatch.harvestDate})</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-charcoal-800">
                    <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-charcoal-700/70 block">المصدر الزهري:</span>
                      <strong>{searchedProduct.floralSourceAr}</strong>
                    </div>
                  </div>
                </div>

                {/* Analytical Results Cards */}
                <div>
                  <h3 className="text-sm font-bold text-zaad-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold-600" />
                    <span>نتائج الفحص الكروماتوغرافي والإنزيمي:</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <div className="bg-ivory-50 p-5 rounded-2xl border border-ivory-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-charcoal-700/80 font-medium">نسبة الرطوبة (Moisture)</span>
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-bold">معيار ممتاز</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-zaad-900">{searchedProduct.latestLabBatch.moisturePercentage}%</div>
                      <p className="text-[11px] text-charcoal-700/70 mt-1">الحد الأقصى المسموح دولياً: 20% (انخفاض الرطوبة يمنع التخمر ويضمن النضج التام).</p>
                    </div>

                    <div className="bg-ivory-50 p-5 rounded-2xl border border-ivory-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-charcoal-700/80 font-medium">مستوى HMF (طزاجة العسل)</span>
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-bold">طازج فائق النقاء</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-zaad-900">{searchedProduct.latestLabBatch.hmfLevel} mg/kg</div>
                      <p className="text-[11px] text-charcoal-700/70 mt-1">المعيار العالمي: أقل من 80 mg/kg (يثبت عدم تعرض العسل لأي تسخين أو معالجة حرارية).</p>
                    </div>

                    <div className="bg-ivory-50 p-5 rounded-2xl border border-ivory-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-charcoal-700/80 font-medium">نشاط إنزيم الدياستيز (Diastase)</span>
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-bold">إنزيمات حية نشطة</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-zaad-900">{searchedProduct.latestLabBatch.diastaseActivity} Schade</div>
                      <p className="text-[11px] text-charcoal-700/70 mt-1">الحد الأدنى المطلوب عالمياً: 8 وحدات (مؤشر حيوي على الفعالية العلاجية الكاملة).</p>
                    </div>

                    <div className="bg-ivory-50 p-5 rounded-2xl border border-ivory-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-charcoal-700/80 font-medium">نسبة السكروز (Sucrose)</span>
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-bold">خالٍ من التغذية السكرية</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-zaad-900">{searchedProduct.latestLabBatch.sucrosePercentage}%</div>
                      <p className="text-[11px] text-charcoal-700/70 mt-1">الحد الأقصى: 5% (يؤكد تغذية النحل الحصرية على رحيق الأزهار البرية الطبيعية).</p>
                    </div>

                    <div className="bg-ivory-50 p-5 rounded-2xl border border-ivory-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-charcoal-700/80 font-medium">نقاء طيف حبوب اللقاح (Pollen)</span>
                        <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-bold">أحادي المصدر</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-zaad-900">{searchedProduct.latestLabBatch.pollenPurityPercentage}%</div>
                      <p className="text-[11px] text-charcoal-700/70 mt-1">فحص المجهر الإلكتروني لطيف حبوب اللقاح يثبت أصالة المصدر الزهري الحصري.</p>
                    </div>

                    <div className="bg-zaad-900 text-ivory-100 p-5 rounded-2xl border border-gold-500/30 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-gold-400 font-bold mb-1">الختم الرقمي للشهادة:</div>
                        <p className="text-[11px] text-ivory-300 leading-relaxed">
                          الشهادة مسجلة وموثقة وموقعة إلكترونياً من المختبر.
                        </p>
                      </div>
                      <div className="pt-3">
                        <Link
                          href={`/product/${searchedProduct.slug}`}
                          className="block text-center bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold py-2 rounded-lg transition-colors"
                        >
                          اقتناء من هذه التشغيلة المعتمدة
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300 shadow-sm max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-zaad-900">لم يتم العثور على تشغيلة مطابقة</h3>
              <p className="text-xs text-charcoal-700/70">
                يرجى التأكد من كتابة رقم التشغيلة كما هو موضح على ملصق البرطمان، أو تجربة أحد الأرقام النموذجية أعلاه.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}

export default function PurityCheckerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory-100 flex items-center justify-center text-zaad-900 font-serif">جاري تحميل نظام التوثيق...</div>}>
      <PurityCheckerContent />
    </Suspense>
  );
}
