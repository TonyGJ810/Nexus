"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket } from "lucide-react";
import { ComprarBoletoButton } from "@/components/ComprarBoletoButton";
import type { Event } from "@/lib/types";

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="group flex flex-col transition-all duration-300 hover:scale-[1.05] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <Link href={`/events/${event.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-zinc-900">
          {event.image_url ? (
            <>
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 image-overlay pointer-events-none" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-600">
              <Ticket className="h-12 w-12" />
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/events/${event.id}`}>
            <CardTitle className="text-base tracking-tight line-clamp-1 hover:text-cyan-400">{event.title}</CardTitle>
          </Link>
          <Badge variant="default">{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 pt-0">
        <p className="line-clamp-2 text-sm text-zinc-400">
          {event.description || "Sin descripción."}
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(event.date).toLocaleDateString("es-ES", {
            dateStyle: "medium",
          })}
        </div>
        <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
          ${Number(event.price).toFixed(2)} · {event.stock} en stock
        </p>
      </CardContent>
      <CardFooter className="pt-0 gap-2 flex-wrap">
        <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
          <ComprarBoletoButton
            eventId={event.id}
            title={event.title}
            price={Number(event.price)}
            stock={event.stock}
            size="sm"
            className="w-full gap-1.5"
          />
        </div>
        <Link href={`/events/${event.id}`}>
          <Button variant="glass" size="sm" type="button">
            Ver detalle
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
