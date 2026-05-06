"use client";

import { useState } from "react";
import { ArrowLeft, Search, Star, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { glossario, type CategoriaGlossario, type TermoGlossario } from "@/lib/data/glossario";
import { cn } from "@/lib/utils";

const categorias: { id: CategoriaGlossario | "todas"; label: string }[] = [
  { id: "todas",           label: "Todos" },
  { id: "percepcao",       label: "Percepção" },
  { id: "pensamento",      label: "Pensamento" },
  { id: "humor",           label: "Humor / Afeto" },
  { id: "consciencia",     label: "Consciência" },
  { id: "memoria",         label: "Memória" },
  { id: "atencao",         label: "Atenção" },
  { id: "psicomotricidade",label: "Psicomotricidade" },
  { id: "vontade",         label: "Vontade" },
  { id: "linguagem",       label: "Linguagem" },
];

function TermoCard({ termo }: { termo: TermoGlossario }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div
      className={cn(
        "bg-card border rounded-xl overflow-hidden transition-all duration-200",
        aberto ? "border-primary/30 shadow-sm" : "border-border"
      )}
    >
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {termo.relevancia === "alta" && (
            <Star size={11} className="shrink-0 fill-amber-400 text-amber-400" />
          )}
          <span className="font-semibold text-sm text-foreground">{termo.termo}</span>
          {termo.sinonimos && termo.sinonimos.length > 0 && (
            <span className="text-[10px] text-muted-foreground hidden sm:block truncate">
              ({termo.sinonimos.join(", ")})
            </span>
          )}
        </div>
        {aberto
          ? <ChevronUp size={14} className="shrink-0 text-muted-foreground" />
          : <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
        }
      </button>

      {aberto && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <p className="text-sm text-foreground leading-relaxed">{termo.definicao}</p>
          {termo.exemplo && (
            <div className="bg-muted/40 border-l-2 border-primary/40 pl-3 py-2 rounded-r-lg">
              <p className="text-xs text-muted-foreground italic">{termo.exemplo}</p>
            </div>
          )}
          {termo.sinonimos && termo.sinonimos.length > 0 && (
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold">Sinônimos: </span>
              {termo.sinonimos.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GlossarioPage() {
  const [categoria, setCategoria] = useState<CategoriaGlossario | "todas">("todas");
  const [busca, setBusca] = useState("");
  const [apenasAlta, setApenasAlta] = useState(false);

  const filtrados = glossario.filter((t) => {
    if (categoria !== "todas" && t.categoria !== categoria) return false;
    if (apenasAlta && t.relevancia !== "alta") return false;
    if (busca && !t.termo.toLowerCase().includes(busca.toLowerCase()) &&
        !t.definicao.toLowerCase().includes(busca.toLowerCase())) return false;
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
              <h1 className="text-xl font-bold text-foreground">Glossário Fenomenológico</h1>
              <p className="text-xs text-muted-foreground">{glossario.length} termos — Dalgalarrondo 2ª ed.</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar termo ou definição..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => setApenasAlta(!apenasAlta)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  apenasAlta
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-700"
                    : "bg-card border-border text-muted-foreground hover:border-amber-400/40"
                )}
              >
                <Star size={11} className={apenasAlta ? "fill-amber-500 text-amber-500" : ""} />
                Alta relevância
              </button>
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
          </div>

          {/* Contagem */}
          <p className="text-xs text-muted-foreground">
            {filtrados.length} {filtrados.length === 1 ? "termo" : "termos"} encontrado{filtrados.length !== 1 ? "s" : ""}
          </p>

          {/* Lista */}
          <div className="space-y-2">
            {filtrados.map((t) => (
              <TermoCard key={t.id} termo={t} />
            ))}
            {filtrados.length === 0 && (
              <div className="border-2 border-dashed border-border rounded-2xl py-12 text-center text-muted-foreground text-sm">
                Nenhum termo encontrado com esses filtros.
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
