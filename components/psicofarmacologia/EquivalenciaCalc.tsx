"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw, Info } from "lucide-react";
import { antipsicóticos, cpzEquivalente, doseEquivalente } from "@/lib/data/antipsicóticos";
import { cn } from "@/lib/utils";

export function EquivalenciaCalc() {
  const [origemId, setOrigemId]   = useState("haloperidol");
  const [alvoId, setAlvoId]       = useState("olanzapina");
  const [dose, setDose]           = useState("");

  const origem = antipsicóticos.find((a) => a.id === origemId)!;
  const alvo   = antipsicóticos.find((a) => a.id === alvoId)!;

  const doseNum = parseFloat(dose);
  const cpzTotal = !isNaN(doseNum) && doseNum > 0 ? cpzEquivalente(origem, doseNum) : null;
  const doseAlvo = cpzTotal !== null ? doseEquivalente(cpzTotal, alvo) : null;

  const acimaDaMax = doseAlvo !== null && doseAlvo > alvo.dose_max_mg;

  function inverter() {
    setOrigemId(alvoId);
    setAlvoId(origemId);
    setDose("");
  }

  return (
    <div className="space-y-5">
      <div className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5 text-primary" />
        <span>
          Baseado em <strong>Leucht et al. 2016 (Lancet)</strong> e <strong>Gardner et al. 2010</strong>.
          Equivalência em Clorpromazina (CPZ). Use como referência clínica — titular individualmente.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        {/* Droga origem */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medicamento atual</p>
          <DrugSelect value={origemId} onChange={setOrigemId} exclude={alvoId} />
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Dose atual (mg/dia)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder={`${origem.dose_min_mg}–${origem.dose_max_mg} mg`}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <DrugInfo drug={origem} />
        </div>

        {/* Centro — CPZ equiv + botão inverter */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Equiv. CPZ</p>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-center min-w-[80px]">
              <span className="text-lg font-bold text-primary font-mono">
                {cpzTotal !== null ? Math.round(cpzTotal) : "—"}
              </span>
              <span className="text-xs text-primary/70 ml-1">mg</span>
            </div>
          </div>
          <ArrowRight size={20} className="text-muted-foreground hidden md:block" />
          <button
            onClick={inverter}
            title="Inverter"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Droga alvo */}
        <div className={cn(
          "bg-card border rounded-2xl p-5 space-y-4 transition-colors",
          acimaDaMax ? "border-destructive/50" : "border-border"
        )}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medicamento alvo</p>
          <DrugSelect value={alvoId} onChange={setAlvoId} exclude={origemId} />

          {/* Resultado */}
          <div className={cn(
            "rounded-xl px-4 py-3 text-center border",
            doseAlvo !== null
              ? acimaDaMax
                ? "bg-destructive/10 border-destructive/30"
                : "bg-green-500/10 border-green-500/20"
              : "bg-muted border-border"
          )}>
            {doseAlvo !== null ? (
              <>
                <p className="text-3xl font-bold font-mono" style={{ color: acimaDaMax ? "#D62828" : "#22C55E" }}>
                  {doseAlvo % 1 === 0 ? doseAlvo : doseAlvo.toFixed(1)} mg
                </p>
                <p className="text-xs mt-1" style={{ color: acimaDaMax ? "#D62828" : "#22C55E" }}>
                  {acimaDaMax
                    ? `⚠ Acima da dose máxima (${alvo.dose_max_mg} mg)`
                    : `Dose equivalente/dia`}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Insira a dose acima</p>
            )}
          </div>
          <DrugInfo drug={alvo} />
        </div>
      </div>

      {/* Tabela de referência */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Tabela de equivalências (CPZ 100 mg)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Medicamento</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Classe</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Eq. CPZ (mg)</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Dose (mg/dia)</th>
                <th className="px-4 py-2 text-center font-medium text-muted-foreground">QTc</th>
                <th className="px-4 py-2 text-center font-medium text-muted-foreground">SUS</th>
              </tr>
            </thead>
            <tbody>
              {antipsicóticos.map((a) => (
                <tr key={a.id} className={cn(
                  "border-b border-border last:border-0 transition-colors cursor-pointer",
                  (a.id === origemId || a.id === alvoId) ? "bg-primary/5" : "hover:bg-muted/30"
                )}
                  onClick={() => setOrigemId(a.id)}
                >
                  <td className="px-4 py-2">
                    <span className="font-medium text-foreground">{a.nome}</span>
                    <span className="text-muted-foreground ml-1.5">{a.nomes_comerciais[0]}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      a.classe === "típico" ? "bg-orange-500/10 text-orange-600" : "bg-blue-500/10 text-blue-600"
                    )}>
                      {a.classe}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-foreground">{a.cpz_eq_mg}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground font-mono">{a.dose_min_mg}–{a.dose_max_mg}</td>
                  <td className="px-4 py-2 text-center">
                    <QTcBadge nivel={a.qtc} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      a.sus ? "bg-green-500" : "bg-muted-foreground/30"
                    )} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DrugSelect({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {antipsicóticos.filter((a) => a.id !== exclude).map((a) => (
        <option key={a.id} value={a.id}>{a.nome} ({a.nomes_comerciais[0]})</option>
      ))}
    </select>
  );
}

function DrugInfo({ drug }: { drug: (typeof antipsicóticos)[number] }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px]">
      <div className="bg-muted/50 rounded-lg px-3 py-2">
        <p className="text-muted-foreground">Meia-vida</p>
        <p className="font-semibold text-foreground font-mono">{drug.meia_vida_h}</p>
      </div>
      <div className="bg-muted/50 rounded-lg px-3 py-2">
        <p className="text-muted-foreground">Via</p>
        <p className="font-semibold text-foreground uppercase">{drug.via}</p>
      </div>
    </div>
  );
}

function QTcBadge({ nivel }: { nivel: "alto" | "moderado" | "baixo" }) {
  const map = {
    alto:     { label: "Alto",     cls: "bg-red-500/10 text-red-600" },
    moderado: { label: "Mod.",     cls: "bg-yellow-500/10 text-yellow-600" },
    baixo:    { label: "Baixo",    cls: "bg-green-500/10 text-green-600" },
  };
  const { label, cls } = map[nivel];
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold", cls)}>{label}</span>
  );
}
