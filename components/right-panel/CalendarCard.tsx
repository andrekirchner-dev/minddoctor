"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft, ChevronRight, Plus, X, Trash2,
  Loader2, CalendarDays, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getEventos, saveEvento, deleteEvento, eventoNoDia,
  TIPO_LABEL, TIPO_COLOR, TIPO_BG,
  type Evento, type TipoEvento,
} from "@/lib/firebase/eventos";

// ─── constants ────────────────────────────────────────────────────────────────

const DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS     = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const TIPOS: TipoEvento[] = ["consulta","retorno","escala","plantao","supervisao","outro"];

// ─── helpers ──────────────────────────────────────────────────────────────────

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

function todayISO() {
  const t = new Date();
  return toISO(t.getFullYear(), t.getMonth(), t.getDate());
}

function formatBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatRange(e: Evento) {
  if (e.dataInicio === e.dataFim) return formatBR(e.dataInicio);
  return `${formatBR(e.dataInicio)} → ${formatBR(e.dataFim)}`;
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  defaultDate: string;
  onClose: () => void;
  onSaved: (e: Evento) => void;
  userId: string;
}

function EventoModal({ defaultDate, onClose, onSaved, userId }: ModalProps) {
  const [titulo,       setTitulo]       = useState("");
  const [tipo,         setTipo]         = useState<TipoEvento>("consulta");
  const [dataInicio,   setDataInicio]   = useState(defaultDate);
  const [multiDia,     setMultiDia]     = useState(false);
  const [dataFim,      setDataFim]      = useState(defaultDate);
  const [hora,         setHora]         = useState("08:00");
  const [temHoraFim,   setTemHoraFim]   = useState(false);
  const [horaFim,      setHoraFim]      = useState("09:00");
  const [pacienteNome, setPacienteNome] = useState("");
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");

  // keep dataFim >= dataInicio
  useEffect(() => {
    if (!multiDia) setDataFim(dataInicio);
    else if (dataFim < dataInicio) setDataFim(dataInicio);
  }, [dataInicio, multiDia]);

  async function handleSave() {
    if (!titulo.trim()) { setError("O título é obrigatório."); return; }
    setSaving(true);
    setError("");
    try {
      const novo: Omit<Evento, "id" | "createdAt"> = {
        userId,
        dataInicio,
        dataFim: multiDia ? dataFim : dataInicio,
        hora,
        ...(temHoraFim ? { horaFim } : {}),
        titulo: titulo.trim(),
        tipo,
        ...(pacienteNome.trim() ? { pacienteNome: pacienteNome.trim() } : {}),
      };
      const id = await saveEvento(novo);
      onSaved({ ...novo, id, createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any });
      onClose();
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // close on backdrop click
  const backdropRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarDays size={18} className="text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground">Novo Compromisso</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Título *
            </label>
            <input
              autoFocus
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Consulta ambulatorial — João S."
              className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {/* Tipo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tipo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                    tipo === t
                      ? "border-transparent text-white"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-background"
                  )}
                  style={tipo === t ? { background: TIPO_COLOR[t] } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: tipo === t ? "rgba(255,255,255,0.7)" : TIPO_COLOR[t] }}
                  />
                  {TIPO_LABEL[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Data
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">Evento de múltiplos dias</span>
                <button
                  type="button"
                  onClick={() => setMultiDia(v => !v)}
                  className={cn(
                    "relative w-9 h-5 rounded-full transition-colors",
                    multiDia ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                    multiDia ? "left-4.5 translate-x-0" : "left-0.5"
                  )} />
                </button>
              </label>
            </div>

            <div className={cn("grid gap-2", multiDia ? "grid-cols-2" : "grid-cols-1")}>
              <div className="space-y-1">
                {multiDia && (
                  <p className="text-[10px] text-muted-foreground font-medium">Início</p>
                )}
                <input
                  type="date"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              {multiDia && (
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-medium">Fim</p>
                  <input
                    type="date"
                    value={dataFim}
                    min={dataInicio}
                    onChange={e => setDataFim(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Horário */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Horário
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">Horário de término</span>
                <button
                  type="button"
                  onClick={() => setTemHoraFim(v => !v)}
                  className={cn(
                    "relative w-9 h-5 rounded-full transition-colors",
                    temHoraFim ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                    temHoraFim ? "left-4.5 translate-x-0" : "left-0.5"
                  )} />
                </button>
              </label>
            </div>
            <div className={cn("grid gap-2", temHoraFim ? "grid-cols-2" : "grid-cols-1")}>
              <div className="space-y-1">
                {temHoraFim && (
                  <p className="text-[10px] text-muted-foreground font-medium">Início</p>
                )}
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="time"
                    value={hora}
                    onChange={e => setHora(e.target.value)}
                    className="w-full text-sm bg-background border border-border rounded-xl pl-8 pr-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
              </div>
              {temHoraFim && (
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-medium">Término</p>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="time"
                      value={horaFim}
                      onChange={e => setHoraFim(e.target.value)}
                      className="w-full text-sm bg-background border border-border rounded-xl pl-8 pr-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paciente */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Paciente <span className="normal-case font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={pacienteNome}
              onChange={e => setPacienteNome(e.target.value)}
              placeholder="Nome do paciente"
              className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {saving ? "Salvando..." : "Salvar compromisso"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── CalendarCard ─────────────────────────────────────────────────────────────

export function CalendarCard() {
  const { user } = useAuth();
  const today = new Date();

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected,  setSelected]  = useState(todayISO());

  const [eventos,    setEventos]    = useState<Evento[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try { setEventos(await getEventos(user.uid)); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  function handleSaved(e: Evento) {
    setEventos(prev => {
      const updated = [...prev, e];
      updated.sort((a, b) =>
        a.dataInicio.localeCompare(b.dataInicio) || a.hora.localeCompare(b.hora)
      );
      return updated;
    });
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setDeletingId(id);
    try {
      await deleteEvento(id, user.uid);
      setEventos(prev => prev.filter(e => e.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  // Calendar helpers
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDay     = getFirstDay(viewYear, viewMonth);
  const isThisMonth  = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Dot map: ISO → true if any event covers that day
  const eventDays = new Set<string>();
  for (const e of eventos) {
    const start = new Date(e.dataInicio + "T00:00:00");
    const end   = new Date(e.dataFim   + "T00:00:00");
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      eventDays.add(toISO(d.getFullYear(), d.getMonth(), d.getDate()));
    }
  }

  // Events for selected day
  const dayEventos = eventos
    .filter(e => eventoNoDia(e, selected))
    .sort((a, b) => a.hora.localeCompare(b.hora));

  // Próximos eventos (após hoje, para o card de destaque)
  const iso = todayISO();
  const proximos = eventos
    .filter(e => e.dataFim >= iso)
    .slice(0, 3);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  return (
    <>
      <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Compromissos</h3>
          {!loading && eventos.length > 0 && (
            <span className="text-[11px] text-muted-foreground font-medium">
              {eventos.length} evento{eventos.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Mini calendar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-0.5">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[9px] font-medium text-muted-foreground py-0.5">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const iso     = toISO(viewYear, viewMonth, day);
              const isToday = isThisMonth && day === today.getDate();
              const isSel   = iso === selected;
              const hasDot  = eventDays.has(iso);

              return (
                <button
                  key={day}
                  onClick={() => setSelected(iso)}
                  className={cn(
                    "relative mx-auto w-6 h-6 rounded-full text-[10px] transition-all flex items-center justify-center font-medium",
                    isToday ? "bg-primary text-white font-bold" :
                    isSel   ? "bg-primary/15 text-primary ring-1 ring-primary/30" :
                              "text-foreground hover:bg-muted"
                  )}
                >
                  {day}
                  {hasDot && (
                    <span className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                      isToday ? "bg-white/70" : "bg-primary"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day events */}
        <div className="border-t border-border pt-3 flex-1 flex flex-col">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {formatBR(selected)}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={14} className="animate-spin text-muted-foreground" />
            </div>
          ) : dayEventos.length === 0 ? (
            <p className="text-[11px] text-muted-foreground text-center py-2">
              Sem compromissos neste dia
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-0.5">
              {dayEventos.map(e => (
                <div
                  key={e.id}
                  className="group flex items-start gap-2 p-2 rounded-xl border border-border hover:border-primary/20 transition-colors"
                  style={{ background: TIPO_BG[e.tipo] }}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: TIPO_COLOR[e.tipo] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground truncate leading-tight">{e.titulo}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {e.hora}{e.horaFim ? `–${e.horaFim}` : ""}
                      </span>
                      {e.dataInicio !== e.dataFim && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                          múltiplos dias
                        </span>
                      )}
                      {e.pacienteNome && (
                        <span className="text-[10px] text-muted-foreground truncate">{e.pacienteNome}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all shrink-0 mt-0.5"
                  >
                    {deletingId === e.id
                      ? <Loader2 size={10} className="animate-spin" />
                      : <Trash2 size={10} />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximos eventos preview (when other days have events) */}
        {!loading && proximos.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Próximos
            </p>
            <div className="flex flex-col gap-1">
              {proximos.map(e => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSelected(e.dataInicio);
                    const [y, m] = e.dataInicio.split("-").map(Number);
                    setViewYear(y);
                    setViewMonth(m - 1);
                  }}
                  className="flex items-center gap-2 text-left hover:bg-muted rounded-lg px-1.5 py-1 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TIPO_COLOR[e.tipo] }} />
                  <span className="text-[11px] text-foreground truncate flex-1">{e.titulo}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0 font-mono">{formatBR(e.dataInicio)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <Plus size={15} />
          Adicionar Compromisso
        </button>
      </div>

      {showModal && user && (
        <EventoModal
          defaultDate={selected}
          userId={user.uid}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
