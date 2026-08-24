'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, Gift, Sparkles, ArrowLeft, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    freeShippingThreshold,
    total,
    isGiftBox,
    setIsGiftBox,
    giftMessage,
    setGiftMessage,
    applyCoupon,
    appliedCoupon
  } = useCart();

  const { formatPrice } = useCurrency();
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-ivory-300 shadow-sm max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-ivory-100 mx-auto flex items-center justify-center text-zaad-800">
            <ShoppingBag className="w-10 h-10 opacity-50 text-gold-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-zaad-900">حقيبة المقتنيات فارغة</h1>
            <p className="text-xs sm:text-sm text-charcoal-700/70 font-light">
              لم تقم بإضافة أي من محاصيل زاد النادرة إلى حقيبتك بعد.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-block w-full bg-zaad-800 hover:bg-zaad-700 text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl shadow-md hover:shadow-gold-glow transition-all gold-shimmer-btn"
          >
            استكشاف المحصول الملكي
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-3.5 py-1 rounded-full text-gold-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مراجعة المقتنيات وتجهيز الإهداء</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zaad-900">
            حقيبة المقتنيات الملكية
          </h1>
        </div>

        {/* Free Shipping Notification Strip */}
        <div className="bg-white rounded-2xl p-4 border border-gold-300/60 shadow-sm mb-8 max-w-4xl mx-auto">
          <div className="flex justify-between text-xs text-zaad-900 font-medium mb-1.5">
            {freeShippingLeft > 0 ? (
              <span>تبقى <strong className="text-gold-700 font-bold">{formatPrice(freeShippingLeft)}</strong> للحصول على الشحن المبرد المجاني</span>
            ) : (
              <span className="text-green-800 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-700" />
                طلبكم مؤهل للشحن الملكي المبرد المجاني
              </span>
            )}
            <span className="font-mono text-gold-700 font-bold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Items List & Packaging (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Items Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-zaad-900 border-b border-ivory-200 pb-3">
                المقتنيات المحددة ({items.length})
              </h2>

              <div className="divide-y divide-ivory-200">
                {items.map((item) => (
                  <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-ivory-300 bg-ivory-100 shrink-0">
                        <Image src={item.productImage || '/images/zaad-logo.png'} alt={item.productNameAr} fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-bold text-zaad-900">{item.productNameAr}</h3>
                        <p className="text-xs text-gold-700 font-bold mt-0.5">{formatPrice(item.price)}</p>
                        <p className="text-[11px] text-charcoal-700/60 mt-0.5 font-mono">الوزن الصافي: {item.weightGrams} جرام</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-ivory-300 rounded-lg bg-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 text-zaad-800 hover:text-gold-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-zaad-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 text-zaad-800 hover:text-gold-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-zaad-900 font-mono">
                        {formatPrice(item.total)}
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-700/60 hover:text-red-700 p-2 transition-colors"
                        title="حذف من الحقيبة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Complimentary Luxury Gift Box Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-400/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zaad-900">تغليف الإهداء الملكي الفاخر</h3>
                    <p className="text-xs text-gold-700 font-medium">يشمل صندوقاً خشبياً مع ملعقة خشب زيتون معتق وبطاقة إهداء مذهبة</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftBox}
                    onChange={(e) => setIsGiftBox(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zaad-800"></div>
                </label>
              </div>

              {isGiftBox && (
                <div className="pt-3 border-t border-ivory-200 space-y-2 animate-fade-in">
                  <label className="block text-xs font-semibold text-zaad-900">
                    نص الإهداء المطبوع بخط عربي فاخر على البطاقة:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="اكتب هنا العبارة التي ترغب بإرفاقها مع الصندوق الملكي..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none leading-relaxed"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Checkout Action (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-zaad-900 border-b border-ivory-200 pb-3">
                ملخص الحساب
              </h2>

              <div className="space-y-3 text-xs text-charcoal-800">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold font-mono">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>خصم النخبة:</span>
                    <span className="font-mono">- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>الشحن المبرد المخصص:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-gold-600 font-bold">مجاني</span>
                    ) : (
                      <span className="font-mono">{formatPrice(shippingFee)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>التغليف الملكي والملعقة:</span>
                  <span className="text-gold-600 font-bold">مقدم مجاناً</span>
                </div>

                <div className="flex justify-between text-base font-bold text-zaad-900 pt-4 border-t border-ivory-300">
                  <span>الإجمالي المستحق:</span>
                  <span className="text-gold-700 text-lg font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <label className="block text-[11px] font-semibold text-charcoal-700 mb-1.5">
                  هل لديك رمز خصم خاص؟
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: ROYAL10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-lg px-3 py-2 uppercase tracking-wider focus:border-gold-500 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="text-xs bg-zaad-800 hover:bg-zaad-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shrink-0"
                  >
                    تطبيق
                  </button>
                </div>
                {couponFeedback && (
                  <p className={`text-[11px] mt-1.5 font-medium ${couponFeedback.success ? 'text-green-700' : 'text-red-600'}`}>
                    {couponFeedback.message}
                  </p>
                )}
                {appliedCoupon && (
                  <p className="text-[11px] mt-1 text-green-700 font-medium">
                    الرمز النشط: {appliedCoupon}
                  </p>
                )}
              </form>

              {/* Proceed to Checkout Button */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full bg-zaad-800 hover:bg-zaad-700 text-white py-4 rounded-xl text-sm font-bold shadow-lg hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 gold-shimmer-btn"
                >
                  <span>متابعة إتمام الطلب الملكي</span>
                  <ArrowLeft className="w-4 h-4 text-gold-300" />
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/shop"
                  className="text-xs text-zaad-800 hover:text-gold-600 font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>العودة لإضافة مقتنيات أخرى</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
