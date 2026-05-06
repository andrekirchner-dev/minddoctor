"use client";

import { Calendar } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

const DAYS   = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
const MONTHS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

export function HeroBanner() {
  const { user } = useAuth();
  const now  = new Date();
  const day  = DAYS[now.getDay()];
  const date = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  const firstName = user?.displayName?.split(" ")[0] ?? "Doutor";

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 text-white min-h-[160px] flex flex-col justify-between"
      style={{ background: "linear-gradient(135deg, #4A6CF7 0%, #7B5EA7 100%)" }}
    >
      <span className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <span className="absolute right-24 -bottom-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
      <span className="absolute right-10 top-10 w-16 h-16 rounded-full bg-white/8 pointer-events-none" />
      <MedicalDecorations />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-medium mb-3">
            <Calendar size={12} />
            {day}, {date}
          </span>
          <h1 className="text-2xl font-bold leading-tight">
            {getCurrentGreeting()}, {firstName}!
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Tenha uma ótima {day.toLowerCase()}.
          </p>
        </div>
        <DoctorIllustration />
      </div>

      <div className="flex gap-6 mt-4 pt-4 border-t border-white/15 relative z-10">
        {[
          { label: "Consultas hoje",    value: "8" },
          { label: "Escalas pendentes", value: "3" },
          { label: "Urgências",         value: "1" },
        ].map((s) => (
          <div key={s.label}>
            <span className="block text-xl font-bold">{s.value}</span>
            <span className="text-white/70 text-xs">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorIllustration() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="shrink-0 -mt-2 -mr-2 opacity-90">
      <ellipse cx="55" cy="85" rx="28" ry="18" fill="white" fillOpacity="0.15"/>
      <rect x="30" y="55" width="50" height="40" rx="12" fill="white" fillOpacity="0.25"/>
      <circle cx="55" cy="38" r="18" fill="white" fillOpacity="0.3"/>
      <path d="M42 70 Q38 78 44 82 Q50 86 50 80" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      <circle cx="50" cy="80" r="3" fill="white" opacity="0.6"/>
      <rect x="60" y="64" width="16" height="20" rx="3" fill="white" fillOpacity="0.2"/>
      <line x1="63" y1="70" x2="73" y2="70" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      <line x1="63" y1="74" x2="73" y2="74" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      <line x1="63" y1="78" x2="69" y2="78" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

function MedicalDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute top-5 right-48 opacity-15" width="28" height="14" viewBox="0 0 28 14">
        <rect x="0" y="0" width="28" height="14" rx="7" fill="white"/>
        <line x1="14" y1="0" x2="14" y2="14" stroke="rgba(74,108,247,0.5)" strokeWidth="1.5"/>
      </svg>
      <svg className="absolute bottom-10 right-52 opacity-15" width="16" height="16" viewBox="0 0 16 16">
        <rect x="6" y="0" width="4" height="16" rx="2" fill="white"/>
        <rect x="0" y="6" width="16" height="4" rx="2" fill="white"/>
      </svg>
      <svg className="absolute top-14 left-1/2 opacity-10" width="20" height="18" viewBox="0 0 20 18">
        <path d="M10 16C10 16 1 10 1 5C1 2.8 2.8 1 5 1C7 1 9 2.5 10 4C11 2.5 13 1 15 1C17.2 1 19 2.8 19 5C19 10 10 16 10 16Z" fill="white"/>
      </svg>
    </div>
  );
}
