"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Search, Sun, Moon, Bell, Settings, BookOpen, AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notif {
  id: string;
  icon: React.ElementType;
  iconCls: string;
  title: string;
  body: string;
  href: string;
  time: string;
}

const NOTIFS: Notif[] = [
  {
    id: "n1",
    icon: BookOpen,
    iconCls: "bg-blue-500/15 text-blue-500",
    title: "Novo conteúdo disponível",
    body: "10 novos artigos adicionados ao Journal Club.",
    href: "/estudos/journal",
    time: "Hoje",
  },
  {
    id: "n2",
    icon: AlertTriangle,
    iconCls: "bg-amber-500/15 text-amber-500",
    title: "Flashcards vencidos",
    body: "Você tem cards TEP pendentes de revisão.",
    href: "/estudos/flashcards",
    time: "Hoje",
  },
  {
    id: "n3",
    icon: Layers,
    iconCls: "bg-violet-500/15 text-violet-500",
    title: "Módulo atualizado",
    body: "Esquizofrenia: novos casos clínicos disponíveis.",
    href: "/modulos",
    time: "Ontem",
  },
];

function NotifDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl bg-card border border-border shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Notificações</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {NOTIFS.length} novas
        </span>
      </div>

      {/* List */}
      <ul className="divide-y divide-border">
        {NOTIFS.map((n) => {
          const Icon = n.icon;
          return (
            <li key={n.id}>
              <Link
                href={n.href}
                onClick={onClose}
                className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <span className={cn("mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0", n.iconCls)}>
                  <Icon size={15} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{n.body}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border">
        <Link
          href="/settings"
          onClick={onClose}
          className="text-[11px] text-primary hover:underline font-medium"
        >
          Gerenciar notificações →
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

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
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-xl bg-card border transition-colors",
              notifOpen
                ? "border-primary/40 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
            aria-label="Notificações"
            aria-expanded={notifOpen}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D62828]" />
          </button>

          {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} />}
        </div>

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
