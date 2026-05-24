"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, GraduationCap, HelpCircle, BookMarked,
  Trophy, Target, ChevronLeft, Clock,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { decks } from "@/lib/data/flashcards";
import { artigos } from "@/lib/data/journal";
import { cn } from "@/lib/utils";

interface CardProgress { interval: number; repetitions: number; nextReview: string }
type DeckProgress = Record<string, CardProgress>;
type QuestoesStats = Record<string, { total: number; correct: number }>;

function today(): string { return new Date().toISOString().split("T")[0]; }

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [fp, setFp] = useState<DeckProgress>({});
  const [qs, setQs] = useState<QuestoesStats>({});

  useEffect(() => {
    try { const r = localStorage.getItem("md_flashcard_progress"); if (r) setFp(JSON.parse(r)); } catch {}
    try { const r = localStorage.getItem("axon_questoes_stats"); if (r) setQs(JSON.parse(r)); } catch {}
  }, []);

  const deckStats = decks.map(deck => {
    const ids = deck.cards.map(c => c.id);
    return {
      deck,
      total: ids.length,
      learned: ids.filter(id => (fp[id]?.repetitions ?? 0) >= 1).length,
      mastered: ids.filter(id => (fp[id]?.interval ?? 0) >= 21).length,
      due: ids.filter(id => !fp[id] || fp[id].nextReview <= today()).length,
    };
  });

  const totalCards   = decks.reduce((a, d) => a + d.cards.length, 0);
  const totalMastered = deckStats.reduce((a, d) => a + d.mastered, 0);
  const totalDue     = deckStats.reduce((a, d) => a + d.due, 0);

  const totalAnswered = Object.values(qs).reduce((a, s) => a + s.total, 0);
  const totalCorrect  = Object.values(qs).reduce((a, s) => a + s.correct, 0);
  const accuracy      = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/estudos" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0">
              <ChevronLeft size={16} />
            </Link>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #4A6CF7)" }}>
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Analytics de Aprendizagem</h1>
              <p className="text-xs text-muted-foreground">Progresso acumulado em flashcards e questões</p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={Trophy}      label="Cards dominados"         value={`${totalMastered}/${totalCards}`} color="#10B981" />
            <StatCard icon={Target}      label="Acurácia em questões"    value={totalAnswered > 0 ? `${accuracy}%` : "—"} color="#4A6CF7" />
            <StatCard icon={HelpCircle}  label="Questões respondidas"    value={String(totalAnswered)} color="#7B5EA7" />
            <StatCard icon={Clock}       label="Cards para revisar hoje" value={String(totalDue)} color="#F59E0B" />
          </div>

          {/* Flashcard decks */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <GraduationCap size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Flashcards por deck</h2>
            </div>
            <div className="divide-y divide-border">
              {deckStats.map(({ deck, total, learned, mastered, due }) => {
                const pct = Math.round((mastered / total) * 100);
                return (
                  <div key={deck.id} className="px-5 py-4 space-y-2">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{deck.titulo}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{mastered}/{total} dominados</span>
                        {due > 0 && (
                          <span className="text-amber-500 font-semibold">{due} para revisar</span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-[11px] text-muted-foreground">
                      <span>{pct}% dominado</span>
                      <span>{learned} vistos</span>
                      <span>{total - learned} novos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questoes por área */}
          {totalAnswered > 0 ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <HelpCircle size={15} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Questões por área</h2>
                <span className="text-xs text-muted-foreground ml-1">{totalAnswered} respondidas · {accuracy}% de acurácia geral</span>
              </div>
              <div className="p-5 space-y-3">
                {Object.entries(qs).sort((a, b) => b[1].total - a[1].total).map(([area, s]) => {
                  const pct = Math.round((s.correct / s.total) * 100);
                  return (
                    <div key={area} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground font-medium">{area}</span>
                        <span className="text-muted-foreground">{s.correct}/{s.total} corretas ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", pct >= 60 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-2">
              <HelpCircle size={28} className="text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">Ainda não há dados de questões.</p>
              <p className="text-xs text-muted-foreground">Responda questões no banco ou inicie um simulado para ver seu progresso aqui.</p>
              <Link href="/estudos/questoes" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                Ir para questões
              </Link>
            </div>
          )}

          {/* Journal */}
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
              <BookMarked size={18} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Journal Club</p>
              <p className="text-xs text-muted-foreground">{artigos.length} artigos disponíveis no banco de evidências</p>
            </div>
            <Link href="/estudos/journal" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
              Ver artigos
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
