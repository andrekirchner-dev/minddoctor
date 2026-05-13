"use client";

import { use, useState, useCallback } from "react";
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getDeck } from "@/lib/data/flashcards";
import { useFlashcards } from "@/lib/hooks/useFlashcards";
import { cn } from "@/lib/utils";

const QUALITY_BUTTONS = [
  { q: 1, label: "Errei",      cls: "bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500/20" },
  { q: 2, label: "Difícil",    cls: "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20" },
  { q: 3, label: "Bom",        cls: "bg-blue-500/10 border-blue-500/30 text-blue-600 hover:bg-blue-500/20" },
  { q: 4, label: "Fácil",      cls: "bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20" },
] as const;

export default function DeckStudyPage({ params }: { params: Promise<{ deck: string }> }) {
  const { deck: deckId } = use(params);
  const deck = getDeck(deckId);
  if (!deck) notFound();

  const allIds = deck.cards.map((c) => c.id);
  const { dueCards, reviewCard, getCardProgress, stats, loaded } = useFlashcards(allIds);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const sessionCards = dueCards.slice(0, 20); // max 20 por sessão
  const currentId = sessionCards[idx];
  const card = deck.cards.find((c) => c.id === currentId);

  const handleRate = useCallback(
    (quality: number) => {
      if (!currentId) return;
      reviewCard(currentId, quality);
      setReviewed((r) => r + 1);
      setFlipped(false);
      setShowHint(false);
      if (idx + 1 >= sessionCards.length) {
        setSessionDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    },
    [currentId, reviewCard, idx, sessionCards.length]
  );

  if (!loaded) return null;

  // Sessão concluída
  if (sessionDone || (loaded && sessionCards.length === 0)) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-lg mx-auto space-y-5">
            <div className="flex items-center gap-3">
              <Link
                href="/estudos/flashcards"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft size={16} />
              </Link>
              <h1 className="text-lg font-bold text-foreground">{deck.titulo}</h1>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {sessionCards.length === 0 ? "Tudo em dia!" : "Sessão concluída!"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {sessionCards.length === 0
                    ? "Sem cards para revisar agora. Volte amanhã."
                    : `${reviewed} cards revisados nesta sessão.`}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-muted/30 rounded-xl py-3">
                  <p className="text-lg font-bold text-foreground">{stats.total}</p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
                <div className="bg-muted/30 rounded-xl py-3">
                  <p className="text-lg font-bold text-green-500">{stats.learned}</p>
                  <p className="text-[10px] text-muted-foreground">Aprendidos</p>
                </div>
                <div className="bg-muted/30 rounded-xl py-3">
                  <p className="text-lg font-bold text-violet-500">{stats.mastered}</p>
                  <p className="text-[10px] text-muted-foreground">Dominados</p>
                </div>
              </div>
              <Link
                href="/estudos/flashcards"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all"
              >
                Voltar aos decks <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  const progress = ((idx) / sessionCards.length) * 100;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-lg mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/estudos/flashcards"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{deck.titulo}</p>
              <p className="text-xs text-muted-foreground">{idx + 1} de {sessionCards.length}</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Flashcard */}
          {card && (
            <div
              className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer select-none min-h-[280px] flex flex-col"
              onClick={() => !flipped && setFlipped(true)}
            >
              {/* Side label */}
              <div className={cn(
                "px-5 py-2.5 border-b border-border flex items-center justify-between",
                flipped ? "bg-primary/5" : "bg-muted/30"
              )}>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {flipped ? "Resposta" : "Pergunta"}
                </span>
                <div className="flex gap-1">
                  {card.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                {!flipped ? (
                  <div className="space-y-4">
                    <p className="text-base font-semibold text-foreground leading-relaxed">
                      {card.frente}
                    </p>
                    {card.dica && showHint && (
                      <div className="flex gap-2 items-start bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                        <Lightbulb size={13} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">{card.dica}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-2">
                      <p className="text-xs text-muted-foreground">Toque para revelar a resposta</p>
                      {card.dica && !showHint && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-500 transition-colors"
                        >
                          <Lightbulb size={11} /> Dica
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {card.verso}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rating buttons — only after flip */}
          {flipped && (
            <div className="space-y-2">
              <p className="text-xs text-center text-muted-foreground font-semibold">Como foi?</p>
              <div className="grid grid-cols-4 gap-2">
                {QUALITY_BUTTONS.map(({ q, label, cls }) => (
                  <button
                    key={q}
                    onClick={() => handleRate(q)}
                    className={cn(
                      "py-3 rounded-xl border text-xs font-bold transition-all",
                      cls
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flip hint when not yet flipped */}
          {!flipped && (
            <div className="flex justify-center">
              <button
                onClick={() => setFlipped(true)}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                <RotateCcw size={14} /> Revelar resposta
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
