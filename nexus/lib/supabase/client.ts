import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_HTTP_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.dummy";

/**
 * Navegador: NEXT_PUBLIC_* (inlinadas en el build del cliente).
 * Node/SSR: leer en cada llamada — Docker/K8s inyecta SUPABASE_* en runtime; el build
 * a veces deja NEXT_PUBLIC vacío en el bundle del servidor.
 */
function resolveUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      ""
    ).trim();
  }
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
}

function resolveKey(): string {
  if (typeof window === "undefined") {
    return (
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
    ).trim();
  }
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
}

function isHttpUrl(s: string): boolean {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** True si las variables de Supabase están configuradas (no placeholder). */
export function isSupabaseConfigured(): boolean {
  const url = resolveUrl();
  const key = resolveKey();
  return isHttpUrl(url) && Boolean(key) && !url.includes("placeholder");
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
    const url = resolveUrl();
    const key = resolveKey();
    const safeUrl = isHttpUrl(url) ? url : FALLBACK_HTTP_URL;
    const safeKey = key || FALLBACK_KEY;
    window[GLOBAL_KEY] = createSupabaseClient(safeUrl, safeKey);
    return window[GLOBAL_KEY];
  }
  const url = resolveUrl();
  const key = resolveKey();
  const safeUrl = isHttpUrl(url) ? url : FALLBACK_HTTP_URL;
  const safeKey = key || FALLBACK_KEY;
  return createSupabaseClient(safeUrl, safeKey);
}
