'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  History,
  Boxes,
  PackageCheck,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { InventoryMovement } from '@/types';
import { adminFetch } from '@/lib/auth/adminFetch';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [metrics, setMetrics] = useState({
    totalSkus: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [actionType, setActionType] = useState<'restock_batch' | 'manual_add' | 'manual_deduct' | 'damage_loss' | 'manual_set'>('restock_batch');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustReference, setAdjustReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await adminFetch('/api/inventory', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setProducts(json.data.products || []);
        setMovements(json.data.movements || []);
        setMetrics(json.data.metrics || { totalSkus: 0, totalUnits: 0, lowStockCount: 0, outOfStockCount: 0 });
      }
      setLoading(false);
    } catch (e) {
      console.error('Error loading inventory data:', e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openAdjustModal = (product?: any) => {
    setSelectedProduct(product || products[0] || null);
    setActionType('restock_batch');
    setAdjustQuantity(10);
    setAdjustReason('توريد دفعة مخزون جديدة من المناحل');
    setAdjustReference(product ? product.sku : 'RESTOCK-2026');
    setAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);

    try {
      const res = await adminFetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          actionType,
          quantity: Number(adjustQuantity),
          reason: adjustReason,
          referenceId: adjustReference || selectedProduct.sku,
          reviewerName: 'إدارة المستودعات المركزية'
        })
      });

      const json = await res.json();
      if (json.success) {
        showNotification('success', `تم تحديث مخزون [${selectedProduct.nameAr}] بنجاح وتسجيل الحركة في السجل.`);
        setAdjustModalOpen(false);
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل تحديث المخزون');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in font-arabic">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>إدارة المستودعات المبردة وحركة الجرد الآلية</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            المخزون والتنبيهات وسجل الحركات
          </h1>
        </div>

        <button
          onClick={() => openAdjustModal()}
          className="bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 px-5 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>توريد مخزون / تعديل يدوي</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in border ${
          notification.type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">الأصناف المسجلة (SKUs)</span>
            <span className="font-serif text-2xl font-bold text-zaad-900">{metrics.totalSkus}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-ivory-100 border border-ivory-300 flex items-center justify-center text-zaad-900">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">إجمالي الوحدات بالمستودع</span>
            <span className="font-serif text-2xl font-bold text-zaad-900">{metrics.totalUnits}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">تنبيهات انخفاض المخزون</span>
            <span className="font-serif text-2xl font-bold text-amber-700">{metrics.lowStockCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">محاصيل نفدت بالكامل</span>
            <span className="font-serif text-2xl font-bold text-red-700">{metrics.outOfStockCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-300 flex items-center justify-center text-red-700">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="بحث بالاسم أو رمز SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-2.5 pl-9 text-xs focus:border-gold-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-charcoal-700/50 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-charcoal-700">حالة التوفر:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-2 text-xs font-bold text-zaad-900 focus:outline-none"
          >
            <option value="all">الكل ({products.length})</option>
            <option value="in_stock">متوفر بالمستودع</option>
            <option value="low_stock">مخزون منخفض (&lt; حد التنبيه)</option>
            <option value="out_of_stock">نفد المخزون (0)</option>
          </select>
        </div>
      </div>

      {/* Products Stock Table */}
      {loading ? (
        <div className="p-12 text-center text-zaad-900 font-serif">جاري تحميل مستويات المخزون من Supabase...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-ivory-200 flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-zaad-900 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-gold-600" />
              <span>جدول كميات المخزون المتاحة والمحجوزة</span>
            </h3>
            <span className="text-xs text-charcoal-700/60 font-mono">LIVE STOCK TABLE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
                <tr>
                  <th className="p-4">المنتج</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">الكمية الإجمالية</th>
                  <th className="p-4">المحجوز للطلبات</th>
                  <th className="p-4">المتاح الفعلي</th>
                  <th className="p-4">حد التنبيه</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-left">إجراء تعديل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredProducts.map((p) => {
                  const isLow = p.status === 'low_stock';
                  const isOut = p.status === 'out_of_stock';

                  return (
                    <tr key={p.id} className="hover:bg-ivory-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-ivory-100 border border-ivory-200 shrink-0">
                            <Image src={p.image || '/images/zaad-logo.png'} alt={p.nameAr} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-zaad-900">{p.nameAr}</div>
                            <div className="text-[11px] text-charcoal-700/60 font-mono">SKU: {p.sku}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-zaad-900">{p.categoryNameAr}</td>

                      <td className="p-4 font-mono font-bold text-base text-zaad-900">{p.stockQuantity}</td>
                      <td className="p-4 font-mono font-bold text-gold-700">{p.reservedStock}</td>
                      <td className="p-4 font-mono font-bold text-base">
                        <span className={isOut ? 'text-red-600' : (isLow ? 'text-amber-600' : 'text-green-700')}>
                          {p.availableStock}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-charcoal-700">{p.lowStockThreshold}</td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          isOut
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : (isLow
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-green-50 text-green-700 border border-green-200')
                        }`}>
                          {isOut ? 'نفد بالكامل' : (isLow ? 'مخزون منخفض' : 'متوفر بالمستودع')}
                        </span>
                      </td>

                      <td className="p-4 text-left">
                        <button
                          onClick={() => openAdjustModal(p)}
                          className="bg-ivory-100 hover:bg-gold-100 text-zaad-900 border border-ivory-300 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
                        >
                          تعديل / توريد
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Inventory Movements Audit Log */}
      <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-zaad-900 flex items-center gap-2">
              <History className="w-5 h-5 text-gold-600" />
              <span>سجل حركة المخزون المباشر (Inventory Movements Log)</span>
            </h3>
            <p className="text-xs text-charcoal-700/60">
              توثيق لحظي وغير قابل للتعديل لجميع عمليات الخصم التلقائي عند اعتماد الطلبات والتوريدات اليدوية
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-2 bg-ivory-100 hover:bg-ivory-200 text-zaad-900 rounded-xl transition-colors"
            title="تحديث السجل"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
              <tr>
                <th className="p-3">التاريخ والوقت</th>
                <th className="p-3">المنتج</th>
                <th className="p-3">نوع الحركة</th>
                <th className="p-3">الكمية المتغيرة</th>
                <th className="p-3">المخزون بعد الحركة</th>
                <th className="p-3">السبب / الملاحظة</th>
                <th className="p-3">المرجع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-charcoal-700/60">
                    لا توجد حركات مخزون مسجلة حتى الآن
                  </td>
                </tr>
              ) : (
                movements.map((m) => {
                  const isPositive = m.quantityChanged > 0;

                  return (
                    <tr key={m.id} className="hover:bg-ivory-50/50 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-charcoal-700/70">
                        {new Date(m.createdAt).toLocaleString('ar-SA')}
                      </td>

                      <td className="p-3 font-bold text-zaad-900">
                        {m.productNameAr || 'محصول ملكي'}
                      </td>

                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.movementType === 'sale_fulfillment'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : (m.movementType === 'restock_batch'
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : (m.movementType === 'damage_loss'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-purple-50 text-purple-800 border border-purple-200'))
                        }`}>
                          {m.movementType === 'sale_fulfillment' && 'خصم مبيعات آلي'}
                          {m.movementType === 'restock_batch' && 'توريد محصول'}
                          {m.movementType === 'damage_loss' && 'تالف / فاقد'}
                          {m.movementType === 'manual_adjustment' && 'تعديل جرد يدوي'}
                          {m.movementType === 'audit_adjustment' && 'تسوية تدقيق'}
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-sm">
                        <span className={`flex items-center gap-1 ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
                          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          <span>{isPositive ? `+${m.quantityChanged}` : m.quantityChanged}</span>
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-zaad-900">
                        {m.quantityAfter} وحدة
                      </td>

                      <td className="p-3 text-charcoal-700">{m.reason}</td>

                      <td className="p-3 font-mono text-[11px] text-gold-700">
                        {m.referenceId || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUSTMENT & RESTOCK MODAL */}
      {adjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-zaad-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-ivory-300 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div>
                <span className="text-xs text-gold-600 font-bold block">إجراء عمليات المستودع</span>
                <h3 className="font-serif text-lg font-bold text-zaad-900">
                  تعديل مخزون: {selectedProduct.nameAr}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-charcoal-700 bg-ivory-100 px-3 py-1 rounded-lg">
                الحالي: {selectedProduct.stockQuantity}
              </span>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zaad-900 mb-1">نوع العملية المستودعية *</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-bold text-xs focus:border-gold-500 focus:outline-none"
                >
                  <option value="restock_batch">توريد دفعة مخزون جديدة من المناحل (+)</option>
                  <option value="manual_add">إضافة كمية للمخزون (+)</option>
                  <option value="manual_deduct">خصم كمية من المخزون (-)</option>
                  <option value="damage_loss">تسجيل تالف / كسر عبوات (-)</option>
                  <option value="manual_set">تعيين إجمالي الجرد الفعلي (=)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">
                  {actionType === 'manual_set' ? 'إجمالي الكمية الفعلية الجديدة *' : 'الكمية المراد إضافتها / خصمها *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-mono font-bold text-base text-zaad-900 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">السبب / الملاحظة التوثيقية *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="مثال: توريد حصاد موسم 2026 من وادي دوعن"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">رقم الفاتورة أو مرجع التوريد</label>
                <input
                  type="text"
                  value={adjustReference}
                  onChange={(e) => setAdjustReference(e.target.value)}
                  placeholder="RESTOCK-ZD-2026"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-mono focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 bg-ivory-100 text-xs font-bold rounded-xl text-charcoal-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ...' : 'اعتماد حركة المخزون'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
