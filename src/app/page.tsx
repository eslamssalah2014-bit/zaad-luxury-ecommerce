import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import BrandStoryScroll from '@/components/home/BrandStoryScroll';
import FeaturedCollection from '@/components/home/FeaturedCollection';
import SocialProofReviews from '@/components/home/SocialProofReviews';
import { getLiveProducts } from '@/lib/services/productService';
import { getCmsSettings } from '@/lib/services/cmsService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [products, cmsSettings] = await Promise.all([
    getLiveProducts(),
    getCmsSettings(false)
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Hero (Server-Hydrated CMS) */}
      <HeroSection initialHero={cmsSettings.hero} />

      {/* 2. Brand Story & Heritage (Server-Hydrated CMS) */}
      <BrandStoryScroll initialSections={cmsSettings.homepageSections} />

      {/* 3. Featured Luxury Products (Live from Supabase) */}
      <FeaturedCollection products={products} />

      {/* 4. VIP Social Proof Reviews (Server-Hydrated CMS) */}
      <SocialProofReviews initialConfig={cmsSettings.testimonials} />
    </div>
  );
}
