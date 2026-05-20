"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Users, ActivitySquare, Plus, UserCircle2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { getConsultas, type ConsultaRecord } from "@/lib/firebase/consultas";
import { getAllEvolucoes, type EvolucaoClinica } from "@/lib/firebase/evolucoes";

interface PatientSummary {
  nome: string;
  consultas: ConsultaRecord[];
  evolucoes: EvolucaoClinica[];
  ultimaConsulta: number; // seconds
}

function formatDate(seconds: number): string {
  return new Date(seconds * 1000).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function AcompanhamentoPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [consultas, evolucoes] = await Promise.all([
        getConsultas(user.uid),
        getAllEvolucoes(user.uid),
      ]);

      const map = new Map<string, PatientSummary>();

      for (const c of consultas) {
        const nome = c.patientName || "Paciente sem identificação";
        if (!map.has(nome)) {
          map.set(nome, { nome, consultas: [], evolucoes: [], ultimaConsulta: 0 });
        }
        const p = map.get(nome)!;
        p.consultas.push(c);
        const s = c.createdAt?.seconds ?? 0;
        if (s > p.ultimaConsulta) p.ultimaConsulta = s;
      }

      for (const e of evolucoes) {
        const nome = e.pacienteNome;
        if (!map.has(nome)) {
          map.set(nome, { nome, consultas: [], evolucoes: [], ultimaConsulta: 0 });
        }
        map.get(nome)!.evolucoes.push(e);
      }

      const sorted = Array.from(map.values()).sort(
        (a, b) => b.ultimaConsulta - a.ultimaConsulta
      );
      setPatients(sorted);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/consulta"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #4A6CF7, #06B6D4)" }}
            >
              <Users size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Acompanhamento de Pacientes</h1>
              <p className="text-xs text-muted-foreground">
                {loading ? "Carregando..." : `${patients.length} paciente${patients.length !== 1 ? "s" : ""} em acompanhamento`}
              </p>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 rounded bg-muted" />
                      <div className="h-3 w-56 rounded bg-muted" />
                    </div>
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && patients.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <UserCircle2 size={28} className="text-muted-foreground/40" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">Nenhum paciente ainda</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Realize uma consulta para começar a acompanhar pacientes longitudinalmente.
                </p>
              </div>
              <Link
                href="/consulta/nova"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus size={15} />
                Nova consulta
              </Link>
            </div>
          )}

          {/* Patient cards */}
          {!loading && patients.length > 0 && (
            <div className="space-y-3">
              {patients.map((p) => {
                const ultimaDiag = p.consultas[0]?.diagnosticoPrincipal;
                const hasActiveCrisis = false; // planos loaded per-patient
                return (
                  <Link
                    key={p.nome}
                    href={`/consulta/acompanhamento/${encodeURIComponent(p.nome)}`}
                    className="group bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(74,108,247,0.06)] transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {p.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{p.nome}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {ultimaDiag && (
                          <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                            {ultimaDiag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                          {p.consultas.length} consulta{p.consultas.length !== 1 ? "s" : ""}
                        </span>
                        {p.evolucoes.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 text-[10px] font-semibold">
                            {p.evolucoes.length} nota{p.evolucoes.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    {p.ultimaConsulta > 0 && (
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">Última consulta</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{formatDate(p.ultimaConsulta)}</p>
                      </div>
                    )}

                    <ActivitySquare
                      size={16}
                      className="text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
