'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Heart, ShoppingBag, Star, ShieldCheck, Eye, Sparkles, RotateCcw } from 'lucide-react';
import { getLiveProducts, getLiveCategories } from '@/lib/services/productService';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedTexture, setSelectedTexture] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Load live Supabase data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [liveProds, liveCats] = await Promise.all([
          getLiveProducts(),
          getLiveCategories()
        ]);
        if (isMounted) {
          setProducts(liveProds);
          setCategories(liveCats);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error loading live shop products:', e);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }
      // Origin filter
      if (selectedOrigin !== 'all' && !product.originRegionAr?.includes(selectedOrigin)) {
        return false;
      }
      // Texture filter
      if (selectedTexture !== 'all' && !product.sensoryProfile?.crystallization?.includes(selectedTexture)) {
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
  }, [products, selectedCategory, selectedOrigin, selectedTexture, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedOrigin('all');
    setSelectedTexture('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-3.5 py-1 rounded-full text-gold-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المجموعة الملكية المباشرة</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-zaad-900 leading-tight">
            مقتنيات زاد من أندر خيرات الطبيعة
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto my-4"></div>
          <p className="text-xs sm:text-sm text-charcoal-700/80 font-light leading-relaxed">
            استكشف خيارات الأعسال الملكية المحصودة يدوياً والموثقة بشهادات فحص مخبرية دولية مستقلة.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="بحث باسم الصنف أو رقم التشغيلة..."
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
              <option value="all">كافة الفئات الملكية</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
            </select>

            {/* Origin Region Filter */}
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="text-xs bg-ivory-50 border border-ivory-300 rounded-lg px-3 py-2.5 focus:border-gold-500 focus:outline-none text-zaad-900 font-medium"
            >
              <option value="all">كافة مناطق ومناشئ القطاف</option>
              <option value="دوعن">وادي دوعن (حضرموت)</option>
              <option value="عسير">جبال عسير والجنوب</option>
              <option value="تيان">جبال تيان شان (آسيا الوسطى)</option>
              <option value="مصر">صعيد مصر العضوي</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-ivory-50 border border-ivory-300 rounded-lg px-3 py-2.5 focus:border-gold-500 focus:outline-none text-zaad-900 font-medium"
            >
              <option value="featured">ترتيب: الإصدارات المميزة</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>

          </div>

          {/* Active Filter Chips & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-ivory-200 text-xs">
            <span className="text-charcoal-700 font-medium">
              النتائج المتاحة: <strong className="text-zaad-900">{filteredProducts.length}</strong> منتج ملكي
            </span>

            {(selectedCategory !== 'all' || selectedOrigin !== 'all' || selectedTexture !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-gold-700 hover:text-gold-900 flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تعيين المرشحات</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-zaad-800 font-serif">جاري تحميل المحصول الملكي المباشر...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-ivory-300 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-100 mx-auto flex items-center justify-center text-zaad-800">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base font-bold text-zaad-900">لم يتم العثور على مقتنيات مطابقة</h3>
            <p className="text-xs text-charcoal-700/70 max-w-sm mx-auto">
              جرب تغيير معايير البحث أو اختيار فئة أخرى لاستعراض محاصيل زاد.
            </p>
            <button
              onClick={resetFilters}
              className="inline-block bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-sm"
            >
              استعراض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                      {product.badge && (
                        <span className="bg-zaad-900/90 backdrop-blur-md text-gold-300 text-[11px] font-bold px-3 py-1 rounded-full border border-gold-400/40">
                          {product.badge}
                        </span>
                      )}
                      {product.latestLabBatch?.batchNumber && (
                        <span className="bg-white/90 backdrop-blur-md text-zaad-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-ivory-300">
                          تشغيلة: {product.latestLabBatch.batchNumber}
                        </span>
                      )}
                    </div>

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
                        <span>تفاصيل المحصول والفحص</span>
                      </Link>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-charcoal-700/70">
                        <span className="flex items-center gap-1 text-gold-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                          <span>{product.originRegionAr}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                          <span className="font-bold text-zaad-900">{product.rating}</span>
                          <span className="text-[10px]">({product.reviewCount})</span>
                        </div>
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
                        <span>اقتناء</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
