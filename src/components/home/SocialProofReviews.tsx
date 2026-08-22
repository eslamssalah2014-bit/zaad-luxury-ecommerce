'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Review } from '@/types';

export default function SocialProofReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            product:products(name_ar)
          `)
          .eq('status', 'approved')
          .limit(3);

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: Review[] = data.map((r: any) => ({
            id: String(r.id ?? ''),
            productId: String(r.product_id ?? ''),
            productNameAr: String(r.product?.name_ar || 'عسل زاد الملكي'),
            customerName: String(r.customer_name ?? 'مقتني موثق'),
            customerAvatar: r.customer_avatar ? String(r.customer_avatar) : undefined,
            rating: Number(r.rating ?? 5),
            titleAr: String(r.title_ar ?? 'أصداء الثقة'),
            commentAr: String(r.comment_ar ?? ''),
            isVerifiedPurchase: Boolean(r.is_verified_purchase),
            helpfulCount: Number(r.helpful_count ?? 0),
            createdAt: String(r.created_at ?? new Date().toISOString())
          }));
          setReviews(mapped);
        }
      } catch (err) {
        console.warn('Error fetching live reviews:', err);
      }
    }
    loadReviews();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-24 bg-ivory-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold-600 tracking-widest uppercase mb-2 block">
            شهادات النخبة وكبار المقتنين
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zaad-900">
            أصداء الثقة في رحاب زاد
          </h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto my-4"></div>
          <p className="text-xs sm:text-sm text-charcoal-700/80 font-light">
            تجارب حقيقية موثقة من عملاء انتقوا التميز واعتمدوا نقاء زاد جزءاً من أسلوب حياتهم.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-2xl border border-ivory-300 shadow-sm luxury-card-hover flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-gold-400/20 absolute top-6 left-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-base font-bold text-zaad-900">
                  {review.titleAr}
                </h3>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-charcoal-700/90 leading-relaxed font-light">
                  &ldquo;{review.commentAr}&rdquo;
                </p>
              </div>

              {/* Author & Verified Badge */}
              <div className="pt-6 mt-6 border-t border-ivory-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zaad-900">{review.customerName}</h4>
                  <p className="text-[10px] text-charcoal-500 mt-0.5">{review.productNameAr}</p>
                </div>

                <div className="flex items-center gap-1 text-gold-700 text-[10px] font-semibold bg-gold-50 px-2 py-1 rounded-full border border-gold-200/60">
                  <ShieldCheck className="w-3 h-3 text-gold-600" />
                  <span>مشتري موثق</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
