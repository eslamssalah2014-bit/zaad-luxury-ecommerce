'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, ArrowLeft, Star, ShieldCheck, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

interface FeaturedCollectionProps {
  products: Product[];
}

export default function FeaturedCollection({ products }: FeaturedCollectionProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', nameAr: 'المحصول بالكامل' },
    { id: 'cat-1', nameAr: 'أعسال السدر النادرة' },
    { id: 'cat-2', nameAr: 'أعسال الجبال والبراري' },
    { id: 'cat-3', nameAr: 'الصناديق الملكية' },
    { id: 'cat-4', nameAr: 'منتجات الخلية الفاخرة' },
  ];

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <section className="py-24 bg-ivory-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
              الإصدارات الاستثنائية
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zaad-900">
              المحصول الملكي المنتقى
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold text-zaad-800 hover:text-gold-600 transition-colors group"
          >
            <span>استعراض كافة المقتنيات ({products.length})</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-zaad-800 text-white shadow-md'
                  : 'bg-white text-charcoal-800 border border-ivory-300 hover:border-gold-400'
              }`}
            >
              {cat.nameAr}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => {
            const isWish = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm luxury-card-hover group flex flex-col"
              >
                {/* Image & Badges Container */}
                <div className="relative h-72 bg-ivory-200/50 overflow-hidden">
                  <Image
                    src={product.images[0]}
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
                    <span className="bg-white/90 backdrop-blur-md text-zaad-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-ivory-300">
                      تشغيلة: {product.latestLabBatch.batchNumber}
                    </span>
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

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-zaad-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      href={`/product/${product.slug}`}
                      className="bg-white text-zaad-900 p-2.5 rounded-full shadow-lg hover:bg-gold-50 transition-colors"
                      title="معاينة التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Origin & Rating */}
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

                    {/* Title */}
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-zaad-900 group-hover:text-gold-700 transition-colors line-clamp-1">
                        {product.nameAr}
                      </h3>
                    </Link>

                    {/* Tagline */}
                    <p className="text-xs text-charcoal-700/80 line-clamp-2 leading-relaxed font-light">
                      {product.taglineAr}
                    </p>
                  </div>

                  {/* Price & Add to Bag */}
                  <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-zaad-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.compareAtPrice && (
                        <div className="text-[11px] text-gray-600 line-through">
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

      </div>
    </section>
  );
}
