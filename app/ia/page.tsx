import Link from "next/link";
import { BrainCircuit, MessageSquare, Stethoscope, FileText, ChevronRight, AlertTriangle, Shield } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const tools = [
  {
    href: "/ia/chat",
    icon: MessageSquare,
    titulo: "Chat Clínico",
    subtitulo: "Dúvidas rápidas de plantão",
    descricao: "Tire dúvidas sobre farmacologia, critérios diagnósticos, diretrizes ABP/CANMAT e condutas clínicas em psiquiatria.",
    gradient: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
  {
    href: "/ia/diagnostico",
    icon: Stethoscope,
    titulo: "Assistente Diagnóstico",
    subtitulo: "Raciocínio clínico estruturado",
    descricao: "Informe os sintomas e histórico do paciente e receba um raciocínio diagnóstico diferencial estruturado por DSM-5-TR e CID-11.",
    gradient: "from-blue-500 to-indigo-600",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    href: "/ia/prontuario",
    icon: FileText,
    titulo: "Gerador de Prontuário",
    subtitulo: "SOAP a partir do relato livre",
    descricao: "Descreva a consulta em linguagem livre e gere um prontuário estruturado no formato SOAP com exame mental e plano terapêutico.",
    gradient: "from-teal-500 to-emerald-600",
    badge: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  },
];

export default function IAPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4A6CF7)" }}
            >
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">IA Clínica</h1>
              <p className="text-xs text-muted-foreground">Apoio à decisão clínica · Chat · Diagnóstico · Prontuário</p>
            </div>
          </div>

          {/* Disclaimer legal */}
          <div className="bg-amber-500/5 border border-amber-500/25 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-amber-600 shrink-0" />
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Aviso Importante — Uso Clínico</p>
            </div>
            <ul className="space-y-1.5">
              {[
                "Esta ferramenta é um suporte à decisão clínica — não substitui o julgamento médico nem a avaliação presencial.",
                "Não insira dados que permitam identificar pacientes (nome, CPF, endereço, contato).",
                "Outputs gerados pela IA devem ser revisados pelo médico antes de qualquer uso clínico.",
                "Em situações de risco de vida, priorize sempre a avaliação presencial e os protocolos de emergência.",
                "Conforme resolução CFM e LGPD: o médico é integralmente responsável pela conduta clínica.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-xs text-amber-800/80 leading-relaxed">
                  <AlertTriangle size={11} className="text-amber-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="grid grid-cols-1 gap-4">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group bg-card border border-border rounded-2xl p-6 flex items-start gap-5 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(74,108,247,0.08)] transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${t.gradient}`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-bold text-foreground text-base">{t.titulo}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/70 italic mb-1">{t.subtitulo}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.descricao}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
