"use client";

import { use, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Info, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { escalas, type Escala, type FaixaEscala } from "@/lib/data/escalas";
import { cn } from "@/lib/utils";

const corMap: Record<string, string> = {
  verde:    "bg-green-500/10 border-green-500/30 text-green-600",
  amarelo:  "bg-amber-500/10 border-amber-500/30 text-amber-600",
  laranja:  "bg-orange-500/10 border-orange-500/30 text-orange-600",
  vermelho: "bg-red-500/10 border-red-500/30 text-red-600",
};

const corIconMap: Record<string, string> = {
  verde:    "#22C55E",
  amarelo:  "#F59E0B",
  laranja:  "#F97316",
  vermelho: "#EF4444",
};

function getFaixa(escala: Escala, score: number): FaixaEscala | null {
  return escala.faixas.find((f) => score >= f.min && score <= f.max) ?? null;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Questão {current} de {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ResultPanel({ escala, respostas }: { escala: Escala; respostas: number[] }) {
  const score = respostas.reduce((a, b) => a + b, 0);
  const faixa = getFaixa(escala, score);

  return (
    <div className="space-y-5">
      {/* Score principal */}
      <div className={cn(
        "rounded-2xl border p-6 text-center",
        faixa ? corMap[faixa.cor] : "bg-muted border-border"
      )}>
        <p className="text-4xl font-bold font-mono mb-1">{score}</p>
        <p className="text-sm font-semibold">{faixa?.label ?? "—"}</p>
        {escala.sigla === "BPRS-18" && (
          <p className="text-[11px] mt-1 opacity-70">Mín: {escala.faixas[0].min} · Máx: {escala.itens.length * 7}</p>
        )}
      </div>

      {/* Interpretação */}
      {faixa && (
        <div className={cn("rounded-2xl border p-5 space-y-3", corMap[faixa.cor])}>
          <div className="flex items-center gap-2">
            {faixa.cor === "verde"
              ? <CheckCircle size={18} style={{ color: corIconMap[faixa.cor] }} />
              : <AlertTriangle size={18} style={{ color: corIconMap[faixa.cor] }} />
            }
            <p className="font-semibold">{faixa.descricao}</p>
          </div>
          {faixa.conduta && (
            <div className="bg-background/60 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold mb-1 text-foreground">Conduta sugerida</p>
              <p className="text-sm text-foreground/80">{faixa.conduta}</p>
            </div>
          )}
        </div>
      )}

      {/* Nota clínica */}
      {escala.nota_clinica && (
        <div className="bg-muted/40 border border-border rounded-xl px-4 py-3 flex gap-2 text-xs">
          <Info size={13} className="shrink-0 mt-0.5 text-primary" />
          <div>
            <span className="font-semibold text-foreground">Nota clínica: </span>
            <span className="text-muted-foreground">{escala.nota_clinica}</span>
          </div>
        </div>
      )}

      {/* Todas as faixas */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Tabela de classificação</p>
        </div>
        <div className="divide-y divide-border">
          {escala.faixas.map((f) => (
            <div
              key={f.label}
              className={cn(
                "px-4 py-3 flex items-center gap-3 text-sm",
                faixa?.label === f.label ? corMap[f.cor] + " font-semibold" : ""
              )}
            >
              <span className="font-mono text-xs text-muted-foreground w-14 shrink-0">{f.min}–{f.max}</span>
              <span className="flex-1">{f.label}</span>
              {faixa?.label === f.label && (
                <span className="text-[10px] font-bold uppercase tracking-wide">← atual</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Referência */}
      <p className="text-[11px] text-muted-foreground px-1">
        <span className="font-semibold">Referência: </span>{escala.referencia}
      </p>
    </div>
  );
}

function EscalaRunner({ escala }: { escala: Escala }) {
  const [passo, setPasso] = useState(0); // 0 = intro, 1..n = questões, n+1 = resultado
  const [respostas, setRespostas] = useState<(number | null)[]>(
    new Array(escala.itens.length).fill(null)
  );

  const totalItens = escala.itens.length;
  const emIntro    = passo === 0;
  const emResultado = passo === totalItens + 1;
  const itemAtual  = emIntro || emResultado ? null : escala.itens[passo - 1];
  const respostaAtual = itemAtual ? respostas[passo - 1] : null;

  function selecionarResposta(valor: number) {
    const novas = [...respostas];
    novas[passo - 1] = valor;
    setRespostas(novas);
  }

  function avancar() {
    if (passo === totalItens) {
      setPasso(totalItens + 1);
    } else {
      setPasso(passo + 1);
    }
  }

  function voltar() {
    if (passo > 0) setPasso(passo - 1);
  }

  function reiniciar() {
    setPasso(0);
    setRespostas(new Array(totalItens).fill(null));
  }

  return (
    <div className="space-y-5">
      {/* Intro */}
      {emIntro && (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <p className="text-sm font-semibold text-foreground">Instrução ao paciente / avaliador</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{escala.instrucoes}</p>
          </div>
          {escala.nota_clinica && (
            <div className="bg-muted/40 border border-border rounded-xl px-4 py-3 flex gap-2 text-xs">
              <Info size={13} className="shrink-0 mt-0.5 text-primary" />
              <div>
                <span className="font-semibold text-foreground">Nota clínica: </span>
                <span className="text-muted-foreground">{escala.nota_clinica}</span>
              </div>
            </div>
          )}
          <button
            onClick={avancar}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Iniciar aplicação →
          </button>
        </div>
      )}

      {/* Questão */}
      {itemAtual && (
        <div className="space-y-4">
          <ProgressBar current={passo} total={totalItens} />

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <p className="text-sm font-medium text-foreground leading-relaxed">{itemAtual.pergunta}</p>
            {itemAtual.subtexto && (
              <p className="text-xs text-amber-600 bg-amber-500/10 rounded-lg px-3 py-2 flex gap-1.5">
                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                {itemAtual.subtexto}
              </p>
            )}

            <div className="space-y-2">
              {itemAtual.opcoes.map((op) => (
                <button
                  key={op.valor}
                  onClick={() => selecionarResposta(op.valor)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                    respostaAtual === op.valor
                      ? "bg-primary/10 border-primary text-primary font-medium"
                      : "bg-background border-border text-foreground hover:border-primary/30 hover:bg-muted/30"
                  )}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={voltar}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ArrowLeft size={15} /> Anterior
            </button>
            <button
              onClick={avancar}
              disabled={respostaAtual === null}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                respostaAtual !== null
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {passo === totalItens ? "Ver resultado" : "Próxima"}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Resultado */}
      {emResultado && (
        <div className="space-y-5">
          <ResultPanel escala={escala} respostas={respostas.map((r) => r ?? 0)} />
          <button
            onClick={reiniciar}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <RotateCcw size={14} /> Aplicar novamente
          </button>
        </div>
      )}
    </div>
  );
}

export default function EscalaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const escala = escalas.find((e) => e.id === slug);

  if (!escala) notFound();

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-2xl">
          {/* Back + header */}
          <div className="flex items-center gap-3">
            <Link
              href="/escalas"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground font-mono">{escala.sigla}</h1>
              </div>
              <p className="text-xs text-muted-foreground">{escala.nome}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.06)]">
            <EscalaRunner escala={escala} />
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
