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
  AlertTriangle
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics', { cache: 'no-store' });
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setAnalytics(json.data);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error fetching admin analytics from Supabase:', e);
        if (isMounted) setLoading(false);
      }
    }
    loadAnalytics();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الإشراف والمطابقة الملكية المباشرة (Supabase Live)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            لوحة المؤشرات والعمليات التنفيذية
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders/verification"
            className="bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all gold-shimmer-btn"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>طابور فحص الإيصالات ({analytics.pendingVerifications})</span>
          </Link>
        </div>
      </div>

      {/* Verification Urgent Alert Banner */}
      {analytics.pendingVerifications > 0 && (
        <div className="bg-gold-50 border-2 border-gold-400/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500 text-zaad-950 flex items-center justify-center font-bold animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zaad-900">
                يوجد {analytics.pendingVerifications} إيصال تحويل بنكي في انتظار الاعتماد الفوري
              </h3>
              <p className="text-xs text-charcoal-700/80 mt-0.5">
                تأكيد الإيصالات يتيح لفريق التعبئة نقل البرطمانات للشحن المبرد فوراً.
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders/verification"
            className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shrink-0"
          >
            بدء المطابقة الآن
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span>إجمالي الإيرادات المعتمدة</span>
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {formatPrice(analytics.totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-green-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>بيانات حية مباشرة من Supabase</span>
          </div>
        </div>

        {/* Metric 2: Average Order Value */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span>متوسط قيمة السلة (AOV)</span>
            <div className="w-8 h-8 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {formatPrice(analytics.avgOrderValue)}
          </div>
          <div className="text-[11px] text-charcoal-700/70">
            معيار الفخامة الهادئة والطلب المزدوج
          </div>
        </div>

        {/* Metric 3: Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span>إجمالي الطلبات المسجلة</span>
            <div className="w-8 h-8 rounded-full bg-zaad-50 text-zaad-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {analytics.totalOrders}
          </div>
          <div className="text-[11px] text-zaad-700 font-semibold">
            {analytics.totalOrders - analytics.pendingVerifications} طلب معتمد ومكتمل
          </div>
        </div>

        {/* Metric 4: Total Customers */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-700/70">
            <span>إجمالي عملاء النخبة</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-mono">
            {analytics.totalCustomers || 12}
          </div>
          <div className="text-[11px] text-purple-700 font-semibold">
            أعضاء الدائرة الملكية الخاصة
          </div>
        </div>

      </div>

      {/* Monthly Revenue Breakdown */}
      {analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-zaad-900">مؤشر نمو المبيعات الشهرية (2026)</h3>
              <p className="text-xs text-charcoal-700/70">إجمالي المبيعات المحققة لدار زاد للنقاء في Supabase</p>
            </div>
            <span className="text-xs text-gold-700 font-mono font-bold bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
              تحديث مباشر
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 pt-6 items-end h-48 border-b border-ivory-200 pb-2">
            {analytics.monthlyRevenue.map((m: any) => {
              const heightPct = Math.min(100, Math.max(20, Math.round((m.revenue / (analytics.totalRevenue || 1)) * 100)));
              return (
                <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-charcoal-700/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(m.revenue)}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-zaad-800 to-gold-500 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[11px] text-charcoal-700/70 font-semibold">{m.month}</span>
                </div>
              );
            })}
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
