import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True si las variables de Supabase están configuradas (no usar placeholder). */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && key && !url.includes("placeholder"));
}

/** Cliente de Supabase. Si faltan env en el cliente, usa valores placeholder para no romper la app. */
export function createClient(): SupabaseClient {
  const safeUrl = url || "https://placeholder.supabase.co";
  const safeKey = key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";
  return createSupabaseClient(safeUrl, safeKey);
}
