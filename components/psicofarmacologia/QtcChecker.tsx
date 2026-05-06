"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Info, Plus, X } from "lucide-react";
import { antipsicóticos } from "@/lib/data/antipsicóticos";
import { cn } from "@/lib/utils";

// Drogas não-antipsicóticas com risco QTc relevantes na prática psiquiátrica
const outrosMedicamentos = [
  { id: "citalopram",    nome: "Citalopram",     categoria: "ISRS",          qtc: "alto"     },
  { id: "escitalopram",  nome: "Escitalopram",   categoria: "ISRS",          qtc: "moderado" },
  { id: "sertralina",    nome: "Sertralina",      categoria: "ISRS",          qtc: "baixo"    },
  { id: "fluoxetina",    nome: "Fluoxetina",      categoria: "ISRS",          qtc: "baixo"    },
  { id: "paroxetina",    nome: "Paroxetina",      categoria: "ISRS",          qtc: "baixo"    },
  { id: "venlafaxina",   nome: "Venlafaxina",     categoria: "IRSN",          qtc: "moderado" },
  { id: "amitriptilina", nome: "Amitriptilina",   categoria: "ADT",           qtc: "alto"     },
  { id: "clomipramina",  nome: "Clomipramina",    categoria: "ADT",           qtc: "alto"     },
  { id: "imipramina",    nome: "Imipramina",      categoria: "ADT",           qtc: "alto"     },
  { id: "litio",         nome: "Lítio",           categoria: "Estabilizador", qtc: "baixo"    },
  { id: "valproato",     nome: "Valproato",       categoria: "Estabilizador", qtc: "baixo"    },
  { id: "carbamazepina", nome: "Carbamazepina",   categoria: "Estabilizador", qtc: "baixo"    },
  { id: "metadona",      nome: "Metadona",        categoria: "Opioide",       qtc: "alto"     },
  { id: "ondansetrona",  nome: "Ondansetrona",    categoria: "Antiemético",   qtc: "alto"     },
  { id: "azitromicina",  nome: "Azitromicina",    categoria: "Antibiótico",   qtc: "alto"     },
  { id: "ciprofloxacino",nome: "Ciprofloxacino",  categoria: "Antibiótico",   qtc: "moderado" },
  { id: "fluconazol",    nome: "Fluconazol",      categoria: "Antifúngico",   qtc: "alto"     },
] as const;

type QTcNivel = "alto" | "moderado" | "baixo";

interface Droga {
  id: string;
  nome: string;
  qtc: QTcNivel;
  categoria?: string;
}

const todasDrogas: Droga[] = [
  ...antipsicóticos.map((a) => ({ id: a.id, nome: a.nome, qtc: a.qtc, categoria: `Antipsicótico ${a.classe}` })),
  ...outrosMedicamentos,
];

export function QtcChecker() {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [busca, setBusca]               = useState("");

  const drogas = selecionadas.map((id) => todasDrogas.find((d) => d.id === id)!).filter(Boolean);
  const altasQTc    = drogas.filter((d) => d.qtc === "alto");
  const moderadasQTc = drogas.filter((d) => d.qtc === "moderado");

  const risco = altasQTc.length >= 2
    ? "contraindicado"
    : altasQTc.length === 1 && moderadasQTc.length >= 1
    ? "alto"
    : altasQTc.length === 1
    ? "moderado"
    : moderadasQTc.length >= 2
    ? "moderado"
    : "baixo";

  const opcoesFiltradas = todasDrogas
    .filter((d) => !selecionadas.includes(d.id))
    .filter((d) => busca.length === 0 || d.nome.toLowerCase().includes(busca.toLowerCase()))
    .slice(0, 8);

  function adicionar(id: string) {
    setSelecionadas((prev) => [...prev, id]);
    setBusca("");
  }

  function remover(id: string) {
    setSelecionadas((prev) => prev.filter((x) => x !== id));
  }

  return (
    <div className="space-y-5">
      <div className="text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5 text-primary" />
        <span>
          Baseado na lista <strong>CredibleMeds / Arizona CERT</strong> (crediblemeds.org).
          Verificador de risco de prolongamento do intervalo QTc por polifarmácia.
        </span>
      </div>

      {/* Campo de busca */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Plus size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar e adicionar medicamento..."
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {busca.length > 0 && opcoesFiltradas.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
            {opcoesFiltradas.map((d) => (
              <button
                key={d.id}
                onClick={() => adicionar(d.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
              >
                <div>
                  <span className="text-foreground font-medium">{d.nome}</span>
                  <span className="text-muted-foreground text-xs ml-2">{d.categoria}</span>
                </div>
                <QTcPill nivel={d.qtc} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drogas selecionadas */}
      {selecionadas.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {drogas.map((d) => (
              <div
                key={d.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium",
                  d.qtc === "alto"
                    ? "bg-red-500/10 border-red-500/30 text-red-600"
                    : d.qtc === "moderado"
                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600"
                    : "bg-green-500/10 border-green-500/30 text-green-600"
                )}
              >
                {d.nome}
                <button onClick={() => remover(d.id)} className="hover:opacity-60">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Painel de resultado */}
          <RiscoPanel risco={risco} altasQTc={altasQTc} moderadasQTc={moderadasQTc} total={drogas.length} />
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-2xl py-12 text-center text-muted-foreground text-sm">
          Adicione medicamentos para verificar o risco de QTc
        </div>
      )}

      {/* Lista de referência */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Referência rápida — Risco QTc</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          {(["alto", "moderado", "baixo"] as const).map((nivel) => (
            <div key={nivel} className="p-4">
              <p className={cn(
                "text-xs font-semibold uppercase tracking-wide mb-2",
                nivel === "alto" ? "text-red-600" : nivel === "moderado" ? "text-yellow-600" : "text-green-600"
              )}>
                {nivel === "alto" ? "⚠ Alto" : nivel === "moderado" ? "Moderado" : "Baixo"}
              </p>
              <ul className="space-y-1">
                {todasDrogas.filter((d) => d.qtc === nivel).slice(0, 8).map((d) => (
                  <li key={d.id} className="text-xs text-muted-foreground">{d.nome}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiscoPanel({
  risco, altasQTc, moderadasQTc, total,
}: {
  risco: "contraindicado" | "alto" | "moderado" | "baixo";
  altasQTc: Droga[];
  moderadasQTc: Droga[];
  total: number;
}) {
  const config = {
    contraindicado: {
      icon: XCircle,
      color: "#D62828",
      bg: "bg-red-500/10 border-red-500/30",
      title: "Combinação contraindicada",
      msg: `${altasQTc.map((d) => d.nome).join(" + ")} — múltiplos agentes com alto risco QTc. Risco de Torsades de Pointes.`,
    },
    alto: {
      icon: AlertTriangle,
      color: "#F59E0B",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      title: "Risco alto",
      msg: `Combinação de agente com alto risco + moderado. Solicitar ECG, monitorar QTc (alvo <450ms homens, <470ms mulheres).`,
    },
    moderado: {
      icon: AlertTriangle,
      color: "#F59E0B",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      title: "Risco moderado",
      msg: `Múltiplos agentes com risco moderado ou uma droga de alto risco isolada. Considerar ECG basal.`,
    },
    baixo: {
      icon: CheckCircle,
      color: "#22C55E",
      bg: "bg-green-500/10 border-green-500/30",
      title: "Risco baixo",
      msg: `Nenhuma combinação de risco QTc identificada entre os ${total} medicamentos selecionados.`,
    },
  };

  const { icon: Icon, color, bg, title, msg } = config[risco];

  return (
    <div className={cn("rounded-2xl border p-5 flex gap-4", bg)}>
      <Icon size={24} style={{ color }} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{msg}</p>
        {risco !== "baixo" && (
          <p className="text-xs text-muted-foreground mt-2">
            Referência: CredibleMeds.org — Consultar sempre o ECG e fatores de risco individuais (hipocalemia, cardiopatia, sexo feminino).
          </p>
        )}
      </div>
    </div>
  );
}

function QTcPill({ nivel }: { nivel: QTcNivel }) {
  return (
    <span className={cn(
      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
      nivel === "alto" ? "bg-red-500/10 text-red-600" :
      nivel === "moderado" ? "bg-yellow-500/10 text-yellow-600" :
      "bg-green-500/10 text-green-600"
    )}>
      QTc {nivel}
    </span>
  );
}
