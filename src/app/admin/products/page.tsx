'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Edit,
  Award,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getLiveProducts } from '@/lib/services/productService';
import { supabase } from '@/lib/supabase/client';
import { useCurrency } from '@/context/CurrencyContext';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editLabModal, setEditLabModal] = useState(false);

  // Form states for batch update
  const [batchNum, setBatchNum] = useState('');
  const [labName, setLabName] = useState('');
  const [moisture, setMoisture] = useState(14.2);
  const [hmf, setHmf] = useState(2.1);
  const [diastase, setDiastase] = useState(19.4);
  const [pollen, setPollen] = useState(98.6);
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      const live = await getLiveProducts();
      setProducts(live);
      setLoading(false);
    } catch (e) {
      console.error('Error loading admin products:', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openLabModal = (p: Product) => {
    setSelectedProduct(p);
    setBatchNum(p.latestLabBatch?.batchNumber || 'ZD-2026-LIVE');
    setLabName(p.latestLabBatch?.labName || 'مختبر الجودة الأوروبية');
    setMoisture(p.latestLabBatch?.moisturePercentage || 14.2);
    setHmf(p.latestLabBatch?.hmfLevel || 2.1);
    setDiastase(p.latestLabBatch?.diastaseActivity || 19.4);
    setPollen(p.latestLabBatch?.pollenPurityPercentage || 98.6);
    setEditLabModal(true);
  };

  const handleSaveLabBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // Update in Supabase product_batches table
      await supabase
        .from('product_batches')
        .upsert({
          product_id: selectedProduct.id,
          batch_number: batchNum,
          lab_name: labName,
          moisture_percentage: Number(moisture),
          hmf_level: Number(hmf),
          diastase_activity: Number(diastase),
          pollen_purity_percentage: Number(pollen),
          harvest_season: 'المحصول الملكي 2026',
          harvest_date: '2026-01-15',
          tested_date: new Date().toISOString().split('T')[0],
          sucrose_percentage: 0.8,
          initial_jars_count: 50,
          remaining_jars_count: selectedProduct.stockQuantity
        }, { onConflict: 'batch_number' });

      await loadData();
      setSuccessMsg(`تم تحديث شهادة التحليل المخبري للتشغيلة ${batchNum} بنجاح في قاعدة بيانات Supabase.`);
      setEditLabModal(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error saving batch to Supabase:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>إدارة الأصناف والتحليلات المخبرية المباشرة</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            سجل المحاصيل وتشغيلات المختبر
          </h1>
        </div>

        <button
          onClick={() => alert('إضافة محصول ملكي جديد')}
          className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة محصول جديد</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-zaad-900 font-serif">جاري تحميل المحاصيل من Supabase...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden bg-ivory-100 border border-ivory-200">
                  <Image src={p.images[0] || '/images/zaad-logo.png'} alt={p.nameAr} fill className="object-cover" />
                  {p.badge && (
                    <span className="absolute top-3 right-3 bg-zaad-900/90 text-gold-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gold-400/40">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-zaad-900 line-clamp-1">{p.nameAr}</h3>
                  <p className="text-xs text-gold-700 font-bold mt-0.5 font-mono">{formatPrice(p.price)}</p>
                  <p className="text-[11px] text-charcoal-700/60 mt-1">{p.originRegionAr}</p>
                </div>

                {/* Lab Batch Summary Badge */}
                {p.latestLabBatch && (
                  <div className="bg-ivory-50 p-3 rounded-xl border border-ivory-300 space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-charcoal-700/70">التشغيلة:</span>
                      <strong className="text-zaad-900">{p.latestLabBatch.batchNumber}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-charcoal-700/70">الرطوبة / HMF:</span>
                      <span className="font-mono text-green-700 font-bold">{p.latestLabBatch.moisturePercentage}% • {p.latestLabBatch.hmfLevel}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-charcoal-700/70">نقاء اللقاح:</span>
                      <span className="font-mono text-green-700 font-bold">{p.latestLabBatch.pollenPurityPercentage}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-ivory-200 flex gap-2">
                <button
                  onClick={() => openLabModal(p)}
                  className="flex-1 bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-gold-400" />
                  <span>تعديل نتائج الفحص</span>
                </button>
                <button
                  onClick={() => alert(`تعديل بيانات ${p.nameAr}`)}
                  className="p-2 bg-ivory-100 hover:bg-ivory-200 text-zaad-900 rounded-xl transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Edit Lab Batch Modal */}
      {editLabModal && selectedProduct && (
        <div className="fixed inset-0 bg-zaad-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-ivory-300 shadow-2xl space-y-6 animate-scale-in">
            
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <div className="flex items-center gap-2 text-zaad-900">
                <Award className="w-5 h-5 text-gold-600" />
                <h3 className="font-serif text-lg font-bold">تعديل التوثيق المخبري للتشغيلة</h3>
              </div>
              <button
                onClick={() => setEditLabModal(false)}
                className="text-charcoal-400 hover:text-charcoal-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-charcoal-700/80">
              الصنف: <strong className="text-zaad-900">{selectedProduct.nameAr}</strong>
            </div>

            <form onSubmit={handleSaveLabBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zaad-900 mb-1">رقم التشغيلة:</label>
                  <input
                    type="text"
                    required
                    value={batchNum}
                    onChange={(e) => setBatchNum(e.target.value)}
                    className="w-full text-xs font-mono bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zaad-900 mb-1">المختبر المعتمد:</label>
                  <input
                    type="text"
                    required
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zaad-900 mb-1">نسبة الرطوبة (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full text-xs font-mono bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zaad-900 mb-1">مستوى HMF (ملغ/كغ):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={hmf}
                    onChange={(e) => setHmf(Number(e.target.value))}
                    className="w-full text-xs font-mono bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zaad-900 mb-1">نشاط الدياستيز:</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={diastase}
                    onChange={(e) => setDiastase(Number(e.target.value))}
                    className="w-full text-xs font-mono bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zaad-900 mb-1">نقاء اللقاح (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={pollen}
                    onChange={(e) => setPollen(Number(e.target.value))}
                    className="w-full text-xs font-mono bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-ivory-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditLabModal(false)}
                  className="px-4 py-2 bg-ivory-100 text-charcoal-700 text-xs font-bold rounded-xl hover:bg-ivory-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  حفظ الشهادة المحدثة
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
