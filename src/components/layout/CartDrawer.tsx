'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Gift, Sparkles, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getCmsSettings, DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { CartDrawerConfig } from '@/types/cms';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    freeShippingThreshold: defaultThreshold,
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
  const [cmsConfig, setCmsConfig] = useState<CartDrawerConfig>(DEFAULT_CMS_SETTINGS.cartDrawer);

  useEffect(() => {
    let isMounted = true;
    async function loadCms() {
      try {
        const doc = await getCmsSettings();
        if (isMounted && doc.cartDrawer) {
          setCmsConfig(doc.cartDrawer);
        }
      } catch (err) {
        console.error('Error loading cart drawer CMS settings:', err);
      }
    }
    if (isDrawerOpen) {
      loadCms();
    }
    return () => { isMounted = false; };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const threshold = cmsConfig.freeShippingThreshold || defaultThreshold || 600;
  const freeShippingLeft = Math.max(0, threshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / threshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
  };

  // Helper to format remaining text: replaces {amount} with formatted currency
  const formatRemainingText = (template: string, amount: number) => {
    const formatted = formatPrice(amount);
    if (template.includes('{amount}')) {
      return template.replace('{amount}', formatted);
    }
    return `${template} ${formatted}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pr-0 md:pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-ivory-300 animate-fade-in">
          
          {/* 1. Drawer Header */}
          <div className="px-6 py-5 bg-zaad-900 text-ivory-100 flex items-center justify-between border-b border-zaad-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <div>
                <h2 className="text-base font-bold tracking-wide">
                  {cmsConfig.drawerTitleAr || 'حقيبة المنتجات الطبيعية'}
                </h2>
                {cmsConfig.headerBadgeAr && (
                  <span className="text-[10px] text-gold-400 font-medium block">
                    {cmsConfig.headerBadgeAr}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="إغلاق الحقيبة"
              className="p-1.5 rounded-full hover:bg-zaad-800 text-ivory-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Shipping Progress Indicator */}
          {cmsConfig.showFreeShippingBar && (
            <div className="bg-gold-50/70 border-b border-gold-200/60 px-6 py-3">
              <div className="flex justify-between text-xs text-zaad-900 font-medium mb-1.5">
                {freeShippingLeft > 0 ? (
                  <span>
                    {formatRemainingText(cmsConfig.freeShippingRemainingTextAr || 'تبقى {amount} للحصول على الشحن المجاني', freeShippingLeft)}
                  </span>
                ) : (
                  <span className="text-green-800 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                    {cmsConfig.freeShippingEligibleTextAr || 'مؤهل للشحن المجاني!'}
                  </span>
                )}
                <span className="font-mono text-gold-700 font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gold-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              /* Empty State */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-ivory-200 mx-auto flex items-center justify-center text-zaad-700">
                  <Gift className="w-8 h-8 opacity-60 text-gold-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zaad-900">
                    {cmsConfig.emptyStateTitleAr || 'حقيبتك فارغة حالياً'}
                  </h3>
                  <p className="text-xs text-charcoal-700/70 max-w-xs mx-auto font-light leading-relaxed">
                    {cmsConfig.emptyStateDescAr || 'استكشف منتجات زاد الطبيعية من أندر الأعسال والمنتجات النقية.'}
                  </p>
                </div>
                <Link
                  href={cmsConfig.emptyStateButtonLink || '/shop'}
                  onClick={closeDrawer}
                  className="inline-block bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  {cmsConfig.emptyStateButtonTextAr || 'استكشاف المنتجات الطبيعية'}
                </Link>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3 divide-y divide-ivory-200">
                  {items.map((item) => (
                    <div key={item.productId} className="pt-3 first:pt-0 flex gap-3.5 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-ivory-300 shrink-0 bg-ivory-100">
                        <Image
                          src={item.productImage || '/images/zaad-logo.png'}
                          alt={item.productNameAr}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-zaad-900 truncate">
                          {item.productNameAr}
                        </h4>
                        <div className="text-xs text-gold-700 font-bold mt-0.5 font-mono">
                          {formatPrice(item.price)}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-ivory-300 rounded-lg bg-ivory-50">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 hover:text-zaad-800 text-charcoal-700 transition-colors"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-zaad-900 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 hover:text-zaad-800 text-charcoal-700 transition-colors"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-700/60 hover:text-red-700 p-1 transition-colors mr-auto"
                            title="حذف الصنف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Luxury Gift Packaging Section */}
                {cmsConfig.showGiftPackaging && (
                  <div className="bg-ivory-100 p-3.5 rounded-xl border border-gold-300/50 space-y-2.5 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-gold-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-zaad-900 block">
                            {cmsConfig.giftPackagingTitleAr || 'تغليف الإهداء الطبيعي الفاخر'}
                          </span>
                          <span className="text-[10px] text-gold-700 font-medium block">
                            {cmsConfig.giftPackagingSubtitleAr || 'مقدم مع ملعقة خشب زيتون طبيعية مجاناً'}
                          </span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isGiftBox}
                          onChange={(e) => setIsGiftBox(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zaad-800"></div>
                      </label>
                    </div>

                    {isGiftBox && (
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder={cmsConfig.giftMessagePlaceholderAr || 'اكتب رسالة إهداء خاصة ترفق مع الطلب...'}
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          className="w-full text-xs bg-white border border-ivory-300 rounded-lg px-2.5 py-1.5 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Coupon Section */}
                {cmsConfig.showCouponSection && (
                  <form onSubmit={handleApplyCoupon} className="pt-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder={cmsConfig.couponPlaceholderAr || 'رمز الخصم (جرب: ZAAD10)'}
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 uppercase tracking-wider focus:border-gold-500 focus:outline-none font-mono"
                        />
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                      </div>
                      <button
                        type="submit"
                        className="text-xs bg-zaad-800 hover:bg-zaad-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shrink-0"
                      >
                        {cmsConfig.couponButtonTextAr || 'تطبيق'}
                      </button>
                    </div>
                    {couponFeedback && (
                      <p className={`text-[11px] mt-1.5 font-medium ${couponFeedback.success ? 'text-green-700' : 'text-red-600'}`}>
                        {couponFeedback.message}
                      </p>
                    )}
                    {appliedCoupon && !couponFeedback && (
                      <p className="text-[11px] mt-1 text-green-700 font-medium">
                        {cmsConfig.couponActiveLabelAr || 'الرمز النشط:'} {appliedCoupon}
                      </p>
                    )}
                  </form>
                )}
              </>
            )}
          </div>

          {/* 6. Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 bg-ivory-50 border-t border-ivory-300 space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal-800">
                <div className="flex justify-between">
                  <span>{cmsConfig.subtotalLabelAr || 'إجمالي المنتجات:'}</span>
                  <span className="font-bold font-mono">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>{cmsConfig.discountLabelAr || 'الخصم المطبق:'}</span>
                    <span className="font-mono">- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{cmsConfig.shippingLabelAr || 'الشحن والتوصيل:'}</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-gold-700 font-bold">{cmsConfig.freeShippingLabelAr || 'مجاني'}</span>
                    ) : (
                      <span className="font-mono">{formatPrice(shippingFee)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-zaad-900 pt-2 border-t border-ivory-300">
                  <div>
                    <span>{cmsConfig.totalLabelAr || 'الإجمالي النهائي:'}</span>
                    {cmsConfig.vatNoteAr && (
                      <span className="block text-[10px] text-charcoal-600 font-normal mt-0.5">
                        {cmsConfig.vatNoteAr}
                      </span>
                    )}
                  </div>
                  <span className="text-gold-700 text-base font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full bg-zaad-800 hover:bg-zaad-700 text-white text-center py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 gold-shimmer-btn"
                >
                  <span>{cmsConfig.checkoutButtonTextAr || 'متابعة إتمام الطلب'}</span>
                  <ArrowLeft className="w-4 h-4 text-gold-300" />
                </Link>

                {cmsConfig.showViewCartLink && (
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="w-full block text-center text-xs text-zaad-900 hover:text-gold-700 py-1 font-semibold transition-colors"
                  >
                    {cmsConfig.viewCartLinkTextAr || 'معاينة وتخصيص تفاصيل الحقيبة'}
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
