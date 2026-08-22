import { NextResponse } from 'next/server';
import { supabaseAdmin, getSanitizedSupabaseUrl, getSupabaseServiceRoleKey } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        batches:product_batches(*)
      `);

    if (slug) {
      query = query.eq('slug', slug);
      const { data, error } = await query.single();
      if (error || !data) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: formatProductRow(data), source: 'supabase' });
    }

    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error in /api/products:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        hint: error.hint,
        details: error.details
      }, { status: 500 });
    }

    const formattedList = (data || []).map(formatProductRow);
    return NextResponse.json({ success: true, data: formattedList, source: 'supabase' });
  } catch (error: any) {
    const activeUrl = getSanitizedSupabaseUrl();
    const hasKey = Boolean(getSupabaseServiceRoleKey());

    console.error('Exception in /api/products:', {
      message: error?.message,
      stack: error?.stack,
      supabaseUrl: activeUrl ? `${activeUrl.slice(0, 20)}...` : 'MISSING',
      hasKey
    });

    return NextResponse.json({
      success: false,
      error: error?.message || 'Internal server error',
      diagnostics: {
        supabaseConfigured: Boolean(activeUrl && hasKey),
        urlDetected: Boolean(activeUrl)
      }
    }, { status: 500 });
  }
}

function formatProductRow(data: any) {
  return {
    id: data.id,
    slug: data.slug,
    sku: data.sku,
    nameAr: data.name_ar,
    nameEn: data.name_en,
    taglineAr: data.tagline_ar,
    categoryId: data.category_id,
    categoryNameAr: data.category?.name_ar || '',
    price: Number(data.price),
    compareAtPrice: data.compare_at_price ? Number(data.compare_at_price) : undefined,
    currency: data.currency,
    stockQuantity: data.stock_quantity,
    reservedStock: data.reserved_stock,
    lowStockThreshold: data.low_stock_threshold,
    weightGrams: data.weight_grams,
    originRegionAr: data.origin_region_ar,
    originRegionEn: data.origin_region_en,
    floralSourceAr: data.floral_source_ar,
    floralSourceEn: data.floral_source_en,
    shortDescAr: data.short_desc_ar,
    fullStoryAr: data.full_story_ar,
    healthBenefitsAr: data.health_benefits_ar || [],
    pairingSuggestionsAr: data.pairing_suggestions_ar || [],
    storageInstructionsAr: data.storage_instructions_ar,
    images: data.images || ['/images/zaad-logo.png'],
    isFeatured: data.is_featured,
    isAvailable: data.is_available,
    rating: Number(data.rating),
    reviewCount: data.review_count,
    sensoryProfile: data.sensory_profile,
    badge: data.badge,
    latestLabBatch: data.batches?.[0] ? {
      batchNumber: data.batches[0].batch_number,
      harvestSeason: data.batches[0].harvest_season,
      harvestDate: data.batches[0].harvest_date,
      testedDate: data.batches[0].tested_date,
      labName: data.batches[0].lab_name,
      moisturePercentage: Number(data.batches[0].moisture_percentage),
      hmfLevel: Number(data.batches[0].hmf_level),
      diastaseActivity: Number(data.batches[0].diastase_activity),
      sucrosePercentage: Number(data.batches[0].sucrose_percentage),
      pollenPurityPercentage: Number(data.batches[0].pollen_purity_percentage),
      certificatePdfUrl: data.batches[0].certificate_pdf_url,
      labSealImageUrl: data.batches[0].lab_seal_image_url
    } : null
  };
}
