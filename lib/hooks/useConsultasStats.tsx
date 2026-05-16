"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getConsultas, type ConsultaRecord } from "@/lib/firebase/consultas";

export interface ConsultasStats {
  hoje: number;
  semana: number;
  mes: number;
  total: number;
  recentes: ConsultaRecord[];
  loading: boolean;
}

const DEFAULT_STATS: ConsultasStats = {
  hoje: 0, semana: 0, mes: 0, total: 0, recentes: [], loading: true,
};

const ConsultasStatsContext = createContext<ConsultasStats>(DEFAULT_STATS);

// Session-level cache keyed by userId — survives client-side navigations.
const statsCache = new Map<string, ConsultasStats>();

function toDate(c: ConsultaRecord): Date {
  const secs = c.createdAt?.seconds;
  return secs ? new Date(secs * 1000) : new Date(0);
}

function computeStats(consultas: ConsultaRecord[]): ConsultasStats {
  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    hoje:     consultas.filter(c => toDate(c) >= startOfDay).length,
    semana:   consultas.filter(c => toDate(c) >= startOfWeek).length,
    mes:      consultas.filter(c => toDate(c) >= startOfMonth).length,
    total:    consultas.length,
    recentes: consultas.slice(0, 5),
    loading:  false,
  };
}

export function ConsultasStatsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cached = user ? statsCache.get(user.uid) : undefined;
  const [stats, setStats] = useState<ConsultasStats>(cached ?? DEFAULT_STATS);

  useEffect(() => {
    if (!user) { setStats(s => ({ ...s, loading: false })); return; }
    if (statsCache.has(user.uid)) return; // already fetched this session
    getConsultas(user.uid)
      .then(consultas => {
        const s = computeStats(consultas);
        statsCache.set(user.uid, s);
        setStats(s);
      })
      .catch(() => setStats(s => ({ ...s, loading: false })));
  }, [user]);

  return (
    <ConsultasStatsContext.Provider value={stats}>
      {children}
    </ConsultasStatsContext.Provider>
  );
}

export function useConsultasStats(): ConsultasStats {
  return useContext(ConsultasStatsContext);
}
