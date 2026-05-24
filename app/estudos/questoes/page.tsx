"use client";

import { useState, useEffect, useCallback } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Filter, CheckCircle2, XCircle, Timer } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { questoes, areas, areaColors, type Questao, type Area } from "@/lib/data/questoes";
import { cn } from "@/lib/utils";

const dificuldadeCls = {
  basica:    "bg-green-500/10 text-green-600 border-green-500/20",
  media:     "bg-amber-500/10 text-amber-600 border-amber-500/20",
  avancada:  "bg-red-500/10 text-red-600 border-red-500/20",
};

function trackQuestaoAnswer(area: Area, acertou: boolean) {
  try {
    const raw = localStorage.getItem("axon_questoes_stats");
    const stats: Record<string, { total: number; correct: number }> = raw ? JSON.parse(raw) : {};
    if (!stats[area]) stats[area] = { total: 0, correct: 0 };
    stats[area].total++;
    if (acertou) stats[area].correct++;
    localStorage.setItem("axon_questoes_stats", JSON.stringify(stats));
  } catch {}
}

type SimuladoPhase = "idle" | "config" | "running" | "finished" | "review";

interface SimuladoState {
  questoesUsadas: Questao[];
  currentIdx: number;
  timeLeft: number;
  selectedAnswers: Record<string, string>;
  revealed: Record<string, boolean>;
}

function SimuladoView({
  simulado, phase, config, onSelect, onAdvance, onReview, onExit
}: {
  simulado: SimuladoState;
  phase: SimuladoPhase;
  config: { qtd: number; tempo: number };
  onSelect: (id: string, letra: string) => void;
  onAdvance: () => void;
  onReview: () => void;
  onExit: () => void;
}) {
  const { questoesUsadas, currentIdx, timeLeft, selectedAnswers, revealed } = simulado;
  const total = questoesUsadas.length;
  const correct = questoesUsadas.filter(q => selectedAnswers[q.id] === q.gabarito).length;

  // --- Running phase ---
  if (phase === "running") {
    const q = questoesUsadas[currentIdx];
    const sel = selectedAnswers[q.id] ?? null;
    const isRevealed = revealed[q.id] ?? false;
    const pct = (timeLeft / config.tempo) * 100;
    const timerCls = pct > 50 ? "bg-green-500" : pct > 25 ? "bg-amber-500" : "bg-red-500";

    return (
      <div className="space-y-4">
        {/* Progress + timer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Questão {currentIdx + 1} de {total}</span>
            <span className={cn("font-bold tabular-nums", timeLeft <= 10 ? "text-red-500" : "text-foreground")}>{timeLeft}s</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-1000", timerCls)} style={{ width: `${pct}%` }} />
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary/30 transition-all" style={{ width: `${((currentIdx) / total) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground">{q.banca} {q.ano}</span>
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", areaColors[q.area])}>{q.area}</span>
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", dificuldadeCls[q.dificuldade])}>{q.dificuldade}</span>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-foreground leading-relaxed">{q.enunciado}</p>
            <div className="space-y-2">
              {q.alternativas.map(alt => {
                const isSelected = sel === alt.letra;
                const isGabarito = alt.letra === q.gabarito;
                let cls = "border-border bg-muted/20 text-foreground";
                if (isRevealed) {
                  if (isGabarito) cls = "border-green-500/40 bg-green-500/10 text-green-700";
                  else if (isSelected) cls = "border-red-500/40 bg-red-500/10 text-red-600";
                } else if (isSelected) cls = "border-primary/40 bg-primary/10 text-primary";
                return (
                  <button key={alt.letra} disabled={isRevealed} onClick={() => onSelect(q.id, alt.letra)}
                    className={cn("w-full text-left px-4 py-3 rounded-xl border text-sm transition-all", cls, !isRevealed && "hover:border-primary/30 hover:bg-muted/40")}>
                    <span className="font-bold mr-2">{alt.letra})</span>{alt.texto}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={onAdvance}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                {currentIdx < total - 1 ? "Próxima questão →" : "Finalizar simulado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Finished phase ---
  if (phase === "finished") {
    const pct = Math.round((correct / total) * 100);
    const areaMap: Record<string, { total: number; correct: number }> = {};
    questoesUsadas.forEach(q => {
      if (!areaMap[q.area]) areaMap[q.area] = { total: 0, correct: 0 };
      areaMap[q.area].total++;
      if (selectedAnswers[q.id] === q.gabarito) areaMap[q.area].correct++;
    });

    return (
      <div className="space-y-5">
        <div className={cn("rounded-2xl p-6 text-center border", pct >= 60 ? "bg-green-500/5 border-green-500/20" : "bg-amber-500/5 border-amber-500/20")}>
          <p className="text-4xl font-bold text-foreground mb-1">{pct}%</p>
          <p className="text-sm text-muted-foreground">{correct} de {total} corretas</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Por área</p>
          {Object.entries(areaMap).map(([a, s]) => {
            const p = Math.round((s.correct / s.total) * 100);
            return (
              <div key={a} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{a}</span><span>{s.correct}/{s.total} ({p}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", p >= 60 ? "bg-green-500" : "bg-amber-500")} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button onClick={onReview} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Revisar questões</button>
          <button onClick={onExit} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Encerrar</button>
        </div>
      </div>
    );
  }

  // --- Review phase ---
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Revisão do simulado — {correct}/{total} corretas</p>
        <button onClick={onExit} className="text-xs text-muted-foreground hover:text-foreground underline">Sair</button>
      </div>
      {questoesUsadas.map(q => {
        const sel = selectedAnswers[q.id] ?? null;
        const acertou = sel === q.gabarito;
        return (
          <div key={q.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground">{q.banca} {q.ano}</span>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", areaColors[q.area])}>{q.area}</span>
              <span className={cn("ml-auto flex items-center gap-1 text-xs font-semibold", acertou ? "text-green-600" : sel ? "text-red-500" : "text-muted-foreground")}>
                {acertou ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {acertou ? "Correto" : sel ? "Incorreto" : "Não respondida"}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{q.enunciado}</p>
              <div className="space-y-2">
                {q.alternativas.map(alt => {
                  const isGabarito = alt.letra === q.gabarito;
                  const isSelected = sel === alt.letra;
                  let cls = "border-border bg-muted/20 text-foreground";
                  if (isGabarito) cls = "border-green-500/40 bg-green-500/10 text-green-700";
                  else if (isSelected) cls = "border-red-500/40 bg-red-500/10 text-red-600";
                  return (
                    <div key={alt.letra} className={cn("w-full px-4 py-3 rounded-xl border text-sm", cls)}>
                      <span className="font-bold mr-2">{alt.letra})</span>{alt.texto}
                    </div>
                  );
                })}
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Comentário</p>
                <p className="text-sm text-foreground leading-relaxed">{q.comentario}</p>
              </div>
            </div>
          </div>
        );
      })}
      <button onClick={onExit} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Encerrar simulado</button>
    </div>
  );
}

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
              onClick={() => { setRevealed(true); trackQuestaoAnswer(q.area, selected === q.gabarito); }}
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

  const [simuladoPhase, setSimuladoPhase] = useState<SimuladoPhase>("idle");
  const [simuladoConfig, setSimuladoConfig] = useState({ qtd: 10 as number, tempo: 90 });
  const [simulado, setSimulado] = useState<SimuladoState | null>(null);

  const filtradas = questoes.filter((q) => {
    const areaOk = area === "todas" || q.area === area;
    const difOk  = dificuldade === "todas" || q.dificuldade === dificuldade;
    return areaOk && difOk;
  });

  const advance = useCallback(() => {
    setSimulado(prev => {
      if (!prev) return prev;
      const q = prev.questoesUsadas[prev.currentIdx];
      trackQuestaoAnswer(q.area, prev.selectedAnswers[q.id] === q.gabarito);
      const newRevealed = { ...prev.revealed, [q.id]: true };
      if (prev.currentIdx >= prev.questoesUsadas.length - 1) {
        setSimuladoPhase("finished");
        return { ...prev, revealed: newRevealed, timeLeft: 0 };
      }
      return { ...prev, currentIdx: prev.currentIdx + 1, timeLeft: simuladoConfig.tempo, revealed: newRevealed };
    });
  }, [simuladoConfig.tempo]);

  // Decrement timer every second
  useEffect(() => {
    if (simuladoPhase !== "running") return;
    const id = setInterval(() => {
      setSimulado(prev => {
        if (!prev || prev.timeLeft <= 0) return prev;
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [simuladoPhase]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (simuladoPhase !== "running" || !simulado || simulado.timeLeft !== 0) return;
    advance();
  }, [simuladoPhase, simulado?.timeLeft, advance]);

  function startSimulado() {
    const shuffled = [...questoes].sort(() => Math.random() - 0.5);
    const qtd = simuladoConfig.qtd === 0 ? shuffled.length : simuladoConfig.qtd;
    const selected = shuffled.slice(0, qtd);
    setSimulado({
      questoesUsadas: selected,
      currentIdx: 0,
      timeLeft: simuladoConfig.tempo,
      selectedAnswers: {},
      revealed: {},
    });
    setSimuladoPhase("running");
  }

  function selectAnswer(questaoId: string, letra: string) {
    if (!simulado || simulado.revealed[questaoId]) return;
    setSimulado(prev => prev ? { ...prev, selectedAnswers: { ...prev.selectedAnswers, [questaoId]: letra } } : prev);
  }

  function confirmAndAdvance() {
    if (!simulado) return;
    advance();
  }

  function exitSimulado() {
    setSimulado(null);
    setSimuladoPhase("idle");
  }

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
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Banco de Questões</h1>
              <p className="text-xs text-muted-foreground">{questoes.length} questões comentadas · ABP · TEP · Residência</p>
            </div>
            <button
              onClick={() => setSimuladoPhase(simuladoPhase === "config" ? "idle" : "config")}
              disabled={simuladoPhase === "running" || simuladoPhase === "finished" || simuladoPhase === "review"}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary hover:text-white transition-all disabled:opacity-40"
            >
              <Timer size={15} />
              Simulado
            </button>
          </div>

          {/* Config card */}
          {simuladoPhase === "config" && (
            <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4">
              <p className="text-sm font-semibold text-foreground">Configurar Simulado</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Número de questões</p>
                  <div className="flex gap-2 flex-wrap">
                    {[10, 20, 0].map(n => (
                      <button key={n} onClick={() => setSimuladoConfig(c => ({ ...c, qtd: n }))}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                          simuladoConfig.qtd === n ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/30"
                        )}>
                        {n === 0 ? `Todas (${questoes.length})` : n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Tempo por questão</p>
                  <div className="flex gap-2 flex-wrap">
                    {[60, 90, 120].map(t => (
                      <button key={t} onClick={() => setSimuladoConfig(c => ({ ...c, tempo: t }))}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                          simuladoConfig.tempo === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/30"
                        )}>
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={startSimulado} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Timer size={15} />
                Iniciar simulado
              </button>
            </div>
          )}

          {/* Simulado active views (running / finished / review) */}
          {(simuladoPhase === "running" || simuladoPhase === "finished" || simuladoPhase === "review") && simulado && (
            <SimuladoView
              simulado={simulado}
              phase={simuladoPhase}
              config={simuladoConfig}
              onSelect={selectAnswer}
              onAdvance={confirmAndAdvance}
              onReview={() => setSimuladoPhase("review")}
              onExit={exitSimulado}
            />
          )}

          {/* Free-practice mode: filters + list (hidden when simulado is active) */}
          {(simuladoPhase === "idle" || simuladoPhase === "config") ? (
            <>
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
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
