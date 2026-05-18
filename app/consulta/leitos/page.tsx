"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, BedDouble, ChevronDown, ChevronUp, Plus, X,
  AlertTriangle, Pill, ClipboardList, Check, Pencil, LogOut,
  Trash2, RefreshCw,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getLeitos, saveLeito, updateLeito, deleteLeito,
  type Leito, type LeitoStatus, type Evolucao,
} from "@/lib/firebase/leitos";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<LeitoStatus, { label: string; textClass: string; bgClass: string; borderClass: string; badgeClass: string }> = {
  estavel: {
    label: "Estável",
    textClass: "text-green-600",
    bgClass: "bg-green-50 dark:bg-green-950/30",
    borderClass: "border-green-500",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  atencao: {
    label: "Atenção",
    textClass: "text-amber-600",
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  critico: {
    label: "Crítico",
    textClass: "text-red-600",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-500",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  alta: {
    label: "Alta",
    textClass: "text-muted-foreground",
    bgClass: "bg-muted/30",
    borderClass: "border-border",
    badgeClass: "bg-muted text-muted-foreground",
  },
};

const FILTROS: { value: "todos" | LeitoStatus; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "estavel", label: "Estável" },
  { value: "atencao", label: "Atenção" },
  { value: "critico", label: "Crítico" },
  { value: "alta", label: "Alta" },
];

function diasInternado(dataInternacao: string): number {
  return Math.floor((Date.now() - new Date(dataInternacao).getTime()) / 86400000);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const EMPTY_FORM = {
  numero: "",
  paciente: "",
  idade: "",
  sexo: "" as "" | "M" | "F",
  diagnostico: "",
  dataInternacao: new Date().toISOString().slice(0, 10),
  status: "estavel" as LeitoStatus,
  medicacoes: [] as string[],
  alertas: [] as string[],
};

export default function LeitosPage() {
  const { user } = useAuth();

  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | LeitoStatus>("todos");
  const [expandido, setExpandido] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Leito | null>(null);
  const [evolucaoTexto, setEvolucaoTexto] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState(EMPTY_FORM);
  const [medicInput, setMedicInput] = useState("");
  const [alertaInput, setAlertaInput] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getLeitos(user.uid);
      setLeitos(data);
    } catch {
      setErro("Erro ao carregar leitos.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const filtered = leitos.filter(l => filtro === "todos" || l.status === filtro);

  const ativos = leitos.filter(l => l.status !== "alta");
  const countEstavel = leitos.filter(l => l.status === "estavel").length;
  const countAtencao = leitos.filter(l => l.status === "atencao").length;
  const countCritico = leitos.filter(l => l.status === "critico").length;

  function openModal(leito?: Leito) {
    if (leito) {
      setEditando(leito);
      setForm({
        numero: leito.numero,
        paciente: leito.paciente,
        idade: leito.idade !== undefined ? String(leito.idade) : "",
        sexo: leito.sexo ?? "",
        diagnostico: leito.diagnostico,
        dataInternacao: leito.dataInternacao,
        status: leito.status,
        medicacoes: [...leito.medicacoes],
        alertas: [...leito.alertas],
      });
    } else {
      setEditando(null);
      setForm({ ...EMPTY_FORM, dataInternacao: new Date().toISOString().slice(0, 10), medicacoes: [], alertas: [] });
    }
    setMedicInput("");
    setAlertaInput("");
    setErro(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditando(null);
    setErro(null);
  }

  function addChip(field: "medicacoes" | "alertas", value: string, setter: (v: string) => void) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm(f => ({ ...f, [field]: [...f[field], trimmed] }));
    setter("");
  }

  function removeChip(field: "medicacoes" | "alertas", idx: number) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!user) return;
    if (!form.numero.trim() || !form.paciente.trim() || !form.diagnostico.trim() || !form.dataInternacao) {
      setErro("Preencha os campos obrigatórios.");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      const payload = {
        userId: user.uid,
        numero: form.numero.trim(),
        paciente: form.paciente.trim(),
        idade: form.idade ? parseInt(form.idade, 10) : undefined,
        sexo: form.sexo || undefined,
        diagnostico: form.diagnostico.trim(),
        dataInternacao: form.dataInternacao,
        status: form.status,
        medicacoes: form.medicacoes,
        alertas: form.alertas,
        evolucoes: editando?.evolucoes ?? [],
      };
      if (editando) {
        await updateLeito(editando.id, payload);
        setLeitos(prev => prev.map(l => l.id === editando.id ? { ...l, ...payload } : l));
      } else {
        const id = await saveLeito(payload);
        const newLeito: Leito = { id, ...payload, createdAt: null as never, updatedAt: null as never };
        setLeitos(prev => [newLeito, ...prev]);
      }
      closeModal();
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleEvolucao(leito: Leito) {
    const texto = (evolucaoTexto[leito.id] ?? "").trim();
    if (!texto) return;
    const nova: Evolucao = { id: Date.now().toString(), data: new Date().toISOString(), texto };
    const novasEvolucoes = [...leito.evolucoes, nova];
    try {
      await updateLeito(leito.id, { evolucoes: novasEvolucoes });
      setLeitos(prev => prev.map(l => l.id === leito.id ? { ...l, evolucoes: novasEvolucoes } : l));
      setEvolucaoTexto(prev => ({ ...prev, [leito.id]: "" }));
    } catch {
      setErro("Erro ao registrar evolução.");
    }
  }

  async function handleStatus(leito: Leito, status: LeitoStatus) {
    try {
      await updateLeito(leito.id, { status });
      setLeitos(prev => prev.map(l => l.id === leito.id ? { ...l, status } : l));
    } catch {
      setErro("Erro ao atualizar status.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este leito? Esta ação não pode ser desfeita.")) return;
    try {
      await deleteLeito(id);
      setLeitos(prev => prev.filter(l => l.id !== id));
      if (expandido === id) setExpandido(null);
    } catch {
      setErro("Erro ao excluir leito.");
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 pb-10">

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
              style={{ background: "linear-gradient(135deg, #14B8A6, #059669)" }}
            >
              <BedDouble size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground">Acompanhamento de Leito</h1>
              <p className="text-xs text-muted-foreground">Evolução de enfermaria</p>
            </div>
            <button
              type="button"
              onClick={() => openModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              <Plus size={13} />
              Novo Leito
            </button>
          </div>

          {/* Error banner */}
          {erro && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-600 shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-400">{erro}</p>
              <button type="button" onClick={() => setErro(null)} className="ml-auto text-red-400 hover:text-red-600">
                <X size={13} />
              </button>
            </div>
          )}

          {/* Stats */}
          {!loading && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Ativos", value: ativos.length, cls: "text-primary" },
                { label: "Estável", value: countEstavel, cls: "text-green-600" },
                { label: "Atenção", value: countAtencao, cls: "text-amber-600" },
                { label: "Crítico", value: countCritico, cls: "text-red-600" },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
                  <p className={cn("text-xl font-bold", s.cls)}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTROS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFiltro(f.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  filtro === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 rounded bg-muted" />
                      <div className="h-2.5 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="h-6 w-16 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <BedDouble size={28} className="text-muted-foreground/40" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">
                  {filtro === "todos" ? "Nenhum leito cadastrado" : `Nenhum leito com status "${STATUS_CONFIG[filtro as LeitoStatus]?.label}"`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filtro === "todos" ? "Cadastre o primeiro leito para iniciar o acompanhamento." : "Tente outro filtro ou cadastre um novo leito."}
                </p>
              </div>
              {filtro === "todos" && (
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Plus size={15} />
                  Cadastrar primeiro leito
                </button>
              )}
            </div>
          )}

          {/* Leito cards */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map(leito => {
                const cfg = STATUS_CONFIG[leito.status];
                const dias = diasInternado(leito.dataInternacao);
                const isOpen = expandido === leito.id;

                return (
                  <div
                    key={leito.id}
                    className={cn(
                      "bg-card border rounded-2xl overflow-hidden border-l-4 transition-all",
                      cfg.borderClass,
                      "border-t-border border-r-border border-b-border"
                    )}
                  >
                    {/* Card header — clickable */}
                    <button
                      type="button"
                      onClick={() => setExpandido(isOpen ? null : leito.id)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors text-left"
                    >
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", cfg.bgClass)}>
                        <BedDouble size={16} className={cfg.textClass} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{leito.numero}</span>
                          <span className="font-bold text-foreground text-sm truncate">{leito.paciente}</span>
                          {leito.idade && (
                            <span className="text-xs text-muted-foreground">
                              {leito.idade}a{leito.sexo ? ` · ${leito.sexo === "M" ? "Masc" : "Fem"}` : ""}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{leito.diagnostico}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{dias}d</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", cfg.badgeClass)}>
                          {cfg.label}
                        </span>
                        {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                      </div>
                    </button>

                    {/* Always-visible summary strip */}
                    {!isOpen && (leito.medicacoes.length > 0 || leito.alertas.length > 0) && (
                      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                        {leito.alertas.map((a, i) => (
                          <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-medium">
                            <AlertTriangle size={9} />
                            {a}
                          </span>
                        ))}
                        {leito.medicacoes.slice(0, 3).map((m, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">{m}</span>
                        ))}
                        {leito.medicacoes.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">+{leito.medicacoes.length - 3} mais</span>
                        )}
                      </div>
                    )}

                    {/* Expanded section */}
                    {isOpen && (
                      <div className="border-t border-border">
                        <div className="p-4 space-y-4">

                          {/* Alertas */}
                          {leito.alertas.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <AlertTriangle size={10} className="text-red-500" />
                                Alertas Clínicos
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {leito.alertas.map((a, i) => (
                                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[11px] font-medium border border-red-200 dark:border-red-800">
                                    <AlertTriangle size={10} />
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medicações */}
                          {leito.medicacoes.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <Pill size={10} />
                                Medicações em Uso
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {leito.medicacoes.map((m, i) => (
                                  <span key={i} className="px-2.5 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">{m}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Internação info */}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Internação: <strong className="text-foreground">{new Date(leito.dataInternacao + "T12:00:00").toLocaleDateString("pt-BR")}</strong></span>
                            <span>Dias: <strong className="text-foreground">{dias}</strong></span>
                          </div>

                          {/* Evolução diária */}
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                              <ClipboardList size={10} />
                              Evolução Diária
                            </p>
                            <div className="flex gap-2">
                              <textarea
                                value={evolucaoTexto[leito.id] ?? ""}
                                onChange={e => setEvolucaoTexto(prev => ({ ...prev, [leito.id]: e.target.value }))}
                                placeholder="Registre a evolução do paciente hoje..."
                                rows={2}
                                className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleEvolucao(leito)}
                                disabled={!evolucaoTexto[leito.id]?.trim()}
                                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all self-start"
                              >
                                <Check size={12} />
                                Registrar
                              </button>
                            </div>

                            {/* Evolution timeline */}
                            {leito.evolucoes.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {[...leito.evolucoes].reverse().map(ev => (
                                  <div key={ev.id} className="flex gap-2.5">
                                    <div className="flex flex-col items-center pt-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                      <div className="w-px flex-1 bg-border mt-1" />
                                    </div>
                                    <div className="pb-2 flex-1 min-w-0">
                                      <p className="text-[10px] text-muted-foreground mb-0.5">{formatDate(ev.data)}</p>
                                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{ev.texto}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1 border-t border-border flex-wrap">
                            <button
                              type="button"
                              onClick={() => openModal(leito)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
                            >
                              <Pencil size={12} />
                              Editar
                            </button>
                            {leito.status === "alta" ? (
                              <button
                                type="button"
                                onClick={() => handleStatus(leito, "estavel")}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-green-500/30 hover:text-green-600 transition-all"
                              >
                                <RefreshCw size={12} />
                                Reativar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStatus(leito, "alta")}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-amber-500/30 hover:text-amber-600 transition-all"
                              >
                                <LogOut size={12} />
                                Dar Alta
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(leito.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-red-500/30 hover:text-red-600 transition-all ml-auto"
                            >
                              <Trash2 size={12} />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <BedDouble size={16} className="text-primary" />
                  <p className="font-bold text-foreground text-sm">{editando ? "Editar Leito" : "Novo Leito"}</p>
                </div>
                <button type="button" onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Número */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Número do leito <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.numero}
                    onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
                    placeholder="ex: L-01, 12, 2B"
                    className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Paciente */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nome / Iniciais do paciente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.paciente}
                    onChange={e => setForm(f => ({ ...f, paciente: e.target.value }))}
                    placeholder="ex: J.S.O."
                    className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Idade + Sexo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Idade</label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={form.idade}
                      onChange={e => setForm(f => ({ ...f, idade: e.target.value }))}
                      placeholder="anos"
                      className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Sexo</label>
                    <select
                      value={form.sexo}
                      onChange={e => setForm(f => ({ ...f, sexo: e.target.value as "" | "M" | "F" }))}
                      className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">—</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                </div>

                {/* Diagnóstico */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Hipótese diagnóstica <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.diagnostico}
                    onChange={e => setForm(f => ({ ...f, diagnostico: e.target.value }))}
                    placeholder="ex: Episódio maníaco com psicose — F30.2"
                    className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Data internação + Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Data de internação <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.dataInternacao}
                      onChange={e => setForm(f => ({ ...f, dataInternacao: e.target.value }))}
                      className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value as LeitoStatus }))}
                      className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="estavel">Estável</option>
                      <option value="atencao">Atenção</option>
                      <option value="critico">Crítico</option>
                    </select>
                  </div>
                </div>

                {/* Medicamentos */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Medicamentos em uso</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={medicInput}
                      onChange={e => setMedicInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addChip("medicacoes", medicInput, setMedicInput); } }}
                      placeholder="ex: Haloperidol 5mg"
                      className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => addChip("medicacoes", medicInput, setMedicInput)}
                      className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary hover:text-white transition-all"
                    >
                      Adicionar
                    </button>
                  </div>
                  {form.medicacoes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.medicacoes.map((m, i) => (
                        <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-xs text-foreground">
                          {m}
                          <button type="button" onClick={() => removeChip("medicacoes", i)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Alertas */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Alertas clínicos</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={alertaInput}
                      onChange={e => setAlertaInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addChip("alertas", alertaInput, setAlertaInput); } }}
                      placeholder="ex: Risco de suicídio, Agitação"
                      className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => addChip("alertas", alertaInput, setAlertaInput)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 text-red-600 text-xs font-semibold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Adicionar
                    </button>
                  </div>
                  {form.alertas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.alertas.map((a, i) => (
                        <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
                          <AlertTriangle size={10} />
                          {a}
                          <button type="button" onClick={() => removeChip("alertas", i)} className="text-red-400 hover:text-red-600 transition-colors">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error */}
                {erro && (
                  <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
                    {erro}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={salvando}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar leito"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
