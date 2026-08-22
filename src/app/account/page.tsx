'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Award,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  Edit2
} from 'lucide-react';
import { getLiveProducts } from '@/lib/services/productService';
import { Product, Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function CustomerAccountPage() {
  const { formatPrice } = useCurrency();
  const { wishlistIds } = useWishlist();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'certificates'>('orders');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const prods = await getLiveProducts();
        if (isMounted) setAllProducts(prods);

        const res = await fetch('/api/orders', { cache: 'no-store' });
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setOrders(json.data);
        }
      } catch (e) {
        console.error('Error loading account data:', e);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'القصر الخاص - الرياض',
      fullName: 'صاحب السمو فيصل بن عبدالعزيز آل سعود',
      phone: '+966 50 123 4567',
      country: 'المملكة العربية السعودية',
      city: 'الرياض',
      district: 'حي حطين النموذجي',
      street: 'شارع الأمير تركي الأول',
      buildingOrVilla: 'قصر رقم 14',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'المكتب التنفيذي - دبي',
      fullName: 'صاحب السمو فيصل آل سعود',
      phone: '+971 50 123 9988',
      country: 'الإمارات العربية المتحدة',
      city: 'دبي',
      district: 'مركز دبي المالي العالمي (DIFC)',
      street: 'برج الغيث - الطابق 32',
      buildingOrVilla: 'المكتب 3201',
      isDefault: false
    }
  ]);

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* VIP Profile Header Banner */}
        <div className="bg-zaad-950 text-ivory-100 rounded-3xl p-6 sm:p-10 border-2 border-gold-500/40 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-center gap-5 text-center md:text-right">
              <div className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center text-gold-400 font-serif text-3xl font-bold shrink-0">
                ف
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-bold bg-zaad-900 px-3 py-0.5 rounded-full border border-gold-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عضوية الدائرة الملكية الخاصة (Black Diamond)</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50">
                  صاحب السمو فيصل بن عبدالعزيز آل سعود
                </h1>
                <p className="text-xs text-ivory-300 font-mono">faisal.a@luxury-sa.com • +966 50 123 4567</p>
              </div>
            </div>

            {/* Loyalty Stats */}
            <div className="flex items-center gap-4 bg-zaad-900/80 p-4 rounded-2xl border border-gold-500/30 text-center">
              <div className="px-3 border-l border-zaad-800">
                <div className="text-xs text-ivory-400">نقاط النقاء</div>
                <div className="text-xl font-bold text-gold-400 font-mono">2,870</div>
              </div>
              <div className="px-3">
                <div className="text-xs text-ivory-400">الطلبات المقتناة</div>
                <div className="text-xl font-bold text-ivory-100 font-mono">{orders.length}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-ivory-300">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-zaad-800 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-ivory-200 border border-ivory-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سجل الطلبات وتتبع الإيصالات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-zaad-800 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-ivory-200 border border-ivory-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>المحفوظات الملكية ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-zaad-800 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-ivory-200 border border-ivory-300'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>العناوين المحفوظة</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-zaad-800 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-ivory-200 border border-ivory-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>شهادات الفحص لمقتنياتي</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-ivory-300 text-charcoal-700">
                لا توجد طلبات سابقة مسجلة.
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-2">
                    <div>
                      <div className="text-xs text-charcoal-700/70">رقم الطلب الملكي:</div>
                      <span className="font-mono text-base font-bold text-zaad-900">{ord.orderNumber}</span>
                      <span className="text-xs text-charcoal-700/70 block sm:inline sm:mr-3">بتاريخ {ord.createdAt.split('T')[0]}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        ord.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        ord.paymentStatus === 'proof_submitted' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ord.paymentStatus === 'approved' ? 'تم اعتماد الدفع' :
                         ord.paymentStatus === 'proof_submitted' ? 'جاري مراجعة الإيصال البنكي' : 'بانتظار السداد'}
                      </span>

                      <Link
                        href={`/order-confirmation/${ord.id}`}
                        className="bg-ivory-100 hover:bg-zaad-800 hover:text-white text-zaad-900 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        تفاصيل الفاتورة
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-ivory-200 overflow-hidden relative shrink-0">
                            <Image src={it.productImage || '/images/zaad-logo.png'} alt={it.productNameAr} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-zaad-900">{it.productNameAr}</div>
                            <div className="text-charcoal-700/70">الكمية: {it.quantity} × {formatPrice(it.price)}</div>
                          </div>
                        </div>
                        <div className="font-bold text-zaad-900 font-serif text-sm">
                          {formatPrice(it.total)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-ivory-200 flex justify-between items-center text-xs">
                    <span className="text-charcoal-700/80">المجموع الإجمالي:</span>
                    <span className="text-base font-bold text-zaad-900 font-serif">{formatPrice(ord.totalAmount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="animate-fade-in">
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-ivory-300 space-y-3">
                <Heart className="w-10 h-10 text-charcoal-300 mx-auto" />
                <h3 className="text-sm font-bold text-zaad-900">قائمة محفوظاتك فارغة حالياً</h3>
                <p className="text-xs text-charcoal-700/70">تصفح المحصول الملكي واحفظ الأصناف المفضلة لاقتنائها لاحقاً.</p>
                <Link
                  href="/shop"
                  className="inline-block bg-zaad-800 text-white text-xs font-bold px-5 py-2.5 rounded-full"
                >
                  استكشاف المحصول
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-ivory-300 p-4 shadow-sm space-y-3">
                    <div className="relative h-48 rounded-xl bg-ivory-200 overflow-hidden">
                      <Image src={p.images[0] || '/images/zaad-logo.png'} alt={p.nameAr} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-zaad-900 line-clamp-1">{p.nameAr}</h4>
                      <p className="text-xs text-gold-700 font-bold mt-1">{formatPrice(p.price)}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => addItem(p, 1)}
                        className="flex-1 bg-zaad-800 text-white text-xs font-bold py-2 rounded-lg hover:bg-zaad-700 transition-colors"
                      >
                        اقتناء الآن
                      </button>
                      <Link
                        href={`/product/${p.slug}`}
                        className="bg-ivory-100 text-zaad-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-ivory-200"
                      >
                        معاينة
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-zaad-900">عناوين التسليم المبردة المعتمدة:</h3>
              <button className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة قصر / مقر تسليم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm relative space-y-2">
                  {addr.isDefault && (
                    <span className="absolute top-4 left-4 bg-gold-50 text-gold-800 border border-gold-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      العنوان الافتراضي
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-zaad-900">{addr.title}</h4>
                  <div className="text-xs text-charcoal-700/80 space-y-1">
                    <p>{addr.fullName}</p>
                    <p>{addr.street}، {addr.district}، {addr.city}</p>
                    <p>{addr.country}</p>
                    <p className="font-mono text-zaad-800">{addr.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Lab Certificates */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-zaad-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-600" />
              <span>أرشيف شهادات التحليل المخبري لمقتنياتك</span>
            </h3>
            <p className="text-xs text-charcoal-700/80 leading-relaxed">
              تحتفظ دار زاد بسجل رقمي دائم وموثق لكل تشغيلة قمت باقتنائها لضمان إمكانية التحقق في أي وقت.
            </p>

            <div className="divide-y divide-ivory-200 pt-4">
              {allProducts.slice(0, 3).map((prod) => (
                <div key={prod.id} className="py-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-zaad-900">{prod.nameAr}</h4>
                    <p className="text-[11px] text-charcoal-700/70 font-mono mt-0.5">
                      التشغيلة: {prod.latestLabBatch.batchNumber} • المختبر: {prod.latestLabBatch.labName}
                    </p>
                  </div>
                  <Link
                    href={`/purity-checker?batch=${prod.latestLabBatch.batchNumber}`}
                    className="bg-ivory-100 hover:bg-zaad-800 hover:text-white text-zaad-900 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold-600" />
                    <span>عرض الشهادة الرقمية</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
