"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminEvents } from "./AdminEvents";
import { SalesSummary } from "./SalesSummary";
import type { Event } from "@/lib/types";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketsCount, setTicketsCount] = useState<number>(0);

  const refresh = async () => {
    const [eventsRes, countRes] = await Promise.all([
      supabase.from("events").select("*").order("date", { ascending: false }),
      supabase.from("tickets").select("*", { count: "exact", head: true }),
    ]);
    setEvents(eventsRes.data ?? []);
    setTicketsCount(countRes.count ?? 0);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "admin") {
        router.replace("/");
        return;
      }
      await refresh();
      setLoading(false);
    })();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Panel Admin</h1>
        <p className="text-zinc-400">Gestiona eventos y consulta ventas.</p>
      </div>
      <SalesSummary count={ticketsCount} />
      <AdminEvents events={events} onRefresh={refresh} />
    </div>
  );
}
