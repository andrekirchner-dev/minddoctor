import Link from "next/link";
import {
  BookOpen, ChevronRight, ChevronLeft, Dna, FlaskConical,
  Pill, ClipboardList, Wrench, Users, BookMarked,
  Sparkles, Lock,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type Status = "disponivel" | "parcial" | "breve";

interface Secao {
  href?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  titulo: string;
  descricao: string;
  status: Status;
  subsecoes: { label: string; disponivel: boolean }[];
  badge?: string;
}

const secoes: Secao[] = [
  {
    href: "/psicofarmacologia/biblioteca/receptores",
    icon: Dna,
    gradient: "from-cyan-500 to-teal-600",
    titulo: "Receptores e Alvos",
    descricao: "Mapa neurobiológico completo: 15 sistemas de neurotransmissão com receptores, transportadores, enzimas e canais iônicos — função, localização, fármacos e pearls clínicos.",
    status: "disponivel",
    badge: "15 sistemas",
    subsecoes: [
      { label: "Serotoninérgico (5-HT1A, 5-HT2A, 5-HT2C, 5-HT3, 5-HT6, 5-HT7…)", disponivel: true },
      { label: "Dopaminérgico (D1, D2, D3, D4)", disponivel: true },
      { label: "Noradrenérgico (α1, α2A, α2B/C, NET)", disponivel: true },
      { label: "Glutamatérgico (NMDA, AMPA, mGluR2/3)", disponivel: true },
      { label: "GABAérgico (GABA-A subunidades, GABA-B), Histaminérgico, Colinérgico", disponivel: true },
      { label: "Opioide, Endocanabinoide, Melatoninérgico, Orexina, Sigma, Transportadores, Enzimas, Canais", disponivel: true },
    ],
  },
  {
    href: "/psicofarmacologia/biblioteca/classes",
    icon: FlaskConical,
    gradient: "from-violet-500 to-purple-600",
    titulo: "Classes Farmacológicas",
    descricao: "Antidepressivos, antipsicóticos, estabilizadores, ansiolíticos, hipnóticos, estimulantes, dependência química e cognitivos — com módulos clínicos, perfil de risco e pearls por subclasse.",
    status: "disponivel",
    badge: "8 classes · 21 subclasses",
    subsecoes: [
      { label: "Antidepressivos (ISRS, IRSN, ATC, IMAO, Atípicos)", disponivel: true },
      { label: "Antipsicóticos (1G, 2G, 3G, LAI, Clozapina)", disponivel: true },
      { label: "Estabilizadores de humor (Lítio, Valproato, Lamotrigina)", disponivel: true },
      { label: "Ansiolíticos e hipnóticos (BZD, Z-drugs, Buspirona, Orexina)", disponivel: true },
      { label: "TDAH / Estimulantes (Metilfenidato, Anfetaminas, Atomoxetina)", disponivel: true },
      { label: "Dependência química, Cognitivos/demência, Manejo de EA", disponivel: true },
    ],
  },
  {
    href: "/psicofarmacologia/biblioteca/moleculas",
    icon: Pill,
    gradient: "from-blue-500 to-indigo-600",
    titulo: "Moléculas",
    descricao: "34 fármacos psiquiátricos com mecanismo, doses, indicações, efeitos adversos, interações e pearls clínicos — filtráveis por classe, indicação ou perfil.",
    status: "disponivel",
    badge: "34 fármacos",
    subsecoes: [
      { label: "ISRS — Sertralina, Fluoxetina, Escitalopram, Citalopram, Paroxetina, Fluvoxamina", disponivel: true },
      { label: "IRSN — Venlafaxina, Desvenlafaxina, Duloxetina", disponivel: true },
      { label: "Antipsicóticos 1G e 2G — Haloperidol, Risperidona, Olanzapina, Quetiapina…", disponivel: true },
      { label: "Estabilizadores — Lítio, Valproato, Lamotrigina, Carbamazepina", disponivel: true },
      { label: "Ansiolíticos / Hipnóticos — Clonazepam, Diazepam, Zolpidem…", disponivel: true },
      { label: "Psicoestimulantes e demais classes", disponivel: true },
    ],
  },
  {
    href: "/psicofarmacologia/biblioteca/transtornos",
    icon: ClipboardList,
    gradient: "from-emerald-500 to-green-600",
    titulo: "Transtornos",
    descricao: "Algoritmos terapêuticos organizados por diagnóstico: primeira linha, pearls clínicos, armadilhas comuns e notas especiais.",
    status: "disponivel",
    badge: "10 transtornos",
    subsecoes: [
      { label: "Depressão maior (primeira linha, resistência, potencialização)", disponivel: true },
      { label: "Transtorno bipolar (mania, depressão bipolar, manutenção)", disponivel: true },
      { label: "Esquizofrenia/psicose (primeiro episódio, resistente, LAI)", disponivel: true },
      { label: "Ansiedade, TOC, TEPT", disponivel: true },
      { label: "TDAH, Insônia, Dependência química", disponivel: true },
      { label: "Demências", disponivel: true },
    ],
  },
  {
    href: "/psicofarmacologia",
    icon: Wrench,
    gradient: "from-amber-500 to-orange-500",
    titulo: "Ferramentas Clínicas",
    descricao: "Calculadoras e conversores para uso clínico imediato: equivalência antipsicótica, dose terapêutica, risco de QTc, equivalência benzodiazepínica e mais.",
    status: "parcial",
    badge: "3 disponíveis",
    subsecoes: [
      { label: "Conversor de equivalência antipsicótica (CPZ)", disponivel: true },
      { label: "Calculadora de dose terapêutica", disponivel: true },
      { label: "Verificador de interação QTc", disponivel: true },
      { label: "Equivalência benzodiazepínica e plano de retirada", disponivel: false },
      { label: "Calculadora de lítio / monitorização", disponivel: false },
      { label: "Escala AIMS, Barnes, checklist clozapina…", disponivel: false },
    ],
  },
  {
    href: "/psicofarmacologia/biblioteca/populacoes",
    icon: Users,
    gradient: "from-rose-500 to-pink-600",
    titulo: "Populações Especiais",
    descricao: "Regras de prescrição com justificativa para gestação, lactação, idosos, crianças, hepatopatas, nefropatas, cardiopatas e epilépticos.",
    status: "disponivel",
    badge: "9 populações",
    subsecoes: [
      { label: "Gestação e lactação", disponivel: true },
      { label: "Idosos (Beers, Start low go slow, quedas)", disponivel: true },
      { label: "Crianças e adolescentes", disponivel: true },
      { label: "Insuficiência renal e hepática", disponivel: true },
      { label: "Cardiopatas (QTc, pós-IAM)", disponivel: true },
      { label: "Epilepsia e Parkinson/demência", disponivel: true },
    ],
  },
  {
    href: "/psicofarmacologia/biblioteca/cientifica",
    icon: BookMarked,
    gradient: "from-slate-500 to-gray-600",
    titulo: "Biblioteca Científica",
    descricao: "Guidelines internacionais (APA, CANMAT, NICE, BAP), estudos-chave, livros de referência e bases de dados online.",
    status: "disponivel",
    badge: "19 referências",
    subsecoes: [
      { label: "Guidelines (APA, BAP, CANMAT, NICE, WFSBP, CFM)", disponivel: true },
      { label: "Estudos-chave (STAR*D, CATIE, BALANCE, Cipriani 2018…)", disponivel: true },
      { label: "Livros de referência (Stahl, Maudsley, Kaplan)", disponivel: true },
      { label: "Bases de dados (PubMed, LactMed, Drugs@FDA, CredibleMeds)", disponivel: true },
      { label: "Links diretos para guidelines e estudos originais", disponivel: true },
      { label: "Organizado por tipo e categorias clínicas", disponivel: true },
    ],
  },
];

const statusConfig: Record<Status, { label: string; cls: string }> = {
  disponivel: { label: "Disponível",  cls: "bg-green-500/10 text-green-600 border-green-500/20" },
  parcial:    { label: "Parcial",     cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  breve:      { label: "Em breve",    cls: "bg-muted text-muted-foreground border-border" },
};

export default function BibliotecaHubPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7B5EA7, #4A6CF7)" }}
            >
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Biblioteca de Psicofarmacologia</h1>
              <p className="text-xs text-muted-foreground">Receptores · Classes · Moléculas · Transtornos · Ferramentas</p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl px-5 py-3.5 flex gap-3 items-start">
            <Sparkles size={14} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
              Todas as seções estão disponíveis: <strong>Receptores</strong>, <strong>Classes</strong>, <strong>Moléculas</strong>, <strong>Transtornos</strong>, <strong>Populações Especiais</strong> e <strong>Biblioteca Científica</strong>.
            </p>
          </div>

          {/* Grid de seções */}
          <div className="grid grid-cols-1 gap-4">
            {secoes.map((s) => {
              const Icon = s.icon;
              const { label: statusLabel, cls: statusCls } = statusConfig[s.status];
              const isDisponivel = s.status !== "breve";

              const CardContent = (
                <div className={`bg-card border rounded-2xl p-5 transition-all duration-200 ${
                  isDisponivel
                    ? "border-border hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(74,108,247,0.06)] cursor-pointer"
                    : "border-border opacity-80"
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${s.gradient}`}>
                      <Icon size={20} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-foreground text-base">{s.titulo}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusCls}`}>
                          {s.badge ?? statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.descricao}</p>

                      {/* Subsecoes */}
                      <ul className="space-y-1.5">
                        {s.subsecoes.map((sub) => (
                          <li key={sub.label} className="flex items-start gap-2">
                            {sub.disponivel ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                            ) : (
                              <Lock size={10} className="text-muted-foreground/40 shrink-0 mt-1" />
                            )}
                            <span className={`text-[11px] leading-relaxed ${sub.disponivel ? "text-foreground" : "text-muted-foreground/60"}`}>
                              {sub.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow */}
                    {isDisponivel && (
                      <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary shrink-0 mt-1 transition-colors" />
                    )}
                  </div>
                </div>
              );

              return s.href ? (
                <Link key={s.titulo} href={s.href} className="group block">
                  {CardContent}
                </Link>
              ) : (
                <div key={s.titulo}>
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
