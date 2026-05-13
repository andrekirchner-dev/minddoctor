"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Filter, CheckCircle2, XCircle } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { questoes, areas, areaColors, type Questao, type Area } from "@/lib/data/questoes";
import { cn } from "@/lib/utils";

const dificuldadeCls = {
  basica:    "bg-green-500/10 text-green-600 border-green-500/20",
  media:     "bg-amber-500/10 text-amber-600 border-amber-500/20",
  avancada:  "bg-red-500/10 text-red-600 border-red-500/20",
};

function QuestaoCard({ q }: { q: Questao }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const acertou = selected === q.gabarito;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground">{q.banca} {q.ano}</span>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", areaColors[q.area])}>
          {q.area}
        </span>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", dificuldadeCls[q.dificuldade])}>
          {q.dificuldade}
        </span>
        {revealed && (
          <span className={cn(
            "ml-auto flex items-center gap-1 text-xs font-semibold",
            acertou ? "text-green-600" : "text-red-500"
          )}>
            {acertou ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {acertou ? "Correto" : "Incorreto"}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Enunciado */}
        <p className="text-sm text-foreground leading-relaxed">{q.enunciado}</p>

        {/* Alternativas */}
        <div className="space-y-2">
          {q.alternativas.map((alt) => {
            const isSelected = selected === alt.letra;
            const isGabarito = alt.letra === q.gabarito;
            let cls = "border-border bg-muted/20 text-foreground";
            if (revealed) {
              if (isGabarito) cls = "border-green-500/40 bg-green-500/10 text-green-700";
              else if (isSelected && !isGabarito) cls = "border-red-500/40 bg-red-500/10 text-red-600";
            } else if (isSelected) {
              cls = "border-primary/40 bg-primary/10 text-primary";
            }

            return (
              <button
                key={alt.letra}
                disabled={revealed}
                onClick={() => setSelected(alt.letra)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                  cls,
                  !revealed && "hover:border-primary/30 hover:bg-muted/40"
                )}
              >
                <span className="font-bold mr-2">{alt.letra})</span>
                {alt.texto}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!revealed && (
            <button
              disabled={!selected}
              onClick={() => setRevealed(true)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
                selected
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Confirmar resposta
            </button>
          )}
          {revealed && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? "Ocultar comentário" : "Ver comentário"}
            </button>
          )}
        </div>

        {/* Comentário */}
        {revealed && expanded && (
          <div className="space-y-3 pt-1">
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Comentário</p>
              <p className="text-sm text-foreground leading-relaxed">{q.comentario}</p>
            </div>
            <p className="text-[11px] text-muted-foreground border-t border-border pt-2">
              <span className="font-semibold">Ref: </span>{q.referencia}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuestoesPage() {
  const [area, setArea] = useState<Area | "todas">("todas");
  const [dificuldade, setDificuldade] = useState<"todas" | Questao["dificuldade"]>("todas");

  const filtradas = questoes.filter((q) => {
    const areaOk = area === "todas" || q.area === area;
    const difOk  = dificuldade === "todas" || q.dificuldade === dificuldade;
    return areaOk && difOk;
  });

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
            >
              <HelpCircle size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Banco de Questões</h1>
              <p className="text-xs text-muted-foreground">{questoes.length} questões comentadas · ABP · TEP · Residência</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={13} className="text-muted-foreground shrink-0" />
              {areas.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setArea(a.id as Area | "todas")}
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
            <div className="flex gap-2 flex-wrap pl-5">
              {(["todas", "basica", "media", "avancada"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDificuldade(d)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all",
                    dificuldade === d
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {d === "todas" ? "Todas dificuldades" : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Contagem */}
          <p className="text-xs text-muted-foreground">
            {filtradas.length} {filtradas.length === 1 ? "questão" : "questões"}
          </p>

          {/* Lista */}
          <div className="space-y-4">
            {filtradas.map((q) => (
              <QuestaoCard key={q.id} q={q} />
            ))}
          </div>

          {filtradas.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-2xl py-16 text-center text-muted-foreground text-sm">
              Nenhuma questão neste filtro.
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
