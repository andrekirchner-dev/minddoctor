"use client";

import { useState } from "react";
import { ArrowLeft, Search, Stethoscope, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { diagnosticos, type AreaDiagnostico } from "@/lib/data/diagnosticos";
import { cn } from "@/lib/utils";

const areas: { id: AreaDiagnostico | "todas"; label: string }[] = [
  { id: "todas",               label: "Todos" },
  { id: "humor",               label: "Humor" },
  { id: "ansiedade",           label: "Ansiedade" },
  { id: "psicose",             label: "Psicose" },
  { id: "trauma",              label: "Trauma" },
  { id: "personalidade",       label: "Personalidade" },
  { id: "neurodesenvolvimento",label: "Neurodesenv." },
  { id: "substancias",         label: "Substâncias" },
];

const areaCor: Record<string, string> = {
  humor:               "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ansiedade:           "bg-amber-500/10 text-amber-600 border-amber-500/20",
  psicose:             "bg-purple-500/10 text-purple-600 border-purple-500/20",
  trauma:              "bg-rose-500/10 text-rose-600 border-rose-500/20",
  personalidade:       "bg-orange-500/10 text-orange-600 border-orange-500/20",
  neurodesenvolvimento:"bg-teal-500/10 text-teal-600 border-teal-500/20",
  substancias:         "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function DiagnosticosPage() {
  const [area, setArea] = useState<AreaDiagnostico | "todas">("todas");
  const [busca, setBusca] = useState("");

  const filtrados = diagnosticos.filter((d) => {
    if (area !== "todas" && d.area !== area) return false;
    if (busca && !d.nome.toLowerCase().includes(busca.toLowerCase()) &&
        !(d.sigla ?? "").toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/biblioteca"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Critérios Diagnósticos</h1>
              <p className="text-xs text-muted-foreground">DSM-5-TR — {diagnosticos.length} transtornos com critérios completos</p>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar transtorno..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Filtros por área */}
          <div className="flex gap-2 flex-wrap">
            {areas.map((a) => (
              <button
                key={a.id}
                onClick={() => setArea(a.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  area === a.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtrados.map((d) => (
              <Link
                key={d.codigo}
                href={`/biblioteca/diagnosticos/${d.sigla?.toLowerCase().replace(/[^a-z0-9]/g, "-") ?? d.codigo.replace(/[^a-z0-9]/g, "-")}`}
                className="group bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {d.sigla && (
                        <span className="font-mono font-bold text-sm text-foreground">{d.sigla}</span>
                      )}
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                        areaCor[d.area] ?? "bg-muted text-muted-foreground border-border"
                      )}>
                        {d.area}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{d.codigo.split(" ")[0]}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{d.nome}</p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{d.descricao}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{d.criterios_dsm5.length} critérios</span>
                  <span>·</span>
                  <span>{d.diagnostico_diferencial.length} diferenciais</span>
                </div>
              </Link>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-2xl py-12 text-center text-muted-foreground text-sm">
              Nenhum transtorno encontrado.
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
