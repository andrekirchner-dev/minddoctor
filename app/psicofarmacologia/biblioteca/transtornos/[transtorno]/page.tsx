import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ClipboardList, CheckCircle, AlertTriangle,
  BookOpen, Info, Zap, ArrowRight,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { transtornos, getTranstorno } from "@/lib/data/transtornos";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return transtornos.map((t) => ({ transtorno: t.id }));
}

const linhaColor: Record<string, string> = {
  "1ª linha":      "bg-green-500/10 text-green-700 border-green-500/20",
  "2ª linha":      "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "3ª linha":      "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "Adjuvante":     "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "Potencialização": "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  "Alternativa":   "bg-gray-500/10 text-gray-700 border-gray-500/20",
};

export default async function TranstornoPage({
  params,
}: {
  params: Promise<{ transtorno: string }>;
}) {
  const { transtorno: transtornoId } = await params;
  const t = getTranstorno(transtornoId);
  if (!t) notFound();

  // Group by linha
  const porLinha = t.linhas_terapeuticas.reduce<Record<string, typeof t.linhas_terapeuticas>>(
    (acc, lt) => {
      if (!acc[lt.linha]) acc[lt.linha] = [];
      acc[lt.linha].push(lt);
      return acc;
    },
    {}
  );

  const linhaOrder = ["1ª linha", "2ª linha", "3ª linha", "Adjuvante", "Potencialização", "Alternativa"];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca/transtornos"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${t.gradiente}`}>
              <ClipboardList size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t.nome}</h1>
              <p className="text-xs text-muted-foreground">
                {t.nome_curto}{t.prevalencia ? ` · Prevalência: ${t.prevalencia}` : ""}
              </p>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-card border border-border rounded-2xl px-5 py-4">
            <p className="text-sm text-foreground leading-relaxed">{t.descricao}</p>
          </div>

          {/* Linhas terapêuticas */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <CheckCircle size={13} className="text-green-600" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Linhas terapêuticas</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              {linhaOrder.filter((l) => porLinha[l]).map((linha) => (
                <div key={linha} className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{linha}</p>
                  <div className="space-y-2">
                    {porLinha[linha].map((lt) => (
                      <div key={lt.farmaco} className="flex items-start gap-2">
                        <span className={cn("shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5", linhaColor[lt.linha])}>
                          {lt.linha}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-foreground">{lt.farmaco}</span>
                          {lt.notas && (
                            <span className="text-[11px] text-muted-foreground ml-1.5">— {lt.notas}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algoritmo */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <ArrowRight size={13} className="text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Algoritmo de tratamento</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              {t.algoritmo.map((passo, idx) => (
                <div key={passo.passo} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br ${t.gradiente}`}>
                      {passo.passo}
                    </div>
                    {idx < t.algoritmo.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1 mb-0 min-h-[20px]" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-foreground">{passo.titulo}</p>
                      {passo.duracao && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          {passo.duracao}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{passo.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pearls */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Zap size={13} className="text-amber-500" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pearls clínicos</p>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {t.pearls.map((pearl) => (
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
              {t.armadilhas.map((armadilha) => (
                <li key={armadilha} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span className="text-xs text-foreground leading-relaxed">{armadilha}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nota especial */}
          {t.nota_especial && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 flex gap-3">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">Nota especial</p>
                <p className="text-xs text-foreground leading-relaxed">{t.nota_especial}</p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
