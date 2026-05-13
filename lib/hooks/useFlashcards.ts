"use client";

import { useState, useEffect, useCallback } from "react";

// SM-2 algorithm types
export interface CardProgress {
  cardId: string;
  interval: number;      // days until next review
  ef: number;            // easiness factor (default 2.5)
  repetitions: number;   // number of successful reviews
  nextReview: string;    // ISO date string
  lastQuality?: number;  // last quality rating (0-5)
}

export interface DeckProgress {
  [cardId: string]: CardProgress;
}

export interface StudySession {
  cardId: string;
  quality: number; // 0-5 rating
  reviewedAt: string;
}

const STORAGE_KEY = "md_flashcard_progress";
const DEFAULT_EF = 2.5;

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function isDue(nextReview: string): boolean {
  return nextReview <= today();
}

// SM-2 algorithm
function applyReview(progress: CardProgress, quality: number): CardProgress {
  const q = Math.max(0, Math.min(5, quality));
  let { interval, ef, repetitions } = progress;

  if (q >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ef);

    ef = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    repetitions += 1;
  } else {
    interval = 1;
    repetitions = 0;
  }

  return {
    ...progress,
    interval,
    ef,
    repetitions,
    nextReview: addDays(today(), interval),
    lastQuality: q,
  };
}

function loadProgress(): DeckProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeckProgress) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: DeckProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function initCard(cardId: string): CardProgress {
  return {
    cardId,
    interval: 0,
    ef: DEFAULT_EF,
    repetitions: 0,
    nextReview: today(),
  };
}

export function useFlashcards(cardIds: string[]) {
  const [progress, setProgress] = useState<DeckProgress>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setLoaded(true);
  }, []);

  const getCardProgress = useCallback(
    (cardId: string): CardProgress =>
      progress[cardId] ?? initCard(cardId),
    [progress]
  );

  const dueCards = cardIds.filter((id) => {
    const p = progress[id];
    return !p || isDue(p.nextReview);
  });

  const reviewCard = useCallback(
    (cardId: string, quality: number) => {
      setProgress((prev) => {
        const current = prev[cardId] ?? initCard(cardId);
        const updated = applyReview(current, quality);
        const next = { ...prev, [cardId]: updated };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const resetDeck = useCallback(
    (deckCardIds: string[]) => {
      setProgress((prev) => {
        const next = { ...prev };
        for (const id of deckCardIds) delete next[id];
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const stats = {
    total: cardIds.length,
    due: dueCards.length,
    learned: cardIds.filter((id) => {
      const p = progress[id];
      return p && p.repetitions >= 1;
    }).length,
    mastered: cardIds.filter((id) => {
      const p = progress[id];
      return p && p.interval >= 21;
    }).length,
  };

  return { progress, dueCards, reviewCard, resetDeck, getCardProgress, stats, loaded };
}
