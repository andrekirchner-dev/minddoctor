import { ArrowLeft, Lightbulb, BookOpen, Microscope } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { psicopatologia } from "@/lib/data/psicopatologia";
import { cn } from "@/lib/utils";

const categoriaCor: Record<string, string> = {
  percepcao:            "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "pensamento-forma":   "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "pensamento-conteudo":"bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "humor-afeto":        "bg-amber-500/10 text-amber-600 border-amber-500/20",
  consciencia:          "bg-teal-500/10 text-teal-600 border-teal-500/20",
  memoria:              "bg-green-500/10 text-green-600 border-green-500/20",
  psicomotricidade:     "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "vontade-impulsos":   "bg-rose-500/10 text-rose-600 border-rose-500/20",
  inteligencia:         "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  insight:              "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const categoriaLabel: Record<string, string> = {
  percepcao:            "Percepção",
  "pensamento-forma":   "Pensamento — Forma",
  "pensamento-conteudo":"Pensamento — Conteúdo",
  "humor-afeto":        "Humor / Afeto",
  consciencia:          "Consciência",
  memoria:              "Memória",
  psicomotricidade:     "Psicomotricidade",
  "vontade-impulsos":   "Vontade / Impulsos",
  inteligencia:         "Inteligência",
  insight:              "Insight",
};

function renderConteudo(texto: string) {
  return texto.split("\n\n").map((paragrafo, i) => {
    const parts = paragrafo.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-sm text-foreground leading-relaxed">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

export default async function PsicopatologiaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entrada = psicopatologia.find((e) => e.id === id);

  if (!entrada) notFound();

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/biblioteca/psicopatologia"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                  categoriaCor[entrada.categoria] ?? "bg-muted text-muted-foreground border-border"
                )}>
                  {categoriaLabel[entrada.categoria] ?? entrada.categoria}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground leading-tight">{entrada.titulo}</h1>
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-sm text-muted-foreground leading-relaxed italic">{entrada.resumo}</p>
          </div>

          {/* Conteúdo principal */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={14} className="text-primary" />
              <p className="text-sm font-bold text-foreground">Conteúdo</p>
            </div>
            <div className="space-y-3">
              {renderConteudo(entrada.conteudo)}
            </div>
          </div>

          {/* Fenômenos */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Microscope size={14} className="text-primary" />
              <p className="text-sm font-bold text-foreground">
                Fenômenos ({entrada.fenomenos.length})
              </p>
            </div>
            <div className="divide-y divide-border">
              {entrada.fenomenos.map((f, i) => (
                <div key={i} className="px-5 py-4 space-y-1.5">
                  <p className="text-sm font-semibold text-foreground">{f.nome}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.definicao}</p>
                  {f.exemplo && (
                    <div className="bg-muted/40 border-l-2 border-primary/30 pl-3 py-1.5 rounded-r-lg">
                      <p className="text-xs text-muted-foreground italic">{f.exemplo}</p>
                    </div>
                  )}
                  {f.diagnostico_associado && (
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-semibold">Associado a: </span>
                      {f.diagnostico_associado}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pearls clínicas */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-500" />
              <p className="text-sm font-bold text-foreground">Pearls Clínicas</p>
            </div>
            <ul className="px-5 py-4 space-y-3">
              {entrada.pearls.map((pearl, i) => (
                <li key={i} className="flex gap-3 text-xs text-foreground leading-relaxed">
                  <span className="shrink-0 mt-1 w-4 h-4 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span>{pearl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Referência */}
          <p className="text-[11px] text-muted-foreground px-1">
            <span className="font-semibold">Referência: </span>{entrada.referencia}
          </p>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
