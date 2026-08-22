import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSanitizedSupabaseUrl } from '@/lib/supabase/admin';
import { getSupabaseAnonKey } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const url = getSanitizedSupabaseUrl();
    const anonKey = getSupabaseAnonKey();

    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await authClient.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          error: error?.message === 'Invalid login credentials'
            ? 'بيانات الاعتماد غير صحيحة أو الحساب غير موجود.'
            : (error?.message || 'فشل تسجيل الدخول')
        },
        { status: 401 }
      );
    }

    // Verify admin role strictly
    const appRole = data.user.app_metadata?.role;
    const userRole = data.user.user_metadata?.role;
    const isAdmin = appRole === 'admin' || userRole === 'admin';

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لهذا الحساب بالوصول إلى لوحة التحكم التنفيذية (Admin Role Required)' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: appRole || userRole || 'admin'
      }
    });
  } catch (err: any) {
    console.error('Admin login API exception:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'حدث خطأ في الخادم أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
