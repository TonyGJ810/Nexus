import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "neon" | "secondary" }
>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
      variant === "default" && "bg-zinc-800 text-zinc-300",
      variant === "neon" &&
        "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
      variant === "secondary" && "bg-zinc-700/50 text-zinc-400",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
