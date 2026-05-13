"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

type Status = "idle" | "streaming" | "done" | "error";

export default function ProntuarioIAPage() {
  const [relato, setRelato] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!relato.trim()) return;

    setOutput("");
    setStatus("streaming");

    try {
      const res = await fetch("/api/ia/prontuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relato }),
      });

      if (!res.ok || !res.body) {
        setStatus("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) setOutput((prev) => prev + decoder.decode(value, { stream: !done }));
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setOutput("");
    setStatus("idle");
    setRelato("");
  }

  const isStreaming = status === "streaming";

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/ia"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-600">
                <FileText size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Gerador de Prontuário</p>
                <p className="text-[10px] text-muted-foreground">SOAP · Exame Mental · Plano Terapêutico</p>
              </div>
            </div>
          </div>

          {/* Form */}
          {status === "idle" && (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Relato da consulta <span className="text-red-500">*</span>
                </label>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Descreva a consulta em linguagem livre — queixas, exame mental, histórico, decisões tomadas. A IA estruturará em formato SOAP.
                </p>
                <textarea
                  value={relato}
                  onChange={(e) => setRelato(e.target.value)}
                  required
                  rows={10}
                  placeholder="Ex: Paciente de 38 anos, professora, retorno após 4 semanas. Refere melhora parcial do humor com sertralina 100mg, mas mantém insônia inicial e ansiedade matinal. Nega ideação suicida. AO: vigil, orientada, fala fluente, sem alterações formais do pensamento, humor hipotímico moderado, afeto restrito. Conduta: mantida medicação, acrescentado clonazepam 0,5mg à noite por 30 dias, psicoeducação sobre sono, retorno em 6 semanas..."
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors resize-none mt-1"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!relato.trim()}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    relato.trim()
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <FileText size={14} />
                  Gerar prontuário SOAP
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                ⚠️ Não insira dados que identifiquem o paciente
              </p>
            </form>
          )}

          {/* Output */}
          {(status === "streaming" || status === "done" || status === "error") && (
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Prontuário SOAP</p>
                  {isStreaming && <Loader2 size={14} className="text-white animate-spin" />}
                </div>
                <div className="p-5">
                  {status === "error" ? (
                    <div className="flex gap-2 items-start text-red-600 text-sm">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>Erro ao conectar com a IA. Tente novamente.</span>
                    </div>
                  ) : (
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                      {output}
                      {isStreaming && <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 rounded-sm" />}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw size={13} /> Nova consulta
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
