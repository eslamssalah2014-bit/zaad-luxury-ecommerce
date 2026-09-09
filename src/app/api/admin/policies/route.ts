import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import {
  getAllPolicies,
  getPolicyBySlug,
  upsertPolicy,
  deletePolicy
} from '@/lib/services/policyService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Enforces strict super_admin RBAC check
 */
async function authorizeSuperAdmin(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.isAuthorized) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: auth.error || 'غير مصرح بالوصول: يرجى تسجيل الدخول كمسؤول' },
        { status: auth.status || 401 }
      )
    };
  }

  // Strict super_admin role check (Requirement 10)
  if (auth.user?.role !== 'super_admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'غير مصرح: إدارة وتعديل سياسات المتجر تتطلب صلاحيات المشرف العام حصراً (Super Admin Required)'
        },
        { status: 403 }
      )
    };
  }

  return { authorized: true, user: auth.user };
}

/**
 * GET: Fetch all policies (including drafts) for Admin
 */
export async function GET(request: NextRequest) {
  const authCheck = await authorizeSuperAdmin(request);
  if (!authCheck.authorized) return authCheck.response;

  try {
    const policies = await getAllPolicies(true);
    return NextResponse.json({
      success: true,
      data: policies
    });
  } catch (err: any) {
    console.error('Admin GET policies error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب قائمة السياسات' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new policy
 */
export async function POST(request: NextRequest) {
  const authCheck = await authorizeSuperAdmin(request);
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = await request.json();
    const { title, slug, content, meta_title, meta_description, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال عنوان السياسة، الرابط الدائم (Slug)، والمحتوى' },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existing = await getPolicyBySlug(slug, true);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `الرابط الدائم (${slug}) مستخدم بالفعل لسياسة أخرى، يرجى اختيار رابط مختلف` },
        { status: 409 }
      );
    }

    const res = await upsertPolicy({
      title,
      slug,
      content,
      meta_title,
      meta_description,
      status: status || 'draft'
    });

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: res.data,
      message: 'تم إنشاء السياسة وحفظها بنجاح'
    });
  } catch (err: any) {
    console.error('Admin POST policy error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'فشل إنشاء السياسة' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update an existing policy
 */
export async function PUT(request: NextRequest) {
  const authCheck = await authorizeSuperAdmin(request);
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = await request.json();
    const { id, title, slug, content, meta_title, meta_description, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال عنوان السياسة، الرابط الدائم، والمحتوى' },
        { status: 400 }
      );
    }

    const res = await upsertPolicy({
      id,
      title,
      slug,
      content,
      meta_title,
      meta_description,
      status: status || 'draft'
    });

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: res.data,
      message: 'تم تحديث السياسة بنجاح'
    });
  } catch (err: any) {
    console.error('Admin PUT policy error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'فشل تحديث السياسة' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete a policy
 */
export async function DELETE(request: NextRequest) {
  const authCheck = await authorizeSuperAdmin(request);
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرّف السياسة (id) مطلوب للحذف' },
        { status: 400 }
      );
    }

    const res = await deletePolicy(id);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف السياسة بنجاح'
    });
  } catch (err: any) {
    console.error('Admin DELETE policy error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'فشل حذف السياسة' },
      { status: 500 }
    );
  }
}
