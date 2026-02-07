import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "glass" | "neon";
  size?: "default" | "sm" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed border border-transparent",
          size === "default" && "px-4 py-2",
          size === "sm" && "px-3 py-1.5",
          size === "icon" && "h-10 w-10 p-0",
          variant === "default" &&
            "bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700/90 shadow-[0_0_20px_rgba(0,0,0,0.2)]",
          variant === "ghost" &&
            "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
          variant === "glass" &&
            "bg-white/5 text-zinc-100 hover:bg-white/10 shadow-[0_0_24px_rgba(6,182,212,0.08)]",
          variant === "neon" &&
            "gradient-accent text-white hover:opacity-95 btn-glow",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
