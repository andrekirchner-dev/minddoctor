"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getEventos, saveEvento, deleteEvento,
  TIPO_LABEL, TIPO_COLOR,
  type Evento, type TipoEvento,
} from "@/lib/firebase/eventos";

const DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const TIPOS: TipoEvento[] = ["consulta","retorno","escala","plantao","supervisao","outro"];

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface FormState {
  hora: string;
  titulo: string;
  tipo: TipoEvento;
  pacienteNome: string;
}

function emptyForm(): FormState {
  return { hora: "08:00", titulo: "", tipo: "consulta", pacienteNome: "" };
}

export function CalendarCard() {
  const { user } = useAuth();
  const today = new Date();

  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected]   = useState(toISO(today.getFullYear(), today.getMonth(), today.getDate()));

  const [eventos, setEventos]   = useState<Evento[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<FormState>(emptyForm());
  const [saving, setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setEventos(await getEventos(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Group event dates for dot indicators
  const eventDates = new Set(eventos.map(e => e.data));

  // Events for the selected day, sorted by hora
  const dayEventos = eventos
    .filter(e => e.data === selected)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    setSelected(toISO(viewYear, viewMonth, day));
    setShowForm(false);
  }

  async function handleSave() {
    if (!user || !form.titulo.trim()) return;
    setSaving(true);
    try {
      const novo: Omit<Evento, "id" | "createdAt"> = {
        userId: user.uid,
        data: selected,
        hora: form.hora,
        titulo: form.titulo.trim(),
        tipo: form.tipo,
        ...(form.pacienteNome.trim() ? { pacienteNome: form.pacienteNome.trim() } : {}),
      };
      const id = await saveEvento(novo);
      setEventos(prev => {
        const updated = [...prev, { ...novo, id, createdAt: { seconds: Date.now() / 1000 } as any }];
        updated.sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora));
        return updated;
      });
      setForm(emptyForm());
      setShowForm(false);
    } finally {
      setSaving(false);
    }
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

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const [selDay, selMonth, selYear] = selected.split("-").map(Number);
  const selectedLabel = `${String(selDay).padStart(2,"0")}/${String(selMonth).padStart(2,"0")}/${selYear}`;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const iso      = toISO(viewYear, viewMonth, day);
          const isToday  = isCurrentMonth && day === today.getDate();
          const isSel    = iso === selected;
          const hasEvent = eventDates.has(iso);

          return (
            <button
              key={day}
              onClick={() => selectDay(day)}
              className={cn(
                "relative mx-auto w-7 h-7 rounded-full text-xs transition-colors flex items-center justify-center font-medium",
                isToday  ? "bg-primary text-white font-bold" :
                isSel    ? "bg-primary/15 text-primary" :
                           "text-foreground hover:bg-muted"
              )}
            >
              {day}
              {hasEvent && (
                <span className={cn(
                  "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                  isToday ? "bg-white" : "bg-primary"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Day events */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {selectedLabel}
          </p>
          <button
            onClick={() => setShowForm(f => !f)}
            className="w-6 h-6 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
            title="Novo compromisso"
          >
            {showForm ? <X size={12} /> : <Plus size={12} />}
          </button>
        </div>

        {/* Inline create form */}
        {showForm && (
          <div className="mb-3 p-3 bg-muted/50 rounded-xl border border-border space-y-2">
            <div className="flex gap-2">
              <input
                type="time"
                value={form.hora}
                onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                className="w-24 text-xs bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoEvento }))}
                className="flex-1 text-xs bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {TIPOS.map(t => (
                  <option key={t} value={t}>{TIPO_LABEL[t]}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Título *"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              className="w-full text-xs bg-background border border-border rounded-lg px-2 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <input
              type="text"
              placeholder="Paciente (opcional)"
              value={form.pacienteNome}
              onChange={e => setForm(f => ({ ...f, pacienteNome: e.target.value }))}
              className="w-full text-xs bg-background border border-border rounded-lg px-2 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              onClick={handleSave}
              disabled={saving || !form.titulo.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}

        {/* Event list */}
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          </div>
        ) : dayEventos.length === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center py-3">
            Nenhum compromisso
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
            {dayEventos.map(e => (
              <div key={e.id} className="flex items-start gap-2 group">
                <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0 w-9">
                  {e.hora}
                </span>
                <span
                  className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{ background: TIPO_COLOR[e.tipo] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed truncate">{e.titulo}</p>
                  {e.pacienteNome && (
                    <p className="text-[10px] text-muted-foreground truncate">{e.pacienteNome}</p>
                  )}
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
    </div>
  );
}
