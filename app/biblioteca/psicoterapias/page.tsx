"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { psicoterapias, type AbordagemTipo, type Psicoterapia } from "@/lib/data/psicoterapias";
import { cn } from "@/lib/utils";

const abordagens: { id: AbordagemTipo | "todas"; label: string }[] = [
  { id: "todas",                   label: "Todas" },
  { id: "cognitivo-comportamental", label: "TCC" },
  { id: "terceira-onda",            label: "3ª Onda" },
  { id: "psicodinamica",            label: "Psicodinâmica" },
  { id: "humanista",                label: "Humanista" },
  { id: "sistemica",                label: "Sistêmica" },
  { id: "integrativa",              label: "Integrativa" },
];

const evidenciaCor: Record<Psicoterapia["evidencia"], string> = {
  alta:      "bg-green-500/10 text-green-700 border-green-500/20",
  moderada:  "bg-amber-500/10 text-amber-700 border-amber-500/20",
  emergente: "bg-blue-500/10 text-blue-700 border-blue-500/20",
};

function TerapiaCard({ t }: { t: Psicoterapia }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={cn(
      "bg-card border rounded-2xl overflow-hidden transition-all duration-200",
      aberto ? "border-primary/30 shadow-sm" : "border-border"
    )}>
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground">
              {t.sigla ?? t.nome}
            </span>
            {t.sigla && (
              <span className="text-xs text-muted-foreground hidden sm:block">{t.nome}</span>
            )}
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              evidenciaCor[t.evidencia]
            )}>
              Evidência {t.evidencia}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.descricao}</p>
        </div>
        {aberto
          ? <ChevronUp size={15} className="shrink-0 text-muted-foreground mt-0.5" />
          : <ChevronDown size={15} className="shrink-0 text-muted-foreground mt-0.5" />
        }
      </button>

      {aberto && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {/* Mecanismo */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Mecanismo / Premissa</p>
            <p className="text-sm text-foreground leading-relaxed">{t.mecanismo}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Técnicas */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Técnicas principais</p>
              <ul className="space-y-1">
                {t.tecnicas_principais.map((tc, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground">
                    <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-primary/60" />
                    {tc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Indicações */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Indicações principais</p>
              <ul className="space-y-1">
                {t.indicacoes.slice(0, 6).map((ind, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-foreground items-start">
                    <CheckCircle size={11} className="shrink-0 mt-0.5 text-green-600" />
                    {ind}
                  </li>
                ))}
                {t.indicacoes.length > 6 && (
                  <li className="text-xs text-muted-foreground">+{t.indicacoes.length - 6} mais...</li>
                )}
              </ul>
            </div>
          </div>

          {/* Duração */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/40 rounded-lg px-3 py-2">
              <p className="text-muted-foreground text-[10px] mb-0.5">Duração das sessões</p>
              <p className="font-semibold text-foreground">{t.duracao_sessoes}</p>
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2">
              <p className="text-muted-foreground text-[10px] mb-0.5">Nº de sessões</p>
              <p className="font-semibold text-foreground">{t.numero_sessoes}</p>
            </div>
          </div>

          {/* Nota clínica */}
          {t.nota_clinica && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex gap-2">
              <BookOpen size={13} className="shrink-0 mt-0.5 text-primary" />
              <p className="text-xs text-foreground leading-relaxed">{t.nota_clinica}</p>
            </div>
          )}

          {/* Referência */}
          <p className="text-[11px] text-muted-foreground">
            <span className="font-semibold">Ref: </span>{t.referencia}
          </p>
        </div>
      )}
    </div>
  );
}

export default function PsicoterapiasPage() {
  const [filtro, setFiltro] = useState<AbordagemTipo | "todas">("todas");

  const filtradas = filtro === "todas"
    ? psicoterapias
    : psicoterapias.filter((t) => t.abordagem === filtro);

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
              <h1 className="text-xl font-bold text-foreground">Guia de Psicoterapias</h1>
              <p className="text-xs text-muted-foreground">{psicoterapias.length} abordagens — indicações e evidências</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {abordagens.map((a) => (
              <button
                key={a.id}
                onClick={() => setFiltro(a.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  filtro === a.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Lista */}
          <div className="space-y-3">
            {filtradas.map((t) => <TerapiaCard key={t.id} t={t} />)}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
