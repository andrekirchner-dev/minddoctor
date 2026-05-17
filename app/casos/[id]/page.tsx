"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ClipboardList, FileText, Pill, Shield,
  Copy, Check, Plus, Clock, User, ChevronRight, History,
  Stethoscope, AlertCircle, BookOpen, Calendar,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { getConsulta, getConsultas, type ConsultaRecord } from "@/lib/firebase/consultas";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

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

const RISCO_COLORS: Record<string, string> = {
  "Alto":  "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "Médio": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Baixo": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(seconds: number): string {
  const d = new Date(seconds * 1000);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDate(seconds: number): string {
  const d = new Date(seconds * 1000);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ icon: Icon, title, color = "#4A6CF7", children, badge }: {
  icon: React.ElementType;
  title: string;
  color?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="font-bold text-sm text-foreground flex-1">{title}</span>
        {badge}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ComingSoonSection({ icon: Icon, title, desc }: {
  icon: React.ElementType; title: string; desc: string;
}) {
  return (
    <div className="bg-card border border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center opacity-60">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <Icon size={18} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        Em breve
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PosConsultaPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [consulta, setConsulta] = useState<ConsultaRecord | null>(null);
  const [outras, setOutras] = useState<ConsultaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    getConsulta(params.id).then(async (c) => {
      if (!c) { setLoading(false); return; }
      setConsulta(c);
      if (user && c.patientName) {
        const all = await getConsultas(user.uid);
        const samePatient = all.filter(
          x => x.id !== c.id &&
               x.patientName?.toLowerCase().trim() === c.patientName?.toLowerCase().trim()
        );
        setOutras(samePatient);
      }
      setLoading(false);
    });
  }, [params.id, user]);

  async function handleCopy() {
    if (!consulta?.prontuarioBase) return;
    await navigator.clipboard.writeText(consulta.prontuarioBase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRetorno() {
    if (!consulta) return;
    sessionStorage.setItem("md-retorno-id", consulta.id);
    sessionStorage.setItem("md-retorno-state", JSON.stringify(consulta.state));
    router.push("/consulta/nova");
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-5 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted shrink-0 mt-1" />
              <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 rounded bg-muted" />
                <div className="h-3 w-64 rounded bg-muted" />
              </div>
              <div className="h-6 w-20 rounded-full bg-muted shrink-0" />
            </div>
            {/* Actions skeleton */}
            <div className="flex gap-2">
              <div className="h-10 w-36 rounded-xl bg-muted" />
              <div className="h-10 w-36 rounded-xl bg-muted" />
              <div className="h-10 w-36 rounded-xl bg-muted" />
            </div>
            {/* Section skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-muted" />
                  <div className="h-4 w-40 rounded bg-muted" />
                </div>
                <div className="p-5 space-y-3">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-5/6 rounded bg-muted" />
                  <div className="h-3 w-4/6 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (!consulta) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <AlertCircle size={28} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Consulta não encontrada.</p>
            <Link href="/casos" className="text-sm text-primary hover:underline">Voltar aos Casos</Link>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  const dataStr = consulta.createdAt?.seconds ? formatDateTime(consulta.createdAt.seconds) : "—";
  const tipoLabel = TIPOS_LABEL[consulta.tipo] || consulta.tipo;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 pb-10">

          {/* Header */}
          <div className="flex items-start gap-3">
            <Link
              href="/casos"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0 mt-1"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #0F766E, #0D9488)" }}
            >
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground truncate">
                {consulta.patientName || "Paciente sem identificação"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-muted-foreground">{tipoLabel}</span>
                {consulta.diagnosticoPrincipal && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs font-mono text-muted-foreground">{consulta.diagnosticoPrincipal}</span>
                  </>
                )}
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {dataStr}
                </span>
              </div>
            </div>
            {consulta.nivelRisco && (
              <span className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0",
                RISCO_COLORS[consulta.nivelRisco] ?? "bg-muted text-muted-foreground border-border"
              )}>
                Risco {consulta.nivelRisco}
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRetorno}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus size={15} />
              Iniciar Retorno
            </button>
            <Link
              href={`/consulta/historico?id=${consulta.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
            >
              <History size={15} />
              Ver no Histórico
            </Link>
            {consulta.prontuarioBase && (
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                  copied
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copiado!" : "Copiar prontuário"}
              </button>
            )}
          </div>

          {/* Resumo clínico */}
          <Section icon={Stethoscope} title="Resumo Clínico" color="#4A6CF7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Tipo de consulta", value: tipoLabel },
                { label: "CID-10 / Diagnóstico", value: consulta.diagnosticoPrincipal || "—" },
                { label: "Nível de risco", value: consulta.nivelRisco || "Não avaliado" },
                { label: "Data", value: dataStr },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Conduta farmacológica */}
          {consulta.condutaFarma && (
            <Section icon={Pill} title="Prescrição / Conduta Farmacológica" color="#7B5EA7">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {consulta.condutaFarma}
              </pre>
            </Section>
          )}

          {/* Prontuário-base */}
          {consulta.prontuarioBase && (
            <Section
              icon={FileText}
              title="Prontuário-base"
              color="#06B6D4"
              badge={
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all",
                    copied
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              }
            >
              <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed bg-muted/30 border border-border rounded-xl p-4 max-h-96 overflow-y-auto">
                {consulta.prontuarioBase}
              </pre>
            </Section>
          )}

          {/* Outras consultas do mesmo paciente */}
          {outras.length > 0 && (
            <Section icon={ClipboardList} title="Consultas Anteriores deste Paciente" color="#22C55E"
              badge={<span className="text-[11px] text-muted-foreground">{outras.length} registro{outras.length !== 1 ? "s" : ""}</span>}
            >
              <div className="space-y-2">
                {outras.map(c => (
                  <Link
                    key={c.id}
                    href={`/casos/${c.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ClipboardList size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">
                        {TIPOS_LABEL[c.tipo] || c.tipo}
                        {c.diagnosticoPrincipal ? ` · ${c.diagnosticoPrincipal}` : ""}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {c.createdAt?.seconds ? formatDate(c.createdAt.seconds) : "—"}
                        {c.nivelRisco ? ` · Risco ${c.nivelRisco}` : ""}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {/* Placeholder sections — future features */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
              Em desenvolvimento
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ComingSoonSection
                icon={BookOpen}
                title="Notas de Evolução"
                desc="Registre a evolução clínica entre as consultas com texto livre e marcadores de progresso"
              />
              <ComingSoonSection
                icon={Calendar}
                title="Próxima Avaliação"
                desc="Agende e acompanhe retornos programados, com alertas de prazo e lembretes"
              />
              <ComingSoonSection
                icon={Shield}
                title="Plano de Crise Ativo"
                desc="Acesse e atualize o plano de segurança e crise do paciente de forma rápida"
              />
            </div>
          </div>

        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
