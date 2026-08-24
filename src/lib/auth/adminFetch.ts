import { supabase } from '@/lib/supabase/client';

/**
 * Standardized fetch helper for Admin operations.
 * Automatically injects the active Supabase JWT Bearer token into Authorization headers.
 */
export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
  } catch (err) {
    console.error('Failed to get session for adminFetch:', err);
  }

  return fetch(url, {
    ...init,
    headers
  });
}
