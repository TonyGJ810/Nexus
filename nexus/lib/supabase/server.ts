import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/**
 * En Docker/K8s, NEXT_PUBLIC_* puede quedar vacío en SSR si el build no las inyectó.
 * SUPABASE_URL / SUPABASE_ANON_KEY se leen en runtime (p. ej. desde Helm).
 */
function supabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  );
}

function supabaseAnonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

/**
 * Cliente Supabase en servidor. Devuelve `null` si faltan URL/key (evita 500 por supabase-js).
 */
export function createClient(): SupabaseClient | null {
  const url = supabaseUrl().trim();
  const key = supabaseAnonKey().trim();
  if (!url || !key) return null;
  try {
    return createSupabaseClient(url, key);
  } catch {
    return null;
  }
}
