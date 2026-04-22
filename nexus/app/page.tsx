import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { EventsGrid } from "@/components/EventsGrid";
import type { Event } from "@/lib/types";

export default async function HomePage() {
  let events: Event[] = [];
  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      // #region agent log
      {
        const payload = {
          sessionId: "1df461",
          runId: "pre-fix",
          hypothesisId: "H2-H3",
          location: "page.tsx:HomePage",
          message: "events query result",
          data: {
            hasClient: true,
            hasError: Boolean(error),
            errorCode: error?.code ?? null,
            errorMessage: error?.message ?? null,
            rowCount: Array.isArray(data) ? data.length : 0,
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
      if (!error && data) events = data;
    } else {
      // #region agent log
      {
        const payload = {
          sessionId: "1df461",
          runId: "pre-fix",
          hypothesisId: "H1",
          location: "page.tsx:HomePage",
          message: "no supabase client, skipping query",
          data: { hasClient: false },
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
    }
  } catch (e) {
    // #region agent log
    {
      const payload = {
        sessionId: "1df461",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "page.tsx:HomePage",
        message: "exception in home events load",
        data: {
          errName: e instanceof Error ? e.name : typeof e,
          errMessage: e instanceof Error ? e.message : String(e),
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
    events = [];
  }
  const featured = events[0];
  const rest = events.slice(1, 7);

  return (
    <div className="space-y-12">
      {/* Hero con evento destacado */}
      <section className="relative overflow-hidden rounded-2xl gradient-border p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        <div className="relative">
          {featured ? (
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800/50">
                {featured.image_url ? (
                  <img
                    src={featured.image_url}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-500">
                    <Ticket className="h-16 w-16" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <Badge variant="neon" className="mb-2 w-fit">
                  Destacado
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
                  {featured.title}
                </h1>
                <p className="mt-2 text-zinc-400 line-clamp-2">
                  {featured.description || "Sin descripción."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(featured.date).toLocaleDateString("es-ES", {
                      dateStyle: "long",
                    })}
                  </span>
                  <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                    ${Number(featured.price).toFixed(2)}
                  </span>
                </div>
                <Link href={`/events/${featured.id}`} className="mt-6 inline-block">
                  <Button variant="neon" size="default" className="gap-2">
                    <Ticket className="h-4 w-4" />
                    Comprar boleto
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <h1 className="text-3xl font-bold text-zinc-100">
                Bienvenido a NEXUS
              </h1>
              <p className="mt-2 text-zinc-400">
                Próximamente nuevos eventos. Crea uno desde el panel Admin.
              </p>
              <Link href="/admin" className="mt-4 inline-block">
                <Button variant="glass">Ir al Admin</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Grid de eventos con filtro por categoría */}
      <EventsGrid events={rest} />
    </div>
  );
}
