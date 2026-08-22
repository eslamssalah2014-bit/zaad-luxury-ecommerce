'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { FinancialKPIs, TimeframeSales, ProfitReportItem } from '@/types';

export default function AdminProfitPage() {
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [financialKpis, setFinancialKpis] = useState<FinancialKPIs | null>(null);
  const [timeframeSales, setTimeframeSales] = useState<TimeframeSales | null>(null);
  const [profitabilityReport, setProfitabilityReport] = useState<ProfitReportItem[]>([]);
  const [highlights, setHighlights] = useState<{
    mostProfitable: ProfitReportItem[];
    bestSelling: ProfitReportItem[];
    lowestMargin: ProfitReportItem[];
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/profit', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setFinancialKpis(json.data.financialKpis);
        setTimeframeSales(json.data.timeframeSales);
        setProfitabilityReport(json.data.profitabilityReport || []);
        setHighlights(json.data.highlights);
      }
      setLoading(false);
    } catch (e) {
      console.error('Error loading profit analytics:', e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-8 animate-fade-in font-arabic">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>لوحة المؤشرات والتحليلات المالية المتقدمة</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            تحليلات الأرباح وهوامش الربحية
          </h1>
        </div>

        <button
          onClick={loadData}
          className="bg-white hover:bg-ivory-50 text-zaad-900 border border-ivory-300 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-gold-600" />
          <span>تحديث الحسابات اللحظية</span>
        </button>
      </div>

      {loading || !financialKpis ? (
        <div className="p-16 text-center text-zaad-900 font-serif">
          جاري احتساب هوامش الربحية وتكلفة المبيعات من قاعدة بيانات Supabase...
        </div>
      ) : (
        <>
          {/* Executive Financial KPIs Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-700/70 font-bold">إجمالي الإيرادات</span>
                <div className="w-8 h-8 rounded-xl bg-ivory-100 flex items-center justify-center text-zaad-900">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
                {formatPrice(financialKpis.totalRevenue)}
              </div>
              <span className="text-[11px] text-charcoal-700/60 block">من إجمالي {financialKpis.totalOrders} طلباً معتمداً</span>
            </div>

            {/* Total Cost */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-700/70 font-bold">تكلفة البضاعة المباعة (COGS)</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-800">
                {formatPrice(financialKpis.totalCost)}
              </div>
              <span className="text-[11px] text-charcoal-700/60 block">التكلفة المباشرة لـ {financialKpis.totalUnitsSold} وحدة</span>
            </div>

            {/* Gross Profit */}
            <div className="bg-gradient-to-br from-zaad-950 to-zaad-900 text-ivory-50 p-6 rounded-3xl border border-zaad-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gold-400 font-bold">صافي الربح الإجمالي</span>
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">
                {formatPrice(financialKpis.grossProfit)}
              </div>
              <span className="text-[11px] text-ivory-400 block">الإيرادات - التكلفة المباشرة</span>
            </div>

            {/* Gross Margin % */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-700/70 font-bold">متوسط هامش الربح</span>
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                  <PieChart className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-green-700">
                {financialKpis.grossMarginPercent}%
              </div>
              <span className="text-[11px] text-charcoal-700/60 block">متوسط العائد لكل جنيه مبيعات</span>
            </div>

          </div>

          {/* Periodic Sales Timeframes (Today, Week, Month, Year) */}
          {timeframeSales && (
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <h3 className="font-serif text-base font-bold text-zaad-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-600" />
                  <span>توزيع المبيعات عبر الفترات الزمنية</span>
                </h3>
                <span className="text-xs text-charcoal-700/60 font-mono">PERIODIC BREAKDOWN</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
                  <span className="text-xs text-charcoal-700/70 font-bold block">مبيعات اليوم</span>
                  <div className="font-serif text-xl font-bold text-zaad-900">{formatPrice(timeframeSales.todayRevenue)}</div>
                  <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframeSales.todayOrders} طلبات</span>
                </div>

                <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
                  <span className="text-xs text-charcoal-700/70 font-bold block">هذا الأسبوع</span>
                  <div className="font-serif text-xl font-bold text-zaad-900">{formatPrice(timeframeSales.weekRevenue)}</div>
                  <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframeSales.weekOrders} طلبات</span>
                </div>

                <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
                  <span className="text-xs text-charcoal-700/70 font-bold block">هذا الشهر</span>
                  <div className="font-serif text-xl font-bold text-zaad-900">{formatPrice(timeframeSales.monthRevenue)}</div>
                  <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframeSales.monthOrders} طلبات</span>
                </div>

                <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
                  <span className="text-xs text-charcoal-700/70 font-bold block">هذا العام (2026)</span>
                  <div className="font-serif text-xl font-bold text-gold-700">{formatPrice(timeframeSales.yearRevenue)}</div>
                  <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframeSales.yearOrders} طلبات</span>
                </div>
              </div>
            </div>
          )}

          {/* Highlights Grid (Best Selling, Most Profitable, Lowest Margin) */}
          {highlights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Most Profitable */}
              <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-700 border-b border-ivory-200 pb-2">
                  <Award className="w-4 h-4 text-gold-600" />
                  <span>الأعلى ربحية (Most Profitable)</span>
                </div>
                <div className="space-y-2">
                  {highlights.mostProfitable.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-ivory-50 rounded-xl">
                      <span className="font-bold text-zaad-900 truncate max-w-[140px]">{p.productNameAr}</span>
                      <span className="font-mono font-bold text-green-700">{formatPrice(p.grossProfit)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Selling */}
              <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zaad-900 border-b border-ivory-200 pb-2">
                  <ShoppingBag className="w-4 h-4 text-zaad-800" />
                  <span>الأكثر طلباً ومبيعاً (Best Selling)</span>
                </div>
                <div className="space-y-2">
                  {highlights.bestSelling.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-ivory-50 rounded-xl">
                      <span className="font-bold text-zaad-900 truncate max-w-[140px]">{p.productNameAr}</span>
                      <span className="font-mono font-bold text-gold-700">{p.unitsSold} عبوات</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lowest Margin */}
              <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 border-b border-ivory-200 pb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>الأقل في هامش الربح (Lowest Margin)</span>
                </div>
                <div className="space-y-2">
                  {highlights.lowestMargin.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-ivory-50 rounded-xl">
                      <span className="font-bold text-zaad-900 truncate max-w-[140px]">{p.productNameAr}</span>
                      <span className="font-mono font-bold text-amber-700">{p.profitMarginPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Product Profitability Report Table */}
          <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-zaad-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-gold-600" />
                  <span>تقرير ربحية المنتجات والمحاصيل (Product Profitability Report)</span>
                </h3>
                <p className="text-xs text-charcoal-700/60">
                  تحليل مالي مفصل للوحدات المباعة، الإيرادات المحققة، التكاليف المباشرة، وهامش الربح الصافي
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
                  <tr>
                    <th className="p-3">المنتج</th>
                    <th className="p-3">التصنيف</th>
                    <th className="p-3">سعر البيع</th>
                    <th className="p-3">التكلفة (Cost)</th>
                    <th className="p-3">الوحدات المباعة</th>
                    <th className="p-3">إجمالي الإيراد</th>
                    <th className="p-3">إجمالي التكلفة</th>
                    <th className="p-3">صافي الربح</th>
                    <th className="p-3">نسبة الهامش</th>
                    <th className="p-3">صحة الهامش</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {profitabilityReport.map((p) => {
                    const health = p.profitMarginPercent >= 55
                      ? { label: 'ممتاز (>55%)', color: 'bg-green-50 text-green-700 border-green-200' }
                      : (p.profitMarginPercent >= 40
                        ? { label: 'جيد (40-55%)', color: 'bg-blue-50 text-blue-700 border-blue-200' }
                        : { label: 'منخفض (<40%)', color: 'bg-amber-50 text-amber-700 border-amber-200' });

                    return (
                      <tr key={p.productId} className="hover:bg-ivory-50/50 transition-colors">
                        <td className="p-3 font-bold text-zaad-900">
                          <div>{p.productNameAr}</div>
                          <div className="text-[10px] text-charcoal-700/60 font-mono">SKU: {p.sku}</div>
                        </td>

                        <td className="p-3 text-charcoal-700">{p.categoryNameAr}</td>

                        <td className="p-3 font-mono font-bold text-zaad-900">{formatPrice(p.sellingPrice)}</td>
                        <td className="p-3 font-mono text-charcoal-700">{formatPrice(p.costPrice)}</td>
                        <td className="p-3 font-mono font-bold text-gold-700">{p.unitsSold}</td>
                        <td className="p-3 font-mono font-bold text-zaad-900">{formatPrice(p.totalRevenue)}</td>
                        <td className="p-3 font-mono text-charcoal-700">{formatPrice(p.totalCost)}</td>
                        
                        <td className="p-3 font-mono font-bold text-green-700">
                          {formatPrice(p.grossProfit)}
                        </td>

                        <td className="p-3 font-mono font-bold">
                          {p.profitMarginPercent}%
                        </td>

                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${health.color}`}>
                            {health.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
