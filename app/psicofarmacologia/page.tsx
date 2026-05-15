"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pill, ArrowLeftRight, Syringe, Activity, BookOpen, ChevronRight,
  FlaskConical, Dna, ClipboardList, Users, BookMarked,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EquivalenciaCalc } from "@/components/psicofarmacologia/EquivalenciaCalc";
import { DoseCalc } from "@/components/psicofarmacologia/DoseCalc";
import { QtcChecker } from "@/components/psicofarmacologia/QtcChecker";
import { cn } from "@/lib/utils";

const calcTabs = [
  { id: "equivalencia", label: "Equivalência",     icon: ArrowLeftRight, desc: "Conversão CPZ entre antipsicóticos" },
  { id: "dose",         label: "Calculadora Dose",  icon: Syringe,        desc: "Faixa terapêutica por medicamento" },
  { id: "qtc",          label: "Interação QTc",     icon: Activity,       desc: "Verificador de risco de QTc" },
] as const;

type CalcTab = typeof calcTabs[number]["id"];

export default function PsicofarmacologiaPage() {
  const [tab, setTab] = useState<CalcTab>("equivalencia");

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #4A6CF7, #7B5EA7)" }}
            >
              <Pill size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Central de Psicofarmacologia</h1>
              <p className="text-xs text-muted-foreground">Calculadoras clínicas e biblioteca de fármacos</p>
            </div>
          </div>

          {/* Primary CTA — Biblioteca */}
          <Link
            href="/psicofarmacologia/biblioteca"
            className="group block bg-gradient-to-br from-violet-500/10 to-indigo-600/10 border border-violet-500/30 rounded-2xl p-6 hover:border-violet-500/50 hover:shadow-[0_4px_24px_rgba(139,92,246,0.12)] transition-all duration-200"
          >
            <div className="flex items-start gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #7B5EA7, #4A6CF7)" }}
              >
                <BookOpen size={26} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-foreground text-lg">Biblioteca de Psicofarmacologia</p>
                  <span className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wide">Principal</span>
                </div>
                <p className="text-xs text-muted-foreground/80 italic mb-2">Receptores · Classes · Moléculas · Transtornos</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mapa neurobiológico completo: alvos farmacológicos, classes por mecanismo, perfil clínico por molécula, algoritmos por transtorno e ferramentas de decisão terapêutica.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { icon: Dna,          label: "15 sistemas neurobiológicos" },
                    { icon: FlaskConical, label: "8 classes farmacológicas" },
                    { icon: Pill,         label: "34+ moléculas" },
                    { icon: ClipboardList,label: "10 transtornos" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/8 text-violet-600 dark:text-violet-400 text-[10px] font-medium border border-violet-500/15">
                      <Icon size={10} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight size={20} className="text-violet-500 group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
            </div>
          </Link>

          {/* Calculadoras clínicas */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Calculadoras clínicas</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {calcTabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200",
                      active
                        ? "border-primary/40 bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: active ? "#4A6CF720" : undefined }}
                    >
                      <Icon size={15} className={active ? "text-primary" : "text-muted-foreground"} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold truncate", active ? "text-primary" : "text-foreground")}>
                        {t.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate hidden sm:block">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              {tab === "equivalencia" && <EquivalenciaCalc />}
              {tab === "dose"         && <DoseCalc />}
              {tab === "qtc"          && <QtcChecker />}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
