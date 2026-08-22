import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabaseServiceRoleKey } from '@/lib/supabase/admin';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CMS,
  INITIAL_REVIEWS
} from '@/lib/data/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isAuthorized(request: NextRequest): boolean {
  const secretKey = getSupabaseServiceRoleKey();
  const authHeader = request.headers.get('x-admin-key') || request.headers.get('authorization');
  if (authHeader && (authHeader === secretKey || authHeader === `Bearer ${secretKey}`)) {
    return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden. Admin authorization required to seed database.' },
      { status: 403 }
    );
  }
  return handleSeed();
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden. Admin authorization required to seed database.' },
      { status: 403 }
    );
  }
  return handleSeed();
}

async function handleSeed() {
  try {
    const results: Record<string, string> = {};

    // 1. Seed Categories
    const categoriesPayload = INITIAL_CATEGORIES.map(c => ({
      name_ar: c.nameAr,
      name_en: c.nameEn,
      slug: c.slug,
      description_ar: c.descriptionAr,
      image_url: c.imageUrl,
      sort_order: c.sortOrder,
      is_active: true
    }));

    const { data: catData, error: catError } = await supabaseAdmin
      .from('categories')
      .upsert(categoriesPayload, { onConflict: 'slug' })
      .select();

    if (catError) {
      results['categories'] = `Error: ${catError.message}`;
    } else {
      results['categories'] = `Success: Upserted ${catData?.length} categories`;
    }

    // 2. Seed Products
    const productsPayload = INITIAL_PRODUCTS.map(p => ({
      slug: p.slug,
      sku: p.sku,
      name_ar: p.nameAr,
      name_en: p.nameEn,
      tagline_ar: p.taglineAr,
      price: p.price,
      compare_at_price: p.compareAtPrice || null,
      currency: p.currency,
      stock_quantity: p.stockQuantity,
      reserved_stock: p.reservedStock,
      low_stock_threshold: p.lowStockThreshold,
      weight_grams: p.weightGrams,
      origin_region_ar: p.originRegionAr,
      origin_region_en: p.originRegionEn,
      floral_source_ar: p.floralSourceAr,
      floral_source_en: p.floralSourceEn,
      short_desc_ar: p.shortDescAr,
      full_story_ar: p.fullStoryAr,
      health_benefits_ar: p.healthBenefitsAr,
      pairing_suggestions_ar: p.pairingSuggestionsAr,
      storage_instructions_ar: p.storageInstructionsAr,
      images: p.images,
      is_featured: p.isFeatured,
      is_available: p.isAvailable,
      rating: p.rating,
      review_count: p.reviewCount,
      sensory_profile: p.sensoryProfile,
      badge: p.badge || null
    }));

    const { data: prodData, error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(productsPayload, { onConflict: 'slug' })
      .select();

    if (prodError) {
      results['products'] = `Error: ${prodError.message}`;
    } else {
      results['products'] = `Success: Upserted ${prodData?.length} products`;
    }

    // 3. Seed CMS Sections
    const cmsPayload = INITIAL_CMS.map(c => ({
      key: c.key,
      title_ar: c.titleAr,
      subtitle_ar: c.subtitleAr,
      headline_ar: c.headlineAr,
      body_ar: c.bodyAr,
      image_url: c.imageUrl,
      is_active: c.isActive
    }));

    const { data: cmsData, error: cmsError } = await supabaseAdmin
      .from('cms_blocks')
      .upsert(cmsPayload, { onConflict: 'key' })
      .select();

    if (cmsError) {
      results['cms'] = `Error: ${cmsError.message}`;
    } else {
      results['cms'] = `Success: Upserted ${cmsData?.length} CMS blocks`;
    }

    // 4. Seed Reviews
    const reviewsPayload = INITIAL_REVIEWS.map(r => ({
      customer_name: r.customerName || 'مقتني ملكي معتمد',
      rating: r.rating || 5,
      title_ar: r.titleAr || 'جودة ملكية لا تضاهى',
      comment_ar: r.commentAr,
      is_verified_purchase: r.isVerifiedPurchase ?? true,
      product_name_ar: r.productNameAr || 'عسل السدر الدوعني الملكي',
      status: 'approved'
    }));

    const { data: revData, error: revError } = await supabaseAdmin
      .from('reviews')
      .insert(reviewsPayload)
      .select();

    if (revError) {
      results['reviews'] = `Error: ${revError.message}`;
    } else {
      results['reviews'] = `Success: Inserted ${revData?.length} reviews`;
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
