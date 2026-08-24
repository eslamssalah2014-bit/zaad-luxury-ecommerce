import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { Category, Subcategory } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('all') === 'true';

    // 1. Fetch categories
    let catQuery = supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeInactive) {
      catQuery = catQuery.eq('is_active', true);
    }

    const { data: categories, error: catError } = await catQuery;
    if (catError) {
      console.error('Error fetching categories:', catError);
      return NextResponse.json({ success: false, error: catError.message }, { status: 500 });
    }

    // 2. Fetch subcategories if table exists
    let subcategories: any[] = [];
    try {
      let subQuery = supabaseAdmin
        .from('subcategories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        subQuery = subQuery.eq('is_active', true);
      }

      const { data: subData } = await subQuery;
      if (subData) {
        subcategories = subData;
      }
    } catch {
      // Graceful fallback
    }

    const formattedCategories: Category[] = (categories || []).map((c: any) => {
      const subs = subcategories
        .filter((s: any) => s.category_id === c.id)
        .map((s: any): Subcategory => ({
          id: s.id,
          categoryId: s.category_id,
          categoryNameAr: c.name_ar,
          nameAr: s.name_ar,
          nameEn: s.name_en,
          slug: s.slug,
          descriptionAr: s.description_ar || '',
          sortOrder: s.sort_order || 0,
          isActive: s.is_active ?? true,
          createdAt: s.created_at
        }));

      return {
        id: c.id,
        nameAr: c.name_ar,
        nameEn: c.name_en,
        slug: c.slug,
        descriptionAr: c.description_ar || '',
        imageUrl: c.image_url || '/images/zaad-logo.png',
        sortOrder: c.sort_order || 0,
        isActive: c.is_active ?? true,
        itemCount: 4,
        subcategories: subs
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedCategories,
      subcategories: subcategories.map((s: any) => ({
        id: s.id,
        categoryId: s.category_id,
        nameAr: s.name_ar,
        nameEn: s.name_en,
        slug: s.slug,
        descriptionAr: s.description_ar || '',
        sortOrder: s.sort_order || 0,
        isActive: s.is_active ?? true,
        createdAt: s.created_at
      })),
      source: 'supabase'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization for Category creation
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { type, nameAr, nameEn, slug, descriptionAr, imageUrl, sortOrder, isActive, categoryId } = body;

    if (!nameAr || !slug) {
      return NextResponse.json({ success: false, error: 'الاسم والرابط التعريفي مطلوبان' }, { status: 400 });
    }

    if (type === 'subcategory') {
      if (!categoryId) {
        return NextResponse.json({ success: false, error: 'يرجى تحديد التصنيف الرئيسي التابع له' }, { status: 400 });
      }

      const { data: subData, error: subError } = await supabaseAdmin
        .from('subcategories')
        .insert({
          category_id: categoryId,
          name_ar: nameAr,
          name_en: nameEn || nameAr,
          slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
          description_ar: descriptionAr || null,
          sort_order: Number(sortOrder || 0),
          is_active: isActive !== false
        })
        .select()
        .single();

      if (subError) {
        return NextResponse.json({ success: false, error: subError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: subData });
    }

    // Default: Main Category
    const { data: catData, error: catError } = await supabaseAdmin
      .from('categories')
      .insert({
        name_ar: nameAr,
        name_en: nameEn || nameAr,
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        description_ar: descriptionAr || null,
        image_url: imageUrl || '/images/zaad-logo.png',
        sort_order: Number(sortOrder || 0),
        is_active: isActive !== false
      })
      .select()
      .single();

    if (catError) {
      return NextResponse.json({ success: false, error: catError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: catData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization for Category update
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id, type, nameAr, nameEn, slug, descriptionAr, imageUrl, sortOrder, isActive, categoryId } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف التصنيف مطلوب' }, { status: 400 });
    }

    if (type === 'subcategory') {
      const { data: subData, error: subError } = await supabaseAdmin
        .from('subcategories')
        .update({
          category_id: categoryId,
          name_ar: nameAr,
          name_en: nameEn,
          slug: slug?.toLowerCase().trim().replace(/\s+/g, '-'),
          description_ar: descriptionAr,
          sort_order: Number(sortOrder),
          is_active: isActive
        })
        .eq('id', id)
        .select()
        .single();

      if (subError) {
        return NextResponse.json({ success: false, error: subError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: subData });
    }

    // Default: Main Category
    const { data: catData, error: catError } = await supabaseAdmin
      .from('categories')
      .update({
        name_ar: nameAr,
        name_en: nameEn,
        slug: slug?.toLowerCase().trim().replace(/\s+/g, '-'),
        description_ar: descriptionAr,
        image_url: imageUrl,
        sort_order: Number(sortOrder),
        is_active: isActive
      })
      .eq('id', id)
      .select()
      .single();

    if (catError) {
      return NextResponse.json({ success: false, error: catError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: catData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization for Category deletion
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id) {
      return NextResponse.json({ success: false, error: 'المعرف مطلوب للحذف' }, { status: 400 });
    }

    if (type === 'subcategory') {
      const { error } = await supabaseAdmin.from('subcategories').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'تم حذف الفئة الفرعية بنجاح' });
    }

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف التصنيف بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
