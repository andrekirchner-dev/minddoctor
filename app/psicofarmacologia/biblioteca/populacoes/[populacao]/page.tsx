import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Users, AlertTriangle, Zap, Info, ShieldAlert,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  populacoes, getPopulacao, condutaLabel, condutaColor,
} from "@/lib/data/populacoes";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return populacoes.map((p) => ({ populacao: p.id }));
}

export default async function PopulacaoPage({
  params,
}: {
  params: Promise<{ populacao: string }>;
}) {
  const { populacao: populacaoId } = await params;
  const pop = getPopulacao(populacaoId);
  if (!pop) notFound();

  // Group regras by conduta for visual clarity
  const ordem: Array<"preferir" | "evitar" | "contraindicado" | "ajustar" | "monitorar"> = [
    "preferir", "ajustar", "monitorar", "evitar", "contraindicado",
  ];

  const porConduta = pop.regras.reduce<Record<string, typeof pop.regras>>(
    (acc, r) => {
      if (!acc[r.conduta]) acc[r.conduta] = [];
      acc[r.conduta].push(r);
      return acc;
    },
    {}
  );

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca/populacoes"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${pop.gradiente}`}>
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{pop.nome}</h1>
              <p className="text-xs text-muted-foreground">{pop.regras.length} regras de prescrição</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-card border border-border rounded-2xl px-5 py-4">
            <p className="text-sm text-foreground leading-relaxed">{pop.descricao}</p>
          </div>

          {/* Regras por conduta */}
          {ordem.filter((c) => porConduta[c]).map((conduta) => (
            <div key={conduta} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", condutaColor[conduta])}>
                  {condutaLabel[conduta]}
                </span>
              </div>
              <div className="divide-y divide-border">
                {porConduta[conduta].map((regra) => (
                  <div key={regra.farmaco} className="px-5 py-4 flex items-start gap-3">
                    <span className={cn("shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5 whitespace-nowrap", condutaColor[regra.conduta])}>
                      {regra.farmaco}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{regra.justificativa}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pearls */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Zap size={13} className="text-amber-500" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pearls clínicos</p>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {pop.pearls.map((pearl) => (
                <li key={pearl} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span className="text-xs text-foreground leading-relaxed">{pearl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Armadilhas */}
          <div className="bg-red-500/5 border border-red-500/15 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-red-500/15 flex items-center gap-2">
              <AlertTriangle size={13} className="text-red-600" />
              <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">Armadilhas comuns</p>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {pop.armadilhas.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span className="text-xs text-foreground leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nota */}
          {pop.nota && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 flex gap-3">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">{pop.nota}</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
