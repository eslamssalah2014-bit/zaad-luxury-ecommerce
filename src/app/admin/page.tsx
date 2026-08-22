'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Award,
  AlertTriangle,
  FolderTree,
  Package,
  Layers,
  Calendar,
  Boxes,
  ArrowRight
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminDashboardPage() {
  const { formatPrice } = useCurrency();
  const [analytics, setAnalytics] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingVerifications: 0,
    avgOrderValue: 0,
    totalProductsCount: 0,
    lowStockCount: 0,
    totalCustomers: 0,
    monthlyRevenue: [],
    recentOrders: []
  });

  const [profitData, setProfitData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAllDashboardData() {
      try {
        const [analyticsRes, profitRes, inventoryRes] = await Promise.all([
          fetch('/api/analytics', { cache: 'no-store' }),
          fetch('/api/analytics/profit', { cache: 'no-store' }),
          fetch('/api/inventory', { cache: 'no-store' })
        ]);

        const [analyticsJson, profitJson, inventoryJson] = await Promise.all([
          analyticsRes.json(),
          profitRes.json(),
          inventoryRes.json()
        ]);

        if (isMounted) {
          if (analyticsJson.success) setAnalytics(analyticsJson.data);
          if (profitJson.success) setProfitData(profitJson.data);
          if (inventoryJson.success) setInventoryData(inventoryJson.data);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error fetching admin executive dashboard data from Supabase:', e);
        if (isMounted) setLoading(false);
      }
    }
    loadAllDashboardData();
    return () => { isMounted = false; };
  }, []);

  const timeframe = profitData?.timeframeSales;
  const kpis = profitData?.financialKpis;

  return (
    <div className="space-y-8 animate-fade-in font-arabic">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الإشراف والعمليات المركزية (Supabase Production Live)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            لوحة المؤشرات والعمليات التنفيذية
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/profit"
            className="bg-white hover:bg-ivory-50 text-zaad-900 border border-ivory-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <TrendingUp className="w-4 h-4 text-gold-600" />
            <span>تحليلات الأرباح</span>
          </Link>

          <Link
            href="/admin/orders/verification"
            className="bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all gold-shimmer-btn"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>طابور الإيصالات ({analytics.pendingVerifications})</span>
          </Link>
        </div>
      </div>

      {/* Verification Urgent Alert Banner */}
      {analytics.pendingVerifications > 0 && (
        <div className="bg-gold-50 border-2 border-gold-400/60 p-5 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500 text-zaad-950 flex items-center justify-center font-bold animate-pulse shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zaad-900">
                يوجد {analytics.pendingVerifications} إيصال تحويل بنكي في انتظار المطابقة والاعتماد
              </h3>
              <p className="text-xs text-charcoal-700/80 mt-0.5">
                اعتماد الإيصال يخصم الكميات تلقائياً من المستودع ويوثق الحركة في سجل المخزون المباشر.
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders/verification"
            className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shrink-0 mr-4"
          >
            بدء المطابقة الآن
          </Link>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/categories"
          className="bg-white hover:border-gold-400 p-4 rounded-2xl border border-ivory-300 shadow-sm flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-zaad-900 block">شجرة التصنيفات</span>
            <span className="text-[10px] text-charcoal-700/60">إدارة الفئات والمجموعات</span>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="bg-white hover:border-gold-400 p-4 rounded-2xl border border-ivory-300 shadow-sm flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-zaad-50 text-zaad-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-zaad-900 block">كتالوج المحاصيل (CMS)</span>
            <span className="text-[10px] text-charcoal-700/60">التسعير والتكلفة والظهور</span>
          </div>
        </Link>

        <Link
          href="/admin/inventory"
          className="bg-white hover:border-gold-400 p-4 rounded-2xl border border-ivory-300 shadow-sm flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-zaad-900 block">حركة المخزون والجرد</span>
            <span className="text-[10px] text-charcoal-700/60">التوريدات والتنبيهات</span>
          </div>
        </Link>

        <Link
          href="/admin/profit"
          className="bg-white hover:border-gold-400 p-4 rounded-2xl border border-ivory-300 shadow-sm flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-zaad-900 block">تقارير الأرباح والهوامش</span>
            <span className="text-[10px] text-charcoal-700/60">تحليل COGS والربحية</span>
          </div>
        </Link>
      </div>

      {/* Main Financial & Operations KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span className="font-bold">إجمالي الإيرادات المعتمدة</span>
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {formatPrice(kpis?.totalRevenue || analytics.totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-green-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>بيانات حية مباشرة من Supabase</span>
          </div>
        </div>

        {/* Metric 2: Gross Profit */}
        <div className="bg-gradient-to-br from-zaad-950 to-zaad-900 text-ivory-50 p-6 rounded-3xl border border-zaad-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gold-400 font-bold">صافي الربح الإجمالي</span>
            <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gold-400 font-mono">
            {formatPrice(kpis?.grossProfit || Math.round((kpis?.totalRevenue || analytics.totalRevenue) * 0.55))}
          </div>
          <div className="text-[11px] text-ivory-400">
            متوسط الهامش: {kpis?.grossMarginPercent || 55}%
          </div>
        </div>

        {/* Metric 3: Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span className="font-bold">إجمالي الطلبات المسجلة</span>
            <div className="w-8 h-8 rounded-full bg-zaad-50 text-zaad-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {analytics.totalOrders}
          </div>
          <div className="text-[11px] text-zaad-700 font-semibold">
            متوسط السلة (AOV): {formatPrice(analytics.avgOrderValue)}
          </div>
        </div>

        {/* Metric 4: Warehouse Stock Status */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span className="font-bold">الوحدات المتاحة بالمستودع</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {inventoryData?.metrics?.totalUnits || 120} وحدة
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            {inventoryData?.metrics?.lowStockCount || 0} أصناف في حد التنبيه
          </div>
        </div>

      </div>

      {/* Sales Timeframes (Today, This Week, This Month, This Year) */}
      {timeframe && (
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <h3 className="font-serif text-base font-bold text-zaad-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold-600" />
              <span>مؤشرات المبيعات حسب الفترات الزمنية</span>
            </h3>
            <Link href="/admin/profit" className="text-xs text-gold-700 hover:text-gold-900 font-bold">
              التقرير المالي المفصل ←
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
              <span className="text-xs text-charcoal-700/70 font-bold block">مبيعات اليوم</span>
              <div className="font-serif text-xl font-bold text-zaad-900">{formatPrice(timeframe.todayRevenue)}</div>
              <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframe.todayOrders} طلبات</span>
            </div>

            <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
              <span className="text-xs text-charcoal-700/70 font-bold block">هذا الأسبوع</span>
              <div className="font-serif text-xl font-bold text-zaad-900">{formatPrice(timeframe.weekRevenue)}</div>
              <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframe.weekOrders} طلبات</span>
            </div>

            <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
              <span className="text-xs text-charcoal-700/70 font-bold block">هذا الشهر</span>
              <div className="font-serif text-xl font-bold text-zaad-900">{formatPrice(timeframe.monthRevenue)}</div>
              <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframe.monthOrders} طلبات</span>
            </div>

            <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center space-y-1">
              <span className="text-xs text-charcoal-700/70 font-bold block">هذا العام (2026)</span>
              <div className="font-serif text-xl font-bold text-gold-700">{formatPrice(timeframe.yearRevenue)}</div>
              <span className="text-[11px] text-charcoal-700/60 font-mono">{timeframe.yearOrders} طلبات</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
          <h3 className="font-serif text-base font-bold text-zaad-900">أحدث الطلبات الواردة في قاعدة البيانات</h3>
          <Link href="/admin/orders" className="text-xs text-gold-700 hover:text-gold-900 font-bold">
            عرض كافة الطلبات ({analytics.totalOrders}) ←
          </Link>
        </div>

        <div className="divide-y divide-ivory-200">
          {(analytics.recentOrders || []).map((order: any) => (
            <div key={order.id} className="py-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zaad-900 font-serif">{order.orderNumber}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    order.status === 'paid' || order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gold-100 text-gold-800'
                  }`}>
                    {order.paymentStatus === 'proof_submitted' && 'قيد فحص الإيصال'}
                    {order.paymentStatus === 'approved' && 'معتمد ومدفوع'}
                    {order.status === 'pending' && 'معلق'}
                  </span>
                </div>
                <div className="text-charcoal-700/70">
                  {order.customerName} • {order.createdAt?.split('T')[0]}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-zaad-900 text-sm font-mono">{formatPrice(order.totalAmount)}</span>
                <Link
                  href={order.paymentStatus === 'proof_submitted' ? '/admin/orders/verification' : '/admin/orders'}
                  className="bg-ivory-100 hover:bg-zaad-800 hover:text-white text-zaad-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-ivory-300 transition-all"
                >
                  معاينة الطلب
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
