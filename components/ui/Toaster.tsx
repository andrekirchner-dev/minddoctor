"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastPayload, ToastType } from "@/lib/toast";

const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error:   XCircle,
  info:    Info,
};

const STYLES: Record<ToastType, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
  error:   "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  info:    "border-primary/30 bg-primary/10 text-primary",
};

const ICON_STYLES: Record<ToastType, string> = {
  success: "text-green-500",
  error:   "text-red-500",
  info:    "text-primary",
};

const DURATION = 3500;

interface ToastItem extends ToastPayload {
  exiting: boolean;
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const { msg, type, id } = (e as CustomEvent<ToastPayload>).detail;
      const item: ToastItem = { msg, type, id, exiting: false };

      setToasts(prev => [...prev, item]);

      // Start exit animation before removal
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      }, DURATION - 300);

      // Remove from DOM
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, DURATION);
    }

    window.addEventListener("axon:toast", handler);
    return () => window.removeEventListener("axon:toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg",
              "min-w-[280px] max-w-sm",
              "transition-all duration-300",
              t.exiting
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0",
              STYLES[t.type]
            )}
          >
            <Icon size={16} className={cn("shrink-0", ICON_STYLES[t.type])} />
            <p className="text-sm font-medium flex-1">{t.msg}</p>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
