'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  FileImage,
  CreditCard,
  Building2,
  Smartphone,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lock,
  Gift,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Order, PaymentMethod, ShippingAddress, PaymentProof } from '@/types';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, total, isGiftBox, giftMessage, clearCart } = useCart();
  const { formatPrice, currentCurrency } = useCurrency();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form States
  // Step 1: Customer info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Shipping info
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [city, setCity] = useState('الرياض');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [buildingOrVilla, setBuildingOrVilla] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');

  // Step 4: Payment Receipt Proof Upload
  const [receiptImage, setReceiptImage] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80');
  const [senderName, setSenderName] = useState('');
  const [senderBank, setSenderBank] = useState('مصرف الراجحي');
  const [transactionRef, setTransactionRef] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto redirect if cart empty
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[60vh] bg-ivory-100 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-ivory-300">
          <h2 className="font-serif text-xl font-bold text-zaad-900">حقيبة المقتنيات فارغة</h2>
          <p className="text-xs text-charcoal-700/70">يرجى إضافة منتجات قبل التوجه لإتمام الطلب.</p>
          <Link href="/shop" className="inline-block bg-zaad-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl">
            استكشاف المنتجات الطبيعية
          </Link>
        </div>
      </div>
    );
  }

  // Handle Mock Image Upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setReceiptImage(uploadEvent.target?.result as string);
      setIsUploading(false);
      setUploadSuccess(true);
    };
    reader.readAsDataURL(file);
  };

  // Final Order Submission
  const handleCompleteOrder = async () => {
    if (!fullName || !phone || !email || !city || !street) {
      setErrorMsg('يرجى استكمال جميع بيانات التواصل والعنوان.');
      return;
    }

    if (!transactionRef && (paymentMethod === 'bank_transfer' || paymentMethod === 'instapay' || paymentMethod === 'vodafone_cash')) {
      setErrorMsg('يرجى إدخال رقم الحوالة / العملية المرجعي من الإيصال.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ZD-${randomNum}`;

    const shippingAddress: ShippingAddress = {
      fullName,
      phone,
      email,
      country,
      city,
      district,
      street,
      buildingOrVilla,
      deliveryNotes
    };

    const paymentProof: PaymentProof = {
      id: `prf-${Date.now()}`,
      orderId: orderNumber,
      receiptImageUrl: receiptImage,
      senderName: senderName || fullName,
      senderBank,
      transactionReference: transactionRef || `REF-${Date.now()}`,
      transferDate: new Date().toISOString().split('T')[0],
      amountTransferred: total,
      status: 'proof_submitted',
      createdAt: new Date().toISOString()
    };

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: 'usr-guest',
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: [...items],
      subtotal,
      discountAmount: discount,
      shippingFee,
      luxuryGiftBoxIncluded: isGiftBox,
      luxuryGiftMessage: giftMessage,
      totalAmount: total,
      currency: 'EGP',
      status: 'awaiting_verification',
      paymentMethod,
      paymentStatus: 'proof_submitted',
      paymentProof,
      statusTimeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          noteAr: 'تم إنشاء الطلب واختيار الدفع عبر التحويل البنكي'
        },
        {
          status: 'awaiting_verification',
          timestamp: new Date().toISOString(),
          noteAr: 'تم رفع إيصال التحويل بنجاح وبانتظار اعتماد العمليات المالية'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save order into Supabase database via API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (err) {
      console.error('Error persisting order to Supabase:', err);
    }

    // Fire celebratory luxury gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C59B27', '#163E23', '#DFBE60']
      });
    } catch (e) {
      console.error(e);
    }

    clearCart();
    router.push(`/order-confirmation/${orderNumber}`);
  };

  const stepsLabels = [
    { num: 1, label: 'بيانات المقتني' },
    { num: 2, label: 'العنوان الملكي' },
    { num: 3, label: 'طريقة السداد' },
    { num: 4, label: 'إيصال التحويل' },
    { num: 5, label: 'التأكيد والاعتماد' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-4 py-1 rounded-full text-gold-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بوابة الإتمام الملكي للطلبات</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-zaad-900">
            إتمام اقتناء مقتنيات زاد
          </h1>
        </div>

        {/* 5-Step Stepper Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-ivory-300 shadow-sm mb-8">
          <div className="flex items-center justify-between overflow-x-auto">
            {stepsLabels.map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center shrink-0 min-w-[70px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s.num === currentStep
                        ? 'bg-gold-500 text-zaad-950 ring-4 ring-gold-200'
                        : s.num < currentStep
                        ? 'bg-zaad-800 text-white'
                        : 'bg-ivory-200 text-charcoal-700'
                    }`}
                  >
                    {s.num < currentStep ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[11px] mt-1.5 font-medium ${s.num === currentStep ? 'text-zaad-900 font-bold' : 'text-charcoal-700/60'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < stepsLabels.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${s.num < currentStep ? 'bg-zaad-800' : 'bg-ivory-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Step Content (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Customer Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-base font-bold text-zaad-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <span>الخطوة 1: بيانات المقتني والتواصل</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zaad-900 mb-1">الاسم الكريم بالكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: صاحب السمو فيصل آل سعود / د. مريم النعيمي"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">البريد الإلكتروني المعتمد *</label>
                      <input
                        type="email"
                        required
                        placeholder="لتلقي إشعارات الطلب والدفع"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">رقم الهاتف الجوال (مع مفتاح الدولة) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+966 50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName || !email || !phone) {
                        setErrorMsg('يرجى تعبئة كافة حقول البيانات الشخصية.');
                        return;
                      }
                      setErrorMsg('');
                      setCurrentStep(2);
                    }}
                    className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>متابعة لعنوان التوصيل</span>
                    <ArrowLeft className="w-4 h-4 text-gold-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Details */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-base font-bold text-zaad-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <span>الخطوة 2: وجهة الشحن والتوصيل</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">الدولة *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-3 focus:border-gold-500 focus:outline-none text-zaad-900 font-semibold"
                      >
                        <option value="المملكة العربية السعودية">المملكة العربية السعودية 🇸🇦</option>
                        <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة 🇦🇪</option>
                        <option value="مصر">جمهورية مصر العربية 🇪🇬</option>
                        <option value="الكويت">دولة الكويت 🇰🇼</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">المدينة *</label>
                      <input
                        type="text"
                        required
                        placeholder="الرياض / دبي / القاهرة..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">الحي / المنطقة *</label>
                      <input
                        type="text"
                        placeholder="حي حطين / جميرا 1 / التجمع الخامس"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">الشارع / المعلم الرئيسي *</label>
                      <input
                        type="text"
                        placeholder="اسم الشارع أو المجمع السكني"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zaad-900 mb-1">رقم المبنى / الفيلا / القصر</label>
                    <input
                      type="text"
                      placeholder="قصر رقم 12 / فيلا 44"
                      value={buildingOrVilla}
                      onChange={(e) => setBuildingOrVilla(e.target.value)}
                      className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zaad-900 mb-1">ملاحظات خاصة بالمندوب والتوصيل</label>
                    <input
                      type="text"
                      placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة والتسليم للاستقبال"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-charcoal-700 hover:text-zaad-900 flex items-center gap-1 font-semibold"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>الرجوع</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!city || !street) {
                        setErrorMsg('يرجى تحديد المدينة والشارع لإتمام الشحن.');
                        return;
                      }
                      setErrorMsg('');
                      setCurrentStep(3);
                    }}
                    className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>متابعة لطريقة السداد</span>
                    <ArrowLeft className="w-4 h-4 text-gold-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method Selection */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-base font-bold text-zaad-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <span>الخطوة 3: اختيار وسيلة الدفع المعتمدة</span>
                </h2>

                <div className="space-y-3">
                  
                  {/* Bank Transfer (Direct Official Account) */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-gold-500 bg-gold-50/40 ring-2 ring-gold-300/40'
                        : 'border-ivory-300 hover:border-gold-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zaad-900 text-gold-400 flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zaad-900 block">تحويل بنكي رسمي مباشر (مصرف الراجحي / بنك الرياض)</span>
                          <span className="text-[11px] text-charcoal-700/70">مطابقة فورية ورفع إيصال التحويل لاعتماده في الغرفة المعقمة</span>
                        </div>
                      </div>
                      <span className="text-xs bg-zaad-800 text-gold-300 px-2 py-0.5 rounded-full font-bold">الأكثر استخداماً</span>
                    </div>
                  </label>

                  {/* InstaPay */}
                  <label
                    onClick={() => setPaymentMethod('instapay')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'instapay'
                        ? 'border-gold-500 bg-gold-50/40 ring-2 ring-gold-300/40'
                        : 'border-ivory-300 hover:border-gold-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zaad-900 block">تحويل إنستاباي الفوري (InstaPay)</span>
                          <span className="text-[11px] text-charcoal-700/70">تحويل لحظي مباشر عبر حساب إنستاباي المعتمد</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Vodafone Cash */}
                  <label
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'vodafone_cash'
                        ? 'border-gold-500 bg-gold-50/40 ring-2 ring-gold-300/40'
                        : 'border-ivory-300 hover:border-gold-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-800 text-white flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zaad-900 block">محفظة فودافون كاش الرسمية (Vodafone Cash)</span>
                          <span className="text-[11px] text-charcoal-700/70">تحويل سريع عبر المحفظة الإلكترونية لعملاء مصر</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Mada / Apple Pay Mockup */}
                  <label
                    onClick={() => setPaymentMethod('mada_card')}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'mada_card'
                        ? 'border-gold-500 bg-gold-50/40 ring-2 ring-gold-300/40'
                        : 'border-ivory-300 hover:border-gold-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zaad-800 text-white flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zaad-900 block">بطاقات مدى / فيزا / ماستركارد / Apple Pay</span>
                          <span className="text-[11px] text-charcoal-700/70">دفع إلكتروني فوري ومطابقة آلية مشفرة 256-bit</span>
                        </div>
                      </div>
                    </div>
                  </label>

                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-charcoal-700 hover:text-zaad-900 flex items-center gap-1 font-semibold"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>الرجوع</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>متابعة لرفع الإيصال والتفاصيل</span>
                    <ArrowLeft className="w-4 h-4 text-gold-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Receipt Proof Upload (Critical Requirement) */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-base font-bold text-zaad-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <span>الخطوة 4: تفاصيل الحوالة ورفع إيصال الدفع</span>
                </h2>

                {/* Bank Account Transfer Details Card */}
                <div className="bg-zaad-950 text-ivory-100 p-5 rounded-2xl border border-gold-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gold-400 font-bold">
                    <span>بيانات الحساب البنكي الرسمي المعتمد:</span>
                    <span>مؤسسة دار زاد للنقاء المحدودة</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zaad-900/90 p-3.5 rounded-xl border border-zaad-800">
                    <div>
                      <span className="text-ivory-400 block text-[11px]">اسم البنك:</span>
                      <strong className="text-ivory-100">مصرف الراجحي (Al Rajhi Bank)</strong>
                    </div>
                    <div>
                      <span className="text-ivory-400 block text-[11px]">رقم الآيبان (IBAN):</span>
                      <strong className="font-mono text-gold-400 text-xs">SA44 8000 0456 6080 1012 3456</strong>
                    </div>
                    <div>
                      <span className="text-ivory-400 block text-[11px]">حساب إنستاباي:</span>
                      <strong className="text-gold-400 font-mono">zaad.luxury@instapay</strong>
                    </div>
                    <div>
                      <span className="text-ivory-400 block text-[11px]">المبلغ المطلوب تحويله:</span>
                      <strong className="text-gold-300 font-bold font-mono text-sm">{formatPrice(total)}</strong>
                    </div>
                  </div>
                </div>

                {/* Proof Upload Component */}
                <div className="space-y-4 pt-2">
                  
                  <div>
                    <label className="block text-xs font-semibold text-zaad-900 mb-1.5">
                      إرفاق صورة أو لقطة شاشة لإيصال التحويل *
                    </label>

                    <div className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-ivory-50 rounded-2xl p-6 text-center cursor-pointer relative transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />

                      {receiptImage ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gold-400 shadow-sm shrink-0">
                            <Image src={receiptImage} alt="إيصال التحويل" fill className="object-cover" />
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-xs font-bold text-zaad-900 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-green-700" />
                              <span>تم إرفاق إيصال التحويل بنجاح</span>
                            </div>
                            <p className="text-[11px] text-charcoal-700/70">انقر لتغيير الصورة إذا رغبت</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-gold-100 mx-auto flex items-center justify-center text-gold-600">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div className="text-xs font-bold text-zaad-900">انقر هنا أو اسحب صورة الإيصال للإرفاق</div>
                          <p className="text-[10px] text-charcoal-700/60">يدعم صيغ JPG, PNG, WEBP (حتى 10 ميجابايت)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transfer Reference inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">اسم صاحب الحساب المحول منه *</label>
                      <input
                        type="text"
                        placeholder="الاسم كما يظهر بالإيصال"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zaad-900 mb-1">رقم الحوالة / العملية المرجعي (Reference No) *</label>
                      <input
                        type="text"
                        placeholder="مثال: TXN-89410293"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-3 font-mono focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-charcoal-700 hover:text-zaad-900 flex items-center gap-1 font-semibold"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>الرجوع</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!transactionRef) {
                        setErrorMsg('يرجى كتابة رقم العملية المرجعي من إيصال التحويل.');
                        return;
                      }
                      setErrorMsg('');
                      setCurrentStep(5);
                    }}
                    className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>متابعة للمراجعة النهائية</span>
                    <ArrowLeft className="w-4 h-4 text-gold-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Final Review & Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-base font-bold text-zaad-900 border-b border-ivory-200 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <span>الخطوة 5: مراجعة واعتماد الطلب الملكي</span>
                </h2>

                <div className="space-y-4 text-xs">
                  
                  {/* Summary Grid */}
                  <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 space-y-3">
                    <div className="flex justify-between border-b border-ivory-200 pb-2">
                      <span className="text-charcoal-700/70">المقتني:</span>
                      <strong className="text-zaad-900">{fullName} ({phone})</strong>
                    </div>
                    <div className="flex justify-between border-b border-ivory-200 pb-2">
                      <span className="text-charcoal-700/70">عنوان الشحن:</span>
                      <strong className="text-zaad-900">{country} - {city} - {district} {street}</strong>
                    </div>
                    <div className="flex justify-between border-b border-ivory-200 pb-2">
                      <span className="text-charcoal-700/70">طريقة الدفع:</span>
                      <strong className="text-zaad-900">
                        {paymentMethod === 'bank_transfer' && 'تحويل بنكي رسمي'}
                        {paymentMethod === 'instapay' && 'إنستاباي فوري'}
                        {paymentMethod === 'vodafone_cash' && 'فودافون كاش'}
                        {paymentMethod === 'mada_card' && 'بطاقة مدى / ائتمان'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-700/70">الرقم المرجعي للإيصال:</span>
                      <strong className="text-gold-700 font-mono">{transactionRef || 'تم الإرفاق'}</strong>
                    </div>
                  </div>

                  {/* Trust Notice */}
                  <div className="bg-gold-50 p-4 rounded-xl border border-gold-300 text-zaad-900 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold">بروتوكول التحقق الفوري لدار زاد:</h4>
                      <p className="text-[11px] text-charcoal-700 mt-0.5 leading-relaxed">
                        بمجرد الضغط على تأكيد الطلب، ستتغير حالة طلبكم إلى <strong>&ldquo;قيد المراجعة المالية&rdquo;</strong> وسيصل إشعار فوري لفريق العمليات لمطابقة الإيصال وتجهيز المنتجات الطبيعية للشحن.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-xs text-charcoal-700 hover:text-zaad-900 flex items-center gap-1 font-semibold"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>تعديل الإيصال</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    disabled={isSubmitting}
                    className="bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs sm:text-sm font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-gold-glow-lg transition-all flex items-center gap-2 gold-shimmer-btn"
                  >
                    {isSubmitting ? (
                      <span>جاري تسجيل الطلب وإرسال الإشعار...</span>
                    ) : (
                      <>
                        <span>تأكيد الطلب وإرسال الإيصال للمطابقة</span>
                        <ArrowLeft className="w-4 h-4 text-zaad-950" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Cart Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zaad-900 border-b border-ivory-200 pb-2">
                ملخص المقتنيات ({items.length})
              </h3>

              <div className="divide-y divide-ivory-200 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-ivory-300 bg-ivory-100 shrink-0">
                        <Image src={item.productImage || '/images/zaad-logo.png'} alt={item.productNameAr} fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-zaad-900 truncate max-w-[130px]">{item.productNameAr}</div>
                        <div className="text-[10px] text-charcoal-700/60">الكمية: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="font-bold text-zaad-900 font-mono">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-ivory-200 text-xs text-charcoal-800">
                <div className="flex justify-between">
                  <span>المجموع:</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>الخصم:</span>
                    <span className="font-mono">- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الشحن والتوصيل:</span>
                  <span>{shippingFee === 0 ? <span className="text-gold-600 font-bold">مجاني</span> : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-zaad-900 text-sm pt-2 border-t border-ivory-200">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-gold-700 text-base font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {isGiftBox && (
                <div className="bg-gold-50/70 p-2.5 rounded-xl border border-gold-300/50 text-[11px] text-gold-900 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>تغليف الإهداء الخشبي والملعقة الملكية مرفقة مجاناً</span>
                </div>
              )}
            </div>

            {/* Security Guarantee Badge */}
            <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 flex items-center gap-3 text-xs text-charcoal-700">
              <Lock className="w-5 h-5 text-gold-600 shrink-0" />
              <div>
                <strong className="block text-zaad-900">سداد آمن 100%</strong>
                <span className="text-[10px]">تشفير معتمد وتأكيد يدوي لسلامة المعاملات المالية</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
