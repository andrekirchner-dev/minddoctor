"use client";

import { useState } from "react";
import { FileOutput, Copy, Check, RotateCcw } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type TipoRelatorio = "atestado" | "encaminhamento" | "alta" | "laudo" | "comparecimento";

interface CampoRelatorio {
  key: string;
  label: string;
  tipo: "text" | "textarea" | "number" | "date" | "select";
  placeholder?: string;
  opcoes?: string[];
  rows?: number;
  required?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const tipos: { id: TipoRelatorio; label: string; desc: string; color: string }[] = [
  { id: "atestado",        label: "Atestado Médico",         desc: "Afastamento por doença",                 color: "from-blue-500 to-blue-600" },
  { id: "encaminhamento",  label: "Encaminhamento",          desc: "Para especialista ou serviço",           color: "from-violet-500 to-violet-600" },
  { id: "alta",            label: "Relatório de Alta",       desc: "Resumo de internação",                   color: "from-teal-500 to-teal-600" },
  { id: "laudo",           label: "Laudo Psiquiátrico",      desc: "Pericial / Funcional / Judicial",        color: "from-amber-500 to-orange-600" },
  { id: "comparecimento",  label: "Decl. de Comparecimento", desc: "Registro de presença em consulta",       color: "from-slate-500 to-slate-600" },
];

const campos: Record<TipoRelatorio, CampoRelatorio[]> = {
  atestado: [
    { key: "cid", label: "CID-10/11", tipo: "text", placeholder: "Ex: F32.1", required: true },
    { key: "dias", label: "Dias de afastamento", tipo: "number", placeholder: "Ex: 15", required: true },
    { key: "data", label: "Data de emissão", tipo: "date", required: true },
    { key: "observacoes", label: "Observações (opcional)", tipo: "textarea", rows: 2, placeholder: "Restrições, atividade parcial etc." },
  ],
  encaminhamento: [
    { key: "para", label: "Encaminhar para", tipo: "text", placeholder: "Ex: Neurologista, CAPS, CRAS...", required: true },
    { key: "motivo", label: "Motivo do encaminhamento", tipo: "textarea", rows: 3, placeholder: "Descreva o motivo clínico...", required: true },
    { key: "hipotese", label: "Hipótese diagnóstica", tipo: "text", placeholder: "Ex: F20 — Esquizofrenia", required: true },
    { key: "resumo", label: "Resumo clínico", tipo: "textarea", rows: 4, placeholder: "Histórico breve, medicações atuais, evolução..." },
    { key: "urgencia", label: "Urgência", tipo: "select", opcoes: ["Eletiva", "Prioritária (< 30 dias)", "Urgente (< 72h)"], required: true },
    { key: "data", label: "Data", tipo: "date", required: true },
  ],
  alta: [
    { key: "dataInternacao", label: "Data de internação", tipo: "date", required: true },
    { key: "dataAlta", label: "Data de alta", tipo: "date", required: true },
    { key: "motivoInternacao", label: "Motivo de internação", tipo: "textarea", rows: 2, required: true, placeholder: "Quadro clínico na admissão..." },
    { key: "diagnostico", label: "Diagnóstico de alta", tipo: "text", placeholder: "Ex: F20.0 — Esquizofrenia Paranóide", required: true },
    { key: "tratamento", label: "Tratamento realizado", tipo: "textarea", rows: 3, placeholder: "Medicações, intervenções, ECT etc." },
    { key: "evolucao", label: "Evolução durante internação", tipo: "textarea", rows: 3, placeholder: "Melhora de quais sintomas, intercorrências..." },
    { key: "prescricaoAlta", label: "Prescrição de alta", tipo: "textarea", rows: 3, placeholder: "Medicamentos, doses, horários..." },
    { key: "orientacoes", label: "Orientações e retorno", tipo: "textarea", rows: 2, placeholder: "Data de retorno, sinais de alerta, contato..." },
  ],
  laudo: [
    { key: "objetivo", label: "Objetivo do laudo", tipo: "select", opcoes: ["Benefício INSS/BPC", "Aposentadoria por invalidez", "Pericial judicial", "Capacidade civil", "Finalidade escolar/educacional", "Outro"], required: true },
    { key: "historico", label: "Histórico clínico", tipo: "textarea", rows: 4, required: true, placeholder: "Início dos sintomas, internações, tratamentos anteriores..." },
    { key: "exameMental", label: "Exame do estado mental", tipo: "textarea", rows: 4, placeholder: "Descreva o EEM atual..." },
    { key: "diagnostico", label: "Diagnóstico (CID-10/11)", tipo: "text", placeholder: "Ex: F31.5 — Transtorno Bipolar, episódio depressivo grave", required: true },
    { key: "prognostico", label: "Prognóstico", tipo: "textarea", rows: 2, placeholder: "Evolução esperada, possibilidade de reabilitação..." },
    { key: "parecer", label: "Parecer / Conclusão", tipo: "textarea", rows: 4, required: true, placeholder: "Opinião técnica para os fins solicitados..." },
    { key: "data", label: "Data", tipo: "date", required: true },
  ],
  comparecimento: [
    { key: "data", label: "Data da consulta", tipo: "date", required: true },
    { key: "horario", label: "Horário de chegada", tipo: "text", placeholder: "Ex: 14h30", required: true },
    { key: "horarioSaida", label: "Horário de saída", tipo: "text", placeholder: "Ex: 15h15" },
    { key: "local", label: "Local / Serviço", tipo: "text", placeholder: "Ex: Ambulatório de Psiquiatria", required: true },
    { key: "observacoes", label: "Observações (opcional)", tipo: "textarea", rows: 2 },
  ],
};

// ─── Text generators ──────────────────────────────────────────────────────────

function gerarTexto(tipo: TipoRelatorio, dados: Record<string, string>): string {
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  switch (tipo) {
    case "atestado":
      return `ATESTADO MÉDICO

Atesto, para os devidos fins, que o(a) paciente portador(a) do diagnóstico ${dados.cid ? `CID ${dados.cid}` : "[CID]"} necessita de afastamento de suas atividades habituais pelo período de ${dados.dias || "[N]"} (${dados.dias ? `${dados.dias} dias` : "número por extenso"} dias), a contar desta data.

${dados.observacoes ? `Observações: ${dados.observacoes}` : ""}

Data: ${dados.data ? new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR") : dataHoje}

___________________________
[Nome do Médico]
CRM: [Número]
Especialidade: Psiquiatria`;

    case "encaminhamento":
      return `RELATÓRIO DE ENCAMINHAMENTO

Encaminho o(a) paciente em questão para avaliação e acompanhamento por ${dados.para || "[Especialidade/Serviço]"}.

HIPÓTESE DIAGNÓSTICA: ${dados.hipotese || "[CID — Descrição]"}

MOTIVO DO ENCAMINHAMENTO:
${dados.motivo || "[Descrever motivo]"}

${dados.resumo ? `RESUMO CLÍNICO:\n${dados.resumo}` : ""}

URGÊNCIA: ${dados.urgencia || "Eletiva"}

Data: ${dados.data ? new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR") : dataHoje}

___________________________
[Nome do Médico]
CRM: [Número]
Especialidade: Psiquiatria`;

    case "alta":
      return `RELATÓRIO DE ALTA HOSPITALAR

PERÍODO DE INTERNAÇÃO:
Admissão: ${dados.dataInternacao ? new Date(dados.dataInternacao + "T12:00:00").toLocaleDateString("pt-BR") : "[Data]"}
Alta: ${dados.dataAlta ? new Date(dados.dataAlta + "T12:00:00").toLocaleDateString("pt-BR") : "[Data]"}

MOTIVO DE INTERNAÇÃO:
${dados.motivoInternacao || "[Descrever quadro na admissão]"}

DIAGNÓSTICO PRINCIPAL:
${dados.diagnostico || "[CID — Descrição]"}

TRATAMENTO REALIZADO:
${dados.tratamento || "[Descrever intervenções]"}

EVOLUÇÃO:
${dados.evolucao || "[Descrever evolução clínica]"}

PRESCRIÇÃO DE ALTA:
${dados.prescricaoAlta || "[Medicamentos e doses]"}

ORIENTAÇÕES E RETORNO:
${dados.orientacoes || "[Instruções de acompanhamento]"}

___________________________
[Nome do Médico]
CRM: [Número]
Especialidade: Psiquiatria`;

    case "laudo":
      return `LAUDO PSIQUIÁTRICO

FINALIDADE: ${dados.objetivo || "[Objetivo do laudo]"}

HISTÓRICO CLÍNICO:
${dados.historico || "[Descrever histórico]"}

EXAME DO ESTADO MENTAL:
${dados.exameMental || "[Descrever EEM]"}

DIAGNÓSTICO:
${dados.diagnostico || "[CID — Descrição]"}

PROGNÓSTICO:
${dados.prognostico || "[Descrever prognóstico]"}

PARECER / CONCLUSÃO:
${dados.parecer || "[Inserir parecer técnico]"}

Data: ${dados.data ? new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR") : dataHoje}

___________________________
[Nome do Médico]
CRM: [Número]
Especialidade: Psiquiatria`;

    case "comparecimento":
      return `DECLARAÇÃO DE COMPARECIMENTO

Declaro que o(a) portador(a) deste documento compareceu a consulta médica psiquiátrica${dados.local ? ` no(a) ${dados.local}` : ""} em ${dados.data ? new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR") : "[Data]"}, no horário das ${dados.horario || "[hora]"}${dados.horarioSaida ? ` às ${dados.horarioSaida}` : ""}.

${dados.observacoes ? `Observações: ${dados.observacoes}` : ""}

Data de emissão: ${dataHoje}

___________________________
[Nome do Médico]
CRM: [Número]
Especialidade: Psiquiatria`;

    default:
      return "";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RelatoriosPage() {
  const [tipoAtivo, setTipoAtivo] = useState<TipoRelatorio>("atestado");
  const [dados, setDados] = useState<Record<string, Record<string, string>>>({});
  const [copied, setCopied] = useState(false);

  const dadosAtuais = dados[tipoAtivo] || {};

  function setField(key: string, value: string) {
    setDados((prev) => ({
      ...prev,
      [tipoAtivo]: { ...(prev[tipoAtivo] || {}), [key]: value },
    }));
  }

  function resetFields() {
    setDados((prev) => ({ ...prev, [tipoAtivo]: {} }));
  }

  const texto = gerarTexto(tipoAtivo, dadosAtuais);

  async function handleCopy() {
    await navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
            >
              <FileOutput size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerador de Relatórios</h1>
              <p className="text-xs text-muted-foreground">Modelos padronizados para uso clínico</p>
            </div>
          </div>

          {/* Tipo selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {tipos.map((t) => (
              <button
                key={t.id}
                onClick={() => setTipoAtivo(t.id)}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 rounded-2xl border text-left transition-all",
                  tipoAtivo === t.id
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
                )}
              >
                <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center", t.color)}>
                  <FileOutput size={13} className="text-white" />
                </div>
                <p className={cn("text-xs font-bold leading-tight", tipoAtivo === t.id ? "text-primary" : "text-foreground")}>
                  {t.label}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
            {/* Formulário */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <span className="text-sm font-bold text-foreground">
                  {tipos.find((t) => t.id === tipoAtivo)?.label}
                </span>
                <button
                  onClick={resetFields}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw size={11} />
                  Limpar
                </button>
              </div>
              <div className="p-5 space-y-4">
                {campos[tipoAtivo].map((campo) => (
                  <div key={campo.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {campo.label}
                      {campo.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {campo.tipo === "textarea" ? (
                      <textarea
                        rows={campo.rows || 3}
                        value={dadosAtuais[campo.key] || ""}
                        onChange={(e) => setField(campo.key, e.target.value)}
                        placeholder={campo.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none"
                      />
                    ) : campo.tipo === "select" ? (
                      <select
                        value={dadosAtuais[campo.key] || ""}
                        onChange={(e) => setField(campo.key, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                      >
                        <option value="">Selecionar...</option>
                        {campo.opcoes?.map((op) => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={campo.tipo}
                        value={dadosAtuais[campo.key] || ""}
                        onChange={(e) => setField(campo.key, e.target.value)}
                        placeholder={campo.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview — sticky */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <span className="text-sm font-bold text-foreground">Pré-visualização</span>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                      copied
                        ? "bg-green-500/10 text-green-600 border border-green-500/30"
                        : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    )}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copiado!" : "Copiar texto"}
                  </button>
                </div>
                <div className="p-5 min-h-[300px]">
                  <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {texto}
                  </pre>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Revise e assine o documento antes de entregar ao paciente.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
