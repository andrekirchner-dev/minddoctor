"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ClipboardList, Search, X, ChevronDown, ChevronUp,
  Copy, Check, Plus, FileText, Calendar, User, Pencil, Loader2,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { getConsultas, deleteConsulta, updateConsulta, type ConsultaRecord } from "@/lib/firebase/consultas";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

const TIPOS_LABEL: Record<string, string> = {
  "nova-consulta":   "Nova consulta",
  "retorno":         "Retorno ambulatorial",
  "urgencia":        "Urgência psiquiátrica",
  "enfermaria":      "Evolução de enfermaria",
  "hospital-dia":    "Hospital Dia",
  "inss":            "INSS / Perícia",
  "avaliacao-risco": "Avaliação de risco",
  "ajuste-med":      "Ajuste medicamentoso",
};

const RISCO_OPTIONS = ["baixo", "moderado", "alto", "indeterminado"];

function formatDateTime(seconds: number): string {
  const d = new Date(seconds * 1000);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({ record, onClose, onSaved }: {
  record: ConsultaRecord;
  onClose: () => void;
  onSaved: (updated: ConsultaRecord) => void;
}) {
  const [diagnostico,   setDiagnostico]   = useState(record.diagnosticoPrincipal ?? "");
  const [nivelRisco,    setNivelRisco]    = useState(record.nivelRisco ?? "");
  const [condutaFarma,  setCondutaFarma]  = useState(record.condutaFarma ?? "");
  const [prontuario,    setProntuario]    = useState(record.prontuarioBase ?? "");
  const [saving,        setSaving]        = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);

  async function handleSave() {
    setSaving(true);
    try {
      const updates = {
        diagnosticoPrincipal: diagnostico,
        nivelRisco,
        condutaFarma,
        prontuarioBase: prontuario,
      };
      await updateConsulta(record.id, updates);
      onSaved({ ...record, ...updates });
      toast.success("Consulta atualizada com sucesso.");
      onClose();
    } catch {
      toast.error("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pencil size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Editar Consulta</h2>
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                {record.patientName || "Paciente sem identificação"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diagnóstico principal</label>
              <input
                type="text"
                value={diagnostico}
                onChange={e => setDiagnostico(e.target.value)}
                placeholder="Ex: F32.1 — Episódio depressivo moderado"
                className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nível de risco</label>
              <select
                value={nivelRisco}
                onChange={e => setNivelRisco(e.target.value)}
                className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Não informado</option>
                {RISCO_OPTIONS.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Conduta farmacológica</label>
            <textarea
              value={condutaFarma}
              onChange={e => setCondutaFarma(e.target.value)}
              rows={3}
              placeholder="Prescrições, ajustes de dose, orientações..."
              className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prontuário</label>
            <textarea
              value={prontuario}
              onChange={e => setProntuario(e.target.value)}
              rows={10}
              className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-border flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── ConsultaCard ──────────────────────────────────────────────────────────────

import { useRef } from "react";

function ConsultaCard({ record, expanded, onToggle, onDelete, onEdit, copying, onCopy }: {
  record: ConsultaRecord;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  copying: boolean;
  onCopy: () => void;
}) {
  const date      = record.createdAt?.seconds ? formatDateTime(record.createdAt.seconds) : "—";
  const tipoLabel = TIPOS_LABEL[record.tipo] || record.tipo;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <ClipboardList size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-foreground text-sm">
                {record.patientName || "Paciente sem identificação"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tipoLabel}
                {record.diagnosticoPrincipal ? ` · ${record.diagnosticoPrincipal}` : ""}
                {record.nivelRisco ? ` · Risco ${record.nivelRisco}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{date}</span>
              {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </div>
          </div>
          {record.condutaFarma && (
            <p className="text-[11px] text-muted-foreground/70 mt-1 truncate">
              Conduta: {record.condutaFarma.slice(0, 80)}{record.condutaFarma.length > 80 ? "…" : ""}
            </p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {record.prontuarioBase && (
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText size={12} />
                  Prontuário-base
                </p>
                <button
                  type="button"
                  onClick={onCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all",
                    copying
                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {copying ? <Check size={11} /> : <Copy size={11} />}
                  {copying ? "Copiado!" : "Copiar texto"}
                </button>
              </div>
              <pre className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap font-sans bg-muted/30 border border-border rounded-xl p-4 max-h-80 overflow-y-auto">
                {record.prontuarioBase}
              </pre>
            </div>
          )}

          <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
            <Link
              href="/consulta/nova"
              onClick={() => {
                sessionStorage.setItem("md-retorno-id", record.id);
                sessionStorage.setItem("md-retorno-state", JSON.stringify(record.state));
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all"
            >
              <Plus size={12} />
              Usar como base de retorno
            </Link>
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
            >
              <Pencil size={12} />
              Editar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-rose-500/30 hover:text-rose-600 transition-all"
            >
              <X size={12} />
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoricoPage() {
  const { user }       = useAuth();
  const searchParams   = useSearchParams();
  const focusId        = searchParams.get("id");

  const [consultas,   setConsultas]   = useState<ConsultaRecord[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [queryText,   setQueryText]   = useState("");
  const [expandedId,  setExpandedId]  = useState<string | null>(focusId);
  const [copied,      setCopied]      = useState<string | false>(false);
  const [editRecord,  setEditRecord]  = useState<ConsultaRecord | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setConsultas(await getConsultas(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const filtered = consultas.filter(c => {
    if (!queryText) return true;
    const q = queryText.toLowerCase();
    return (
      c.patientName?.toLowerCase().includes(q) ||
      c.diagnosticoPrincipal?.toLowerCase().includes(q) ||
      c.tipo?.toLowerCase().includes(q) ||
      TIPOS_LABEL[c.tipo]?.toLowerCase().includes(q)
    );
  });

  async function handleDelete(id: string) {
    if (!confirm("Excluir este prontuário? Esta ação não pode ser desfeita.")) return;
    await deleteConsulta(id);
    setConsultas(prev => prev.filter(c => c.id !== id));
    if (expandedId === id) setExpandedId(null);
    toast.success("Consulta excluída.");
  }

  async function handleCopy(record: ConsultaRecord) {
    await navigator.clipboard.writeText(record.prontuarioBase || "");
    setCopied(record.id);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSavedEdit(updated: ConsultaRecord) {
    setConsultas(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/consulta" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0">
              <ChevronLeft size={16} />
            </Link>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}>
              <ClipboardList size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Histórico de Consultas</h1>
              <p className="text-xs text-muted-foreground">
                {loading ? "Carregando..." : `${consultas.length} prontuário${consultas.length !== 1 ? "s" : ""} registrado${consultas.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Link href="/consulta/nova" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0">
              <Plus size={13} />
              Nova consulta
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              placeholder="Buscar por paciente, CID ou tipo de consulta..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {queryText && (
              <button type="button" onClick={() => setQueryText("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <X size={14} className="text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Stats strip */}
          {!loading && consultas.length > 0 && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              {[
                { label: "Hoje", value: consultas.filter(c => {
                  const d = new Date((c.createdAt?.seconds ?? 0) * 1000);
                  const t = new Date(); t.setHours(0,0,0,0);
                  return d >= t;
                }).length },
                { label: "Esta semana", value: consultas.filter(c => {
                  const d = new Date((c.createdAt?.seconds ?? 0) * 1000);
                  const w = new Date(); w.setDate(w.getDate() - w.getDay()); w.setHours(0,0,0,0);
                  return d >= w;
                }).length },
                { label: "Este mês", value: consultas.filter(c => {
                  const d = new Date((c.createdAt?.seconds ?? 0) * 1000);
                  const m = new Date(); m.setDate(1); m.setHours(0,0,0,0);
                  return d >= m;
                }).length },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1">
                  <Calendar size={11} />
                  <span className="font-semibold text-foreground">{s.value}</span>
                  <span>{s.label.toLowerCase()}</span>
                </div>
              ))}
            </div>
          )}

          {/* List */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-xl bg-muted shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 w-40 rounded bg-muted" />
                          <div className="h-2.5 w-28 rounded bg-muted" />
                        </div>
                        <div className="h-2.5 w-16 rounded bg-muted shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                {queryText ? <Search size={24} className="text-muted-foreground/40" /> : <User size={24} className="text-muted-foreground/40" />}
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">
                  {queryText ? "Nenhuma consulta encontrada" : "Nenhuma consulta registrada"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {queryText ? `Nenhum resultado para "${queryText}"` : "As consultas confirmadas aparecerão aqui automaticamente."}
                </p>
              </div>
              {!queryText && (
                <Link href="/consulta/nova" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus size={15} />
                  Iniciar primeira consulta
                </Link>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map(record => (
                <ConsultaCard
                  key={record.id}
                  record={record}
                  expanded={expandedId === record.id}
                  onToggle={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  onDelete={() => handleDelete(record.id)}
                  onEdit={() => setEditRecord(record)}
                  copying={copied === record.id}
                  onCopy={() => handleCopy(record)}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>

      {editRecord && (
        <EditModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSaved={handleSavedEdit}
        />
      )}
    </AuthGuard>
  );
}
