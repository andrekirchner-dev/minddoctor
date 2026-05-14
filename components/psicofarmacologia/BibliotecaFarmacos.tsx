"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Pill, AlertTriangle, Zap, Info } from "lucide-react";
import { farmacos, classesLabel, classeColors, type ClasseFarmaco } from "@/lib/data/farmacos";
import { cn } from "@/lib/utils";

type FilterClasse = ClasseFarmaco | "todas";

function FarmacoCard({ f }: { f: typeof farmacos[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Pill size={16} className="text-primary" />
        </div>

        {/* Name + class */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-foreground text-sm">{f.nome}</p>
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", classeColors[f.classe])}>
              {classesLabel[f.classe]}
            </span>
          </div>
          {!open && (
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {f.nomesComerciais.join(" · ")}
            </p>
          )}
        </div>

        {/* Dose badge */}
        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-[10px] text-muted-foreground">Dose terapêutica</p>
          <p className="text-xs font-semibold text-foreground">{f.doses.terapeutica}</p>
        </div>

        {open ? (
          <ChevronUp size={16} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          {/* Nomes comerciais */}
          <div className="flex flex-wrap gap-1.5">
            {f.nomesComerciais.map((n) => (
              <span key={n} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {n}
              </span>
            ))}
          </div>

          {/* Grid de infos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mecanismo */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Zap size={10} /> Mecanismo
              </p>
              <p className="text-xs text-foreground leading-relaxed">{f.mecanismo}</p>
            </div>

            {/* Doses */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Info size={10} /> Doses
              </p>
              <div className="space-y-0.5">
                <p className="text-xs text-foreground"><span className="text-muted-foreground">Início:</span> {f.doses.inicio}</p>
                <p className="text-xs text-foreground"><span className="text-muted-foreground">Terapêutica:</span> {f.doses.terapeutica}</p>
                <p className="text-xs text-foreground"><span className="text-muted-foreground">Máxima:</span> {f.doses.maxima}</p>
                <p className="text-xs text-foreground"><span className="text-muted-foreground">Meia-vida:</span> {f.vidaMedia}</p>
              </div>
            </div>
          </div>

          {/* Indicações */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Indicações</p>
            <div className="flex flex-wrap gap-1.5">
              {f.indicacoes.map((ind) => (
                <span key={ind} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Efeitos adversos */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle size={10} className="text-amber-500" /> Principais efeitos adversos
            </p>
            <ul className="space-y-0.5">
              {f.principaisEfeitosAdversos.map((ea) => (
                <li key={ea} className="text-xs text-foreground flex gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">·</span>
                  {ea}
                </li>
              ))}
            </ul>
          </div>

          {/* Interações */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Interações importantes</p>
            <ul className="space-y-0.5">
              {f.interacoesImportantes.map((int) => (
                <li key={int} className="text-xs text-foreground flex gap-2">
                  <span className="text-red-500 shrink-0 mt-0.5">·</span>
                  {int}
                </li>
              ))}
            </ul>
          </div>

          {/* Observações */}
          {f.observacoes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">Pearl clínico</p>
              <p className="text-xs text-foreground leading-relaxed">{f.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BibliotecaFarmacos() {
  const [search, setSearch] = useState("");
  const [filterClasse, setFilterClasse] = useState<FilterClasse>("todas");

  const classes = useMemo<FilterClasse[]>(() => {
    const found = Array.from(new Set(farmacos.map((f) => f.classe)));
    return ["todas", ...found];
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return farmacos.filter((f) => {
      const matchClasse = filterClasse === "todas" || f.classe === filterClasse;
      const matchSearch =
        !q ||
        f.nome.toLowerCase().includes(q) ||
        f.nomesComerciais.some((n) => n.toLowerCase().includes(q)) ||
        f.indicacoes.some((i) => i.toLowerCase().includes(q)) ||
        classesLabel[f.classe].toLowerCase().includes(q);
      return matchClasse && matchSearch;
    });
  }, [search, filterClasse]);

  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, indicação ou classe..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </div>

      {/* Filtro por classe */}
      <div className="flex flex-wrap gap-1.5">
        {classes.map((c) => (
          <button
            key={c}
            onClick={() => setFilterClasse(c)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all",
              filterClasse === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {c === "todas" ? "Todos" : classesLabel[c as ClasseFarmaco]}
          </button>
        ))}
      </div>

      {/* Contagem */}
      <p className="text-[11px] text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "fármaco" : "fármacos"}
      </p>

      {/* Lista */}
      <div className="space-y-2">
        {filtered.map((f) => (
          <FarmacoCard key={f.id} f={f} />
        ))}
        {filtered.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-2xl py-12 text-center text-muted-foreground text-sm">
            Nenhum fármaco encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
