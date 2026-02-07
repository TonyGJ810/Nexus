"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["music", "conference", "party", "sports", "general"];

export function EventForm({ onSuccess }: { onSuccess: () => Promise<void> }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    price: "",
    stock: "",
    image_url: "",
    category: "general",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const date = form.date ? new Date(form.date).toISOString() : null;
    const price = form.price ? parseFloat(form.price) : 0;
    const stock = form.stock ? parseInt(form.stock, 10) : 0;
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      setLoading(false);
      return;
    }
    if (!date) {
      setError("La fecha es obligatoria.");
      setLoading(false);
      return;
    }
    const { error: err } = await supabase.from("events").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: date,
      price: isNaN(price) ? 0 : price,
      stock: isNaN(stock) ? 0 : stock,
      image_url: form.image_url.trim() || null,
      category: form.category,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setForm({
      title: "",
      description: "",
      date: "",
      price: "",
      stock: "",
      image_url: "",
      category: "general",
    });
    await onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Título *</label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nombre del evento"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción opcional"
          rows={2}
          className="flex w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Fecha *</label>
          <Input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Categoría</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Precio ($)</label>
          <Input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Stock</label>
          <Input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">URL imagen</label>
        <Input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" variant="neon" disabled={loading}>
        {loading ? "Guardando…" : "Crear evento"}
      </Button>
    </form>
  );
}
