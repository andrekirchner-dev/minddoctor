"use client";

import { useTheme } from "next-themes";
import { Search, Sun, Moon, Bell, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-background/80 backdrop-blur-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar protocolos, medicamentos, escalas..."
            className={cn(
              "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-card border border-border",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications → settings */}
        <Link
          href="/settings"
          className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          aria-label="Notificações"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D62828]" />
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          aria-label="Configurações"
        >
          <Settings size={18} />
        </Link>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-300"
          aria-label="Alternar tema"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
