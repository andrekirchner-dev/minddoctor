import Link from "next/link";
import { Layers, ChevronRight, Baby, Scale, Heart, Stethoscope, Building2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const iconMap: Record<string, React.ElementType> = {
  infancia:       Baby,
  forense:        Scale,
  psicogeriatria: Heart,
  interconsulta:  Stethoscope,
  "caps-raps":    Building2,
};

const modulos = [
  {
    id: "infancia",
    titulo: "Infância e Adolescência",
    subtitulo: "Doses pediátricas · Marcos de desenvolvimento · CAPSi",
    descricao: "Referência clínica para psiquiatria da infância e adolescência com tabelas de dosagem pediátrica, marcos de desenvolvimento e critérios diagnósticos adaptados.",
    gradient: "from-violet-500 to-purple-500",
    badge: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    secoes: 4,
    plano: "free",
  },
  {
    id: "forense",
    titulo: "Psiquiatria Forense",
    subtitulo: "Lei 10.216 · Imputabilidade · Laudos periciais",
    descricao: "Fundamentos de psiquiatria forense: reforma psiquiátrica brasileira, critérios de imputabilidade, medidas de segurança e estrutura do laudo pericial.",
    gradient: "from-slate-600 to-gray-700",
    badge: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    secoes: 4,
    plano: "pro",
  },
  {
    id: "psicogeriatria",
    titulo: "Psicogeriatria",
    subtitulo: "Critérios de Beers · Demências · Desprescrição",
    descricao: "Psicofarmacologia do idoso: medicamentos potencialmente inapropriados, diagnóstico diferencial das demências e princípios de desprescrição.",
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    secoes: 4,
    plano: "free",
  },
  {
    id: "interconsulta",
    titulo: "Interconsulta Psiquiátrica",
    subtitulo: "UTI · Oncologia · HIV · Renal",
    descricao: "Psiquiatria em contextos hospitalares especializados: delirium em UTI, neuropsiquiatria do HIV, oncologia e ajuste de dose em insuficiência renal.",
    gradient: "from-blue-600 to-indigo-500",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    secoes: 4,
    plano: "free",
  },
  {
    id: "caps-raps",
    titulo: "CAPS e RAPS",
    subtitulo: "Tipos de CAPS · Componentes da RAPS · Encaminhamento",
    descricao: "Rede de Atenção Psicossocial brasileira: tipos de CAPS, componentes da RAPS, fluxos de encaminhamento e critérios de internação psiquiátrica.",
    gradient: "from-green-500 to-emerald-600",
    badge: "bg-green-500/10 text-green-600 border-green-500/20",
    secoes: 4,
    plano: "free",
  },
];

export default function ModulosPage() {
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
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Módulos de Subespecialidade</h1>
              <p className="text-xs text-muted-foreground">Infância · Forense · Psicogeriatria · Interconsulta · CAPS/RAPS</p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modulos.map((m) => {
              const Icon = iconMap[m.id] ?? Layers;
              return (
                <Link
                  key={m.id}
                  href={`/modulos/${m.id}`}
                  className="group bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(74,108,247,0.08)] transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${m.gradient}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm leading-tight">{m.titulo}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${m.badge}`}>
                          {m.secoes} seções
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">{m.plano}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{m.descricao}</p>
                  <p className="text-[10px] text-muted-foreground/60 italic">{m.subtitulo}</p>
                  <div className="flex items-center justify-end">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Abrir <ChevronRight size={13} />
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
