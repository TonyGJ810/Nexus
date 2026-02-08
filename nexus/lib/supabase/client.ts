import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True si las variables de Supabase están configuradas (no usar placeholder). */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && key && !url.includes("placeholder"));
}

const GLOBAL_KEY = "__NEXUS_SUPABASE_CLIENT__";

declare global {
  interface Window {
    [GLOBAL_KEY]?: SupabaseClient;
  }
}

/**
 * Cliente de Supabase para el navegador. Una sola instancia por pestaña (guardada en window)
 * para evitar "Multiple GoTrueClient instances" y AbortError entre chunks.
 */
export function createClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    if (window[GLOBAL_KEY]) return window[GLOBAL_KEY];
    const safeUrl = url || "https://placeholder.supabase.co";
    const safeKey = key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";
    window[GLOBAL_KEY] = createSupabaseClient(safeUrl, safeKey);
    return window[GLOBAL_KEY];
  }
  const safeUrl = url || "https://placeholder.supabase.co";
  const safeKey = key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";
  return createSupabaseClient(safeUrl, safeKey);
}
