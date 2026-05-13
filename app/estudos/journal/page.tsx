"use client";

import { useState } from "react";
import { BookMarked, ExternalLink, ChevronDown, ChevronUp, Filter, Star } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  artigos,
  journalAreas,
  tipoLabels,
  areaColors,
  type JournalArtigo,
  type JournalArea,
} from "@/lib/data/journal";
import { cn } from "@/lib/utils";

const tipoCls: Record<JournalArtigo["tipo"], string> = {
  ecr:        "bg-blue-500/10 text-blue-600 border-blue-500/20",
  metanalise: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  diretriz:   "bg-amber-500/10 text-amber-600 border-amber-500/20",
  revisao:    "bg-teal-500/10 text-teal-600 border-teal-500/20",
  coorte:     "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

function ArtigoCard({ a }: { a: JournalArtigo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", areaColors[a.area])}>
                {a.area}
              </span>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", tipoCls[a.tipo])}>
                {tipoLabels[a.tipo]}
              </span>
              {a.impacto === "alto" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 flex items-center gap-1">
                  <Star size={9} fill="currentColor" /> Alto impacto
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">{a.ano}</span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-3">{a.titulo}</p>
            <p className="text-xs text-muted-foreground mt-1">{a.autores}</p>
            <p className="text-xs text-primary/70 font-medium mt-0.5 italic">{a.revista}</p>
          </div>
        </div>
      </div>

      {/* Resumo sempre visível */}
      <div className="px-5 py-4 space-y-3">
        <p className="text-xs text-foreground leading-relaxed">{a.resumo}</p>

        {/* Toggle detalhes */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Menos detalhes" : "Mensagem clínica + limitações"}
        </button>

        {expanded && (
          <div className="space-y-3 pt-1">
            {/* Mensagens-chave */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Mensagem Clínica</p>
              <ul className="space-y-1.5">
                {a.mensagem_chave.map((m, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitações */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Limitações</p>
              <p className="text-xs text-foreground leading-relaxed">{a.limitacoes}</p>
            </div>

            {/* Relevância */}
            <div className="bg-muted/30 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-foreground mb-1">Relevância Clínica</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.relevancia_clinica}</p>
            </div>

            {/* DOI link */}
            {a.doi && (
              <a
                href={`https://doi.org/${a.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink size={11} />
                doi.org/{a.doi}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JournalPage() {
  const [area, setArea] = useState<JournalArea | "todas">("todas");

  const filtrados = area === "todas"
    ? artigos
    : artigos.filter((a) => a.area === area);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
            >
              <BookMarked size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Journal Club</h1>
              <p className="text-xs text-muted-foreground">
                {artigos.filter((a) => a.impacto === "alto").length} estudos de alto impacto · {artigos.length} artigos curados
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-muted-foreground shrink-0" />
            {journalAreas.map((ja) => (
              <button
                key={ja.id}
                onClick={() => setArea(ja.id as JournalArea | "todas")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  area === ja.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {ja.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {filtrados.length} {filtrados.length === 1 ? "artigo" : "artigos"}
          </p>

          {/* Lista */}
          <div className="space-y-4">
            {filtrados.map((a) => (
              <ArtigoCard key={a.id} a={a} />
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-2xl py-16 text-center text-muted-foreground text-sm">
              Nenhum artigo nesta área ainda.
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
