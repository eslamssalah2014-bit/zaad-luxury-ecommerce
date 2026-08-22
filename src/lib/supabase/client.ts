import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSanitizedSupabaseUrl } from './admin';

/**
 * Resolves the Supabase Anon / Publishable key from environment variables.
 */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  ).trim();
}

/**
 * Factory function creating a browser/public Supabase client.
 */
export function createBrowserClient(): SupabaseClient {
  const url = getSanitizedSupabaseUrl();
  const key = getSupabaseAnonKey();

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
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
