import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Resolves and normalizes the Supabase project URL from any standard environment variable format.
 * Strips trailing slashes and '/rest/v1' subpaths if present.
 */
export function getSanitizedSupabaseUrl(): string {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.SUPABASE_REST_API_URL ||
    'https://btcwrjwokjpltshdyegw.supabase.co';

  return rawUrl
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

/**
 * Resolves the Supabase Service Role (Secret) key from environment variables.
 */
export function getSupabaseServiceRoleKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();
}

/**
 * Factory function creating an elevated Admin Supabase client.
 */
export function createAdminClient(): SupabaseClient {
  const url = getSanitizedSupabaseUrl();
  const key = getSupabaseServiceRoleKey();

  if (!url) {
    console.error('❌ Supabase URL is missing from environment variables (NEXT_PUBLIC_SUPABASE_URL)');
  }
  if (!key) {
    console.error('❌ Supabase Service Role Key is missing from environment variables (SUPABASE_SERVICE_ROLE_KEY)');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Singleton Proxy for seamless server-side usage
let cachedAdminClient: SupabaseClient | null = null;

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!cachedAdminClient) {
      cachedAdminClient = createAdminClient();
    }
    const val = (cachedAdminClient as any)[prop];
    if (typeof val === 'function') {
      return val.bind(cachedAdminClient);
    }
    return val;
  },
});
