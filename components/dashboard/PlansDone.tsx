"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const plans = [
  { label: "Consultas",         pct: 64, color: "#4A6CF7" },
  { label: "Análises clínicas", pct: 50, color: "#FF6B6B" },
  { label: "Reuniões",          pct: 33, color: "#E040FB" },
];

const filters = ["Hoje", "Semana", "Mês"];

export function PlansDone() {
  const [active, setActive] = useState("Hoje");

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground text-sm">Progresso de Hoje</h3>
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

      {/* Progress bars */}
      <div className="flex flex-col gap-4 flex-1">
        {plans.map(({ label, pct, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-xs font-bold font-mono" style={{ color }}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full animate-progress"
                style={{
                  width: `${pct}%`,
                  background: color,
                  animationDelay: "0.1s",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add plan button */}
      <button className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200">
        <Plus size={15} />
        Adicionar meta
      </button>
    </div>
  );
}
