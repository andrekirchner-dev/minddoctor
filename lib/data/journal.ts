export type JournalArea = "depressao" | "bipolar" | "psicose" | "ansiedade" | "farma" | "neurociencia" | "epidemiologia";

export interface JournalArtigo {
  id: string;
  titulo: string;
  autores: string;
  revista: string;
  ano: number;
  doi?: string;
  area: JournalArea;
  tipo: "ecr" | "metanalise" | "diretriz" | "revisao" | "coorte";
  impacto: "alto" | "medio";
  resumo: string;
  mensagem_chave: string[];
  limitacoes: string;
  relevancia_clinica: string;
}

export const artigos: JournalArtigo[] = [
  // ─── DEPRESSÃO ──────────────────────────────────────────────────────────
  {
    id: "j-001",
    titulo: "Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder: a systematic review and network meta-analysis",
    autores: "Cipriani A, Furukawa TA, Salanti G et al.",
    revista: "The Lancet",
    ano: 2018,
    doi: "10.1016/S0140-6736(17)32802-7",
    area: "depressao",
    tipo: "metanalise",
    impacto: "alto",
    resumo: "Maior rede meta-análise já conduzida sobre antidepressivos: 522 ECRs, 116.477 pacientes, 21 antidepressivos. Todos os antidepressivos superiores ao placebo. Agomelatina, amitriptilina, escitalopram, mirtazapina, paroxetina, venlafaxina e vortioxetina mais eficazes. Fluoxetina, fluvoxamina e reboxetina com menor eficácia relativa. Escitalopram e sertralina com melhor equilíbrio eficácia-aceitabilidade.",
    mensagem_chave: [
      "Todos os antidepressivos são superiores ao placebo — sem dúvida sobre eficácia de classe",
      "Escitalopram e sertralina têm melhor relação eficácia/tolerabilidade — favorecer como 1ª linha",
      "Reboxetina (ISRN puro) foi o menos eficaz — evitar",
      "Amitriptilina eficaz, mas tolerabilidade prejudicada pelos efeitos adversos",
    ],
    limitacoes: "Heterogeneidade dos estudos; muitos ECRs financiados por indústria; seguimento curto (8 semanas); não avalia manutenção.",
    relevancia_clinica: "Define hierarquia de escolha de antidepressivos baseada em evidência — suporta escitalopram/sertralina como 1ª linha.",
  },
  {
    id: "j-002",
    titulo: "Antidepressant use and risk of suicide and attempted suicide or self harm in people aged 20 to 64: cohort study using a primary care database",
    autores: "Donovan S, Clayton A, Bhatt M et al.",
    revista: "BMJ",
    ano: 2022,
    doi: "10.1136/bmj-2022-069819",
    area: "depressao",
    tipo: "coorte",
    impacto: "alto",
    resumo: "Coorte de 157.917 adultos britânicos iniciando antidepressivo. Risco de tentativa de suicídio NÃO aumentado com ISRSs após ajuste para gravidade da depressão. Risco elevado nas primeiras 2 semanas de tratamento reflete a gravidade subjacente, não o medicamento. Mirtazapina associada a menor risco de tentativa versus ISRSs.",
    mensagem_chave: [
      "ISRSs não aumentam risco de suicídio quando comparados adequadamente — o aviso do FDA black box é questionado",
      "Monitoramento intenso nas primeiras 4 semanas é crucial — especialmente em jovens",
      "Mirtazapina pode ser preferível em pacientes com alto risco suicida",
    ],
    limitacoes: "Dados observacionais; causalidade reversa; populações britânicas.",
    relevancia_clinica: "Apoia o uso de antidepressivos com monitoramento, sem medo excessivo de aumentar risco suicida.",
  },
  {
    id: "j-003",
    titulo: "Efficacy of antidepressants in adults: systematic review and meta-analysis of evidence from randomised placebo controlled trials",
    autores: "Munkholm K, Paludan-Müller AS, Boesen K.",
    revista: "BMJ Evidence-Based Medicine",
    ano: 2019,
    doi: "10.1136/bmjebm-2019-111238",
    area: "depressao",
    tipo: "metanalise",
    impacto: "medio",
    resumo: "Meta-análise crítica: embora antidepressivos sejam superiores ao placebo, a diferença média em escalas (HDRS) é de 1,97 pontos — abaixo do limiar de significância clínica mínima (3 pontos). Questiona se a superioridade estatística se traduz em benefício clínico para todos os pacientes.",
    mensagem_chave: [
      "Diferença entre antidepressivo e placebo é estatisticamente significativa mas clinicamente modesta na média",
      "Para depressão grave, a diferença é clinicamente mais relevante",
      "Expectativa de efeito (efeito placebo) contribui substancialmente para a resposta",
    ],
    limitacoes: "Heterogeneidade; muitos estudos com TDM leve-moderado; viés de publicação possível.",
    relevancia_clinica: "Reforça personalização do tratamento — antidepressivos claramente indicados em depressão moderada-grave, papel do placebo importante em leve.",
  },
  // ─── BIPOLAR ──────────────────────────────────────────────────────────
  {
    id: "j-004",
    titulo: "Quetiapine versus placebo in patients with bipolar I or II depression: EMBOLDEN I and II combined analysis",
    autores: "Young AH, McElroy SL, Bauer M et al.",
    revista: "Journal of Affective Disorders",
    ano: 2010,
    doi: "10.1016/j.jad.2009.09.032",
    area: "bipolar",
    tipo: "ecr",
    impacto: "alto",
    resumo: "Dois ECRs duplos-cegos com quetiapina 300 e 600 mg/dia para depressão bipolar I e II. Ambas as doses superiores ao placebo em MADRS (diferença ~5 pontos). Resposta similar em tipo I e II. Inicio de efeito a partir da semana 1. Taxa de virada maníaca baixa (<3%).",
    mensagem_chave: [
      "Quetiapina é eficaz tanto para bipolar I quanto II na fase depressiva",
      "300 mg/dia eficaz — não necessário ir para 600 mg na maioria dos pacientes",
      "Baixo risco de virada maníaca — seguro comparado a antidepressivos",
      "Aprovação FDA para depressão bipolar I e II",
    ],
    limitacoes: "Seguimento de 8 semanas; financiado pela AstraZeneca.",
    relevancia_clinica: "Quetiapina como 1ª linha para depressão bipolar — aprovado FDA e com evidência A.",
  },
  {
    id: "j-005",
    titulo: "Comparative efficacy and tolerability of pharmacological treatments for bipolar depression: a systematic review and network meta-analysis",
    autores: "Bahji A, Ermacora D, Stephenson C et al.",
    revista: "Journal of Affective Disorders",
    ano: 2020,
    doi: "10.1016/j.jad.2020.02.007",
    area: "bipolar",
    tipo: "metanalise",
    impacto: "alto",
    resumo: "Rede meta-análise de 50 ECRs, 17.582 pacientes, avaliando farmacoterapia para depressão bipolar. Quetiapina, lurasidona e lítio (como augmentação) superiores ao placebo. Antidepressivos (ISRS + estabilizador) sem superioridade sobre estabilizador isolado. Valproato e lamotrigina com evidência moderada.",
    mensagem_chave: [
      "Quetiapina e lurasidona têm maior evidência de eficácia para depressão bipolar",
      "Antidepressivos em monoterapia NÃO devem ser usados — sem evidência de superioridade e risco de virada",
      "Lítio como augmentação permanece válido",
      "Lamotrigina — mais evidência em manutenção que em fase aguda",
    ],
    limitacoes: "Heterogeneidade metodológica; diferentes definições de resposta.",
    relevancia_clinica: "Suporta hierarquia de tratamento da depressão bipolar sem antidepressivos em 1ª linha.",
  },
  // ─── PSICOSE ──────────────────────────────────────────────────────────
  {
    id: "j-006",
    titulo: "Antipsychotic drugs versus placebo for relapse prevention in schizophrenia: a systematic review and meta-analysis",
    autores: "Leucht S, Tardy M, Komossa K et al.",
    revista: "The Lancet",
    ano: 2012,
    doi: "10.1016/S0140-6736(12)60239-6",
    area: "psicose",
    tipo: "metanalise",
    impacto: "alto",
    resumo: "65 ECRs, 6.493 pacientes. Antipsicóticos superiores ao placebo em prevenção de recaída: NNT = 3 (recaída 27% vs 64% em 1 ano). Também superiores em qualidade de vida e funcionamento. Efeitos adversos: ganho de peso, sedação, sintomas extrapiramidais — variam por droga.",
    mensagem_chave: [
      "Manutenção com antipsicóticos após primeiro episódio é altamente eficaz — NNT = 3",
      "Sem tratamento de manutenção, 64% recaem em 1 ano vs 27% com medicação",
      "Benefício claro supera riscos de efeitos adversos na maioria dos pacientes",
      "Escolha baseada em perfil individual de efeitos adversos",
    ],
    limitacoes: "Seguimento variável; heterogeneidade; muitos ECRs de curta duração.",
    relevancia_clinica: "Fundamento para o tratamento de manutenção prolongado na esquizofrenia.",
  },
  {
    id: "j-007",
    titulo: "Clozapine for treatment-resistant schizophrenia: a systematic review and meta-analysis of randomized controlled trials",
    autores: "Siskind D, McCartney L, Goldschlager R, Kisely S.",
    revista: "Acta Psychiatrica Scandinavica",
    ano: 2016,
    doi: "10.1111/acps.12573",
    area: "psicose",
    tipo: "metanalise",
    impacto: "alto",
    resumo: "22 ECRs. Clozapina superior a outros antipsicóticos (OR 2,20; IC95% 1,48-3,27) para resposta em esquizofrenia resistente. Também superiori para sintomas positivos, negativos e qualidade de vida. Risco de agranulocitose 0,7% — monitoramento obrigatório.",
    mensagem_chave: [
      "Clozapina é o único antipsicótico com eficácia comprovada na esquizofrenia resistente",
      "Deve ser iniciada após falha de 2 antipsicóticos adequados (doses corretas, tempo adequado)",
      "Atraso no início da clozapina é uma das principais falhas de qualidade no manejo da esquizofrenia",
      "Benefício claramente supera risco de agranulocitose com monitoramento adequado",
    ],
    limitacoes: "Definição variável de resistência entre estudos; curto seguimento.",
    relevancia_clinica: "Reforça que clozapina deve ser iniciada precocemente na resistência — não deixar para último recurso.",
  },
  // ─── ANSIEDADE ──────────────────────────────────────────────────────────
  {
    id: "j-008",
    titulo: "Psychological therapies for generalised anxiety disorder: systematic review and meta-analysis",
    autores: "Cuijpers P, Sijbrandij M, Koole SL et al.",
    revista: "Psychological Medicine",
    ano: 2022,
    doi: "10.1017/S0033291722001064",
    area: "ansiedade",
    tipo: "metanalise",
    impacto: "alto",
    resumo: "56 ECRs, 3.021 pacientes com TAG. TCC superior ao controle lista de espera (d=0,96) e controles ativos (d=0,27). Mindfulness-Based Cognitive Therapy (MBCT) emergindo como alternativa. Combinação TCC + farmacoterapia não superior à TCC isolada para ansiedade.",
    mensagem_chave: [
      "TCC tem tamanho de efeito grande para TAG versus lista de espera",
      "MBCT é alternativa com evidência crescente para TAG",
      "Combinação TCC + medicação não necessariamente superior à TCC isolada",
      "TCC via internet (iCBT) com eficácia similar à presencial",
    ],
    limitacoes: "Heterogeneidade; seguimento variável; risco de viés em vários estudos.",
    relevancia_clinica: "TCC é 1ª linha para TAG junto com ISRSs/IRSNs — não apenas farmacoterapia.",
  },
  // ─── FARMACOLOGIA ──────────────────────────────────────────────────────────
  {
    id: "j-009",
    titulo: "Dose equivalents of antipsychotic drugs: systematic review and meta-analysis",
    autores: "Leucht S, Samara M, Heres S et al.",
    revista: "The Lancet Psychiatry",
    ano: 2016,
    doi: "10.1016/S2215-0366(15)00508-8",
    area: "farma",
    tipo: "metanalise",
    impacto: "alto",
    resumo: "Meta-análise de dose-resposta para 18 antipsicóticos. Estabelece equivalências de dose baseadas em evidência (DDD — Defined Daily Dose e CPZ equivalentes). Dose-resposta aplainada para a maioria dos antipsicóticos acima de doses moderadas. Haloperidol: CPZ eq de 2 mg/100 mg; risperidona: 1 mg/66 mg; olanzapina: 2,5 mg/100 mg.",
    mensagem_chave: [
      "Tabela de equivalências CPZ: referência padrão atual — supera estimativas antigas",
      "Curva dose-resposta plateau para a maioria: doses altas não aumentam eficácia",
      "Dosagem mínima eficaz preferível para minimizar efeitos adversos",
      "Haloperidol: 5 mg/dia já próximo ao plateau para esquizofrenia aguda",
    ],
    limitacoes: "Definição de equivalência pode variar por desfecho medido.",
    relevancia_clinica: "Tabela essencial para troca de antipsicóticos e conversão de formulações.",
  },
  {
    id: "j-010",
    titulo: "American Geriatrics Society 2023 Updated AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults",
    autores: "American Geriatrics Society Beers Criteria Update Expert Panel",
    revista: "Journal of the American Geriatrics Society",
    ano: 2023,
    doi: "10.1111/jgs.18372",
    area: "farma",
    tipo: "diretriz",
    impacto: "alto",
    resumo: "Atualização 2023 dos Critérios de Beers — lista de medicamentos potencialmente inapropriados em idosos (≥65 anos). Categorias: (1) medicamentos a evitar, (2) medicamentos com cautela, (3) interações a evitar, (4) ajustes por função renal. Antipsicóticos first-generation: alto risco de queda, SEP, disfunção cognitiva. BZDs de longa ação: risco de quedas, sedação prolongada.",
    mensagem_chave: [
      "Anticolinérgicos são os mais perigosos em idosos — delirium, constipação, retenção urinária, demência",
      "Benzodiazepínicos de ação longa (diazepam, clonazepam) — evitar; usar lorazepam se necessário",
      "AINEs — evitar em idosos se possível; risco gastrointestinal e renal",
      "Antipsicóticos de 1ª geração — alto risco de SEP e queda",
    ],
    limitacoes: "Critérios baseados em população americana; algumas recomendações ainda baseadas em opinião de especialistas.",
    relevancia_clinica: "Referência obrigatória na prescrição de psicofármacos para idosos.",
  },
  // ─── NEUROCIÊNCIA ──────────────────────────────────────────────────────────
  {
    id: "j-011",
    titulo: "The serotonin theory of depression: a systematic umbrella review of the evidence",
    autores: "Moncrieff J, Cooper RE, Stockmann T et al.",
    revista: "Molecular Psychiatry",
    ano: 2022,
    doi: "10.1038/s41380-022-01661-0",
    area: "neurociencia",
    tipo: "revisao",
    impacto: "alto",
    resumo: "Revisão de umbrella de 17 meta-análises e revisões sistemáticas sobre a teoria serotoninérgica da depressão. Conclusão: sem evidência consistente de que baixos níveis de serotonina (5-HT) causam depressão. Depleção de triptofano não induz depressão em voluntários saudáveis. Não invalida eficácia dos ISRSs, mas questiona o mecanismo.",
    mensagem_chave: [
      "A teoria do 'déficit de serotonina' na depressão não tem suporte científico robusto",
      "ISRSs são eficazes — mas provavelmente por mecanismos mais complexos que simples correção de depleção",
      "Não devemos explicar a depressão aos pacientes como 'desequilíbrio químico de serotonina'",
      "Mecanismos neuroplásticos, inflamatórios e epigenéticos ganham importância",
    ],
    limitacoes: "Não diz que ISRSs não funcionam — apenas questiona o mecanismo proposto.",
    relevancia_clinica: "Impacto na comunicação com pacientes sobre mecanismo da depressão e antidepressivos.",
  },
  {
    id: "j-012",
    titulo: "Large-scale GWAS reveals insights into the genetic architecture of depression and genetic overlap with schizophrenia",
    autores: "Howard DM, Adams MJ, Clarke TK et al.",
    revista: "Nature Neuroscience",
    ano: 2019,
    doi: "10.1038/s41593-018-0326-7",
    area: "neurociencia",
    tipo: "coorte",
    impacto: "alto",
    resumo: "GWAS (Estudo de Associação Genômica Ampla) com 807.553 indivíduos. Identificados 102 loci genéticos associados a depressão. Sobreposição genética significativa com esquizofrenia, TDAH e Alzheimer. Herdabilidade estimada em 25–29%. Sinalização glutamatérgica e sináptica como vias biológicas emergentes.",
    mensagem_chave: [
      "Depressão tem base poligênica — centenas de variantes de pequeno efeito",
      "Sobreposição genética com esquizofrenia reforça continuum psiquiátrico",
      "Via glutamatérgica é alvo terapêutico promissor (ketamina, esketamina já aprovadas)",
      "Herdabilidade moderada — fatores ambientais igualmente importantes",
    ],
    limitacoes: "Predominância de europeus na amostra; variantes identificadas explicam fração pequena da variância total.",
    relevancia_clinica: "Fundamenta abordagem dimensional e neurobiológica dos transtornos do humor.",
  },
  // ─── EPIDEMIOLOGIA ──────────────────────────────────────────────────────────
  {
    id: "j-013",
    titulo: "Global, regional, and national burden of 12 mental disorders in 204 countries and territories, 1990-2019: a systematic analysis for the Global Burden of Disease Study 2019",
    autores: "GBD 2019 Mental Disorders Collaborators",
    revista: "The Lancet Psychiatry",
    ano: 2022,
    doi: "10.1016/S2215-0366(21)00395-3",
    area: "epidemiologia",
    tipo: "revisao",
    impacto: "alto",
    resumo: "GBD 2019: 12 transtornos mentais representam 1 bilhão de pessoas afetadas globalmente. Depressão e ansiedade: principais contribuidoras para YLDs (anos vividos com incapacidade). Transtornos mentais respondem por 14,6% dos YLDs globais. COVID-19 aumentou prevalência de depressão em 27,6% e ansiedade em 25,6% em 2020.",
    mensagem_chave: [
      "Transtornos mentais são a principal causa de incapacidade global",
      "Tratamento gap é imenso — 75-80% sem acesso a tratamento nos países de baixa renda",
      "Depressão afeta ~280 milhões globalmente; ansiedade ~301 milhões",
      "COVID-19 adicionou ~53,2 milhões de casos de depressão e ~76 milhões de ansiedade ao mundo",
    ],
    limitacoes: "Subnotificação em países de baixa renda; dados baseados em estimativas.",
    relevancia_clinica: "Contextualiza a magnitude do problema e a importância da saúde mental pública.",
  },
];

export const journalAreas: { id: JournalArea | "todas"; label: string }[] = [
  { id: "todas",        label: "Todos" },
  { id: "depressao",    label: "Depressão" },
  { id: "bipolar",      label: "Bipolar" },
  { id: "psicose",      label: "Psicose" },
  { id: "ansiedade",    label: "Ansiedade" },
  { id: "farma",        label: "Farmacologia" },
  { id: "neurociencia", label: "Neurociência" },
  { id: "epidemiologia",label: "Epidemiologia" },
];

export const tipoLabels: Record<JournalArtigo["tipo"], string> = {
  ecr:        "ECR",
  metanalise: "Meta-análise",
  diretriz:   "Diretriz",
  revisao:    "Revisão",
  coorte:     "Coorte",
};

export const areaColors: Record<JournalArea, string> = {
  depressao:     "bg-blue-500/10 text-blue-600 border-blue-500/20",
  bipolar:       "bg-violet-500/10 text-violet-600 border-violet-500/20",
  psicose:       "bg-red-500/10 text-red-600 border-red-500/20",
  ansiedade:     "bg-amber-500/10 text-amber-600 border-amber-500/20",
  farma:         "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  neurociencia:  "bg-teal-500/10 text-teal-600 border-teal-500/20",
  epidemiologia: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};
