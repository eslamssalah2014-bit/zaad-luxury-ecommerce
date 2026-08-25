import React from 'react';
import { getCmsSettings, DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { getLiveProducts, getLiveCategories } from '@/lib/services/productService';
import ShopClient from '@/components/shop/ShopClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  const [cmsSettings, products, categories] = await Promise.all([
    getCmsSettings(false),
    getLiveProducts(),
    getLiveCategories()
  ]);

  const shopConfig = cmsSettings.shopPage || DEFAULT_CMS_SETTINGS.shopPage;

  return (
    <ShopClient
      initialShopConfig={shopConfig}
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
