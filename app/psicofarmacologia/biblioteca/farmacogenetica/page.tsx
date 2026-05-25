import Link from "next/link";
import { ChevronLeft, Dna, AlertTriangle, FlaskConical, Pill } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  sistemasFarmacogenetica,
  fenotipoColors,
  nivelEvidenciaConfig,
  type FarmacoFarmacogenetica,
} from "@/lib/data/farmacogenetica";

// ─── Componente: Badge de fenótipo ──────────────────────────────────────────

function FenotipoBadge({ label }: { label: "PM" | "IM" | "EM" | "UM" }) {
  const c = fenotipoColors[label];
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}
    >
      {label}
    </span>
  );
}

// ─── Componente: Card de sistema genético ────────────────────────────────────

function SistemaCard({ sistema }: { sistema: (typeof sistemasFarmacogenetica)[number] }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header do sistema */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${sistema.gradiente}`}
          >
            <FlaskConical size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-bold text-foreground text-base">{sistema.gene}</h2>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {sistema.nome_completo}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {sistema.localizacao}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{sistema.descricao}</p>
          </div>
        </div>

        {/* Relevância clínica */}
        <div className="mt-3 bg-primary/5 border border-primary/10 rounded-xl px-4 py-2.5">
          <p className="text-xs text-primary/80 leading-relaxed">{sistema.relevancia_clinica}</p>
        </div>
      </div>

      {/* Substratos / Inibidores / Indutores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Substratos Psiquiátricos
          </p>
          <div className="flex flex-wrap gap-1">
            {sistema.substratos_psiq.map((s) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground border border-border">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-2">
            Inibidores
          </p>
          <div className="flex flex-wrap gap-1">
            {sistema.inibidores_psiq.map((s) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide mb-2">
            Indutores
          </p>
          <div className="flex flex-wrap gap-1">
            {sistema.indutores_psiq.map((s) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de variantes */}
      <div className="border-t border-border">
        <div className="px-5 py-3 bg-muted/30">
          <p className="text-xs font-semibold text-foreground">Variantes e Fenótipos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold">Variante</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold">Fenótipo</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold">Frequência</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold hidden md:table-cell">Impacto Clínico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sistema.variantes.map((v) => {
                const fLabel = v.fenotipo.includes("Pobre")
                  ? "PM"
                  : v.fenotipo.includes("Intermediário")
                  ? "IM"
                  : v.fenotipo.includes("Ultra")
                  ? "UM"
                  : "EM";
                return (
                  <tr key={v.variante} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-foreground whitespace-nowrap">
                      {v.variante}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <FenotipoBadge label={fLabel as "PM" | "IM" | "EM" | "UM"} />
                      <span className="ml-2 text-muted-foreground">{v.fenotipo.split("(")[0].trim()}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{v.frequencia}</td>
                    <td className="px-4 py-3 text-muted-foreground leading-relaxed hidden md:table-cell max-w-xs">
                      {v.impacto_clinico}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Componente: Tabela de fármacos por sistema ──────────────────────────────

function TabelaFarmacos({ farmacos, gene }: { farmacos: FarmacoFarmacogenetica[]; gene: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-3">
        <Pill size={14} className="text-primary" />
        <p className="text-sm font-semibold text-foreground">Fármacos — {gene}</p>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border ml-auto">
          {farmacos.length} fármacos
        </span>
      </div>
      <div className="divide-y divide-border">
        {farmacos.map((f) => {
          const evConfig = nivelEvidenciaConfig[f.nivel_evidencia];
          return (
            <div key={f.id} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <p className="font-bold text-foreground text-sm">{f.nome}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${evConfig.cls}`}>
                  {evConfig.label}
                </span>
                {f.genes_secundarios.length > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    + {f.genes_secundarios.join(", ")}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{f.metabolismo}</p>

              {/* Grid PM/IM/EM/UM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                {(
                  [
                    { key: "PM", rec: f.recomendacao_pm },
                    { key: "IM", rec: f.recomendacao_im },
                    { key: "EM", rec: f.recomendacao_em },
                    { key: "UM", rec: f.recomendacao_um },
                  ] as const
                ).map(({ key, rec }) => {
                  const c = fenotipoColors[key];
                  return (
                    <div key={key} className={`rounded-xl border p-3 ${c.bg} ${c.border}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FenotipoBadge label={key} />
                      </div>
                      <p className={`text-[11px] leading-relaxed ${c.text}`}>{rec}</p>
                    </div>
                  );
                })}
              </div>

              {/* Fonte */}
              <p className="text-[10px] text-muted-foreground/60 mt-3 italic">{f.fonte}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function FarmacogeneticaPage() {
  const totalFarmacos = sistemasFarmacogenetica.reduce(
    (acc, s) => acc + s.farmacos.length,
    0
  );
  const totalVariantes = sistemasFarmacogenetica.reduce(
    (acc, s) => acc + s.variantes.length,
    0
  );

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}
            >
              <Dna size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Farmacogenética</h1>
              <p className="text-xs text-muted-foreground">
                {sistemasFarmacogenetica.length} sistemas enzimáticos · {totalVariantes} variantes · {totalFarmacos} fármacos
              </p>
            </div>
          </div>

          {/* ── Aviso clínico ───────────────────────────────────────────────── */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-5 py-4 flex gap-3 items-start">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                Aviso Clínico
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                Testes farmacogenéticos devem <strong>complementar, não substituir</strong>, o julgamento
                clínico. Fenótipos previstos pelo genótipo podem ser modificados por inibição ou indução
                enzimática medicamentosa (fenótipo funcional), condições clínicas e variáveis
                farmacodinâmicas. Sempre interpretar no contexto clínico completo.
              </p>
            </div>
          </div>

          {/* ── Introdução ──────────────────────────────────────────────────── */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-bold text-foreground mb-2">O que é farmacogenética?</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Farmacogenética estuda como variações no genoma individual influenciam a resposta aos fármacos.
              Em psiquiatria, os polimorfismos do citocromo P450 (CYP2D6, CYP2C19, CYP3A4) são os mais
              clinicamente relevantes, determinando se um paciente será <strong>poor metabolizer (PM)</strong>,{" "}
              <strong>intermediate metabolizer (IM)</strong>,{" "}
              <strong>extensive metabolizer (EM)</strong> — fenótipo normal — ou{" "}
              <strong>ultra-rapid metabolizer (UM)</strong>.
            </p>
            <div className="flex flex-wrap gap-2">
              {(["PM", "IM", "EM", "UM"] as const).map((label) => {
                const c = fenotipoColors[label];
                const desc: Record<string, string> = {
                  PM: "Poor Metabolizer — exposição aumentada, risco de toxicidade",
                  IM: "Intermediate Metabolizer — exposição levemente aumentada",
                  EM: "Extensive Metabolizer — metabolismo normal (referência)",
                  UM: "Ultra-rapid Metabolizer — exposição reduzida, risco de falha",
                };
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-xl border ${c.bg} ${c.border}`}
                  >
                    <span className={`font-bold ${c.text}`}>{label}</span>
                    <span className="text-muted-foreground">{desc[label]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Sistemas genéticos + fármacos ──────────────────────────────── */}
          {sistemasFarmacogenetica.map((sistema) => (
            <div key={sistema.id} className="space-y-4">
              <SistemaCard sistema={sistema} />
              <TabelaFarmacos farmacos={sistema.farmacos} gene={sistema.gene} />
            </div>
          ))}

          {/* ── Rodapé — fontes ─────────────────────────────────────────────── */}
          <div className="bg-muted/30 border border-border rounded-2xl p-5">
            <p className="text-xs font-semibold text-foreground mb-2">Fontes Principais</p>
            <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
              <li>CPIC (Clinical Pharmacogenomics Implementation Consortium) Guidelines — cpicpgx.org</li>
              <li>PharmGKB — pharmgkb.org</li>
              <li>FDA Table of Pharmacogenomic Biomarkers in Drug Labeling</li>
              <li>Stahl&apos;s Essential Psychopharmacology, 5ª ed. — Cambridge University Press</li>
              <li>The Maudsley Prescribing Guidelines in Psychiatry, 14ª ed.</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
