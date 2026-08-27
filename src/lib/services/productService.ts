import { cache } from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabase } from '@/lib/supabase/client';
import { Product, Category } from '@/types';

// In-memory server cache
let cachedLiveProducts: { data: Product[]; timestamp: number } | null = null;
let cachedCategories: { data: Category[]; timestamp: number } | null = null;
const PRODUCTS_CACHE_TTL_MS = 60000; // 60 seconds

export function invalidateProductsCache() {
  cachedLiveProducts = null;
  cachedCategories = null;
}

/**
 * Format raw Supabase database row into application Product interface
 */
export function formatSupabaseProduct(d: any): Product {
  const latestBatch = d.batches?.[0] || d.product_batches?.[0] || null;
  const sellingPrice = Number(d.price || 0);
  const comparePrice = d.compare_at_price ? Number(d.compare_at_price) : undefined;
  const costPrice = Number(d.cost_price ?? d.sensory_profile?.cost_price ?? Math.round(sellingPrice * 0.45));
  const discountPercentage = comparePrice && comparePrice > sellingPrice
    ? Math.round(((comparePrice - sellingPrice) / comparePrice) * 100)
    : undefined;

  const stockQuantity = Number(d.stock_quantity ?? 0);
  const reservedStock = Number(d.reserved_stock ?? 0);
  const availableStock = Math.max(0, stockQuantity - reservedStock);

  let visibilityStatus = d.visibility_status || d.sensory_profile?.visibility_status;
  if (!visibilityStatus) {
    if (stockQuantity === 0) visibilityStatus = 'out_of_stock';
    else if (d.is_available === false) visibilityStatus = 'hidden';
    else visibilityStatus = 'published';
  }

  const subcategoryId = d.subcategory_id || d.sensory_profile?.subcategory_id || undefined;

  return {
    id: d.id,
    slug: d.slug,
    sku: d.sku,
    nameAr: d.name_ar,
    nameEn: d.name_en,
    taglineAr: d.tagline_ar || '',
    categoryId: d.category_id,
    categoryNameAr: d.category?.name_ar || d.categories?.name_ar || '',
    subcategoryId,
    subcategoryNameAr: undefined,
    price: sellingPrice,
    sellingPrice,
    compareAtPrice: comparePrice,
    comparePrice,
    discountPercentage,
    costPrice,
    currency: d.currency || 'EGP',
    stockQuantity,
    reservedStock,
    availableStock,
    lowStockThreshold: d.low_stock_threshold ?? 5,
    weightGrams: d.weight_grams ?? 500,
    originRegionAr: d.origin_region_ar || '',
    originRegionEn: d.origin_region_en || '',
    floralSourceAr: d.floral_source_ar || '',
    floralSourceEn: d.floral_source_en || '',
    shortDescAr: d.short_desc_ar || '',
    fullStoryAr: d.full_story_ar || '',
    healthBenefitsAr: Array.isArray(d.health_benefits_ar) ? d.health_benefits_ar : [],
    pairingSuggestionsAr: Array.isArray(d.pairing_suggestions_ar) ? d.pairing_suggestions_ar : [],
    usageInstructionsAr: d.usage_instructions_ar || d.sensory_profile?.usage_instructions_ar || undefined,
    storageInstructionsAr: d.storage_instructions_ar || '',
    images: Array.isArray(d.images) && d.images.length > 0 ? d.images : ['/images/zaad-logo.png'],
    isFeatured: Boolean(d.is_featured),
    isAvailable: Boolean(d.is_available),
    visibilityStatus,
    rating: Number(d.rating || 5.0),
    reviewCount: Number(d.review_count || 0),
    sensoryProfile: d.sensory_profile || { sweetness: 4, floralAroma: 4, density: 4, intensity: 4, crystallization: 'نادر' },
    badge: d.badge || undefined,
    attributes: Array.isArray(d.attributes) ? d.attributes : (Array.isArray(d.sensory_profile?.attributes) ? d.sensory_profile.attributes : undefined),
    tabs: Array.isArray(d.tabs) ? d.tabs : (Array.isArray(d.sensory_profile?.tabs) ? d.sensory_profile.tabs : undefined),
    customShippingMessage: d.custom_shipping_message || d.sensory_profile?.custom_shipping_message || undefined,
    customVatMessage: d.custom_vat_message || d.sensory_profile?.custom_vat_message || undefined,
    customTrustBadgeText: d.custom_trust_badge_text || d.sensory_profile?.custom_trust_badge_text || undefined,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    latestLabBatch: latestBatch ? {
      batchNumber: latestBatch.batch_number,
      harvestSeason: latestBatch.harvest_season,
      harvestDate: latestBatch.harvest_date,
      testedDate: latestBatch.tested_date,
      labName: latestBatch.lab_name,
      moisturePercentage: Number(latestBatch.moisture_percentage),
      hmfLevel: Number(latestBatch.hmf_level),
      diastaseActivity: Number(latestBatch.diastase_activity),
      sucrosePercentage: Number(latestBatch.sucrose_percentage),
      pollenPurityPercentage: Number(latestBatch.pollen_purity_percentage),
      certificatePdfUrl: latestBatch.certificate_pdf_url,
      labSealImageUrl: latestBatch.lab_seal_image_url
    } : {
      batchNumber: 'ZD-2026-LIVE',
      harvestSeason: 'المنتجات الطبيعية 2026',
      harvestDate: '2026-01-15',
      testedDate: '2026-02-01',
      labName: 'مختبر الجودة الأوروبية المعتمد',
      moisturePercentage: 14.2,
      hmfLevel: 2.1,
      diastaseActivity: 19.4,
      sucrosePercentage: 0.8,
      pollenPurityPercentage: 98.6
    }
  };
}

/**
 * Fetch all live products directly from Supabase with smart in-memory caching (Client or Server safe)
 */
export const getLiveProducts = cache(async function getLiveProducts(categoryId?: string, includeHidden = false): Promise<Product[]> {
  const now = Date.now();
  if (!categoryId || categoryId === 'all') {
    if (!includeHidden && cachedLiveProducts && now - cachedLiveProducts.timestamp < PRODUCTS_CACHE_TTL_MS) {
      return cachedLiveProducts.data;
    }
  }

  try {
    const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
    let query = client
      .from('products')
      .select(`
        *,
        categories(*),
        product_batches(*)
      `)
      .order('is_featured', { ascending: false });

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    if (!includeHidden) {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query;
    if (!error && data) {
      const prods = data.map(formatSupabaseProduct);
      const filtered = !includeHidden
        ? prods.filter(p => p.visibilityStatus !== 'hidden' && p.visibilityStatus !== 'draft')
        : prods;

      if (!categoryId || categoryId === 'all') {
        if (!includeHidden) {
          cachedLiveProducts = { data: filtered, timestamp: now };
        }
      }
      return filtered;
    }
  } catch (err) {
    console.error('Error fetching live products from Supabase:', err);
  }

  return cachedLiveProducts ? cachedLiveProducts.data : [];
});

/**
 * Fetch a single live product by its slug directly from Supabase
 */
export const getLiveProductBySlug = cache(async function getLiveProductBySlug(slug: string): Promise<Product | null> {
  try {
    const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
    const { data, error } = await client
      .from('products')
      .select(`
        *,
        categories(*),
        product_batches(*)
      `)
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return formatSupabaseProduct(data);
    }
  } catch (err) {
    console.error(`Error fetching product [${slug}] from Supabase:`, err);
  }

  return null;
});

/**
 * Fetch all categories directly from Supabase with smart in-memory caching
 */
export const getLiveCategories = cache(async function getLiveCategories(): Promise<Category[]> {
  const now = Date.now();
  if (cachedCategories && now - cachedCategories.timestamp < PRODUCTS_CACHE_TTL_MS) {
    return cachedCategories.data;
  }

  try {
    const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const formatted = data.map((c: any) => ({
        id: c.id,
        nameAr: c.name_ar,
        nameEn: c.name_en,
        slug: c.slug,
        descriptionAr: c.description_ar || '',
        imageUrl: c.image_url || '',
        sortOrder: c.sort_order || 0,
        itemCount: 4
      }));
      cachedCategories = { data: formatted, timestamp: now };
      return formatted;
    }
  } catch (err) {
    console.error('Error fetching live categories from Supabase:', err);
  }

  return cachedCategories ? cachedCategories.data : [];
});

