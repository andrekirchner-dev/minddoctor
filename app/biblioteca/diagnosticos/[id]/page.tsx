import { ArrowLeft, CheckCircle, AlertTriangle, Info, Pill, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { diagnosticos } from "@/lib/data/diagnosticos";
import { cn } from "@/lib/utils";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

const areaCor: Record<string, string> = {
  humor:               "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ansiedade:           "bg-amber-500/10 text-amber-600 border-amber-500/20",
  psicose:             "bg-purple-500/10 text-purple-600 border-purple-500/20",
  trauma:              "bg-rose-500/10 text-rose-600 border-rose-500/20",
  personalidade:       "bg-orange-500/10 text-orange-600 border-orange-500/20",
  neurodesenvolvimento:"bg-teal-500/10 text-teal-600 border-teal-500/20",
  substancias:         "bg-red-500/10 text-red-600 border-red-500/20",
};

export default async function DiagnosticoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const d = diagnosticos.find(
    (x) => toSlug(x.sigla ?? "") === id || toSlug(x.codigo.split(" ")[0]) === id
  );

  if (!d) notFound();

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/biblioteca/diagnosticos"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {d.sigla && <span className="text-xl font-bold font-mono text-foreground">{d.sigla}</span>}
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                  areaCor[d.area] ?? "bg-muted text-muted-foreground border-border"
                )}>
                  {d.area}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{d.nome}</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-sm text-foreground leading-relaxed">{d.descricao}</p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
              <span className="font-mono">{d.codigo}</span>
              {d.cid11 && <span className="font-mono">CID-11: {d.cid11}</span>}
            </div>
          </div>

          {/* Critérios DSM-5-TR */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-sm font-bold text-foreground">Critérios DSM-5-TR</p>
            </div>
            <div className="divide-y divide-border">
              {d.criterios_dsm5.map((c) => (
                <div key={c.grupo} className="px-5 py-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      c.obrigatorio
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {c.grupo}
                    </span>
                    {c.obrigatorio && (
                      <span className="text-[10px] text-muted-foreground">obrigatório</span>
                    )}
                    {c.minimo && (
                      <span className="text-[10px] text-muted-foreground">≥{c.minimo} dos itens</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{c.descricao}</p>
                  {c.itens && c.itens.length > 0 && (
                    <ul className="space-y-1.5 pl-1">
                      {c.itens.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                          <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-muted-foreground/60" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nota clínica */}
          {d.nota_clinica && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex gap-2">
              <Info size={14} className="shrink-0 mt-0.5 text-primary" />
              <p className="text-xs text-foreground leading-relaxed">{d.nota_clinica}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tratamento */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">Tratamento de 1ª linha</p>
              </div>
              <div className="divide-y divide-border">
                <div className="px-4 py-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    <Pill size={11} /> Farmacológico
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{d.tratamento_primeira_linha.farmacologico}</p>
                </div>
                <div className="px-4 py-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    <HeartHandshake size={11} /> Psicoterapia
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{d.tratamento_primeira_linha.psicoterapia}</p>
                </div>
              </div>
            </div>

            {/* Diagnóstico diferencial */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">Diagnóstico diferencial</p>
              </div>
              <ul className="px-4 py-3 space-y-2">
                {d.diagnostico_diferencial.map((dd, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground items-start">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5 text-amber-500" />
                    {dd}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comorbidades */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Comorbidades frequentes</p>
            <div className="flex flex-wrap gap-2">
              {d.comorbidades_frequentes.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-muted border border-border text-foreground">
                  <CheckCircle size={11} className="text-green-600" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Referência */}
          <p className="text-[11px] text-muted-foreground px-1">
            <span className="font-semibold">Referência: </span>{d.referencia}
          </p>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
