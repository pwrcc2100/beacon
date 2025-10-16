// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

const getEnv = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is required.`);
  return v;
};

// Client-side Supabase client (created lazily)
export const supabase = (() => {
  return new Proxy({} as SupabaseClient, {
    get(_t, prop) {
      if (!browserClient) {
        const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
        const anon = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        browserClient = createClient(url, anon);
      }
      // @ts-ignore dynamic proxy
      return (browserClient as any)[prop];
    }
  }) as unknown as SupabaseClient;
})();

// Server-side Supabase client (created lazily)
export const supabaseAdmin = (() => {
  return new Proxy({} as SupabaseClient, {
    get(_t, prop) {
      if (!adminClient) {
        const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
        const service = getEnv('SUPABASE_SERVICE_ROLE_KEY');
        adminClient = createClient(url, service, {
          auth: { autoRefreshToken: false, persistSession: false }
        });
      }
      // @ts-ignore dynamic proxy
      return (adminClient as any)[prop];
    }
  }) as unknown as SupabaseClient;
})();

