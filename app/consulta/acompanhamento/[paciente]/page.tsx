"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft, Plus, X, Trash2, Edit2, AlertTriangle,
  Calendar, Activity, Pill, CheckCircle2, Clock, ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar, ComposedChart, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Timestamp } from "firebase/firestore";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { getConsultas, type ConsultaRecord } from "@/lib/firebase/consultas";
import {
  getEvolucoes, saveEvolucao, updateEvolucao, deleteEvolucao,
  type EvolucaoClinica, type MedicamentoSnapshot, type SintomaSnapshot,
} from "@/lib/firebase/evolucoes";
import {
  getPlanosCrise, savePlanoCrise, updatePlanoCrise, deletePlanoCrise,
  type PlanoCrise, type StatusPlanoCrise,
} from "@/lib/firebase/planosCrise";
import { cn } from "@/lib/utils";

// ─── helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateBR(isoOrSeconds: string | number): string {
  const d = typeof isoOrSeconds === "number"
    ? new Date(isoOrSeconds * 1000)
    : new Date(isoOrSeconds + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function tsToISO(ts: Timestamp | undefined): string {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toISOString().slice(0, 10);
}

function tsToDateLabel(ts: Timestamp | undefined): string {
  if (!ts) return "";
  const d = new Date(ts.seconds * 1000);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const RISCO_COLORS: Record<string, string> = {
  baixo: "bg-green-500/10 text-green-600",
  moderado: "bg-amber-500/10 text-amber-600",
  alto: "bg-red-500/10 text-red-600",
};

const STATUS_COLORS: Record<string, string> = {
  ativo: "bg-green-500/10 text-green-700 border border-green-500/20",
  revisado: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  arquivado: "bg-muted text-muted-foreground border border-border",
};

// Predefined symptom list
const SINTOMAS_PREDEFINIDOS = [
  "Insônia", "Hipersonia", "Apetite reduzido", "Concentração prejudicada",
  "Pensamentos intrusivos", "Alucinações", "Agitação", "Irritabilidade",
  "Anedonia", "Fadiga",
];

const SINAIS_ALERTA_SUGESTOES = [
  "Piora do humor depressivo", "Pensamentos suicidas", "Alucinações",
  "Agitação intensa", "Recusa de medicação",
];

const MEDIDAS_SUGESTOES = [
  "Contatar familiar responsável", "Não ficar sozinho",
  "Retirar meios letais", "Ligar para o médico", "Ir à UPA/PS",
];

// ─── Chart data ───────────────────────────────────────────────────────────────

interface ChartPoint {
  dateLabel: string;
  dateISO: string;
  humorGeral: number;
  ansiedade: number;
  sono: number;
  funcionamento: number;
  [key: string]: string | number;
}

function prepareChartData(evolucoes: EvolucaoClinica[]): {
  data: ChartPoint[];
  allMedNames: string[];
  allSintomaNames: string[];
} {
  const sorted = [...evolucoes].sort(
    (a, b) => (a.data?.seconds ?? 0) - (b.data?.seconds ?? 0)
  );

  const allMedNames: string[] = [];
  const allSintomaNames: string[] = [];

  for (const e of sorted) {
    for (const m of e.medicamentos) {
      if (!allMedNames.includes(m.nome)) allMedNames.push(m.nome);
    }
    for (const s of e.sintomas) {
      if (!allSintomaNames.includes(s.nome)) allSintomaNames.push(s.nome);
    }
  }

  const data: ChartPoint[] = sorted.map(e => {
    const point: ChartPoint = {
      dateLabel: tsToDateLabel(e.data),
      dateISO: tsToISO(e.data),
      humorGeral: e.humorGeral,
      ansiedade: e.ansiedade,
      sono: e.sono,
      funcionamento: e.funcionamento,
    };
    for (const m of e.medicamentos) {
      point[`med_${m.nome}_dose`] = m.doseNum;
      point[`med_${m.nome}_adesao`] = m.adesao;
    }
    for (const s of e.sintomas) {
      point[`sin_${s.nome}`] = s.intensidade;
    }
    return point;
  });

  return { data, allMedNames, allSintomaNames };
}

function filterByRange(data: ChartPoint[], range: string): ChartPoint[] {
  if (range === "todos") return data;
  const months = range === "3m" ? 3 : range === "6m" ? 6 : 12;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const cutISO = cutoff.toISOString().slice(0, 10);
  return data.filter(p => p.dateISO >= cutISO);
}

// ─── Score rating buttons ─────────────────────────────────────────────────────

function ScoreRow({ label, value, onChange }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              "w-7 h-7 rounded-lg text-xs font-semibold transition-all",
              value === i
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            )}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Evolution form ───────────────────────────────────────────────────────────

interface EvolucaoFormData {
  data: string;
  humorGeral: number;
  ansiedade: number;
  sono: number;
  funcionamento: number;
  medicamentos: MedicamentoSnapshot[];
  sintomas: SintomaSnapshot[];
  texto: string;
  proximaAvaliacao: string;
}

function emptyForm(): EvolucaoFormData {
  return {
    data: todayISO(),
    humorGeral: 5,
    ansiedade: 5,
    sono: 5,
    funcionamento: 5,
    medicamentos: [],
    sintomas: [],
    texto: "",
    proximaAvaliacao: "",
  };
}

function EvolucaoForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: EvolucaoFormData;
  onSave: (f: EvolucaoFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<EvolucaoFormData>(initial ?? emptyForm());

  function setField<K extends keyof EvolucaoFormData>(k: K, v: EvolucaoFormData[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function addMed() {
    setField("medicamentos", [
      ...form.medicamentos,
      { nome: "", dose: "", doseNum: 0, adesao: 100 },
    ]);
  }

  function removeMed(idx: number) {
    setField("medicamentos", form.medicamentos.filter((_, i) => i !== idx));
  }

  function updateMed(idx: number, partial: Partial<MedicamentoSnapshot>) {
    setField("medicamentos", form.medicamentos.map((m, i) =>
      i === idx ? { ...m, ...partial } : m
    ));
  }

  function toggleSintoma(nome: string) {
    const exists = form.sintomas.find(s => s.nome === nome);
    if (exists) {
      setField("sintomas", form.sintomas.filter(s => s.nome !== nome));
    } else {
      setField("sintomas", [...form.sintomas, { nome, intensidade: 5 }]);
    }
  }

  function updateSintomaIntensidade(nome: string, intensidade: number) {
    setField("sintomas", form.sintomas.map(s =>
      s.nome === nome ? { ...s, intensidade } : s
    ));
  }

  return (
    <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-5">
      <p className="text-sm font-bold text-foreground">Nova nota de evolução</p>

      {/* Date */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Data</label>
        <input
          type="date"
          value={form.data}
          onChange={e => setField("data", e.target.value)}
          className="bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Global ratings */}
      <div className="space-y-4">
        <ScoreRow label="Humor Geral (0–10)" value={form.humorGeral} onChange={v => setField("humorGeral", v)} />
        <ScoreRow label="Ansiedade (0–10)" value={form.ansiedade} onChange={v => setField("ansiedade", v)} />
        <ScoreRow label="Sono (0–10)" value={form.sono} onChange={v => setField("sono", v)} />
        <ScoreRow label="Funcionamento Global (0–10)" value={form.funcionamento} onChange={v => setField("funcionamento", v)} />
      </div>

      {/* Medications */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground">Medicamentos</p>
          <button
            type="button"
            onClick={addMed}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus size={12} />
            Adicionar medicamento
          </button>
        </div>
        {form.medicamentos.length === 0 && (
          <p className="text-[11px] text-muted-foreground/60 italic">Nenhum medicamento adicionado.</p>
        )}
        <div className="space-y-2">
          {form.medicamentos.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Nome"
                value={m.nome}
                onChange={e => updateMed(idx, { nome: e.target.value })}
                className="flex-1 min-w-0 bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="number"
                placeholder="Dose (mg)"
                value={m.doseNum || ""}
                onChange={e => {
                  const n = parseFloat(e.target.value) || 0;
                  updateMed(idx, { doseNum: n, dose: `${n}mg` });
                }}
                className="w-24 bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <select
                value={m.adesao}
                onChange={e => updateMed(idx, { adesao: Number(e.target.value) })}
                className="w-28 bg-muted border border-border rounded-xl px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {[0, 25, 50, 75, 100].map(v => (
                  <option key={v} value={v}>{v}% adesão</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeMed(idx)}
                className="text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom symptoms */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Sintomas</p>
        <div className="space-y-2">
          {SINTOMAS_PREDEFINIDOS.map(nome => {
            const selected = form.sintomas.find(s => s.nome === nome);
            return (
              <div key={nome}>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => toggleSintoma(nome)}
                    className="rounded border-border accent-primary"
                  />
                  <span className="text-xs text-foreground">{nome}</span>
                </label>
                {selected && (
                  <div className="flex flex-wrap gap-1 mt-1 ml-5">
                    {Array.from({ length: 11 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateSintomaIntensidade(nome, i)}
                        className={cn(
                          "w-6 h-6 rounded-md text-[10px] font-semibold transition-all",
                          selected.intensidade === i
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground hover:bg-primary/10"
                        )}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Free text */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
          Nota livre
        </label>
        <textarea
          rows={3}
          value={form.texto}
          onChange={e => setField("texto", e.target.value)}
          placeholder="Observações clínicas..."
          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      {/* Next evaluation */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
          Próxima avaliação (opcional)
        </label>
        <input
          type="date"
          value={form.proximaAvaliacao}
          onChange={e => setField("proximaAvaliacao", e.target.value)}
          className="bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Nota"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary/30 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Plano de Crise form ──────────────────────────────────────────────────────

interface PlanoFormData {
  sinaisAlerta: string[];
  medidasImediatas: string[];
  contatoEmergencia: string;
  textoCompleto: string;
  status: StatusPlanoCrise;
}

function emptyPlanoForm(): PlanoFormData {
  return {
    sinaisAlerta: [],
    medidasImediatas: [],
    contatoEmergencia: "",
    textoCompleto: "",
    status: "ativo",
  };
}

function PlanoForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: PlanoFormData;
  onSave: (f: PlanoFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PlanoFormData>(initial ?? emptyPlanoForm());
  const [newSinal, setNewSinal] = useState("");
  const [newMedida, setNewMedida] = useState("");

  function addSinal(s: string) {
    const val = s.trim();
    if (!val || form.sinaisAlerta.includes(val)) return;
    setForm(prev => ({ ...prev, sinaisAlerta: [...prev.sinaisAlerta, val] }));
    setNewSinal("");
  }

  function removeSinal(s: string) {
    setForm(prev => ({ ...prev, sinaisAlerta: prev.sinaisAlerta.filter(x => x !== s) }));
  }

  function addMedida(m: string) {
    const val = m.trim();
    if (!val || form.medidasImediatas.includes(val)) return;
    setForm(prev => ({ ...prev, medidasImediatas: [...prev.medidasImediatas, val] }));
    setNewMedida("");
  }

  function removeMedida(m: string) {
    setForm(prev => ({ ...prev, medidasImediatas: prev.medidasImediatas.filter(x => x !== m) }));
  }

  function autoFillText() {
    if (form.textoCompleto) return;
    const text = [
      form.sinaisAlerta.length > 0
        ? `Sinais de alerta:\n${form.sinaisAlerta.map(s => `- ${s}`).join("\n")}`
        : "",
      form.medidasImediatas.length > 0
        ? `\nMedidas imediatas:\n${form.medidasImediatas.map(m => `- ${m}`).join("\n")}`
        : "",
      form.contatoEmergencia
        ? `\nContato de emergência: ${form.contatoEmergencia}`
        : "",
    ].join("");
    setForm(prev => ({ ...prev, textoCompleto: text.trim() }));
  }

  return (
    <div className="bg-card border border-amber-500/20 rounded-2xl p-5 space-y-5">
      <p className="text-sm font-bold text-foreground">Plano de Crise</p>

      {/* Sinais de alerta */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Sinais de alerta</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.sinaisAlerta.map(s => (
            <span key={s} className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-700 text-[10px] font-semibold">
              {s}
              <button type="button" onClick={() => removeSinal(s)}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSinal}
            onChange={e => setNewSinal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSinal(newSinal))}
            placeholder="Adicionar sinal..."
            className="flex-1 bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => addSinal(newSinal)}
            className="px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground hover:border-primary/30 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SINAIS_ALERTA_SUGESTOES.filter(s => !form.sinaisAlerta.includes(s)).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addSinal(s)}
              className="px-2 py-0.5 rounded-full border border-border text-[10px] text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Medidas imediatas */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Medidas imediatas</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.medidasImediatas.map(m => (
            <span key={m} className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 text-[10px] font-semibold">
              {m}
              <button type="button" onClick={() => removeMedida(m)}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newMedida}
            onChange={e => setNewMedida(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMedida(newMedida))}
            placeholder="Adicionar medida..."
            className="flex-1 bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => addMedida(newMedida)}
            className="px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground hover:border-primary/30 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MEDIDAS_SUGESTOES.filter(m => !form.medidasImediatas.includes(m)).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => addMedida(m)}
              className="px-2 py-0.5 rounded-full border border-border text-[10px] text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
            >
              + {m}
            </button>
          ))}
        </div>
      </div>

      {/* Contato */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Contato de emergência</label>
        <input
          type="text"
          value={form.contatoEmergencia}
          onChange={e => setForm(prev => ({ ...prev, contatoEmergencia: e.target.value }))}
          placeholder="Nome e telefone..."
          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Texto completo */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Texto completo</label>
          {!form.textoCompleto && (
            <button
              type="button"
              onClick={autoFillText}
              className="text-[10px] text-primary hover:underline"
            >
              Preencher automaticamente
            </button>
          )}
        </div>
        <textarea
          rows={4}
          value={form.textoCompleto}
          onChange={e => setForm(prev => ({ ...prev, textoCompleto: e.target.value }))}
          placeholder="Texto completo do plano de crise..."
          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      {/* Status */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Salvar como</p>
        <div className="flex gap-2">
          {(["ativo", "revisado"] as StatusPlanoCrise[]).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, status: s }))}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize",
                form.status === s
                  ? "bg-primary text-white border-primary"
                  : "bg-muted border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {s === "ativo" ? "Ativo" : "Revisado"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Plano"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary/30 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Evolução ─────────────────────────────────────────────────────────────

function TabEvolucao({
  evolucoes,
  userId,
  pacienteNome,
  onRefresh,
}: {
  evolucoes: EvolucaoClinica[];
  userId: string;
  pacienteNome: string;
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function evolucaoToForm(e: EvolucaoClinica): EvolucaoFormData {
    return {
      data: tsToISO(e.data) || todayISO(),
      humorGeral: e.humorGeral,
      ansiedade: e.ansiedade,
      sono: e.sono,
      funcionamento: e.funcionamento,
      medicamentos: e.medicamentos,
      sintomas: e.sintomas,
      texto: e.texto,
      proximaAvaliacao: e.proximaAvaliacao || "",
    };
  }

  async function handleSave(form: EvolucaoFormData) {
    setSaving(true);
    try {
      const dataTs = Timestamp.fromDate(new Date(form.data + "T12:00:00"));
      if (editId) {
        await updateEvolucao(editId, {
          data: dataTs,
          humorGeral: form.humorGeral,
          ansiedade: form.ansiedade,
          sono: form.sono,
          funcionamento: form.funcionamento,
          medicamentos: form.medicamentos,
          sintomas: form.sintomas,
          texto: form.texto,
          proximaAvaliacao: form.proximaAvaliacao || undefined,
        });
      } else {
        await saveEvolucao({
          userId,
          pacienteNome,
          data: dataTs,
          humorGeral: form.humorGeral,
          ansiedade: form.ansiedade,
          sono: form.sono,
          funcionamento: form.funcionamento,
          medicamentos: form.medicamentos,
          sintomas: form.sintomas,
          texto: form.texto,
          proximaAvaliacao: form.proximaAvaliacao || undefined,
        });
      }
      setShowForm(false);
      setEditId(null);
      onRefresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(e: EvolucaoClinica) {
    if (!confirm("Excluir esta nota? Não é possível desfazer.")) return;
    await deleteEvolucao(e.id, userId, pacienteNome);
    onRefresh();
  }

  const editingEvolucao = editId ? evolucoes.find(e => e.id === editId) : null;

  return (
    <div className="space-y-4">
      {/* New note button */}
      {!showForm && !editId && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} />
          Nova Nota de Evolução
        </button>
      )}

      {/* Form */}
      {(showForm || editId) && (
        <EvolucaoForm
          initial={editingEvolucao ? evolucaoToForm(editingEvolucao) : undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditId(null); }}
          saving={saving}
        />
      )}

      {/* Notes list */}
      {evolucoes.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <Activity size={32} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground text-center">Nenhuma nota de evolução ainda.</p>
        </div>
      )}

      <div className="space-y-3">
        {evolucoes.map(e => (
          <div key={e.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
            {/* Date */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground">
                {e.data?.seconds ? formatDateBR(e.data.seconds) : "—"}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setEditId(e.id); setShowForm(false); }}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(e)}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-rose-500/30 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            {/* Score chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Humor", value: e.humorGeral, color: "bg-indigo-500/10 text-indigo-700" },
                { label: "Ansiedade", value: e.ansiedade, color: "bg-orange-500/10 text-orange-700" },
                { label: "Sono", value: e.sono, color: "bg-cyan-500/10 text-cyan-700" },
                { label: "Func.", value: e.funcionamento, color: "bg-green-500/10 text-green-700" },
              ].map(chip => (
                <span key={chip.label} className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", chip.color)}>
                  {chip.label} {chip.value}/10
                </span>
              ))}
            </div>

            {/* Medications */}
            {e.medicamentos.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Medicamentos</p>
                <div className="flex flex-wrap gap-1.5">
                  {e.medicamentos.map((m, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700 text-[10px] font-semibold border border-violet-500/20">
                      <Pill size={9} />
                      {m.nome} {m.dose} · {m.adesao}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Symptoms */}
            {e.sintomas.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Sintomas</p>
                <div className="flex flex-wrap gap-1.5">
                  {e.sintomas.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 text-[10px] font-semibold border border-rose-500/20">
                      {s.nome} {s.intensidade}/10
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Text */}
            {e.texto && (
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                {e.texto}
              </p>
            )}

            {/* Next evaluation */}
            {e.proximaAvaliacao && (
              <div className="flex items-center gap-1.5 pt-1">
                <Clock size={11} className="text-primary" />
                <span className="text-[10px] font-semibold text-primary">
                  Próxima avaliação: {formatDateBR(e.proximaAvaliacao)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Gráficos ─────────────────────────────────────────────────────────────

const MED_COLORS = ["#4A6CF7", "#F97316", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6"];

function TabGraficos({ evolucoes }: { evolucoes: EvolucaoClinica[] }) {
  const [range, setRange] = useState("todos");
  const [med1, setMed1] = useState("");
  const [med2, setMed2] = useState("");
  const [cmpMed, setCmpMed] = useState("");
  const [cmpSin, setCmpSin] = useState("humorGeral");

  const { data: allData, allMedNames, allSintomaNames } = useMemo(
    () => prepareChartData(evolucoes),
    [evolucoes]
  );
  const data = useMemo(() => filterByRange(allData, range), [allData, range]);

  const sintomaOptions = [
    { value: "humorGeral", label: "Humor Geral" },
    { value: "ansiedade", label: "Ansiedade" },
    { value: "sono", label: "Sono" },
    { value: "funcionamento", label: "Funcionamento" },
    ...allSintomaNames.map(n => ({ value: `sin_${n}`, label: n })),
  ];

  // Latest note radar
  const latest = evolucoes[0];
  const radarData = latest ? [
    { subject: "Humor", value: latest.humorGeral },
    { subject: "Ansiedade", value: 10 - latest.ansiedade },
    { subject: "Sono", value: latest.sono },
    { subject: "Funcionamento", value: latest.funcionamento },
    ...latest.sintomas.map(s => ({ subject: s.nome, value: 10 - s.intensidade })),
  ] : [];

  if (evolucoes.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Activity size={32} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground text-center">
          Adicione pelo menos 2 notas de evolução para visualizar os gráficos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Range selector */}
      <div className="flex gap-1.5">
        {[
          { v: "todos", l: "Todos" },
          { v: "3m", l: "3 meses" },
          { v: "6m", l: "6 meses" },
          { v: "1a", l: "1 ano" },
        ].map(o => (
          <button
            key={o.v}
            type="button"
            onClick={() => setRange(o.v)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              range === o.v
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            )}
          >
            {o.l}
          </button>
        ))}
      </div>

      {/* Chart 1: Symptom evolution */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-foreground mb-4">Evolução de Sintomas</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="humorGeral" name="Humor Geral" stroke="#4A6CF7" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="ansiedade" name="Ansiedade" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="sono" name="Sono" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="funcionamento" name="Funcionamento" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Medication doses */}
      {allMedNames.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-bold text-foreground mb-3">Medicamentos ao Longo do Tempo</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { val: med1, set: setMed1, label: "Medicamento 1" },
              { val: med2, set: setMed2, label: "Medicamento 2" },
            ].map((sel, idx) => (
              <select
                key={idx}
                value={sel.val}
                onChange={e => sel.set(e.target.value)}
                className="bg-muted border border-border rounded-xl px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">{sel.label}</option>
                {allMedNames.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(value, name) => {
                  const medName = String(name ?? "").replace("med_", "").replace("_dose", "");
                  return [`${value ?? "—"}mg`, medName];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v: string) => v.replace(/^med_/, "").replace(/_dose$/, "")} />
              {med1 && <Line type="monotone" dataKey={`med_${med1}_dose`} stroke={MED_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} name={`med_${med1}_dose`} />}
              {med2 && <Line type="monotone" dataKey={`med_${med2}_dose`} stroke={MED_COLORS[1]} strokeWidth={2} dot={{ r: 3 }} name={`med_${med2}_dose`} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart 3: Med vs Symptom */}
      {allMedNames.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-bold text-foreground mb-3">Medicamento vs Sintoma</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              value={cmpMed}
              onChange={e => setCmpMed(e.target.value)}
              className="bg-muted border border-border rounded-xl px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Selecionar medicamento</option>
              {allMedNames.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={cmpSin}
              onChange={e => setCmpSin(e.target.value)}
              className="bg-muted border border-border rounded-xl px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sintomaOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" domain={[0, 10]} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey={cmpSin} name={sintomaOptions.find(o => o.value === cmpSin)?.label ?? cmpSin} stroke="#4A6CF7" strokeWidth={2} dot={{ r: 3 }} />
              {cmpMed && (
                <Bar yAxisId="right" dataKey={`med_${cmpMed}_dose`} name={`${cmpMed} (mg)`} fill="#F97316" fillOpacity={0.3} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart 4: Radar */}
      {radarData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-bold text-foreground mb-1">Radar de Sintomas (última nota)</p>
          <p className="text-[10px] text-muted-foreground mb-4">
            {latest?.data?.seconds ? formatDateBR(latest.data.seconds) : ""}
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 9 }} />
              <Radar name="Saúde" dataKey="value" stroke="#4A6CF7" fill="#4A6CF7" fillOpacity={0.25} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Crise ────────────────────────────────────────────────────────────────

function TabCrise({
  planos,
  userId,
  pacienteNome,
  onRefresh,
}: {
  planos: PlanoCrise[];
  userId: string;
  pacienteNome: string;
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function planoToForm(p: PlanoCrise): PlanoFormData {
    return {
      sinaisAlerta: p.sinaisAlerta,
      medidasImediatas: p.medidasImediatas,
      contatoEmergencia: p.contatoEmergencia,
      textoCompleto: p.textoCompleto,
      status: p.status,
    };
  }

  async function handleSave(form: PlanoFormData) {
    setSaving(true);
    try {
      if (editId) {
        await updatePlanoCrise(editId, form);
      } else {
        await savePlanoCrise({ userId, pacienteNome, ...form });
      }
      setShowForm(false);
      setEditId(null);
      onRefresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: PlanoCrise) {
    if (!confirm("Excluir este plano de crise?")) return;
    await deletePlanoCrise(p.id, userId, pacienteNome);
    onRefresh();
  }

  async function handleStatus(p: PlanoCrise, status: StatusPlanoCrise) {
    await updatePlanoCrise(p.id, { status });
    onRefresh();
  }

  const editingPlano = editId ? planos.find(p => p.id === editId) : null;

  return (
    <div className="space-y-4">
      {/* Active plans */}
      {planos.filter(p => p.status === "ativo").length > 0 && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={14} className="text-rose-600" />
            <p className="text-xs font-bold text-rose-700">Planos ativos</p>
          </div>
          {planos.filter(p => p.status === "ativo").map(p => (
            <div key={p.id} className="text-xs text-rose-700 flex flex-wrap gap-1.5">
              {p.sinaisAlerta.map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-rose-500/15 font-semibold">{s}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* New plan button */}
      {!showForm && !editId && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/30 text-sm font-semibold hover:bg-amber-500/20 transition-colors"
        >
          <Plus size={15} />
          Novo Plano de Crise
        </button>
      )}

      {/* Form */}
      {(showForm || editId) && (
        <PlanoForm
          initial={editingPlano ? planoToForm(editingPlano) : undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditId(null); }}
          saving={saving}
        />
      )}

      {/* Plans list */}
      {planos.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <ShieldAlert size={32} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground text-center">Nenhum plano de crise registrado.</p>
        </div>
      )}

      <div className="space-y-3">
        {planos.map(p => (
          <div key={p.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize", STATUS_COLORS[p.status])}>
                {p.status}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setEditId(p.id); setShowForm(false); }}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-rose-500/30 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            {p.sinaisAlerta.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Sinais de alerta</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.sinaisAlerta.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 text-[10px] font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {p.medidasImediatas.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Medidas imediatas</p>
                <ul className="space-y-0.5">
                  {p.medidasImediatas.map(m => (
                    <li key={m} className="flex items-center gap-1.5 text-xs text-foreground">
                      <CheckCircle2 size={11} className="text-green-600 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {p.contatoEmergencia && (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Contato:</span> {p.contatoEmergencia}
              </p>
            )}

            {/* Status actions */}
            <div className="flex gap-1.5 pt-1 border-t border-border">
              {p.status !== "arquivado" && (
                <button
                  type="button"
                  onClick={() => handleStatus(p, "arquivado")}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-border text-muted-foreground hover:border-muted-foreground/40 transition-colors"
                >
                  Arquivar
                </button>
              )}
              {p.status === "arquivado" && (
                <button
                  type="button"
                  onClick={() => handleStatus(p, "ativo")}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-green-500/30 text-green-700 hover:bg-green-500/10 transition-colors"
                >
                  Reativar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Agenda ───────────────────────────────────────────────────────────────

function TabAgenda({
  evolucoes,
  consultas,
}: {
  evolucoes: EvolucaoClinica[];
  consultas: ConsultaRecord[];
}) {
  const [editingDate, setEditingDate] = useState(false);
  const [newDate, setNewDate] = useState("");

  const latestWithDate = evolucoes.find(e => e.proximaAvaliacao);
  const proximaData = latestWithDate?.proximaAvaliacao;

  function diffDays(iso: string): number {
    const target = new Date(iso + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / 86400000);
  }

  function dayLabel(iso: string): { text: string; className: string } {
    const d = diffDays(iso);
    if (d === 0) return { text: "Hoje", className: "text-amber-600" };
    if (d < 0) return { text: `Atrasado ${Math.abs(d)} dias`, className: "text-rose-600" };
    return { text: `Em ${d} dias`, className: "text-green-600" };
  }

  const TIPOS_LABEL: Record<string, string> = {
    "nova-consulta": "Nova consulta",
    "retorno": "Retorno",
    "urgencia": "Urgência",
    "enfermaria": "Enfermaria",
    "hospital-dia": "Hospital Dia",
    "inss": "INSS / Perícia",
    "avaliacao-risco": "Avaliação de risco",
    "ajuste-med": "Ajuste med.",
  };

  return (
    <div className="space-y-5">
      {/* Next appointment */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          <p className="text-xs font-bold text-foreground">Próxima avaliação</p>
        </div>

        {proximaData && !editingDate ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">{formatDateBR(proximaData)}</p>
              <p className={cn("text-xs font-semibold mt-0.5", dayLabel(proximaData).className)}>
                {dayLabel(proximaData).text}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setEditingDate(true); setNewDate(proximaData); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
            >
              <Edit2 size={11} />
              Alterar
            </button>
          </div>
        ) : !editingDate ? (
          <p className="text-xs text-muted-foreground italic">Nenhuma próxima avaliação definida.</p>
        ) : null}

        {editingDate && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setEditingDate(false)}
              className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Ok
            </button>
            <button
              type="button"
              onClick={() => setEditingDate(false)}
              className="px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:border-primary/30 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Consultation history */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Histórico de consultas ({consultas.length})
        </p>
        {consultas.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Nenhuma consulta registrada.</p>
        ) : (
          <div className="space-y-2">
            {[...consultas].sort((a, b) =>
              (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
            ).map(c => (
              <Link
                key={c.id}
                href={`/consulta/historico?id=${c.id}`}
                className="group bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">
                      {c.createdAt?.seconds ? formatDateBR(c.createdAt.seconds) : "—"}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {TIPOS_LABEL[c.tipo] || c.tipo}
                    </span>
                  </div>
                  {c.diagnosticoPrincipal && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{c.diagnosticoPrincipal}</p>
                  )}
                </div>
                {c.nivelRisco && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                    RISCO_COLORS[c.nivelRisco.toLowerCase()] || "bg-muted text-muted-foreground"
                  )}>
                    Risco {c.nivelRisco}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "evolucao" | "graficos" | "crise" | "agenda";

export default function PacientePage({
  params,
}: {
  params: { paciente: string };
}) {
  const { user } = useAuth();
  const pacienteNome = decodeURIComponent(params.paciente);
  const [tab, setTab] = useState<Tab>("evolucao");
  const [loading, setLoading] = useState(true);
  const [consultas, setConsultas] = useState<ConsultaRecord[]>([]);
  const [evolucoes, setEvolucoes] = useState<EvolucaoClinica[]>([]);
  const [planos, setPlanos] = useState<PlanoCrise[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [allConsultas, evs, pls] = await Promise.all([
        getConsultas(user.uid),
        getEvolucoes(user.uid, pacienteNome),
        getPlanosCrise(user.uid, pacienteNome),
      ]);
      setConsultas(allConsultas.filter(c => c.patientName === pacienteNome));
      setEvolucoes(evs);
      setPlanos(pls);
    } finally {
      setLoading(false);
    }
  }, [user, pacienteNome]);

  useEffect(() => { load(); }, [load]);

  const hasActivePlan = planos.some(p => p.status === "ativo");

  const TABS: { id: Tab; label: string }[] = [
    { id: "evolucao", label: "Evolução" },
    { id: "graficos", label: "Gráficos" },
    { id: "crise", label: "Crise" },
    { id: "agenda", label: "Agenda" },
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/consulta/acompanhamento"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground truncate">{pacienteNome}</h1>
                {!loading && (
                  <>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold shrink-0">
                      {consultas.length} consulta{consultas.length !== 1 ? "s" : ""}
                    </span>
                    {evolucoes.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 text-[10px] font-semibold shrink-0">
                        {evolucoes.length} nota{evolucoes.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {hasActivePlan && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-semibold shrink-0 border border-rose-500/20">
                        <AlertTriangle size={9} />
                        Plano ativo
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Acompanhamento longitudinal</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 bg-muted rounded-xl p-1">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  tab === t.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse space-y-2">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-3/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          )}

          {/* Tab content */}
          {!loading && (
            <>
              {tab === "evolucao" && user && (
                <TabEvolucao
                  evolucoes={evolucoes}
                  userId={user.uid}
                  pacienteNome={pacienteNome}
                  onRefresh={load}
                />
              )}
              {tab === "graficos" && (
                <TabGraficos evolucoes={evolucoes} />
              )}
              {tab === "crise" && user && (
                <TabCrise
                  planos={planos}
                  userId={user.uid}
                  pacienteNome={pacienteNome}
                  onRefresh={load}
                />
              )}
              {tab === "agenda" && (
                <TabAgenda evolucoes={evolucoes} consultas={consultas} />
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
