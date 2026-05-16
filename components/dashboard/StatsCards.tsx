"use client";

import { ClipboardList, UserCheck, CalendarCheck } from "lucide-react";
import { useConsultasStats } from "@/lib/hooks/useConsultasStats";

function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          <div className="h-2.5 w-32 rounded bg-muted animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse shrink-0" />
      </div>
      <div className="h-1.5 bg-muted rounded-full" />
      <div className="h-2.5 w-20 rounded bg-muted animate-pulse mt-1.5" />
    </div>
  );
}

export function StatsCards() {
  const stats = useConsultasStats();

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const cards = [
    {
      title: "Consultas Hoje",
      value: String(stats.hoje),
      label: "realizadas neste dia",
      icon: ClipboardList,
      color: "#4A6CF7",
      bg: "#4A6CF715",
    },
    {
      title: "Esta Semana",
      value: String(stats.semana),
      label: "consultas nos últimos 7 dias",
      icon: CalendarCheck,
      color: "#22C55E",
      bg: "#22C55E15",
    },
    {
      title: "Total de Consultas",
      value: String(stats.total),
      label: "prontuários confirmados",
      icon: UserCheck,
      color: "#7B5EA7",
      bg: "#7B5EA715",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200 border border-border"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{c.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1 font-mono">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.bg }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: stats.total === 0 ? "0%" : `${Math.min(100, (parseInt(c.value) / Math.max(stats.mes, 1)) * 100)}%`,
                  background: c.color,
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {stats.mes > 0 ? `${stats.mes} este mês` : "Nenhuma consulta este mês"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
