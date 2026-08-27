'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, Star, ShieldCheck, Eye, Sparkles, RotateCcw, ArrowLeft } from 'lucide-react';
import { Product, Category } from '@/types';
import { ShopPageConfig } from '@/types/cms';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

interface ShopClientProps {
  initialShopConfig?: ShopPageConfig;
  initialProducts?: Product[];
  initialCategories?: Category[];
}

export default function ShopClient({
  initialShopConfig,
  initialProducts = [],
  initialCategories = []
}: ShopClientProps) {
  const shopConfig = initialShopConfig || DEFAULT_CMS_SETTINGS.shopPage;
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);

  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.nameAr?.toLowerCase().includes(query) || product.nameEn?.toLowerCase().includes(query);
        const matchesDesc = product.shortDescAr?.toLowerCase().includes(query);
        const matchesBatch = product.latestLabBatch?.batchNumber?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBatch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  // Grid columns class based on CMS configuration
  const gridColsClass =
    shopConfig.gridColumns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : shopConfig.gridColumns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const resultsCountText = (shopConfig.resultsCountTemplateAr || 'النتائج المتاحة: {count} منتج طبيعي فاخر').replace(
    '{count}',
    filteredProducts.length.toString()
  );

  return (
    <div className="min-h-screen bg-ivory-100 py-12 font-arabic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          {shopConfig.heroBadgeAr && (
            <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-3.5 py-1 rounded-full text-gold-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{shopConfig.heroBadgeAr}</span>
            </div>
          )}
          
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            {shopConfig.mainTitleAr}
          </h1>
          
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-4"></div>
          
          {shopConfig.subtitleAr && (
            <p className="text-xs sm:text-sm text-charcoal-700/80 font-light leading-relaxed">
              {shopConfig.subtitleAr}
            </p>
          )}
        </div>

        {/* Optional Banner Image */}
        {shopConfig.bannerImageUrl && (
          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-gold-500/20 mb-10">
            <Image
              src={shopConfig.bannerImageUrl}
              alt={shopConfig.mainTitleAr}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zaad-950/80 via-zaad-950/20 to-transparent"></div>
          </div>
        )}

        {/* Filter & Search Bar - Rebalanced 3-Column Grid */}
        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={shopConfig.searchPlaceholderAr || 'بحث باسم الصنف...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-lg pr-9 pl-4 py-2.5 focus:border-gold-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-ivory-50 border border-ivory-300 rounded-lg px-3 py-2.5 focus:border-gold-500 focus:outline-none text-zaad-900 font-medium"
            >
              <option value="all">{shopConfig.allCategoriesLabelAr || 'كافة المنتجات الطبيعية'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-ivory-50 border border-ivory-300 rounded-lg px-3 py-2.5 focus:border-gold-500 focus:outline-none text-zaad-900 font-medium"
            >
              <option value="featured">{shopConfig.sortFeaturedLabelAr || 'ترتيب: الإصدارات المميزة'}</option>
              <option value="price-high">{shopConfig.sortPriceHighLabelAr || 'السعر: من الأعلى للأقل'}</option>
              <option value="price-low">{shopConfig.sortPriceLowLabelAr || 'السعر: من الأقل للأعلى'}</option>
              <option value="rating">{shopConfig.sortRatingLabelAr || 'الأعلى تقييماً'}</option>
            </select>

          </div>

          {/* Active Filter Chips & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-ivory-200 text-xs">
            <span className="text-charcoal-700 font-medium">
              {resultsCountText}
            </span>

            {(selectedCategory !== 'all' || searchQuery || sortBy !== 'featured') && (
              <button
                onClick={resetFilters}
                className="text-gold-700 hover:text-gold-900 flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{shopConfig.resetFiltersLabelAr || 'إعادة تعيين المرشحات'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-ivory-300 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-100 mx-auto flex items-center justify-center text-zaad-800">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base font-bold text-zaad-900">{shopConfig.emptyStateTitleAr || 'لم يتم العثور على مقتنيات مطابقة'}</h3>
            <p className="text-xs text-charcoal-700/70 max-w-sm mx-auto">
              {shopConfig.emptyStateDescAr || 'جرب تغيير معايير البحث أو اختيار فئة أخرى لاستعراض منتجات زاد.'}
            </p>
            <button
              onClick={resetFilters}
              className="inline-block bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-sm transition-colors"
            >
              {shopConfig.emptyStateButtonTextAr || 'استعراض كافة المنتجات'}
            </button>
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-8`}>
            {filteredProducts.map((product) => {
              const isWish = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm luxury-card-hover group flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-72 bg-ivory-200/50 overflow-hidden">
                    <Image
                      src={product.images[0] || '/images/zaad-logo.png'}
                      alt={product.nameAr}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Badges */}
                    {product.badge && (
                      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                        <span className="bg-zaad-900/90 backdrop-blur-md text-gold-300 text-[11px] font-bold px-3 py-1 rounded-full border border-gold-400/40">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      aria-label="حفظ في المفضلة"
                      className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
                        isWish
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-white/80 text-charcoal-700 hover:text-red-600 border border-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-red-600' : ''}`} />
                    </button>

                    {/* Quick View */}
                    <div className="absolute inset-0 bg-zaad-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Link
                        href={`/product/${product.slug}`}
                        className="bg-white text-zaad-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-gold-50 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4 text-gold-600" />
                        <span>{shopConfig.quickViewButtonTextAr || 'تفاصيل المنتج الطبيعي'}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-charcoal-700/70">
                        {shopConfig.showOriginRegionTag !== false && (
                          <span className="flex items-center gap-1 text-gold-700 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                            <span>{product.originRegionAr}</span>
                          </span>
                        )}
                        {shopConfig.showRatingStars !== false && (
                          <div className="flex items-center gap-1 mr-auto">
                            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                            <span className="font-bold text-zaad-900">{product.rating}</span>
                            <span className="text-[10px]">({product.reviewCount})</span>
                          </div>
                        )}
                      </div>

                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif text-lg font-bold text-zaad-900 group-hover:text-gold-700 transition-colors line-clamp-1">
                          {product.nameAr}
                        </h3>
                      </Link>

                      <p className="text-xs text-charcoal-700/80 line-clamp-2 leading-relaxed font-light">
                        {product.taglineAr || product.shortDescAr}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold text-zaad-900">
                          {formatPrice(product.price)}
                        </div>
                        {product.compareAtPrice && (
                          <div className="text-[11px] text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => addItem(product, 1)}
                        className="bg-zaad-800 hover:bg-zaad-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:shadow-gold-glow transition-all flex items-center gap-1.5 gold-shimmer-btn"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
                        <span>{shopConfig.addToCartButtonTextAr || 'اقتناء'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Promotional / Assurance Banner */}
        {shopConfig.promoBanner?.isEnabled !== false && (
          <div
            style={{
              backgroundColor: shopConfig.promoBanner?.backgroundColor || '#07160c',
              color: shopConfig.promoBanner?.textColor || '#fbf8f1'
            }}
            className="mt-16 rounded-3xl p-8 sm:p-12 border-2 border-gold-500/30 relative overflow-hidden shadow-xl text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-8"
          >
            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="relative z-10 max-w-2xl space-y-3">
              {shopConfig.promoBanner?.badgeAr && (
                <span className="inline-block text-xs font-bold text-gold-400 border border-gold-500/30 bg-zaad-900/80 px-3 py-1 rounded-full">
                  {shopConfig.promoBanner.badgeAr}
                </span>
              )}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-50">
                {shopConfig.promoBanner?.titleAr}
              </h3>
              <p className="text-xs sm:text-sm text-ivory-300/80 font-light leading-relaxed">
                {shopConfig.promoBanner?.descriptionAr}
              </p>
            </div>

            {shopConfig.promoBanner?.buttonTextAr && (
              <div className="relative z-10 shrink-0">
                <Link
                  href={shopConfig.promoBanner?.buttonLink || '/#quiz'}
                  className="bg-gold-500 hover:bg-gold-400 text-zaad-950 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>{shopConfig.promoBanner.buttonTextAr}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
