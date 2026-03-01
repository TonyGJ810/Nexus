"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, ShoppingCart, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const supabase = createClient();
  const showToast = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
  }, [supabase.auth]);

  async function handleCheckout() {
    if (items.length === 0) {
      showToast("El carrito está vacío.", "error");
      return;
    }
    if (!userId) {
      showToast("Inicia sesión para finalizar la compra.", "error");
      return;
    }
    setCheckingOut(true);
    try {
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          const { error } = await supabase.from("tickets").insert({
            user_id: userId,
            event_id: item.eventId,
            status: "confirmed",
          });
          if (error) {
            if (error.message.includes("stock")) {
              showToast(`Sin stock suficiente para: ${item.title}`, "error");
            } else {
              showToast("Error al procesar la compra. Intenta de nuevo.", "error");
            }
            setCheckingOut(false);
            return;
          }
        }
      }
      setOrderComplete(true);
      clearCart();
    } catch {
      showToast("Error inesperado. Intenta de nuevo.", "error");
    } finally {
      setCheckingOut(false);
    }
  }

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-14 w-14 text-cyan-400 mb-4" />
            <p className="text-xl font-semibold text-zinc-100 mb-2">¡Compra completada!</p>
            <p className="text-zinc-400 mb-6 text-center">Tus boletos están en tu cuenta.</p>
            <Link href="/">
              <Button variant="neon">Ver eventos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0 && !checkingOut) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-14 w-14 text-zinc-600 mb-4" />
            <p className="text-zinc-400 mb-2">Tu carrito está vacío</p>
            <Link href="/">
              <Button variant="neon">Ver eventos</Button>
            </Link>
          </CardContent>
        </Card>
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
        Carrito ({totalItems} {totalItems === 1 ? "boleto" : "boletos"})
      </h1>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.eventId}>
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-100 truncate">{item.title}</p>
                <p className="text-sm text-cyan-400">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.eventId, Number(e.target.value))}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-zinc-100"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeItem(item.eventId)}
                  className="text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <p className="text-xl font-semibold text-zinc-100">
            Total: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">${totalPrice.toFixed(2)}</span>
          </p>
          <Button
            variant="neon"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {checkingOut ? "Procesando…" : "Finalizar compra"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
