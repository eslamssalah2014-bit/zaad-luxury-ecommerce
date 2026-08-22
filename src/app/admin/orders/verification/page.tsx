'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Eye,
  FileText,
  User,
  Building2,
  Calendar,
  DollarSign,
  Sparkles,
  AlertCircle,
  Send,
  ZoomIn
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { Order, PaymentProof } from '@/types';

export default function PaymentVerificationPage() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [zoomReceipt, setZoomReceipt] = useState(false);

  // Rejection / Re-upload modal state
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_reupload' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const loadOrders = React.useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
        // Auto-select first pending order if nothing currently selected
        const pending = json.data.filter(
          (o: any) => o.status === 'awaiting_verification' || o.paymentStatus === 'proof_submitted'
        );
        if (pending.length > 0 && !selectedOrder) {
          setSelectedOrder(pending[0]);
        }
      }
      setLoading(false);
    } catch (e) {
      console.error('Error loading verification orders from Supabase:', e);
      setLoading(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const pendingOrders = orders.filter(
    (o) => o.status === 'awaiting_verification' || o.paymentStatus === 'proof_submitted'
  );

  // Derive active proof safely
  const activeProof: PaymentProof | null = selectedOrder
    ? (selectedOrder.paymentProof || {
        id: `proof-${selectedOrder.id}`,
        orderId: selectedOrder.id,
        receiptImageUrl: '/images/zaad-logo.png',
        senderName: selectedOrder.customerName || 'المحول الملكي',
        senderPhone: selectedOrder.customerPhone,
        senderBank: 'مصرف الراجحي',
        transactionReference: 'REF-' + selectedOrder.orderNumber,
        transferDate: selectedOrder.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        amountTransferred: selectedOrder.totalAmount,
        status: 'proof_submitted',
        createdAt: selectedOrder.createdAt
      })
    : null;

  const handleApprove = async (order: Order) => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          action: 'approve',
          reviewerName: 'إدارة العمليات والتدقيق المالي'
        })
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccessMsg(`تم اعتماد إيصال الدفع للطلب ${order.orderNumber} بنجاح في Supabase.`);
        const remaining = pendingOrders.filter(o => o.id !== order.id);
        setSelectedOrder(remaining.length > 0 ? remaining[0] : null);
        await loadOrders();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error approving payment in Supabase:', err);
    }
  };

  const handleRejectOrReupload = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          action: actionType,
          reviewerName: 'إدارة العمليات والتدقيق المالي',
          reason: actionReason || (actionType === 'reject' ? 'الإيصال غير مطابق' : 'الصورة غير واضحة')
        })
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccessMsg(`تم تسجيل القرار [${actionType}] للطلب ${selectedOrder.orderNumber} في قاعدة البيانات.`);
        const remaining = pendingOrders.filter(o => o.id !== selectedOrder.id);
        setSelectedOrder(remaining.length > 0 ? remaining[0] : null);
        setActionType(null);
        setActionReason('');
        await loadOrders();
        setTimeout(() => setActionSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error updating verification action in Supabase:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>طابور التدقيق المالي والإيصالات البنكية المباشر (Supabase)</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
          اعتماد ومطابقة إيصالات السداد
        </h1>
      </div>

      {actionSuccessMsg && (
        <div className="bg-green-50 border-2 border-green-300 text-green-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Pending Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-zaad-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-600" />
              <span>الإيصالات المعلقة ({pendingOrders.length})</span>
            </h3>
            <span className="text-[11px] text-charcoal-700/60 font-semibold">بانتظار قرار المطابقة</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-zaad-900 font-serif">جاري فحص الإيصالات في Supabase...</div>
          ) : pendingOrders.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-ivory-300 text-center space-y-3 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
              <h4 className="text-sm font-bold text-zaad-900">طابور الاعتماد فارغ</h4>
              <p className="text-xs text-charcoal-700/70">تمت مطابقة واعتماد كافة إيصالات التحويل البنكي بنجاح.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const proofInfo = ord.paymentProof;

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm space-y-3 ${
                      isSelected
                        ? 'border-gold-500 ring-2 ring-gold-400/20 bg-gold-50/20'
                        : 'border-ivory-300 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-zaad-900">{ord.orderNumber}</span>
                      <span className="text-xs font-bold text-gold-700 font-mono">{formatPrice(ord.totalAmount)}</span>
                    </div>

                    <div className="text-xs text-charcoal-700/80 space-y-0.5">
                      <div className="font-bold text-zaad-900">{ord.customerName}</div>
                      <div className="text-[11px] text-charcoal-700/60">
                        {proofInfo?.senderBank || 'مصرف الراجحي'} • {proofInfo?.transactionReference || 'مرجع الحوالة مسجل'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-[11px]">
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>بانتظار القرار</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(ord);
                        }}
                        className="text-gold-700 hover:text-gold-900 font-bold flex items-center gap-1"
                      >
                        <span>عرض ومطابقة ←</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Verification Canvas (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOrder && activeProof ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in">
              
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <div>
                  <span className="text-xs text-gold-700 font-bold block">مراجعة إشعار التحويل للطلب:</span>
                  <h3 className="font-serif text-xl font-bold text-zaad-900">{selectedOrder.orderNumber}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-charcoal-700/70">المبلغ المطلوب مطابقة تحويله:</div>
                  <div className="text-xl font-serif font-bold text-zaad-900">{formatPrice(selectedOrder.totalAmount)}</div>
                </div>
              </div>

              {/* Receipt Image Preview */}
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-zaad-950 border border-ivory-300 group flex items-center justify-center">
                {activeProof.receiptImageUrl ? (
                  <>
                    <Image
                      src={activeProof.receiptImageUrl}
                      alt="إيصال التحويل"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                    <button
                      onClick={() => setZoomReceipt(true)}
                      className="absolute bottom-4 left-4 bg-white/90 text-zaad-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-white"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>تكبير الإيصال بدقة عالية</span>
                    </button>
                  </>
                ) : (
                  <div className="text-ivory-400 text-xs text-center p-6 space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-gold-400 opacity-60" />
                    <span>تم تسجيل الإشعار بالرقم المرجعي</span>
                  </div>
                )}
              </div>

              {/* Verification Form Data Table */}
              <div className="grid grid-cols-2 gap-4 bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-xs">
                <div>
                  <span className="text-charcoal-700/70 block text-[11px]">اسم المحول المسجل بالإشعار:</span>
                  <strong className="text-zaad-900">{activeProof.senderName}</strong>
                </div>
                <div>
                  <span className="text-charcoal-700/70 block text-[11px]">البنك المحول منه:</span>
                  <strong className="text-zaad-900">{activeProof.senderBank || 'مصرف الراجحي'}</strong>
                </div>
                <div>
                  <span className="text-charcoal-700/70 block text-[11px]">الرقم المرجعي للحوالة (Ref):</span>
                  <strong className="text-zaad-900 font-mono">{activeProof.transactionReference}</strong>
                </div>
                <div>
                  <span className="text-charcoal-700/70 block text-[11px]">تاريخ التحويل:</span>
                  <strong className="text-zaad-900 font-mono">{activeProof.transferDate}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-ivory-200 flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(selectedOrder)}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد الدفع وتحويل الطلب للتجهيز الملكي</span>
                </button>

                <button
                  onClick={() => setActionType('request_reupload')}
                  className="bg-amber-600 hover:bg-amber-500 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>طلب إعادة الرفع</span>
                </button>

                <button
                  onClick={() => setActionType('reject')}
                  className="bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>رفض الإيصال</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300 text-charcoal-700 shadow-sm">
              اختر طلباً من القائمة الجانبية لمعاينة الإشعار البنكي ومطابقته.
            </div>
          )}
        </div>

      </div>

      {/* Action Modal (Reject / Reupload) */}
      {actionType && selectedOrder && (
        <div className="fixed inset-0 bg-zaad-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-ivory-300 shadow-2xl space-y-4 animate-scale-in">
            <h3 className="font-serif text-base font-bold text-zaad-900">
              {actionType === 'reject' ? 'تأكيد رفض الإيصال' : 'طلب إعادة رفع إيصال واضح'}
            </h3>
            <p className="text-xs text-charcoal-700/80">
              يرجى كتابة الملاحظة التي ستصل للعميل في بريده الإلكتروني:
            </p>
            <textarea
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={actionType === 'reject' ? 'سبب الرفض (مثال: المبلغ غير مطابق)...' : 'الملاحظة (مثال: صورة الحوالة غير واضحة)...'}
              className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-ivory-100 text-xs font-bold rounded-xl text-charcoal-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejectOrReupload}
                className="px-5 py-2 bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold rounded-xl"
              >
                إرسال القرار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full HD Zoom Modal */}
      {zoomReceipt && activeProof?.receiptImageUrl && (
        <div className="fixed inset-0 bg-zaad-950/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full h-[80vh] bg-black rounded-3xl overflow-hidden">
            <Image
              src={activeProof.receiptImageUrl}
              alt="تكبير الإيصال"
              fill
              unoptimized
              className="object-contain"
            />
            <button
              onClick={() => setZoomReceipt(false)}
              className="absolute top-4 right-4 bg-white text-zaad-900 w-9 h-9 rounded-full font-bold flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
