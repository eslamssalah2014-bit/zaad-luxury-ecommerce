import { supabase } from '@/lib/supabase/client';

/**
 * Standardized fetch helper for Admin operations.
 * Automatically injects the active Supabase JWT Bearer token into Authorization headers,
 * with fallback to localStorage if getSession() is pending or empty.
 */
export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  
  let token = '';

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      token = session.access_token;
    }
  } catch (err) {
    console.warn('[adminFetch] getSession() error:', err);
  }

  // Fallback: Check localStorage if getSession() was empty in browser environment
  if (!token && typeof window !== 'undefined' && window.localStorage) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('-auth-token') || key.includes('supabase.auth.token') || key.startsWith('sb-'))) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.access_token) {
                token = parsed.access_token;
                break;
              } else if (Array.isArray(parsed) && parsed[0]) {
                token = parsed[0];
                break;
              }
            } catch {}
          }
        }
      }
    } catch (lsErr) {
      console.warn('[adminFetch] localStorage token extraction error:', lsErr);
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    console.warn('[adminFetch] Warning: No active Bearer token found before dispatching request to', url);
  }

  return fetch(url, {
    ...init,
    headers
  });
}

