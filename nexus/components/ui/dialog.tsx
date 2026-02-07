"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Dialog = ({ open, onOpenChange, children, className }: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        role="dialog"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl glass p-6 shadow-2xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-between mb-4", className)}>
    <div>{children}</div>
    {onClose && (
      <Button variant="ghost" size="icon" type="button" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
);

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-xl font-semibold text-zinc-100", className)} {...props} />
);

const DialogContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-zinc-300 text-sm", className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex gap-2 justify-end mt-4", className)} {...props} />
);

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter };
