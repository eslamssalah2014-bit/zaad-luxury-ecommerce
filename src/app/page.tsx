import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import BrandStoryScroll from '@/components/home/BrandStoryScroll';
import WhyZaadComparison from '@/components/home/WhyZaadComparison';
import FeaturedCollection from '@/components/home/FeaturedCollection';
import HoneyFinderQuiz from '@/components/home/HoneyFinderQuiz';
import SocialProofReviews from '@/components/home/SocialProofReviews';
import VipNewsletter from '@/components/home/VipNewsletter';
import { getLiveProducts } from '@/lib/services/productService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const products = await getLiveProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Brand Story & Heritage */}
      <BrandStoryScroll />

      {/* 3. Featured Luxury Products (Live from Supabase) */}
      <FeaturedCollection products={products} />

      {/* 4. Why ZAAD Laboratory Comparison */}
      <WhyZaadComparison />

      {/* 5. Interactive Honey Finder Sensory Quiz (Live Products) */}
      <HoneyFinderQuiz products={products} />

      {/* 6. VIP Social Proof Reviews */}
      <SocialProofReviews />

      {/* 7. VIP Newsletter Invitation */}
      <VipNewsletter />
    </div>
  );
}
