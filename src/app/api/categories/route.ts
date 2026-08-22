import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((c: any) => ({
      id: c.id,
      nameAr: c.name_ar,
      nameEn: c.name_en,
      slug: c.slug,
      descriptionAr: c.description_ar || '',
      imageUrl: c.image_url || '',
      sortOrder: c.sort_order || 0,
      itemCount: 4
    }));

    return NextResponse.json({ success: true, data: formatted, source: 'supabase' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
