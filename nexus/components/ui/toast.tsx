"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

type ToastType = "success" | "error";

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
}

const ToastContext = React.createContext<{
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    message: "",
    type: "success",
  });
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = React.useCallback((message: string, type: ToastType = "success") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ open: true, message, type });
    timeoutRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 4000);
  }, []);

  React.useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      {toast.open && (
        <div
          role="alert"
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg glass border border-cyan-500/20"
          )}
        >
          <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-medium text-zinc-100">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
}
