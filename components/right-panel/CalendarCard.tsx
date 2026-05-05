"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const appointments = [
  { time: "08:00", desc: "Check-in internação — Ala 3",    color: "#22C55E" },
  { time: "09:30", desc: "Consulta ambulatorial — Ana S.", color: "#4A6CF7" },
  { time: "11:00", desc: "Urgência — avaliação de risco",  color: "#D62828" },
  { time: "14:00", desc: "Reunião de equipe — CAPS",       color: "#4A6CF7" },
  { time: "15:30", desc: "Escala PANSS — Pedro M.",        color: "#7B5EA7" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarCard() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border">
      {/* Month selector */}
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
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const isToday = isCurrentMonth && day === today.getDate();
          const isSel = isCurrentMonth && day === selected;

          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className={cn(
                "mx-auto w-7 h-7 rounded-full text-xs transition-colors flex items-center justify-center font-medium",
                isToday
                  ? "bg-primary text-white font-bold"
                  : isSel
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Appointments */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Compromissos — {selected}/{viewMonth + 1}
        </p>
        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
          {appointments.map((a) => (
            <div key={a.time} className="flex items-start gap-2.5">
              <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0 w-9">
                {a.time}
              </span>
              <span
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ background: a.color }}
              />
              <span className="text-xs text-foreground leading-relaxed">{a.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
