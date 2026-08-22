'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Layers, AlertTriangle, CheckCircle2, TrendingDown, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { getLiveProducts } from '@/lib/services/productService';
import { Product } from '@/types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const live = await getLiveProducts();
        if (isMounted) {
          setProducts(live);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error loading inventory products:', e);
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>المستودعات المبردة وحركة المخزون المباشرة</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
          إدارة المخزون والتنبيهات الذكية
        </h1>
      </div>

      {/* Stock Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-zaad-900 font-serif">جاري تحميل مستويات المخزون من Supabase...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const isLow = p.stockQuantity <= p.lowStockThreshold;

            return (
              <div key={p.id} className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-ivory-100 border border-ivory-200 shrink-0">
                    <Image src={p.images[0] || '/images/zaad-logo.png'} alt={p.nameAr} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-zaad-900 truncate">{p.nameAr}</h3>
                    <span className="text-[10px] text-charcoal-700/60 font-mono">SKU: {p.sku}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-ivory-50 p-3 rounded-2xl border border-ivory-200 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-700/70 block">المتاح:</span>
                    <span className={`font-mono text-base font-bold ${isLow ? 'text-red-600' : 'text-green-700'}`}>
                      {p.stockQuantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-700/70 block">المحجوز:</span>
                    <span className="font-mono text-base font-bold text-gold-700">{p.reservedStock}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-700/70 block">حد التنبيه:</span>
                    <span className="font-mono text-base font-bold text-charcoal-700">{p.lowStockThreshold}</span>
                  </div>
                </div>

                {isLow && (
                  <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>تنبيه: اقتراب نفاد المحصول من المستودع!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
