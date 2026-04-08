"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TicketCard } from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket as TicketIcon } from "lucide-react";
import type { Ticket, Event } from "@/lib/types";

interface TicketWithEvent extends Ticket {
  events: Event | null;
}

export default function MisBoletosPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
      const { data, error } = await supabase
        .from("tickets")
        .select("*, events(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        if (!cancelled) setLoading(false);
        return;
      }
      if (cancelled) return;
      setTickets((data as TicketWithEvent[]) ?? []);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
          <p className="mt-4 text-zinc-400">Cargando tus boletos...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  if (tickets.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-zinc-950/80 py-16">
          <TicketIcon className="h-14 w-14 text-zinc-600 mb-4" />
          <p className="text-lg font-medium text-zinc-100 mb-2">No tienes boletos</p>
          <p className="text-sm text-zinc-400 mb-6 text-center">
            Compra boletos para eventos y aparecerán aquí con su código QR.
          </p>
          <Link href="/">
            <Button variant="neon">Ver eventos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
        Mis Boletos ({tickets.length} {tickets.length === 1 ? "boleto" : "boletos"})
      </h1>
      <div className="space-y-4">
        {tickets.map((t) => {
          const event = t.events;
          if (!event) return null;
          return <TicketCard key={t.id} ticket={t} event={event} />;
        })}
      </div>
    </div>
  );
}
