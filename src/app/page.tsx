import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import BrandStoryScroll from '@/components/home/BrandStoryScroll';
import FeaturedCollection from '@/components/home/FeaturedCollection';
import SocialProofReviews from '@/components/home/SocialProofReviews';
import { getLiveProducts } from '@/lib/services/productService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const products = await getLiveProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Brand Story & Heritage (Managed via CMS) */}
      <BrandStoryScroll />

      {/* 3. Featured Luxury Products (Live from Supabase) */}
      <FeaturedCollection products={products} />

      {/* 4. VIP Social Proof Reviews */}
      <SocialProofReviews />
    </div>
  );
}
