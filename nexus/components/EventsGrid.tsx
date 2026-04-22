"use client";

import { useCallback, useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";

const CATEGORIES = ["todos", "music", "conference", "party", "sports", "general"];

export function EventsGrid({ events }: { events: Event[] }) {
  const [category, setCategory] = useState("todos");
  const filtered = useMemo(
    () =>
      category === "todos"
        ? events
        : events.filter((e) => e.category === category),
    [events, category]
  );
  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const c = (e.currentTarget as HTMLButtonElement).dataset.category;
    if (c) setCategory(c);
  }, []);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Próximos eventos
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={category === c ? "neon" : "ghost"}
              size="sm"
              type="button"
              data-category={c}
              onClick={handleCategoryClick}
            >
              {c === "todos" ? "Todos" : c}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-zinc-500">
          No hay eventos en esta categoría.
        </p>
      )}
    </section>
  );
  //prueba
}
