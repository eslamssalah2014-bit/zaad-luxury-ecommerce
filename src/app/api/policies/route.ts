import { NextRequest, NextResponse } from 'next/server';
import { getAllPolicies } from '@/lib/services/policyService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Public GET: Fetch all published policies
 */
export async function GET(request: NextRequest) {
  try {
    const policies = await getAllPolicies(false);
    return NextResponse.json({
      success: true,
      data: policies
    });
  } catch (err: any) {
    console.error('Error fetching public policies:', err);
    return NextResponse.json(
      { success: false, error: 'فشل استرجاع سياسات المتجر' },
      { status: 500 }
    );
  }
}
