"use client";

import { use, useState, useCallback } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle, Info, ChevronRight, RotateCcw, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { protocolos, type No, type Protocolo } from "@/lib/data/emergencia";
import { cn } from "@/lib/utils";

// ─── Color maps ───────────────────────────────────────────────────────────────
const alertaConfig = {
  perigo:  { cls: "bg-red-500/10 border-red-500/30 text-red-700",    Icon: AlertTriangle },
  atencao: { cls: "bg-amber-500/10 border-amber-500/30 text-amber-700", Icon: AlertTriangle },
  info:    { cls: "bg-blue-500/10 border-blue-500/30 text-blue-700",   Icon: Info },
  sucesso: { cls: "bg-green-500/10 border-green-500/30 text-green-700", Icon: CheckCircle },
};

const protocCorConfig: Record<string, { header: string; btn: string; tag: string }> = {
  red:    { header: "from-red-600 to-rose-500",      btn: "bg-red-600 hover:bg-red-700",      tag: "bg-red-500/10 text-red-600 border-red-500/20" },
  orange: { header: "from-orange-500 to-amber-500",  btn: "bg-orange-500 hover:bg-orange-600", tag: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  yellow: { header: "from-amber-500 to-yellow-400",  btn: "bg-amber-500 hover:bg-amber-600",   tag: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  purple: { header: "from-purple-600 to-violet-500", btn: "bg-purple-600 hover:bg-purple-700", tag: "bg-purple-500/10 text-purple-700 border-purple-500/20" },
  blue:   { header: "from-blue-600 to-indigo-500",   btn: "bg-blue-600 hover:bg-blue-700",     tag: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function AlertaBox({ alerta }: { alerta: NonNullable<No["alerta"]> }) {
  const { cls, Icon } = alertaConfig[alerta.tipo];
  return (
    <div className={cn("rounded-xl border px-4 py-3 flex gap-2 text-sm", cls)}>
      <Icon size={15} className="shrink-0 mt-0.5" />
      <span>{alerta.texto}</span>
    </div>
  );
}

function AcoesList({ acoes }: { acoes: string[] }) {
  return (
    <ul className="space-y-2">
      {acoes.map((a, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground leading-relaxed">
          <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span>{a}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Node renderer ────────────────────────────────────────────────────────────
function NoCard({
  no,
  protocolo,
  onOpcao,
  onProximo,
}: {
  no: No;
  protocolo: Protocolo;
  onOpcao: (novoId: string) => void;
  onProximo: (id: string) => void;
}) {
  const c = protocCorConfig[protocolo.cor] ?? protocCorConfig.blue;

  const tipoIcone = {
    aviso:     <AlertTriangle size={16} className="text-amber-600" />,
    pergunta:  <ChevronRight size={16} className="text-primary" />,
    info:      <Info size={16} className="text-blue-600" />,
    acao:      <CheckCircle size={16} className="text-green-600" />,
    resultado: <CheckCircle size={16} className="text-green-600" />,
  }[no.tipo];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header do nó */}
      <div className={cn(
        "px-5 py-3 flex items-center gap-2",
        no.tipo === "resultado" ? "bg-green-500/10 border-b border-green-500/20" :
        no.tipo === "aviso"     ? "bg-amber-500/10 border-b border-amber-500/20" :
        "bg-muted/40 border-b border-border"
      )}>
        {tipoIcone}
        <p className="text-sm font-bold text-foreground">{no.titulo ?? "Passo"}</p>
      </div>

      {/* Corpo */}
      <div className="p-5 space-y-4">
        <p className="text-sm text-foreground leading-relaxed">{no.conteudo}</p>

        {no.sub && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
            {no.sub}
          </p>
        )}

        {no.alerta && <AlertaBox alerta={no.alerta} />}

        {no.acoes && no.acoes.length > 0 && (
          <div className="bg-muted/30 rounded-xl p-4">
            <AcoesList acoes={no.acoes} />
          </div>
        )}

        {/* Opções de escolha (branching) */}
        {no.opcoes && no.opcoes.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Selecione a opção que melhor descreve o caso:</p>
            {no.opcoes.map((op) => (
              <button
                key={op.proximo}
                onClick={() => onOpcao(op.proximo)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-between gap-3 group"
              >
                <span>{op.label}</span>
                <ArrowRight size={14} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Botão linear (proximo) */}
        {no.proximo && !no.opcoes && (
          <button
            onClick={() => onProximo(no.proximo!)}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2",
              c.btn
            )}
          >
            Continuar <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Breadcrumb / histórico ───────────────────────────────────────────────────
function Breadcrumb({ historico, nos, onJump }: { historico: string[]; nos: No[]; onJump: (idx: number) => void }) {
  if (historico.length <= 1) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap text-[10px] text-muted-foreground">
      {historico.map((id, i) => {
        const no = nos.find((n) => n.id === id);
        return (
          <span key={id} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={9} />}
            <button
              className={cn(
                "px-2 py-0.5 rounded-full border transition-colors",
                i === historico.length - 1
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border hover:border-primary/20 hover:text-foreground cursor-pointer"
              )}
              onClick={() => i < historico.length - 1 && onJump(i)}
            >
              {no?.titulo ?? id}
            </button>
          </span>
        );
      })}
    </div>
  );
}

// ─── Main runner ──────────────────────────────────────────────────────────────
function ProtocoloRunner({ protocolo }: { protocolo: Protocolo }) {
  const [historico, setHistorico] = useState<string[]>([protocolo.inicio]);

  const noAtualId = historico[historico.length - 1];
  const noAtual   = protocolo.nos.find((n) => n.id === noAtualId);

  const avancar = useCallback((id: string) => {
    setHistorico((h) => [...h, id]);
  }, []);

  const voltar = useCallback(() => {
    if (historico.length > 1) {
      setHistorico((h) => h.slice(0, -1));
    }
  }, [historico.length]);

  const reiniciar = useCallback(() => {
    setHistorico([protocolo.inicio]);
  }, [protocolo.inicio]);

  const pularPara = useCallback((idx: number) => {
    setHistorico((h) => h.slice(0, idx + 1));
  }, []);

  const isTerminal = noAtual && !noAtual.proximo && !noAtual.opcoes;
  const c = protocCorConfig[protocolo.cor] ?? protocCorConfig.blue;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb historico={historico} nos={protocolo.nos} onJump={pularPara} />

      {/* Nó atual */}
      {noAtual ? (
        <NoCard
          no={noAtual}
          protocolo={protocolo}
          onOpcao={avancar}
          onProximo={avancar}
        />
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5 text-center text-muted-foreground text-sm">
          Nó não encontrado — reinicie o protocolo.
        </div>
      )}

      {/* Navegação inferior */}
      <div className="flex items-center gap-3">
        {historico.length > 1 && (
          <button
            onClick={voltar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
        )}

        {isTerminal && (
          <button
            onClick={reiniciar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors ml-auto"
          >
            <RotateCcw size={14} /> Reiniciar
          </button>
        )}
      </div>

      {/* Referência */}
      <p className="text-[11px] text-muted-foreground px-1">
        <span className="font-semibold">Referência: </span>{protocolo.referencia}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmergenciaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const protocolo = protocolos.find((p) => p.id === slug);

  if (!protocolo) notFound();

  const c = protocCorConfig[protocolo.cor] ?? protocCorConfig.blue;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/emergencia"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br",
                  c.header
                )}
              >
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">{protocolo.titulo}</h1>
                <p className="text-xs text-muted-foreground">Protocolo de emergência — use com julgamento clínico</p>
              </div>
            </div>
          </div>

          {/* Runner */}
          <ProtocoloRunner protocolo={protocolo} />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
