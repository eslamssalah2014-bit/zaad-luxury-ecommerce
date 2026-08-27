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
  Package
} from 'lucide-react';
import { getLiveProductBySlug, getLiveProducts } from '@/lib/services/productService';
import { getCmsSettings } from '@/lib/services/cmsService';
import { supabase } from '@/lib/supabase/client';
import { Product, Review } from '@/types';
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
  const [activeTabId, setActiveTabId] = useState<string>('');
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
            setRelatedProducts(allProds.filter(p => p.slug !== slug).slice(0, 3));

            // Determine initial active tab
            const effectiveTabs = (liveProd.tabs && liveProd.tabs.length > 0)
              ? liveProd.tabs.filter(t => t.isVisible !== false)
              : (cmsDoc.productDetailPage?.defaultTabs || []).filter(t => t.isVisible !== false);

            if (effectiveTabs.length > 0) {
              setActiveTabId(effectiveTabs[0].id);
            }

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
        <div className="text-center font-serif text-zaad-900 text-lg">جاري تحميل بيانات المنتجات الطبيعية...</div>
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
    showLabBatch: false,
    showSensoryProfile: false,
    defaultTabs: [],
    defaultAttributes: []
  };

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

  // Compute Dynamic Attributes
  const effectiveAttributes: ProductAttribute[] = (product.attributes && product.attributes.length > 0)
    ? product.attributes.filter(a => a.isVisible !== false)
    : [
        { id: 'attr-src', nameAr: 'المصدر الزهري', valueAr: product.floralSourceAr || 'أشجار ومروج برية نادرة', icon: 'droplet', isVisible: Boolean(product.floralSourceAr), order: 1 },
        { id: 'attr-org', nameAr: 'المنطقة والموطن', valueAr: product.originRegionAr || 'جمهورية مصر العربية', icon: 'map-pin', isVisible: Boolean(product.originRegionAr), order: 2 },
        { id: 'attr-wt', nameAr: 'الوزن الصافي', valueAr: `${product.weightGrams || 500} جرام`, icon: 'package', isVisible: true, order: 3 },
        { id: 'attr-st', nameAr: 'حفظ النقاء', valueAr: product.storageInstructionsAr || 'يحفظ بدرجة حرارة الغرفة', icon: 'shield', isVisible: true, order: 4 }
      ].filter(a => a.isVisible);

  // Compute Dynamic Tabs
  let effectiveTabs: ProductTab[] = (product.tabs && product.tabs.length > 0)
    ? product.tabs.filter(t => t.isVisible !== false)
    : (pConfig.defaultTabs || []).filter(t => t.isVisible !== false);

  // If no tabs exist at all, construct dynamic default tabs populated from product fields
  if (effectiveTabs.length === 0) {
    effectiveTabs = [
      {
        id: 'tab-natural-details',
        slug: 'details',
        titleAr: 'تفاصيل المنتج الطبيعي',
        isVisible: true,
        order: 1,
        blocks: [
          {
            id: 'blk-story',
            type: 'rich_text' as const,
            titleAr: 'قصة ونقاء المنتج',
            bodyAr: product.fullStoryAr || product.shortDescAr || 'منتج طبيعي نقي 100% مستخرج وفق أعلى معايير الجودة والأصالة.',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'tab-benefits',
        slug: 'benefits',
        titleAr: 'الفوائد الصحية وطرق الاستخدام',
        isVisible: Boolean(product.healthBenefitsAr?.length || product.pairingSuggestionsAr?.length || product.usageInstructionsAr),
        order: 2,
        blocks: [
          ...(product.healthBenefitsAr?.length ? [{
            id: 'blk-bens',
            type: 'icons_grid' as const,
            titleAr: 'الخصائص الحيوية والفوائد',
            isVisible: true,
            order: 1,
            iconsGridItems: product.healthBenefitsAr.map((b, idx) => ({
              id: `ben-${idx}`,
              titleAr: b,
              descAr: 'مستخلص من الطبيعة البكر لتعزيز الصحة والنشاط',
              icon: 'shield'
            }))
          }] : []),
          ...(product.usageInstructionsAr ? [{
            id: 'blk-usage',
            type: 'rich_text' as const,
            titleAr: 'طريقة الاستخدام المثلى',
            bodyAr: product.usageInstructionsAr,
            isVisible: true,
            order: 2
          }] : [])
        ]
      },
      {
        id: 'tab-reviews',
        slug: 'reviews',
        titleAr: pConfig.reviewsHeadingAr || 'آراء المقتنين',
        isVisible: true,
        order: 3,
        isSystemReviewsTab: true,
        blocks: []
      }
    ].filter(t => t.isVisible);
  }

  // Active tab fallback
  const activeTab = effectiveTabs.find(t => t.id === activeTabId) || effectiveTabs[0];

  // Dynamic Content Block Renderer
  const renderBlock = (block: ProductContentBlock) => {
    if (block.isVisible === false) return null;

    switch (block.type) {
      case 'rich_text':
        return (
          <div key={block.id} className="space-y-3">
            {block.titleAr && (
              <h3 className="font-serif text-lg sm:text-xl font-bold text-zaad-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>{block.titleAr}</span>
              </h3>
            )}
            {block.bodyAr && (
              <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed font-light whitespace-pre-line">
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
          <div
            key={block.id}
            className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-ivory-50 rounded-2xl border border-ivory-300 ${
              block.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {block.imageUrl && (
              <div className="md:col-span-5 relative h-56 rounded-xl overflow-hidden bg-ivory-200 border border-ivory-300">
                <Image
                  src={block.imageUrl}
                  alt={block.imageAltAr || block.titleAr || product.nameAr}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
            <div className={`${block.imageUrl ? 'md:col-span-7' : 'md:col-span-12'} space-y-2`}>
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
                <ShieldCheck className="w-5 h-5 text-gold-600" />
                <span>{block.titleAr}</span>
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(block.iconsGridItems || []).map((item) => (
                <div key={item.id} className="bg-ivory-50 p-4 rounded-xl border border-ivory-300 space-y-1.5 hover:border-gold-400 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gold-100/80 text-gold-800 flex items-center justify-center">
                    {renderAttributeIcon(item.icon)}
                  </div>
                  <h4 className="font-bold text-xs text-zaad-900">{item.titleAr}</h4>
                  <p className="text-[11px] text-charcoal-700/80 leading-relaxed font-light">{item.descAr}</p>
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
                <HelpCircle className="w-5 h-5 text-gold-600" />
                <span>{block.titleAr}</span>
              </h3>
            )}
            <div className="space-y-2">
              {(block.faqItems || []).map((faq, fIdx) => {
                const isOpen = expandedFaqIndex === fIdx;
                return (
                  <div key={faq.id || fIdx} className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden transition-all">
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : fIdx)}
                      className="w-full text-right p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-zaad-900 hover:text-gold-700 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gold-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-charcoal-500 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-charcoal-700 leading-relaxed border-t border-ivory-200/60 font-light whitespace-pre-line animate-fade-in">
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
          <div key={block.id} className="bg-zaad-900 text-ivory-100 p-6 rounded-2xl border border-gold-500/40 relative overflow-hidden space-y-3">
            <QuoteIcon className="w-8 h-8 text-gold-500/30 absolute top-3 left-4 pointer-events-none" />
            {block.bodyAr && (
              <p className="font-serif text-base sm:text-lg italic text-gold-200 leading-relaxed">
                &ldquo;{block.bodyAr}&rdquo;
              </p>
            )}
            {block.quoteAuthorAr && (
              <p className="text-xs text-gold-400 font-bold tracking-wide">— {block.quoteAuthorAr}</p>
            )}
          </div>
        );

      case 'divider':
        return (
          <div key={block.id} className="w-full my-4 flex items-center justify-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
            <Sparkles className="w-3.5 h-3.5 text-gold-500/60" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
          </div>
        );

      case 'custom_html':
        return block.customHtml ? (
          <div
            key={block.id}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: block.customHtml }}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Breadcrumb Navigation */}
        {pConfig.showBreadcrumbs && (
          <nav className="flex items-center gap-2 text-xs text-charcoal-700/70 mb-8">
            <Link href="/" className="hover:text-zaad-900 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-zaad-900 transition-colors">المنتجات الطبيعية</Link>
            <span>/</span>
            <span className="text-zaad-900 font-bold">{product.nameAr}</span>
          </nav>
        )}

        {/* 2. Product Top Grid (Gallery & Purchase) */}
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
                  <span className="bg-zaad-900/90 backdrop-blur-md text-gold-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-gold-400/40 shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Wishlist & Share Buttons */}
              {pConfig.showWishlistAndShare && (
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
                    <Image src={img} alt={`صورة ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

            <div className="space-y-4">
              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-zaad-900 leading-tight">
                {product.nameAr}
              </h1>

              {/* English Subtitle & Rating */}
              <div className="flex items-center justify-between text-xs text-charcoal-700/70 pb-2">
                <span className="font-serif italic text-gold-800">{product.nameEn}</span>
                {pConfig.showRatingStars && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <span className="font-bold text-zaad-900 text-sm">{product.rating}</span>
                    <span>({product.reviewCount} تقييم موثق)</span>
                  </div>
                )}
              </div>

              {/* Commercial Price Block */}
              <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-zaad-900 font-serif">
                    {formatPrice(product.price)}
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
                    <span className="text-[11px] text-gold-700 block">
                      {product.customShippingMessage || pConfig.defaultShippingTextAr}
                    </span>
                  )}
                </div>
              </div>

              {/* Tagline & Short Summary */}
              <p className="text-sm text-charcoal-800 leading-relaxed font-light">
                {product.taglineAr || product.shortDescAr}
              </p>

              {/* Dynamic Product Attributes Grid */}
              {pConfig.showAttributesGrid && effectiveAttributes.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
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
                    <ShieldCheck className="w-3.5 h-3.5" />
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

        {/* 3. Fully Dynamic Tabs Section */}
        {pConfig.showTabsSection && effectiveTabs.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-sm mb-16">

            {/* Dynamic Tab Navigation Headers */}
            <div className="flex items-center gap-4 border-b border-ivory-200 pb-4 overflow-x-auto">
              {effectiveTabs.map((tab) => {
                const isActive = (tab.id === activeTabId) || (!activeTabId && tab === effectiveTabs[0]);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`text-sm font-bold pb-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? 'border-gold-500 text-zaad-900'
                        : 'border-transparent text-charcoal-700/70 hover:text-zaad-900'
                    }`}
                  >
                    <span>{tab.titleAr}</span>
                    {tab.isSystemReviewsTab && (
                      <span className="text-xs bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full font-mono font-normal">
                        {reviews.length}
                      </span>
                    )}
                    {tab.badgeAr && (
                      <span className="text-[10px] bg-gold-500 text-zaad-950 px-2 py-0.2 rounded-full font-bold">
                        {tab.badgeAr}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Renderer */}
            <div className="pt-8 animate-fade-in">
              {activeTab?.isSystemReviewsTab ? (
                /* System Customer Reviews Tab */
                <div className="space-y-8 max-w-4xl">
                  <div className="space-y-4 divide-y divide-ivory-200">
                    {reviews.length === 0 ? (
                      <p className="text-xs text-charcoal-700/60 py-4">كن أول من يشارك انطباعه وتقييمه لهذا المنتج الطبيعي.</p>
                    ) : (
                      reviews.map((rev) => (
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
                      ))
                    )}
                  </div>

                  {/* Review Submission Form */}
                  <div className="bg-ivory-50 p-6 rounded-2xl border border-ivory-300 max-w-xl">
                    <h4 className="text-sm font-bold text-zaad-900 mb-1">{pConfig.addReviewHeadingAr || 'شاركنا انطباعك عن تجربة هذا المنتج'}</h4>
                    <p className="text-xs text-charcoal-700/70 mb-4">{pConfig.addReviewSubheadingAr || 'تقييمك يسهم في إثراء سجل دار زاد للنقاء.'}</p>

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
                          {pConfig.addReviewButtonTextAr || 'إرسال التقييم'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                /* Dynamic Content Blocks Renderer for Tab */
                <div className="space-y-8 max-w-4xl">
                  {(activeTab?.blocks || []).map((block) => renderBlock(block))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 4. Related Products Section */}
        {pConfig.showRelatedProducts && relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-zaad-900">
              {pConfig.relatedProductsTitleAr || 'منتجات طبيعية متناغمة قد تنال إعجابكم'}
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
