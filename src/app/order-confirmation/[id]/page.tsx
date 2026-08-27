'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight,
  Printer,
  Sparkles,
  FileImage,
  MessageCircle,
  Truck,
  PackageCheck,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { Order } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { formatPrice } = useCurrency();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadOrder() {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderId)}&id=${encodeURIComponent(orderId)}`, { cache: 'no-store' });
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setOrder(Array.isArray(json.data) ? json.data[0] : json.data);
          }
          setLoading(false);
        }
      } catch (e) {
        console.error('Error fetching order from Supabase:', e);
        if (isMounted) setLoading(false);
      }
    }
    loadOrder();
    return () => { isMounted = false; };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-ivory-100 flex items-center justify-center py-12">
        <div className="text-center font-serif text-zaad-900 text-lg">جاري استرجاع تفاصيل الفاتورة من Supabase...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] bg-ivory-100 flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-3xl text-center space-y-4 max-w-md border border-ivory-300">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-zaad-900">لم يتم العثور على الطلب في قاعدة البيانات</h2>
          <p className="text-xs text-charcoal-700/70">تأكد من صحة رقم الطلب أو تواصل مع خدمة كبار الشخصيات.</p>
          <Link href="/" className="inline-block bg-zaad-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const isAwaiting = order.status === 'awaiting_verification' || order.paymentStatus === 'proof_submitted';
  const isPaid = order.status === 'paid' || order.paymentStatus === 'approved';

  const timelineSteps = [
    { key: 'placed', label: 'تم إنشاء الطلب', done: true, time: 'فوري' },
    { key: 'verification', label: 'مطابقة إيصال التحويل', done: isAwaiting || isPaid, current: isAwaiting, time: 'خلال دقائق' },
    { key: 'processing', label: 'التجهيز في الغرفة المعقمة', done: isPaid, time: 'بإشراف خبير الجودة' },
    { key: 'shipped', label: 'الشحن والتوصيل الفاخر', done: order.status === 'shipped' || order.status === 'delivered', time: 'سمسا إكسبريس' },
    { key: 'delivered', label: 'التسليم للمقتني', done: order.status === 'delivered', time: 'نقاءٌ يصافح ذوقكم' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Success & State Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-gold-500/30 shadow-luxury text-center space-y-6 animate-fade-in relative overflow-hidden">
          
          <div className="w-20 h-20 rounded-full bg-gold-50 mx-auto flex items-center justify-center border-2 border-gold-400 text-gold-600 shadow-gold-glow">
            {isPaid ? <CheckCircle2 className="w-10 h-10 text-green-700" /> : <Clock className="w-10 h-10 text-gold-600 animate-pulse" />}
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3.5 py-1 rounded-full border border-gold-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>طلب معتمد ومسجل في سجلات زاد الملكية الحية</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zaad-900">
              {isPaid ? 'تم تأكيد السداد وجاري التجهيز' : 'شكراً لاقتنائك.. جاري مطابقة التحويل البنكي'}
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-700/80 max-w-lg mx-auto font-light leading-relaxed">
              رقم الطلب المرجعي: <strong className="font-mono text-zaad-900 text-sm">{order.orderNumber}</strong>. 
              {isAwaiting && ' يقوم فريق العمليات المالية بمراجعة إشعار التحويل البنكي المرفق لجدولة الشحن فوراً.'}
            </p>
          </div>

          {/* Verification Badge Bar */}
          <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs">
            <div>
              <span className="text-charcoal-700/70 block text-[11px]">حالة السداد:</span>
              <strong className={`font-bold ${isPaid ? 'text-green-700' : 'text-amber-700'}`}>
                {isPaid ? 'مدفوع ومعتمد ✓' : 'جاري التحقق من الإيصال ⏳'}
              </strong>
            </div>

            <div className="h-6 w-px bg-ivory-300 hidden sm:block"></div>

            <div>
              <span className="text-charcoal-700/70 block text-[11px]">طريقة الدفع:</span>
              <strong className="text-zaad-900">
                {order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي مباشر' :
                 order.paymentMethod === 'instapay' ? 'إنستاباي (InstaPay)' : 'مدى / فيزا'}
              </strong>
            </div>

            <div className="h-6 w-px bg-ivory-300 hidden sm:block"></div>

            <div>
              <span className="text-charcoal-700/70 block text-[11px]">المبلغ الإجمالي:</span>
              <strong className="text-zaad-900 font-mono text-sm">{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>
        </div>

        {/* 5-Phase Timeline Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-bold text-zaad-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-600" />
            <span>المسار الزمني لتجهيز وشحن مقتنياتكم:</span>
          </h2>

          <div className="relative border-r-2 border-gold-300/40 pr-6 space-y-6 mr-3">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute -right-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                  step.done ? 'bg-green-600 border-green-200' : 'bg-white border-ivory-400'
                }`} />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-zaad-900">{step.label}</div>
                  <div className="text-[11px] text-charcoal-700/70">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-bold text-zaad-900 flex items-center justify-between">
            <span>تفاصيل المنتجات والفاتورة الملكية</span>
            <button
              onClick={() => window.print()}
              className="text-xs font-sans text-gold-700 hover:text-gold-900 flex items-center gap-1 font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة إشعار الاقتناء</span>
            </button>
          </h2>

          <div className="divide-y divide-ivory-200">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-4 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-ivory-100 overflow-hidden border border-ivory-200 shrink-0">
                    <Image src={it.productImage || '/images/zaad-logo.png'} alt={it.productNameAr} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-zaad-900">{it.productNameAr}</h3>
                    <div className="text-charcoal-700/70 mt-0.5 font-mono">
                      الكمية: {it.quantity} × {formatPrice(it.price)}
                    </div>
                  </div>
                </div>

                <div className="font-mono font-bold text-sm text-zaad-900">
                  {formatPrice(it.total)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-ivory-200 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-700/80">
              <span>المجموع الفرعي:</span>
              <span className="font-mono font-bold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-700/80">
              <span>الشحن والتوصيل:</span>
              <span className="text-green-700 font-bold">مجاني (VIP Complimentary)</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zaad-900 pt-2 border-t border-ivory-200">
              <span>الإجمالي النهائي:</span>
              <span className="font-serif font-bold text-base text-zaad-900">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3.5 rounded-full shadow-lg transition-all"
          >
            <span>استكشاف المزيد من منتجات زاد</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  );
}
