import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSanitizedSupabaseUrl, getSupabaseServiceRoleKey } from '@/lib/supabase/admin';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const isAdmin = searchParams.get('admin') === 'true';
    const visibility = searchParams.get('visibility');

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        batches:product_batches(*)
      `)
      .order('is_featured', { ascending: false });

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

    if (visibility && visibility !== 'all') {
      query = query.eq('visibility_status', visibility);
    }

    // Public storefront safety filter: Hide drafts and hidden items from public
    if (!isAdmin && !visibility) {
      query = query.eq('is_available', true);
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

    let formattedList = (data || []).map(formatProductRow);

    // If public storefront, filter out hidden and draft items
    if (!isAdmin) {
      formattedList = formattedList.filter(p => p.visibilityStatus !== 'hidden' && p.visibilityStatus !== 'draft');
    }

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
      error: error?.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nameAr,
      nameEn,
      slug,
      sku,
      taglineAr,
      categoryId,
      subcategoryId,
      price,
      compareAtPrice,
      costPrice,
      currency = 'SAR',
      stockQuantity = 0,
      lowStockThreshold = 5,
      weightGrams = 500,
      originRegionAr,
      originRegionEn,
      floralSourceAr,
      floralSourceEn,
      shortDescAr,
      fullStoryAr,
      healthBenefitsAr = [],
      pairingSuggestionsAr = [],
      storageInstructionsAr,
      images = ['/images/zaad-logo.png'],
      isFeatured = false,
      isAvailable = true,
      visibilityStatus = 'published',
      badge,
      latestLabBatch
    } = body;

    if (!nameAr || !price || !shortDescAr) {
      return NextResponse.json({ success: false, error: 'الاسم والسعر والوصف القصير حقول مطلوبة' }, { status: 400 });
    }

    const calculatedCost = Number(costPrice || Math.round(Number(price) * 0.45));
    const generatedSlug = (slug || nameEn || nameAr).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '');
    const generatedSku = (sku || `ZD-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();

    const productPayload: any = {
      name_ar: nameAr,
      name_en: nameEn || nameAr,
      slug: generatedSlug,
      sku: generatedSku,
      tagline_ar: taglineAr || null,
      category_id: categoryId || null,
      price: Number(price),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      currency,
      stock_quantity: Number(stockQuantity),
      reserved_stock: 0,
      low_stock_threshold: Number(lowStockThreshold),
      weight_grams: Number(weightGrams),
      origin_region_ar: originRegionAr || 'حضرموت - وادي دوعن',
      origin_region_en: originRegionEn || 'Hadramout - Doan Valley',
      floral_source_ar: floralSourceAr || 'أزهار أشجار السدر البرية',
      floral_source_en: floralSourceEn || 'Wild Sidr Tree Nectar',
      short_desc_ar: shortDescAr,
      full_story_ar: fullStoryAr || shortDescAr,
      health_benefits_ar: healthBenefitsAr,
      pairingSuggestionsAr: pairingSuggestionsAr,
      storage_instructions_ar: storageInstructionsAr || 'يحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة',
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/zaad-logo.png'],
      is_featured: Boolean(isFeatured),
      is_available: visibilityStatus === 'published' ? true : Boolean(isAvailable),
      rating: 5.0,
      review_count: 0,
      sensory_profile: {
        sweetness: 4,
        floralAroma: 4,
        density: 4,
        intensity: 4,
        crystallization: 'نادر',
        cost_price: calculatedCost,
        visibility_status: visibilityStatus,
        subcategory_id: subcategoryId || null
      },
      badge: badge || null
    };

    const { data: newProd, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(productPayload)
      .select()
      .single();

    if (insertError || !newProd) {
      console.error('Error inserting product in Supabase:', insertError);
      return NextResponse.json({ success: false, error: insertError?.message || 'فشل إنشاء المنتج' }, { status: 500 });
    }

    // Insert Initial Lab Batch if provided
    if (latestLabBatch) {
      await supabaseAdmin.from('product_batches').insert({
        product_id: newProd.id,
        batch_number: latestLabBatch.batchNumber || `ZD-${new Date().getFullYear()}-${generatedSku}`,
        harvest_season: latestLabBatch.harvestSeason || `المحصول الملكي ${new Date().getFullYear()}`,
        harvest_date: latestLabBatch.harvestDate || '2026-01-15',
        tested_date: latestLabBatch.testedDate || new Date().toISOString().split('T')[0],
        lab_name: latestLabBatch.labName || 'مختبر الجودة الأوروبية المعتمد',
        moisture_percentage: Number(latestLabBatch.moisturePercentage || 14.2),
        hmf_level: Number(latestLabBatch.hmfLevel || 2.1),
        diastase_activity: Number(latestLabBatch.diastaseActivity || 19.4),
        sucrose_percentage: Number(latestLabBatch.sucrosePercentage || 0.8),
        pollen_purity_percentage: Number(latestLabBatch.pollenPurityPercentage || 98.6),
        initial_jars_count: Number(stockQuantity),
        remaining_jars_count: Number(stockQuantity),
        is_active_batch: true
      });
    }

    // Record initial stock creation in inventory_movements
    if (Number(stockQuantity) > 0) {
      await supabaseAdmin.from('inventory_movements').insert({
        product_id: newProd.id,
        movement_type: 'restock_batch',
        quantity_changed: Number(stockQuantity),
        quantity_after: Number(stockQuantity),
        reference_id: generatedSku,
        reason: 'إيداع المخزون الافتتاحي للمنتج الجديد'
      });
    }

    return NextResponse.json({ success: true, data: formatProductRow(newProd) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      nameAr,
      nameEn,
      slug,
      sku,
      taglineAr,
      categoryId,
      subcategoryId,
      price,
      compareAtPrice,
      costPrice,
      currency = 'SAR',
      stockQuantity,
      lowStockThreshold,
      weightGrams,
      originRegionAr,
      originRegionEn,
      floralSourceAr,
      floralSourceEn,
      shortDescAr,
      fullStoryAr,
      healthBenefitsAr,
      pairingSuggestionsAr,
      storageInstructionsAr,
      images,
      isFeatured,
      isAvailable,
      visibilityStatus,
      badge,
      latestLabBatch
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف المنتج مطلوب' }, { status: 400 });
    }

    const calculatedCost = Number(costPrice || Math.round(Number(price) * 0.45));

    const updatePayload: any = {
      name_ar: nameAr,
      name_en: nameEn,
      slug: slug?.toLowerCase().trim().replace(/\s+/g, '-'),
      sku: sku?.toUpperCase(),
      tagline_ar: taglineAr,
      category_id: categoryId || null,
      price: Number(price),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      currency,
      stock_quantity: Number(stockQuantity),
      low_stock_threshold: Number(lowStockThreshold),
      weight_grams: Number(weightGrams),
      origin_region_ar: originRegionAr,
      origin_region_en: originRegionEn,
      floral_source_ar: floralSourceAr,
      floral_source_en: floralSourceEn,
      short_desc_ar: shortDescAr,
      full_story_ar: fullStoryAr,
      health_benefits_ar: healthBenefitsAr || [],
      pairing_suggestions_ar: pairingSuggestionsAr || [],
      storage_instructions_ar: storageInstructionsAr,
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/zaad-logo.png'],
      is_featured: Boolean(isFeatured),
      is_available: visibilityStatus === 'published' ? true : (visibilityStatus === 'out_of_stock' ? true : Boolean(isAvailable)),
      badge: badge || null,
      sensory_profile: {
        sweetness: 4,
        floralAroma: 4,
        density: 4,
        intensity: 4,
        crystallization: 'نادر',
        cost_price: calculatedCost,
        visibility_status: visibilityStatus || 'published',
        subcategory_id: subcategoryId || null
      },
      updated_at: new Date().toISOString()
    };

    const { data: updatedProd, error: updateError } = await supabaseAdmin
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedProd) {
      return NextResponse.json({ success: false, error: updateError?.message || 'فشل تحديث المنتج' }, { status: 500 });
    }

    // Update Lab Batch if provided
    if (latestLabBatch && latestLabBatch.batchNumber) {
      await supabaseAdmin.from('product_batches').upsert({
        product_id: id,
        batch_number: latestLabBatch.batchNumber,
        harvest_season: latestLabBatch.harvestSeason || 'المحصول الملكي 2026',
        harvest_date: latestLabBatch.harvestDate || '2026-01-15',
        tested_date: latestLabBatch.testedDate || new Date().toISOString().split('T')[0],
        lab_name: latestLabBatch.labName || 'مختبر الجودة الأوروبية المعتمد',
        moisture_percentage: Number(latestLabBatch.moisturePercentage || 14.2),
        hmf_level: Number(latestLabBatch.hmfLevel || 2.1),
        diastase_activity: Number(latestLabBatch.diastaseActivity || 19.4),
        sucrose_percentage: Number(latestLabBatch.sucrosePercentage || 0.8),
        pollen_purity_percentage: Number(latestLabBatch.pollenPurityPercentage || 98.6),
        initial_jars_count: Number(stockQuantity),
        remaining_jars_count: Number(stockQuantity),
        is_active_batch: true
      }, { onConflict: 'batch_number' });
    }

    return NextResponse.json({ success: true, data: formatProductRow(updatedProd) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف المنتج مطلوب للحذف' }, { status: 400 });
    }

    // Delete batches first (cascade safety)
    await supabaseAdmin.from('product_batches').delete().eq('product_id', id);
    await supabaseAdmin.from('inventory_movements').delete().eq('product_id', id);
    
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح من قاعدة البيانات' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export function formatProductRow(data: any): Product {
  const sellingPrice = Number(data.price || 0);
  const comparePrice = data.compare_at_price ? Number(data.compare_at_price) : undefined;
  const costPrice = Number(data.cost_price ?? data.sensory_profile?.cost_price ?? Math.round(sellingPrice * 0.45));
  const discountPercentage = comparePrice && comparePrice > sellingPrice
    ? Math.round(((comparePrice - sellingPrice) / comparePrice) * 100)
    : undefined;

  const stockQuantity = Number(data.stock_quantity ?? 0);
  const reservedStock = Number(data.reserved_stock ?? 0);
  const availableStock = Math.max(0, stockQuantity - reservedStock);

  let visibilityStatus = data.visibility_status || data.sensory_profile?.visibility_status;
  if (!visibilityStatus) {
    if (stockQuantity === 0) visibilityStatus = 'out_of_stock';
    else if (data.is_available === false) visibilityStatus = 'hidden';
    else visibilityStatus = 'published';
  }

  const subcategoryId = data.subcategory_id || data.sensory_profile?.subcategory_id || undefined;

  return {
    id: data.id,
    slug: data.slug,
    sku: data.sku,
    nameAr: data.name_ar,
    nameEn: data.name_en,
    taglineAr: data.tagline_ar || '',
    categoryId: data.category_id,
    categoryNameAr: data.category?.name_ar || '',
    subcategoryId,
    subcategoryNameAr: undefined,
    price: sellingPrice,
    sellingPrice,
    compareAtPrice: comparePrice,
    comparePrice,
    discountPercentage,
    costPrice,
    currency: data.currency || 'SAR',
    stockQuantity,
    reservedStock,
    availableStock,
    lowStockThreshold: Number(data.low_stock_threshold ?? 5),
    weightGrams: Number(data.weight_grams ?? 500),
    originRegionAr: data.origin_region_ar || '',
    originRegionEn: data.origin_region_en || '',
    floralSourceAr: data.floral_source_ar || '',
    floralSourceEn: data.floral_source_en || '',
    shortDescAr: data.short_desc_ar || '',
    fullStoryAr: data.full_story_ar || '',
    healthBenefitsAr: Array.isArray(data.health_benefits_ar) ? data.health_benefits_ar : [],
    pairingSuggestionsAr: Array.isArray(data.pairing_suggestions_ar) ? data.pairing_suggestions_ar : [],
    storageInstructionsAr: data.storage_instructions_ar || '',
    images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/zaad-logo.png'],
    isFeatured: Boolean(data.is_featured),
    isAvailable: Boolean(data.is_available),
    visibilityStatus,
    rating: Number(data.rating || 5.0),
    reviewCount: Number(data.review_count || 0),
    sensoryProfile: data.sensory_profile || { sweetness: 4, floralAroma: 4, density: 4, intensity: 4, crystallization: 'نادر' },
    badge: data.badge,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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
    } : {
      batchNumber: 'ZD-2026-LIVE',
      harvestSeason: 'المحصول الملكي 2026',
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
