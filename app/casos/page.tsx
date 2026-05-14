"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FolderOpen, Plus, Search, Lock, X, ChevronRight, Trash2,
  Pencil, AlertTriangle, Shield, Check, Tag, Clock,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getCasos, saveCaso, updateCaso, deleteCaso,
  type CasoClinico, type StatusCaso,
} from "@/lib/firebase/casos";
import { deriveKey, encryptField, decryptField } from "@/lib/crypto";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<StatusCaso, string> = {
  ativo:          "Ativo",
  acompanhamento: "Acompanhamento",
  alta:           "Alta",
  encerrado:      "Encerrado",
};

const STATUS_COLORS: Record<StatusCaso, string> = {
  ativo:          "bg-green-500/10 text-green-600 border-green-500/20",
  acompanhamento: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  alta:           "bg-amber-500/10 text-amber-600 border-amber-500/20",
  encerrado:      "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormData {
  titulo: string;
  identificador: string;   // sensitive → encrypted
  dataNascimento: string;  // sensitive → encrypted
  contato: string;         // sensitive → encrypted
  idade: string;
  sexo: "M" | "F" | "outro" | "";
  diagnosticoCID: string;
  hipotese: string;
  historico: string;
  historicoFamiliar: string;
  exameMental: string;
  medicamentosAtuais: string;
  conduta: string;
  observacoesEstudo: string;
  tagsRaw: string;
  status: StatusCaso;
}

const EMPTY_FORM: FormData = {
  titulo: "", identificador: "", dataNascimento: "", contato: "",
  idade: "", sexo: "", diagnosticoCID: "", hipotese: "", historico: "",
  historicoFamiliar: "", exameMental: "", medicamentosAtuais: "",
  conduta: "", observacoesEstudo: "", tagsRaw: "", status: "ativo",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(caso: CasoClinico) {
  const secs = caso.updatedAt?.seconds;
  if (!secs) return "";
  const diff = Math.floor((Date.now() / 1000) - secs);
  if (diff < 60)       return "agora";
  if (diff < 3600)     return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400)    return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800)   return `${Math.floor(diff / 86400)}d atrás`;
  return `${Math.floor(diff / 604800)}sem atrás`;
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, sensitive, children }: {
  label: string; sensitive?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {sensitive && <Lock size={10} className="text-amber-500" />}
        {label}
        {sensitive && <span className="text-[10px] text-amber-500 font-normal">criptografado</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";
const textareaCls = `${inputCls} resize-none`;

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CasosPage() {
  const { user } = useAuth();

  const [casos, setCasos]               = useState<CasoClinico[]>([]);
  const [loading, setLoading]           = useState(true);
  const [cryptoKey, setCryptoKey]       = useState<CryptoKey | null>(null);

  // UI state
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusCaso | "todas">("todas");
  const [panelMode, setPanelMode]       = useState<null | "novo" | "editar">(null);
  const [detailId, setDetailId]         = useState<string | null>(null);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [formData, setFormData]         = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Decrypted sensitive fields cache
  const [decrypted, setDecrypted]       = useState<Record<string, { id: string; dn: string; ct: string }>>({});
  const [decrypting, setDecrypting]     = useState(false);

  // ── Init: load casos + derive key ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getCasos(user.uid),
      deriveKey(user.uid),
    ]).then(([data, key]) => {
      setCasos(data);
      setCryptoKey(key);
      setLoading(false);
    });
  }, [user]);

  const reload = useCallback(async () => {
    if (!user) return;
    const data = await getCasos(user.uid);
    setCasos(data);
  }, [user]);

  // ── Decrypt sensitive fields when opening detail ───────────────────────────
  useEffect(() => {
    if (!detailId || !cryptoKey) return;
    if (decrypted[detailId]) return;
    const caso = casos.find((c) => c.id === detailId);
    if (!caso) return;
    setDecrypting(true);
    Promise.all([
      decryptField(caso.identificador_enc, cryptoKey),
      decryptField(caso.dataNascimento_enc, cryptoKey),
      decryptField(caso.contato_enc, cryptoKey),
    ]).then(([id, dn, ct]) => {
      setDecrypted((prev) => ({ ...prev, [detailId]: { id, dn, ct } }));
      setDecrypting(false);
    });
  }, [detailId, cryptoKey, casos, decrypted]);

  // ── Open edit form pre-filled ──────────────────────────────────────────────
  const openEdit = useCallback(async (caso: CasoClinico) => {
    if (!cryptoKey) return;
    const [id, dn, ct] = await Promise.all([
      decryptField(caso.identificador_enc, cryptoKey),
      decryptField(caso.dataNascimento_enc, cryptoKey),
      decryptField(caso.contato_enc, cryptoKey),
    ]);
    setFormData({
      titulo:            caso.titulo,
      identificador:     id,
      dataNascimento:    dn,
      contato:           ct,
      idade:             caso.idade?.toString() ?? "",
      sexo:              caso.sexo,
      diagnosticoCID:    caso.diagnosticoCID,
      hipotese:          caso.hipotese,
      historico:         caso.historico,
      historicoFamiliar: caso.historicoFamiliar,
      exameMental:       caso.exameMental,
      medicamentosAtuais:caso.medicamentosAtuais,
      conduta:           caso.conduta,
      observacoesEstudo: caso.observacoesEstudo,
      tagsRaw:           caso.tags.join(", "),
      status:            caso.status,
    });
    setEditingId(caso.id);
    setPanelMode("editar");
    setDetailId(null);
  }, [cryptoKey]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!user || !cryptoKey || !formData.titulo.trim()) return;
    setSaving(true);
    try {
      const [identificador_enc, dataNascimento_enc, contato_enc] = await Promise.all([
        encryptField(formData.identificador, cryptoKey),
        encryptField(formData.dataNascimento, cryptoKey),
        encryptField(formData.contato, cryptoKey),
      ]);
      const payload = {
        userId:            user.uid,
        titulo:            formData.titulo.trim(),
        identificador_enc,
        dataNascimento_enc,
        contato_enc,
        idade:             formData.idade ? parseInt(formData.idade) : null,
        sexo:              formData.sexo,
        diagnosticoCID:    formData.diagnosticoCID.trim(),
        hipotese:          formData.hipotese.trim(),
        historico:         formData.historico.trim(),
        historicoFamiliar: formData.historicoFamiliar.trim(),
        exameMental:       formData.exameMental.trim(),
        medicamentosAtuais:formData.medicamentosAtuais.trim(),
        conduta:           formData.conduta.trim(),
        observacoesEstudo: formData.observacoesEstudo.trim(),
        tags:              formData.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
        status:            formData.status,
      };
      if (panelMode === "editar" && editingId) {
        await updateCaso(editingId, payload);
        // Invalidate decrypted cache for this case
        setDecrypted((prev) => { const n = { ...prev }; delete n[editingId]; return n; });
      } else {
        await saveCaso(payload);
      }
      await reload();
      setPanelMode(null);
      setFormData(EMPTY_FORM);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }, [user, cryptoKey, formData, panelMode, editingId, reload]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    await deleteCaso(id);
    setDecrypted((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setDetailId(null);
    setConfirmDelete(null);
    await reload();
  }, [reload]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = casos.filter((c) => {
    const matchStatus = filterStatus === "todas" || c.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || c.titulo.toLowerCase().includes(q) ||
      c.diagnosticoCID.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const detail = detailId ? casos.find((c) => c.id === detailId) : null;

  const setField = (k: keyof FormData, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #0F766E, #0D9488)" }}
            >
              <FolderOpen size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Casos Clínicos</h1>
              <p className="text-xs text-muted-foreground">Dados sensíveis criptografados localmente · AES-256-GCM</p>
            </div>
            <button
              onClick={() => { setFormData(EMPTY_FORM); setEditingId(null); setPanelMode("novo"); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={15} />
              Novo Caso
            </button>
          </div>

          {/* LGPD notice */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3 flex gap-3">
            <Shield size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Os dados identificadores do paciente (nome, nascimento, contato) são criptografados com AES-256-GCM antes de serem armazenados. Apenas você, com sua conta, pode descriptografá-los. Não insira dados reais de pacientes sem consentimento — este sistema destina-se ao estudo de casos clínicos de forma pseudoanonimizada, conforme LGPD.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, CID ou tag..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["todas", "ativo", "acompanhamento", "alta", "encerrado"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                    filterStatus === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {s === "todas" ? "Todos" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          {!loading && (
            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "caso" : "casos"}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-12 rounded-full bg-muted" />
                    <div className="h-5 w-16 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cases grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((caso) => (
                <button
                  key={caso.id}
                  onClick={() => setDetailId(caso.id === detailId ? null : caso.id)}
                  className={cn(
                    "group text-left bg-card border rounded-2xl p-5 space-y-3 transition-all duration-200 hover:shadow-md",
                    detailId === caso.id
                      ? "border-primary/40 shadow-[0_4px_20px_rgba(74,108,247,0.1)]"
                      : "border-border hover:border-primary/20"
                  )}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-foreground text-sm leading-tight line-clamp-2 flex-1">
                      {caso.titulo}
                    </p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0", STATUS_COLORS[caso.status])}>
                      {STATUS_LABELS[caso.status]}
                    </span>
                  </div>

                  {/* Demographics */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {caso.idade && <span>{caso.idade} anos</span>}
                    {caso.idade && caso.sexo && <span>·</span>}
                    {caso.sexo && <span>{{ M: "Masculino", F: "Feminino", outro: "Outro" }[caso.sexo] ?? ""}</span>}
                    {(caso.idade || caso.sexo) && caso.diagnosticoCID && <span>·</span>}
                    {caso.diagnosticoCID && (
                      <span className="font-mono text-[11px] text-foreground/70">{caso.diagnosticoCID}</span>
                    )}
                  </div>

                  {/* Hipótese */}
                  {caso.hipotese && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{caso.hipotese}</p>
                  )}

                  {/* Tags */}
                  {caso.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {caso.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          {t}
                        </span>
                      ))}
                      {caso.tags.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">+{caso.tags.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock size={10} />
                      {timeAgo(caso)}
                    </div>
                    <span className={cn(
                      "text-[11px] font-semibold flex items-center gap-1 transition-colors",
                      detailId === caso.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )}>
                      Ver detalhes <ChevronRight size={11} />
                    </span>
                  </div>
                </button>
              ))}

              {/* Empty */}
              {filtered.length === 0 && (
                <div className="col-span-full border-2 border-dashed border-border rounded-2xl py-16 text-center space-y-2">
                  <FolderOpen size={28} className="text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    {search || filterStatus !== "todas" ? "Nenhum caso encontrado." : "Nenhum caso salvo ainda."}
                  </p>
                  {!search && filterStatus === "todas" && (
                    <button
                      onClick={() => { setFormData(EMPTY_FORM); setPanelMode("novo"); }}
                      className="text-xs text-primary underline"
                    >
                      Criar primeiro caso
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Detail panel ──────────────────────────────────────────────────── */}
        {detail && (
          <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setDetailId(null)}>
            <div
              className="relative w-full max-w-lg h-full bg-card border-l border-border shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center gap-3 z-10">
                <button onClick={() => setDetailId(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
                <span className="flex-1 font-bold text-foreground truncate">{detail.titulo}</span>
                <button
                  onClick={() => openEdit(detail)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Pencil size={15} />
                </button>
                {confirmDelete === detail.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-500">Confirmar?</span>
                    <button
                      onClick={() => handleDelete(detail.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-2.5 py-1 rounded-lg bg-muted text-xs font-semibold"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(detail.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-5">
                {/* Status + Demographics */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", STATUS_COLORS[detail.status])}>
                    {STATUS_LABELS[detail.status]}
                  </span>
                  {detail.idade && (
                    <span className="text-xs text-muted-foreground">{detail.idade} anos</span>
                  )}
                  {detail.sexo && (
                    <span className="text-xs text-muted-foreground">
                      {{ M: "· Masculino", F: "· Feminino", outro: "· Outro" }[detail.sexo]}
                    </span>
                  )}
                  {detail.diagnosticoCID && (
                    <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded-lg text-foreground/70">
                      {detail.diagnosticoCID}
                    </span>
                  )}
                </div>

                {/* Sensitive section */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock size={13} className="text-amber-500" />
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Dados Identificadores (Criptografados)</p>
                  </div>
                  {decrypting ? (
                    <div className="space-y-2 animate-pulse">
                      {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-amber-500/10 rounded w-3/4" />)}
                    </div>
                  ) : decrypted[detail.id] ? (
                    <div className="space-y-1.5">
                      {[
                        ["Identificador", decrypted[detail.id].id],
                        ["Nascimento", decrypted[detail.id].dn],
                        ["Contato", decrypted[detail.id].ct],
                      ].map(([label, value]) => value ? (
                        <div key={label} className="flex gap-2">
                          <span className="text-[11px] text-amber-600/70 font-semibold w-24 shrink-0">{label}:</span>
                          <span className="text-xs text-foreground">{value}</span>
                        </div>
                      ) : null)}
                      {!decrypted[detail.id].id && !decrypted[detail.id].dn && !decrypted[detail.id].ct && (
                        <p className="text-xs text-muted-foreground">Sem dados identificadores registrados.</p>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Clinical sections */}
                {[
                  ["Hipótese Diagnóstica", detail.hipotese],
                  ["Histórico Clínico", detail.historico],
                  ["Histórico Familiar", detail.historicoFamiliar],
                  ["Exame Mental", detail.exameMental],
                  ["Medicamentos Atuais", detail.medicamentosAtuais],
                  ["Conduta / Plano Terapêutico", detail.conduta],
                  ["Notas de Estudo", detail.observacoesEstudo],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="space-y-1.5">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
                    </div>
                  ) : null
                )}

                {/* Tags */}
                {detail.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Tag size={11} className="text-muted-foreground" />
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Tags</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.tags.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Form panel ────────────────────────────────────────────────────── */}
        {panelMode && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm" onClick={() => setPanelMode(null)}>
            <div
              className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center gap-3 z-10">
                <button onClick={() => setPanelMode(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
                <span className="flex-1 font-bold text-foreground">
                  {panelMode === "novo" ? "Novo Caso Clínico" : "Editar Caso"}
                </span>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.titulo.trim()}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    saving || !formData.titulo.trim()
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {saving ? "Salvando..." : <><Check size={14} /> Salvar</>}
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Section: Identificação */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide px-2">Identificação</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <Field label="Título do caso" >
                    <input
                      value={formData.titulo}
                      onChange={(e) => setField("titulo", e.target.value)}
                      placeholder="Ex: Caso — Depressão resistente com comorbidade"
                      className={inputCls}
                    />
                  </Field>

                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock size={12} className="text-amber-500" />
                      <p className="text-xs font-bold text-amber-600">Dados sensíveis — criptografados antes de salvar</p>
                    </div>
                    <Field label="Identificador do paciente" sensitive>
                      <input
                        value={formData.identificador}
                        onChange={(e) => setField("identificador", e.target.value)}
                        placeholder="Iniciais, pseudônimo ou código..."
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Data de nascimento" sensitive>
                      <input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setField("dataNascimento", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Contato (opcional)" sensitive>
                      <input
                        value={formData.contato}
                        onChange={(e) => setField("contato", e.target.value)}
                        placeholder="Telefone, e-mail ou outro contato..."
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>

                {/* Section: Dados gerais */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide px-2">Dados Clínicos Gerais</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Idade">
                      <input
                        type="number"
                        min={0} max={120}
                        value={formData.idade}
                        onChange={(e) => setField("idade", e.target.value)}
                        placeholder="Anos"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Sexo">
                      <select
                        value={formData.sexo}
                        onChange={(e) => setField("sexo", e.target.value as FormData["sexo"])}
                        className={inputCls}
                      >
                        <option value="">Selecionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="CID-10 / CID-11">
                      <input
                        value={formData.diagnosticoCID}
                        onChange={(e) => setField("diagnosticoCID", e.target.value)}
                        placeholder="Ex: F32.1"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Status">
                      <select
                        value={formData.status}
                        onChange={(e) => setField("status", e.target.value as StatusCaso)}
                        className={inputCls}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="acompanhamento">Acompanhamento</option>
                        <option value="alta">Alta</option>
                        <option value="encerrado">Encerrado</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Hipótese diagnóstica">
                    <textarea
                      rows={2}
                      value={formData.hipotese}
                      onChange={(e) => setField("hipotese", e.target.value)}
                      placeholder="Descrição da hipótese diagnóstica principal e diferenciais..."
                      className={textareaCls}
                    />
                  </Field>
                </div>

                {/* Section: Avaliação */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide px-2">Avaliação Psiquiátrica</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {[
                    { key: "historico" as const, label: "Histórico clínico", rows: 4, placeholder: "Queixa principal, início dos sintomas, evolução..." },
                    { key: "historicoFamiliar" as const, label: "Histórico familiar", rows: 2, placeholder: "Antecedentes psiquiátricos na família..." },
                    { key: "exameMental" as const, label: "Exame do estado mental", rows: 4, placeholder: "Apresentação, humor, pensamento, percepção, cognição, insight..." },
                    { key: "medicamentosAtuais" as const, label: "Medicamentos atuais", rows: 2, placeholder: "Nome, dose, frequência..." },
                    { key: "conduta" as const, label: "Conduta / Plano terapêutico", rows: 3, placeholder: "Intervenções farmacológicas, psicoterapia, encaminhamentos..." },
                  ].map(({ key, label, rows, placeholder }) => (
                    <Field key={key} label={label}>
                      <textarea
                        rows={rows}
                        value={formData[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        placeholder={placeholder}
                        className={textareaCls}
                      />
                    </Field>
                  ))}
                </div>

                {/* Section: Estudo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide px-2">Notas de Estudo</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <Field label="Observações e aprendizados">
                    <textarea
                      rows={4}
                      value={formData.observacoesEstudo}
                      onChange={(e) => setField("observacoesEstudo", e.target.value)}
                      placeholder="Pontos de aprendizado, questões para aprofundar, artigos relevantes, dúvidas..."
                      className={textareaCls}
                    />
                  </Field>

                  <Field label="Tags (separadas por vírgula)">
                    <input
                      value={formData.tagsRaw}
                      onChange={(e) => setField("tagsRaw", e.target.value)}
                      placeholder="Ex: depressão, TRD, esketamina, comorbidade"
                      className={inputCls}
                    />
                    {formData.tagsRaw && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Field>
                </div>

                {/* Bottom save */}
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.titulo.trim()}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-semibold transition-all",
                    saving || !formData.titulo.trim()
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {saving ? "Salvando..." : panelMode === "novo" ? "Criar Caso" : "Salvar Alterações"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
