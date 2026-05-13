"use client";

import { useState } from "react";
import { ArrowLeft, Stethoscope, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

type Status = "idle" | "streaming" | "done" | "error";

export default function DiagnosticoIAPage() {
  const [form, setForm] = useState({
    idade: "",
    sexo: "",
    sintomas: "",
    duracao: "",
    historia: "",
    medicacoes: "",
  });
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sintomas.trim()) return;

    setOutput("");
    setStatus("streaming");

    try {
      const res = await fetch("/api/ia/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    setForm({ idade: "", sexo: "", sintomas: "", duracao: "", historia: "", medicacoes: "" });
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                <Stethoscope size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Assistente Diagnóstico</p>
                <p className="text-[10px] text-muted-foreground">Raciocínio diferencial DSM-5-TR · CID-11</p>
              </div>
            </div>
          </div>

          {/* Form */}
          {status === "idle" && (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Idade</label>
                  <input
                    name="idade"
                    value={form.idade}
                    onChange={handleChange}
                    placeholder="ex: 32"
                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Sexo</label>
                  <select
                    name="sexo"
                    value={form.sexo}
                    onChange={handleChange}
                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
                  >
                    <option value="">Não informado</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Sintomas principais <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="sintomas"
                  value={form.sintomas}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Descreva os sintomas presentes: humor, sono, apetite, pensamentos, percepção, comportamento..."
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Duração dos sintomas</label>
                  <input
                    name="duracao"
                    value={form.duracao}
                    onChange={handleChange}
                    placeholder="ex: 3 semanas"
                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Medicações em uso</label>
                  <input
                    name="medicacoes"
                    value={form.medicacoes}
                    onChange={handleChange}
                    placeholder="ex: sertralina 50 mg"
                    className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">História psiquiátrica prévia</label>
                <textarea
                  name="historia"
                  value={form.historia}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Episódios anteriores, internações, diagnósticos prévios, história familiar..."
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!form.sintomas.trim()}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    form.sintomas.trim()
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Stethoscope size={14} />
                  Gerar raciocínio diagnóstico
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
                <div className="px-5 py-3 border-b border-border bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Raciocínio Diagnóstico</p>
                  {isStreaming && <Loader2 size={14} className="text-white animate-spin" />}
                </div>
                <div className="p-5">
                  {status === "error" ? (
                    <div className="flex gap-2 items-start text-red-600 text-sm">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>Erro ao conectar com a IA. Tente novamente.</span>
                    </div>
                  ) : (
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
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
