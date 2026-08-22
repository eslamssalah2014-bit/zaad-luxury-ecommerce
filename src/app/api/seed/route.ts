import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CMS,
  INITIAL_REVIEWS
} from '@/lib/data/mockData';

export async function GET() {
  return handleSeed();
}

export async function POST() {
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
      results['categories'] = `Success (${catData?.length || 0} categories seeded)`;
    }

    // Map category slugs to inserted IDs
    const categoryMap: Record<string, string> = {};
    if (catData) {
      catData.forEach((c: any) => {
        categoryMap[c.slug] = c.id;
      });
    }

    // 2. Seed Products
    for (const p of INITIAL_PRODUCTS) {
      // Find category ID by matching slug or categoryNameAr
      let catId = null;
      if (p.categoryId === 'cat-1') catId = categoryMap['rare-sidr'];
      else if (p.categoryId === 'cat-2') catId = categoryMap['mountain-wild'];
      else if (p.categoryId === 'cat-3') catId = categoryMap['royal-gifts'];
      else if (p.categoryId === 'cat-4') catId = categoryMap['bee-essentials'];

      const productPayload = {
        sku: p.sku,
        slug: p.slug,
        name_ar: p.nameAr,
        name_en: p.nameEn,
        tagline_ar: p.taglineAr,
        category_id: catId,
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
      };

      const { data: prodData, error: prodError } = await supabaseAdmin
        .from('products')
        .upsert(productPayload, { onConflict: 'slug' })
        .select()
        .single();

      if (prodError) {
        results[`product_${p.slug}`] = `Error: ${prodError.message}`;
      } else if (prodData && p.latestLabBatch) {
        // 3. Seed Batch
        const batchPayload = {
          product_id: prodData.id,
          batch_number: p.latestLabBatch.batchNumber,
          harvest_season: p.latestLabBatch.harvestSeason,
          harvest_date: p.latestLabBatch.harvestDate,
          tested_date: p.latestLabBatch.testedDate,
          lab_name: p.latestLabBatch.labName,
          moisture_percentage: p.latestLabBatch.moisturePercentage,
          hmf_level: p.latestLabBatch.hmfLevel,
          diastase_activity: p.latestLabBatch.diastaseActivity,
          sucrose_percentage: p.latestLabBatch.sucrosePercentage,
          pollen_purity_percentage: p.latestLabBatch.pollenPurityPercentage,
          certificate_pdf_url: p.latestLabBatch.certificatePdfUrl || null,
          lab_seal_image_url: p.latestLabBatch.labSealImageUrl || null,
          initial_jars_count: 50,
          remaining_jars_count: p.stockQuantity,
          is_active_batch: true
        };

        const { error: batchError } = await supabaseAdmin
          .from('product_batches')
          .upsert(batchPayload, { onConflict: 'batch_number' });

        if (batchError) {
          results[`batch_${p.latestLabBatch.batchNumber}`] = `Error: ${batchError.message}`;
        }
      }
    }

    // 4. Seed CMS Blocks
    const cmsPayload = INITIAL_CMS.map(c => ({
      key: c.key,
      title_ar: c.titleAr,
      subtitle_ar: c.subtitleAr,
      headline_ar: c.headlineAr,
      body_ar: c.bodyAr,
      cta_text_ar: c.ctaTextAr || null,
      cta_link: c.ctaLink || null,
      image_url: c.imageUrl || null,
      is_active: c.isActive
    }));

    const { error: cmsError } = await supabaseAdmin
      .from('cms_blocks')
      .upsert(cmsPayload, { onConflict: 'key' });

    if (cmsError) {
      results['cms_blocks'] = `Error: ${cmsError.message}`;
    } else {
      results['cms_blocks'] = 'Success';
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase Seeding completed',
      results
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
