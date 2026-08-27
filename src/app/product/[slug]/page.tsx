'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Award,
  Sparkles,
  Check,
  Star,
  FileText,
  Truck,
  RotateCcw,
  ArrowRight,
  Share2,
  Lock
} from 'lucide-react';
import { getLiveProductBySlug, getLiveProducts } from '@/lib/services/productService';
import { supabase } from '@/lib/supabase/client';
import { Product, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'lab' | 'benefits' | 'reviews'>('story');
  const [copiedLink, setCopiedLink] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const [liveProd, allProds] = await Promise.all([
          getLiveProductBySlug(slug),
          getLiveProducts()
        ]);
        if (isMounted && liveProd) {
          setProduct(liveProd);
          setRelatedProducts(allProds.filter(p => p.slug !== slug).slice(0, 3));

          // Fetch reviews from Supabase
          const { data: revData } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', liveProd.id)
            .eq('status', 'approved');

          if (revData) {
            const mappedRevs: Review[] = revData.map((r: any) => ({
              id: String(r.id ?? ''),
              productId: String(r.product_id ?? liveProd.id),
              productNameAr: liveProd.nameAr,
              customerName: String(r.customer_name ?? 'مقتني موثق'),
              rating: Number(r.rating ?? 5),
              titleAr: String(r.title_ar ?? 'تجربة استثنائية'),
              commentAr: String(r.comment_ar ?? ''),
              isVerifiedPurchase: Boolean(r.is_verified_purchase),
              helpfulCount: Number(r.helpful_count ?? 0),
              createdAt: String(r.created_at ?? new Date().toISOString())
            }));
            setReviews(mappedRevs);
          }
        }
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('Error fetching live product detail:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadProduct();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 flex items-center justify-center">
        <div className="text-center font-serif text-zaad-900 text-lg">جاري تحميل بيانات المحصول الملكي...</div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const isWish = isInWishlist(product.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productNameAr: product.nameAr,
      customerName: reviewName,
      rating: reviewRating,
      titleAr: reviewTitle || 'تجربة استثنائية',
      commentAr: reviewComment,
      isVerifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await supabase.from('reviews').insert({
        product_id: product.id,
        customer_name: reviewName,
        rating: reviewRating,
        title_ar: reviewTitle || 'تجربة استثنائية',
        comment_ar: reviewComment,
        is_verified_purchase: true,
        status: 'approved'
      });
    } catch (err) {
      console.error('Error adding review to Supabase:', err);
    }

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-700/70 mb-8">
          <Link href="/" className="hover:text-zaad-900 transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-zaad-900 transition-colors">المحصول الملكي</Link>
          <span>/</span>
          <span className="text-zaad-900 font-bold">{product.nameAr}</span>
        </nav>

        {/* Product Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm mb-16">

          {/* Gallery Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main HD Image */}
            <div className="relative h-[420px] sm:h-[500px] rounded-2xl overflow-hidden bg-ivory-200 border border-ivory-300">
              <Image
                src={product.images[selectedImageIndex] || product.images[0] || '/images/zaad-logo.png'}
                alt={product.nameAr}
                fill
                unoptimized
                className="object-cover"
                priority
              />

              {/* Badges */}
              {product.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-zaad-900/90 backdrop-blur-md text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-gold-400/40">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Wishlist & Share Buttons */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="حفظ في المفضلة"
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isWish
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-white/90 text-charcoal-700 hover:text-red-600 border border-white'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-red-600' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  aria-label="مشاركة الرابط"
                  className="w-10 h-10 rounded-full bg-white/90 text-charcoal-700 hover:text-zaad-900 flex items-center justify-center backdrop-blur-md border border-white transition-all"
                  title="نسخ الرابط"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {copiedLink && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zaad-900 text-gold-300 text-xs px-4 py-2 rounded-full shadow-lg border border-gold-500/40 animate-fade-in">
                  تم نسخ الرابط بنجاح!
                </div>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImageIndex === idx
                      ? 'border-gold-500 ring-2 ring-gold-400/30'
                      : 'border-ivory-300 hover:border-gold-300 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <Image src={img} alt={`صورة ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

            <div className="space-y-4">
              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zaad-900 leading-tight">
                {product.nameAr}
              </h1>

              {/* English Subtitle & Rating */}
              <div className="flex items-center justify-between text-xs text-charcoal-700/70 pb-2">
                <span className="font-serif italic text-gold-800">{product.nameEn}</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <span className="font-bold text-zaad-900 text-sm">{product.rating}</span>
                  <span>({product.reviewCount} تقييم موثق)</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-serif">
                    {formatPrice(product.price)}
                  </div>
                  {product.compareAtPrice && (
                    <div className="text-xs text-gray-500 line-through mt-0.5">
                      السعر السابق: {formatPrice(product.compareAtPrice)}
                    </div>
                  )}
                </div>
                <div className="text-left text-xs text-charcoal-700/70">
                  <span className="text-zaad-700 font-semibold block">شامل ضريبة القيمة المضافة</span>
                  <span className="text-[11px] text-gold-700">شحن مبرد مجاني للطلبات الكبرى</span>
                </div>
              </div>

              {/* Tagline & Short Summary */}
              <p className="text-sm text-charcoal-800 leading-relaxed font-light">
                {product.taglineAr || product.shortDescAr}
              </p>

              {/* Sensory Profile Radar Matrix */}
              {product.sensoryProfile && (
                <div className="bg-white p-4 rounded-xl border border-gold-200/80 space-y-2.5">
                  <h3 className="text-xs font-bold text-zaad-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>البصمة الحسية ومؤشرات التذوق:</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-charcoal-700/70 block text-[11px]">درجة الحلاوة:</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (product.sensoryProfile?.sweetness || 4) ? 'bg-gold-500' : 'bg-ivory-300'}`} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-charcoal-700/70 block text-[11px]">العبير الزهري:</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (product.sensoryProfile?.floralAroma || 4) ? 'bg-gold-500' : 'bg-ivory-300'}`} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-charcoal-700/70 block text-[11px]">الكثافة واللزوجة:</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (product.sensoryProfile?.density || 4) ? 'bg-zaad-700' : 'bg-ivory-300'}`} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-charcoal-700/70 block text-[11px]">طبيعة التبلور:</span>
                      <span className="text-zaad-900 font-bold mt-0.5 block text-xs">
                        {product.sensoryProfile?.crystallization || 'نادر'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Purchase Action Bar */}
            <div className="space-y-4 pt-4 border-t border-ivory-200">

              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-ivory-300 rounded-xl bg-ivory-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-zaad-800 hover:text-gold-600 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-zaad-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-zaad-800 hover:text-gold-600 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addItem(product, quantity)}
                  className="flex-1 bg-zaad-800 hover:bg-zaad-700 text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 gold-shimmer-btn"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                  <span>اقتناء هذا المحصول ({formatPrice(product.price * quantity)})</span>
                </button>
              </div>

              {/* Quality & Cold Warehouse Status */}
              <div className="flex items-center justify-between text-xs text-charcoal-700/80 pt-1">
                <span className="text-gold-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>نقاء موثق مخبرياً وخام 100%</span>
                </span>
                <span className="text-green-700 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  متوفر بالمستودع المبرد
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Tabs Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm mb-16">

          {/* Tab Navigation */}
          <div className="flex items-center gap-4 border-b border-ivory-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('story')}
              className={`text-sm font-bold pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'story'
                ? 'border-gold-500 text-zaad-900'
                : 'border-transparent text-charcoal-700/70 hover:text-zaad-900'
                }`}
            >
              قصة المحصول والمصدر
            </button>

            {product.latestLabBatch && (
              <button
                onClick={() => setActiveTab('lab')}
                className={`text-sm font-bold pb-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'lab'
                  ? 'border-gold-500 text-zaad-900'
                  : 'border-transparent text-charcoal-700/70 hover:text-zaad-900'
                  }`}
              >
                <Award className="w-4 h-4 text-gold-500" />
                <span>نتائج الفحص المخبري المستقل</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('benefits')}
              className={`text-sm font-bold pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'benefits'
                ? 'border-gold-500 text-zaad-900'
                : 'border-transparent text-charcoal-700/70 hover:text-zaad-900'
                }`}
            >
              الفوائد الصحية وطرق الاستخدام
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 border-b-2 transition-all whitespace-nowrap ${activeTab === 'reviews'
                ? 'border-gold-500 text-zaad-900'
                : 'border-transparent text-charcoal-700/70 hover:text-zaad-900'
                }`}
            >
              آراء المقتنين ({reviews.length})
            </button>
          </div>

          {/* Tab Content 1: Story */}
          {activeTab === 'story' && (
            <div className="pt-8 space-y-6 max-w-4xl text-charcoal-800 leading-relaxed text-sm sm:text-base font-light animate-fade-in">
              <div className="whitespace-pre-line">
                {product.fullStoryAr || product.shortDescAr}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300">
                  <h4 className="text-xs font-bold text-zaad-900 mb-1">المصدر الزهري الحصري:</h4>
                  <p className="text-xs text-charcoal-700">{product.floralSourceAr}</p>
                </div>
                <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300">
                  <h4 className="text-xs font-bold text-zaad-900 mb-1">إرشادات الحفظ الملكي:</h4>
                  <p className="text-xs text-charcoal-700">{product.storageInstructionsAr || 'يحفظ في مكان بارد وجاف'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Lab Analysis */}
          {activeTab === 'lab' && product.latestLabBatch && (
            <div className="pt-8 space-y-6 animate-fade-in">
              <div className="bg-zaad-900 text-ivory-100 p-6 rounded-2xl border border-gold-500/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zaad-800">
                  <div>
                    <span className="text-xs text-gold-400 font-semibold block">المختبر المعتمد المصدر للشهادة:</span>
                    <h3 className="text-base font-bold text-ivory-50 mt-1">{product.latestLabBatch.labName}</h3>
                  </div>
                  <div className="text-right sm:text-left font-mono text-xs text-ivory-300">
                    <div>تاريخ الفحص: {product.latestLabBatch.testedDate}</div>
                    <div className="text-gold-400 font-bold">رقم التشغيلة: {product.latestLabBatch.batchNumber}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 text-center">
                  <div className="bg-zaad-950/60 p-4 rounded-xl border border-zaad-800">
                    <div className="text-2xl font-bold text-gold-400 font-mono">{product.latestLabBatch.moisturePercentage}%</div>
                    <div className="text-xs text-ivory-300 mt-1">نسبة الرطوبة</div>
                    <div className="text-[10px] text-green-400 mt-0.5">(المعيار القياسي &lt; 20%)</div>
                  </div>

                  <div className="bg-zaad-950/60 p-4 rounded-xl border border-zaad-800">
                    <div className="text-2xl font-bold text-gold-400 font-mono">{product.latestLabBatch.hmfLevel}</div>
                    <div className="text-xs text-ivory-300 mt-1">مستوى HMF (ملغ/كغ)</div>
                    <div className="text-[10px] text-green-400 mt-0.5">(طازج فائق &lt; 5)</div>
                  </div>

                  <div className="bg-zaad-950/60 p-4 rounded-xl border border-zaad-800">
                    <div className="text-2xl font-bold text-gold-400 font-mono">{product.latestLabBatch.diastaseActivity}</div>
                    <div className="text-xs text-ivory-300 mt-1">نشاط إنزيم الدياستيز</div>
                    <div className="text-[10px] text-green-400 mt-0.5">(إنزيمات حية نشطة &gt; 8)</div>
                  </div>

                  <div className="bg-zaad-950/60 p-4 rounded-xl border border-zaad-800">
                    <div className="text-2xl font-bold text-gold-400 font-mono">{product.latestLabBatch.sucrosePercentage}%</div>
                    <div className="text-xs text-ivory-300 mt-1">نسبة السكروز الحر</div>
                    <div className="text-[10px] text-green-400 mt-0.5">(خالٍ من التغذية &lt; 5%)</div>
                  </div>

                  <div className="bg-zaad-950/60 p-4 rounded-xl border border-zaad-800">
                    <div className="text-2xl font-bold text-gold-400 font-mono">{product.latestLabBatch.pollenPurityPercentage}%</div>
                    <div className="text-xs text-ivory-300 mt-1">نقاء طيف اللقاح</div>
                    <div className="text-[10px] text-green-400 mt-0.5">(أحادي الزهرة موثق)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Benefits & Pairings */}
          {activeTab === 'benefits' && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-zaad-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gold-600" />
                  <span>الخصائص الحيوية والعلاجية:</span>
                </h3>
                <ul className="space-y-3">
                  {product.healthBenefitsAr.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal-800 bg-ivory-50 p-3 rounded-lg border border-ivory-300">
                      <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-zaad-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                  <span>طقوس التذوق والتقديم المقترحة:</span>
                </h3>
                <ul className="space-y-3">
                  {product.pairingSuggestionsAr.map((pair, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal-800 bg-ivory-50 p-3 rounded-lg border border-ivory-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-1.5"></span>
                      <span>{pair}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab Content 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-8 space-y-8 animate-fade-in">

              {/* Existing Reviews List */}
              <div className="space-y-4 divide-y divide-ivory-200">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zaad-900">{rev.customerName}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 font-semibold">
                        مقتنٍ موثق
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-charcoal-900">{rev.titleAr}</h5>
                    <p className="text-xs text-charcoal-700/90 leading-relaxed font-light">{rev.commentAr}</p>
                  </div>
                ))}
              </div>

              {/* Review Submission Form */}
              <div className="bg-ivory-50 p-6 rounded-2xl border border-ivory-300 max-w-xl">
                <h4 className="text-sm font-bold text-zaad-900 mb-1">شاركنا انطباعك عن تجربة هذا المحصول</h4>
                <p className="text-xs text-charcoal-700/70 mb-4">تقييمك يسهم في إثراء سجل دار زاد للنقاء.</p>

                {reviewSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-xs font-semibold">
                    شكراً لمشاركتك الكريمة. تمت إضافة تقييمك بنجاح.
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zaad-900 mb-1">اسم المقتني:</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full text-xs bg-white border border-ivory-300 rounded px-3 py-2 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zaad-900 mb-1">التقييم:</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="text-xs bg-white border border-ivory-300 rounded px-3 py-2 focus:border-gold-500 focus:outline-none"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (استثنائي - 5 نجوم)</option>
                        <option value={4}>⭐⭐⭐⭐ (ممتاز - 4 نجوم)</option>
                        <option value={3}>⭐⭐⭐ (جيد - 3 نجوم)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zaad-900 mb-1">عنوان التقييم:</label>
                      <input
                        type="text"
                        placeholder="مثال: نقاء أصيل وقوام حريري"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full text-xs bg-white border border-ivory-300 rounded px-3 py-2 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zaad-900 mb-1">نص المراجعة:</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full text-xs bg-white border border-ivory-300 rounded px-3 py-2 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all"
                    >
                      إرسال التقييم
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Related Royal Collection */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-zaad-900">
              مقتنيات ملكية متناغمة قد تنال إعجابكم
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="bg-white rounded-2xl overflow-hidden border border-ivory-300 p-4 shadow-sm luxury-card-hover flex flex-col justify-between">
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-ivory-200">
                    <Image src={rel.images[0] || '/images/zaad-logo.png'} alt={rel.nameAr} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 mb-3">
                    <h3 className="font-serif text-sm font-bold text-zaad-900 line-clamp-1">{rel.nameAr}</h3>
                    <p className="text-xs text-gold-700 font-bold">{formatPrice(rel.price)}</p>
                  </div>
                  <Link
                    href={`/product/${rel.slug}`}
                    className="w-full block text-center bg-ivory-100 hover:bg-zaad-800 hover:text-white text-zaad-900 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    معاينة الصنف
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
