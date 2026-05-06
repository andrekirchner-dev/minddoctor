export type TipoSecao = "texto" | "lista" | "tabela" | "cards" | "legal";

export interface ItemLista {
  nome: string;
  detalhe: string;
  tag?: string;
  alerta?: "info" | "atencao" | "perigo";
}

export interface SecaoModulo {
  id: string;
  titulo: string;
  tipo: TipoSecao;
  intro?: string;
  texto?: string;
  items?: ItemLista[];
  tabela?: {
    headers: string[];
    linhas: string[][];
    nota?: string;
  };
  pearls?: string[];
  referencia: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  subtitulo: string;
  cor: string;
  gradient: string;
  descricao: string;
  plano: "free" | "pro";
  secoes: SecaoModulo[];
}

export const modulos: Modulo[] = [
  {
    id: "infancia",
    titulo: "Infância e Adolescência",
    subtitulo: "Doses pediátricas · Marcos de desenvolvimento · CAPSi",
    cor: "violet",
    gradient: "from-violet-500 to-purple-500",
    descricao: "Referência clínica para psiquiatria da infância e adolescência com tabelas de dosagem pediátrica, marcos de desenvolvimento e critérios diagnósticos adaptados.",
    plano: "free",
    secoes: [
      {
        id: "doses-pediatricas",
        titulo: "Doses Pediátricas",
        tipo: "tabela",
        intro: "Conteúdo sendo carregado...",
        tabela: { headers: ["Medicamento"], linhas: [["Em carregamento"]] },
        referencia: "—",
      },
    ],
  },
  {
    id: "forense",
    titulo: "Psiquiatria Forense",
    subtitulo: "Lei 10.216 · Imputabilidade · Laudos periciais",
    cor: "slate",
    gradient: "from-slate-600 to-gray-700",
    descricao: "Fundamentos de psiquiatria forense: reforma psiquiátrica brasileira, critérios de imputabilidade, medidas de segurança e estrutura do laudo pericial.",
    plano: "pro",
    secoes: [
      {
        id: "lei-10216",
        titulo: "Lei 10.216",
        tipo: "legal",
        texto: "Conteúdo sendo carregado...",
        referencia: "—",
      },
    ],
  },
  {
    id: "psicogeriatria",
    titulo: "Psicogeriatria",
    subtitulo: "Critérios de Beers · Demências · Desprescrição",
    cor: "amber",
    gradient: "from-amber-500 to-orange-500",
    descricao: "Psicofarmacologia do idoso: medicamentos potencialmente inapropriados, diagnóstico diferencial das demências e princípios de desprescrição.",
    plano: "free",
    secoes: [
      {
        id: "criterios-beers",
        titulo: "Critérios de Beers",
        tipo: "tabela",
        intro: "Conteúdo sendo carregado...",
        tabela: { headers: ["Medicamento"], linhas: [["Em carregamento"]] },
        referencia: "—",
      },
    ],
  },
  {
    id: "interconsulta",
    titulo: "Interconsulta Psiquiátrica",
    subtitulo: "UTI · Oncologia · HIV · Renal",
    cor: "blue",
    gradient: "from-blue-600 to-indigo-500",
    descricao: "Psiquiatria em contextos hospitalares especializados: delirium em UTI, neuropsiquiatria do HIV, oncologia e ajuste de dose em insuficiência renal.",
    plano: "free",
    secoes: [
      {
        id: "psiquiatria-uti",
        titulo: "Psiquiatria em UTI",
        tipo: "lista",
        intro: "Conteúdo sendo carregado...",
        referencia: "—",
      },
    ],
  },
  {
    id: "caps-raps",
    titulo: "CAPS e RAPS",
    subtitulo: "Tipos de CAPS · Componentes da RAPS · Encaminhamento",
    cor: "green",
    gradient: "from-green-500 to-emerald-600",
    descricao: "Rede de Atenção Psicossocial brasileira: tipos de CAPS, componentes da RAPS, fluxos de encaminhamento e critérios de internação psiquiátrica.",
    plano: "free",
    secoes: [
      {
        id: "tipos-caps",
        titulo: "Tipos de CAPS",
        tipo: "tabela",
        intro: "Conteúdo sendo carregado...",
        tabela: { headers: ["Tipo"], linhas: [["Em carregamento"]] },
        referencia: "—",
      },
    ],
  },
];
