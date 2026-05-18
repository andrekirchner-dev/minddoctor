import Link from "next/link";
import {
  Stethoscope, ClipboardCheck, FileOutput, ChevronRight,
  Info, Plus, ClipboardList, Brain, History, BedDouble,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const tools = [
  {
    href: "/consulta/leitos",
    icon: BedDouble,
    titulo: "Acompanhamento de Leito",
    subtitulo: "Evolução de enfermaria",
    descricao: "Acompanhe pacientes internados por leito: registre evoluções diárias, medicações, alertas clínicos e status (estável, atenção, crítico). Ideal para rounds de enfermaria.",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    href: "/consulta/historico",
    icon: History,
    titulo: "Histórico de Consultas",
    subtitulo: "Prontuários registrados",
    descricao: "Acesse todos os prontuários gerados, busque por paciente ou diagnóstico, e utilize consultas anteriores como base para retornos.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    href: "/consulta/exame-mental",
    icon: Brain,
    titulo: "Exame do Estado Mental rápido",
    subtitulo: "Ferramenta isolada",
    descricao: "Gere apenas o texto do EEM por checkboxes. Útil para completar prontuários existentes sem passar pelo fluxo completo.",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    href: "/consulta/relatorios",
    icon: FileOutput,
    titulo: "Gerador de Relatórios",
    subtitulo: "Atestados, encaminhamentos e laudos",
    descricao: "Gere modelos prontos de relatórios médicos: atestado, encaminhamento, laudo psiquiátrico, alta e declaração de comparecimento.",
    gradient: "from-violet-500 to-purple-600",
  },
];

export default function ConsultaPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}
            >
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Consulta</h1>
              <p className="text-xs text-muted-foreground">Prontuário inteligente e ferramentas clínicas</p>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl px-5 py-4 flex gap-3">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Estas ferramentas geram modelos de texto e documentos clínicos. O médico é responsável por revisar, adaptar e assinar todos os documentos antes de uso clínico.
            </p>
          </div>

          {/* Primary CTA — Nova Consulta */}
          <Link
            href="/consulta/nova"
            className="group block bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/30 rounded-2xl p-6 hover:border-primary/50 hover:shadow-[0_4px_24px_rgba(74,108,247,0.12)] transition-all duration-200"
          >
            <div className="flex items-start gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #4A6CF7, #06B6D4)" }}
              >
                <Plus size={26} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-foreground text-lg">Nova Consulta</p>
                  <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide">Principal</span>
                </div>
                <p className="text-xs text-muted-foreground/80 italic mb-2">Prontuário psiquiátrico completo</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fluxo guiado em 8 etapas: identificação, QP, HPMA, antecedentes, EEM completo, risco, diagnóstico e conduta. Gera o prontuário-base em 6 layouts e documentos pós-consulta (atestados, relatórios, plano de crise, orientações).
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["8 etapas clínicas", "15 domínios do EEM", "30+ CIDs", "Pós-consulta automático"].map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-lg bg-primary/8 text-primary text-[10px] font-medium border border-primary/15">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight size={20} className="text-primary group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
            </div>
          </Link>

          {/* Secondary tools */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Ferramentas rápidas</p>
            <div className="grid grid-cols-1 gap-3">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(74,108,247,0.06)] transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${t.gradient}`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm mb-0.5">{t.titulo}</p>
                      <p className="text-[10px] text-muted-foreground/60 italic mb-1">{t.subtitulo}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{t.descricao}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
