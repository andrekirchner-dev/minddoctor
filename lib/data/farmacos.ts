export type ClasseFarmaco =
  | "isrs"
  | "irsn"
  | "atvp"
  | "atcicl"
  | "atip1g"
  | "atip2g"
  | "estabilizador"
  | "ansiolitico"
  | "hipnotico"
  | "psicoestimulante"
  | "outro";

export interface Farmaco {
  id: string;
  nome: string;
  nomesComerciais: string[];
  classe: ClasseFarmaco;
  mecanismo: string;
  indicacoes: string[];
  doses: {
    inicio: string;
    terapeutica: string;
    maxima: string;
  };
  vidaMedia: string;
  principaisEfeitosAdversos: string[];
  interacoesImportantes: string[];
  observacoes?: string;
}

export const classesLabel: Record<ClasseFarmaco, string> = {
  isrs: "ISRS",
  irsn: "IRSN",
  atvp: "Antidep. Atípico",
  atcicl: "ATC",
  atip1g: "Antipsicótico 1G",
  atip2g: "Antipsicótico 2G",
  estabilizador: "Estabilizador",
  ansiolitico: "Ansiolítico",
  hipnotico: "Hipnótico",
  psicoestimulante: "Psicoestimulante",
  outro: "Outro",
};

export const classeColors: Record<ClasseFarmaco, string> = {
  isrs: "bg-blue-100 text-blue-800 border-blue-200",
  irsn: "bg-cyan-100 text-cyan-800 border-cyan-200",
  atvp: "bg-violet-100 text-violet-800 border-violet-200",
  atcicl: "bg-purple-100 text-purple-800 border-purple-200",
  atip1g: "bg-red-100 text-red-800 border-red-200",
  atip2g: "bg-orange-100 text-orange-800 border-orange-200",
  estabilizador: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ansiolitico: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hipnotico: "bg-indigo-100 text-indigo-800 border-indigo-200",
  psicoestimulante: "bg-pink-100 text-pink-800 border-pink-200",
  outro: "bg-gray-100 text-gray-800 border-gray-200",
};

export const farmacos: Farmaco[] = [
  // ─── ISRS ────────────────────────────────────────────────────────────────
  {
    id: "isrs-sertralina",
    nome: "Sertralina",
    nomesComerciais: ["Zoloft", "Tolrest", "Assert"],
    classe: "isrs",
    mecanismo:
      "Inibidor seletivo da recaptação de serotonina (ISRS). Bloqueia o transportador SERT com alta seletividade e mínima ação sobre outros receptores.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Transtorno de ansiedade generalizada (TAG)",
      "Transtorno de estresse pós-traumático (TEPT)",
      "Transtorno obsessivo-compulsivo (TOC)",
      "Transtorno de pânico (TP)",
      "Transtorno disfórico pré-menstrual (TDPM)",
      "Fobia social",
    ],
    doses: {
      inicio: "25–50 mg/dia",
      terapeutica: "50–200 mg/dia",
      maxima: "200 mg/dia",
    },
    vidaMedia: "~26 horas",
    principaisEfeitosAdversos: [
      "Náusea (especialmente no início)",
      "Insônia ou sonolência",
      "Disfunção sexual (retardo ejaculatório, anorgasmia)",
      "Diarreia",
      "Cefaleia",
      "Boca seca",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado (risco de síndrome serotoninérgica grave)",
      "Tramadol: risco de síndrome serotoninérgica",
      "Varfarina: potencializa efeito anticoagulante — monitorar INR",
      "Lítio: risco aumentado de toxicidade serotoninérgica",
    ],
    observacoes:
      "Melhor perfil de interações CYP entre os ISRS; inibição moderada de CYP2D6. Considerada segura na gravidez (categoria B/C). Boa primeira escolha para a maioria dos transtornos de ansiedade e TDM.",
  },
  {
    id: "isrs-fluoxetina",
    nome: "Fluoxetina",
    nomesComerciais: ["Prozac", "Daforin", "Eufor"],
    classe: "isrs",
    mecanismo:
      "ISRS com meia-vida excepcionalmente longa. Seu metabólito ativo (norfluoxetina) contribui para a ação prolongada.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Transtorno obsessivo-compulsivo (TOC)",
      "Bulimia nervosa",
      "Transtorno de pânico",
      "Transtorno disfórico pré-menstrual (TDPM)",
    ],
    doses: {
      inicio: "10–20 mg/dia",
      terapeutica: "20–80 mg/dia",
      maxima: "80 mg/dia",
    },
    vidaMedia: "1–4 dias (fluoxetina); 4–16 dias (norfluoxetina)",
    principaisEfeitosAdversos: [
      "Insônia e agitação (ativador)",
      "Disfunção sexual",
      "Náusea (geralmente transitória)",
      "Anorexia e perda de peso",
      "Cefaleia",
      "Tremor fino",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado — intervalo mínimo de 5 semanas após suspensão da fluoxetina",
      "Tamoxifeno: reduz eficácia (inibição CYP2D6 intensa)",
      "Antipsicóticos metabolizados por CYP2D6 (haloperidol, risperidona): aumento de nível",
      "Carbamazepina, fenitoína: alteração de níveis",
      "Triptanos: risco de síndrome serotoninérgica",
    ],
    observacoes:
      "Forte inibidora de CYP2D6 e CYP3A4 — múltiplas interações medicamentosas. A meia-vida longa praticamente elimina a síndrome de descontinuação; pode ser usada em esquema semanal (90 mg) para pacientes com baixa adesão.",
  },
  {
    id: "isrs-escitalopram",
    nome: "Escitalopram",
    nomesComerciais: ["Lexapro", "Exodus", "Reconter"],
    classe: "isrs",
    mecanismo:
      "Enantiômero ativo do citalopram. ISRS com altíssima seletividade pelo transportador SERT e mínima afinidade por outros receptores.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Transtorno de ansiedade generalizada (TAG)",
      "Fobia social",
      "Transtorno de pânico",
    ],
    doses: {
      inicio: "5–10 mg/dia",
      terapeutica: "10–20 mg/dia",
      maxima: "20 mg/dia",
    },
    vidaMedia: "27–32 horas",
    principaisEfeitosAdversos: [
      "Náusea",
      "Insônia",
      "Disfunção sexual",
      "Cefaleia",
      "Prolongamento do intervalo QTc (dose-dependente)",
      "Sudorese",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Medicamentos que prolongam QTc (antipsicóticos, macrolídeos, antiarrítmicos): risco aumentado de arritmia",
      "Cimetidina: aumenta nível do escitalopram",
      "Lítio: potencialização serotoninérgica",
    ],
    observacoes:
      "O ISRS mais seletivo e com menor potencial de interações CYP. Monitorar ECG em doses altas (20 mg) ou em pacientes com fatores de risco cardíaco. Boa tolerabilidade geral — frequentemente escolhido como 1ª linha.",
  },
  {
    id: "isrs-paroxetina",
    nome: "Paroxetina",
    nomesComerciais: ["Paxil", "Aropax", "Pondera"],
    classe: "isrs",
    mecanismo:
      "ISRS com propriedades anticolinérgicas adicionais e inibição potente de CYP2D6. Forte inibidor da recaptação de serotonina.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Transtorno de ansiedade generalizada (TAG)",
      "Transtorno de pânico",
      "Fobia social",
      "Transtorno obsessivo-compulsivo (TOC)",
      "Transtorno de estresse pós-traumático (TEPT)",
    ],
    doses: {
      inicio: "10–20 mg/dia",
      terapeutica: "20–60 mg/dia",
      maxima: "60 mg/dia",
    },
    vidaMedia: "~21 horas",
    principaisEfeitosAdversos: [
      "Sedação",
      "Ganho de peso",
      "Disfunção sexual (mais intensa entre os ISRS)",
      "Constipação (efeito anticolinérgico)",
      "Boca seca",
      "Síndrome de descontinuação intensa (meia-vida curta + sem metabólito ativo)",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Tamoxifeno: contraindicado (inibição CYP2D6 intensa reduz ativação do tamoxifeno)",
      "Antipsicóticos metabolizados por CYP2D6: aumento de nível plasmático",
      "Tioridazina: contraindicado (risco QTc)",
    ],
    observacoes:
      "Maior risco de malformações cardíacas fetais (defeitos do septo) — EVITAR na gestação, especialmente no 1º trimestre. A síndrome de descontinuação pode ser severa; reduzir dose gradualmente. Entre os ISRS, é o mais sedativo e com maior ganho de peso.",
  },
  {
    id: "isrs-fluvoxamina",
    nome: "Fluvoxamina",
    nomesComerciais: ["Luvox", "Faverin"],
    classe: "isrs",
    mecanismo:
      "ISRS com alta afinidade pelo receptor sigma-1 e potente inibição das isoenzimas CYP1A2 e CYP3A4.",
    indicacoes: [
      "Transtorno obsessivo-compulsivo (TOC) — 1ª linha",
      "Transtorno de ansiedade generalizada (TAG)",
      "Transtorno depressivo maior (TDM)",
      "Fobia social",
    ],
    doses: {
      inicio: "50 mg/dia",
      terapeutica: "100–300 mg/dia",
      maxima: "300 mg/dia",
    },
    vidaMedia: "~15 horas",
    principaisEfeitosAdversos: [
      "Náusea (efeito mais frequente)",
      "Sedação",
      "Cefaleia",
      "Boca seca",
      "Disfunção sexual",
    ],
    interacoesImportantes: [
      "Clozapina: aumenta significativamente o nível plasmático (inibição CYP1A2) — risco de toxicidade",
      "Teofilina: aumenta nível — risco de toxicidade",
      "Ramelteon: contraindicado (aumenta nível ~190x por inibição CYP1A2)",
      "Cisaprida, pimozida: contraindicado (risco de arritmia)",
      "Varfarina, benzodiazepínicos: aumento de nível",
      "IMAOs: contraindicado",
    ],
    observacoes:
      "Potente inibidor de CYP1A2 e CYP3A4 — verificar SEMPRE as interações antes de prescrever. Primeira escolha no TOC com forte evidência. A interação com clozapina pode ser usada estrategicamente (fluvoxamina baixa dose aumenta nível de clozapina permitindo doses menores), mas exige monitoramento rigoroso.",
  },

  // ─── IRSN ────────────────────────────────────────────────────────────────
  {
    id: "irsn-venlafaxina",
    nome: "Venlafaxina",
    nomesComerciais: ["Effexor XR", "Venlift", "Venspe"],
    classe: "irsn",
    mecanismo:
      "Inibidor da recaptação de serotonina e noradrenalina (IRSN). Em doses baixas predomina ação serotonérgica; a inibição noradrenérgica aumenta com a dose.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Transtorno de ansiedade generalizada (TAG)",
      "Fobia social (TAG social)",
      "Transtorno de pânico",
      "Transtorno de estresse pós-traumático (TEPT)",
      "Dor neuropática (off-label)",
      "Fibromialgia (off-label)",
    ],
    doses: {
      inicio: "37,5 mg/dia",
      terapeutica: "75–225 mg/dia",
      maxima: "375 mg/dia",
    },
    vidaMedia: "~5 horas (venlafaxina); ~11 horas (O-desmetilvenlafaxina)",
    principaisEfeitosAdversos: [
      "Hipertensão arterial dose-dependente",
      "Náusea (especialmente no início)",
      "Disfunção sexual",
      "Sudorese",
      "Insônia",
      "Síndrome de descontinuação intensa (meia-vida curta)",
      "Taquicardia",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado (risco de síndrome serotoninérgica grave)",
      "Triptanos: risco de síndrome serotoninérgica",
      "Lítio: aumenta risco serotoninérgico",
      "AINEs/anticoagulantes: risco aumentado de sangramento",
    ],
    observacoes:
      "Monitorar pressão arterial regularmente — HAS dose-dependente pode exigir ajuste ou troca. Eficaz em dor neuropática especialmente em doses mais altas (≥150 mg). Síndrome de descontinuação é uma das mais intensas entre os antidepressivos — reduzir gradualmente.",
  },
  {
    id: "irsn-duloxetina",
    nome: "Duloxetina",
    nomesComerciais: ["Cymbalta", "Xeristar", "Duloren"],
    classe: "irsn",
    mecanismo:
      "IRSN com inibição equilibrada de SERT e NET em doses habituais. Também possui efeito analgésico central por modulação noradrenérgica descendente.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Transtorno de ansiedade generalizada (TAG)",
      "Dor neuropática diabética",
      "Fibromialgia",
      "Dor musculoesquelética crônica",
      "Incontinência urinária de esforço (mulheres)",
    ],
    doses: {
      inicio: "30 mg/dia",
      terapeutica: "60–120 mg/dia",
      maxima: "120 mg/dia",
    },
    vidaMedia: "~12 horas",
    principaisEfeitosAdversos: [
      "Náusea",
      "Boca seca",
      "Constipação",
      "Insônia",
      "Sudorese",
      "Elevação leve da pressão arterial",
      "Hepatotoxicidade (raro, mas real)",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Inibidores de CYP1A2 (fluvoxamina, ciprofloxacino): aumentam nível de duloxetina",
      "Álcool: risco aumentado de hepatotoxicidade",
      "Tioridazina, inibidores de CYP2D6: potencialização",
    ],
    observacoes:
      "Hepatotoxicidade é rara mas documentada — EVITAR em hepatopatas ou etilistas. Contraindicada em hepatopatia grave. Menos elevação de PA do que a venlafaxina. Excelente opção quando há comorbidade com dor crônica.",
  },
  {
    id: "irsn-desvenlafaxina",
    nome: "Desvenlafaxina",
    nomesComerciais: ["Pristiq", "Desfaxina"],
    classe: "irsn",
    mecanismo:
      "Metabólito ativo da venlafaxina. IRSN com perfil semelhante, mas sem necessidade de metabolização por CYP2D6.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
    ],
    doses: {
      inicio: "50 mg/dia",
      terapeutica: "50 mg/dia",
      maxima: "100 mg/dia",
    },
    vidaMedia: "~11 horas",
    principaisEfeitosAdversos: [
      "Náusea",
      "Cefaleia",
      "Disfunção sexual",
      "Sudorese",
      "Insônia",
      "Síndrome de descontinuação (menos intensa que a venlafaxina)",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Triptanos: risco de síndrome serotoninérgica",
    ],
    observacoes:
      "Não requer metabolização por CYP2D6 — menos interações farmacológicas que a venlafaxina. A dose eficaz é 50 mg; doses maiores não mostram benefício adicional significativo em TDM. Boa opção em pacientes com polimorfismo de CYP2D6.",
  },

  // ─── Antidepressivos Atípicos ─────────────────────────────────────────────
  {
    id: "atvp-bupropiona",
    nome: "Bupropiona",
    nomesComerciais: ["Wellbutrin XL", "Zyban", "Bup"],
    classe: "atvp",
    mecanismo:
      "Inibidor da recaptação de dopamina e noradrenalina (NDRI). Sem ação serotonérgica significativa. Mecanismo antitabágico adicional via antagonismo nicotínico.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Cessação do tabagismo",
      "TDAH em adultos (off-label)",
      "Depressão sazonal",
    ],
    doses: {
      inicio: "150 mg/dia",
      terapeutica: "150–300 mg/dia",
      maxima: "450 mg/dia",
    },
    vidaMedia: "~21 horas",
    principaisEfeitosAdversos: [
      "Insônia",
      "Agitação e ansiedade",
      "Xerostomia (boca seca)",
      "Cefaleia",
      "Convulsão dose-dependente (risco aumentado > 450 mg/dia)",
      "Elevação leve de PA",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Inibidores de CYP2B6 (ticlopidina): aumentam nível de bupropiona",
      "Indutores de CYP2B6 (carbamazepina, rifampicina): reduzem nível",
      "Álcool e benzodiazepínicos: abstinência abrupta aumenta risco convulsivo",
    ],
    observacoes:
      "Contraindicada em epilepsia, bulimia nervosa e anorexia nervosa (rebaixamento do limiar convulsivo). AUSÊNCIA de disfunção sexual e ganho de peso — vantagens claras em relação aos ISRS/IRSN. Perfil ativador útil em depressão com hipersonia ou fadiga. Para cessação do tabagismo: iniciar 1–2 semanas antes da data-alvo.",
  },
  {
    id: "atvp-mirtazapina",
    nome: "Mirtazapina",
    nomesComerciais: ["Remeron", "Mirtaz"],
    classe: "atvp",
    mecanismo:
      "Antagonista α2-adrenérgico (pré-sináptico) aumentando liberação de 5-HT e NA. Antagonista de H1 (sedação/apetite), 5-HT2A e 5-HT3 (menos efeitos GI serotoninérgicos).",
    indicacoes: [
      "Transtorno depressivo maior (TDM), especialmente com insônia e/ou perda de peso",
      "Depressão com náuseas associadas a quimioterapia (adjuvante, off-label)",
      "Depressão em idosos (off-label)",
    ],
    doses: {
      inicio: "7,5–15 mg/dia (à noite)",
      terapeutica: "15–45 mg/dia",
      maxima: "45 mg/dia",
    },
    vidaMedia: "20–40 horas",
    principaisEfeitosAdversos: [
      "Ganho de peso (intenso — estimulação de apetite)",
      "Sedação (paradoxalmente menor em doses mais altas)",
      "Hiperfagia",
      "Boca seca",
      "Constipação",
      "Agranulocitose (muito raro)",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Álcool e outros depressores do SNC: potencialização da sedação",
      "Benzodiazepínicos: aumento de sedação",
    ],
    observacoes:
      "A sedação é mais intensa em doses baixas (7,5–15 mg) e tende a diminuir com doses maiores (30–45 mg). Muito útil em pacientes desnutridos ou com insônia grave. Praticamente sem disfunção sexual. O baixo potencial de toxicidade em superdose torna-a segura em pacientes com risco suicida.",
  },
  {
    id: "atvp-trazodona",
    nome: "Trazodona",
    nomesComerciais: ["Trazodil", "Donaren"],
    classe: "atvp",
    mecanismo:
      "Antagonista de 5-HT2A e inibidor fraco do transportador SERT. Forte bloqueio de receptores α1-adrenérgicos e H1.",
    indicacoes: [
      "Insônia (adjuvante em dose baixa)",
      "Transtorno depressivo maior (TDM) — doses mais altas",
      "Agitação em demência (off-label)",
    ],
    doses: {
      inicio: "25–50 mg (insônia); 75 mg (depressão)",
      terapeutica: "50–100 mg (insônia); 150–400 mg (depressão)",
      maxima: "600 mg/dia",
    },
    vidaMedia: "5–9 horas",
    principaisEfeitosAdversos: [
      "Sedação intensa",
      "Hipotensão ortostática",
      "Priapismo (raro — emergência urológica)",
      "Tontura",
      "Boca seca",
      "Arritmias em doses altas",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Anti-hipertensivos: potencialização de hipotensão",
      "Inibidores de CYP3A4 (ketoconazol, ritonavir): aumentam nível",
      "Digoxina, fenitoína: pode alterar nível plasmático",
    ],
    observacoes:
      "Amplamente prescrita em doses baixas (50–100 mg à noite) como hipnótico adjuvante — especialmente junto a ISRS. O priapismo, embora raro, é uma emergência urológica — orientar paciente. Sem disfunção sexual — ao contrário, pode ser usada em pacientes com disfunção sexual por ISRS.",
  },
  {
    id: "atvp-amitriptilina",
    nome: "Amitriptilina",
    nomesComerciais: ["Tryptanol", "Amytril"],
    classe: "atvp",
    mecanismo:
      "Antidepressivo tricíclico (ATC). Inibe recaptação de NA e 5-HT. Também antagonista de receptores H1, muscarínicos M1/M2, α1-adrenérgicos e canais de Na+.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "Dor neuropática e crônica",
      "Profilaxia de enxaqueca",
      "Fibromialgia",
      "Enurese noturna (crianças — off-label)",
    ],
    doses: {
      inicio: "10–25 mg/dia (noite)",
      terapeutica: "75–200 mg/dia",
      maxima: "300 mg/dia",
    },
    vidaMedia: "10–50 horas",
    principaisEfeitosAdversos: [
      "Efeitos anticolinérgicos: boca seca, constipação, retenção urinária, visão turva, taquicardia",
      "Sedação intensa",
      "Ganho de peso",
      "Hipotensão ortostática",
      "Prolongamento QTc e arritmias",
      "Cardiotóxico em superdose (margem terapêutica estreita)",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado (síndrome serotoninérgica)",
      "Anti-arrítmicos, outros medicamentos que prolongam QTc: risco de arritmia",
      "Depressores do SNC (álcool, benzodiazepínicos): potencialização",
      "Glaucoma de ângulo fechado: contraindicado (efeito anticolinérgico)",
    ],
    observacoes:
      "Contraindicada em IAM recente, bloqueios de condução cardíaca e glaucoma de ângulo fechado. A cardiotoxicidade em superdose é grave — cautela em pacientes com risco suicida. Em doses baixas (10–25 mg), amplamente usada para dor crônica neuropática e profilaxia de enxaqueca sem intenção antidepressiva primária.",
  },
  {
    id: "atvp-vortioxetina",
    nome: "Vortioxetina",
    nomesComerciais: ["Brintellix", "Trintellix"],
    classe: "atvp",
    mecanismo:
      "Antidepressivo multimodal: inibidor do transportador SERT + agonista parcial de 5-HT1A + agonista de 5-HT1B + antagonista de 5-HT3, 5-HT7 e 5-HT1D.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
      "TDM com comprometimento cognitivo associado",
    ],
    doses: {
      inicio: "5–10 mg/dia",
      terapeutica: "10–20 mg/dia",
      maxima: "20 mg/dia",
    },
    vidaMedia: "~66 horas",
    principaisEfeitosAdversos: [
      "Náusea (principal, especialmente nas primeiras semanas)",
      "Tontura",
      "Cefaleia",
      "Disfunção sexual (menos frequente que ISRS clássicos)",
      "Constipação ou diarreia",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Bupropiona (inibidor CYP2D6): aumenta nível — reduzir dose à metade",
      "Rifampicina e outros indutores CYP: reduzem nível",
      "Triptanos: risco aumentado de síndrome serotoninérgica",
    ],
    observacoes:
      "Evidências de melhora cognitiva (memória, atenção) superiores a outros antidepressivos — relevante em pacientes com queixas cognitivas proeminentes. Menor incidência de disfunção sexual em comparação com ISRS. A náusea tende a melhorar após 2–3 semanas.",
  },
  {
    id: "atvp-agomelatina",
    nome: "Agomelatina",
    nomesComerciais: ["Valdoxan"],
    classe: "atvp",
    mecanismo:
      "Agonista dos receptores melatoninérgicos MT1 e MT2 + antagonista do receptor 5-HT2C. Mecanismo único entre os antidepressivos.",
    indicacoes: [
      "Transtorno depressivo maior (TDM)",
    ],
    doses: {
      inicio: "25 mg/dia (à noite)",
      terapeutica: "25–50 mg/dia (à noite)",
      maxima: "50 mg/dia",
    },
    vidaMedia: "1–2 horas",
    principaisEfeitosAdversos: [
      "Hepatotoxicidade (raro, mas potencialmente grave — monitorar TGO/TGP)",
      "Cefaleia",
      "Náusea",
      "Tontura",
      "Ansiedade",
    ],
    interacoesImportantes: [
      "Inibidores potentes de CYP1A2 (fluvoxamina, ciprofloxacino): contraindicado — aumentam nível >60x",
      "Álcool: não recomendado (hepatotoxicidade)",
      "Fumantes: metabolismo aumentado (indução CYP1A2)",
    ],
    observacoes:
      "Contraindicada em hepatopatia. Verificar enzimas hepáticas (TGO/TGP) no início, após 3 e 6 semanas, e 6 e 12 semanas depois — interromper se >3x o limite superior do normal. Ausência de disfunção sexual e de síndrome de descontinuação. Melhora a arquitetura do sono (regulação circadiana).",
  },

  // ─── Antipsicóticos 1G ────────────────────────────────────────────────────
  {
    id: "atip1g-haloperidol",
    nome: "Haloperidol",
    nomesComerciais: ["Haldol"],
    classe: "atip1g",
    mecanismo:
      "Antagonista potente e seletivo de receptores D2 dopaminérgicos. Responsável pela eficácia antipsicótica e pelos efeitos extrapiramidais.",
    indicacoes: [
      "Esquizofrenia",
      "Episódio maníaco",
      "Agitação psicomotora aguda",
      "Síndrome de Tourette",
      "Delirium em UTI (EV)",
    ],
    doses: {
      inicio: "0,5–2 mg/dia",
      terapeutica: "2–20 mg/dia",
      maxima: "100 mg/dia (situações agudas)",
    },
    vidaMedia: "~21 horas",
    principaisEfeitosAdversos: [
      "Sintomas extrapiramidais (SEP): distonia aguda, acatisia, parkinsonismo",
      "Prolongamento do intervalo QTc (especialmente IV)",
      "Discinesia tardia com uso crônico",
      "Hiperprolactinemia",
      "Sedação (moderada)",
      "Síndrome neuroléptica maligna (raro, grave)",
    ],
    interacoesImportantes: [
      "Depressores do SNC (álcool, opioides, BZDs): potencialização",
      "Medicamentos que prolongam QTc: risco aumentado — monitorar ECG (especialmente IV)",
      "Lítio: risco de neurotoxicidade",
      "Anticolinérgicos: podem mascarar SEP e causar íleo paralítico",
    ],
    observacoes:
      "Primeira escolha IV em ambiente de UTI para delirium. EVITAR em doença de Parkinson (bloqueio D2 piora sintomas motores). Monitorar QTc quando administrado por via IV. Para distonia aguda: biperideno 2 mg IM/EV. Para uso de longa duração: Haldol Decanoato IM (mensal).",
  },
  {
    id: "atip1g-clorpromazina",
    nome: "Clorpromazina",
    nomesComerciais: ["Amplictil"],
    classe: "atip1g",
    mecanismo:
      "Antagonista D2 de baixa potência com amplo perfil de bloqueio: D1/D2, H1, α1, M1. O protótipo da classe dos antipsicóticos.",
    indicacoes: [
      "Esquizofrenia",
      "Agitação psicomotora grave",
      "Episódio maníaco agudo",
      "Soluço intratável (doses baixas, off-label)",
    ],
    doses: {
      inicio: "25–50 mg/dia",
      terapeutica: "200–1000 mg/dia",
      maxima: "1000 mg/dia",
    },
    vidaMedia: "8–35 horas",
    principaisEfeitosAdversos: [
      "Sedação intensa",
      "Hipotensão ortostática",
      "Fotossensibilidade cutânea",
      "Sintomas extrapiramidais (menor que o haloperidol)",
      "Prolongamento do QTc",
      "Agranulocitose (raro)",
      "Colestase hepática",
    ],
    interacoesImportantes: [
      "Depressores do SNC: potencialização",
      "Anti-hipertensivos: hipotensão aditiva",
      "Atropínicos: efeitos anticolinérgicos aditivos",
    ],
    observacoes:
      "CPZ (clorpromazina) 100 mg é a unidade de referência para equivalência de doses entre antipsicóticos. Amplamente usada no Brasil para sedação/agitação, sobretudo pela disponibilidade IM. O perfil de baixa potência D2 gera menos SEP mas mais sedação e hipotensão.",
  },

  // ─── Antipsicóticos 2G ────────────────────────────────────────────────────
  {
    id: "atip2g-risperidona",
    nome: "Risperidona",
    nomesComerciais: ["Risperdal", "Zargus"],
    classe: "atip2g",
    mecanismo:
      "Antagonista D2 e 5-HT2A (relação 5-HT2A/D2 alta). Também antagonismo de α1, α2 e H1.",
    indicacoes: [
      "Esquizofrenia",
      "Episódio maníaco agudo (TAB)",
      "Irritabilidade no Transtorno do Espectro Autista (TEA)",
      "Transtorno de personalidade borderline (adjuvante, off-label)",
    ],
    doses: {
      inicio: "0,5–1 mg/dia",
      terapeutica: "2–8 mg/dia",
      maxima: "16 mg/dia",
    },
    vidaMedia: "~20 horas (risperidona + 9-OH-risperidona)",
    principaisEfeitosAdversos: [
      "Sintomas extrapiramidais dose-dependentes (mais que outros 2G)",
      "Hiperprolactinemia (mais acentuada entre os 2G)",
      "Ganho de peso moderado",
      "Sedação",
      "Hipotensão ortostática",
    ],
    interacoesImportantes: [
      "Carbamazepina: reduz nível de risperidona ~50%",
      "Fluoxetina/paroxetina (inibidores CYP2D6): aumentam nível",
      "Anti-hipertensivos: hipotensão aditiva",
      "Depressores do SNC: sedação aditiva",
    ],
    observacoes:
      "Disponível em formulação de ação prolongada injetável (LAI): Risperdal Consta (IM bimensal). Boa relação custo-benefício. SEP dose-dependente — em doses > 6 mg, o perfil se aproxima dos antipsicóticos 1G. Monitorar prolactina.",
  },
  {
    id: "atip2g-olanzapina",
    nome: "Olanzapina",
    nomesComerciais: ["Zyprexa", "Zydis (ODT)"],
    classe: "atip2g",
    mecanismo:
      "Antagonista D2, 5-HT2A/C, H1, M1–M5, α1. Amplo bloqueio de múltiplos receptores confere eficácia e efeitos adversos metabólicos.",
    indicacoes: [
      "Esquizofrenia (sintomas positivos e negativos)",
      "Episódio maníaco agudo",
      "Manutenção do TAB",
      "Agitação aguda (formulação IM)",
      "Náuseas resistentes por quimioterapia (off-label)",
    ],
    doses: {
      inicio: "5 mg/dia",
      terapeutica: "5–20 mg/dia",
      maxima: "40 mg/dia",
    },
    vidaMedia: "~30 horas",
    principaisEfeitosAdversos: [
      "Ganho de peso intenso (entre os maiores da classe)",
      "Síndrome metabólica (hiperglicemia, dislipidemia, obesidade)",
      "Diabetes mellitus tipo 2",
      "Sedação",
      "Hipotensão ortostática",
      "Efeitos anticolinérgicos moderados",
    ],
    interacoesImportantes: [
      "Tabagismo: induz CYP1A2 — fumantes têm nível ~40% menor; ajustar ao parar de fumar",
      "Fluvoxamina: aumenta nível de olanzapina",
      "Depressores do SNC: potencialização",
      "Álcool: potencialização e hipotensão",
    ],
    observacoes:
      "Monitorar glicemia, lipídios e peso regularmente. Zyprexa Zydis (comprimido ODT) é útil quando há recusa ou dúvida sobre deglutição. A formulação IM (Zyprexa IntraMuscular) NÃO deve ser combinada com benzodiazepínico IM no mesmo momento (risco de depressão respiratória). Eficaz tanto para sintomas positivos quanto negativos.",
  },
  {
    id: "atip2g-quetiapina",
    nome: "Quetiapina",
    nomesComerciais: ["Seroquel", "Seroquel XR"],
    classe: "atip2g",
    mecanismo:
      "Antagonista D2 e 5-HT2A; antagonista H1 (sedação) e α1 (hipotensão). Metabólito ativo (norquetiapina) inibe NET — contribui para o efeito antidepressivo.",
    indicacoes: [
      "Esquizofrenia",
      "Episódio maníaco agudo no TAB",
      "Depressão bipolar (300 mg — aprovado para TAB I e II)",
      "Manutenção do TAB",
      "Depressão unipolar resistente (adjuvante, off-label)",
      "Insônia (25–100 mg, off-label)",
    ],
    doses: {
      inicio: "25 mg/dia (insônia/idosos); 50 mg/dia (TAB)",
      terapeutica: "300–800 mg/dia (psicose); 300 mg/dia (dep. bipolar); 50–300 mg/dia (TAB manutenção)",
      maxima: "800 mg/dia",
    },
    vidaMedia: "~6 horas",
    principaisEfeitosAdversos: [
      "Sedação (intensa em doses baixas)",
      "Ganho de peso",
      "Hipotensão ortostática",
      "Prolongamento do QTc",
      "Hiperglicemia e dislipidemia",
      "Boca seca",
    ],
    interacoesImportantes: [
      "Inibidores de CYP3A4 (ketoconazol, eritromicina): aumentam nível significativamente",
      "Indutores de CYP3A4 (carbamazepina, rifampicina): reduzem nível",
      "Medicamentos que prolongam QTc: risco aditivo",
      "Anti-hipertensivos: hipotensão aditiva",
    ],
    observacoes:
      "Em doses baixas (25–100 mg), a sedação (via H1) e a ansiolítica predominam — usada amplamente off-label para insônia, especialmente em pacientes com TAB. Aprovada para depressão bipolar I e II (diferencial importante). Praticamente sem SEP. Monitorar metabólico.",
  },
  {
    id: "atip2g-aripiprazol",
    nome: "Aripiprazol",
    nomesComerciais: ["Abilify", "Aristab"],
    classe: "atip2g",
    mecanismo:
      "Agonista parcial de D2/D3 e 5-HT1A; antagonista de 5-HT2A. Perfil de 'estabilizador de dopamina': ativa quando há hipodopaminergia e atenua quando há hiperdopaminergia.",
    indicacoes: [
      "Esquizofrenia",
      "Episódio maníaco agudo e misto no TAB",
      "Depressão maior (adjuvante)",
      "Transtorno de irritabilidade no TEA",
      "Síndrome de Tourette",
    ],
    doses: {
      inicio: "10–15 mg/dia",
      terapeutica: "10–30 mg/dia",
      maxima: "30 mg/dia",
    },
    vidaMedia: "~75 horas (aripiprazol); ~94 horas (dehidro-aripiprazol)",
    principaisEfeitosAdversos: [
      "Acatisia (frequente — limitador de dose)",
      "Insônia",
      "Náusea",
      "Cefaleia",
      "Ansiedade/agitação",
    ],
    interacoesImportantes: [
      "Inibidores de CYP2D6 (fluoxetina, paroxetina): aumentam nível — reduzir dose 50%",
      "Inibidores de CYP3A4 (ketoconazol): aumentam nível — reduzir dose 50%",
      "Indutores de CYP3A4 (carbamazepina): reduzem nível — dobrar dose",
    ],
    observacoes:
      "Prolactina neutra ou reduzida (agonismo D2 parcial). Mínimos efeitos metabólicos — não causa significativa elevação de glicemia, lipídios ou ganho de peso. Perfil ativador. Disponível em LAI: Abilify Maintena (mensal) e Aristada (mensal/bimensal). A acatisia pode ser gerenciada com propranolol ou benzos.",
  },
  {
    id: "atip2g-clozapina",
    nome: "Clozapina",
    nomesComerciais: ["Leponex", "Clozapin"],
    classe: "atip2g",
    mecanismo:
      "Antagonista D1/D2/D4, 5-HT2A/C, H1, α1/α2, M1–M5. Perfil de múltiplo bloqueio responsável pela eficácia única e pelos efeitos adversos graves.",
    indicacoes: [
      "Esquizofrenia resistente ao tratamento (após falha de ≥2 antipsicóticos adequados)",
      "Ideação suicida persistente na esquizofrenia ou TAB",
      "Psicose na doença de Parkinson",
    ],
    doses: {
      inicio: "12,5 mg/dia",
      terapeutica: "200–600 mg/dia",
      maxima: "900 mg/dia",
    },
    vidaMedia: "~12 horas",
    principaisEfeitosAdversos: [
      "AGRANULOCITOSE (monitoramento hematológico obrigatório e periódico)",
      "Sialorreia (sialorréia — muito frequente)",
      "Convulsões dose-dependentes (> 600 mg — alto risco)",
      "Ganho de peso intenso e síndrome metabólica",
      "Miocardite (raro, primeiras semanas — monitorar troponina e PCR)",
      "Sedação intensa",
      "Hipotensão ortostática",
      "Taquicardia sinusal",
      "Constipação (pode progredir para íleo — risco de vida)",
    ],
    interacoesImportantes: [
      "Fluvoxamina: aumenta nível de clozapina ~5–10x (inibição CYP1A2) — cautela/ajuste de dose",
      "Cigarro (tabagismo): reduz nível (indução CYP1A2) — monitorar ao parar de fumar",
      "Carbamazepina: contraindicado (agranulocitose aditiva)",
      "Benzodiazepínicos IM: relatos de parada cardiorrespiratória — cautela extrema",
      "Outras mielossupressivas: risco aumentado de agranulocitose",
    ],
    observacoes:
      "NUNCA pular o monitoramento hematológico: hemograma semanal nos primeiros 18 semanas, depois quinzenal até 1 ano, depois mensal. Suspender se neutrófilos < 1000/mm³. Única droga com evidência robusta de eficácia em resistência e de redução de suicídio na esquizofrenia. A constipação grave pode levar a megacólon tóxico — monitorar hábito intestinal.",
  },
  {
    id: "atip2g-ziprasidona",
    nome: "Ziprasidona",
    nomesComerciais: ["Geodon", "Zeldox"],
    classe: "atip2g",
    mecanismo:
      "Antagonista D2/D3/5-HT2A; agonista 5-HT1A; inibição moderada de SERT e NET. Prolonga intervalo QTc via bloqueio de canais de potássio.",
    indicacoes: [
      "Esquizofrenia",
      "Episódio maníaco agudo no TAB",
      "Agitação aguda (formulação IM)",
    ],
    doses: {
      inicio: "40 mg 2x/dia (com alimento)",
      terapeutica: "80–160 mg/dia",
      maxima: "200 mg/dia",
    },
    vidaMedia: "~7 horas",
    principaisEfeitosAdversos: [
      "Prolongamento do QTc (maior entre os 2G — monitorar ECG)",
      "Acatisia",
      "Sedação",
      "Tontura",
      "Náusea",
    ],
    interacoesImportantes: [
      "Medicamentos que prolongam QTc: contraindicado em combinação (antiarrítmicos, macrolídeos, outros antipsicóticos)",
      "Inibidores CYP3A4: aumentam nível",
      "Carbamazepina: reduz nível ~35%",
    ],
    observacoes:
      "DEVE ser administrada com alimento — a biodisponibilidade dobra com refeição (de ~40% para ~60%). Menor ganho de peso e mínimos efeitos metabólicos entre os 2G — vantagem relevante. Monitorar ECG antes e após início (baseline QTc). Contraindicada em QTc prolongado basal ou em uso de outros QTc-prolongadores.",
  },
  {
    id: "atip2g-paliperidona",
    nome: "Paliperidona",
    nomesComerciais: ["Invega", "Invega Sustenna", "Invega Trinza"],
    classe: "atip2g",
    mecanismo:
      "Metabólito ativo da risperidona (9-OH-risperidona). Mesmo mecanismo: antagonista D2 e 5-HT2A, α1, α2 e H1.",
    indicacoes: [
      "Esquizofrenia",
      "Transtorno esquizoafetivo",
    ],
    doses: {
      inicio: "3–6 mg/dia",
      terapeutica: "3–12 mg/dia",
      maxima: "12 mg/dia",
    },
    vidaMedia: "~23 horas",
    principaisEfeitosAdversos: [
      "Hiperprolactinemia",
      "SEP dose-dependente",
      "Ganho de peso moderado",
      "Sedação",
      "Hipotensão ortostática",
      "Prolongamento QTc (menor que ziprasidona)",
    ],
    interacoesImportantes: [
      "Carbamazepina: reduz nível de paliperidona",
      "Anti-hipertensivos: hipotensão aditiva",
    ],
    observacoes:
      "Excretada inalterada pelos rins (não metabolizada por CYP) — menos interações farmacológicas. Dose deve ser ajustada em insuficiência renal. LAI disponível: Invega Sustenna (mensal — inclui duas doses de ataque) e Invega Trinza (trimestral — após 4 meses de Sustenna). Excelente opção para melhora de adesão.",
  },

  // ─── Estabilizadores de Humor ─────────────────────────────────────────────
  {
    id: "estab-litio",
    nome: "Lítio",
    nomesComerciais: ["Carbolitium", "Lithobid"],
    classe: "estabilizador",
    mecanismo:
      "Múltiplos mecanismos: inibição de GSK-3β, inositol monofosfatase, modulação de sinalização via PKC e neuroproteção via BDNF. Mecanismo exato não completamente elucidado.",
    indicacoes: [
      "Transtorno afetivo bipolar (TAB) — manutenção (1ª linha)",
      "Mania aguda",
      "Depressão bipolar",
      "Prevenção de suicídio (única droga com evidência de nível A)",
      "Potencialização de antidepressivos em depressão resistente",
    ],
    doses: {
      inicio: "300 mg 3x/dia",
      terapeutica: "600–1800 mg/dia (litemia: 0,6–1,2 mEq/L manutenção; 0,8–1,0 mEq/L fase aguda)",
      maxima: "Guiado pela litemia (toxicidade > 1,5 mEq/L)",
    },
    vidaMedia: "~24 horas",
    principaisEfeitosAdversos: [
      "Tremor fino das mãos",
      "Poliúria e polidipsia",
      "Ganho de peso",
      "Hipotireoidismo (monitorar TSH)",
      "Hiperparatireoidismo",
      "Diabetes insipidus nefrogênico",
      "Nefrotoxicidade crônica (uso prolongado)",
      "Alterações cognitivas (memória)",
    ],
    interacoesImportantes: [
      "AINEs (ibuprofeno, diclofenaco): aumentam litemia — risco de toxicidade",
      "Diuréticos tiazídicos: aumentam litemia",
      "IECAs e ARBs: aumentam litemia",
      "Teofilina: reduz litemia",
      "Haloperidol: relatos de neurotoxicidade",
    ],
    observacoes:
      "Única droga com evidência de nível A para prevenção de suicídio. Índice terapêutico estreito — monitorar litemia periodicamente. Sinais de toxicidade: tremor grosseiro, ataxia, confusão, vômitos — litemia urgente. Manter hidratação adequada. Monitorar TSH, creatinina e função renal a cada 6 meses.",
  },
  {
    id: "estab-valproato",
    nome: "Valproato (Ácido Valpróico)",
    nomesComerciais: ["Depakote", "Depakene", "Valpakine"],
    classe: "estabilizador",
    mecanismo:
      "Múltiplos mecanismos: bloqueio de canais de sódio voltagem-dependentes, aumento do GABA (inibição do GABA-T), inibição de GSK-3β e HDAC.",
    indicacoes: [
      "Mania aguda (1ª linha)",
      "Ciclagem rápida no TAB (1ª linha)",
      "Manutenção do TAB (especialmente ciclagem rápida)",
      "Epilepsia generalizada e focal",
      "Profilaxia de enxaqueca",
    ],
    doses: {
      inicio: "250 mg 2–3x/dia",
      terapeutica: "750–2000 mg/dia (nível sérico: 50–125 mcg/mL)",
      maxima: "60 mg/kg/dia",
    },
    vidaMedia: "8–17 horas",
    principaisEfeitosAdversos: [
      "TERATOGENICIDADE GRAVE (espinha bífida, síndrome fetal por valproato)",
      "Ganho de peso",
      "Alopecia (reversível)",
      "Tremor",
      "Hepatotoxicidade (monitorar TGO/TGP — especialmente em crianças < 2 anos)",
      "Trombocitopenia",
      "Hiperandrogenismo e SOP em mulheres jovens",
      "Pancreatite (raro)",
    ],
    interacoesImportantes: [
      "Lamotrigina: duplica o nível de lamotrigina (inibição glucuronidação) — reduzir dose de lamotrigina à metade",
      "Carbamazepina: reduz nível de valproato",
      "Aspirina em altas doses: desloca da proteína — aumenta nível livre",
      "Outros antiepilépticos: múltiplas interações",
    ],
    observacoes:
      "CONTRAINDICADO em mulheres em idade fértil sem contracepção eficaz e que planejam gestação — risco teratogênico alto e inequívoco. Primeira linha para mania aguda e ciclagem rápida. Monitorar hemograma, função hepática e nível sérico periodicamente.",
  },
  {
    id: "estab-carbamazepina",
    nome: "Carbamazepina",
    nomesComerciais: ["Tegretol", "Tegretol CR"],
    classe: "estabilizador",
    mecanismo:
      "Bloqueador de canais de sódio voltagem-dependentes. Reduz disparo repetitivo de neurônios. Também agonista parcial de receptores adenosina.",
    indicacoes: [
      "Mania aguda (alternativa ao lítio)",
      "Manutenção do TAB",
      "Epilepsia focal (1ª linha)",
      "Neuralgia do trigêmeo (1ª linha)",
    ],
    doses: {
      inicio: "100–200 mg/dia",
      terapeutica: "400–1200 mg/dia",
      maxima: "1600 mg/dia",
    },
    vidaMedia: "25–65 horas (reduz com auto-indução para ~12 horas)",
    principaisEfeitosAdversos: [
      "Diplopia e ataxia (dose-dependentes, transitórios)",
      "Hiponatremia (SIADH)",
      "Erupção cutânea (Stevens-Johnson e DRESS — risco aumentado em portadores de HLA-B*1502)",
      "Agranulocitose e aplasia medular (raro)",
      "Teratogenicidade (espinha bífida)",
      "Tontura e náusea",
    ],
    interacoesImportantes: [
      "INDUTOR POTENTE de CYP3A4, 1A2, 2C9, 2C19 e glicoproteína-P — reduz nível de INÚMEROS fármacos",
      "Anticoncepcional oral: reduz eficácia (indução CYP3A4) — usar método adicional",
      "Varfarina, digoxina, lamotrigina, valproato, benzodiazepínicos: nível reduzido",
      "IMAOs: contraindicado",
    ],
    observacoes:
      "Sofre auto-indução enzimática — os próprios níveis plasmáticos caem nas primeiras semanas (monitorar). Testar HLA-B*1502 em pacientes asiáticos antes de iniciar (alto risco de Stevens-Johnson). Monitorar sódio regularmente. Alternativa ao lítio em pacientes que não toleram ou têm contraindicação.",
  },
  {
    id: "estab-lamotrigina",
    nome: "Lamotrigina",
    nomesComerciais: ["Lamictal", "Lamitor"],
    classe: "estabilizador",
    mecanismo:
      "Bloqueio de canais de sódio voltagem-dependentes e cálcio, reduzindo liberação de glutamato e aspartato. Mecanismo do efeito estabilizador de humor não completamente elucidado.",
    indicacoes: [
      "Manutenção do TAB (especialmente fase depressiva — 1ª linha)",
      "Depressão bipolar",
      "Epilepsia focal e generalizada",
    ],
    doses: {
      inicio: "25 mg/dia (12,5 mg se em uso de valproato)",
      terapeutica: "100–400 mg/dia",
      maxima: "400 mg/dia (200 mg se com valproato)",
    },
    vidaMedia: "25–33 horas (com valproato: 45–100h; com indutores: ~15h)",
    principaisEfeitosAdversos: [
      "Rash cutâneo (Stevens-Johnson e DRESS — urgência dermatológica — especialmente com titulação rápida)",
      "Cefaleia",
      "Tontura",
      "Diplopia",
      "Náusea",
      "Ataxia",
    ],
    interacoesImportantes: [
      "Valproato: DOBRA o nível de lamotrigina — usar dose inicial e de manutenção pela METADE",
      "Carbamazepina, fenitoína, rifampicina (indutores): reduzem nível pela metade",
      "Anticoncepcional oral (etinilestradiol): reduz nível de lamotrigina ~50% — pode haver ruptura de humor",
    ],
    observacoes:
      "A titulação LENTA é OBRIGATÓRIA para reduzir o risco de Stevens-Johnson. Qualquer rash deve ser avaliado com urgência — suspender se lesão mucosa, bolhas, descamação. Primeira linha para manutenção e prevenção de depressão bipolar. Segura na gestação comparada ao valproato (risco relativo menor, mas não zero).",
  },

  // ─── Ansiolíticos e Hipnóticos ────────────────────────────────────────────
  {
    id: "benzo-clonazepam",
    nome: "Clonazepam",
    nomesComerciais: ["Rivotril", "Clonotril"],
    classe: "ansiolitico",
    mecanismo:
      "Agonista dos receptores GABA-A (modulador alostérico positivo). Potencia a ação inibitória do GABA aumentando frequência de abertura do canal de cloro.",
    indicacoes: [
      "Transtorno de ansiedade generalizada (TAG)",
      "Transtorno de pânico",
      "Epilepsia (crises mioclônicas e de ausência)",
      "Transtorno de movimento periódico dos membros",
      "Agitação psicomotora aguda (adjuvante)",
    ],
    doses: {
      inicio: "0,25–0,5 mg/dia",
      terapeutica: "0,5–4 mg/dia (ansiedade); 1–20 mg/dia (epilepsia)",
      maxima: "20 mg/dia",
    },
    vidaMedia: "18–50 horas",
    principaisEfeitosAdversos: [
      "Sedação e sonolência",
      "Tolerância e dependência física",
      "Comprometimento cognitivo e memória",
      "Prejuízo psicomotor (risco de quedas — idosos)",
      "Síndrome de descontinuação (abstinência)",
    ],
    interacoesImportantes: [
      "Depressores do SNC (álcool, opioides, antipsicóticos): depressão respiratória",
      "Inibidores de CYP3A4 (ketoconazol, eritromicina): aumentam nível",
      "Valproato: pode aumentar efeito sedativo",
    ],
    observacoes:
      "Ação prolongada — útil para TAG e pânico. O risco de dependência aumenta com uso > 4 semanas; SEMPRE planejar desmame gradual (reduzir 10–25% a cada 1–2 semanas). Evitar em idosos (critérios de Beers). Primeira escolha BZD em abstinência alcoólica junto com diazepam em muitos protocolos.",
  },
  {
    id: "benzo-lorazepam",
    nome: "Lorazepam",
    nomesComerciais: ["Ativan", "Lorium"],
    classe: "ansiolitico",
    mecanismo:
      "Agonista dos receptores GABA-A. Sem metabólitos ativos — conjugado diretamente ao ácido glicurônico.",
    indicacoes: [
      "Ansiedade aguda e crises de pânico",
      "Status epilepticus (formulação parenteral — 1ª linha IV)",
      "Sedação em procedimentos",
      "Agitação psicomotora aguda (IM)",
      "Abstinência alcoólica em hepatopatas",
    ],
    doses: {
      inicio: "0,5 mg",
      terapeutica: "0,5–4 mg/dia",
      maxima: "10 mg/dia",
    },
    vidaMedia: "10–20 horas",
    principaisEfeitosAdversos: [
      "Sedação",
      "Tolerância e dependência",
      "Prejuízo cognitivo e psicomotor",
      "Amnésia anterógrada",
    ],
    interacoesImportantes: [
      "Depressores do SNC: potencialização — risco de depressão respiratória",
      "Álcool: efeito sinérgico",
      "Probenecida: aumenta nível (reduz glicuronidação)",
    ],
    observacoes:
      "SEM metabólitos ativos — preferido em idosos e em pacientes com insuficiência hepática (metabolismo de fase II). Disponível em formulação IM e IV — fundamental no manejo de status epilepticus e agitação aguda hospitalar. Onset mais rápido do que diazepam quando administrado IM.",
  },
  {
    id: "benzo-diazepam",
    nome: "Diazepam",
    nomesComerciais: ["Valium", "Dienpax"],
    classe: "ansiolitico",
    mecanismo:
      "Agonista dos receptores GABA-A com múltiplos metabólitos ativos de longa duração (desmetildiazepam, oxazepam).",
    indicacoes: [
      "Abstinência alcoólica (protocolo CIWA)",
      "Ansiedade aguda",
      "Espasmo muscular",
      "Status epilepticus (IV)",
      "Sedação em procedimentos",
    ],
    doses: {
      inicio: "2–5 mg",
      terapeutica: "2–40 mg/dia (divididos)",
      maxima: "60 mg/dia (abstinência alcoólica)",
    },
    vidaMedia: "20–100 horas (metabólitos ativos até 200 horas)",
    principaisEfeitosAdversos: [
      "Sedação prolongada",
      "Tolerância e dependência",
      "Acúmulo em idosos (risco de quedas e confusão)",
      "Comprometimento cognitivo",
      "Depressão respiratória em superdose",
    ],
    interacoesImportantes: [
      "Depressores do SNC: potencialização — risco de depressão respiratória e coma",
      "Álcool: efeito sinérgico",
      "Cimetidina: aumenta nível",
    ],
    observacoes:
      "EVITAR em idosos (critérios de Beers — risco de quedas e confusão). Primeira escolha para abstinência alcoólica por auto-tapering (meia-vida longa). Em insuficiência hepática, PREFERIR lorazepam ou oxazepam (sem metabólitos ativos). Reversível com flumazenil.",
  },
  {
    id: "ansi-buspirona",
    nome: "Buspirona",
    nomesComerciais: ["Buspar", "Ansitec"],
    classe: "ansiolitico",
    mecanismo:
      "Agonista parcial de receptores 5-HT1A pré e pós-sinápticos e agonista parcial de D2. Sem ação sobre receptores GABA-A — mecanismo distinto dos BZDs.",
    indicacoes: [
      "Transtorno de ansiedade generalizada (TAG) — uso crônico",
    ],
    doses: {
      inicio: "5 mg 2–3x/dia",
      terapeutica: "15–60 mg/dia",
      maxima: "60 mg/dia",
    },
    vidaMedia: "2–3 horas",
    principaisEfeitosAdversos: [
      "Tontura",
      "Cefaleia",
      "Náusea",
      "Nervosismo",
      "Sem sedação (diferencial)",
      "Sem dependência ou tolerância",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado (risco de HAS e síndrome serotoninérgica)",
      "Inibidores de CYP3A4 (ketoconazol, eritromicina): aumentam nível",
      "Rifampicina: reduz nível significativamente",
    ],
    observacoes:
      "Início de ação LENTO (2–4 semanas) — não tem efeito ansiolítico agudo/imediato. Sem dependência, sem tolerância, sem abstinência — vantagem importante em TAG crônico. NÃO é eficaz em pacientes que já usaram BZDs (expectativa de sedação imediata não atendida). Alternativa segura para uso prolongado.",
  },
  {
    id: "hipn-zolpidem",
    nome: "Zolpidem",
    nomesComerciais: ["Stilnox", "Zolpidem"],
    classe: "hipnotico",
    mecanismo:
      "Agonista seletivo dos receptores GABA-A contendo subunidade α1 (hipnose). Diferente dos BZDs, tem menor ação ansiolítica, anticonvulsivante e miorelaxante.",
    indicacoes: [
      "Insônia (curto prazo — máximo 4 semanas)",
    ],
    doses: {
      inicio: "5 mg (mulheres e idosos)",
      terapeutica: "5–10 mg (ao deitar)",
      maxima: "10 mg/noite (homens); 5 mg/noite (mulheres e idosos)",
    },
    vidaMedia: "~2,5 horas",
    principaisEfeitosAdversos: [
      "Sonambulismo e comportamentos automáticos (comer, dirigir — sem recordação)",
      "Amnésia anterógrada",
      "Tolerância e dependência",
      "Efeito rebote de insônia",
      "Sedação residual matinal (especialmente formulação CR)",
    ],
    interacoesImportantes: [
      "Depressores do SNC (álcool, opioides, BZDs): potencialização — risco de depressão respiratória",
      "Inibidores de CYP3A4 (ketoconazol): aumentam nível",
      "Rifampicina: reduz nível",
    ],
    observacoes:
      "Usar pelo menor tempo necessário — insônia crônica deve receber tratamento com TCC-I (padrão-ouro). Mulheres eliminam mais lentamente (maior risco de sedação matinal) — dose máxima 5 mg. Idosos: 5 mg. Os comportamentos complexos durante o sono (sonambulismo, sonofagia) são subestimados pelos pacientes. Critérios de Beers — cautela em idosos.",
  },

  // ─── Psicoestimulantes ────────────────────────────────────────────────────
  {
    id: "estim-metilfenidato",
    nome: "Metilfenidato",
    nomesComerciais: ["Ritalina", "Ritalina LA", "Concerta", "Venvanse (lisdexanfetamina)"],
    classe: "psicoestimulante",
    mecanismo:
      "Bloqueador do transportador de dopamina (DAT) e noradrenalina (NET), aumentando concentração sináptica de DA e NA no córtex pré-frontal e striatum.",
    indicacoes: [
      "Transtorno de déficit de atenção e hiperatividade (TDAH) em crianças, adolescentes e adultos (1ª linha)",
      "Narcolepsia",
    ],
    doses: {
      inicio: "5 mg 2x/dia (crianças); 10 mg 1–2x/dia (adultos)",
      terapeutica: "20–60 mg/dia",
      maxima: "60 mg/dia",
    },
    vidaMedia: "3–5 horas (IR); 8–12 horas (Concerta/LA)",
    principaisEfeitosAdversos: [
      "Anorexia e perda de apetite",
      "Insônia",
      "Taquicardia e elevação de pressão arterial",
      "Cefaleia",
      "Tics (cautela em síndrome de Tourette)",
      "Retardo de crescimento em crianças (monitorar curva)",
      "Ansiedade e irritabilidade",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado (risco de crise hipertensiva)",
      "Anti-hipertensivos: antagonismo do efeito",
      "Varfarina, fenitoína, antidepressivos tricíclicos: aumento de nível (inibição de metabolismo)",
    ],
    observacoes:
      "Primeira linha para TDAH em todas as faixas etárias. Concerta (OROS — liberação osmótica) garante cobertura ao longo do dia (8–12h). Drug holiday (férias medicamentosas) pode ser considerado em crianças durante o verão/férias escolar para avaliação de crescimento e recalibração da dose. Monitorar FC e PA periodicamente. Substância sujeita a controle especial (receita azul no Brasil).",
  },
  {
    id: "estim-atomoxetina",
    nome: "Atomoxetina",
    nomesComerciais: ["Strattera"],
    classe: "psicoestimulante",
    mecanismo:
      "Inibidor seletivo do transportador de noradrenalina (NET) no córtex pré-frontal. Sem ação dopaminérgica significativa no núcleo accumbens — baixo potencial de abuso.",
    indicacoes: [
      "Transtorno de déficit de atenção e hiperatividade (TDAH) em crianças (≥6 anos), adolescentes e adultos",
      "TDAH com comorbidade: tics, abuso de substâncias, ansiedade",
    ],
    doses: {
      inicio: "0,5 mg/kg/dia (crianças); 40 mg/dia (adultos)",
      terapeutica: "1,2–1,4 mg/kg/dia; 80–100 mg/dia (adultos)",
      maxima: "100 mg/dia",
    },
    vidaMedia: "~5 horas (metabolizadores extensos); ~20 horas (metabolizadores lentos CYP2D6)",
    principaisEfeitosAdversos: [
      "Náusea e vômito (especialmente no início)",
      "Diminuição do apetite",
      "Insônia ou sonolência",
      "Taquicardia e elevação leve de PA",
      "Hepatotoxicidade (raro — monitorar se sintomas)",
      "Ideação suicida (monitorar nas primeiras semanas — alerta de caixa preta)",
    ],
    interacoesImportantes: [
      "IMAOs: contraindicado",
      "Inibidores de CYP2D6 (fluoxetina, paroxetina): aumentam nível significativamente — reduzir dose",
      "Salbutamol (albuterol): taquicardia aditiva",
    ],
    observacoes:
      "Não é estimulante — não sujeito ao mesmo controle de substâncias que o metilfenidato (sem receita azul). Início de ação mais lento (4–6 semanas para efeito pleno). Útil quando estimulantes são contraindicados (tics graves, histórico de abuso, necessidade de cobertura 24h). Monitorar PA e FC. Hepatotoxicidade: suspeitar se icterícia, dor abdominal — suspender imediatamente.",
  },
];
