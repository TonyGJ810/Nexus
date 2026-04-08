"use client";

import { useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface ComprarBoletoButtonProps {
  eventId: string;
  title: string;
  price: number;
  stock: number;
  size?: "default" | "sm";
  className?: string;
}

export function ComprarBoletoButton({
  eventId,
  title,
  price,
  stock,
  size = "default",
  className,
}: ComprarBoletoButtonProps) {
  const { addItem } = useCart();
  const showToast = useToast();

  const handleClick = useCallback(() => {
    if (stock <= 0) {
      showToast("No hay stock disponible.", "error");
      return;
    }
    addItem({ eventId, quantity: 1, title, price });
    showToast("Añadido al carrito");
  }, [addItem, showToast, eventId, title, price, stock]);

  return (
    <Button
      variant="neon"
      size={size}
      onClick={handleClick}
      disabled={stock <= 0}
      className={className}
    >
      <Ticket className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Comprar boleto
    </Button>
  );
}
