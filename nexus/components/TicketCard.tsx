"use client";

import React from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket } from "lucide-react";
import type { Ticket as TicketType, Event } from "@/lib/types";

interface TicketCardProps {
  ticket: TicketType;
  event: Event;
}

const QRBlock = React.memo(({ ticketId }: { ticketId: string }) => (
  <div className="flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white p-2">
    <QRCodeSVG
      value={ticketId}
      size={100}
      level="M"
      includeMargin={false}
      className="h-[100px] w-[100px]"
    />
  </div>
));

QRBlock.displayName = "QRBlock";

function TicketCardInner({ ticket, event }: TicketCardProps) {
  return (
    <Card className="overflow-hidden border border-white/10 bg-zinc-950/80 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="flex flex-col sm:flex-row">
        {/* Imagen del evento */}
        <div className="relative h-32 w-full shrink-0 overflow-hidden sm:h-auto sm:w-40">
          {event.image_url ? (
            <>
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="160px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900">
              <Ticket className="h-12 w-12 text-zinc-600" />
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold tracking-tight text-zinc-100 truncate">
                {event.title}
              </h3>
              <Badge
                variant={ticket.status === "confirmed" ? "default" : "secondary"}
                className="shrink-0"
              >
                {ticket.status === "confirmed" ? "Confirmado" : "Cancelado"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="h-4 w-4 shrink-0" />
              {new Date(event.date).toLocaleDateString("es-ES", {
                dateStyle: "long",
              })}
            </div>
            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              ${Number(event.price).toFixed(2)}
            </p>
          </div>

          <QRBlock ticketId={ticket.id} />
        </CardContent>
      </div>
    </Card>
  );
}

export const TicketCard = React.memo(TicketCardInner);
