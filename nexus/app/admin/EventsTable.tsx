"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import type { Event } from "@/lib/types";

const CATEGORIES = ["music", "conference", "party", "sports", "general"];

export function EventsTable({
  events,
  onRefresh,
}: {
  events: Event[];
  onRefresh: () => Promise<void>;
}) {
  const supabase = createClient();
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", price: "", stock: "", image_url: "", category: "general" });
  const [loading, setLoading] = useState(false);

  function openEdit(e: Event) {
    setEditing(e);
    setForm({
      title: e.title,
      description: e.description || "",
      date: e.date.slice(0, 16),
      price: String(e.price),
      stock: String(e.stock),
      image_url: e.image_url || "",
      category: e.category,
    });
  }

  async function handleUpdate() {
    if (!editing) return;
    setLoading(true);
    const { error } = await supabase
      .from("events")
      .update({
        title: form.title.trim(),
        description: form.description.trim() || null,
        date: new Date(form.date).toISOString(),
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock, 10) || 0,
        image_url: form.image_url.trim() || null,
        category: form.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);
    setLoading(false);
    if (!error) {
      setEditing(null);
      await onRefresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await supabase.from("events").delete().eq("id", id);
    setEditing(null);
    await onRefresh();
  }

  if (events.length === 0) {
    return <p className="text-sm text-zinc-500">No hay eventos. Crea uno arriba.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-zinc-400">
              <th className="pb-2 pr-4">Evento</th>
              <th className="pb-2 pr-4">Fecha</th>
              <th className="pb-2 pr-4">Precio</th>
              <th className="pb-2 pr-4">Stock</th>
              <th className="pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-white/5">
                <td className="py-2 pr-4 font-medium text-zinc-100">{e.title}</td>
                <td className="py-2 pr-4 text-zinc-400">
                  {new Date(e.date).toLocaleDateString("es-ES")}
                </td>
                <td className="py-2 pr-4 text-cyan-400">${Number(e.price).toFixed(2)}</td>
                <td className="py-2 pr-4 text-zinc-400">{e.stock}</td>
                <td className="py-2 flex gap-1">
                  <Button variant="ghost" size="icon" type="button" onClick={() => openEdit(e)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button" onClick={() => handleDelete(e.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        {editing && (
          <>
            <DialogHeader onClose={() => setEditing(null)}>
              <DialogTitle>Editar evento</DialogTitle>
            </DialogHeader>
            <DialogContent>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Título</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Descripción</label>
                  <textarea
                    className="flex w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Fecha</label>
                    <input
                      type="datetime-local"
                      className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Categoría</label>
                    <select
                      className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100"
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Precio</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Stock</label>
                    <input
                      type="number"
                      min="0"
                      className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">URL imagen</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-100"
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button variant="neon" onClick={handleUpdate} disabled={loading}>
                Guardar
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
}
