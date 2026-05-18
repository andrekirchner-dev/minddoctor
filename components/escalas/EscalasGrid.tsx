"use client";

import { useState } from "react";
import { ClipboardList, Clock, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Escala } from "@/lib/data/escalas";

const areas = [
  { id: "todas",     label: "Todas" },
  { id: "humor",     label: "Humor" },
  { id: "ansiedade", label: "Ansiedade" },
  { id: "psicose",   label: "Psicose" },
  { id: "suicidio",  label: "Suicídio" },
  { id: "alcool",    label: "Álcool" },
  { id: "cognicao",  label: "Cognição" },
] as const;

const areaColors: Record<string, string> = {
  humor:     "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ansiedade: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  psicose:   "bg-purple-500/10 text-purple-600 border-purple-500/20",
  suicidio:  "bg-red-500/10 text-red-600 border-red-500/20",
  alcool:    "bg-orange-500/10 text-orange-600 border-orange-500/20",
  cognicao:  "bg-teal-500/10 text-teal-600 border-teal-500/20",
};

const planoColors: Record<string, string> = {
  free: "bg-green-500/10 text-green-600",
  pro:  "bg-primary/10 text-primary",
};

function EscalaCard({ escala }: { escala: Escala }) {
  return (
    <Link
      href={`/escalas/${escala.id}`}
      className="group bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(74,108,247,0.08)] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg font-bold text-foreground font-mono">{escala.sigla}</span>
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
              areaColors[escala.area]
            )}>
              {escala.area}
            </span>
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
              planoColors[escala.plano]
            )}>
              {escala.plano === "free" ? "Grátis" : "Pro"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{escala.descricao}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <ClipboardList size={12} />
          {escala.itens.length} itens
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          ~{escala.tempo_min} min
        </span>
      </div>

      <div className="mt-auto pt-2 border-t border-border">
        <span className="text-xs font-semibold text-primary group-hover:underline">
          Aplicar escala →
        </span>
      </div>
    </Link>
  );
}

export function EscalasGrid({ escalas }: { escalas: Escala[] }) {
  const [area, setArea] = useState<string>("todas");

  const filtradas = area === "todas"
    ? escalas
    : escalas.filter((e) => e.area === area);

  return (
    <div className="space-y-5">
      {/* Filtros por área */}
      <div className="flex gap-2 flex-wrap">
        <Filter size={14} className="self-center text-muted-foreground shrink-0" />
        {areas.map((a) => (
          <button
            key={a.id}
            onClick={() => setArea(a.id)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
              area === a.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Grid de escalas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map((e) => (
          <EscalaCard key={e.id} escala={e} />
        ))}
      </div>

      {filtradas.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-2xl py-16 text-center text-muted-foreground text-sm">
          Nenhuma escala nesta área ainda.
        </div>
      )}
    </div>
  );
}
