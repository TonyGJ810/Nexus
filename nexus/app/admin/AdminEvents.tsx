import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "./EventForm";
import { EventsTable } from "./EventsTable";
import type { Event } from "@/lib/types";

export function AdminEvents({
  events,
  onRefresh,
}: {
  events: Event[];
  onRefresh: () => Promise<void>;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo evento</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm onSuccess={onRefresh} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Eventos ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsTable events={events} onRefresh={onRefresh} />
        </CardContent>
      </Card>
    </div>
  );
}
