"use client";

import Link from "next/link";
import { ChevronRight, ClipboardList, Plus } from "lucide-react";
import { useConsultasStats } from "@/lib/hooks/useConsultasStats";

const TIPOS_LABEL: Record<string, string> = {
  "nova-consulta": "Nova consulta",
  "retorno": "Retorno",
  "urgencia": "Urgência",
  "enfermaria": "Enfermaria",
  "hospital-dia": "Hospital Dia",
  "inss": "INSS / Perícia",
  "avaliacao-risco": "Avaliação de risco",
  "ajuste-med": "Ajuste medicamentoso",
};

function formatDate(seconds: number): string {
  const d = new Date(seconds * 1000);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function PlansDone() {
  const { recentes, loading, total } = useConsultasStats();

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Consultas Recentes</h3>
        {total > 0 && (
          <Link href="/consulta/historico" className="text-[11px] text-primary hover:underline font-medium">
            Ver todas ({total})
          </Link>
        )}
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Carregando...</p>
        </div>
      )}

      {!loading && recentes.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <ClipboardList size={20} className="text-muted-foreground/50" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Nenhuma consulta registrada ainda.<br />
            Inicie uma consulta para ver o histórico aqui.
          </p>
        </div>
      )}

      {!loading && recentes.length > 0 && (
        <div className="flex flex-col gap-2 flex-1">
          {recentes.map(c => (
            <Link
              key={c.id}
              href={`/consulta/historico?id=${c.id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ClipboardList size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {c.patientName || "Paciente sem identificação"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {TIPOS_LABEL[c.tipo] || c.tipo}
                  {c.diagnosticoPrincipal ? ` · ${c.diagnosticoPrincipal}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] text-muted-foreground">
                  {c.createdAt?.seconds ? formatDate(c.createdAt.seconds) : "—"}
                </span>
                <ChevronRight size={12} className="text-muted-foreground/40 group-hover:text-primary transition-colors mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/consulta/nova"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200"
      >
        <Plus size={15} />
        Nova Consulta
      </Link>
    </div>
  );
}
