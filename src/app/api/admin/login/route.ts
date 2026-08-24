import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSanitizedSupabaseUrl } from '@/lib/supabase/admin';
import { getSupabaseAnonKey } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory rate-limiter: Map<ip_or_email, { attempts: number, lockUntil: number }>
const rateLimitMap = new Map<string, { attempts: number; lockUntil: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const rateLimitKey = `${ip}_${cleanEmail}`;

    // 1. Check Rate Limit / Lockout
    const now = Date.now();
    const attemptRecord = rateLimitMap.get(rateLimitKey);

    if (attemptRecord && attemptRecord.lockUntil > now) {
      const remainingMinutes = Math.ceil((attemptRecord.lockUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `تم قفل محاولات تسجيل الدخول مؤقتاً لحماية الحساب بسبب تكرار المحاولات غير الصحيحة. يرجى المحاولة بعد ${remainingMinutes} دقيقة.`
        },
        { status: 429 }
      );
    }

    const url = getSanitizedSupabaseUrl();
    const anonKey = getSupabaseAnonKey();

    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await authClient.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });

    if (error || !data.user) {
      // Record failed attempt
      const attempts = (attemptRecord ? attemptRecord.attempts : 0) + 1;
      const lockUntil = attempts >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
      rateLimitMap.set(rateLimitKey, { attempts, lockUntil });

      return NextResponse.json(
        {
          success: false,
          error: 'بيانات الاعتماد غير صحيحة أو الحساب غير مصرح له بالوصول.'
        },
        { status: 401 }
      );
    }

    // Reset rate limit on successful authentication
    rateLimitMap.delete(rateLimitKey);

    // Verify admin / super_admin role strictly
    const appRole = data.user.app_metadata?.role;
    const userRole = data.user.user_metadata?.role;
    const isSuperAdmin = appRole === 'super_admin' || userRole === 'super_admin';
    const isAdmin = appRole === 'admin' || userRole === 'admin' || isSuperAdmin;

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح: هذا الحساب لا يملك صلاحية الإدارة العليا (Super Admin Role Required)' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: isSuperAdmin ? 'super_admin' : 'admin'
      }
    });

    // Attach security header
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    return response;
  } catch (err: any) {
    console.error('Admin login API exception:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أمني أثناء محاولة تسجيل الدخول' },
      { status: 500 }
    );
  }
}
