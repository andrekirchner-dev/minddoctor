"use client";

import { useState } from "react";
import { Stethoscope, FlaskConical, Users } from "lucide-react";

const events = [
  { icon: Stethoscope, label: "Consultas",        value: 25, color: "#4A6CF7" },
  { icon: FlaskConical,label: "Análises clínicas", value: 10, color: "#7B5EA7" },
  { icon: Users,        label: "Reuniões",          value: 3,  color: "#22C55E" },
];

const TOTAL = events.reduce((s, e) => s + e.value, 0);
const BUSYNESS = 95;

// SVG donut: r=36, circumference ≈ 226
const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;
const offset = CIRC - (BUSYNESS / 100) * CIRC;

const filters = ["Hoje", "Semana", "Mês"];

export function ScheduledEvents() {
  const [active, setActive] = useState("Hoje");

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Meus Eventos</h3>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                active === f
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle
              cx="48" cy="48" r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-muted"
            />
            <circle
              cx="48" cy="48" r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{
                stroke: "url(#donutGrad)",
                transform: "rotate(-90deg)",
                transformOrigin: "48px 48px",
                animation: "donutDraw 1s ease-out forwards",
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
            <span className="text-xl font-bold text-foreground font-mono">{BUSYNESS}%</span>
            <span className="text-[10px] text-muted-foreground leading-none">ocupação</span>
          </div>
        </div>

        {/* Event list */}
        <div className="flex flex-col gap-3 flex-1">
          {events.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}18` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
              <span className="text-sm font-bold text-foreground font-mono">{value}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Total: <strong className="text-foreground">{TOTAL}</strong> eventos
          </p>
        </div>
      </div>
    </div>
  );
}
