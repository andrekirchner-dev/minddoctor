"use client";

import { useState } from "react";
import { Pill, ArrowLeftRight, Syringe, Activity } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EquivalenciaCalc } from "@/components/psicofarmacologia/EquivalenciaCalc";
import { DoseCalc } from "@/components/psicofarmacologia/DoseCalc";
import { QtcChecker } from "@/components/psicofarmacologia/QtcChecker";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "equivalencia", label: "Equivalência",    icon: ArrowLeftRight, desc: "Conversão entre antipsicóticos (CPZ)" },
  { id: "dose",         label: "Calculadora Dose", icon: Syringe,        desc: "Faixa terapêutica por medicamento" },
  { id: "qtc",          label: "Interação QTc",    icon: Activity,       desc: "Verificador de risco de QTc" },
] as const;

type Tab = typeof tabs[number]["id"];

export default function PsicofarmacologiaPage() {
  const [tab, setTab] = useState<Tab>("equivalencia");

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
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
              <p className="text-xs text-muted-foreground">Calculadoras clínicas baseadas em evidência</p>
            </div>
          </div>

          {/* Tab cards */}
          <div className="grid grid-cols-3 gap-3">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200",
                    active
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
                  )}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: active ? "#4A6CF720" : undefined }}
                  >
                    <Icon
                      size={18}
                      className={active ? "text-primary" : "text-muted-foreground"}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", active ? "text-primary" : "text-foreground")}>
                      {t.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate hidden sm:block">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conteúdo da tab */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.06)]">
            {tab === "equivalencia" && <EquivalenciaCalc />}
            {tab === "dose"         && <DoseCalc />}
            {tab === "qtc"          && <QtcChecker />}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
