"use client";

import { useState } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { antipsicóticos } from "@/lib/data/antipsicóticos";
import { cn } from "@/lib/utils";

export function DoseCalc() {
  const [drugId, setDrugId] = useState("olanzapina");
  const [peso, setPeso]     = useState("");

  const drug   = antipsicóticos.find((a) => a.id === drugId)!;
  const pesoNum = parseFloat(peso);

  // Faixa terapêutica
  const faixaMin = drug.dose_min_mg;
  const faixaMax = drug.dose_max_mg;
  const faixaMid = Math.round((faixaMin + faixaMax) / 2);

  // Dose inicial típica (~1/4 da dose alvo)
  const doseInicial = Math.max(faixaMin, Math.round(faixaMid * 0.25 * 2) / 2);

  return (
    <div className="space-y-5">
      <div className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5 text-primary" />
        <span>
          Doses de referência para adultos (≥18 anos). Ajustar conforme resposta clínica,
          função renal/hepática e tolerabilidade. Sempre titular progressivamente.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seleção */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Antipsicótico</label>
          <select
            value={drugId}
            onChange={(e) => setDrugId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {antipsicóticos.map((a) => (
              <option key={a.id} value={a.id}>{a.nome} ({a.nomes_comerciais[0]})</option>
            ))}
          </select>

          <label className="text-sm font-medium text-foreground block">Peso do paciente (kg) — opcional</label>
          <input
            type="number"
            min={20}
            max={200}
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ex: 70"
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Resultado */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">{drug.nome}</h3>

          <div className="grid grid-cols-3 gap-2 text-center">
            <DoseBox label="Dose inicial" value={`${doseInicial} mg`} color="#4A6CF7" />
            <DoseBox label="Faixa alvo" value={`${faixaMin}–${faixaMax} mg`} color="#7B5EA7" />
            <DoseBox label="Dose máx." value={`${faixaMax} mg`} color="#D62828" />
          </div>

          {/* Barra visual */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{faixaMin} mg</span>
              <span>{faixaMax} mg</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted relative">
              <div
                className="h-full rounded-full"
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg, #4A6CF730, #4A6CF7, #7B5EA7, #D62828)",
                }}
              />
              {/* Marcador dose inicial */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-primary shadow"
                style={{ left: `${((doseInicial - faixaMin) / (faixaMax - faixaMin)) * 100}%` }}
                title={`Dose inicial: ${doseInicial}mg`}
              />
            </div>
          </div>

          {/* Fichas rápidas */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <InfoTile label="Via" value={drug.via.toUpperCase()} />
            <InfoTile label="Meia-vida" value={String(drug.meia_vida_h)} />
            <InfoTile label="Classe" value={drug.classe} />
            <InfoTile label="Risco QTc" value={drug.qtc} color={
              drug.qtc === "alto" ? "#D62828" : drug.qtc === "moderado" ? "#F59E0B" : "#22C55E"
            } />
          </div>

          {drug.qtc === "alto" && (
            <div className="flex gap-2 text-[11px] text-red-600 bg-red-500/10 rounded-xl px-3 py-2">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              <span>Alto risco de prolongamento do QTc. Solicitar ECG basal e monitorar.</span>
            </div>
          )}
        </div>
      </div>

      {/* Notas clínicas */}
      {drug.notas && (
        <div className="bg-muted/40 border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Nota clínica: </span>
          {drug.notas}
        </div>
      )}
    </div>
  );
}

function DoseBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: `${color}12` }}>
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      <p className="font-bold text-sm font-mono" style={{ color }}>{value}</p>
    </div>
  );
}

function InfoTile({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-muted/50 rounded-lg px-3 py-2">
      <p className="text-muted-foreground text-[10px]">{label}</p>
      <p className={cn("font-semibold capitalize")} style={{ color }}>{value}</p>
    </div>
  );
}
