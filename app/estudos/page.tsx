import Link from "next/link";
import { GraduationCap, Layers, HelpCircle, BookMarked, ChevronRight } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { decks } from "@/lib/data/flashcards";
import { questoes } from "@/lib/data/questoes";
import { artigos } from "@/lib/data/journal";

const features = [
  {
    href: "/estudos/flashcards",
    icon: Layers,
    titulo: "Flashcards",
    subtitulo: "Spaced Repetition (SM-2)",
    descricao: "Revise diagnósticos, farmacologia e critérios DSM-5-TR com o algoritmo de repetição espaçada — estude menos, reter mais.",
    stat: `${decks.reduce((acc, d) => acc + d.cards.length, 0)} cards · ${decks.length} decks`,
    gradient: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
  {
    href: "/estudos/questoes",
    icon: HelpCircle,
    titulo: "Banco de Questões",
    subtitulo: "TEP · ABP · Residência",
    descricao: "Questões de provas de título e residência comentadas com gabarito, explicação aprofundada e referência bibliográfica.",
    stat: `${questoes.length} questões · ${new Set(questoes.map((q) => q.ano)).size} anos`,
    gradient: "from-blue-500 to-indigo-600",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    href: "/estudos/journal",
    icon: BookMarked,
    titulo: "Journal Club",
    subtitulo: "Evidências que moldam a prática",
    descricao: "Os estudos mais importantes da psiquiatria: meta-análises, ECRs clássicos e diretrizes recentes com resumo e mensagem clínica.",
    stat: `${artigos.length} artigos · ${new Set(artigos.map((a) => a.area)).size} áreas`,
    gradient: "from-teal-500 to-emerald-600",
    badge: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  },
];

export default function EstudosPage() {
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
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Hub Acadêmico</h1>
              <p className="text-xs text-muted-foreground">Flashcards · Questões TEP · Journal Club</p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group bg-card border border-border rounded-2xl p-6 flex items-start gap-5 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(74,108,247,0.08)] transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${f.gradient}`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-bold text-foreground text-base">{f.titulo}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${f.badge}`}>
                        {f.stat}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 italic mb-1">{f.subtitulo}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.descricao}</p>
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
