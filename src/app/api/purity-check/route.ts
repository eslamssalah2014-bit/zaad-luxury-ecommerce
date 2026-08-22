import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batch = searchParams.get('batch');

    if (!batch) {
      return NextResponse.json({ success: false, error: 'Batch number parameter is required' }, { status: 400 });
    }

    const cleanNum = batch.trim().toUpperCase();

    const { data, error } = await supabaseAdmin
      .from('product_batches')
      .select(`
        *,
        product:products(*)
      `)
      .ilike('batch_number', cleanNum)
      .single();

    if (error || !data || !data.product) {
      return NextResponse.json({ success: false, error: 'Batch certificate not found in Supabase' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        productNameAr: data.product.name_ar,
        productSlug: data.product.slug,
        originRegionAr: data.product.origin_region_ar,
        floralSourceAr: data.product.floral_source_ar,
        labAnalysis: {
          batchNumber: data.batch_number,
          harvestSeason: data.harvest_season,
          harvestDate: data.harvest_date,
          testedDate: data.tested_date,
          labName: data.lab_name,
          moisturePercentage: Number(data.moisture_percentage),
          hmfLevel: Number(data.hmf_level),
          diastaseActivity: Number(data.diastase_activity),
          sucrosePercentage: Number(data.sucrose_percentage),
          pollenPurityPercentage: Number(data.pollen_purity_percentage),
          certificatePdfUrl: data.certificate_pdf_url,
          labSealImageUrl: data.lab_seal_image_url
        }
      },
      source: 'supabase'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
