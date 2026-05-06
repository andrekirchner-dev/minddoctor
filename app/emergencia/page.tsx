"use client";

import { AlertTriangle, Clock, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { protocolos } from "@/lib/data/emergencia";
import { cn } from "@/lib/utils";

const corConfig: Record<string, { badge: string; icon: string; border: string }> = {
  red:    { badge: "bg-red-500/10 text-red-600 border-red-500/20",    icon: "text-red-600",    border: "hover:border-red-400/40" },
  orange: { badge: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: "text-orange-600", border: "hover:border-orange-400/40" },
  yellow: { badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",   icon: "text-amber-600",  border: "hover:border-amber-400/40" },
  purple: { badge: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: "text-purple-600", border: "hover:border-purple-400/40" },
  blue:   { badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",    icon: "text-blue-600",   border: "hover:border-blue-400/40" },
};

const areaLabel: Record<string, string> = {
  agitacao:       "Agitação",
  delirium:       "Delirium",
  suicidio:       "Suicídio",
  serotoninergica:"Serotoninérgica",
  snm:            "SNM",
};

export default function EmergenciaPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #D62828, #F97316)" }}
            >
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Guia de Emergência</h1>
              <p className="text-xs text-muted-foreground">Protocolos interativos para emergências psiquiátricas</p>
            </div>
          </div>

          {/* Aviso clínico */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex gap-2 text-xs text-amber-700">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>
              Estes protocolos são <strong>guias de apoio clínico</strong> baseados em evidência.
              A decisão final é sempre do médico responsável, considerando o contexto individual do paciente.
            </span>
          </div>

          {/* Grid de protocolos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocolos.map((p) => {
              const c = corConfig[p.cor] ?? corConfig.blue;
              return (
                <Link
                  key={p.id}
                  href={`/emergencia/${p.id}`}
                  className={cn(
                    "group bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-md",
                    c.border
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                      c.badge
                    )}>
                      <AlertTriangle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground leading-tight">{p.titulo}</p>
                      <span className={cn(
                        "inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                        c.badge
                      )}>
                        {areaLabel[p.area]}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                    {p.descricao}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock size={11} />
                      ~{p.tempo_min} min
                    </span>
                    <span className={cn("text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all", c.icon)}>
                      Iniciar <ChevronRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
