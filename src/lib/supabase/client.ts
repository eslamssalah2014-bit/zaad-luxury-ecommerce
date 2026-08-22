import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://btcwrjwokjpltshdyegw.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_P5LTBPXDpvqbppjioBlM_A_HBQDHh47';

/**
 * Resolves the sanitized Supabase URL safely for browser client
 */
export function getClientSupabaseUrl(): string {
  return SUPABASE_PROJECT_URL.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

/**
 * Resolves the Supabase Anon key safely for browser client
 */
export function getSupabaseAnonKey(): string {
  return SUPABASE_ANON_KEY.trim();
}

/**
 * Factory function creating a browser/public Supabase client.
 */
export function createBrowserClient(): SupabaseClient {
  return createClient(getClientSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Singleton Proxy for seamless usage across client components
let cachedBrowserClient: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!cachedBrowserClient) {
      cachedBrowserClient = createBrowserClient();
    }
    const val = (cachedBrowserClient as any)[prop];
    if (typeof val === 'function') {
      return val.bind(cachedBrowserClient);
    }
    return val;
  },
});

export const getSupabaseBrowserClient = () => {
  return createBrowserClient();
};
