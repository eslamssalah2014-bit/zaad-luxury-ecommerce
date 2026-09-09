import { NextRequest, NextResponse } from 'next/server';
import { getPolicyBySlug } from '@/lib/services/policyService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Public GET: Fetch single published policy by slug
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'الرابط التعريفي مطلوب' },
        { status: 400 }
      );
    }

    const policy = await getPolicyBySlug(slug, false);

    if (!policy) {
      return NextResponse.json(
        { success: false, error: 'السياسة المطلوبة غير موجودة أو غير منشورة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: policy
    });
  } catch (err: any) {
    console.error('Error fetching policy by slug:', err);
    return NextResponse.json(
      { success: false, error: 'فشل استرجاع السياسة' },
      { status: 500 }
    );
  }
}
