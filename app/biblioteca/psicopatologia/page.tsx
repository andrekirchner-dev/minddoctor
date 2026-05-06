"use client";

import { useState } from "react";
import { ArrowLeft, Search, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { psicopatologia, type CategoriaPsicopatologia } from "@/lib/data/psicopatologia";
import { cn } from "@/lib/utils";

const categorias: { id: CategoriaPsicopatologia | "todas"; label: string }[] = [
  { id: "todas",              label: "Todos" },
  { id: "percepcao",         label: "Percepção" },
  { id: "pensamento-forma",  label: "Pens. Forma" },
  { id: "pensamento-conteudo", label: "Pens. Conteúdo" },
  { id: "humor-afeto",       label: "Humor / Afeto" },
  { id: "consciencia",       label: "Consciência" },
  { id: "memoria",           label: "Memória" },
  { id: "psicomotricidade",  label: "Psicomotricidade" },
  { id: "vontade-impulsos",  label: "Vontade" },
  { id: "inteligencia",      label: "Inteligência" },
  { id: "insight",           label: "Insight" },
];

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

export default function PsicopatologiaPage() {
  const [categoria, setCategoria] = useState<CategoriaPsicopatologia | "todas">("todas");
  const [busca, setBusca] = useState("");

  const filtrados = psicopatologia.filter((e) => {
    if (categoria !== "todas" && e.categoria !== categoria) return false;
    if (busca && !e.titulo.toLowerCase().includes(busca.toLowerCase()) &&
        !e.resumo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/biblioteca"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Wiki de Psicopatologia</h1>
              <p className="text-xs text-muted-foreground">{psicopatologia.length} domínios semiológicos — Dalgalarrondo 3ª ed.</p>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar domínio ou fenômeno..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  categoria === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtrados.map((e) => (
              <Link
                key={e.id}
                href={`/biblioteca/psicopatologia/${e.id}`}
                className="group bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                        categoriaCor[e.categoria] ?? "bg-muted text-muted-foreground border-border"
                      )}>
                        {categoriaLabel[e.categoria] ?? e.categoria}
                      </span>
                      {e.plano === "free" && (
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{e.titulo}</p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{e.resumo}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{e.fenomenos.length} fenômenos</span>
                  <span>·</span>
                  <span>{e.pearls.length} pearls</span>
                </div>
              </Link>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-2xl py-12 text-center text-muted-foreground text-sm">
              Nenhum domínio encontrado.
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
