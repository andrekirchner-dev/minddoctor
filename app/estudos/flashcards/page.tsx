"use client";

import Link from "next/link";
import { Layers, ChevronRight, RotateCcw, Trophy, Clock } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { decks } from "@/lib/data/flashcards";
import { useFlashcards } from "@/lib/hooks/useFlashcards";
import { cn } from "@/lib/utils";

function DeckCard({ deck }: { deck: typeof decks[number] }) {
  const allIds = deck.cards.map((c) => c.id);
  const { stats, resetDeck, loaded } = useFlashcards(allIds);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Gradient header */}
      <div className={`bg-gradient-to-r ${deck.gradient} px-5 py-4`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-white text-base leading-tight">{deck.titulo}</p>
            <p className="text-white/70 text-xs mt-0.5">{deck.descricao}</p>
          </div>
          <span className="shrink-0 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {deck.area}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats */}
        {loaded && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
            </div>
            <div className="text-center">
              <p className={cn("text-lg font-bold", stats.due > 0 ? "text-amber-500" : "text-muted-foreground")}>
                {stats.due}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Para Revisar</p>
            </div>
            <div className="text-center">
              <p className={cn("text-lg font-bold", stats.mastered > 0 ? "text-green-500" : "text-muted-foreground")}>
                {stats.mastered}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dominados</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {loaded && stats.total > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Progresso</span>
              <span>{Math.round((stats.learned / stats.total) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${(stats.learned / stats.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/estudos/flashcards/${deck.id}`}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
              stats.due > 0
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-default pointer-events-none"
            )}
          >
            {stats.due > 0 ? (
              <>
                <Clock size={14} />
                Estudar ({stats.due})
              </>
            ) : (
              <>
                <Trophy size={14} />
                Em dia!
              </>
            )}
          </Link>
          {loaded && stats.learned > 0 && (
            <button
              onClick={() => resetDeck(allIds)}
              title="Resetar progresso do deck"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <RotateCcw size={14} />
            </button>
          )}
          {stats.due === 0 && stats.learned === 0 && (
            <Link
              href={`/estudos/flashcards/${deck.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              <Layers size={14} />
              Começar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
            >
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Flashcards</h1>
              <p className="text-xs text-muted-foreground">Repetição espaçada com algoritmo SM-2 · Progresso salvo localmente</p>
            </div>
          </div>

          {/* Como funciona */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3">
            <p className="text-xs text-foreground font-semibold mb-1">Como funciona o SM-2</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Após cada card, avalie seu desempenho de 1 a 4. O algoritmo calcula quando revisitar cada card — acertos fáceis espaçam as revisões, erros trazem de volta no próximo estudo.
            </p>
          </div>

          {/* Decks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
