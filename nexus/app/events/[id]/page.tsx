import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket, ArrowLeft } from "lucide-react";
import { ComprarBoletoButton } from "@/components/ComprarBoletoButton";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();
  if (!supabase) notFound();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-0">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Link>

      {/* Hero: imagen grande con mask degradado hacia negro */}
      <div className="relative -mx-4 mt-2 h-[42vh] min-h-[280px] overflow-hidden rounded-2xl md:-mx-0">
        {event.image_url ? (
          <>
            <img
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover hero-mask"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/0 via-[var(--background)]/40 to-[var(--background)] pointer-events-none" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900/80 rounded-2xl">
            <Ticket className="h-24 w-24 text-zinc-600" />
          </div>
        )}
      </div>

      {/* Contenido debajo del hero */}
      <div className="relative -mt-24 z-10 px-0">
        <div className="glass rounded-2xl overflow-hidden border-white/10">
          <div className="p-6 md:p-8">
            <Badge variant="neon" className="mb-3">
              {event.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
              {event.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleString("es-ES", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
            </div>
            {event.description && (
              <p className="mt-4 text-zinc-400 leading-relaxed">
                {event.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                  ${Number(event.price).toFixed(2)}
                </p>
                <p className="text-sm text-zinc-500">
                  {event.stock > 0
                    ? `${event.stock} boletos disponibles`
                    : "Agotado"}
                </p>
              </div>
              <ComprarBoletoButton
                eventId={event.id}
                title={event.title}
                price={Number(event.price)}
                stock={event.stock}
                className="gap-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
