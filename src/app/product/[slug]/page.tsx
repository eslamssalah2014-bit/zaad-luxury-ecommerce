'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Sparkles,
  Check,
  Star,
  Share2,
  Droplet,
  Feather,
  MapPin,
  Award,
  ChevronDown,
  ChevronUp,
  Quote as QuoteIcon,
  HelpCircle,
  Package,
  Clock,
  BookOpen,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { getLiveProductBySlug, getLiveProducts } from '@/lib/services/productService';
import { getCmsSettings } from '@/lib/services/cmsService';
import { supabase } from '@/lib/supabase/client';
import { Product, Review, HealthBenefitItem } from '@/types';
import {
  CmsSettingsDocument,
  ProductAttribute,
  ProductTab,
  ProductContentBlock
} from '@/types/cms';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

function renderAttributeIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case 'droplet':
    case 'color':
      return <Droplet className="w-4 h-4 text-amber-500" />;
    case 'feather':
    case 'texture':
      return <Feather className="w-4 h-4 text-gold-600" />;
    case 'map-pin':
    case 'source':
    case 'origin':
      return <MapPin className="w-4 h-4 text-emerald-600" />;
    case 'shield':
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    case 'award':
      return <Award className="w-4 h-4 text-gold-600" />;
    case 'package':
    case 'weight':
      return <Package className="w-4 h-4 text-gold-700" />;
    case 'sparkles':
    default:
      return <Sparkles className="w-4 h-4 text-gold-500" />;
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [cmsSettings, setCmsSettings] = useState<CmsSettingsDocument | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTabId, setActiveTabId] = useState<string>('tab-story-details');
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

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
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      setSelectedImageIndex(0);
      setQuantity(1);
      setReviewSubmitted(false);

      try {
        const [liveProd, allProds, cmsDoc] = await Promise.all([
          getLiveProductBySlug(slug),
          getLiveProducts(),
          getCmsSettings()
        ]);

        if (isMounted) {
          setCmsSettings(cmsDoc);

          if (liveProd) {
            setProduct(liveProd);
            setRelatedProducts(allProds.filter(p => p.slug !== liveProd.slug && p.id !== liveProd.id).slice(0, 3));
            setActiveTabId('tab-story-details');

            // Fetch reviews from Supabase
            try {
              const { data: revData } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', liveProd.id)
                .eq('status', 'approved');

              if (revData && revData.length > 0) {
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
              } else {
                setReviews([]);
              }
            } catch (revErr) {
              console.error('Error fetching reviews:', revErr);
              setReviews([]);
            }
          } else {
            setProduct(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching live product detail:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-ivory-100 flex items-center justify-center">
        <div className="text-center font-serif text-zaad-900 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500 animate-spin" />
          <span>جاري تحميل بيانات المنتج...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const pConfig = cmsSettings?.productDetailPage || {
    defaultShippingTextAr: 'شحن لجميع محافظات مصر',
    defaultVatTextAr: 'شامل ضريبة القيمة المضافة',
    defaultTrustBadgeTextAr: 'نقاء موثق وخام 100%',
    defaultStockAvailableTextAr: 'متوفر بالمستودع',
    defaultStockOutTextAr: 'نفد من المخزون',
    relatedProductsTitleAr: 'منتجات طبيعية متناغمة قد تنال إعجابكم',
    reviewsHeadingAr: 'آراء المقتنين',
    addReviewHeadingAr: 'شاركنا انطباعك عن تجربة هذا المنتج',
    addReviewSubheadingAr: 'تقييمك يسهم في إثراء سجل دار زاد للنقاء.',
    addReviewButtonTextAr: 'إرسال التقييم',
    showBreadcrumbs: true,
    showWishlistAndShare: true,
    showRatingStars: true,
    showCompareAtPrice: true,
    showVatMessage: true,
    showShippingMessage: true,
    showTrustBadges: true,
    showStockStatus: true,
    showQuantityStepper: true,
    showAttributesGrid: true,
    showTabsSection: true,
    showRelatedProducts: true,
    showSensoryProfile: true,
    defaultAttributes: [],
    defaultTabs: []
  };

  const isWish = isInWishlist(product.id);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

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

      setReviews([newRev, ...reviews]);
      setReviewSubmitted(true);
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Compute Dynamic Attributes exclusively from THIS product
  const effectiveAttributes: ProductAttribute[] = (Array.isArray(product.attributes) && product.attributes.length > 0)
    ? product.attributes.filter(a => a.isVisible !== false)
    : [];

  // Normalize Health Benefits list (Title + Description)
  const healthBenefitsList: HealthBenefitItem[] = (
    product.healthBenefits && product.healthBenefits.length > 0
      ? product.healthBenefits
      : (Array.isArray(product.healthBenefitsAr)
        ? product.healthBenefitsAr.map(b => typeof b === 'string' ? { title: b, description: '' } : b)
        : [])
  ).filter(b => b.title || b.description);

  const hasBenefits = healthBenefitsList.length > 0;
  const hasUsage = Boolean(product.usageInstructionsAr);
  const hasStorage = Boolean(product.storageInstructionsAr);
  const hasPairings = Boolean(product.pairingSuggestionsAr && product.pairingSuggestionsAr.length > 0);

  const synthesizedTabs: ProductTab[] = [
    // 1. Story & Natural Heritage Tab (Loaded with this product's full story & specs)
    {
      id: 'tab-story-details',
      slug: 'story-details',
      titleAr: 'قصة وتفاصيل المنتج',
      badgeAr: product.categoryNameAr || 'الأصالة والنقاء',
      isVisible: true,
      order: 1,
      blocks: [
        ...(product.tabs?.find(t => t.slug === 'details' || t.slug === 'story-details')?.blocks || [])
      ]
    },

    // 2. Health Benefits, Usage Rituals & Storage Tab (Only if this product has benefits or usage/storage)
    ...((hasBenefits || hasUsage || hasStorage || hasPairings) ? [{
      id: 'tab-benefits-usage',
      slug: 'benefits-usage',
      titleAr: 'الفوائد وطرق الاستخدام والتخزين',
      badgeAr: 'الطقوس والفوائد',
      isVisible: true,
      order: 2,
      blocks: [
        ...(product.tabs?.find(t => t.slug === 'benefits-usage' || t.slug === 'benefits')?.blocks || [])
      ]
    }] : []),

    // 3. Custom CMS Tabs entered specifically for this product
    ...(product.tabs || []).filter(t =>
      t.isVisible !== false &&
      !['details', 'story-details', 'benefits-usage', 'benefits', 'purity-lab', 'lab', 'reviews'].includes(t.slug)
    ),

    // 4. Customer Reviews Tab
    {
      id: 'tab-reviews',
      slug: 'reviews',
      titleAr: pConfig.reviewsHeadingAr || 'آراء وتجارب المقتنين',
      badgeAr: `${reviews.length || product.reviewCount} تقييم`,
      isVisible: true,
      order: 99,
      isSystemReviewsTab: true,
      blocks: []
    }
  ];

  // Active tab fallback
  const activeTab = synthesizedTabs.find(t => t.id === activeTabId) || synthesizedTabs[0];

  // Dynamic Content Block Renderer
  const renderBlock = (block: ProductContentBlock) => {
    if (block.isVisible === false) return null;

    switch (block.type) {
      case 'rich_text':
        return (
          <div key={block.id} className="space-y-3 bg-ivory-50/60 p-5 sm:p-6 rounded-2xl border border-ivory-200">
            {block.titleAr && (
              <h3 className="font-serif text-base sm:text-lg font-bold text-zaad-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>{block.titleAr}</span>
              </h3>
            )}
            {block.bodyAr && (
              <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light whitespace-pre-line">
                {block.bodyAr}
              </p>
            )}
          </div>
        );

      case 'image':
        return block.imageUrl ? (
          <div key={block.id} className="space-y-2">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-ivory-200 border border-ivory-300">
              <Image
                src={block.imageUrl}
                alt={block.imageAltAr || block.titleAr || product.nameAr}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            {block.titleAr && (
              <p className="text-xs text-charcoal-700/70 text-center font-medium">{block.titleAr}</p>
            )}
          </div>
        ) : null;

      case 'image_text':
        return (
          <div key={block.id} className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-ivory-50/80 p-6 rounded-2xl border border-ivory-200 ${block.imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}>
            {block.imageUrl && (
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden bg-ivory-200 border border-ivory-300">
                <Image
                  src={block.imageUrl}
                  alt={block.imageAltAr || block.titleAr || product.nameAr}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-3">
              {block.titleAr && (
                <h3 className="font-serif text-lg font-bold text-zaad-900">{block.titleAr}</h3>
              )}
              {block.bodyAr && (
                <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light whitespace-pre-line">
                  {block.bodyAr}
                </p>
              )}
            </div>
          </div>
        );

      case 'icons_grid':
        return (
          <div key={block.id} className="space-y-4">
            {block.titleAr && (
              <h3 className="font-serif text-base sm:text-lg font-bold text-zaad-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-600" />
                <span>{block.titleAr}</span>
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(block.iconsGridItems || []).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-sm flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ivory-100 border border-ivory-300 flex items-center justify-center shrink-0">
                    {renderAttributeIcon(item.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zaad-900">{item.titleAr}</h4>
                    <p className="text-[11px] text-charcoal-700/80 mt-1 leading-relaxed">{item.descAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div key={block.id} className="space-y-4">
            {block.titleAr && (
              <h3 className="font-serif text-base sm:text-lg font-bold text-zaad-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold-600" />
                <span>{block.titleAr}</span>
              </h3>
            )}
            <div className="space-y-2.5">
              {(block.faqItems || []).map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div key={faq.id || idx} className="rounded-2xl border border-ivory-300 bg-white overflow-hidden transition-all shadow-sm">
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="w-full p-4 text-right flex items-center justify-between gap-4 font-semibold text-xs text-zaad-900 hover:bg-ivory-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 text-[10px] flex items-center justify-center font-mono font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gold-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-charcoal-400 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="p-4 pt-1 text-xs text-charcoal-800 leading-relaxed font-light border-t border-ivory-200 bg-ivory-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'quote':
        return (
          <div key={block.id} className="p-6 rounded-2xl bg-gradient-to-r from-zaad-900 to-zaad-800 text-ivory-100 border border-gold-500/30 relative overflow-hidden shadow-md">
            <QuoteIcon className="w-12 h-12 text-gold-500/15 absolute -bottom-2 -left-2 rotate-180 pointer-events-none" />
            <p className="font-serif text-sm sm:text-base italic leading-relaxed text-gold-200">
              &ldquo;{block.bodyAr}&rdquo;
            </p>
            {block.quoteAuthorAr && (
              <span className="block text-xs text-gold-400 font-bold mt-3 text-left font-mono">
                — {block.quoteAuthorAr}
              </span>
            )}
          </div>
        );

      case 'divider':
        return <hr key={block.id} className="border-t border-ivory-300 my-4" />;

      case 'custom_html':
        return block.customHtml ? (
          <div key={block.id} dangerouslySetInnerHTML={{ __html: block.customHtml }} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 1. Breadcrumbs */}
        {pConfig.showBreadcrumbs && (
          <nav className="flex items-center gap-2 text-xs text-charcoal-700/70">
            <Link href="/" className="hover:text-zaad-800 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-zaad-800 transition-colors">المنتجات الطبيعية</Link>
            {product.categoryNameAr && (
              <>
                <span>/</span>
                <span className="text-zaad-900 font-medium">{product.categoryNameAr}</span>
              </>
            )}
            <span>/</span>
            <span className="text-gold-700 font-bold truncate max-w-xs">{product.nameAr}</span>
          </nav>
        )}

        {/* 2. Product Top Grid (Gallery & Commercial Purchase Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm">

          {/* Gallery Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main HD Image */}
            <div className="relative h-[400px] sm:h-[480px] rounded-2xl overflow-hidden bg-ivory-200 border border-ivory-300 shadow-inner">
              <Image
                src={product.images[selectedImageIndex] || product.images[0] || '/images/zaad-logo.png'}
                alt={product.nameAr}
                fill
                unoptimized
                className="object-cover"
                priority
              />

              {/* Floating Luxury Badges (Unique per product) */}
              {product.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-zaad-900/90 backdrop-blur-md text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full border border-gold-400/50 shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>{product.badge}</span>
                  </span>
                </div>
              )}

              {/* Wishlist & Share Buttons */}
              {pConfig.showWishlistAndShare && (
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label="حفظ في المفضلة"
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${isWish
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-white/90 text-charcoal-700 hover:text-red-600 border border-white'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isWish ? 'fill-red-600' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="مشاركة الرابط"
                    className="w-10 h-10 rounded-full bg-white/90 text-charcoal-700 hover:text-zaad-900 flex items-center justify-center backdrop-blur-md border border-white transition-all shadow-sm"
                    title="نسخ الرابط"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              )}

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
                    <Image src={img} alt={`${product.nameAr} - صورة ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Purity Guarantee Trust Stamp Under Gallery */}
            <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center justify-between text-xs text-charcoal-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-zaad-900 block font-bold">ميثاق النقاء والجودة الحيوية</strong>
                  <span className="text-[11px] text-charcoal-600">منتج طبيعي خام 100% غير مبستر</span>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                طبيعي 100%
              </span>
            </div>
          </div>

          {/* Details & Purchase Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

            <div className="space-y-4">
              
              {/* Product Title */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zaad-900 leading-tight">
                  {product.nameAr}
                </h1>

                {/* Tagline & Package Weight */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {product.packageWeight && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zaad-950 text-gold-300 border border-gold-500/40 text-xs font-bold shadow-sm animate-fade-in">
                      <Package className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>وزن العبوة: {product.packageWeight}</span>
                    </div>
                  )}
                  {product.taglineAr && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold-50/90 border border-gold-200 text-gold-950 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span>{product.taglineAr}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* English Subtitle & Rating */}
              <div className="flex items-center justify-between text-xs text-charcoal-700/70 border-b border-ivory-200 pb-3">
                <span className="font-serif italic text-gold-800 text-sm font-medium">{product.nameEn}</span>
                {pConfig.showRatingStars && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <span className="font-bold text-zaad-900 text-sm">{product.rating}</span>
                    <span>({reviews.length || product.reviewCount} تقييم موثق)</span>
                  </div>
                )}
              </div>

              {/* Commercial Price Block */}
              <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-serif">
                      {formatPrice(product.price)}
                    </div>
                    {product.packageWeight && (
                      <span className="text-xs font-bold text-zaad-900 bg-gold-100/90 border border-gold-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Package className="w-3 h-3 text-gold-700" />
                        <span>{product.packageWeight}</span>
                      </span>
                    )}
                  </div>
                  {pConfig.showCompareAtPrice && product.compareAtPrice && (
                    <div className="text-xs text-gray-500 line-through mt-0.5">
                      السعر السابق: {formatPrice(product.compareAtPrice)}
                    </div>
                  )}
                </div>
                <div className="text-left text-xs text-charcoal-700/70 space-y-0.5">
                  {pConfig.showVatMessage && (
                    <span className="text-zaad-700 font-semibold block">
                      {product.customVatMessage || pConfig.defaultVatTextAr}
                    </span>
                  )}
                  {pConfig.showShippingMessage && (
                    <span className="text-[11px] text-gold-700 block font-medium">
                      {product.customShippingMessage || pConfig.defaultShippingTextAr}
                    </span>
                  )}
                </div>
              </div>

              {/* Short Description (Unique per product) */}
              {product.shortDescAr && (
                <div className="bg-white p-3.5 rounded-xl border border-ivory-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider block mb-1">
                    نبذة عن هذا المنتج:
                  </span>
                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light">
                    {product.shortDescAr}
                  </p>
                </div>
              )}

              {/* Dynamic Product Quality Attributes Grid */}
              {pConfig.showAttributesGrid && effectiveAttributes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-zaad-900 block">المواصفات الحيوية:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {effectiveAttributes.map((attr) => (
                      <div key={attr.id} className="bg-ivory-50 p-2.5 rounded-xl border border-ivory-200 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white border border-ivory-300 flex items-center justify-center shrink-0">
                          {renderAttributeIcon(attr.icon)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-charcoal-700/70 block truncate">{attr.nameAr}</span>
                          <strong className="text-xs text-zaad-900 font-semibold truncate block">{attr.valueAr}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Purchase Action Bar */}
            <div className="space-y-4 pt-4 border-t border-ivory-200">

              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                {pConfig.showQuantityStepper && (
                  <div className="flex items-center border border-ivory-300 rounded-xl bg-ivory-50 px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-zaad-800 hover:text-gold-600 transition-colors font-bold"
                      aria-label="تقليل الكمية"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-zaad-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-zaad-800 hover:text-gold-600 transition-colors font-bold"
                      aria-label="زيادة الكمية"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => addItem(product, quantity)}
                  className="flex-1 bg-zaad-800 hover:bg-zaad-700 text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 gold-shimmer-btn"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                  <span>اقتناء هذا المنتج ({formatPrice(product.price * quantity)})</span>
                </button>
              </div>

              {/* Quality & Warehouse Status */}
              <div className="flex items-center justify-between text-xs text-charcoal-700/80 pt-1">
                {pConfig.showTrustBadges && (
                  <span className="text-gold-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.customTrustBadgeText || pConfig.defaultTrustBadgeTextAr}</span>
                  </span>
                )}
                {pConfig.showStockStatus && (
                  <span className={`font-semibold flex items-center gap-1 ${product.stockQuantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span>{product.stockQuantity > 0 ? pConfig.defaultStockAvailableTextAr : pConfig.defaultStockOutTextAr}</span>
                  </span>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* 3. Dynamic Tabs & Complete Content System */}
        {pConfig.showTabsSection && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm space-y-8">
            
            {/* Tab Navigation Header */}
            <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-ivory-200 pb-4">
              {synthesizedTabs.map((tab) => {
                const isActive = activeTab.id === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${isActive
                      ? 'bg-zaad-900 text-white shadow-md'
                      : 'bg-ivory-50 text-charcoal-700 hover:bg-ivory-200 hover:text-zaad-900 border border-ivory-200'
                      }`}
                  >
                    <span>{tab.titleAr}</span>
                    {tab.badgeAr && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${isActive ? 'bg-gold-500 text-zaad-950 font-bold' : 'bg-ivory-200 text-charcoal-600'}`}>
                        {tab.badgeAr}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panel */}
            <div className="space-y-8">

              {/* =========================================================================
                  TAB 1: STORY & PRODUCT DETAILS
              ========================================================================= */}
              {activeTab.id === 'tab-story-details' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Full Story Description (Specific to THIS product) */}
                  {product.fullStoryAr && (
                    <div className="bg-ivory-50 p-6 sm:p-8 rounded-3xl border border-ivory-300 space-y-4">
                      <div className="flex items-center gap-2 text-zaad-900">
                        <BookOpen className="w-5 h-5 text-gold-600" />
                        <h3 className="font-serif text-lg sm:text-xl font-bold">قصة ونقاء {product.nameAr}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light whitespace-pre-line">
                        {product.fullStoryAr}
                      </p>
                    </div>
                  )}

                  {/* Sensory Profile Bars (Specific to THIS product) */}
                  {pConfig.showSensoryProfile && product.sensoryProfile && (
                    <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                        <h4 className="font-serif text-base font-bold text-zaad-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gold-600" />
                          <span>الملف الحسي والعطري لهذا المنتج</span>
                        </h4>
                        {product.sensoryProfile.crystallization && (
                          <span className="text-xs text-gold-700 font-semibold font-mono">
                            طبيعة القوام والتبلور: {product.sensoryProfile.crystallization}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'الحلاوة الطبيعية', val: product.sensoryProfile.sweetness || 4 },
                          { label: 'الشذى العطري الزهري', val: product.sensoryProfile.floralAroma || 4 },
                          { label: 'القوام والكثافة', val: product.sensoryProfile.density || 4 },
                          { label: 'عمق النكهة والأثر', val: product.sensoryProfile.intensity || 4 }
                        ].map((s, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-zaad-900">
                              <span>{s.label}</span>
                              <span className="font-mono text-gold-700">{s.val} / 5</span>
                            </div>
                            <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-gold-600 to-amber-500 rounded-full transition-all"
                                style={{ width: `${(s.val / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render any additional custom blocks inside this tab */}
                  {activeTab.blocks?.map(renderBlock)}

                </div>
              )}

              {/* =========================================================================
                  TAB 2: HEALTH BENEFITS, USAGE & STORAGE
              ========================================================================= */}
              {activeTab.id === 'tab-benefits-usage' && (
                <div className="space-y-8 animate-fade-in">

                  {/* Health Benefits Grid (Unique per product with Titles + Descriptions) */}
                  {hasBenefits && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-zaad-900">
                        <HeartHandshake className="w-5 h-5 text-gold-600" />
                        <h3 className="font-serif text-lg sm:text-xl font-bold">الخصائص الحيوية والفوائد الصحية</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {healthBenefitsList.map((benefit, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-start gap-3.5 shadow-xs">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs sm:text-sm font-bold text-zaad-900">{benefit.title}</h4>
                              {benefit.description && (
                                <p className="text-xs text-charcoal-700 leading-relaxed font-light">
                                  {benefit.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage & Storage Two-Column Grid */}
                  {(hasUsage || hasStorage) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Usage Instructions Card */}
                      {product.usageInstructionsAr && (
                        <div className="p-6 rounded-3xl bg-white border border-ivory-300 shadow-sm space-y-3">
                          <div className="flex items-center gap-2 text-zaad-900">
                            <Clock className="w-5 h-5 text-gold-600" />
                            <h4 className="font-serif text-base font-bold">طرق الاستخدام والطقوس الموصى بها</h4>
                          </div>
                          <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light whitespace-pre-line">
                            {product.usageInstructionsAr}
                          </p>
                        </div>
                      )}

                      {/* Storage Instructions Card */}
                      {product.storageInstructionsAr && (
                        <div className="p-6 rounded-3xl bg-white border border-ivory-300 shadow-sm space-y-3">
                          <div className="flex items-center gap-2 text-zaad-900">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-serif text-base font-bold">إرشادات حفظ النقاء والتخزين</h4>
                          </div>
                          <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light whitespace-pre-line">
                            {product.storageInstructionsAr}
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Pairing Suggestions (Unique per product) */}
                  {hasPairings && (
                    <div className="p-5 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                      <strong className="text-xs font-bold text-zaad-900 block">اقتراحات التذوق والتناغم:</strong>
                      <div className="flex flex-wrap gap-2">
                        {(product.pairingSuggestionsAr || []).map((pair, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-xl text-xs text-charcoal-800 border border-ivory-300 font-medium">
                            🌿 {pair}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render any additional custom blocks */}
                  {activeTab.blocks?.map(renderBlock)}

                </div>
              )}

              {/* =========================================================================
                  TAB 3: CUSTOM CMS TABS (RENDERED FULLY FOR THIS PRODUCT)
              ========================================================================= */}
              {!['tab-story-details', 'tab-benefits-usage', 'tab-reviews'].includes(activeTab.id) && (
                <div className="space-y-6 animate-fade-in">
                  {activeTab.blocks?.length > 0 ? (
                    activeTab.blocks.map(renderBlock)
                  ) : (
                    <div className="py-12 text-center text-xs text-charcoal-600">
                      لا يوجد محتوى إضافي مدخل في هذا التبويب حالياً.
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  TAB 4: REVIEWS TAB
              ========================================================================= */}
              {activeTab.id === 'tab-reviews' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Reviews Summary Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ivory-50 p-6 rounded-3xl border border-ivory-200">
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-zaad-900">
                        {pConfig.reviewsHeadingAr || 'آراء وتجارب المقتنين'}
                      </h3>
                      <p className="text-xs text-charcoal-700/70">
                        تقييمات موثقة لـ {product.nameAr}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-zaad-900 font-serif">{product.rating}</div>
                      <div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                          ))}
                        </div>
                        <span className="text-[11px] text-charcoal-600 block mt-0.5">
                          بناءً على {reviews.length || product.reviewCount} تجربة موثقة
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-5 rounded-2xl bg-white border border-ivory-200 shadow-xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <strong className="text-xs font-bold text-zaad-900">{rev.customerName}</strong>
                              {rev.isVerifiedPurchase && (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>مقتني موثق</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                              ))}
                            </div>
                          </div>
                          {rev.titleAr && (
                            <h4 className="text-xs font-bold text-zaad-900">{rev.titleAr}</h4>
                          )}
                          <p className="text-xs text-charcoal-700 leading-relaxed font-light">
                            {rev.commentAr}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center bg-ivory-50 rounded-2xl border border-ivory-200 text-xs text-charcoal-600">
                        كن أول من يشاركنا انطباعه وتقييمه لـ {product.nameAr}.
                      </div>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-ivory-50 p-6 sm:p-8 rounded-3xl border border-ivory-300 space-y-4">
                    <div>
                      <h4 className="font-serif text-base font-bold text-zaad-900">
                        {pConfig.addReviewHeadingAr || 'شاركنا انطباعك عن تجربة هذا المنتج'}
                      </h4>
                      <p className="text-xs text-charcoal-700/70 mt-0.5">
                        {pConfig.addReviewSubheadingAr || 'تقييمك يسهم في إثراء سجل دار زاد للنقاء.'}
                      </p>
                    </div>

                    {reviewSubmitted ? (
                      <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>شكراً لمشاركتك! تم تسجيل تقييمك بنجاح.</span>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-zaad-900 mb-1">الاسم الكريم:</label>
                            <input
                              type="text"
                              required
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              className="w-full bg-white border border-ivory-300 rounded-xl p-3 text-xs"
                              placeholder="مثال: أحمد عبد الله"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-zaad-900 mb-1">التقييم:</label>
                            <select
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                              className="w-full bg-white border border-ivory-300 rounded-xl p-3 text-xs font-bold"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ ممتاز (5/5)</option>
                              <option value="4">⭐⭐⭐⭐ جيد جداً (4/5)</option>
                              <option value="3">⭐⭐⭐ جيد (3/5)</option>
                              <option value="2">⭐⭐ مقبول (2/5)</option>
                              <option value="1">⭐ غير راضٍ (1/5)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-zaad-900 mb-1">عنوان التقييم:</label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full bg-white border border-ivory-300 rounded-xl p-3 text-xs"
                            placeholder="مثال: نكهة نقية وقوام استثنائي"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-zaad-900 mb-1">تفاصيل تجربتك:</label>
                          <textarea
                            required
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="w-full bg-white border border-ivory-300 rounded-xl p-3 text-xs"
                            placeholder="صف لنا شعورك وانطباعك عن الجودة والطقوس..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-zaad-800 hover:bg-zaad-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
                        >
                          {pConfig.addReviewButtonTextAr || 'إرسال التقييم'}
                        </button>
                      </div>
                    )}
                  </form>

                </div>
              )}

            </div>

          </div>
        )}

        {/* 4. Related Natural Products Section */}
        {pConfig.showRelatedProducts && relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-serif text-xl font-bold text-zaad-900">
                {pConfig.relatedProductsTitleAr || 'منتجات طبيعية متناغمة قد تنال إعجابكم'}
              </h3>
              <Link href="/shop" className="text-xs font-bold text-gold-700 hover:text-gold-800 transition-colors">
                عرض كافة المنتجات ←
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="group bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-ivory-200 overflow-hidden">
                      <Image
                        src={rel.images[0] || '/images/zaad-logo.png'}
                        alt={rel.nameAr}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {rel.badge && (
                        <span className="absolute top-3 right-3 bg-zaad-900/90 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold-400/40">
                          {rel.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      {rel.packageWeight && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-50 text-zaad-900 border border-gold-300 text-[10px] font-semibold">
                          <Package className="w-3 h-3 text-gold-600" />
                          <span>{rel.packageWeight}</span>
                        </span>
                      )}
                      <h4 className="font-serif text-sm font-bold text-zaad-900 line-clamp-1 group-hover:text-gold-700 transition-colors">
                        <Link href={`/product/${rel.slug}`}>{rel.nameAr}</Link>
                      </h4>
                      <p className="text-xs text-charcoal-600 line-clamp-2 font-light">
                        {rel.shortDescAr}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-ivory-100 mt-2">
                    <span className="text-sm font-bold text-zaad-900 font-serif">{formatPrice(rel.price)}</span>
                    <Link
                      href={`/product/${rel.slug}`}
                      className="text-xs bg-ivory-100 hover:bg-zaad-800 hover:text-white text-zaad-900 font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      استكشاف المنتج
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
