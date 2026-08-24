'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Edit,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCurrency } from '@/context/CurrencyContext';
import { Order, OrderStatus } from '@/types';
import { adminFetch } from '@/lib/auth/adminFetch';

export default function AdminOrdersPage() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      const res = await adminFetch('/api/orders', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
      setLoading(false);
    } catch (e) {
      console.error('Error fetching admin orders from Supabase:', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);

      await loadOrders();
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Customer', 'Phone', 'Total', 'Status', 'Payment Method', 'Date'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerPhone,
      o.totalAmount,
      o.status,
      o.paymentMethod,
      o.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zaad_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>نظام الشحن والعمليات اللوجستية المباشر (Supabase)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            سجل الطلبات والمتابعة المباشرة
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-white hover:bg-ivory-100 text-zaad-900 border border-ivory-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-gold-600" />
          <span>تصدير السجل (CSV)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-ivory-300 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث برقم الطلب أو اسم العميل أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl pr-9 pl-4 py-2.5 focus:border-gold-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-charcoal-400 absolute right-3 top-3 pointer-events-none" />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2.5 focus:border-gold-500 focus:outline-none text-zaad-900 font-medium"
          >
            <option value="all">كافة الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="awaiting_verification">بانتظار تدقيق الإيصال</option>
            <option value="paid">مدفوع ومعتمد</option>
            <option value="preparing">جاري التجهيز</option>
            <option value="shipped">تم الشحن المبرد</option>
            <option value="delivered">تم التسليم</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="p-12 text-center text-zaad-900 font-serif">جاري تحميل الطلبات من Supabase...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-ivory-300 text-charcoal-700">
          لا توجد طلبات مطابقة لمعايير البحث في Supabase.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-ivory-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
                <tr>
                  <th className="p-4">رقم الطلب الملكي</th>
                  <th className="p-4">العميل والموقع</th>
                  <th className="p-4">الأصناف</th>
                  <th className="p-4">الإجمالي</th>
                  <th className="p-4">حالة السداد</th>
                  <th className="p-4">حالة الشحن والتجهيز</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-zaad-900">
                      {ord.orderNumber}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-zaad-900">{ord.customerName}</div>
                      <div className="text-[11px] text-charcoal-700/70 font-mono">{ord.customerPhone}</div>
                    </td>

                    <td className="p-4">
                      <span className="bg-ivory-100 px-2 py-0.5 rounded text-zaad-900 font-bold">
                        {ord.items.length} منتجات
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-zaad-900">
                      {formatPrice(ord.totalAmount)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        ord.paymentStatus === 'proof_submitted' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ord.paymentStatus === 'approved' ? 'معتمد ومطابق' :
                         ord.paymentStatus === 'proof_submitted' ? 'بانتظار التدقيق' : 'غير مسدد'}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className="text-xs bg-white border border-ivory-300 rounded-lg p-1.5 font-bold focus:border-gold-500 focus:outline-none"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="awaiting_verification">فحص الإيصال</option>
                        <option value="paid">معتمد</option>
                        <option value="preparing">جاري التجهيز</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التسليم</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <Link
                        href={`/order-confirmation/${ord.id}`}
                        className="inline-flex items-center gap-1 bg-ivory-100 hover:bg-zaad-800 hover:text-white text-zaad-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>الفاتورة</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
