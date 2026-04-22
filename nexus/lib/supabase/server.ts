import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * En Docker/K8s, NEXT_PUBLIC_* puede quedar vacío en SSR si el build no las inyectó.
 * SUPABASE_URL / SUPABASE_ANON_KEY se leen en runtime (p. ej. desde Helm) sin ese problema.
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

export function createClient() {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  return createSupabaseClient(url, key);
}
