import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabaseServiceRoleKey } from '@/lib/supabase/admin';

export interface AdminAuthResult {
  isAuthorized: boolean;
  user?: {
    id: string;
    email: string;
    role: 'super_admin' | 'admin';
  };
  error?: string;
  status: number;
}

/**
 * Validates whether the incoming request is authorized by a Super Admin / Admin.
 * Verifies cryptographic Supabase Auth JWT or server service role key.
 */
export async function verifyAdminSession(request: NextRequest): Promise<AdminAuthResult> {
  try {
    // 1. Check for Server-to-Server Admin Key (x-admin-key)
    const adminKeyHeader = request.headers.get('x-admin-key');
    const serviceRoleKey = getSupabaseServiceRoleKey();
    if (adminKeyHeader && serviceRoleKey && adminKeyHeader.trim() === serviceRoleKey.trim()) {
      return {
        isAuthorized: true,
        user: {
          id: 'system-super-admin',
          email: 'admin@zaad.sa',
          role: 'super_admin'
        },
        status: 200
      };
    }

    // 2. Extract Bearer Token from Authorization Header
    let token = '';
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    // 3. Fallback: Extract from Supabase Session Cookie
    if (!token) {
      const cookies = request.cookies;
      // Standard Supabase cookie naming
      const allCookies = cookies.getAll();
      for (const cookie of allCookies) {
        if (cookie.name.includes('-auth-token') || cookie.name === 'sb-access-token') {
          try {
            const parsed = JSON.parse(decodeURIComponent(cookie.value));
            if (Array.isArray(parsed) && parsed[0]) {
              token = parsed[0];
            } else if (parsed.access_token) {
              token = parsed.access_token;
            }
          } catch {
            if (cookie.value.length > 20) {
              token = cookie.value;
            }
          }
          if (token) break;
        }
      }
    }

    if (!token) {
      return {
        isAuthorized: false,
        error: 'غير مصرح بالوصول: يلزم تسجيل الدخول كمسؤول للنظام (Authentication Required)',
        status: 401
      };
    }

    // 4. Verify cryptographic JWT via Supabase Auth
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return {
        isAuthorized: false,
        error: 'انتهت صلاحية الجلسة أو الرمز غير صالح (Session Expired or Invalid)',
        status: 401
      };
    }

    const appRole = data.user.app_metadata?.role;
    const userRole = data.user.user_metadata?.role;
    const isSuperAdmin = appRole === 'super_admin' || userRole === 'super_admin';
    const isAdmin = appRole === 'admin' || userRole === 'admin' || isSuperAdmin;

    if (!isAdmin) {
      return {
        isAuthorized: false,
        error: 'غير مصرح: هذا الحساب لا يملك صلاحية الإدارة العليا (super_admin required)',
        status: 403
      };
    }

    return {
      isAuthorized: true,
      user: {
        id: data.user.id,
        email: data.user.email || 'admin@zaad.sa',
        role: isSuperAdmin ? 'super_admin' : 'admin'
      },
      status: 200
    };
  } catch (err: any) {
    console.error('Error in verifyAdminSession:', err);
    return {
      isAuthorized: false,
      error: 'حدث خطأ أمني أثناء التحقق من الهوية',
      status: 500
    };
  }
}
