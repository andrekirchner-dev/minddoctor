"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Check, Copy, RotateCcw,
  ChevronDown, ChevronUp, AlertCircle, FileText, ClipboardList,
  Stethoscope, Brain, Shield, Pill, History, User, MessageSquare,
  ClipboardCheck, FileOutput, Users, AlertTriangle, BookOpen,
  Settings2, Zap, Info, Star, Search, Bookmark, Loader2,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { saveConsulta, getConsultas, type ConsultaRecord } from "@/lib/firebase/consultas";
import { saveCaso } from "@/lib/firebase/casos";
import { deriveKey, encryptField } from "@/lib/crypto";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type Sels = Record<string, string[]>;
type Fields = Record<string, string>;

interface ConsultaState {
  tipo: string;
  ident: Fields;
  qp: string[];
  qpLivre: string;
  hpmaInicio: string[];
  hpmaCurso: string[];
  hpmaSintomas: Sels;
  hpmaLivre: string;
  hpmaView: string;
  antPsi: Sels;
  antClinico: string[];
  antFamiliar: string[];
  antDetalhes: string;
  substancias: Sels;
  muc: string;
  ttoPrevio: string;
  alergias: string;
  eem: Sels;
  eemLivre: string;
  risco: Sels;
  nivelRisco: string;
  diagnosticoPrincipal: string;
  diagnosticoLivre: string;
  diferenciais: string[];
  gravidade: string;
  especificadores: string[];
  condutaFarma: string;
  condutaPsico: string[];
  condutaExames: string[];
  condutaEncam: string[];
  condutaSeguranca: string[];
  condutaRetorno: string;
  condutaObs: string;
  condutaBase: string;
  layout: string;
  prontuarioBase: string;
  prontuarioConfirmado: boolean;
  advancedModules: Record<string, boolean>;
  sintomosAlvo: string[];
  adesao: string;
  metasRetorno: string;
  raciocinioCli: string;
  prejuizoFuncional: Record<string, string>;
  capacidadeLaboral: Record<string, string>;
  realce: string;
  neurodev: Sels;
  importadoTexto: string;
  outputLevel: string;
  condutaFormat: string;
  omitirVazias: boolean;
}

const INITIAL: ConsultaState = {
  tipo: "", ident: {}, qp: [], qpLivre: "", hpmaInicio: [], hpmaCurso: [],
  hpmaSintomas: {}, hpmaLivre: "", hpmaView: "topicos", antPsi: {}, antClinico: [], antFamiliar: [],
  antDetalhes: "", substancias: {}, muc: "", ttoPrevio: "", alergias: "",
  eem: {}, eemLivre: "", risco: {}, nivelRisco: "", diagnosticoPrincipal: "",
  diagnosticoLivre: "", diferenciais: [], gravidade: "", especificadores: [],
  condutaFarma: "", condutaPsico: [], condutaExames: [], condutaEncam: [],
  condutaSeguranca: [], condutaRetorno: "", condutaObs: "", condutaBase: "",
  layout: "estruturado", prontuarioBase: "", prontuarioConfirmado: false,
  advancedModules: {}, sintomosAlvo: [], adesao: "", metasRetorno: "", raciocinioCli: "",
  prejuizoFuncional: {}, capacidadeLaboral: {},
  realce: "nao", neurodev: {}, importadoTexto: "",
  outputLevel: "simplificado", condutaFormat: "numerada", omitirVazias: false,
};

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "tipo", label: "Tipo", icon: ClipboardList },
  { id: "ident", label: "Paciente", icon: User },
  { id: "qp", label: "QP / HPMA", icon: MessageSquare },
  { id: "ant", label: "Antecedentes", icon: History },
  { id: "eem", label: "EEM", icon: Brain },
  { id: "risco-hd", label: "Risco / Diagnóstico", icon: Shield },
  { id: "conduta", label: "Conduta", icon: Stethoscope },
  { id: "prontuario", label: "Prontuário", icon: FileText },
];

// ─── Clinical Data ────────────────────────────────────────────────────────────

const TIPOS = [
  { value: "nova-consulta", label: "Nova consulta", desc: "Primeira avaliação do paciente" },
  { value: "retorno", label: "Retorno ambulatorial", desc: "Consulta de seguimento" },
  { value: "urgencia", label: "Urgência psiquiátrica", desc: "Atendimento não-programado / PS" },
  { value: "enfermaria", label: "Evolução de enfermaria", desc: "Registro diário de internação" },
  { value: "hospital-dia", label: "Hospital Dia", desc: "Acompanhamento em HD" },
  { value: "inss", label: "Avaliação INSS / Perícia", desc: "Relatório previdenciário" },
  { value: "avaliacao-risco", label: "Avaliação de risco", desc: "Foco em risco suicida / heteroagressivo" },
  { value: "ajuste-med", label: "Ajuste medicamentoso", desc: "Revisão farmacológica" },
];

const QP_CHIPS = [
  "Tristeza / humor deprimido", "Ansiedade / preocupação excessiva", "Insônia",
  "Irritabilidade", "Crises de pânico", "Desatenção / dificuldade de concentração",
  "Alucinações", "Delírios / ideias persecutórias", "Uso de substâncias",
  "Oscilação de humor", "Agitação / agressividade", "Ideação suicida",
  "Prejuízo funcional", "Solicitação de relatório / atestado", "Efeitos colaterais",
  "Sintomas obsessivos / compulsivos", "Queixas cognitivas / memória",
];

const HPMA_INICIO = [
  "Início agudo (dias)", "Início subagudo (semanas)", "Início insidioso (meses/anos)",
  "Primeiro episódio", "Recaída / novo episódio", "Piora de quadro crônico",
  "Quadro episódico / recorrente",
];

const HPMA_CURSO = [
  "Progressivo", "Flutuante", "Remitente-recorrente", "Persistente / crônico",
  "Associado a gatilho identificável", "Sem gatilho identificável",
];

const HPMA_DOMINIOS = [
  { id: "afetivos", label: "Sintomas afetivos", opcoes: ["Humor deprimido", "Anedonia", "Choro fácil", "Desesperança", "Culpa excessiva", "Menos-valia", "Irritabilidade", "Labilidade emocional", "Euforia / expansividade", "Grandiosidade", "Apatia"] },
  { id: "sono", label: "Sono", opcoes: ["Insônia inicial", "Insônia intermediária", "Despertar precoce", "Hipersonia", "Redução da necessidade de sono", "Sono não reparador", "Inversão do ciclo sono-vigília"] },
  { id: "apetite", label: "Apetite / peso", opcoes: ["Hiporexia", "Hiperfagia", "Perda ponderal", "Ganho ponderal"] },
  { id: "ansiedade", label: "Ansiedade", opcoes: ["Preocupação excessiva", "Crises de pânico", "Sintomas autonômicos", "Evitação", "Fobia social", "Agorafobia", "Tensão muscular", "Ruminação"] },
  { id: "psicose", label: "Sintomas psicóticos", opcoes: ["Alucinações auditivas", "Alucinações visuais", "Delírios persecutórios", "Delírios de referência", "Delírios místicos", "Delírios grandiosos", "Delírios de culpa", "Delírios de ruína", "Desorganização do pensamento", "Comportamento bizarro"] },
  { id: "mania", label: "Mania / hipomania", opcoes: ["Aumento de energia", "Redução da necessidade de sono", "Taquipsiquismo", "Pressão de fala", "Impulsividade", "Gastos excessivos", "Hipersexualidade", "Comportamento de risco", "Grandiosidade"] },
  { id: "ocd", label: "Obsessões / compulsões", opcoes: ["Pensamentos intrusivos", "Rituais de checagem", "Rituais de limpeza", "Simetria / ordenação", "Compulsões mentais", "Evitação obsessiva", "Sofrimento egodistônico"] },
  { id: "tdah", label: "Atenção / funções executivas", opcoes: ["Desatenção", "Desorganização", "Procrastinação", "Impulsividade", "Inquietação / hiperatividade", "Dificuldade de planejamento", "Prejuízo acadêmico / laboral"] },
  { id: "funcionalidade", label: "Funcionalidade", opcoes: ["Prejuízo laboral", "Prejuízo acadêmico", "Prejuízo social", "Prejuízo familiar", "Prejuízo no autocuidado", "Afastamento do trabalho", "Isolamento social"] },
];

const ANT_PSI_DIAGS = [
  "Transtorno depressivo", "Transtorno afetivo bipolar", "Esquizofrenia", "Transtorno esquizoafetivo",
  "Transtorno de ansiedade", "Transtorno do pânico", "TOC", "TEPT", "TDAH", "TEA",
  "Transtorno alimentar", "Dependência química", "Transtorno de personalidade",
  "Transtorno neurocognitivo / demência", "Transtorno do sono",
];

const ANT_CLINICOS = [
  "HAS", "DM tipo 2", "Dislipidemia", "Obesidade", "Epilepsia", "TCE prévio",
  "Hipotireoidismo", "Hipertireoidismo", "Cardiopatia", "Hepatopatia", "Nefropatia",
  "Gestação atual", "Puerpério recente", "HIV/AIDS", "Neoplasia",
];

const ANT_FAMILIARES = [
  "Depressão", "Transtorno bipolar", "Esquizofrenia / psicose", "Suicídio consumado",
  "Tentativa de suicídio", "Dependência química", "Transtorno de ansiedade",
  "TDAH", "Demência", "Internação psiquiátrica", "Transtorno de personalidade",
];

const SUBSTANCIAS = [
  { id: "alcool", label: "Álcool" }, { id: "tabaco", label: "Tabaco" },
  { id: "cannabis", label: "Cannabis" }, { id: "cocaina", label: "Cocaína" },
  { id: "crack", label: "Crack" }, { id: "anfetaminas", label: "Anfetaminas" },
  { id: "bzd", label: "Benzodiazepínicos (abuso)" }, { id: "opioides", label: "Opioides" },
  { id: "alucinogenos", label: "Alucinógenos" },
];

const NEURODEV_DOMINIOS = [
  { id: "marco-temporal", label: "A. Marco temporal / início", opcoes: ["Desde a infância", "Início percebido na adolescência", "Início percebido na vida adulta", "Dificuldades persistentes ao longo do desenvolvimento", "Diagnóstico recente por avaliação neuropsicológica", "Sintomas retrospectivos compatíveis desde a infância"] },
  { id: "tea-comunicacao", label: "B. TEA — Comunicação e interação social", opcoes: ["Dificuldade qualitativa na interação social", "Contato visual reduzido/evasivo", "Dificuldade de reciprocidade socioemocional", "Dificuldade em iniciar/manter conversas", "Dificuldade de compreender pistas sociais", "Interação social percebida como forçada ou ensaiada", "Esgotamento após interação social", "Dificuldade em manter amizades/relações", "Mascaramento social/camuflagem", "Preferência por isolamento", "Dificuldade de adaptação a contextos sociais"] },
  { id: "tea-padroes", label: "C. TEA — Padrões restritos/repetitivos", opcoes: ["Comportamentos estereotipados", "Maneirismos", "Rituais", "Rigidez comportamental", "Resistência a mudanças", "Necessidade de rotina/previsibilidade", "Interesses restritos/intensos", "Hiperfoco", "Dificuldade com transições", "Comportamentos repetitivos"] },
  { id: "tea-sensorial", label: "D. TEA — Sensibilidade sensorial", opcoes: ["Hipersensibilidade auditiva", "Hipersensibilidade visual", "Hipersensibilidade tátil", "Hipersensibilidade olfativa", "Seletividade alimentar", "Sobrecarga sensorial", "Irritabilidade em ambientes ruidosos", "Necessidade de isolamento após estímulos", "Crises associadas a estímulos sensoriais"] },
  { id: "tdah-atencao", label: "E. TDAH — Atenção e funções executivas", opcoes: ["Desatenção", "Dificuldade de concentração", "Procrastinação", "Desorganização", "Esquecimentos frequentes", "Perda de objetos", "Dificuldade de finalizar tarefas", "Dificuldade de planejamento", "Dificuldade de priorização", "Baixa tolerância a tarefas longas", "Oscilação de desempenho", "Hiperfoco em temas específicos"] },
  { id: "tdah-hiperatividade", label: "F. TDAH — Hiperatividade/impulsividade", opcoes: ["Inquietação interna", "Hiperatividade motora", "Fala excessiva", "Interrupções frequentes", "Impulsividade", "Decisões precipitadas", "Dificuldade de esperar", "Irritabilidade por frustração", "Agitação mental", "Sensação de mente acelerada"] },
  { id: "di-funcional", label: "G. Deficiência intelectual / funcionamento adaptativo", opcoes: ["Atraso no desenvolvimento neuropsicomotor", "Atraso de linguagem", "Dificuldades escolares importantes", "Baixa autonomia", "Dificuldade em atividades instrumentais", "Dificuldade no manejo financeiro", "Necessidade de supervisão", "Prejuízo adaptativo persistente", "Necessidade de avaliação neuropsicológica"] },
  { id: "historia-escolar", label: "H. História escolar e desenvolvimento", opcoes: ["Dificuldade de aprendizagem", "Repetência", "Baixo rendimento escolar", "Bullying", "Isolamento social na infância", "Dificuldade de socialização", "Queixas comportamentais escolares", "Hiperatividade na infância", "Desatenção desde a infância", "Rigidez desde a infância", "Seletividade alimentar na infância"] },
  { id: "avaliacoes-previas", label: "I. Avaliações prévias", opcoes: ["Avaliação neuropsicológica realizada", "Diagnóstico prévio de TEA", "Diagnóstico prévio de TDAH", "Diagnóstico prévio de deficiência intelectual", "Laudo escolar/neuropsicológico anexado", "Sem avaliação prévia", "Necessita avaliação neuropsicológica complementar"] },
  { id: "impacto-funcional", label: "J. Impacto funcional atual", opcoes: ["Prejuízo social", "Prejuízo laboral", "Prejuízo acadêmico", "Prejuízo em autonomia", "Prejuízo em relacionamentos", "Esgotamento por demandas sociais", "Crises por sobrecarga sensorial", "Dificuldade de adaptação ocupacional", "Necessidade de suporte/acomodação"] },
];

const EEM_DOMINIOS = [
  { id: "aparencia", label: "Aparência geral", normal: "Bom estado geral, higiene preservada, vestes adequadas ao contexto, aparência compatível com a idade.", opcoes: ["Higiene prejudicada", "Descuido pessoal", "Aparência emagrecida", "Vestes inadequadas", "Vestes extravagantes", "Odor etílico", "Sinais de intoxicação", "Aparência bizarra", "Sinais de automutilação"] },
  { id: "atitude", label: "Atitude", normal: "Atitude colaborativa, contato interpessoal adequado e boa responsividade à entrevista.", opcoes: ["Hostil", "Desconfiado/a", "Evasivo/a", "Pueril", "Negativista", "Hipervigilante", "Pouco colaborativo/a", "Desinibido/a"] },
  { id: "consciencia", label: "Consciência", normal: "Vigil, lúcido/a e responsivo/a ao ambiente.", opcoes: ["Sonolento/a", "Torpor", "Obnubilação", "Confusão mental", "Delirium (suspeita)", "Rebaixamento do nível de consciência"] },
  { id: "orientacao", label: "Orientação", normal: "Orientado/a globalmente em tempo, espaço, pessoa e situação.", opcoes: ["Desorientação temporal", "Desorientação espacial", "Desorientação autopsíquica", "Desorientação alopsíquica"] },
  { id: "atencao", label: "Atenção", normal: "Atenção espontânea e voluntária preservadas durante a entrevista.", opcoes: ["Hipoprosexia", "Distraibilidade", "Dificuldade de concentração", "Fatigabilidade atencional", "Atenção flutuante"] },
  { id: "memoria", label: "Memória", normal: "Memória imediata, recente e remota aparentemente preservadas à entrevista.", opcoes: ["Hipomnésia", "Amnésia anterógrada", "Amnésia retrógrada", "Confabulação", "Queixa subjetiva de memória"] },
  { id: "sensopercepcao", label: "Sensopercepção", normal: "Nega alterações sensoperceptivas no momento da avaliação.", opcoes: ["Alucinações auditivas", "Alucinações visuais", "Alucinações táteis", "Alucinações olfativas", "Pseudoalucinações", "Ilusões", "Despersonalização", "Desrealização"] },
  { id: "pens-curso", label: "Pensamento — Curso", normal: "Curso do pensamento organizado, com encadeamento lógico preservado.", opcoes: ["Taquipsiquismo", "Fuga de ideias", "Bradipsiquismo", "Bloqueio", "Perseveração", "Circunstancialidade", "Tangencialidade", "Afrouxamento associativo", "Incoerência"] },
  { id: "pens-conteudo", label: "Pensamento — Conteúdo", normal: "Não foram evidenciadas ideias delirantes, obsessivas ou supervalorizadas durante a entrevista.", opcoes: ["Delírio persecutório", "Delírio de referência", "Delírio místico", "Delírio grandioso", "Delírio de culpa", "Delírio de ruína", "Ideias obsessivas", "Ideias fóbicas", "Ruminações depressivas", "Ideação suicida", "Ideação heteroagressiva"] },
  { id: "linguagem", label: "Linguagem", normal: "Linguagem espontânea, fluente, coerente e adequada ao contexto.", opcoes: ["Mutismo", "Hipofonia", "Fala pressionada", "Logorreia", "Ecolalia", "Neologismos", "Pobreza de discurso", "Discurso desorganizado"] },
  { id: "humor", label: "Humor", normal: "Humor eutímico no momento da avaliação.", opcoes: ["Deprimido", "Ansioso", "Irritável", "Eufórico", "Expansivo", "Disfórico", "Lábil", "Angustiado", "Apático"] },
  { id: "afeto", label: "Afeto", normal: "Afeto congruente ao conteúdo, com amplitude e modulação preservadas.", opcoes: ["Embotado", "Hipomodulado", "Hiperexpansivo", "Lábil", "Incongruente", "Restrito", "Inadequado"] },
  { id: "psicomotricidade", label: "Psicomotricidade", normal: "Psicomotricidade preservada, sem agitação ou lentificação evidente.", opcoes: ["Agitação psicomotora", "Lentificação psicomotora", "Inquietação", "Acatisia", "Maneirismos", "Estereotipias", "Catatonia", "Tremores", "Discinesias"] },
  { id: "vontade", label: "Vontade / pragmatismo", normal: "Vontade, pragmatismo e autocuidado preservados.", opcoes: ["Hipobulia", "Abulia", "Avolição", "Apragmatismo", "Prejuízo do autocuidado", "Isolamento", "Dependência funcional"] },
  { id: "insight", label: "Juízo crítico / insight", normal: "Juízo crítico preservado e insight adequado em relação ao quadro atual.", opcoes: ["Crítica parcial", "Crítica ausente", "Insight prejudicado", "Negação de morbidade", "Minimização de sintomas", "Baixa adesão ao tratamento"] },
];

const RISCO_SUICIDA = [
  "Nega ideação suicida", "Pensamentos de morte passivos", "Ideação suicida passiva (sem plano)",
  "Ideação suicida com plano", "Intenção de agir", "Meios letais disponíveis",
  "Tentativa de suicídio recente (< 3 meses)", "Tentativa de suicídio prévia",
  "Automutilação", "Desesperança intensa", "Impulsividade importante", "Uso de substâncias associado",
];

const RISCO_HETERO = [
  "Nega ideação heteroagressiva", "Irritabilidade com risco de agressão",
  "Ameaças verbais", "Agressão física recente", "Acesso a armas",
  "Persecutoriedade intensa", "Comportamento intimidador", "Baixa crítica associada",
];

const FATORES_PROTETORES = [
  "Vínculo familiar preservado", "Suporte social presente",
  "Busca voluntária por atendimento", "Supervisão domiciliar possível",
  "Projetos futuros / motivos para viver", "Crença religiosa / espiritual",
  "Ausência de plano estruturado", "Boa adesão prévia ao tratamento",
];

const CIDS = [
  { code: "F20.0", desc: "Esquizofrenia paranoide" },
  { code: "F25.0", desc: "Transtorno esquizoafetivo — tipo maníaco" },
  { code: "F25.1", desc: "Transtorno esquizoafetivo — tipo depressivo" },
  { code: "F31.0", desc: "TAB — episódio hipomaníaco" },
  { code: "F31.1", desc: "TAB — episódio maníaco sem sintomas psicóticos" },
  { code: "F31.2", desc: "TAB — episódio maníaco com sintomas psicóticos" },
  { code: "F31.3", desc: "TAB — episódio depressivo leve ou moderado" },
  { code: "F31.4", desc: "TAB — episódio depressivo grave sem sintomas psicóticos" },
  { code: "F31.5", desc: "TAB — episódio depressivo grave com sintomas psicóticos" },
  { code: "F32.0", desc: "Episódio depressivo leve" },
  { code: "F32.1", desc: "Episódio depressivo moderado" },
  { code: "F32.2", desc: "Episódio depressivo grave sem sintomas psicóticos" },
  { code: "F32.3", desc: "Episódio depressivo grave com sintomas psicóticos" },
  { code: "F33.0", desc: "TDR — episódio atual leve" },
  { code: "F33.1", desc: "TDR — episódio atual moderado" },
  { code: "F33.2", desc: "TDR — episódio atual grave sem sintomas psicóticos" },
  { code: "F33.3", desc: "TDR — episódio atual grave com sintomas psicóticos" },
  { code: "F40.1", desc: "Fobia social" },
  { code: "F41.0", desc: "Transtorno de pânico" },
  { code: "F41.1", desc: "Transtorno de ansiedade generalizada" },
  { code: "F41.2", desc: "Transtorno misto ansioso e depressivo" },
  { code: "F42", desc: "Transtorno obsessivo-compulsivo" },
  { code: "F43.1", desc: "Transtorno de estresse pós-traumático" },
  { code: "F43.2", desc: "Transtorno de ajustamento" },
  { code: "F60.3", desc: "Transtorno de personalidade emocionalmente instável (borderline)" },
  { code: "F84.0", desc: "Transtorno do espectro autista" },
  { code: "F90.0", desc: "TDAH — distúrbio de atividade e atenção" },
  { code: "F10.2", desc: "Síndrome de dependência de álcool" },
  { code: "F12.2", desc: "Síndrome de dependência de cannabis" },
  { code: "F14.2", desc: "Síndrome de dependência de cocaína" },
];

const GRAVIDADES = [
  "Leve", "Moderado", "Grave", "Grave com sintomas psicóticos",
  "Com risco suicida", "Com prejuízo funcional importante",
  "Em remissão parcial", "Em remissão completa",
];

const ESPECIFICADORES = [
  "Com sintomas ansiosos", "Com características mistas", "Com catatonia",
  "Com sintomas psicóticos congruentes com humor",
  "Com sintomas psicóticos incongruentes com humor",
  "Com início no periparto", "Padrão sazonal", "Sem remissão completa entre episódios",
];

const CONDUTA_PSICO = [
  "TCC", "DBT", "Terapia focada em trauma (EMDR)", "Psicoterapia interpessoal",
  "Terapia familiar / sistêmica", "Entrevista motivacional",
  "Psicoeducação individual", "Psicoeducação familiar",
];

const CONDUTA_EXAMES = [
  "Hemograma completo", "Glicemia de jejum", "HbA1c", "Perfil lipídico",
  "Função renal (creatinina, ureia)", "Função hepática (TGO, TGP, GGT)",
  "TSH e T4 livre", "Eletrólitos", "Vitamina B12", "Vitamina D",
  "Beta-HCG", "ECG", "Toxicológico urinário", "Prolactina",
  "Litemia", "Valproatemia", "Neuroimagem (TC/RM de crânio)",
];

const CONDUTA_ENCAM = [
  "Psicoterapia", "Avaliação neuropsicológica", "Neurologia",
  "CAPS", "Hospital Dia", "Internação psiquiátrica", "Serviço social",
  "Terapia ocupacional", "Endocrinologia", "Clínica médica", "Avaliação de risco (PS)",
];

const CONDUTA_SEGURANCA = [
  "Orientação familiar sobre supervisão", "Restrição de meios letais",
  "Plano de crise elaborado", "Retorno precoce agendado",
  "Orientação de PS em caso de piora", "Contato de emergência registrado",
  "Internação voluntária discutida", "Internação involuntária considerada",
];

// ─── Advanced Modules ─────────────────────────────────────────────────────────

interface ModuloAvancado {
  id: string;
  categoria: string;
  nome: string;
  desc: string;
  tag?: "novo" | "beta";
}

const MODULOS_AVANCADOS: ModuloAvancado[] = [
  // Resumo e Alertas
  { id: "resumo-inteligente", categoria: "Resumo e Alertas", nome: "Resumo Clínico Inteligente", desc: "Caixa de resumo com síndrome predominante, CID, risco e conduta principal — útil para revisão rápida antes do prontuário" },
  { id: "sinais-alerta", categoria: "Resumo e Alertas", nome: "Módulo de Sinais de Alerta", desc: "Lista automática de alertas clínicos derivados dos dados preenchidos (risco, psicose, funcionalidade)" },
  { id: "checklist-seguranca", categoria: "Resumo e Alertas", nome: "Checklist de Segurança", desc: "Revisão de itens essenciais antes de confirmar o prontuário: risco, substâncias, mania, conduta de segurança" },
  { id: "red-flags", categoria: "Resumo e Alertas", nome: "Red Flags Orgânicas", desc: "Alertas para causas secundárias: início tardio, alteração súbita, alucinações visuais, sintomas neurológicos" },
  { id: "qualidade-prontuario", categoria: "Resumo e Alertas", nome: "Qualidade do Prontuário", desc: "Score de completude com sugestões antes de confirmar: identifica seções vazias ou insuficientes" },
  { id: "perguntas-faltam", categoria: "Resumo e Alertas", nome: "Perguntas que Faltam", desc: "Checklist dinâmico de itens não investigados baseado no CID selecionado" },
  { id: "nivel-cuidado", categoria: "Resumo e Alertas", nome: "Nível de Cuidado Recomendado", desc: "Sugere ambulatorial, retorno precoce, CAPS, Hospital Dia ou internação com base em risco e funcionalidade" },

  // Avaliação Funcional e Laboral
  { id: "prejuizo-funcional", categoria: "Avaliação Funcional e Laboral", nome: "Prejuízo Funcional Detalhado", desc: "Avaliação por áreas: trabalho, autocuidado, sono, relações familiares, relações sociais, alimentação, adesão" },
  { id: "capacidade-laboral", categoria: "Avaliação Funcional e Laboral", nome: "Módulo de Capacidade Laboral", desc: "Avaliação estruturada de aptidão para o trabalho, principais exigências, limitações e recomendação — útil para relatórios INSS" },
  { id: "linha-tempo", categoria: "Avaliação Funcional e Laboral", nome: "Linha do Tempo do Episódio", desc: "Estrutura cronológica: início dos sintomas, gatilho, piora, tratamentos, eventos de risco, resposta, consulta atual" },

  // Diagnóstico e Raciocínio
  { id: "diagnostico-diferencial-guiado", categoria: "Diagnóstico e Raciocínio", nome: "Diagnóstico Diferencial Guiado", desc: "Diferenciais obrigatórios e opcionais por CID: investigado/provável/possível/necessita investigação" },
  { id: "raciocinio-clinico", categoria: "Diagnóstico e Raciocínio", nome: "Raciocínio Clínico Documentado", desc: "Justificativa clínica da hipótese diagnóstica registrada no prontuário — robustez em discussão e supervisão" },
  { id: "modo-residente", categoria: "Diagnóstico e Raciocínio", nome: "Modo Residente / Didático", desc: "Explicações educativas sobre diagnóstico e farmacoterapia — útil para supervisão e formação em serviço", tag: "beta" },

  // Conduta Avançada
  { id: "sintomas-alvo", categoria: "Conduta Avançada", nome: "Sintomas-Alvo para Monitoramento", desc: "Define quais sintomas serão acompanhados no retorno com avaliação comparativa automática" },
  { id: "evolucao-comparativa", categoria: "Conduta Avançada", nome: "Evolução Comparativa Automática", desc: "Compara automaticamente com a consulta anterior ao gerar o prontuário de retorno" },
  { id: "efeitos-adversos-med", categoria: "Conduta Avançada", nome: "Efeitos Adversos por Medicação", desc: "Checklist de efeitos adversos esperados baseado nos fármacos registrados na conduta" },
  { id: "monitoracao-laboratorial", categoria: "Conduta Avançada", nome: "Monitorização Laboratorial Guiada", desc: "Sugere exames obrigatórios conforme fármacos prescritos: lítio, valproato, clozapina, antipsicóticos" },
  { id: "plano-seguranca-avancado", categoria: "Conduta Avançada", nome: "Plano de Segurança em 3 Versões", desc: "Versões separadas para paciente (linguagem simples), familiar (supervisão e meios) e médico (documental)" },
  { id: "orientacoes-pos-consulta", categoria: "Conduta Avançada", nome: "Orientações Pós-Consulta por Diagnóstico", desc: "Gera orientações específicas ao CID: o que é, sinais de alerta, quando procurar emergência, papel da família" },
  { id: "encaminhamento-inteligente", categoria: "Conduta Avançada", nome: "Encaminhamento Inteligente", desc: "Sugere documentos e encaminhamentos com base em risco, diagnóstico e funcionalidade" },
  { id: "integracao-farmacologia", categoria: "Conduta Avançada", nome: "Integração com Psicofarmacologia", desc: "Link direto para o módulo do fármaco prescrito na Biblioteca de Psicofarmacologia" },
  { id: "adesao", categoria: "Conduta Avançada", nome: "Módulo de Adesão ao Tratamento", desc: "Registra padrão de adesão atual: aderente, parcial, interrompeu, esquece, familiar supervisiona" },
  { id: "metas-retorno", categoria: "Conduta Avançada", nome: "Metas até o Próximo Retorno", desc: "Define objetivos específicos para o paciente até a próxima consulta — sono, medicação, atividades, exames" },

  // Documentação e Qualidade
  { id: "supervisao-preceptoria", categoria: "Documentação e Qualidade", nome: "Supervisão / Preceptoria", desc: "Exporta caso anonimizado com perguntas geradas para discussão clínica e supervisão" },
  { id: "anonimizacao", categoria: "Documentação e Qualidade", nome: "Anonimização Automática", desc: "Gera versão sem dados identificadores (nome, CPF, endereço) para ensino e discussão" },
  { id: "consentimentos", categoria: "Documentação e Qualidade", nome: "Módulo de Consentimentos", desc: "Registro de consentimentos: armazenamento de dados, CID no documento, teleatendimento — LGPD" },
  { id: "sem-cid-documento", categoria: "Documentação e Qualidade", nome: "Controle de CID por Documento", desc: "Define por documento se o CID deve ou não ser incluído — essencial para atestados trabalhistas" },
  { id: "documento-sensivel", categoria: "Documentação e Qualidade", nome: "Alerta de Documento Sensível", desc: "Aviso antes de gerar relatório com dados sensíveis de saúde mental — revisão e autorização do paciente" },
  { id: "biblioteca-frases", categoria: "Documentação e Qualidade", nome: "Biblioteca de Frases Editáveis", desc: "Frases semiológicas padronizadas para EEM, avaliação de risco e conduta — editáveis e reutilizáveis" },
  { id: "templates-cenario", categoria: "Documentação e Qualidade", nome: "Templates por Cenário Clínico", desc: "Modelos pré-preenchidos por diagnóstico: depressão, TAB, psicose, pânico, TDAH, internação, urgência" },
];

const CATEGORIAS_MODULOS = Array.from(new Set(MODULOS_AVANCADOS.map(m => m.categoria)));

const ADESAO_OPCOES = [
  "Aderente", "Parcialmente aderente", "Esquece doses com frequência",
  "Interrompeu por conta própria", "Interrompeu por efeitos adversos",
  "Uso irregular", "Familiar supervisiona medicação", "Baixa crítica prejudica adesão",
];

const SINTOMAS_ALVO_OPCOES = [
  "Humor deprimido", "Anedonia", "Ansiedade", "Insônia", "Apetite / peso",
  "Ideação suicida", "Sintomas psicóticos", "Energia / fadiga",
  "Concentração / cognição", "Autocuidado", "Funcionalidade laboral",
  "Funcionalidade social", "Adesão medicamentosa",
];

const PREJUIZO_AREAS = [
  "Trabalho / atividade produtiva", "Estudos / vida acadêmica",
  "Autocuidado", "Relações familiares", "Relações sociais",
  "Sono", "Alimentação", "Atividades instrumentais (casa, finanças)",
  "Risco pessoal", "Adesão ao tratamento",
];

const NIVEL_PREJUIZO = ["Sem prejuízo relevante", "Leve", "Moderado", "Grave", "Incapacitante"];

const MODO_RESIDENTE_DICAS: Record<string, { resumo: string; criterios: string; dicas: string[] }> = {
  "F32": { resumo: "Episódio Depressivo", criterios: "≥5/9 sintomas DSM-5-TR por ≥2 semanas (pelo menos humor deprimido ou anedonia)", dicas: ["Afastar hipotireoidismo (TSH) antes de iniciar antidepressivo", "Item 9 do PHQ-9 (ideação) — avaliar independente do score", "Antidepressivo leva 2-4 semanas para início de ação"] },
  "F33": { resumo: "Transtorno Depressivo Recorrente", criterios: "≥2 episódios depressivos maiores sem história de mania", dicas: ["Manter antidepressivo por ≥6 meses após remissão (1º episódio)", "≥3 episódios ou recidiva precoce → manutenção longa prazo", "Rastrear bipolaridade: início precoce, história familiar, episódios breves"] },
  "F31": { resumo: "Transtorno Afetivo Bipolar", criterios: "TB I: ≥1 episódio maníaco completo. TB II: hipomania + depressão (sem mania)", dicas: ["Antidepressivo em monoterapia → risco de virada maníaca", "1ª linha depressão bipolar: quetiapina, lamotrigina, lurasidona", "Monitorar litemia (0,6-1,2 mEq/L) e função renal/TSH"] },
  "F20": { resumo: "Esquizofrenia", criterios: "≥2 sintomas critério A por ≥1 mês, disfunção social, duração total ≥6 meses", dicas: ["2 falhas a antipsicóticos em dose adequada → indicação de clozapina", "Monitorar síndrome metabólica (peso, glicemia, lipídeos)", "LAIs melhoram adesão e reduzem recaídas em 50%"] },
  "F41": { resumo: "Transtorno de Ansiedade", criterios: "TAG: preocupação excessiva ≥6 meses + 3/6 sintomas físicos", dicas: ["1ª linha: ISRS/IRSN + TCC (eficácia equivalente)", "Evitar BZDs como tratamento crônico (dependência, prejuízo cognitivo)", "Prazo de resposta ao ISRS: 4-8 semanas para ansiedade"] },
  "F40": { resumo: "Transtorno Fóbico", criterios: "Fobia Social: medo de avaliação social ≥6 meses com evitação", dicas: ["1ª linha: TCC com Exposição + ISRS (sertralina, escitalopram)", "Fobia de desempenho isolada: propranolol pode auxiliar", "BZD pré-performance: risco de dependência e evitação mantida"] },
  "F42": { resumo: "TOC", criterios: "Obsessões/compulsões >1h/dia ou com prejuízo/sofrimento. Especificar insight", dicas: ["1ª linha: ISRS em dose ALTA + TCC com EPR (Exposição e Prevenção de Resposta)", "ISRSs para TOC exigem doses maiores que para depressão", "Augmentação com antipsicótico atípico se refratário"] },
  "F43": { resumo: "Reações a Estresse", criterios: "TEPT: sintomas TEARS por >1 mês após trauma. Estresse Agudo: 3 dias-1 mês", dicas: ["1ª linha TEPT: Sertralina/Paroxetina + TPC ou Exposição Prolongada", "Evitar BZD no TEPT (prejudica extinção do condicionamento de medo)", "EMDR tem eficácia equivalente às psicoterapias baseadas em exposição"] },
  "F10": { resumo: "Transtorno por Uso de Álcool", criterios: "≥2/11 critérios DSM-5-TR em 12 meses. DT: 48-72h após última dose", dicas: ["Tiamina 500mg EV ANTES de qualquer glicose (previne Wernicke)", "Naltrexona reduz craving (COMBINE trial); acamprosato: manutenção de abstinência", "DT: BZD titulado por CIWA-Ar + suporte hidroeletrolítico"] },
  "F60.3": { resumo: "Transtorno de Personalidade Borderline", criterios: "5/9 critérios (PRAISE): instabilidade afetiva, relacional, de identidade, impulsividade, automutilação", dicas: ["DBT é o tratamento de 1ª linha (4 módulos: mindfulness, regulação emocional, tolerância ao mal-estar, habilidades interpessoais)", "Farmacoterapia: trata comorbidades (depressão, psicose), não o TPB em si", "Evitar BZD de longa duração (risco de acting out)"] },
};

const CAPACIDADE_LABORAL_ATIVIDADES = [
  "Atividade de escritório / administrativo", "Trabalho manual / operacional",
  "Trabalho com público / atendimento", "Trabalho em altura / máquinas perigosas",
  "Trabalho noturno / turnos", "Atividade autônoma", "Atividade intelectual intensa",
  "Trabalho de supervisão / gestão",
];

const CAPACIDADE_LABORAL_LIMITACOES = [
  "Dificuldade de concentração", "Fadiga fácil", "Insônia com prejuízo diurno",
  "Ansiedade em ambiente de trabalho", "Dificuldade de interação social",
  "Irritabilidade / instabilidade emocional", "Lentificação psicomotora",
  "Dependência de supervisão constante", "Risco de descompensação sob pressão",
  "Uso de psicofármacos sedativos", "Incapacidade de tomar decisões",
];

const FARMACOS_LINKS: { nome: string; slug: string }[] = [
  { nome: "sertralina", slug: "sertralina" },
  { nome: "fluoxetina", slug: "fluoxetina" },
  { nome: "escitalopram", slug: "escitalopram" },
  { nome: "citalopram", slug: "citalopram" },
  { nome: "paroxetina", slug: "paroxetina" },
  { nome: "fluvoxamina", slug: "fluvoxamina" },
  { nome: "venlafaxina", slug: "venlafaxina" },
  { nome: "duloxetina", slug: "duloxetina" },
  { nome: "desvenlafaxina", slug: "desvenlafaxina" },
  { nome: "mirtazapina", slug: "mirtazapina" },
  { nome: "bupropiona", slug: "bupropiona" },
  { nome: "amitriptilina", slug: "amitriptilina" },
  { nome: "clomipramina", slug: "clomipramina" },
  { nome: "nortriptilina", slug: "nortriptilina" },
  { nome: "lítio", slug: "litio" },
  { nome: "lítio carbonato", slug: "litio" },
  { nome: "valproato", slug: "valproato" },
  { nome: "ácido valpróico", slug: "valproato" },
  { nome: "carbamazepina", slug: "carbamazepina" },
  { nome: "lamotrigina", slug: "lamotrigina" },
  { nome: "quetiapina", slug: "quetiapina" },
  { nome: "risperidona", slug: "risperidona" },
  { nome: "olanzapina", slug: "olanzapina" },
  { nome: "aripiprazol", slug: "aripiprazol" },
  { nome: "clozapina", slug: "clozapina" },
  { nome: "haloperidol", slug: "haloperidol" },
  { nome: "paliperidona", slug: "paliperidona" },
  { nome: "ziprasidona", slug: "ziprasidona" },
  { nome: "lurasidona", slug: "lurasidona" },
  { nome: "asenapina", slug: "asenapina" },
  { nome: "diazepam", slug: "diazepam" },
  { nome: "clonazepam", slug: "clonazepam" },
  { nome: "alprazolam", slug: "alprazolam" },
  { nome: "lorazepam", slug: "lorazepam" },
  { nome: "midazolam", slug: "midazolam" },
  { nome: "zolpidem", slug: "zolpidem" },
  { nome: "melatonina", slug: "melatonina" },
  { nome: "naltrexona", slug: "naltrexona" },
  { nome: "buprenorfina", slug: "buprenorfina" },
  { nome: "metadona", slug: "metadona" },
  { nome: "metilfenidato", slug: "metilfenidato" },
  { nome: "anfetamina", slug: "anfetamina" },
  { nome: "atomoxetina", slug: "atomoxetina" },
];

// ─── AdvancedConfigPanel — defined outside page to satisfy rerender-no-inline-components ─

interface AdvancedConfigPanelProps {
  open: boolean;
  onToggle: () => void;
  modules: Record<string, boolean>;
  onToggleModule: (id: string) => void;
}

function AdvancedConfigPanel({ open, onToggle, modules, onToggleModule }: AdvancedConfigPanelProps) {
  const total = MODULOS_AVANCADOS.length;
  const ativos = Object.values(modules).filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/10 border border-violet-500/20 shrink-0">
            <Settings2 size={14} className="text-violet-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">Configuração Avançada</p>
            <p className="text-[11px] text-muted-foreground">
              {ativos === 0 ? "Nenhum módulo ativo" : `${ativos} de ${total} módulos ativos`} — ative os recursos que deseja usar nesta consulta
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {ativos > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">
              {ativos} ativos
            </span>
          )}
          {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border divide-y divide-border/50">
          {CATEGORIAS_MODULOS.map((cat) => {
            const modsNaCategoria = MODULOS_AVANCADOS.filter(m => m.categoria === cat);
            const ativosNaCategoria = modsNaCategoria.filter(m => modules[m.id]).length;
            return (
              <div key={cat} className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{cat}</p>
                  {ativosNaCategoria > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 border border-violet-500/20">
                      {ativosNaCategoria}/{modsNaCategoria.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {modsNaCategoria.map((mod) => {
                    const ativo = !!modules[mod.id];
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => onToggleModule(mod.id)}
                        className={cn(
                          "w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all",
                          ativo
                            ? "border-violet-500/30 bg-violet-500/5"
                            : "border-border bg-background hover:border-violet-500/20 hover:bg-violet-500/3"
                        )}
                      >
                        {/* Toggle visual */}
                        <div className={cn(
                          "mt-0.5 w-9 h-5 rounded-full shrink-0 transition-all relative",
                          ativo ? "bg-violet-500" : "bg-muted border border-border"
                        )}>
                          <div className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                            ativo ? "left-[18px]" : "left-0.5"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className={cn("text-xs font-semibold", ativo ? "text-foreground" : "text-muted-foreground")}>
                              {mod.nome}
                            </p>
                            {mod.tag === "novo" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20">NOVO</span>
                            )}
                            {mod.tag === "beta" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">BETA</span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{mod.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Actions */}
          <div className="px-5 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => MODULOS_AVANCADOS.forEach(m => !modules[m.id] && onToggleModule(m.id))}
              className="text-[11px] font-medium text-violet-600 hover:text-violet-700 transition-colors"
            >
              Ativar todos
            </button>
            <span className="text-muted-foreground/40">·</span>
            <button
              type="button"
              onClick={() => MODULOS_AVANCADOS.forEach(m => modules[m.id] && onToggleModule(m.id))}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Desativar todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const LAYOUTS = [
  { id: "estruturado", label: "Estruturado por blocos", desc: "Seções delimitadas: QP / HPMA / TTO Prévio / MUC / EEM / HD / Conduta" },
  { id: "completo", label: "Prontuário completo", desc: "Texto corrido com todos os campos em prosa clínica" },
  { id: "objetivo", label: "Evolução objetiva", desc: "Formato breve para retorno ambulatorial" },
  { id: "enfermaria", label: "Evolução de enfermaria", desc: "Sono / alimentação / comportamento / risco / conduta" },
  { id: "urgencia", label: "Avaliação de urgência", desc: "Foco em apresentação, risco e conduta imediata" },
  { id: "inss", label: "Formato INSS / perícia", desc: "Estrutura previdenciária com prejuízo funcional e capacidade laboral" },
  { id: "soap", label: "SOAP-R", desc: "S — Subjetivo / O — Objetivo / A — Avaliação / R — Risco / P — Plano" },
];

const CONDUTA_BASE_COMPLETO = "Realizada escuta ativa, acolhimento e validação do sofrimento psíquico apresentado. Realizada psicoeducação sobre o quadro clínico, sintomas atuais, fatores de piora e importância da adesão ao tratamento proposto. Orientado quanto à necessidade de seguimento psiquiátrico regular, manutenção das recomendações terapêuticas e observação de sinais de alerta. Orientado sobre possíveis efeitos adversos das medicações prescritas/ajustadas, bem como sobre a importância de não realizar suspensão ou alteração medicamentosa sem orientação médica. Reforçadas medidas de autocuidado, higiene do sono, organização de rotina, redução de fatores estressores quando possível e busca de suporte familiar/social. Orientado procurar pronto-atendimento em caso de piora importante dos sintomas, ideação suicida, comportamento de risco, agitação intensa, sintomas psicóticos, efeitos adversos graves ou qualquer situação de risco.";

const CONDUTA_BASE_SIMPLIFICADO = "Realizada escuta ativa, acolhimento e psicoeducação sobre o quadro clínico e tratamento proposto. Orientado quanto à importância da adesão às medicações e demais recomendações terapêuticas, bem como sobre sinais de alerta e necessidade de procurar pronto-atendimento em caso de piora importante, ideação suicida, comportamento de risco ou efeitos adversos relevantes. Reforçadas medidas de autocuidado, higiene do sono e seguimento psiquiátrico regular.";

// ─── Prontuário Generator ─────────────────────────────────────────────────────

function cidLabel(code: string) {
  return CIDS.find(c => c.code === code)?.desc || "";
}

function tipoLabel(tipo: string) {
  return TIPOS.find(t => t.value === tipo)?.label || tipo;
}

// ─── Text Quality Utilities ───────────────────────────────────────────────────

// Detects and normalizes all-caps free text to sentence case
function normalizeCaps(text: string): string {
  if (!text || text.trim().length < 4) return text;
  const letters = text.replace(/[^a-zA-ZÀ-ú]/g, "");
  if (letters.length === 0) return text;
  const upperCount = letters.split("").filter(c => c === c.toUpperCase() && c !== c.toLowerCase()).length;
  if (upperCount / letters.length > 0.65) {
    const lower = text.toLowerCase();
    return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
  }
  return text;
}

// Builds gender-aware, properly spaced identification text
function buildIdentTextNorma(d: ConsultaState): string {
  const sexo = d.ident.sexo || "";
  const fem = sexo.toLowerCase().includes("fem");
  const parts: string[] = [];
  if (d.ident.sexo) parts.push(`Paciente ${fem ? "feminina" : "masculino"}`);
  else parts.push("Paciente");
  if (d.ident.idade) parts[0] += `, ${d.ident.idade.trim()} anos`;
  if (d.ident.naturalidade) parts[0] += `, natural de ${d.ident.naturalidade.trim()}`;
  if (d.ident.escolaridade) parts[0] += `, ${d.ident.escolaridade.trim()}`;
  if (d.ident.profissao) parts[0] += `, ${d.ident.profissao.trim()}`;
  if (d.ident.estadoCivil) parts[0] += `, ${d.ident.estadoCivil.trim()}`;
  if (d.ident.comQuemMora) parts[0] += `, reside com ${d.ident.comQuemMora.trim()}`;
  parts[0] += ".";
  const acomp = d.ident.acompanhante === "sim"
    ? `Comparece à avaliação acompanhado${fem ? "a" : ""} de familiar.`
    : `Comparece à avaliação desacompanhad${fem ? "a" : "o"}.`;
  const conf = d.ident.confiabilidade
    ? ` com ${d.ident.confiabilidade.toLowerCase()} confiabilidade`
    : "";
  const fonte = `Informações obtidas por ${d.ident.fonteInfo || "relato próprio"}${conf}.`;
  return [parts[0], acomp, fonte].join(" ");
}

// Builds QP as a clinical sentence
function buildQPSentence(d: ConsultaState): string {
  const items = [...d.qp];
  if (d.qpLivre) items.push(normalizeCaps(d.qpLivre));
  if (!items.length) return "";
  const lower = items.map(i => i.charAt(0).toLowerCase() + i.slice(1));
  let joined: string;
  if (lower.length === 1) joined = lower[0];
  else joined = lower.slice(0, -1).join(", ") + " e " + lower[lower.length - 1];
  return `Paciente refere ${joined}.`;
}

// Builds risco as a clinical narrative sentence
function buildRiscoTextNorma(d: ConsultaState): string {
  const suicida = d.risco["suicida"] || [];
  const hetero = d.risco["hetero"] || [];
  const protetores = d.risco["protetores"] || [];
  const nivel = d.nivelRisco;
  const parts: string[] = [];

  const negaSuicida = suicida.includes("Nega ideação suicida");
  const temIdeacao = suicida.some(s => s.includes("Ideação") || s.includes("ideação") || s.includes("plano") || s.includes("intenção"));
  const temTA = suicida.some(s => s.includes("Tentativa de suicídio recente"));
  const temTAPrev = suicida.some(s => s.includes("prévia"));

  if (negaSuicida) {
    parts.push("Nega ideação suicida no momento.");
  } else if (temIdeacao) {
    const ideacaoItems = suicida.filter(s => s !== "Nega ideação suicida");
    parts.push(`Relata ${ideacaoItems.join(", ").toLowerCase()}.`);
  } else if (suicida.length) {
    parts.push(`Risco suicida: ${suicida.join(", ").toLowerCase()}.`);
  }

  if (temTA) parts.push("Refere tentativa de suicídio recente.");
  if (temTAPrev && !temTA) parts.push("Refere tentativa de suicídio prévia.");

  if (hetero.length && !hetero.includes("Nega ideação heteroagressiva")) {
    parts.push(`Risco heteroagressivo: ${hetero.join(", ").toLowerCase()}.`);
  }

  if (protetores.length) {
    parts.push(`Apresenta fatores protetores, incluindo ${protetores.join(", ").toLowerCase()}.`);
  }

  if (nivel) {
    parts.push(`Risco avaliado como ${nivel.toLowerCase()}.`);
  }

  return parts.join(" ");
}

// Builds EEM as 2 paragraphs with better phrasing
function buildEEMTextNorma(eem: Sels, realce: string): string {
  const GROUP1 = ["aparencia", "atitude", "consciencia", "orientacao"];
  const GROUP2 = ["atencao", "memoria", "sensopercepcao", "pens-curso", "pens-conteudo", "linguagem", "humor", "afeto", "psicomotricidade", "vontade", "insight"];

  function domainText(id: string): string {
    const dom = EEM_DOMINIOS.find(d => d.id === id);
    if (!dom) return "";
    const sels = eem[id] || [];
    if (sels.length === 0) return "";
    if (sels.includes("_normal")) return dom.normal;
    const opts = sels.map(o => applyRealce(o, realce));
    switch (id) {
      case "aparencia": return `Apresenta-se com ${opts.join(", ").toLowerCase()}.`;
      case "atitude": return `Atitude ${opts.join(", ").toLowerCase()}, com responsividade à entrevista.`;
      case "consciencia": return `Consciência: ${opts.join(", ").toLowerCase()}.`;
      case "orientacao": return `${opts.join(", ")}.`;
      case "atencao": return `Atenção com ${opts.join(", ").toLowerCase()}.`;
      case "memoria": return `Memória: ${opts.join(", ").toLowerCase()}.`;
      case "sensopercepcao": return `Sensopercepção: ${opts.join(", ")}.`;
      case "pens-curso": return `Curso do pensamento: ${opts.join(", ").toLowerCase()}.`;
      case "pens-conteudo": return `Pensamento com ${opts.join(", ").toLowerCase()}.`;
      case "linguagem": return `Linguagem: ${opts.join(", ").toLowerCase()}.`;
      case "humor": return `Humor ${opts.join(", ").toLowerCase()}.`;
      case "afeto": return `Afeto ${opts.join(", ").toLowerCase()}.`;
      case "psicomotricidade": return `Psicomotricidade: ${opts.join(", ").toLowerCase()}.`;
      case "vontade": return `Vontade/pragmatismo: ${opts.join(", ").toLowerCase()}.`;
      case "insight": return `Juízo crítico/insight: ${opts.join(", ").toLowerCase()}.`;
      default: return `${dom.label}: ${opts.join(", ")}.`;
    }
  }

  const g1parts: string[] = [];
  const g1allNormal = GROUP1.every(id => {
    const s = eem[id] || [];
    return s.length === 0 || s.includes("_normal");
  });
  if (g1allNormal && GROUP1.some(id => (eem[id] || []).includes("_normal"))) {
    g1parts.push("Apresenta-se em bom estado geral, com higiene preservada, vestes adequadas ao contexto e aparência compatível com a idade. Mantém atitude colaborativa, contato interpessoal adequado e boa responsividade à entrevista. Encontra-se vigil, lúcido/a e responsivo/a ao ambiente, orientado/a globalmente em tempo, espaço, pessoa e situação.");
  } else {
    for (const id of GROUP1) {
      const t = domainText(id);
      if (t) g1parts.push(t);
    }
  }

  const g2parts: string[] = [];
  const g2allNormal = GROUP2.every(id => {
    const s = eem[id] || [];
    return s.length === 0 || s.includes("_normal");
  });
  if (g2allNormal && GROUP2.some(id => (eem[id] || []).includes("_normal"))) {
    g2parts.push("Atenção, memória e sensopercepção preservadas. Pensamento com curso organizado e encadeamento lógico preservado, sem ideias delirantes, obsessivas ou supervalorizadas evidentes. Linguagem fluente, coerente e adequada. Humor eutímico, afeto congruente, com amplitude e modulação preservadas. Psicomotricidade preservada. Vontade, pragmatismo e autocuidado preservados. Juízo crítico preservado e insight adequado.");
  } else {
    for (const id of GROUP2) {
      const t = domainText(id);
      if (t) g2parts.push(t);
    }
  }

  const p1 = g1parts.join(" ");
  const p2 = g2parts.join(" ");
  const extra = (eem["_livre"] || []).join(" ") || "";
  return [p1, p2, extra].filter(Boolean).join("\n\n");
}

// Builds conduta as numbered or narrative format
function buildCondutaEstruturada(d: ConsultaState, condutaLines: string[]): string {
  if (!condutaLines.length) return "";

  if (d.condutaFormat === "numerada") {
    const items: string[] = [];
    const base = d.condutaBase === "completo" ? CONDUTA_BASE_COMPLETO
                : d.condutaBase === "simplificado" ? CONDUTA_BASE_SIMPLIFICADO : "";
    if (base) items.push(base);
    if (d.condutaFarma) items.push(`Farmacoterapia: ${normalizeCaps(d.condutaFarma)}.`);
    if (d.condutaPsico.length) items.push(`Psicoterapia: ${d.condutaPsico.join(", ")}.`);
    if (d.condutaExames.length) items.push(`Exames: ${d.condutaExames.join(", ")}.`);
    if (d.condutaEncam.length) items.push(`Encaminhamentos: ${d.condutaEncam.join(", ")}.`);
    if (d.condutaSeguranca.length) items.push(`Plano de segurança: ${d.condutaSeguranca.join(", ")}.`);
    if (d.condutaRetorno) items.push(`Retorno: ${normalizeCaps(d.condutaRetorno)}.`);
    if (d.condutaObs) items.push(normalizeCaps(d.condutaObs));
    return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
  }

  // Narrative format
  const basePrefix20Completo = CONDUTA_BASE_COMPLETO.slice(0, 20);
  const basePrefix20Simples = CONDUTA_BASE_SIMPLIFICADO.slice(0, 20);
  const specific = condutaLines
    .filter(l => !l.startsWith(basePrefix20Completo) && !l.startsWith(basePrefix20Simples))
    .map(l => normalizeCaps(l));
  const base = condutaLines.find(l => l.startsWith(basePrefix20Completo) || l.startsWith(basePrefix20Simples)) || "";
  const parts = [base, specific.join(" ")].filter(Boolean);
  return parts.join("\n\n");
}

function buildEEMText(eem: Sels): string {
  const lines: string[] = [];
  for (const d of EEM_DOMINIOS) {
    const sels = eem[d.id] || [];
    if (sels.includes("_normal")) {
      lines.push(d.normal);
    } else if (sels.length > 0) {
      lines.push(`${d.label}: ${sels.join(", ")}.`);
    }
  }
  return lines.join(" ");
}

function buildHPMAText(d: ConsultaState): string {
  const lines: string[] = [];
  if (d.hpmaInicio.length) lines.push(`Início: ${d.hpmaInicio.join(", ").toLowerCase()}.`);
  if (d.hpmaCurso.length) lines.push(`Curso: ${d.hpmaCurso.join(", ").toLowerCase()}.`);
  for (const dom of HPMA_DOMINIOS) {
    const sels = d.hpmaSintomas[dom.id] || [];
    if (sels.length) lines.push(`${dom.label}: ${sels.join(", ").toLowerCase()}.`);
  }
  const neuroDevText = buildNeuroDevText(d);
  if (neuroDevText) lines.push(neuroDevText);
  if (d.hpmaLivre) lines.push(d.hpmaLivre);
  return lines.join("\n");
}

function buildNeuroDevText(d: ConsultaState): string {
  const nd = d.neurodev || {};
  const anySelected = Object.values(nd).some(v => v.length > 0);
  if (!anySelected) return "";
  const parts: string[] = [];
  const marco = nd["marco-temporal"] || [];
  if (marco.length) parts.push(`Histórico do desenvolvimento: ${marco.join(", ").toLowerCase()}.`);
  const teaCom = nd["tea-comunicacao"] || [];
  if (teaCom.length) parts.push(`Relata dificuldades qualitativas na interação social, incluindo ${teaCom.join(", ").toLowerCase()}.`);
  const teaPad = nd["tea-padroes"] || [];
  if (teaPad.length) parts.push(`Refere rigidez comportamental, necessidade de previsibilidade e ${teaPad.join(", ").toLowerCase()}.`);
  const teaSen = nd["tea-sensorial"] || [];
  if (teaSen.length) parts.push(`Apresenta sensibilidade sensorial, especialmente ${teaSen.join(", ").toLowerCase()}.`);
  const tdahAt = nd["tdah-atencao"] || [];
  if (tdahAt.length) parts.push(`Associam-se alterações atencionais, incluindo ${tdahAt.join(", ").toLowerCase()}.`);
  const tdahHi = nd["tdah-hiperatividade"] || [];
  if (tdahHi.length) parts.push(`Com hiperatividade/impulsividade, incluindo ${tdahHi.join(", ").toLowerCase()}.`);
  const di = nd["di-funcional"] || [];
  if (di.length) parts.push(`Aspectos de funcionamento adaptativo: ${di.join(", ").toLowerCase()}.`);
  const escolar = nd["historia-escolar"] || [];
  if (escolar.length) parts.push(`História escolar: ${escolar.join(", ").toLowerCase()}.`);
  const aval = nd["avaliacoes-previas"] || [];
  if (aval.length) parts.push(`Avaliações prévias: ${aval.join(", ").toLowerCase()}.`);
  const impacto = nd["impacto-funcional"] || [];
  if (impacto.length) parts.push(`Impacto funcional atual relacionado ao neurodesenvolvimento: ${impacto.join(", ").toLowerCase()}.`);
  return parts.join(" ");
}

function buildHPMATextCorrido(d: ConsultaState): string {
  const parts: string[] = [];
  const inicio = d.hpmaInicio.join(", ").toLowerCase();
  const curso = d.hpmaCurso.join(", ").toLowerCase();
  if (inicio || curso) {
    parts.push(`Paciente refere quadro de ${inicio || "início não especificado"}, com ${curso || "curso não especificado"}.`);
  }
  const afetivos = d.hpmaSintomas["afetivos"] || [];
  if (afetivos.length) parts.push(`cursando com sintomas afetivos caracterizados por ${afetivos.join(", ").toLowerCase()}.`);
  const ansiedade = d.hpmaSintomas["ansiedade"] || [];
  if (ansiedade.length) parts.push(`Associam-se sintomas ansiosos, com ${ansiedade.join(", ").toLowerCase()}.`);
  const psicose = d.hpmaSintomas["psicose"] || [];
  if (psicose.length) parts.push(`Evidenciam-se sintomas psicóticos, tais como ${psicose.join(", ").toLowerCase()}.`);
  const mania = d.hpmaSintomas["mania"] || [];
  if (mania.length) parts.push(`Com elementos hipomaníacos/maníacos, incluindo ${mania.join(", ").toLowerCase()}.`);
  const ocd = d.hpmaSintomas["ocd"] || [];
  if (ocd.length) parts.push(`Relata sintomas obsessivo-compulsivos: ${ocd.join(", ").toLowerCase()}.`);
  const tdah = d.hpmaSintomas["tdah"] || [];
  if (tdah.length) parts.push(`Além de alterações atencionais e de funções executivas, incluindo ${tdah.join(", ").toLowerCase()}.`);
  const sono = d.hpmaSintomas["sono"] || [];
  if (sono.length) parts.push(`Relata alterações do sono, com ${sono.join(", ").toLowerCase()}.`);
  const apetite = d.hpmaSintomas["apetite"] || [];
  if (apetite.length) parts.push(`e alterações do apetite, com ${apetite.join(", ").toLowerCase()}.`);
  const funcionalidade = d.hpmaSintomas["funcionalidade"] || [];
  if (funcionalidade.length) parts.push(`Do ponto de vista funcional, relata ${funcionalidade.join(", ").toLowerCase()}.`);
  const neuroDevText = buildNeuroDevText(d);
  if (neuroDevText) parts.push(neuroDevText);
  if (d.hpmaLivre) parts.push(normalizeCaps(d.hpmaLivre));
  return parts.join(" ");
}

function applyRealce(text: string, mode: string): string {
  if (mode === "negrito") return `**${text}**`;
  if (mode === "caps") return text.toUpperCase();
  return text;
}

function buildEEMTextRealce(eem: Sels, mode: string): string {
  const lines: string[] = [];
  for (const d of EEM_DOMINIOS) {
    const sels = eem[d.id] || [];
    if (sels.includes("_normal")) {
      lines.push(d.normal);
    } else if (sels.length > 0) {
      const wrappedOpts = sels.map(o => applyRealce(o, mode));
      lines.push(`${d.label}: ${wrappedOpts.join(", ")}.`);
    }
  }
  return lines.join(" ");
}

function gerarProntuario(d: ConsultaState): string {
  const layout = d.layout;
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  const hoje = new Date().toLocaleDateString("pt-BR");

  // Common builders
  const identParts = [
    d.ident.idade ? `${d.ident.idade} anos` : "",
    d.ident.sexo || "",
    d.ident.naturalidade ? `natural de ${d.ident.naturalidade}` : "",
    d.ident.escolaridade || "",
    d.ident.profissao ? `profissão ${d.ident.profissao}` : "",
    d.ident.estadoCivil || "",
    d.ident.comQuemMora ? `reside com ${d.ident.comQuemMora}` : "",
  ].filter(Boolean).join(", ");

  const identText = `Paciente${d.ident.nome ? ` ${d.ident.nome}` : ""}${identParts ? `, ${identParts}` : ""}. Comparece à avaliação ${d.ident.acompanhante === "sim" ? "acompanhado/a de familiar" : "desacompanhado/a"}. Informações obtidas por meio de ${d.ident.fonteInfo || "relato próprio"}${d.ident.confiabilidade ? `, confiabilidade ${d.ident.confiabilidade}` : ""}.`;

  const qpText = [d.qp.join(", "), d.qpLivre].filter(Boolean).join(" — ");
  const hpmaText = d.hpmaView === "corrido" ? buildHPMATextCorrido(d) : buildHPMAText(d);
  const eemText = buildEEMTextRealce(d.eem, d.realce) + (d.eemLivre ? ` ${d.eemLivre}` : "");

  const riscoSuicida = d.risco["suicida"] || [];
  const riscoHetero = d.risco["hetero"] || [];
  const protetores = d.risco["protetores"] || [];
  const riscoText = [
    riscoSuicida.length ? `Risco suicida: ${riscoSuicida.join(", ")}.` : "",
    riscoHetero.length ? `Risco heteroagressivo: ${riscoHetero.join(", ")}.` : "",
    protetores.length ? `Fatores protetores: ${protetores.join(", ")}.` : "",
    d.nivelRisco ? `Nível de risco: ${d.nivelRisco}.` : "",
  ].filter(Boolean).join(" ");

  const hdText = [
    cid ? `CID-10: ${cid}${cidDesc ? ` — ${cidDesc}` : ""}.` : "",
    d.diagnosticoLivre || "",
    d.gravidade ? `Gravidade: ${d.gravidade}.` : "",
    d.especificadores.length ? `Especificadores: ${d.especificadores.join(", ")}.` : "",
  ].filter(Boolean).join(" ");

  const condutaLines = [
    d.condutaBase === "completo" ? CONDUTA_BASE_COMPLETO : d.condutaBase === "simplificado" ? CONDUTA_BASE_SIMPLIFICADO : "",
    d.condutaFarma ? `Farmacoterapia: ${normalizeCaps(d.condutaFarma)}.` : "",
    d.condutaPsico.length ? `Psicoterapia: ${d.condutaPsico.join(", ")}.` : "",
    d.condutaExames.length ? `Exames: ${d.condutaExames.join(", ")}.` : "",
    d.condutaEncam.length ? `Encaminhamentos: ${d.condutaEncam.join(", ")}.` : "",
    d.condutaSeguranca.length ? `Plano de segurança: ${d.condutaSeguranca.join(", ")}.` : "",
    d.condutaRetorno ? `Retorno: ${d.condutaRetorno}.` : "",
    d.advancedModules["adesao"] && d.adesao ? `Adesão ao tratamento: ${d.adesao}.` : "",
    d.advancedModules["sintomas-alvo"] && d.sintomosAlvo.length ? `Sintomas-alvo para monitoramento: ${d.sintomosAlvo.join(", ")}.` : "",
    d.advancedModules["metas-retorno"] && d.metasRetorno ? `Metas até o retorno: ${d.metasRetorno}.` : "",
    d.advancedModules["prejuizo-funcional"] && Object.keys(d.prejuizoFuncional).length
      ? `Prejuízo funcional: ${Object.entries(d.prejuizoFuncional).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("; ")}.`
      : "",
    d.advancedModules["capacidade-laboral"] && d.capacidadeLaboral["conclusao"]
      ? `Capacidade laboral: ${d.capacidadeLaboral["conclusao"]}${d.capacidadeLaboral["atividade"] ? ` para ${d.capacidadeLaboral["atividade"]}` : ""}${d.capacidadeLaboral["limitacoes"] ? `. Limitações: ${d.capacidadeLaboral["limitacoes"].split("|").join(", ")}` : ""}${d.capacidadeLaboral["prazo"] ? `. Prazo/reavaliação: ${d.capacidadeLaboral["prazo"]}` : ""}.`
      : "",
    d.condutaObs ? normalizeCaps(d.condutaObs) : "",
  ].filter(Boolean);

  const antPsiDiags = d.antPsi["diagnosticos"] || [];
  const antPsiText = [
    antPsiDiags.length ? `Diagnósticos prévios: ${antPsiDiags.join(", ")}.` : "",
    d.antPsi["internacoes"]?.includes("sim") ? "Refere internações psiquiátricas prévias." : "",
    d.antPsi["tentativas"]?.includes("sim") ? "Refere tentativas de suicídio prévias." : "",
    d.antPsi["automutilacao"]?.includes("sim") ? "Refere automutilação prévia." : "",
    d.antPsi["psicoterapia"]?.includes("sim") ? "Psicoterapia prévia relatada." : "",
    d.antDetalhes || "",
  ].filter(Boolean).join(" ");

  const substUsadas = SUBSTANCIAS.filter(s => d.substancias[s.id]?.includes("usa"));
  const substText = substUsadas.length
    ? `Refere uso de: ${substUsadas.map(s => s.label).join(", ")}. Nega uso das demais substâncias investigadas.`
    : "Nega uso de substâncias psicoativas.";

  // ── Layout: ESTRUTURADO ──────────────────────────────────────────────────────
  if (layout === "estruturado") {
    const omit = d.omitirVazias;
    const hpmaEstruturado = buildHPMATextCorrido(d);
    const eemNorma = buildEEMTextNorma(d.eem, d.realce) + (d.eemLivre ? `\n\n${d.eemLivre}` : "");
    const riscoNorma = buildRiscoTextNorma(d);
    const qpNorma = buildQPSentence(d);
    const identNorma = buildIdentTextNorma(d);

    const condutaFormatada = buildCondutaEstruturada(d, condutaLines);

    const sections: string[] = [];
    if (d.tipo) sections.push(`# TIPO DE ATENDIMENTO\n\n${tipoLabel(d.tipo)}.`);
    if (identNorma) sections.push(`# IDENTIFICAÇÃO\n\n${identNorma}`);
    if (qpNorma || !omit) sections.push(`# QP\n\n${qpNorma || "Não informada."}`);
    if (hpmaEstruturado || !omit) sections.push(`# HPMA\n\n${hpmaEstruturado || "Não informada."}`);
    if (antPsiText) sections.push(`# ANTECEDENTES PSIQUIÁTRICOS\n\n${antPsiText}`);
    else if (!omit) sections.push(`# ANTECEDENTES PSIQUIÁTRICOS\n\nNão referidos.`);
    if (d.ttoPrevio) sections.push(`# TTO PRÉVIO\n\n${normalizeCaps(d.ttoPrevio)}`);
    else if (!omit) sections.push(`# TTO PRÉVIO\n\nNão informado.`);

    const mucFull = [d.muc ? normalizeCaps(d.muc) : "", d.alergias ? `\n\nAlergias: ${d.alergias.toLowerCase() === "nega" ? "nega" : d.alergias}.` : ""].filter(Boolean).join("");
    if (mucFull) sections.push(`# MUC\n\n${mucFull}`);
    else if (!omit) sections.push(`# MUC\n\nNão informado.\n\nAlergias: nega.`);

    if (d.antClinico.length) sections.push(`# ANTECEDENTES PESSOAIS CLÍNICOS\n\n${d.antClinico.join(". ")}.`);
    if (d.antFamiliar.length) sections.push(`# ANTECEDENTES FAMILIARES\n\nRefere história familiar de: ${d.antFamiliar.join(", ").toLowerCase()}.`);
    sections.push(`# USO DE SUBSTÂNCIAS\n\n${substText}`);
    if (eemNorma) sections.push(`# EXAME DO ESTADO MENTAL\n\n${eemNorma}`);
    else if (!omit) sections.push(`# EXAME DO ESTADO MENTAL\n\nEEM não preenchido.`);
    if (riscoNorma) sections.push(`# AVALIAÇÃO DE RISCO\n\n${riscoNorma}`);
    else if (!omit) sections.push(`# AVALIAÇÃO DE RISCO\n\nNão avaliado formalmente.`);
    if (hdText) sections.push(`# HIPÓTESE DIAGNÓSTICA\n\n${hdText}`);
    else if (!omit) sections.push(`# HIPÓTESE DIAGNÓSTICA\n\nA definir.`);
    if (d.diferenciais.length) sections.push(`# DIAGNÓSTICOS DIFERENCIAIS\n\n${d.diferenciais.join("; ")}.`);
    if (condutaFormatada) sections.push(`# CONDUTA\n\n${condutaFormatada}`);
    else if (!omit) sections.push(`# CONDUTA\n\nA definir.`);
    if (d.condutaRetorno && !condutaLines.some(l => l.startsWith("Retorno:"))) {
      sections.push(`# RETORNO\n\n${normalizeCaps(d.condutaRetorno)}.`);
    }
    if (d.advancedModules["raciocinio-clinico"] && d.raciocinioCli) {
      sections.push(`# RACIOCÍNIO CLÍNICO\n\n${d.raciocinioCli}`);
    }
    return sections.join("\n\n---\n\n");
  }

  // ── Layout: OBJETIVO ─────────────────────────────────────────────────────────
  if (layout === "objetivo") {
    const parts: string[] = [];
    if (qpText) parts.push(`QP: ${qpText}`);
    if (hpmaText) parts.push(`HPMA: ${hpmaText.replace(/\n/g, " ")}`);
    if (d.ttoPrevio) parts.push(`TTO PRÉVIO: ${d.ttoPrevio}`);
    if (d.muc) parts.push(`MUC: ${d.muc}${d.alergias ? ` | Alergias: ${d.alergias}` : ""}`);
    if (eemText) parts.push(`EEM: ${eemText}`);
    if (riscoText) parts.push(`RISCO: ${riscoText}`);
    if (hdText) parts.push(`HD: ${hdText}`);
    if (condutaLines.length) parts.push(`CONDUTA: ${condutaLines.join(" | ")}`);
    return parts.join("\n");
  }

  // ── Layout: COMPLETO ─────────────────────────────────────────────────────────
  if (layout === "completo") {
    const p: string[] = [];
    p.push(`Paciente${d.ident.nome ? ` ${d.ident.nome}` : ""}${identParts ? `, ${identParts}` : ""}. Comparece à consulta de ${tipoLabel(d.tipo).toLowerCase()}${d.ident.acompanhante === "sim" ? ", acompanhado/a de familiar" : ""}. Informações obtidas por meio de ${d.ident.fonteInfo || "relato próprio"}${d.ident.confiabilidade ? `, confiabilidade ${d.ident.confiabilidade}` : ""}.`);
    if (qpText) p.push(`Queixa principal: ${qpText}.`);
    if (hpmaText) p.push(`História da Moléstia Atual:\n${hpmaText}`);
    const antAll = [antPsiText, d.ttoPrevio ? `Tratamento prévio: ${d.ttoPrevio}` : "", d.muc ? `Medicamentos em uso: ${d.muc}` : "", d.alergias ? `Alergias: ${d.alergias}` : "", d.antClinico.length ? `Antecedentes clínicos: ${d.antClinico.join(", ")}.` : "", d.antFamiliar.length ? `Antecedentes familiares: ${d.antFamiliar.join(", ")}.` : "", substText].filter(Boolean);
    if (antAll.length) p.push(`Antecedentes e Histórico:\n${antAll.join("\n")}`);
    if (eemText) p.push(`Exame do Estado Mental:\n${eemText}`);
    if (riscoText) p.push(`Avaliação de Risco:\n${riscoText}`);
    if (hdText) p.push(`Hipótese Diagnóstica: ${hdText}`);
    if (d.diferenciais.length) p.push(`Diagnósticos Diferenciais: ${d.diferenciais.join(", ")}.`);
    if (condutaLines.length) p.push(`Conduta:\n${condutaLines.join("\n")}`);
    return p.join("\n\n");
  }

  // ── Layout: ENFERMARIA ────────────────────────────────────────────────────────
  if (layout === "enfermaria") {
    const sono = d.hpmaSintomas["sono"] || [];
    const p: string[] = [];
    p.push(`Evolução — ${hoje}`);
    p.push(`Paciente${d.ident.nome ? ` ${d.ident.nome}` : ""} em internação psiquiátrica por ${cid ? `${cid}${cidDesc ? ` (${cidDesc})` : ""}` : "quadro psiquiátrico"}.`);
    if (eemText) p.push(`Estado mental: ${eemText}`);
    if (sono.length) p.push(`Sono: ${sono.join(", ")}.`);
    if (d.hpmaSintomas["apetite"]?.length) p.push(`Alimentação: ${d.hpmaSintomas["apetite"].join(", ")}.`);
    if (riscoText) p.push(`Avaliação de risco: ${riscoText}`);
    if (condutaLines.length) p.push(`Conduta: ${condutaLines.join(" | ")}`);
    return p.join("\n");
  }

  // ── Layout: URGÊNCIA ─────────────────────────────────────────────────────────
  if (layout === "urgencia") {
    const p: string[] = [];
    p.push(`AVALIAÇÃO PSIQUIÁTRICA DE URGÊNCIA — ${hoje}`);
    if (identText) p.push(`Identificação: ${identText}`);
    if (qpText) p.push(`Motivo do atendimento: ${qpText}`);
    if (eemText) p.push(`Exame do Estado Mental:\n${eemText}`);
    if (riscoText) p.push(`Avaliação de Risco (PRIORITÁRIA):\n${riscoText}`);
    if (hdText) p.push(`Hipótese Diagnóstica: ${hdText}`);
    if (condutaLines.length) p.push(`Conduta imediata:\n${condutaLines.join("\n")}`);
    return p.join("\n\n");
  }

  // ── Layout: INSS ─────────────────────────────────────────────────────────────
  if (layout === "inss") {
    const p: string[] = [];
    p.push(`RELATÓRIO PSIQUIÁTRICO — ${hoje}`);
    if (identText) p.push(`Identificação: ${identText}`);
    if (d.ident.profissao) p.push(`Atividade laboral: ${d.ident.profissao}.`);
    if (cid) p.push(`Diagnóstico: CID-10 ${cid}${cidDesc ? ` — ${cidDesc}` : ""}.`);
    if (hpmaText) p.push(`Histórico clínico:\n${hpmaText}`);
    if (eemText) p.push(`Exame do Estado Mental:\n${eemText}`);
    const funcPrejuizo = d.hpmaSintomas["funcionalidade"] || [];
    if (funcPrejuizo.length) p.push(`Prejuízo funcional: ${funcPrejuizo.join(", ")}.`);
    if (condutaLines.length) p.push(`Tratamento instituído:\n${condutaLines.join("\n")}`);
    p.push(`Prognóstico e recomendações: No momento, pelo quadro clínico descrito e pelo nível de prejuízo funcional, sugere-se manutenção de acompanhamento psiquiátrico regular e reavaliação de capacidade laboral em _____ dias.`);
    return p.join("\n\n");
  }

  // ── Layout: SOAP-R ────────────────────────────────────────────────────────────
  if (layout === "soap") {
    const p: string[] = [];
    p.push(`S — SUBJETIVO\nQP: ${qpText || "Não registrado."}\n${hpmaText || ""}`);
    p.push(`O — OBJETIVO\n${eemText || "EEM não preenchido."}`);
    p.push(`A — AVALIAÇÃO\n${hdText || "Hipótese diagnóstica não registrada."}`);
    p.push(`R — RISCO\n${riscoText || "Sem avaliação de risco formal registrada."}`);
    if (condutaLines.length) p.push(`P — PLANO\n${condutaLines.join("\n")}`);
    return p.join("\n\n");
  }

  return "";
}

// ─── Post-Consultation Document Generators ────────────────────────────────────

function gerarAtestado(d: ConsultaState, comCID: boolean): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  return [
    "ATESTADO MÉDICO",
    "",
    `Atesto, para os devidos fins, que o/a paciente${d.ident.nome ? ` ${d.ident.nome}` : ""} necessita de afastamento de suas atividades habituais pelo período de _____ dias, a contar desta data${comCID && cid ? `, por motivo de saúde (CID-10: ${cid}${cidDesc ? ` — ${cidDesc}` : ""})` : ""}.`,
    "",
    `Data: ${hoje}`,
    "",
    "___________________________",
    "[Nome do Médico]",
    "CRM: [Número]",
    "Especialidade: Psiquiatria",
  ].join("\n");
}

function gerarRelatorioSimples(d: ConsultaState): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  const funcPrejuizo = d.hpmaSintomas["funcionalidade"] || [];
  return [
    "RELATÓRIO MÉDICO",
    "",
    `Declaro, para os devidos fins, que o/a paciente${d.ident.nome ? ` ${d.ident.nome}` : ""}${d.ident.idade ? `, ${d.ident.idade} anos` : ""}, encontra-se em acompanhamento psiquiátrico${cid ? ` por quadro compatível com CID-10 ${cid}${cidDesc ? ` (${cidDesc})` : ""}` : ""}.`,
    "",
    `Apresenta ${d.qp.length ? d.qp.join(", ").toLowerCase() : "quadro psiquiátrico em curso"}${funcPrejuizo.length ? `, com repercussão funcional em: ${funcPrejuizo.join(", ").toLowerCase()}` : ""}.`,
    "",
    `Encontra-se em tratamento${d.condutaFarma ? ` farmacológico (${d.condutaFarma})` : ""}${d.condutaPsico.length ? ` e ${d.condutaPsico.join(", ")}` : ""}, com acompanhamento regular.`,
    "",
    "Recomenda-se manutenção do tratamento e seguimento ambulatorial psiquiátrico.",
    "",
    `Data: ${hoje}`,
    "",
    "___________________________",
    "[Nome do Médico]",
    "CRM: [Número]",
    "Especialidade: Psiquiatria",
  ].join("\n");
}

function gerarRelatorioINSS(d: ConsultaState): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  const funcPrejuizo = d.hpmaSintomas["funcionalidade"] || [];
  const eemText = buildEEMText(d.eem);
  return [
    "RELATÓRIO PSIQUIÁTRICO PARA FINS PREVIDENCIÁRIOS",
    "",
    `Paciente${d.ident.nome ? ` ${d.ident.nome}` : ""}${d.ident.idade ? `, ${d.ident.idade} anos` : ""}${d.ident.profissao ? `, que exerce atividade laboral como ${d.ident.profissao}` : ""}.`,
    "",
    `Encontra-se em acompanhamento psiquiátrico por quadro compatível com CID-10: ${cid || "[CID não informado]"}${cidDesc ? ` — ${cidDesc}` : ""}.`,
    "",
    `Histórico clínico: ${buildHPMAText(d).replace(/\n/g, " ")}`,
    "",
    `Ao exame do estado mental: ${eemText || "não preenchido."}`,
    "",
    funcPrejuizo.length ? `Prejuízo funcional: ${funcPrejuizo.join(", ")}.` : "",
    "",
    `Tratamento em curso: ${[d.condutaFarma, d.condutaPsico.join(", ")].filter(Boolean).join("; ") || "em definição."}`,
    "",
    "No momento, pelo quadro clínico descrito, pelo exame psíquico atual e pelo nível de prejuízo funcional identificado, justifica-se manutenção de afastamento das atividades laborais por _____ dias, com reavaliação periódica.",
    "",
    `Data: ${hoje}`,
    "",
    "___________________________",
    "[Nome do Médico]",
    "CRM: [Número]",
    "Especialidade: Psiquiatria",
  ].filter(l => l !== "").join("\n");
}

function gerarEncaminhamento(d: ConsultaState): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  return [
    "ENCAMINHAMENTO",
    "",
    `Encaminho o/a paciente${d.ident.nome ? ` ${d.ident.nome}` : ""}${d.ident.idade ? `, ${d.ident.idade} anos` : ""}, para ${d.condutaEncam.length ? d.condutaEncam.join(", ") : "[destino do encaminhamento]"}.`,
    "",
    `Diagnóstico / hipótese diagnóstica: ${cid ? `CID-10 ${cid}${cidDesc ? ` — ${cidDesc}` : ""}` : d.diagnosticoLivre || "[a preencher]"}.`,
    "",
    `Motivo do encaminhamento: ${d.qp.length ? d.qp.join(", ") : "[a preencher]"}. ${d.condutaObs || ""}`,
    "",
    "Solicito avaliação e acompanhamento especializado.",
    "",
    `Data: ${hoje}`,
    "",
    "___________________________",
    "[Nome do Médico]",
    "CRM: [Número]",
    "Especialidade: Psiquiatria",
  ].join("\n");
}

function gerarPlanoCrise(d: ConsultaState): string {
  const riscoSuicida = d.risco["suicida"] || [];
  const riscoHetero = d.risco["hetero"] || [];
  const protetores = d.risco["protetores"] || [];
  const temRiscoSuicida = riscoSuicida.some(r => !r.includes("Nega"));
  return [
    "PLANO DE CRISE",
    "",
    "Sinais de alerta (procurar atendimento se apresentar):",
    "• Piora importante da tristeza, ansiedade ou irritabilidade",
    "• Pensamentos de se machucar ou de morte",
    "• Alucinações ou delírios",
    "• Agitação ou comportamento de risco",
    "• Recusa alimentar ou abandono do autocuidado",
    "• Abandono da medicação",
    "",
    temRiscoSuicida ? "ATENÇÃO: Paciente com risco suicida identificado nesta avaliação." : "",
    "",
    "Medidas imediatas em caso de crise:",
    "• Avisar familiar ou pessoa de confiança",
    "• Não permanecer sozinho/a",
    protetores.includes("Restrição de meios letais") || d.condutaSeguranca.includes("Restrição de meios letais")
      ? "• Manter restrição de acesso a meios letais (medicamentos em excesso, objetos cortantes)"
      : "• Restringir acesso a meios potencialmente letais",
    "• Contatar o médico responsável",
    "• Procurar o pronto-socorro psiquiátrico mais próximo",
    "• Em emergência: SAMU 192 / CVV 188",
    "",
    protetores.length ? `Fatores protetores identificados: ${protetores.join(", ")}.` : "",
    "",
    d.condutaRetorno ? `Próximo retorno: ${d.condutaRetorno}` : "",
  ].filter(l => l !== "").join("\n");
}

function gerarOrientacaoPaciente(d: ConsultaState): string {
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  return [
    "ORIENTAÇÕES AO PACIENTE",
    "",
    `Você está em acompanhamento psiquiátrico${cid ? ` por quadro de ${cidDesc || cid}` : ""}.`,
    "",
    "Recomendações importantes:",
    "• Mantenha o tratamento medicamentoso conforme prescrito — não interrompa por conta própria",
    "• Mantenha horários regulares de sono",
    "• Evite uso de álcool e outras drogas",
    "• Mantenha atividades leves e contato social, mesmo que com dificuldade",
    "• Comunique ao médico qualquer efeito colateral ou piora dos sintomas",
    "",
    d.condutaPsico.length ? `Psicoterapia recomendada: ${d.condutaPsico.join(", ")}.` : "",
    "",
    "Procure atendimento de urgência se apresentar:",
    "• Pensamentos de se machucar ou de morte",
    "• Piora importante e rápida dos sintomas",
    "• Confusão mental ou comportamento muito diferente do habitual",
    "• Recusa em se alimentar ou cuidar de si",
    "",
    d.condutaRetorno ? `Seu próximo retorno está programado para: ${d.condutaRetorno}` : "Agende seu próximo retorno conforme orientação médica.",
    "",
    "CVV (Centro de Valorização da Vida): 188 (24h, gratuito)",
  ].filter(l => l !== "").join("\n");
}

function gerarOrientacaoFamiliar(d: ConsultaState): string {
  const riscoSuicida = d.risco["suicida"] || [];
  const temRisco = riscoSuicida.some(r => !r.includes("Nega"));
  return [
    "ORIENTAÇÕES À FAMÍLIA",
    "",
    `O/a paciente${d.ident.nome ? ` ${d.ident.nome}` : ""} está em acompanhamento psiquiátrico e necessita de suporte familiar.`,
    "",
    "O que a família pode fazer:",
    "• Oferecer apoio emocional sem julgamentos",
    "• Ajudar a manter a regularidade do tratamento e das medicações",
    "• Observar mudanças de comportamento, humor, sono ou alimentação",
    "• Incentivar atividades leves e manutenção do contato social",
    "• Evitar conflitos desnecessários durante períodos de crise",
    "",
    temRisco
      ? [
          "ATENÇÃO — Risco suicida identificado:",
          "• Mantenha supervisão próxima",
          "• Retire ou restrinja o acesso a medicamentos em grande quantidade, objetos cortantes, armas e outros meios potencialmente letais",
          "• Procure atendimento de urgência imediatamente se o/a paciente verbalizar intenção de se machucar, apresentar comportamento de risco ou se recusar a receber ajuda",
        ].join("\n")
      : "",
    "",
    "Procure o pronto-socorro ou ligue 192 (SAMU) em caso de risco iminente.",
    "",
    d.condutaRetorno ? `Próximo retorno: ${d.condutaRetorno}` : "",
  ].filter(l => l !== "").join("\n");
}

// ─── UI Components ────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
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

function NormalChip({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all select-none",
        active
          ? "bg-emerald-500 text-white border-emerald-500"
          : "bg-card border-border text-emerald-600 hover:border-emerald-400 hover:bg-emerald-500/5"
      )}
    >
      ✓ Normal
    </button>
  );
}

function Block({ title, children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {title && (
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 border-b border-border hover:bg-muted/20 transition-colors"
        >
          <span className="text-sm font-bold text-foreground">{title}</span>
          {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
        </button>
      )}
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

function FieldGroup({ label, multi, children }: { label: string; multi?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
        {multi && <span className="ml-1 normal-case text-muted-foreground/60">(múltiplos)</span>}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const cls = "w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none";
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {rows ? (
        <textarea rows={rows} className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type="text" className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

// ─── Patient Search Panel ─────────────────────────────────────────────────────

function PatientSearchPanel({ onSelect }: {
  onSelect: (record: ConsultaRecord) => void;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [consultas, setConsultas] = useState<ConsultaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user || !open || consultas.length > 0) return;
    setLoading(true);
    getConsultas(user.uid)
      .then(data => { setConsultas(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, open, consultas.length]);

  const filtered = consultas.filter(c =>
    !query || c.patientName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors text-left"
      >
        <Search size={14} className="text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">Buscar paciente anterior</p>
          <p className="text-[11px] text-muted-foreground">Pré-preenche dados da última consulta registrada</p>
        </div>
        {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Nome do paciente..."
              className="w-full bg-background border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {loading && <p className="text-xs text-muted-foreground text-center py-2">Carregando...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              {query ? "Nenhum paciente encontrado" : "Nenhuma consulta anterior registrada"}
            </p>
          )}
          {!loading && filtered.slice(0, 6).map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onSelect(c); setOpen(false); setQuery(""); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {c.patientName || "Paciente sem identificação"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {c.diagnosticoPrincipal || c.tipo}
                  {c.condutaFarma ? ` · ${c.condutaFarma.slice(0, 40)}…` : ""}
                </p>
              </div>
              <ChevronRight size={12} className="text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Advanced Module Helpers ──────────────────────────────────────────────────

function buildResumoInteligente(d: ConsultaState) {
  const cid = d.diagnosticoPrincipal;
  const cidDesc = cidLabel(cid);
  return {
    sindrome: d.qp[0] || d.qpLivre || "Não definida",
    cid: cid ? `${cid}${cidDesc ? ` — ${cidDesc}` : ""}` : "Não definido",
    risco: d.nivelRisco || "Não classificado",
    condutaPrincipal: d.condutaFarma || (d.condutaPsico.length ? d.condutaPsico[0] : "") || "Não definida",
  };
}

function buildSinaisAlerta(d: ConsultaState): string[] {
  const alertas: string[] = [];
  const suicida = d.risco["suicida"] || [];
  const sensoperc = d.eem["sensopercepcao"] || [];
  const pensConteudo = d.eem["pens-conteudo"] || [];
  const maniaSintomas = d.hpmaSintomas["mania"] || [];
  const funcPrejuizo = d.hpmaSintomas["funcionalidade"] || [];
  const insight = d.eem["insight"] || [];

  if (suicida.some(r => r.includes("plano") || r.includes("intenção") || r.includes("Tentativa")))
    alertas.push("Risco suicida com plano, intenção ou tentativa recente — avaliar internação imediata");
  if (suicida.some(r => r.includes("Meios letais")))
    alertas.push("Meios letais disponíveis — orientar restrição imediata à família");
  if (sensoperc.some(r => r.includes("Alucinações")))
    alertas.push("Alterações sensoperceptivas presentes — investigar causa e avaliar antipsicótico");
  if (pensConteudo.some(r => r.includes("Delírio")))
    alertas.push("Conteúdo de pensamento delirante — avaliar antipsicótico e nível de cuidado");
  if (funcPrejuizo.includes("Afastamento do trabalho") || funcPrejuizo.includes("Prejuízo no autocuidado"))
    alertas.push("Prejuízo funcional significativo — considerar nível de cuidado mais intensivo");
  const substUsadas = SUBSTANCIAS.filter(s => d.substancias[s.id]?.includes("usa"));
  if (substUsadas.length)
    alertas.push(`Uso ativo de substâncias (${substUsadas.map(s => s.label).join(", ")}) — avaliar interações e motivação`);
  if (maniaSintomas.length >= 3)
    alertas.push("Múltiplos sintomas maníacos — cuidado ao prescrever antidepressivos sem estabilizador");
  if (insight.includes("Crítica ausente") && suicida.some(r => !r.includes("Nega")))
    alertas.push("Insight ausente com risco identificado — risco de não adesão ao plano de segurança");
  const idadeStr = d.ident.idade;
  if (idadeStr && parseInt(idadeStr) > 60 && sensoperc.some(r => r.includes("visuais")))
    alertas.push("Idoso com alucinações visuais — descartar causa orgânica (delirium, DCL)");
  return alertas;
}

function buildNivelCuidado(d: ConsultaState): { nivel: string; justificativa: string; cor: "rose" | "orange" | "amber" | "emerald" } {
  const suicida = d.risco["suicida"] || [];
  const sensoperc = d.eem["sensopercepcao"] || [];
  const funcPrejuizo = d.hpmaSintomas["funcionalidade"] || [];
  const hasPsicose = sensoperc.some(r => r.includes("Alucinações"));
  const hasIntencao = suicida.some(r => r.includes("intenção") || r.includes("Intenção"));
  const hasPlanoOuTentativa = suicida.some(r => r.includes("plano") || r.includes("recente"));
  const hasFuncGrave = funcPrejuizo.includes("Afastamento do trabalho") || funcPrejuizo.includes("Prejuízo no autocuidado");

  if (d.nivelRisco === "Iminente" || hasIntencao)
    return { nivel: "Internação psiquiátrica", justificativa: "Risco iminente ou intenção de agir identificada", cor: "rose" };
  if (d.nivelRisco === "Elevado" || hasPlanoOuTentativa || (hasPsicose && hasFuncGrave))
    return { nivel: "Avaliar internação ou Hospital Dia", justificativa: "Risco elevado ou psicose com prejuízo funcional grave", cor: "orange" };
  if (d.nivelRisco === "Moderado" || (hasPsicose && !hasFuncGrave))
    return { nivel: "CAPS ou retorno precoce em 7–14 dias", justificativa: "Risco moderado ou sintomas psicóticos sem crise iminente", cor: "amber" };
  if (hasFuncGrave)
    return { nivel: "Hospital Dia ou seguimento intensivo", justificativa: "Prejuízo funcional grave sem risco iminente", cor: "amber" };
  return { nivel: "Ambulatorial com retorno programado", justificativa: "Risco baixo com suporte adequado", cor: "emerald" };
}

function buildQualidadeProntuario(d: ConsultaState): { score: number; items: { label: string; ok: boolean }[] } {
  const items = [
    { label: "Tipo de atendimento", ok: !!d.tipo },
    { label: "Dados de identificação", ok: !!(d.ident.idade || d.ident.nome) },
    { label: "Queixa principal", ok: d.qp.length > 0 || !!d.qpLivre },
    { label: "HPMA com início e sintomas", ok: d.hpmaInicio.length > 0 || Object.values(d.hpmaSintomas).some(v => v.length > 0) },
    { label: "Antecedentes investigados", ok: !!(d.antPsi["diagnosticos"]?.length || d.ttoPrevio || d.antClinico.length) },
    { label: "Medicamentos em uso (MUC)", ok: !!d.muc },
    { label: "Exame do estado mental", ok: Object.values(d.eem).some(v => v.length > 0) },
    { label: "Avaliação de risco suicida", ok: (d.risco["suicida"] || []).length > 0 },
    { label: "Hipótese diagnóstica (CID)", ok: !!d.diagnosticoPrincipal },
    { label: "Conduta farmacológica ou psicossocial", ok: !!d.condutaFarma || d.condutaPsico.length > 0 },
    { label: "Prazo de retorno definido", ok: !!d.condutaRetorno },
  ];
  const nOk = items.filter(i => i.ok).length;
  return { score: Math.round((nOk / items.length) * 100), items };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NovaConsultaPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ConsultaState>(INITIAL);
  const [copied, setCopied] = useState<string | false>(false);
  const [docAberto, setDocAberto] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [prevOpen, setPrevOpen] = useState(false);
  const [consultaId, setConsultaId] = useState<string | null>(null);
  const [prevState, setPrevState] = useState<ConsultaState | null>(null);
  const [savingCaso, setSavingCaso] = useState(false);
  const [casoSalvo, setCasoSalvo] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showPreviewRealce, setShowPreviewRealce] = useState(false);
  const [importedPanelOpen, setImportedPanelOpen] = useState(false);

  const set = useCallback(<K extends keyof ConsultaState>(key: K, val: ConsultaState[K]) => {
    setData(prev => ({ ...prev, [key]: val }));
  }, []);

  const toggleArr = useCallback((key: "qp" | "hpmaInicio" | "hpmaCurso" | "antClinico" | "antFamiliar" | "diferenciais" | "gravidade" | "especificadores" | "condutaPsico" | "condutaExames" | "condutaEncam" | "condutaSeguranca" | "sintomosAlvo", val: string) => {
    setData(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  }, []);

  const toggleSels = useCallback((field: "hpmaSintomas" | "antPsi" | "substancias" | "eem" | "risco" | "neurodev", sub: string, val: string, multi = true) => {
    setData(prev => {
      const sels = { ...prev[field] };
      const cur = sels[sub] || [];
      if (field === "eem" && val === "_normal") {
        sels[sub] = cur.includes("_normal") ? [] : ["_normal"];
      } else if (field === "eem") {
        sels[sub] = cur.includes(val) ? cur.filter(v => v !== val) : [...cur.filter(v => v !== "_normal"), val];
      } else if (multi) {
        sels[sub] = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      } else {
        sels[sub] = cur.includes(val) ? [] : [val];
      }
      return { ...prev, [field]: sels };
    });
  }, []);

  const toggleModule = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      advancedModules: { ...prev.advancedModules, [id]: !prev.advancedModules[id] },
    }));
  }, []);

  // Persist module preferences across consultations
  useEffect(() => {
    const saved = localStorage.getItem("md-advanced-modules");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        setData(prev => ({ ...prev, advancedModules: parsed }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (Object.keys(data.advancedModules).length > 0) {
      localStorage.setItem("md-advanced-modules", JSON.stringify(data.advancedModules));
    }
  }, [data.advancedModules]);

  useEffect(() => {
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // Pre-fill from "Usar como base de retorno" in historico page
  useEffect(() => {
    const retornoRaw = sessionStorage.getItem("md-retorno-state");
    if (!retornoRaw) return;
    try {
      const prev = JSON.parse(retornoRaw) as ConsultaState;
      setPrevState(prev);
      setData(current => ({
        ...INITIAL,
        ident: prev.ident || {},
        antPsi: prev.antPsi || {},
        antClinico: prev.antClinico || [],
        antFamiliar: prev.antFamiliar || [],
        antDetalhes: prev.antDetalhes || "",
        substancias: prev.substancias || {},
        muc: prev.condutaFarma || "",
        ttoPrevio: prev.ttoPrevio || "",
        alergias: prev.alergias || "",
        advancedModules: current.advancedModules,
      }));
    } catch {}
    sessionStorage.removeItem("md-retorno-state");
    sessionStorage.removeItem("md-retorno-id");
  }, []);

  const onSelectPatient = useCallback((record: ConsultaRecord) => {
    const prev = record.state as unknown as ConsultaState;
    setPrevState(prev);
    setData(current => ({
      ...current,
      ident: (prev.ident as Fields) || {},
      antPsi: (prev.antPsi as Sels) || {},
      antClinico: (prev.antClinico as string[]) || [],
      antFamiliar: (prev.antFamiliar as string[]) || [],
      antDetalhes: (prev.antDetalhes as string) || "",
      substancias: (prev.substancias as Sels) || {},
      muc: (prev.condutaFarma as string) || "",
      ttoPrevio: (prev.ttoPrevio as string) || "",
      alergias: (prev.alergias as string) || "",
    }));
  }, []);

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGenerateProntuario() {
    const text = gerarProntuario(data);
    set("prontuarioBase", text);
  }

  function handleConfirm() {
    set("prontuarioConfirmado", true);
    if (user) {
      saveConsulta({
        userId: user.uid,
        patientName: data.ident.nome || "Paciente sem identificação",
        tipo: data.tipo,
        diagnosticoPrincipal: data.diagnosticoPrincipal,
        nivelRisco: data.nivelRisco,
        condutaFarma: data.condutaFarma,
        prontuarioBase: data.prontuarioBase,
        state: data as unknown as Record<string, unknown>,
        completed: true,
      }).then(id => setConsultaId(id)).catch(console.error);
    }
    setStep(8);
  }

  async function handleSaveAsCaso() {
    if (!user || savingCaso) return;
    setSavingCaso(true);
    try {
      const key = await deriveKey(user.uid);
      const ident = data.ident as Record<string, string>;
      const [identificador_enc, dataNascimento_enc, contato_enc] = await Promise.all([
        encryptField(ident.nome || "", key),
        encryptField("", key),
        encryptField("", key),
      ]);
      const condutaText = [
        data.condutaFarma ? `Farmacoterapia: ${data.condutaFarma}` : "",
        ...(data.condutaPsico || []).map((p: string) => `Psicoterapia: ${p}`),
      ].filter(Boolean).join("\n");
      await saveCaso({
        userId: user.uid,
        titulo: `${data.diagnosticoPrincipal || data.diagnosticoLivre || "Caso clínico"} — ${new Date().toLocaleDateString("pt-BR")}`,
        idade: data.ident.idade ? Number(data.ident.idade) : null,
        sexo: (data.ident.sexo as "M" | "F" | "outro") || "",
        diagnosticoCID: data.diagnosticoPrincipal || "",
        hipotese: data.diagnosticoLivre || "",
        historico: data.prontuarioBase || "",
        historicoFamiliar: "",
        exameMental: "",
        medicamentosAtuais: data.condutaFarma || "",
        conduta: condutaText,
        observacoesEstudo: "",
        tags: data.diagnosticoPrincipal ? [data.diagnosticoPrincipal] : [],
        status: "ativo",
        identificador_enc,
        dataNascimento_enc,
        contato_enc,
      });
      toast.success("Caso clínico salvo com sucesso.");
      setCasoSalvo(true);
    } catch {
      toast.error("Erro ao salvar caso clínico.");
    } finally {
      setSavingCaso(false);
    }
  }

  // ── Step renderers ────────────────────────────────────────────────────────────

  function renderTipo() {
    return (
      <div className="space-y-4">
        {data.importadoTexto && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl px-4 py-3 flex gap-3 items-start">
            <FileText size={13} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                Atendimento anterior importado — disponível como referência no step 7
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("importadoTexto", "")}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium shrink-0"
            >
              Remover
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPOS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("tipo", t.value)}
              className={cn(
                "text-left p-4 rounded-2xl border transition-all",
                data.tipo === t.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <p className="font-semibold text-sm text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <ClipboardCheck size={14} />
          Importar atendimento anterior
        </button>
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl space-y-4 p-6">
              <h3 className="text-base font-bold text-foreground">Importar atendimento anterior</h3>
              <textarea
                rows={8}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Cole aqui o texto do prontuário anterior..."
                value={data.importadoTexto}
                onChange={e => set("importadoTexto", e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderIdent() {
    const f = (key: string) => data.ident[key] || "";
    const setF = (key: string, val: string) => set("ident", { ...data.ident, [key]: val });
    return (
      <div className="space-y-4">
        <PatientSearchPanel onSelect={onSelectPatient} />
        {prevState && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3 flex gap-3 items-start">
            <History size={13} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Dados pré-preenchidos da última consulta
                {prevState.ident?.nome ? ` de ${prevState.ident.nome}` : ""}
              </p>
              <p className="text-[11px] text-amber-600/80 mt-0.5">
                Revise e atualize as informações conforme a consulta atual.
              </p>
            </div>
          </div>
        )}
        <Block>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Nome (opcional)" value={f("nome")} onChange={v => setF("nome", v)} placeholder="Nome do paciente" />
            <TextInput label="Idade" value={f("idade")} onChange={v => setF("idade", v)} placeholder="Ex: 42" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Sexo</label>
              <div className="flex gap-2">
                {["Feminino", "Masculino", "Outro"].map(s => (
                  <Chip key={s} label={s} active={f("sexo") === s} onClick={() => setF("sexo", f("sexo") === s ? "" : s)} />
                ))}
              </div>
            </div>
            <TextInput label="Naturalidade" value={f("naturalidade")} onChange={v => setF("naturalidade", v)} placeholder="Cidade / estado" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Escolaridade" value={f("escolaridade")} onChange={v => setF("escolaridade", v)} placeholder="Ex: Ensino médio completo" />
            <TextInput label="Profissão" value={f("profissao")} onChange={v => setF("profissao", v)} placeholder="Ex: Auxiliar administrativo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Estado civil" value={f("estadoCivil")} onChange={v => setF("estadoCivil", v)} placeholder="Ex: Casado/a" />
            <TextInput label="Com quem mora" value={f("comQuemMora")} onChange={v => setF("comQuemMora", v)} placeholder="Ex: Cônjuge e filhos" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Fonte das informações" value={f("fonteInfo")} onChange={v => setF("fonteInfo", v)} placeholder="Ex: Relato próprio e familiar" />
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Confiabilidade</label>
              <div className="flex gap-2 flex-wrap">
                {["Boa", "Regular", "Prejudicada"].map(s => (
                  <Chip key={s} label={s} active={f("confiabilidade") === s} onClick={() => setF("confiabilidade", f("confiabilidade") === s ? "" : s)} />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Acompanhante presente</label>
            <div className="flex gap-2">
              {[{ v: "sim", l: "Sim" }, { v: "nao", l: "Não" }].map(s => (
                <Chip key={s.v} label={s.l} active={f("acompanhante") === s.v} onClick={() => setF("acompanhante", f("acompanhante") === s.v ? "" : s.v)} />
              ))}
            </div>
          </div>
        </Block>
      </div>
    );
  }

  function renderQPHPMA() {
    return (
      <div className="space-y-4">
        <Block title="Queixa Principal (QP)">
          <FieldGroup label="Selecione as queixas" multi>
            {QP_CHIPS.map(q => (
              <Chip key={q} label={q} active={data.qp.includes(q)} onClick={() => toggleArr("qp", q)} />
            ))}
          </FieldGroup>
          <TextInput label="Detalhes adicionais / queixa em palavras do paciente" value={data.qpLivre} onChange={v => set("qpLivre", v)} placeholder='Ex: "Sinto que não consigo mais fazer nada."' rows={2} />
        </Block>

        <Block title="HPMA — Início e curso">
          <FieldGroup label="Início do quadro" multi>
            {HPMA_INICIO.map(o => (
              <Chip key={o} label={o} active={data.hpmaInicio.includes(o)} onClick={() => toggleArr("hpmaInicio", o)} />
            ))}
          </FieldGroup>
          <FieldGroup label="Curso" multi>
            {HPMA_CURSO.map(o => (
              <Chip key={o} label={o} active={data.hpmaCurso.includes(o)} onClick={() => toggleArr("hpmaCurso", o)} />
            ))}
          </FieldGroup>
        </Block>

        {HPMA_DOMINIOS.map(dom => (
          <Block key={dom.id} title={dom.label}>
            <div className="flex flex-wrap gap-2">
              {dom.opcoes.map(o => (
                <Chip key={o} label={o} active={(data.hpmaSintomas[dom.id] || []).includes(o)} onClick={() => toggleSels("hpmaSintomas", dom.id, o)} />
              ))}
            </div>
          </Block>
        ))}

        <Block title="Observações adicionais da HPMA">
          <TextInput label="Campo livre" value={data.hpmaLivre} onChange={v => set("hpmaLivre", v)} placeholder="Informações relevantes não cobertas acima..." rows={3} />
        </Block>

        <Block title="Neurodesenvolvimento (TEA / TDAH / DI)">
          <p className="text-[11px] text-muted-foreground">Selecione características do neurodesenvolvimento relevantes ao caso.</p>
          <div className="space-y-4">
            {NEURODEV_DOMINIOS.map(dom => (
              <div key={dom.id} className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{dom.label}</p>
                <div className="flex flex-wrap gap-2">
                  {dom.opcoes.map(o => (
                    <Chip key={o} label={o} active={(data.neurodev[dom.id] || []).includes(o)} onClick={() => toggleSels("neurodev", dom.id, o)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Block>
      </div>
    );
  }

  function renderAntecedentes() {
    return (
      <div className="space-y-4">
        <Block title="Antecedentes psiquiátricos">
          <FieldGroup label="Diagnósticos prévios" multi>
            {ANT_PSI_DIAGS.map(d => (
              <Chip key={d} label={d} active={(data.antPsi["diagnosticos"] || []).includes(d)} onClick={() => toggleSels("antPsi", "diagnosticos", d)} />
            ))}
          </FieldGroup>
          <FieldGroup label="Internações psiquiátricas prévias">
            {[{ v: "sim", l: "Sim" }, { v: "nao", l: "Não" }].map(s => (
              <Chip key={s.v} label={s.l} active={(data.antPsi["internacoes"] || []).includes(s.v)} onClick={() => toggleSels("antPsi", "internacoes", s.v, false)} />
            ))}
          </FieldGroup>
          <FieldGroup label="Tentativas de suicídio prévias">
            {[{ v: "sim", l: "Sim" }, { v: "nao", l: "Não" }].map(s => (
              <Chip key={s.v} label={s.l} active={(data.antPsi["tentativas"] || []).includes(s.v)} onClick={() => toggleSels("antPsi", "tentativas", s.v, false)} />
            ))}
          </FieldGroup>
          <FieldGroup label="Automutilação">
            {[{ v: "sim", l: "Sim" }, { v: "nao", l: "Não" }].map(s => (
              <Chip key={s.v} label={s.l} active={(data.antPsi["automutilacao"] || []).includes(s.v)} onClick={() => toggleSels("antPsi", "automutilacao", s.v, false)} />
            ))}
          </FieldGroup>
          <FieldGroup label="Psicoterapia prévia">
            {[{ v: "sim", l: "Sim" }, { v: "nao", l: "Não" }].map(s => (
              <Chip key={s.v} label={s.l} active={(data.antPsi["psicoterapia"] || []).includes(s.v)} onClick={() => toggleSels("antPsi", "psicoterapia", s.v, false)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Tratamento prévio (TTO Prévio)">
          <TextInput label="Medicações prévias, resposta e efeitos adversos" value={data.ttoPrevio} onChange={v => set("ttoPrevio", v)} placeholder="Ex: Uso prévio de sertralina 50mg, resposta parcial. Nega internações." rows={3} />
        </Block>

        <Block title="Medicamentos em uso (MUC) e alergias">
          <TextInput label="Medicamentos em uso atual" value={data.muc} onChange={v => set("muc", v)} placeholder="Ex: Sertralina 100mg 1x/dia, clonazepam 0,5mg à noite." rows={2} />
          <TextInput label="Alergias medicamentosas" value={data.alergias} onChange={v => set("alergias", v)} placeholder="Ex: Nega alergias. / Alergia à amoxicilina." />
        </Block>

        <Block title="Antecedentes pessoais clínicos">
          <FieldGroup label="Comorbidades clínicas" multi>
            {ANT_CLINICOS.map(d => (
              <Chip key={d} label={d} active={data.antClinico.includes(d)} onClick={() => toggleArr("antClinico", d)} />
            ))}
          </FieldGroup>
          <TextInput label="Outros detalhes clínicos" value={data.antDetalhes} onChange={v => set("antDetalhes", v)} placeholder="Ex: Epilepsia controlada com fenobarbital." rows={2} />
        </Block>

        <Block title="Antecedentes familiares">
          <FieldGroup label="História familiar de" multi>
            {ANT_FAMILIARES.map(d => (
              <Chip key={d} label={d} active={data.antFamiliar.includes(d)} onClick={() => toggleArr("antFamiliar", d)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Uso de substâncias">
          <div className="grid grid-cols-1 gap-3">
            {SUBSTANCIAS.map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <Chip label={s.label} active={(data.substancias[s.id] || []).includes("usa")} onClick={() => toggleSels("substancias", s.id, "usa", false)} />
                {(data.substancias[s.id] || []).includes("usa") && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">▲ Em uso</span>
                )}
              </div>
            ))}
          </div>
        </Block>
      </div>
    );
  }

  function renderEEM() {
    return (
      <div className="space-y-3">
        {EEM_DOMINIOS.map(dom => {
          const sels = data.eem[dom.id] || [];
          const isNormal = sels.includes("_normal");
          return (
            <div key={dom.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-foreground">{dom.label}</span>
                <NormalChip active={isNormal} onClick={() => toggleSels("eem", dom.id, "_normal")} />
              </div>
              <div className="p-5">
                {isNormal ? (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">{dom.normal}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {dom.opcoes.map(o => (
                      <Chip key={o} label={o} active={sels.includes(o)} onClick={() => toggleSels("eem", dom.id, o)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <Block title="Observações adicionais do EEM">
          <TextInput label="Campo livre" value={data.eemLivre} onChange={v => set("eemLivre", v)} placeholder="Informações complementares ao exame mental..." rows={3} />
        </Block>
      </div>
    );
  }

  function renderRiscoHD() {
    return (
      <div className="space-y-4">
        <Block title="Risco suicida">
          <FieldGroup label="Selecione o que se aplica" multi>
            {RISCO_SUICIDA.map(r => (
              <Chip key={r} label={r} active={(data.risco["suicida"] || []).includes(r)} onClick={() => toggleSels("risco", "suicida", r)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Risco heteroagressivo">
          <FieldGroup label="Selecione o que se aplica" multi>
            {RISCO_HETERO.map(r => (
              <Chip key={r} label={r} active={(data.risco["hetero"] || []).includes(r)} onClick={() => toggleSels("risco", "hetero", r)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Fatores protetores">
          <FieldGroup label="Presentes nesta avaliação" multi>
            {FATORES_PROTETORES.map(r => (
              <Chip key={r} label={r} active={(data.risco["protetores"] || []).includes(r)} onClick={() => toggleSels("risco", "protetores", r)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Nível de risco geral">
          <FieldGroup label="Classificação do médico">
            {["Baixo", "Moderado", "Elevado", "Iminente"].map(r => (
              <Chip key={r} label={r} active={data.nivelRisco === r} onClick={() => set("nivelRisco", data.nivelRisco === r ? "" : r)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Hipótese diagnóstica">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">CID-10 principal</label>
            <select
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={data.diagnosticoPrincipal}
              onChange={e => set("diagnosticoPrincipal", e.target.value)}
            >
              <option value="">Selecionar CID-10...</option>
              {CIDS.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.desc}</option>
              ))}
            </select>
          </div>
          <TextInput label="Descrição livre / hipótese adicional" value={data.diagnosticoLivre} onChange={v => set("diagnosticoLivre", v)} placeholder="Ex: Episódio depressivo em investigação de bipolaridade." />
          <FieldGroup label="Gravidade" multi>
            {GRAVIDADES.map(g => (
              <Chip key={g} label={g} active={data.gravidade === g} onClick={() => set("gravidade", data.gravidade === g ? "" : g)} />
            ))}
          </FieldGroup>
          <FieldGroup label="Especificadores" multi>
            {ESPECIFICADORES.map(e => (
              <Chip key={e} label={e} active={data.especificadores.includes(e)} onClick={() => toggleArr("especificadores", e)} />
            ))}
          </FieldGroup>
          <TextInput label="Diagnósticos diferenciais (um por linha ou separados por vírgula)" value={data.diferenciais.join(", ")} onChange={v => set("diferenciais", v ? v.split(",").map(s => s.trim()).filter(Boolean) : [])} placeholder="Ex: TAB, Transtorno esquizoafetivo, Depressão por substância" />
        </Block>

        {data.advancedModules["modo-residente"] && data.diagnosticoPrincipal && (() => {
          const dica = MODO_RESIDENTE_DICAS[data.diagnosticoPrincipal] ||
                       MODO_RESIDENTE_DICAS[data.diagnosticoPrincipal.slice(0, 4)] ||
                       MODO_RESIDENTE_DICAS[data.diagnosticoPrincipal.slice(0, 3)];
          if (!dica) return null;
          return (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Brain size={13} className="text-indigo-600 shrink-0" />
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Modo Residente — {dica.resumo}</p>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Critérios-chave</p>
                  <p className="text-foreground">{dica.criterios}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Dicas clínicas</p>
                  <ul className="space-y-1">
                    {dica.dicas.map((d, i) => (
                      <li key={i} className="flex gap-2 text-foreground">
                        <span className="text-indigo-500 shrink-0">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        {data.advancedModules["raciocinio-clinico"] && (
          <Block title="Raciocínio Clínico Documentado">
            <TextInput
              label="Justificativa diagnóstica e terapêutica"
              value={data.raciocinioCli}
              onChange={v => set("raciocinioCli", v)}
              placeholder="Ex: Quadro compatível com episódio depressivo grave com sintomas melancólicos, sem resposta à ISRS em dose adequada. Opta-se por IRSN em associação com…"
              rows={4}
            />
          </Block>
        )}
      </div>
    );
  }

  function renderConduta() {
    return (
      <div className="space-y-4">
        <Block title="Formato da conduta">
          <FieldGroup label="Estilo de saída">
            <Chip label="Numerada (1. 2. 3.)" active={data.condutaFormat === "numerada"} onClick={() => set("condutaFormat", "numerada")} />
            <Chip label="Texto corrido" active={data.condutaFormat === "corrida"} onClick={() => set("condutaFormat", "corrida")} />
          </FieldGroup>
        </Block>

        <Block title="Texto-base de conduta">
          <div className="flex flex-wrap gap-2">
            {[
              { v: "", l: "Não usar" },
              { v: "completo", l: "Completo" },
              { v: "simplificado", l: "Simplificado" },
            ].map(opt => (
              <Chip key={opt.v} label={opt.l} active={data.condutaBase === opt.v} onClick={() => set("condutaBase", opt.v)} />
            ))}
          </div>
          {data.condutaBase !== "" && (
            <div className="mt-2 bg-muted/40 border border-border rounded-xl px-3.5 py-3 text-[11px] text-muted-foreground leading-relaxed">
              {data.condutaBase === "completo" ? CONDUTA_BASE_COMPLETO : CONDUTA_BASE_SIMPLIFICADO}
            </div>
          )}
        </Block>

        <Block title="Farmacoterapia">
          <TextInput label="Prescrição / ajuste medicamentoso" value={data.condutaFarma} onChange={v => set("condutaFarma", v)} placeholder="Ex: Iniciar sertralina 50mg 1x/dia pela manhã. Quetiapina 25mg à noite para sono." rows={3} />
        </Block>

        {data.advancedModules["integracao-farmacologia"] && data.condutaFarma && (() => {
          const texto = data.condutaFarma.toLowerCase();
          const encontrados = FARMACOS_LINKS.filter(f => texto.includes(f.nome));
          const unicos = encontrados.filter((f, i, a) => a.findIndex(x => x.slug === f.slug) === i);
          if (unicos.length === 0) return null;
          return (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen size={13} className="text-blue-600 shrink-0" />
                <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400">Integração Farmacológica — links da Biblioteca</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {unicos.map(f => (
                  <Link
                    key={f.slug}
                    href={`/psicofarmacologia/biblioteca/moleculas?q=${f.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg transition-colors capitalize"
                  >
                    {f.nome} →
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        <Block title="Psicoterapia">
          <FieldGroup label="Modalidade indicada" multi>
            {CONDUTA_PSICO.map(p => (
              <Chip key={p} label={p} active={data.condutaPsico.includes(p)} onClick={() => toggleArr("condutaPsico", p)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Exames solicitados">
          <FieldGroup label="Selecionar exames" multi>
            {CONDUTA_EXAMES.map(e => (
              <Chip key={e} label={e} active={data.condutaExames.includes(e)} onClick={() => toggleArr("condutaExames", e)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Encaminhamentos">
          <FieldGroup label="Encaminhar para" multi>
            {CONDUTA_ENCAM.map(e => (
              <Chip key={e} label={e} active={data.condutaEncam.includes(e)} onClick={() => toggleArr("condutaEncam", e)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Plano de segurança">
          <FieldGroup label="Medidas de segurança discutidas" multi>
            {CONDUTA_SEGURANCA.map(s => (
              <Chip key={s} label={s} active={data.condutaSeguranca.includes(s)} onClick={() => toggleArr("condutaSeguranca", s)} />
            ))}
          </FieldGroup>
        </Block>

        <Block title="Retorno e observações">
          <TextInput label="Prazo de retorno" value={data.condutaRetorno} onChange={v => set("condutaRetorno", v)} placeholder="Ex: 14 dias / 1 mês / antes se piora" />
          <TextInput label="Observações adicionais" value={data.condutaObs} onChange={v => set("condutaObs", v)} placeholder="Orientações específicas ao caso..." rows={2} />
        </Block>

        {data.advancedModules["adesao"] && (
          <Block title="Adesão ao Tratamento">
            <FieldGroup label="Padrão de adesão atual">
              {ADESAO_OPCOES.map(o => (
                <Chip key={o} label={o} active={data.adesao === o} onClick={() => set("adesao", data.adesao === o ? "" : o)} />
              ))}
            </FieldGroup>
          </Block>
        )}

        {data.advancedModules["sintomas-alvo"] && (
          <Block title="Sintomas-Alvo para Monitoramento">
            <FieldGroup label="Sintomas a acompanhar no retorno" multi>
              {SINTOMAS_ALVO_OPCOES.map(o => (
                <Chip key={o} label={o} active={data.sintomosAlvo.includes(o)} onClick={() => toggleArr("sintomosAlvo", o)} />
              ))}
            </FieldGroup>
          </Block>
        )}

        {data.advancedModules["metas-retorno"] && (
          <Block title="Metas até o Próximo Retorno">
            <TextInput
              label="Objetivos definidos com o paciente"
              value={data.metasRetorno}
              onChange={v => set("metasRetorno", v)}
              placeholder="Ex: Iniciar medicação regularmente, dormir antes das 23h, retornar com exames solicitados."
              rows={3}
            />
          </Block>
        )}

        {data.advancedModules["prejuizo-funcional"] && (
          <Block title="Prejuízo Funcional Detalhado">
            <p className="text-[11px] text-muted-foreground">Avalie o grau de prejuízo em cada área de funcionamento:</p>
            <div className="space-y-3">
              {PREJUIZO_AREAS.map(area => (
                <div key={area} className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">{area}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {NIVEL_PREJUIZO.map(nivel => (
                      <Chip
                        key={nivel}
                        label={nivel}
                        active={data.prejuizoFuncional[area] === nivel}
                        onClick={() => set("prejuizoFuncional", {
                          ...data.prejuizoFuncional,
                          [area]: data.prejuizoFuncional[area] === nivel ? "" : nivel,
                        })}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Block>
        )}

        {data.advancedModules["capacidade-laboral"] && (
          <Block title="Módulo de Capacidade Laboral (INSS / Perícia)">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Atividade profissional atual</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={data.capacidadeLaboral["atividade"] || ""}
                onChange={e => set("capacidadeLaboral", { ...data.capacidadeLaboral, atividade: e.target.value })}
                placeholder="Ex: Auxiliar de enfermagem, 40h/sem"
              />
            </div>
            <FieldGroup label="Exigências do cargo que se aplicam" multi>
              {CAPACIDADE_LABORAL_ATIVIDADES.map(a => (
                <Chip
                  key={a}
                  label={a}
                  active={(data.capacidadeLaboral["exigencias"] || "").includes(a)}
                  onClick={() => {
                    const atual = (data.capacidadeLaboral["exigencias"] || "").split("|").filter(Boolean);
                    const novo = atual.includes(a) ? atual.filter(x => x !== a) : [...atual, a];
                    set("capacidadeLaboral", { ...data.capacidadeLaboral, exigencias: novo.join("|") });
                  }}
                />
              ))}
            </FieldGroup>
            <FieldGroup label="Limitações identificadas" multi>
              {CAPACIDADE_LABORAL_LIMITACOES.map(l => (
                <Chip
                  key={l}
                  label={l}
                  active={(data.capacidadeLaboral["limitacoes"] || "").includes(l)}
                  onClick={() => {
                    const atual = (data.capacidadeLaboral["limitacoes"] || "").split("|").filter(Boolean);
                    const novo = atual.includes(l) ? atual.filter(x => x !== l) : [...atual, l];
                    set("capacidadeLaboral", { ...data.capacidadeLaboral, limitacoes: novo.join("|") });
                  }}
                />
              ))}
            </FieldGroup>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Conclusão de capacidade laboral</label>
              <div className="flex flex-wrap gap-2">
                {["Apto", "Parcialmente apto", "Inapto temporariamente", "Inapto de forma permanente"].map(c => (
                  <Chip
                    key={c}
                    label={c}
                    active={data.capacidadeLaboral["conclusao"] === c}
                    onClick={() => set("capacidadeLaboral", {
                      ...data.capacidadeLaboral,
                      conclusao: data.capacidadeLaboral["conclusao"] === c ? "" : c,
                    })}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Prazo sugerido de afastamento / reavaliação</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={data.capacidadeLaboral["prazo"] || ""}
                onChange={e => set("capacidadeLaboral", { ...data.capacidadeLaboral, prazo: e.target.value })}
                placeholder="Ex: 60 dias / a critério clínico"
              />
            </div>
          </Block>
        )}
      </div>
    );
  }

  function renderProntuario() {
    const resumo = buildResumoInteligente(data);
    const alertas = buildSinaisAlerta(data);
    const nivelCuidado = buildNivelCuidado(data);
    const qualidade = buildQualidadeProntuario(data);
    const segurancaChecklist = [
      { label: "Risco suicida formalmente avaliado", ok: (data.risco["suicida"] || []).length > 0 },
      { label: "Uso de substâncias investigado", ok: Object.values(data.substancias).some(v => v.length > 0) },
      { label: "Sintomas psicóticos investigados", ok: (data.eem["sensopercepcao"] || []).length > 0 || (data.eem["pens-conteudo"] || []).length > 0 },
      { label: "CID-10 registrado", ok: !!data.diagnosticoPrincipal },
      { label: "Conduta documentada", ok: !!data.condutaFarma || data.condutaPsico.length > 0 },
      { label: "Retorno programado", ok: !!data.condutaRetorno },
      { label: "Plano de segurança quando indicado", ok: data.condutaSeguranca.length > 0 || !(data.risco["suicida"] || []).some(r => !r.includes("Nega")) },
    ];
    const segurancaOk = segurancaChecklist.every(c => c.ok);

    return (
      <div className="space-y-4">

        {/* Evolução Comparativa */}
        {data.advancedModules["evolucao-comparativa"] && prevState && (
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <History size={13} className="text-teal-600 shrink-0" />
              <p className="text-xs font-bold text-teal-700 dark:text-teal-400">Evolução Comparativa — Consulta Anterior</p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {/* Risco */}
              {(() => {
                const prevRisco = (prevState.risco["suicida"] || []).join(", ") || "Não registrado";
                const currRisco = (data.risco["suicida"] || []).join(", ") || "Não avaliado";
                return (
                  <div className="grid grid-cols-2 gap-3 bg-background rounded-xl p-3">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Risco anterior</p>
                      <p className="text-foreground">{prevRisco}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Risco atual</p>
                      <p className="text-foreground">{currRisco}</p>
                    </div>
                  </div>
                );
              })()}
              {/* Diagnóstico */}
              {(prevState.diagnosticoPrincipal || data.diagnosticoPrincipal) && (
                <div className="grid grid-cols-2 gap-3 bg-background rounded-xl p-3">
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">HD anterior</p>
                    <p className="text-foreground">{prevState.diagnosticoPrincipal || "—"}{prevState.gravidade ? ` (${prevState.gravidade})` : ""}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">HD atual</p>
                    <p className="text-foreground">{data.diagnosticoPrincipal || "—"}{data.gravidade ? ` (${data.gravidade})` : ""}</p>
                  </div>
                </div>
              )}
              {/* Conduta */}
              {(prevState.condutaFarma || data.condutaFarma) && (
                <div className="grid grid-cols-2 gap-3 bg-background rounded-xl p-3">
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Conduta anterior</p>
                    <p className="text-foreground line-clamp-3">{prevState.condutaFarma || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Conduta atual</p>
                    <p className="text-foreground line-clamp-3">{data.condutaFarma || "—"}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">Dados da consulta anterior. Use para embasar a evolução no prontuário.</p>
          </div>
        )}

        {/* Resumo Inteligente */}
        {data.advancedModules["resumo-inteligente"] && (
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-violet-600 shrink-0" />
              <p className="text-xs font-bold text-violet-700 dark:text-violet-400">Resumo Clínico Inteligente</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Síndrome / QP</p>
                <p className="text-foreground">{resumo.sindrome}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">CID-10</p>
                <p className="text-foreground">{resumo.cid}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Nível de risco</p>
                <p className="text-foreground">{resumo.risco}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Conduta principal</p>
                <p className="text-foreground">{resumo.condutaPrincipal}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sinais de Alerta */}
        {data.advancedModules["sinais-alerta"] && alertas.length > 0 && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={13} className="text-rose-600 shrink-0" />
              <p className="text-xs font-bold text-rose-700 dark:text-rose-400">Sinais de Alerta</p>
            </div>
            <ul className="space-y-2">
              {alertas.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <p className="text-xs text-foreground leading-relaxed">{a}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.advancedModules["sinais-alerta"] && alertas.length === 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-5 py-3 flex gap-3 items-center">
            <Check size={13} className="text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400">Nenhum sinal de alerta identificado nos dados preenchidos.</p>
          </div>
        )}

        {/* Nível de Cuidado */}
        {data.advancedModules["nivel-cuidado"] && (
          <div className={cn(
            "rounded-2xl p-5 space-y-2 border",
            nivelCuidado.cor === "rose"   ? "bg-rose-500/5 border-rose-500/20"     :
            nivelCuidado.cor === "orange" ? "bg-orange-500/5 border-orange-500/20" :
            nivelCuidado.cor === "amber"  ? "bg-amber-500/5 border-amber-500/20"   :
                                            "bg-emerald-500/5 border-emerald-500/20"
          )}>
            <div className="flex items-center gap-2">
              <Info size={13} className={cn(
                "shrink-0",
                nivelCuidado.cor === "rose"   ? "text-rose-600"    :
                nivelCuidado.cor === "orange" ? "text-orange-600"  :
                nivelCuidado.cor === "amber"  ? "text-amber-600"   : "text-emerald-600"
              )} />
              <p className={cn(
                "text-xs font-bold",
                nivelCuidado.cor === "rose"   ? "text-rose-700 dark:text-rose-400"     :
                nivelCuidado.cor === "orange" ? "text-orange-700 dark:text-orange-400" :
                nivelCuidado.cor === "amber"  ? "text-amber-700 dark:text-amber-400"   :
                                                "text-emerald-700 dark:text-emerald-400"
              )}>Nível de Cuidado Recomendado</p>
            </div>
            <p className="text-sm font-bold text-foreground">{nivelCuidado.nivel}</p>
            <p className="text-xs text-muted-foreground">{nivelCuidado.justificativa}</p>
          </div>
        )}

        {/* Qualidade do Prontuário */}
        {data.advancedModules["qualidade-prontuario"] && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={13} className="text-primary shrink-0" />
                <p className="text-xs font-bold text-foreground">Qualidade do Prontuário</p>
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                qualidade.score >= 80 ? "bg-green-500/10 text-green-600" :
                qualidade.score >= 50 ? "bg-amber-500/10 text-amber-600" :
                                        "bg-rose-500/10 text-rose-600"
              )}>{qualidade.score}% completo</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  qualidade.score >= 80 ? "bg-green-500" : qualidade.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                )}
                style={{ width: `${qualidade.score}%` }}
              />
            </div>
            <div className="space-y-1.5">
              {qualidade.items.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.ok
                    ? <Check size={11} className="text-green-500 shrink-0" />
                    : <span className="inline-block w-2.5 h-2.5 rounded-full border border-muted-foreground/30 shrink-0" />}
                  <span className={cn("text-[11px]", item.ok ? "text-foreground" : "text-muted-foreground/60")}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist de Segurança */}
        {data.advancedModules["checklist-seguranca"] && (
          <div className={cn(
            "rounded-2xl p-5 space-y-3 border",
            segurancaOk ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
          )}>
            <div className="flex items-center gap-2">
              <ClipboardCheck size={13} className={cn("shrink-0", segurancaOk ? "text-emerald-600" : "text-amber-600")} />
              <p className={cn("text-xs font-bold", segurancaOk ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")}>
                Checklist de Segurança{segurancaOk ? " — Completo" : " — Itens pendentes"}
              </p>
            </div>
            <div className="space-y-2">
              {segurancaChecklist.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.ok
                    ? <Check size={11} className="text-emerald-500 shrink-0" />
                    : <AlertCircle size={11} className="text-amber-500 shrink-0" />}
                  <span className={cn("text-[11px]", item.ok ? "text-foreground" : "text-amber-700 dark:text-amber-400 font-medium")}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Atendimento anterior importado de referência */}
        {data.importadoTexto && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setImportedPanelOpen(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors text-left"
            >
              <FileText size={14} className="text-blue-500 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">Atendimento anterior importado</p>
                <p className="text-[11px] text-muted-foreground">Texto colado para referência</p>
              </div>
              {importedPanelOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </button>
            {importedPanelOpen && (
              <div className="border-t border-border p-5">
                <pre className="text-[11px] text-foreground whitespace-pre-wrap font-sans bg-muted/30 border border-border rounded-xl px-3 py-2 leading-relaxed max-h-48 overflow-y-auto">
                  {data.importadoTexto}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Consulta anterior de referência */}
        {prevState && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setPrevOpen(v => !v)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors text-left"
            >
              <History size={14} className="text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">Consulta anterior de referência</p>
                <p className="text-[11px] text-muted-foreground">
                  {prevState.ident?.nome ? `Paciente: ${prevState.ident.nome}` : "Paciente sem identificação"}
                  {prevState.diagnosticoPrincipal ? ` · ${prevState.diagnosticoPrincipal}` : ""}
                </p>
              </div>
              {prevOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </button>
            {prevOpen && (
              <div className="border-t border-border p-5 space-y-3">
                {prevState.condutaFarma && (
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Prescrição anterior</p>
                    <pre className="text-[11px] text-foreground whitespace-pre-wrap font-sans bg-muted/30 border border-border rounded-xl px-3 py-2 leading-relaxed">
                      {prevState.condutaFarma}
                    </pre>
                  </div>
                )}
                {prevState.prontuarioBase && (
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Prontuário anterior</p>
                    <pre className="text-[11px] text-foreground whitespace-pre-wrap font-sans bg-muted/30 border border-border rounded-xl px-3 py-2 leading-relaxed max-h-48 overflow-y-auto">
                      {prevState.prontuarioBase}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Block title="Nível de detalhe da saída">
          <FieldGroup label="Nível">
            {[
              { id: "completo", label: "Completo", desc: "Máximo detalhamento — perícia, discussão clínica, caso complexo" },
              { id: "simplificado", label: "Simplificado", desc: "Padrão ambulatorial — coeso e objetivo" },
              { id: "enxuto", label: "Enxuto", desc: "Breve — atendimento de alto fluxo, retorno rápido" },
            ].map(o => (
              <Chip key={o.id} label={o.label} active={data.outputLevel === o.id} onClick={() => set("outputLevel", o.id)} />
            ))}
          </FieldGroup>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Omitir seções vazias</label>
            <Chip label={data.omitirVazias ? "Sim" : "Não"} active={data.omitirVazias} onClick={() => set("omitirVazias", !data.omitirVazias)} />
          </div>
        </Block>

        <Block title="Formato da HPMA">
          <div className="flex flex-wrap gap-2">
            <Chip label="Tópicos" active={data.hpmaView === "topicos"} onClick={() => set("hpmaView", "topicos")} />
            <Chip label="Texto corrido" active={data.hpmaView === "corrido"} onClick={() => set("hpmaView", "corrido")} />
          </div>
        </Block>

        <Block title="Realce de alterações clínicas">
          <div className="flex flex-wrap gap-2">
            <Chip label="Negrito (**texto**)" active={data.realce === "negrito"} onClick={() => set("realce", "negrito")} />
            <Chip label="CAPS LOCK" active={data.realce === "caps"} onClick={() => set("realce", "caps")} />
            <Chip label="Sem realce" active={data.realce === "nao"} onClick={() => set("realce", "nao")} />
          </div>
        </Block>

        <Block title="Escolha o layout do prontuário">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LAYOUTS.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => set("layout", l.id)}
                className={cn(
                  "text-left p-4 rounded-2xl border transition-all",
                  data.layout === l.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <p className="font-semibold text-sm text-foreground">{l.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
              </button>
            ))}
          </div>
        </Block>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGenerateProntuario}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <FileText size={15} />
            Gerar prontuário
          </button>
          {data.prontuarioBase && (
            <button
              type="button"
              onClick={() => copy(data.prontuarioBase, "prontuario")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all",
                copied === "prontuario"
                  ? "bg-green-500/10 text-green-600 border-green-500/30"
                  : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {copied === "prontuario" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "prontuario" ? "Copiado!" : "Copiar"}
            </button>
          )}
        </div>

        {data.prontuarioBase && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Prontuário-base</span>
              <span className="text-xs text-muted-foreground">Revise e edite antes de confirmar</span>
            </div>
            <div className="p-5 space-y-4">
              <textarea
                rows={20}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={data.prontuarioBase}
                onChange={e => set("prontuarioBase", e.target.value)}
              />
              {data.realce === "negrito" && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowPreviewRealce(v => !v)}
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <Star size={12} />
                    {showPreviewRealce ? "Ocultar preview com realce" : "Preview com realce"}
                  </button>
                  {showPreviewRealce && (
                    <div
                      className="bg-background border border-border rounded-xl px-3.5 py-3 text-xs text-foreground leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: data.prontuarioBase
                          .replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                <Check size={16} />
                Confirmar prontuário-base e continuar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Post-consultation central ─────────────────────────────────────────────────

  const POS_DOCS = [
    { id: "atestado-cid", label: "Atestado com CID", icon: FileText, gen: () => gerarAtestado(data, true) },
    { id: "atestado-sem-cid", label: "Atestado sem CID", icon: FileText, gen: () => gerarAtestado(data, false) },
    { id: "relatorio-simples", label: "Relatório médico simples", icon: ClipboardList, gen: () => gerarRelatorioSimples(data) },
    { id: "relatorio-inss", label: "Relatório INSS / Perícia", icon: BookOpen, gen: () => gerarRelatorioINSS(data) },
    { id: "encaminhamento", label: "Encaminhamento", icon: FileOutput, gen: () => gerarEncaminhamento(data) },
    { id: "orientacao-paciente", label: "Orientação ao paciente", icon: User, gen: () => gerarOrientacaoPaciente(data) },
    { id: "orientacao-familiar", label: "Orientação familiar", icon: Users, gen: () => gerarOrientacaoFamiliar(data) },
    { id: "plano-crise", label: "Plano de crise", icon: AlertTriangle, gen: () => gerarPlanoCrise(data) },
  ];

  function renderPosConsulta() {
    return (
      <div className="space-y-5">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-5 py-4 flex gap-3">
          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
            Prontuário-base confirmado. Selecione abaixo os documentos pós-consulta que deseja gerar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POS_DOCS.map(doc => {
            const Icon = doc.icon;
            const isOpen = docAberto === doc.id;
            const texto = isOpen ? doc.gen() : "";
            return (
              <div key={doc.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDocAberto(isOpen ? null : doc.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-primary shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{doc.label}</span>
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                    <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans bg-background border border-border rounded-xl p-4 max-h-60 overflow-y-auto">
                      {texto}
                    </pre>
                    <button
                      type="button"
                      onClick={() => copy(texto, doc.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                        copied === doc.id
                          ? "bg-green-500/10 text-green-600 border-green-500/30"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {copied === doc.id ? <Check size={12} /> : <Copy size={12} />}
                      {copied === doc.id ? "Copiado!" : "Copiar texto"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-bold text-foreground mb-3">Prontuário-base confirmado</p>
          <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans bg-background border border-border rounded-xl p-4 max-h-80 overflow-y-auto">
            {data.prontuarioBase}
          </pre>
          <button
            type="button"
            onClick={() => copy(data.prontuarioBase, "prontuario-base-final")}
            className={cn(
              "mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
              copied === "prontuario-base-final"
                ? "bg-green-500/10 text-green-600 border-green-500/30"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {copied === "prontuario-base-final" ? <Check size={12} /> : <Copy size={12} />}
            {copied === "prontuario-base-final" ? "Copiado!" : "Copiar prontuário"}
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Salvar como Caso Clínico</p>
            <p className="text-xs text-muted-foreground mt-0.5">Adiciona este prontuário ao banco de casos clínicos para estudo.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveAsCaso}
            disabled={savingCaso || casoSalvo}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0",
              casoSalvo
                ? "bg-green-500/10 text-green-600 border border-green-500/30"
                : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white disabled:opacity-50"
            )}
          >
            {casoSalvo ? <Check size={14} /> : savingCaso ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
            {casoSalvo ? "Salvo!" : savingCaso ? "Salvando..." : "Salvar como Caso"}
          </button>
        </div>
      </div>
    );
  }

  // ── Layout ────────────────────────────────────────────────────────────────────

  const isPosConsulta = step === 8;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 pb-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #06B6D4, #0891B2)" }}
            >
              <ClipboardList size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">
                {isPosConsulta ? "Central Pós-Consulta" : "Nova Consulta"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isPosConsulta ? "Gere documentos a partir do prontuário confirmado" : `Etapa ${step + 1} de ${STEPS.length}`}
              </p>
            </div>
            {!isPosConsulta && (
              <button
                type="button"
                onClick={() => { setData(INITIAL); setStep(0); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <RotateCcw size={12} />
                Limpar
              </button>
            )}
          </div>

          {/* Step indicator */}
          {!isPosConsulta && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < step;
                  const active = i === step;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => i <= step && setStep(i)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0",
                        active ? "bg-primary text-primary-foreground" : done ? "text-primary cursor-pointer hover:bg-primary/5" : "text-muted-foreground cursor-default"
                      )}
                    >
                      {done ? <Check size={11} /> : <Icon size={11} />}
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-5 py-3 flex gap-3">
            <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Ferramenta de apoio à documentação clínica. O médico é responsável por revisar, adaptar e assinar todos os documentos.
            </p>
          </div>

          {/* Advanced Config */}
          <AdvancedConfigPanel
            open={advancedOpen}
            onToggle={() => setAdvancedOpen(v => !v)}
            modules={data.advancedModules}
            onToggleModule={toggleModule}
          />

          {/* Step title */}
          {!isPosConsulta && (
            <div>
              <h2 className="text-base font-bold text-foreground">{STEPS[step].label}</h2>
            </div>
          )}

          {/* Content */}
          {step === 0 && renderTipo()}
          {step === 1 && renderIdent()}
          {step === 2 && renderQPHPMA()}
          {step === 3 && renderAntecedentes()}
          {step === 4 && renderEEM()}
          {step === 5 && renderRiscoHD()}
          {step === 6 && renderConduta()}
          {step === 7 && renderProntuario()}
          {step === 8 && renderPosConsulta()}

          {/* Navigation */}
          {!isPosConsulta && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>
              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
