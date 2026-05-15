"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ClipboardList, Search, X, ChevronDown, ChevronUp,
  Copy, Check, Plus, FileText, Calendar, User,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { getConsultas, deleteConsulta, type ConsultaRecord } from "@/lib/firebase/consultas";
import { cn } from "@/lib/utils";

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

function formatDateTime(seconds: number): string {
  const d = new Date(seconds * 1000);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function ConsultaCard({ record, expanded, onToggle, onDelete, copying, onCopy }: {
  record: ConsultaRecord;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  copying: boolean;
  onCopy: () => void;
}) {
  const date = record.createdAt?.seconds ? formatDateTime(record.createdAt.seconds) : "—";
  const tipoLabel = TIPOS_LABEL[record.tipo] || record.tipo;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
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

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border">
          {/* Prontuário */}
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

          {/* Actions */}
          <div className="px-5 pb-4 flex items-center gap-2">
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

export default function HistoricoPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id");

  const [consultas, setConsultas] = useState<ConsultaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(focusId);
  const [copied, setCopied] = useState<string | false>(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getConsultas(user.uid);
      setConsultas(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const filtered = consultas.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
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
  }

  async function handleCopy(record: ConsultaRecord) {
    await navigator.clipboard.writeText(record.prontuarioBase || "");
    setCopied(record.id);
    setTimeout(() => setCopied(false), 2000);
  }

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
              style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}
            >
              <ClipboardList size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Histórico de Consultas</h1>
              <p className="text-xs text-muted-foreground">
                {loading ? "Carregando..." : `${consultas.length} prontuário${consultas.length !== 1 ? "s" : ""} registrado${consultas.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Link
              href="/consulta/nova"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              <Plus size={13} />
              Nova consulta
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por paciente, CID ou tipo de consulta..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
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
                  const today = new Date(); today.setHours(0,0,0,0);
                  return d >= today;
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
              {[1,2,3].map(i => (
                <div key={i} className="h-20 bg-muted/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                {query ? <Search size={24} className="text-muted-foreground/40" /> : <User size={24} className="text-muted-foreground/40" />}
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">
                  {query ? "Nenhuma consulta encontrada" : "Nenhuma consulta registrada"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {query ? `Nenhum resultado para "${query}"` : "As consultas confirmadas aparecerão aqui automaticamente."}
                </p>
              </div>
              {!query && (
                <Link
                  href="/consulta/nova"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
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
                  copying={copied === record.id}
                  onCopy={() => handleCopy(record)}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
