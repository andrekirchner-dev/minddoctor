"use client";

import { useState } from "react";
import { ClipboardList, CalendarCheck, TrendingUp } from "lucide-react";
import { useConsultasStats } from "@/lib/hooks/useConsultasStats";

const filters = ["Hoje", "Semana", "Mês"] as const;

export function ScheduledEvents() {
  const [active, setActive] = useState<typeof filters[number]>("Hoje");
  const stats = useConsultasStats();

  const count = active === "Hoje" ? stats.hoje : active === "Semana" ? stats.semana : stats.mes;

  const RADIUS = 36;
  const CIRC = 2 * Math.PI * RADIUS;
  const pct = stats.total === 0 ? 0 : Math.min(100, (count / Math.max(stats.mes, 1)) * 100);
  const offset = CIRC - (pct / 100) * CIRC;

  const events = [
    { icon: ClipboardList, label: "Consultas",      value: count,       color: "#4A6CF7" },
    { icon: CalendarCheck, label: "Este mês",        value: stats.mes,   color: "#7B5EA7" },
    { icon: TrendingUp,    label: "Total acumulado", value: stats.total, color: "#22C55E" },
  ];

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Atividade Clínica</h3>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                active === f ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
            <circle
              cx="48" cy="48" r={RADIUS}
              fill="none" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRC} strokeDashoffset={stats.loading ? CIRC : offset}
              style={{
                stroke: "url(#donutGrad)",
                transform: "rotate(-90deg)",
                transformOrigin: "48px 48px",
                transition: "stroke-dashoffset 0.8s ease-out",
              }}
            />
            <defs>
              <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4A6CF7" />
                <stop offset="100%" stopColor="#7B5EA7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {stats.loading ? (
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
            ) : (
              <>
                <span className="text-xl font-bold text-foreground font-mono">{count}</span>
                <span className="text-[10px] text-muted-foreground leading-none">consultas</span>
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3 flex-1">
          {events.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
              {stats.loading ? (
                <div className="h-4 w-6 rounded bg-muted animate-pulse" />
              ) : (
                <span className="text-sm font-bold text-foreground font-mono">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
