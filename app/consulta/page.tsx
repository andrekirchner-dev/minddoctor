import Link from "next/link";
import { Stethoscope, ClipboardCheck, FileOutput, ChevronRight, Info } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const tools = [
  {
    href: "/consulta/exame-mental",
    icon: ClipboardCheck,
    titulo: "Exame do Estado Mental",
    subtitulo: "Checkboxes rápidos de plantão",
    descricao: "Preencha o EEM por seções com checkboxes clicáveis e gere automaticamente o texto formatado para o prontuário.",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    href: "/consulta/relatorios",
    icon: FileOutput,
    titulo: "Gerador de Relatórios",
    subtitulo: "Atestados, encaminhamentos e laudos",
    descricao: "Gere modelos prontos de relatórios médicos padronizados: atestado, encaminhamento, laudo psiquiátrico, alta e declaração de comparecimento.",
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
              <p className="text-xs text-muted-foreground">Ferramentas de apoio à consulta clínica</p>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl px-5 py-4 flex gap-3">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Estas ferramentas geram modelos de texto e documentos clínicos. O médico é responsável por revisar, adaptar e assinar todos os documentos antes de uso clínico. Não insira dados que permitam identificar pacientes.
            </p>
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
                    <p className="font-bold text-foreground text-base mb-0.5">{t.titulo}</p>
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
