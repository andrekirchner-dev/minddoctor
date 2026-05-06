import Link from "next/link";
import { BookOpen, List, Brain, Stethoscope, HeartHandshake, ArrowRight } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { glossario } from "@/lib/data/glossario";
import { psicoterapias } from "@/lib/data/psicoterapias";
import { psicopatologia } from "@/lib/data/psicopatologia";
import { diagnosticos } from "@/lib/data/diagnosticos";

const secoes = [
  {
    href: "/biblioteca/glossario",
    icon: List,
    titulo: "Glossário Fenomenológico",
    descricao: "Terminologia psicopatológica fundamental — definições, exemplos clínicos e sinonímias.",
    cor: "from-teal-500 to-cyan-500",
    badge: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    contagem: `${glossario.length} termos`,
    plano: "free",
  },
  {
    href: "/biblioteca/psicopatologia",
    icon: Brain,
    titulo: "Wiki de Psicopatologia",
    descricao: "Domínios semiológicos detalhados — fenômenos, exemplos clínicos e pearls para provas.",
    cor: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    contagem: `${psicopatologia.length} tópicos`,
    plano: "free",
  },
  {
    href: "/biblioteca/diagnosticos",
    icon: Stethoscope,
    titulo: "Critérios Diagnósticos",
    descricao: "Critérios DSM-5-TR completos, diferencial, comorbidades e tratamento de primeira linha.",
    cor: "from-blue-600 to-indigo-500",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    contagem: `${diagnosticos.length} transtornos`,
    plano: "free + pro",
  },
  {
    href: "/biblioteca/psicoterapias",
    icon: HeartHandshake,
    titulo: "Guia de Psicoterapias",
    descricao: "Abordagens terapêuticas — indicações, mecanismo, técnicas e evidências.",
    cor: "from-rose-500 to-pink-500",
    badge: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    contagem: `${psicoterapias.length} abordagens`,
    plano: "pro",
  },
] as const;

export default function BibliotecaPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #4A6CF7, #7B5EA7)" }}
            >
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Biblioteca de Referência</h1>
              <p className="text-xs text-muted-foreground">Psicopatologia, diagnósticos e psicoterapias baseados em evidência</p>
            </div>
          </div>

          {/* Seções */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secoes.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(74,108,247,0.08)] transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${s.cor}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm leading-tight">{s.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.badge}`}>
                          {s.contagem}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">{s.plano}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{s.descricao}</p>
                  <div className="flex items-center justify-end">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Abrir <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
