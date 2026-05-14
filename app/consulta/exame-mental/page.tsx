"use client";

import { useState, useCallback } from "react";
import { ClipboardCheck, Copy, Check, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Selections = Record<string, string[]>;

interface CheckOption {
  value: string;
  label: string;
}

interface Section {
  id: string;
  title: string;
  groups: {
    label: string;
    key: string;
    multi?: boolean;
    options: CheckOption[];
    freeText?: boolean;
  }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    id: "apresentacao",
    title: "Apresentação Geral",
    groups: [
      {
        label: "Aparência",
        key: "aparencia",
        multi: true,
        options: [
          { value: "bem-cuidado", label: "Bem cuidado/a" },
          { value: "descuidado", label: "Descuidado/a" },
          { value: "bizarro", label: "Bizarro/a" },
          { value: "adequado-idade", label: "Adequado/a para a idade" },
          { value: "mais-velha", label: "Aparentando mais idade" },
          { value: "mais-nova", label: "Aparentando menos idade" },
        ],
      },
      {
        label: "Psicomotricidade",
        key: "psicomotricidade",
        multi: true,
        options: [
          { value: "normal", label: "Normal" },
          { value: "agitado", label: "Agitado/a" },
          { value: "retardado", label: "Retardo psicomotor" },
          { value: "estupor", label: "Estupor" },
          { value: "acatisia", label: "Acatisia" },
          { value: "estereotipias", label: "Estereotipias" },
          { value: "maneirismos", label: "Maneirismos" },
          { value: "tremor", label: "Tremor" },
          { value: "rigidez", label: "Rigidez" },
        ],
      },
      {
        label: "Atitude",
        key: "atitude",
        multi: true,
        options: [
          { value: "colaborativo", label: "Colaborativo/a" },
          { value: "oposicionista", label: "Oposicionista" },
          { value: "desconfiado", label: "Desconfiado/a" },
          { value: "ansioso", label: "Ansioso/a" },
          { value: "dramatizante", label: "Dramatizante" },
          { value: "indiferente", label: "Indiferente" },
        ],
      },
    ],
  },
  {
    id: "fala",
    title: "Fala",
    groups: [
      {
        label: "Velocidade",
        key: "fala-velocidade",
        options: [
          { value: "normal", label: "Normal" },
          { value: "aumentada", label: "Aumentada / Logorreia" },
          { value: "diminuida", label: "Diminuída" },
          { value: "mutismo", label: "Mutismo" },
        ],
      },
      {
        label: "Fluência e produção",
        key: "fala-fluencia",
        multi: true,
        options: [
          { value: "fluente", label: "Fluente" },
          { value: "espontanea", label: "Espontânea e adequada" },
          { value: "monossilabica", label: "Monossilábica" },
          { value: "disartrica", label: "Disártrica" },
          { value: "ecolalia", label: "Ecolalia" },
          { value: "palilalia", label: "Palilalia" },
          { value: "pressao", label: "Pressão de fala" },
        ],
      },
    ],
  },
  {
    id: "humor-afeto",
    title: "Humor e Afeto",
    groups: [
      {
        label: "Humor (subjetivo — relato do paciente)",
        key: "humor",
        options: [
          { value: "eutimico", label: "Eutímico" },
          { value: "deprimido", label: "Deprimido" },
          { value: "elevado", label: "Elevado / Eufórico" },
          { value: "irritavel", label: "Irritável" },
          { value: "ansioso", label: "Ansioso" },
          { value: "disfórico", label: "Disfórico" },
          { value: "apatico", label: "Apático" },
          { value: "misto", label: "Misto" },
        ],
      },
      {
        label: "Afeto (objetivo — observação clínica)",
        key: "afeto",
        options: [
          { value: "normal", label: "Normal / Amplo" },
          { value: "restrito", label: "Restrito" },
          { value: "embotado", label: "Embotado" },
          { value: "labil", label: "Lábil" },
          { value: "expansivo", label: "Expansivo" },
          { value: "disfórico", label: "Disfórico" },
        ],
      },
      {
        label: "Congruência humor-afeto",
        key: "congruencia",
        options: [
          { value: "congruente", label: "Congruente com o pensamento" },
          { value: "incongruente", label: "Incongruente com o pensamento" },
        ],
      },
    ],
  },
  {
    id: "pensamento",
    title: "Pensamento",
    groups: [
      {
        label: "Curso",
        key: "pensamento-curso",
        multi: true,
        options: [
          { value: "normal", label: "Normal" },
          { value: "acelerado", label: "Acelerado / Fuga de ideias" },
          { value: "lentificado", label: "Lentificado" },
          { value: "bloqueio", label: "Bloqueio do pensamento" },
          { value: "prolixo", label: "Prolixo / Circunstancial" },
          { value: "tangencial", label: "Tangencial" },
          { value: "perseveracao", label: "Perseveração" },
          { value: "desagregado", label: "Desagregado / Incoerente" },
        ],
      },
      {
        label: "Conteúdo",
        key: "pensamento-conteudo",
        multi: true,
        options: [
          { value: "sem-alteracoes", label: "Sem alterações" },
          { value: "ideias-supervalorizadas", label: "Ideias supervalorizadas" },
          { value: "obsessoes", label: "Obsessões / Compulsões" },
          { value: "fobias", label: "Fobias" },
          { value: "ideacao-suicida", label: "Ideação suicida" },
          { value: "ideacao-homicida", label: "Ideação homicida" },
          { value: "delirio", label: "Delírio (ver tema abaixo)" },
          { value: "pensamento-magico", label: "Pensamento mágico" },
        ],
      },
      {
        label: "Tema do delírio (se presente)",
        key: "delirio-tema",
        multi: true,
        options: [
          { value: "persecutório", label: "Persecutório / Paranóide" },
          { value: "grandioso", label: "Grandioso" },
          { value: "religioso", label: "Religioso / Místico" },
          { value: "somatico", label: "Somático / Hipocondríaco" },
          { value: "referencia", label: "De referência" },
          { value: "ciume", label: "De ciúme / Otelo" },
          { value: "erotomaníaco", label: "Erotomaníaco / Clérambault" },
          { value: "niilista", label: "Niilista / Cotard" },
          { value: "controle", label: "De controle / Passividade" },
        ],
      },
    ],
  },
  {
    id: "percepcao",
    title: "Percepção",
    groups: [
      {
        label: "Alterações perceptivas",
        key: "percepcao",
        multi: true,
        options: [
          { value: "sem-alteracoes", label: "Sem alterações" },
          { value: "aluc-auditiva", label: "Alucinação auditiva" },
          { value: "aluc-visual", label: "Alucinação visual" },
          { value: "aluc-olfativa", label: "Alucinação olfativa" },
          { value: "aluc-gustativa", label: "Alucinação gustativa" },
          { value: "aluc-tatil", label: "Alucinação tátil / Cenestetésica" },
          { value: "ilusao", label: "Ilusão" },
          { value: "despersonalizacao", label: "Despersonalização" },
          { value: "desrealizacao", label: "Desrealização" },
          { value: "eco-pensamento", label: "Eco do pensamento" },
        ],
      },
    ],
  },
  {
    id: "cognicao",
    title: "Cognição",
    groups: [
      {
        label: "Orientação",
        key: "orientacao",
        multi: true,
        options: [
          { value: "ta-te", label: "Orientado/a no tempo e espaço" },
          { value: "desorientado-tempo", label: "Desorientado/a no tempo" },
          { value: "desorientado-espaco", label: "Desorientado/a no espaço" },
          { value: "desorientado-pessoa", label: "Desorientado/a quanto à pessoa" },
          { value: "desorientado-situacao", label: "Desorientado/a quanto à situação" },
        ],
      },
      {
        label: "Atenção e concentração",
        key: "atencao",
        options: [
          { value: "sem-alteracoes", label: "Sem alterações" },
          { value: "hipervigilante", label: "Hipervigilante" },
          { value: "hipovigilante", label: "Hipovigilante / Sonolento" },
          { value: "distraivel", label: "Distraível / Dificuldade de concentração" },
          { value: "obnubilado", label: "Obnubilado" },
        ],
      },
      {
        label: "Memória",
        key: "memoria",
        multi: true,
        options: [
          { value: "sem-alteracoes", label: "Sem alterações aparentes" },
          { value: "deficit-curto", label: "Déficit de memória de curto prazo" },
          { value: "deficit-longo", label: "Déficit de memória de longo prazo" },
          { value: "amnesia-lacunar", label: "Amnésia lacunar" },
          { value: "confabulacao", label: "Confabulação" },
          { value: "hipermnesia", label: "Hipermnésia" },
        ],
      },
      {
        label: "Inteligência estimada",
        key: "inteligencia",
        options: [
          { value: "compativel", label: "Compatível com a escolaridade" },
          { value: "acima", label: "Acima do esperado" },
          { value: "abaixo", label: "Abaixo do esperado" },
          { value: "deficiencia-intelectual", label: "Sugestivo de deficiência intelectual" },
        ],
      },
    ],
  },
  {
    id: "insight-julgamento",
    title: "Insight e Julgamento",
    groups: [
      {
        label: "Insight",
        key: "insight",
        options: [
          { value: "preservado", label: "Preservado — reconhece adoecimento e necessidade de tratamento" },
          { value: "parcial", label: "Parcialmente preservado — reconhece parcialmente" },
          { value: "ausente", label: "Ausente — nega adoecimento" },
        ],
      },
      {
        label: "Julgamento",
        key: "julgamento",
        options: [
          { value: "preservado", label: "Preservado" },
          { value: "parcial", label: "Parcialmente comprometido" },
          { value: "comprometido", label: "Comprometido" },
        ],
      },
    ],
  },
];

// ─── Text generation ──────────────────────────────────────────────────────────

function gerarTexto(sel: Selections): string {
  const get = (key: string) => (sel[key] || []);
  const join = (arr: string[], sep = ", ") => arr.join(sep);
  const hasAny = (key: string) => get(key).length > 0;

  const linhas: string[] = [];

  // Apresentação
  const aparencia = join(get("aparencia"));
  const psicomotor = join(get("psicomotricidade"));
  const atitude = join(get("atitude"));
  if (aparencia || psicomotor || atitude) {
    linhas.push(
      `Apresentação: paciente ${[aparencia, psicomotor ? `psicomotricidade ${psicomotor}` : "", atitude ? `atitude ${atitude}` : ""].filter(Boolean).join(", ")}.`
    );
  }

  // Fala
  const falavel = join(get("fala-velocidade"));
  const falafl = join(get("fala-fluencia"));
  if (falavel || falafl) {
    linhas.push(`Fala ${[falavel, falafl].filter(Boolean).join(", ")}.`);
  }

  // Humor e afeto
  const humor = join(get("humor"));
  const afeto = join(get("afeto"));
  const congruencia = join(get("congruencia"));
  if (humor || afeto) {
    linhas.push(
      `Humor ${humor || "não avaliado"}. Afeto ${afeto || "não avaliado"}${congruencia ? `, ${congruencia}` : ""}.`
    );
  }

  // Pensamento
  const curso = join(get("pensamento-curso"));
  const conteudo = join(get("pensamento-conteudo"));
  const tema = join(get("delirio-tema"));
  const pensamentoLinhas: string[] = [];
  if (curso) pensamentoLinhas.push(`curso: ${curso}`);
  if (conteudo) pensamentoLinhas.push(`conteúdo: ${conteudo}`);
  if (tema) pensamentoLinhas.push(`tema delirante: ${tema}`);
  if (pensamentoLinhas.length) linhas.push(`Pensamento com ${join(pensamentoLinhas, "; ")}.`);

  // Percepção
  const percepcao = join(get("percepcao"));
  if (percepcao) linhas.push(`Percepção: ${percepcao}.`);

  // Cognição
  const orientacao = join(get("orientacao"));
  const atencao = join(get("atencao"));
  const memoria = join(get("memoria"));
  const inteligencia = join(get("inteligencia"));
  const cogLinhas: string[] = [];
  if (orientacao) cogLinhas.push(orientacao);
  if (atencao) cogLinhas.push(`atenção/concentração: ${atencao}`);
  if (memoria) cogLinhas.push(`memória: ${memoria}`);
  if (inteligencia) cogLinhas.push(`inteligência estimada: ${inteligencia}`);
  if (cogLinhas.length) linhas.push(`Cognição: ${join(cogLinhas, "; ")}.`);

  // Insight e julgamento
  const insight = join(get("insight"));
  const julgamento = join(get("julgamento"));
  if (insight || julgamento) {
    linhas.push(`Insight ${insight || "não avaliado"}. Julgamento ${julgamento || "não avaliado"}.`);
  }

  return linhas.length ? linhas.join("\n\n") : "";
}

// ─── Components ──────────────────────────────────────────────────────────────

function CheckPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all select-none",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function SectionCard({
  section,
  selections,
  onToggle,
}: {
  section: Section;
  selections: Selections;
  onToggle: (key: string, value: string, multi: boolean) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 border-b border-border hover:bg-muted/20 transition-colors"
      >
        <span className="text-sm font-bold text-foreground">{section.title}</span>
        {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-5 space-y-5">
          {section.groups.map((group) => {
            const selected = selections[group.key] || [];
            return (
              <div key={group.key} className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {group.label}
                  {group.multi && <span className="ml-1 normal-case text-muted-foreground/60">(múltiplos)</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => (
                    <CheckPill
                      key={opt.value}
                      label={opt.label}
                      active={selected.includes(opt.value)}
                      onClick={() => onToggle(group.key, opt.value, group.multi ?? false)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExameMentalPage() {
  const [selections, setSelections] = useState<Selections>({});
  const [copied, setCopied] = useState(false);

  const toggle = useCallback((key: string, value: string, multi: boolean) => {
    setSelections((prev) => {
      const current = prev[key] || [];
      if (multi) {
        return {
          ...prev,
          [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
        };
      }
      return {
        ...prev,
        [key]: current.includes(value) ? [] : [value],
      };
    });
  }, []);

  const texto = gerarTexto(selections);
  const totalSelecionados = Object.values(selections).flat().length;

  async function handleCopy() {
    if (!texto) return;
    await navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setSelections({});
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #06B6D4, #0D9488)" }}
            >
              <ClipboardCheck size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Exame do Estado Mental</h1>
              <p className="text-xs text-muted-foreground">Clique nas opções → texto gerado automaticamente</p>
            </div>
            <div className="flex items-center gap-2">
              {totalSelecionados > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <RotateCcw size={12} />
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
            {/* Seções */}
            <div className="space-y-3">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  selections={selections}
                  onToggle={toggle}
                />
              ))}
            </div>

            {/* Preview — sticky */}
            <div className="lg:sticky lg:top-24 space-y-3">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <span className="text-sm font-bold text-foreground">Texto do Prontuário</span>
                  {texto && (
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
                      {copied ? "Copiado!" : "Copiar"}
                    </button>
                  )}
                </div>
                <div className="p-5 min-h-[200px]">
                  {texto ? (
                    <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                      {texto}
                    </pre>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center mt-8">
                      Selecione opções ao lado para gerar o texto do EEM.
                    </p>
                  )}
                </div>
              </div>

              {totalSelecionados > 0 && (
                <p className="text-[11px] text-muted-foreground text-center">
                  {totalSelecionados} item{totalSelecionados !== 1 ? "s" : ""} selecionado{totalSelecionados !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
