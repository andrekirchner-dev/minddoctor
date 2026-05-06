"use client";

import { use, useState } from "react";
import { ArrowLeft, Lightbulb, AlertTriangle, Info, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { modulos, type SecaoModulo, type ItemLista } from "@/lib/data/modulos";
import { cn } from "@/lib/utils";

// ─── Alert config ────────────────────────────────────────────────────────────
const alertaConfig = {
  info:    { cls: "bg-blue-500/10 border-blue-500/20 text-blue-700",    Icon: Info },
  atencao: { cls: "bg-amber-500/10 border-amber-500/30 text-amber-700", Icon: AlertTriangle },
  perigo:  { cls: "bg-red-500/10 border-red-500/30 text-red-700",       Icon: AlertCircle },
};

// ─── Section renderers ────────────────────────────────────────────────────────
function SecaoTexto({ secao }: { secao: SecaoModulo }) {
  return (
    <div className="space-y-4">
      {secao.intro && (
        <p className="text-sm text-muted-foreground leading-relaxed italic">{secao.intro}</p>
      )}
      {secao.texto && (
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">{secao.texto}</div>
      )}
      {secao.items && secao.items.length > 0 && <ListaItems items={secao.items} />}
    </div>
  );
}

function SecaoTabela({ secao }: { secao: SecaoModulo }) {
  if (!secao.tabela) return null;
  const { headers, linhas, nota } = secao.tabela;
  return (
    <div className="space-y-3">
      {secao.intro && (
        <p className="text-xs text-muted-foreground leading-relaxed italic">{secao.intro}</p>
      )}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-muted/60">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2.5 font-semibold text-foreground border-b border-border first:rounded-tl-xl last:rounded-tr-xl">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {linhas.map((row, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2.5 text-foreground align-top leading-relaxed">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nota && (
        <p className="text-[11px] text-muted-foreground italic px-1">{nota}</p>
      )}
    </div>
  );
}

function ListaItems({ items }: { items: ItemLista[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const alerta = item.alerta ? alertaConfig[item.alerta] : null;
        return (
          <div key={i} className={cn(
            "rounded-xl border p-3 space-y-1",
            alerta ? alerta.cls : "bg-muted/30 border-border"
          )}>
            <div className="flex items-center gap-2 flex-wrap">
              {alerta && <alerta.Icon size={12} className="shrink-0" />}
              <span className="font-semibold text-sm text-foreground leading-tight">{item.nome}</span>
              {item.tag && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                  {item.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.detalhe}</p>
          </div>
        );
      })}
    </div>
  );
}

function SecaoCards({ secao }: { secao: SecaoModulo }) {
  return (
    <div className="space-y-3">
      {secao.intro && (
        <p className="text-xs text-muted-foreground leading-relaxed italic">{secao.intro}</p>
      )}
      {secao.items && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {secao.items.map((item, i) => (
            <div key={i} className="bg-muted/20 border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">{item.nome}</span>
                {item.tag && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.detalhe}</p>
              {item.alerta && (() => {
                const cfg = alertaConfig[item.alerta!];
                return (
                  <div className={cn("flex gap-1.5 items-start rounded-lg px-2.5 py-1.5 border text-[11px]", cfg.cls)}>
                    <cfg.Icon size={11} className="shrink-0 mt-0.5" />
                    <span>Atenção</span>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecaoLegal({ secao }: { secao: SecaoModulo }) {
  return (
    <div className="space-y-4">
      {secao.texto && (
        <div className="bg-muted/20 border-l-4 border-primary/40 pl-4 py-3 rounded-r-xl">
          <p className="text-sm text-foreground leading-relaxed">{secao.texto}</p>
        </div>
      )}
      {secao.items && <ListaItems items={secao.items} />}
    </div>
  );
}

function RenderSecao({ secao }: { secao: SecaoModulo }) {
  switch (secao.tipo) {
    case "tabela":    return <SecaoTabela secao={secao} />;
    case "cards":     return <SecaoCards secao={secao} />;
    case "legal":     return <SecaoLegal secao={secao} />;
    case "lista":     return <SecaoTexto secao={secao} />;
    default:          return <SecaoTexto secao={secao} />;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ModuloDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const modulo = modulos.find((m) => m.id === slug);

  if (!modulo) notFound();

  const [secaoAtiva, setSecaoAtiva] = useState(modulo.secoes[0]?.id ?? "");
  const secao = modulo.secoes.find((s) => s.id === secaoAtiva) ?? modulo.secoes[0];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/modulos"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                  modulo.plano === "pro"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-green-500/10 text-green-700 border-green-500/20"
                )}>
                  {modulo.plano}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground leading-tight">{modulo.titulo}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{modulo.subtitulo}</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 flex-wrap">
            {modulo.secoes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSecaoAtiva(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                  secaoAtiva === s.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {s.titulo}
              </button>
            ))}
          </div>

          {/* Section content */}
          {secao && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className={cn(
                "px-5 py-3 border-b border-border bg-gradient-to-r",
                modulo.gradient,
              )}>
                <p className="text-sm font-bold text-white">{secao.titulo}</p>
              </div>
              <div className="p-5">
                <RenderSecao secao={secao} />

                {/* Pearls */}
                {secao.pearls && secao.pearls.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Lightbulb size={13} className="text-amber-500" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pearls clínicas</p>
                    </div>
                    {secao.pearls.map((pearl, i) => (
                      <div key={i} className="flex gap-2.5 text-xs text-foreground leading-relaxed">
                        <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span>{pearl}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Referência */}
                <p className="mt-4 text-[11px] text-muted-foreground border-t border-border pt-3">
                  <span className="font-semibold">Ref: </span>{secao.referencia}
                </p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
