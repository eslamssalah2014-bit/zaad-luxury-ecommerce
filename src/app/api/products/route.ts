import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSanitizedSupabaseUrl, getSupabaseServiceRoleKey } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const requestedAdmin = searchParams.get('admin') === 'true';
    const visibility = searchParams.get('visibility');

    let isAdmin = false;
    if (requestedAdmin) {
      const auth = await verifyAdminSession(request);
      isAdmin = auth.isAuthorized;
    }

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
      const prod = formatProductRow(data);
      if (!isAdmin && (prod.visibilityStatus === 'hidden' || prod.visibilityStatus === 'draft')) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: prod, source: 'supabase' });
    }

    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }

    if (visibility && visibility !== 'all' && isAdmin) {
      query = query.eq('visibility_status', visibility);
    }

    // Public storefront safety filter: Hide drafts and hidden items from public
    if (!isAdmin) {
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
    // Enforce Super Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

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
      currency = 'EGP',
      stockQuantity = 20,
      lowStockThreshold = 5,
      weightGrams = 500,
      originRegionAr,
      originRegionEn,
      floralSourceAr,
      floralSourceEn,
      shortDescAr,
      fullStoryAr,
      healthBenefits = [],
      healthBenefit1Title,
      healthBenefit1Desc,
      healthBenefit2Title,
      healthBenefit2Desc,
      healthBenefit3Title,
      healthBenefit3Desc,
      healthBenefit4Title,
      healthBenefit4Desc,
      healthBenefitsAr,
      pairingSuggestionsAr = [],
      usageInstructionsAr,
      storageInstructionsAr,
      images = [],
      isFeatured = false,
      isAvailable = true,
      visibilityStatus = 'published',
      badge,
      attributes = [],
      tabs = [],
      customShippingMessage,
      customVatMessage,
      customTrustBadgeText
    } = body;

    if (!nameAr || !price || !shortDescAr) {
      return NextResponse.json({ success: false, error: 'الاسم والسعر والوصف القصير حقول مطلوبة' }, { status: 400 });
    }

    const calculatedCost = Number(costPrice || Math.round(Number(price) * 0.45));
    const generatedSlug = (slug || nameEn || nameAr).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '');
    const generatedSku = (sku || `ZD-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();

    // Construct structured health benefits array
    let resolvedHealthBenefits = [];
    if (healthBenefit1Title || healthBenefit1Desc || healthBenefit2Title || healthBenefit2Desc || healthBenefit3Title || healthBenefit3Desc || healthBenefit4Title || healthBenefit4Desc) {
      resolvedHealthBenefits = [
        { title: healthBenefit1Title || '', description: healthBenefit1Desc || '' },
        { title: healthBenefit2Title || '', description: healthBenefit2Desc || '' },
        { title: healthBenefit3Title || '', description: healthBenefit3Desc || '' },
        { title: healthBenefit4Title || '', description: healthBenefit4Desc || '' }
      ].filter(b => b.title || b.description);
    } else if (Array.isArray(healthBenefits) && healthBenefits.length > 0) {
      resolvedHealthBenefits = healthBenefits;
    } else if (Array.isArray(healthBenefitsAr) && healthBenefitsAr.length > 0) {
      resolvedHealthBenefits = healthBenefitsAr.map(b => typeof b === 'string' ? { title: b, description: '' } : b);
    }

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
      origin_region_ar: originRegionAr || null,
      origin_region_en: originRegionEn || null,
      floral_source_ar: floralSourceAr || null,
      floral_source_en: floralSourceEn || null,
      short_desc_ar: shortDescAr,
      full_story_ar: fullStoryAr || shortDescAr,
      health_benefits_ar: resolvedHealthBenefits,
      pairing_suggestions_ar: pairingSuggestionsAr,
      usage_instructions_ar: usageInstructionsAr || null,
      storage_instructions_ar: storageInstructionsAr || null,
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
        subcategory_id: subcategoryId || null,
        attributes: Array.isArray(attributes) ? attributes : [],
        tabs: Array.isArray(tabs) ? tabs : [],
        usage_instructions_ar: usageInstructionsAr || null,
        custom_shipping_message: customShippingMessage || null,
        custom_vat_message: customVatMessage || null,
        custom_trust_badge_text: customTrustBadgeText || null
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
    // Enforce Super Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

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
      currency = 'EGP',
      stockQuantity,
      lowStockThreshold,
      weightGrams,
      originRegionAr,
      originRegionEn,
      floralSourceAr,
      floralSourceEn,
      shortDescAr,
      fullStoryAr,
      healthBenefits = [],
      healthBenefit1Title,
      healthBenefit1Desc,
      healthBenefit2Title,
      healthBenefit2Desc,
      healthBenefit3Title,
      healthBenefit3Desc,
      healthBenefit4Title,
      healthBenefit4Desc,
      healthBenefitsAr,
      pairingSuggestionsAr,
      usageInstructionsAr,
      storageInstructionsAr,
      images,
      isFeatured,
      isAvailable,
      visibilityStatus,
      badge,
      attributes = [],
      tabs = [],
      customShippingMessage,
      customVatMessage,
      customTrustBadgeText
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف المنتج مطلوب' }, { status: 400 });
    }

    const calculatedCost = Number(costPrice || Math.round(Number(price) * 0.45));

    // Construct structured health benefits array
    let resolvedHealthBenefits = [];
    if (healthBenefit1Title || healthBenefit1Desc || healthBenefit2Title || healthBenefit2Desc || healthBenefit3Title || healthBenefit3Desc || healthBenefit4Title || healthBenefit4Desc) {
      resolvedHealthBenefits = [
        { title: healthBenefit1Title || '', description: healthBenefit1Desc || '' },
        { title: healthBenefit2Title || '', description: healthBenefit2Desc || '' },
        { title: healthBenefit3Title || '', description: healthBenefit3Desc || '' },
        { title: healthBenefit4Title || '', description: healthBenefit4Desc || '' }
      ].filter(b => b.title || b.description);
    } else if (Array.isArray(healthBenefits) && healthBenefits.length > 0) {
      resolvedHealthBenefits = healthBenefits;
    } else if (Array.isArray(healthBenefitsAr) && healthBenefitsAr.length > 0) {
      resolvedHealthBenefits = healthBenefitsAr.map(b => typeof b === 'string' ? { title: b, description: '' } : b);
    }

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
      origin_region_ar: originRegionAr || null,
      origin_region_en: originRegionEn || null,
      floral_source_ar: floralSourceAr || null,
      floral_source_en: floralSourceEn || null,
      short_desc_ar: shortDescAr,
      full_story_ar: fullStoryAr,
      health_benefits_ar: resolvedHealthBenefits,
      pairing_suggestions_ar: pairingSuggestionsAr || [],
      usage_instructions_ar: usageInstructionsAr || null,
      storage_instructions_ar: storageInstructionsAr || null,
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
        subcategory_id: subcategoryId || null,
        attributes: Array.isArray(attributes) ? attributes : [],
        tabs: Array.isArray(tabs) ? tabs : [],
        usage_instructions_ar: usageInstructionsAr || null,
        custom_shipping_message: customShippingMessage || null,
        custom_vat_message: customVatMessage || null,
        custom_trust_badge_text: customTrustBadgeText || null
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

    return NextResponse.json({ success: true, data: formatProductRow(updatedProd) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف المنتج مطلوب للحذف' }, { status: 400 });
    }

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

  // Format Health Benefits
  let rawBenefits = Array.isArray(data.health_benefits_ar) ? data.health_benefits_ar : [];
  const healthBenefits: { title: string; description: string }[] = rawBenefits.map((b: any) => {
    if (typeof b === 'string') {
      return { title: b, description: '' };
    }
    return {
      title: String(b?.title || ''),
      description: String(b?.description || '')
    };
  });

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
    currency: data.currency || 'EGP',
    stockQuantity,
    reservedStock,
    availableStock,
    lowStockThreshold: Number(data.low_stock_threshold ?? 5),
    weightGrams: Number(data.weight_grams ?? 500),
    originRegionAr: data.origin_region_ar || undefined,
    originRegionEn: data.origin_region_en || undefined,
    floralSourceAr: data.floral_source_ar || undefined,
    floralSourceEn: data.floral_source_en || undefined,
    shortDescAr: data.short_desc_ar || '',
    fullStoryAr: data.full_story_ar || '',
    healthBenefits,
    healthBenefit1Title: healthBenefits[0]?.title || '',
    healthBenefit1Desc: healthBenefits[0]?.description || '',
    healthBenefit2Title: healthBenefits[1]?.title || '',
    healthBenefit2Desc: healthBenefits[1]?.description || '',
    healthBenefit3Title: healthBenefits[2]?.title || '',
    healthBenefit3Desc: healthBenefits[2]?.description || '',
    healthBenefit4Title: healthBenefits[3]?.title || '',
    healthBenefit4Desc: healthBenefits[3]?.description || '',
    healthBenefitsAr: healthBenefits,
    pairingSuggestionsAr: Array.isArray(data.pairing_suggestions_ar) ? data.pairing_suggestions_ar : [],
    usageInstructionsAr: data.usage_instructions_ar || data.sensory_profile?.usage_instructions_ar || undefined,
    storageInstructionsAr: data.storage_instructions_ar || undefined,
    images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/zaad-logo.png'],
    isFeatured: Boolean(data.is_featured),
    isAvailable: Boolean(data.is_available),
    visibilityStatus,
    rating: Number(data.rating || 5.0),
    reviewCount: Number(data.review_count || 0),
    sensoryProfile: data.sensory_profile || { sweetness: 4, floralAroma: 4, density: 4, intensity: 4, crystallization: 'نادر' },
    badge: data.badge,
    attributes: Array.isArray(data.attributes) ? data.attributes : (Array.isArray(data.sensory_profile?.attributes) ? data.sensory_profile.attributes : undefined),
    tabs: Array.isArray(data.tabs) ? data.tabs : (Array.isArray(data.sensory_profile?.tabs) ? data.sensory_profile.tabs : undefined),
    customShippingMessage: data.custom_shipping_message || data.sensory_profile?.custom_shipping_message || undefined,
    customVatMessage: data.custom_vat_message || data.sensory_profile?.custom_vat_message || undefined,
    customTrustBadgeText: data.custom_trust_badge_text || data.sensory_profile?.custom_trust_badge_text || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
