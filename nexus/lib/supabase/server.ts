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
  // #region agent log
  {
    let urlHost = "";
    try {
      if (url) urlHost = new URL(url).hostname;
    } catch {
      urlHost = "invalid_url";
    }
    const payload = {
      sessionId: "1df461",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "server.ts:createClient",
      message: "server supabase env presence",
      data: {
        hasUrl: url.length > 0,
        hasKey: key.length > 0,
        urlHost,
        willReturnNull: !url || !key,
      },
      timestamp: Date.now(),
    };
    void fetch("http://127.0.0.1:7558/ingest/2bcc853a-4cfa-4b36-b20c-545df7596b0f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "1df461",
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
    console.error("[nexus-debug]", JSON.stringify(payload));
  }
  // #endregion
  if (!url || !key) return null;
  try {
    return createSupabaseClient(url, key);
  } catch {
    return null;
  }
}
