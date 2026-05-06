export type AreaDiagnostico =
  | "humor"
  | "ansiedade"
  | "psicose"
  | "personalidade"
  | "neurodesenvolvimento"
  | "trauma"
  | "substancias";

export interface CriterioDiagnostico {
  codigo: string;
  cid11?: string;
  nome: string;
  sigla?: string;
  area: AreaDiagnostico;
  plano: "free" | "pro";
  descricao: string;
  criterios_dsm5: {
    grupo: string;
    obrigatorio: boolean;
    descricao: string;
    itens?: string[];
    minimo?: number;
  }[];
  diagnostico_diferencial: string[];
  comorbidades_frequentes: string[];
  tratamento_primeira_linha: {
    farmacologico: string;
    psicoterapia: string;
  };
  nota_clinica?: string;
  referencia: string;
}

export const diagnosticos: CriterioDiagnostico[] = [
  // ─── 1. EPISÓDIO DEPRESSIVO MAIOR ──────────────────────────────────────────
  {
    codigo: "296.21–296.25 (F32.0–F32.4)",
    cid11: "6A70.0–6A70.4",
    nome: "Episódio Depressivo Maior",
    sigla: "EDM",
    area: "humor",
    plano: "free",
    descricao:
      "Síndrome caracterizada por humor deprimido persistente e/ou perda de interesse ou prazer em quase todas as atividades, por no mínimo duas semanas consecutivas. Causa prejuízo funcional significativo e não é explicada por substâncias, condições médicas gerais ou luto não complicado. É o transtorno psiquiátrico mais prevalente mundialmente e a principal causa de incapacidade.",
    criterios_dsm5: [
      {
        grupo: "Critério A",
        obrigatorio: true,
        descricao:
          "Cinco (ou mais) dos seguintes sintomas presentes durante o mesmo período de 2 semanas, representando mudança em relação ao funcionamento anterior. Ao menos um dos sintomas deve ser (1) humor deprimido ou (2) perda de interesse ou prazer.",
        itens: [
          "Humor deprimido na maior parte do dia, quase todos os dias (subjetivo ou observado por terceiros)",
          "Acentuada diminuição do interesse ou prazer em todas, ou quase todas, as atividades na maior parte do dia, quase todos os dias (anedonia)",
          "Perda ou ganho significativo de peso sem dieta (>5% do peso corporal em 1 mês), ou diminuição/aumento do apetite quase todos os dias",
          "Insônia ou hipersonia quase todos os dias",
          "Agitação ou retardo psicomotor quase todos os dias (observável por outros, não apenas sensação subjetiva)",
          "Fadiga ou perda de energia quase todos os dias",
          "Sentimentos de inutilidade ou culpa excessiva ou inapropriada quase todos os dias",
          "Capacidade diminuída de pensar, concentrar-se ou tomar decisões quase todos os dias",
          "Pensamentos recorrentes de morte, ideação suicida recorrente sem plano específico, tentativa de suicídio ou plano específico para cometer suicídio",
        ],
        minimo: 5,
      },
      {
        grupo: "Critério B",
        obrigatorio: true,
        descricao:
          "Os sintomas causam sofrimento clinicamente significativo ou prejuízo no funcionamento social, profissional ou em outras áreas importantes da vida do indivíduo.",
      },
      {
        grupo: "Critério C",
        obrigatorio: true,
        descricao:
          "O episódio não é atribuível aos efeitos fisiológicos de uma substância ou a outra condição médica.",
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "O episódio depressivo maior não é mais bem explicado por transtorno esquizoafetivo, esquizofrenia, transtorno esquizofreniforme, transtorno delirante ou outro transtorno do espectro da esquizofrenia e outros transtornos psicóticos especificados ou não especificados.",
      },
      {
        grupo: "Critério E",
        obrigatorio: true,
        descricao:
          "Nunca houve um episódio maníaco ou hipomaníaco (para distinguir do Transtorno Bipolar).",
      },
      {
        grupo: "Especificadores de gravidade",
        obrigatorio: false,
        descricao: "Classificação da gravidade atual do episódio.",
        itens: [
          "Leve (296.21 / F32.0): poucos sintomas além do mínimo; prejuízo funcional menor",
          "Moderado (296.22 / F32.1): número e intensidade intermediários; prejuízo funcional moderado",
          "Grave sem características psicóticas (296.23 / F32.2): número muito acima do mínimo; prejuízo funcional marcante",
          "Com características psicóticas (296.24 / F32.3): alucinações ou delírios presentes (congruentes ou incongruentes com humor)",
          "Em remissão parcial (296.25 / F32.4): sintomas presentes mas critérios plenos não são mais satisfeitos",
        ],
      },
      {
        grupo: "Especificadores adicionais",
        obrigatorio: false,
        descricao: "Podem ser aplicados para caracterizar o episódio.",
        itens: [
          "Com angústia ansiosa: agitação, tensão, preocupações, dificuldade de concentração por medo",
          "Com características mistas: sintomas hipomaníacos/maníacos sublimiares coexistentes",
          "Com características melancólicas: anedonia profunda, piora matutina, despertar precoce, retardo/agitação acentuados, culpa excessiva",
          "Com características atípicas: reatividade do humor, hipersonia, hiperfagia, paralisia de chumbo, sensibilidade à rejeição",
          "Com características psicóticas congruentes/incongruentes com humor",
          "Com catatonia",
          "Com início no periparto",
          "Com padrão sazonal",
        ],
      },
    ],
    diagnostico_diferencial: [
      "Transtorno Bipolar Tipo I ou II (excluir episódios maníacos/hipomaníacos prévios)",
      "Transtorno Depressivo Persistente (Distimia) — humor deprimido crônico mas menos intenso",
      "Depressão secundária a condição médica (hipotireoidismo, anemia, neoplasia, AVC)",
      "Depressão induzida por substância (corticosteroides, betabloqueadores, álcool)",
      "Luto complicado / Transtorno de luto prolongado",
      "Transtorno de Ajustamento com humor deprimido",
    ],
    comorbidades_frequentes: [
      "Transtorno de Ansiedade Generalizada (≈60% de comorbidade)",
      "Transtorno do Pânico",
      "Transtorno por Uso de Álcool ou outras substâncias",
      "Transtornos de personalidade (especialmente cluster B e C)",
      "Doenças clínicas crônicas (diabetes, cardiopatia, dor crônica)",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "ISRS (sertralina 50–200 mg/dia ou escitalopram 10–20 mg/dia) ou IRSN (venlafaxina 75–225 mg/dia) como primeira escolha. Mirtazapina em casos com insônia e perda de peso. Antidepressivos tricíclicos como segunda linha por perfil de efeitos adversos. Tempo mínimo de tratamento: 6–12 meses após remissão para primeiro episódio.",
      psicoterapia:
        "Terapia Cognitivo-Comportamental (TCC) com eficácia equivalente à farmacoterapia em depressão leve a moderada. Ativação comportamental para casos com anedonia predominante. Psicoterapia Interpessoal (TIP) especialmente útil em contexto de perdas e transições de papel.",
    },
    nota_clinica:
      "Sempre avaliar risco de suicídio de forma estruturada (p.ex. Escala Columbia). Em episódios graves com características psicóticas, associar antipsicótico ao antidepressivo. Resposta terapêutica esperada em 4–6 semanas; mudança de estratégia se resposta inadequada após 6–8 semanas em dose adequada. Eletroconvulsoterapia (ECT) é de primeira linha em casos com risco de vida, catatonia ou resistência a múltiplas tentativas farmacológicas.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 183–210.",
  },

  // ─── 2. TRANSTORNO BIPOLAR TIPO I ──────────────────────────────────────────
  {
    codigo: "296.xx (F31.x)",
    cid11: "6A60",
    nome: "Transtorno Bipolar Tipo I",
    sigla: "TB I",
    area: "humor",
    plano: "free",
    descricao:
      "Transtorno caracterizado pela ocorrência de ao menos um episódio maníaco completo, com ou sem episódios depressivos maiores ou hipomaníacos. O episódio maníaco pode emergir de um quadro depressivo ou hipomaníaco e causa grave prejuízo funcional, podendo requerer hospitalização. Tem forte base genética e curso geralmente recorrente.",
    criterios_dsm5: [
      {
        grupo: "Critério A — Episódio Maníaco",
        obrigatorio: true,
        descricao:
          "Período distinto de humor anormalmente e persistentemente elevado, expansivo ou irritável e de energia ou atividade anormalmente aumentada, com duração mínima de 1 semana (ou qualquer duração se hospitalização necessária), presente na maior parte do dia, quase todos os dias.",
      },
      {
        grupo: "Critério B — Sintomas do Episódio Maníaco",
        obrigatorio: true,
        descricao:
          "Durante o período de perturbação do humor e de energia/atividade aumentadas, três (ou mais) dos seguintes sintomas estão presentes em grau significativo (quatro se o humor for apenas irritável):",
        itens: [
          "Autoestima inflada ou grandiosidade",
          "Necessidade de sono diminuída (sente-se descansado após apenas 3 horas de sono)",
          "Mais loquaz que o habitual ou pressão para continuar falando (logorréia)",
          "Fuga de ideias ou experiência subjetiva de que os pensamentos estão acelerados",
          "Distratibilidade (atenção facilmente desviada para estímulos externos irrelevantes)",
          "Aumento da atividade dirigida a objetivos (social, profissional, escolar ou sexual) ou agitação psicomotora",
          "Envolvimento excessivo em atividades com elevado potencial para consequências dolorosas (compras irresponsáveis, indiscrições sexuais, investimentos financeiros insensatos)",
        ],
        minimo: 3,
      },
      {
        grupo: "Critério C",
        obrigatorio: true,
        descricao:
          "A perturbação do humor é suficientemente grave para causar prejuízo acentuado no funcionamento social ou profissional, necessitar de hospitalização para prevenir dano ao paciente ou outros, ou existirem características psicóticas.",
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "O episódio não é atribuível aos efeitos fisiológicos de uma substância (abuso de droga, medicamento) ou a outra condição médica.",
      },
      {
        grupo: "Nota diagnóstica",
        obrigatorio: false,
        descricao:
          "Um episódio maníaco emergindo durante tratamento antidepressivo (medicamento, ECT) e persistindo além do efeito fisiológico do tratamento é suficiente para o diagnóstico de TB I. Episódio hipomaníaco (duração ≥4 dias, sem hospitalização, sem psicose) aponta para TB II.",
      },
      {
        grupo: "Especificadores de estado atual",
        obrigatorio: false,
        descricao: "Aplicar ao episódio mais recente.",
        itens: [
          "Episódio maníaco atual ou mais recente",
          "Episódio hipomaníaco atual ou mais recente",
          "Episódio depressivo atual ou mais recente",
          "Episódio não especificado atual ou mais recente",
          "Com ciclagem rápida: ≥4 episódios em 12 meses",
          "Com padrão sazonal",
          "Com angústia ansiosa, características mistas ou psicóticas",
        ],
      },
    ],
    diagnostico_diferencial: [
      "Transtorno Bipolar Tipo II (ausência de mania plena; apenas hipomania + depressão)",
      "Transtorno Ciclotímico (oscilações sublimiares por ≥2 anos)",
      "Esquizofrenia e Transtorno Esquizoafetivo (psicose independente do humor)",
      "TDAH (hiperatividade crônica desde infância, sem episodicidade)",
      "Mania secundária (hipertireoidismo, uso de esteroides, estimulantes, lesão de lobo frontal direito)",
      "Transtorno de Personalidade Borderline (instabilidade crônica vs. episodicidade do TB)",
    ],
    comorbidades_frequentes: [
      "Transtorno por Uso de Álcool e outras substâncias (>50% ao longo da vida)",
      "Transtorno de Ansiedade (TAG, pânico, fobia social)",
      "TDAH (especialmente difícil de distinguir em crianças)",
      "Transtornos de personalidade (cluster B)",
      "Síndrome Metabólica (especialmente com uso de antipsicóticos atípicos e estabilizadores)",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "Estabilizadores do humor: lítio (litemia alvo 0,8–1,2 mEq/L na mania aguda, 0,6–0,8 na manutenção) ou valproato (nível sérico 50–100 µg/mL). Para mania aguda grave: associar antipsicótico atípico (olanzapina, quetiapina, risperidona ou aripiprazol). Quetiapina é o único aprovado para todas as fases (mania, depressão bipolar, manutenção). Evitar antidepressivos em monoterapia — risco de indução de mania ou ciclagem rápida.",
      psicoterapia:
        "Psicoeducação estruturada (individual ou em grupo) é componente essencial da manutenção — reduz taxa de recaídas. TCC adaptada para TB. Terapia do Ritmo Social e Interpessoal (IPSRT). Familiares devem ser incluídos no processo psicoeducativo.",
    },
    nota_clinica:
      "Lítio é o único estabilizador com evidência robusta de redução de suicídio. Monitorar função renal e tireoidiana a cada 6 meses com lítio. Em episódios mistos (mania+depressão simultâneas), valproato ou antipsicóticos atípicos são preferidos ao lítio. Suspensão abrupta do lítio aumenta risco de recaída rápida.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 127–161.",
  },

  // ─── 3. ESQUIZOFRENIA ──────────────────────────────────────────────────────
  {
    codigo: "295.90 (F20.9)",
    cid11: "6A20",
    nome: "Esquizofrenia",
    area: "psicose",
    plano: "free",
    descricao:
      "Transtorno psicótico crônico caracterizado por sintomas positivos (alucinações, delírios, comportamento desorganizado), sintomas negativos (embotamento afetivo, alogia, abulia, anedonia, associabilidade) e comprometimento cognitivo. Tem início típico no final da adolescência a início da vida adulta, com curso geralmente crônico e recorrente, causando declínio funcional progressivo.",
    criterios_dsm5: [
      {
        grupo: "Critério A",
        obrigatorio: true,
        descricao:
          "Dois (ou mais) dos seguintes, cada um presente por período significativo de tempo durante 1 mês (ou menos, se tratados com sucesso). Ao menos um deve ser (1), (2) ou (3):",
        itens: [
          "Delírios",
          "Alucinações",
          "Discurso desorganizado (p.ex., descarrilamento frequente ou incoerência)",
          "Comportamento grosseiramente desorganizado ou catatônico",
          "Sintomas negativos (expressão emocional diminuída ou abulia)",
        ],
        minimo: 2,
      },
      {
        grupo: "Critério B",
        obrigatorio: true,
        descricao:
          "Por período significativo desde o início do distúrbio, o nível de funcionamento em uma ou mais áreas principais (trabalho, relações interpessoais, autocuidado) está acentuadamente abaixo do nível anterior ao início.",
      },
      {
        grupo: "Critério C — Duração",
        obrigatorio: true,
        descricao:
          "Sinais contínuos do distúrbio persistem por pelo menos 6 meses. Esse período de 6 meses deve incluir ao menos 1 mês de sintomas que satisfazem o Critério A (fase ativa) e pode incluir períodos de sintomas prodrômicos ou residuais. Em períodos prodrômicos ou residuais, o distúrbio pode ser manifestado apenas por sintomas negativos ou por dois ou mais sintomas do Critério A em forma atenuada.",
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "Transtorno Esquizoafetivo e Transtorno Depressivo ou Bipolar com Características Psicóticas foram descartados porque: (1) nenhum episódio depressivo maior ou maníaco ocorreu concomitantemente à fase ativa; ou (2) se episódios de humor ocorreram durante sintomas da fase ativa, eles estiveram presentes apenas por uma minoria do período total das fases ativa e residual.",
      },
      {
        grupo: "Critério E",
        obrigatorio: true,
        descricao:
          "O distúrbio não é atribuível aos efeitos fisiológicos de uma substância ou a outra condição médica.",
      },
      {
        grupo: "Critério F",
        obrigatorio: true,
        descricao:
          "Se há história de Transtorno do Espectro Autista ou transtorno de comunicação de início na infância, o diagnóstico adicional de esquizofrenia é feito apenas se delírios ou alucinações proeminentes, além dos outros sintomas requeridos de esquizofrenia, também estiverem presentes por pelo menos 1 mês.",
      },
      {
        grupo: "Especificadores de curso",
        obrigatorio: false,
        descricao: "Aplicar após 1 ano do início.",
        itens: [
          "Primeiro episódio, atualmente em episódio agudo",
          "Primeiro episódio, atualmente em remissão parcial",
          "Primeiro episódio, atualmente em remissão completa",
          "Múltiplos episódios, atualmente em episódio agudo",
          "Múltiplos episódios, atualmente em remissão parcial ou completa",
          "Contínuo",
          "Não especificado",
          "Com catatonia",
        ],
      },
    ],
    diagnostico_diferencial: [
      "Transtorno Esquizoafetivo (episódios de humor significativos coocorrem com fase ativa)",
      "Transtorno Delirante (apenas delírios sistematizados, sem alucinações proeminentes ou desorganização)",
      "Transtorno Psicótico Breve (<1 mês) e Esquizofreniforme (1–6 meses)",
      "Transtorno Bipolar Tipo I com características psicóticas",
      "Psicose induzida por substâncias (cannabis de alta potência, estimulantes, fenciclidina)",
      "Condições médicas: encefalite anti-NMDAR, lúpus eritematoso sistêmico, neurossífilis, epilepsia do lobo temporal",
    ],
    comorbidades_frequentes: [
      "Transtorno por Uso de Cannabis e outras substâncias (≈50%)",
      "Transtorno Depressivo Maior (20–30%)",
      "Transtorno de Ansiedade Social",
      "Síndrome Metabólica (agravada por antipsicóticos e estilo de vida sedentário)",
      "Tabagismo (≈80%)",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "Antipsicóticos de segunda geração (atípicos) como primeira escolha: risperidona (2–6 mg/dia), olanzapina (10–20 mg/dia), quetiapina (400–800 mg/dia), aripiprazol (15–30 mg/dia), ziprasidona (120–160 mg/dia). Clozapina reservada para esquizofrenia resistente (falha de 2 antipsicóticos em doses adequadas). Formulações de longa ação (LAI) melhoram adesão. Tratar por ao menos 1–2 anos após primeiro episódio; cronicamente em casos recorrentes.",
      psicoterapia:
        "Terapia Cognitivo-Comportamental para psicose (TCCp) — reduz intensidade de sintomas positivos persistentes e melhora insight. Treinamento de habilidades sociais. Reabilitação cognitiva. Suporte a emprego apoiado (Individual Placement and Support — IPS). Psicoeducação familiar para reduzir emoção expressa e prevenir recaídas.",
    },
    nota_clinica:
      "Sintomas negativos (embotamento, alogia, abulia) são os principais determinantes do prognóstico funcional e respondem menos ao tratamento farmacológico. Clozapina tem evidência única para redução de risco de suicídio em psicose. Monitorar agranulocitose com clozapina (hemograma semanal nas primeiras 18 semanas). Primeiro episódio psicótico deve ser tratado com urgência — o período de psicose não tratada (DUP) impacta negativamente o prognóstico.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 101–118.",
  },

  // ─── 4. TAG ────────────────────────────────────────────────────────────────
  {
    codigo: "300.02 (F41.1)",
    cid11: "6B00",
    nome: "Transtorno de Ansiedade Generalizada",
    sigla: "TAG",
    area: "ansiedade",
    plano: "free",
    descricao:
      "Transtorno caracterizado por ansiedade e preocupação excessivas e persistentes (apreensão ansiosa) acerca de múltiplos eventos ou atividades, difíceis de controlar e associadas a sintomas somáticos e cognitivos. A preocupação é pervasiva, flutuando entre diferentes temas da vida cotidiana. Tem início frequentemente na infância ou adolescência e curso crônico com exacerbações.",
    criterios_dsm5: [
      {
        grupo: "Critério A",
        obrigatorio: true,
        descricao:
          "Ansiedade e preocupação excessivas (apreensão ansiosa) ocorrendo na maioria dos dias por pelo menos 6 meses, acerca de uma série de eventos ou atividades (como desempenho profissional ou escolar).",
      },
      {
        grupo: "Critério B",
        obrigatorio: true,
        descricao:
          "O indivíduo considera difícil controlar a preocupação.",
      },
      {
        grupo: "Critério C",
        obrigatorio: true,
        descricao:
          "A ansiedade e a preocupação estão associadas com três (ou mais) dos seguintes seis sintomas (com ao menos alguns deles presentes na maioria dos dias nos últimos 6 meses). Nota: apenas um item é exigido em crianças.",
        itens: [
          "Inquietação ou sensação de estar com os nervos à flor da pele",
          "Fatigabilidade",
          "Dificuldade em concentrar-se ou sensações de \"branco\" na mente",
          "Irritabilidade",
          "Tensão muscular",
          "Perturbação do sono (dificuldade em adormecer ou permanecer dormindo, ou sono insatisfatório)",
        ],
        minimo: 3,
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "A ansiedade, a preocupação ou os sintomas físicos causam sofrimento clinicamente significativo ou prejuízo no funcionamento social, profissional ou em outras áreas importantes.",
      },
      {
        grupo: "Critério E",
        obrigatorio: true,
        descricao:
          "A perturbação não é atribuível aos efeitos fisiológicos de uma substância ou a outra condição médica (p.ex., hipertireoidismo).",
      },
      {
        grupo: "Critério F",
        obrigatorio: true,
        descricao:
          "A perturbação não é mais bem explicada por outro transtorno mental (p.ex., ansiedade ou preocupação sobre crises de pânico no Transtorno do Pânico, avaliação negativa no Transtorno de Ansiedade Social, contaminação no TOC, separação das figuras de apego no Transtorno de Ansiedade de Separação, rememorações de eventos traumáticos no TEPT, ganhar peso na Anorexia Nervosa, queixas físicas no Transtorno de Sintomas Somáticos, percepção de defeitos na aparência no Transtorno Dismórfico Corporal, ter uma doença grave na Ansiedade de Doença ou conteúdo de crenças delirantes na Esquizofrenia ou no Transtorno Delirante).",
      },
    ],
    diagnostico_diferencial: [
      "Ansiedade secundária a condição médica (hipertireoidismo, feocromocitoma, hipoglicemia, arritmias)",
      "Ansiedade induzida por substâncias (cafeína, estimulantes, descontinuação de benzodiazepínicos)",
      "Transtorno do Pânico (preocupação focal sobre crises; crises espontâneas)",
      "Transtorno Depressivo Maior (ruminações mais focadas em culpa e passado; anedonia proeminente)",
      "Transtorno de Ansiedade de Separação",
      "Transtorno de Personalidade Ansioso (traço pervasivo, não episódico)",
    ],
    comorbidades_frequentes: [
      "Transtorno Depressivo Maior (≈60% de comorbidade ao longo da vida)",
      "Transtorno do Pânico",
      "Fobia Social (Transtorno de Ansiedade Social)",
      "Transtorno por Uso de Álcool (uso como automedicação)",
      "Transtorno de Sintomas Somáticos",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "ISRS (escitalopram 10–20 mg/dia, sertralina 50–200 mg/dia, paroxetina CR 12,5–37,5 mg/dia) ou IRSN (venlafaxina XR 75–225 mg/dia, duloxetina 60–120 mg/dia). Buspirona (15–30 mg/dia) é opção sem potencial de dependência. Benzodiazepínicos apenas para uso de curto prazo em crises agudas — evitar uso contínuo pelo risco de dependência e piora cognitiva. Pregabalina tem evidência robusta para TAG (150–600 mg/dia).",
      psicoterapia:
        "TCC é o tratamento psicológico de primeira linha, com ênfase em reestruturação cognitiva das preocupações e treinamento de tolerância à incerteza. Técnicas de relaxamento muscular progressivo (Jacobson) e mindfulness como adjuvantes. Terapia de Aceitação e Compromisso (ACT) com evidência crescente.",
    },
    nota_clinica:
      "Distinguir TAG de preocupação normal: na TAG, as preocupações são excessivas, difíceis de controlar e causam prejuízo funcional. A \"preocupação metapreocupante\" (preocupar-se com o fato de preocupar-se) é característica central. Diferenciar de TAG o hipocondríaco clássico: na ansiedade de doença há preocupação restrita à saúde. Resposta ao tratamento é boa mas recorrências são frequentes — planejar tratamento de longa duração.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 250–257.",
  },

  // ─── 5. TRANSTORNO DO PÂNICO ───────────────────────────────────────────────
  {
    codigo: "300.01 (F41.0)",
    cid11: "6B01",
    nome: "Transtorno do Pânico",
    area: "ansiedade",
    plano: "free",
    descricao:
      "Transtorno caracterizado por crises de pânico recorrentes e inesperadas, seguidas de pelo menos um mês de preocupação persistente com novas crises ou suas implicações, e/ou mudança comportamental maladaptativa relacionada às crises. As crises de pânico são episódios súbitos de medo ou desconforto intenso, atingindo pico em minutos, acompanhados de sintomas somáticos e cognitivos intensos.",
    criterios_dsm5: [
      {
        grupo: "Critério A — Crises de Pânico Recorrentes e Inesperadas",
        obrigatorio: true,
        descricao:
          "Crises de pânico recorrentes e inesperadas. Uma crise de pânico é um surto abrupto de medo ou desconforto intenso que alcança um pico em minutos e durante o qual ocorrem quatro (ou mais) dos seguintes sintomas:",
        itens: [
          "Palpitações, coração acelerado ou taquicardia",
          "Sudorese",
          "Tremores ou abalos",
          "Sensações de falta de ar ou sufocamento",
          "Sensações de asfixia",
          "Dor ou desconforto torácico",
          "Náusea ou desconforto abdominal",
          "Sensação de tontura, instabilidade, vertigem ou desmaio",
          "Calafrios ou ondas de calor",
          "Parestesias (anestesia ou formigamento)",
          "Desrealização (sensações de irrealidade) ou despersonalização (sentir-se separado de si mesmo)",
          "Medo de perder o controle ou de 'enlouquecer'",
          "Medo de morrer",
        ],
        minimo: 4,
      },
      {
        grupo: "Critério B",
        obrigatorio: true,
        descricao:
          "Ao menos uma das crises foi seguida de 1 mês (ou mais) de um ou ambos os seguintes:",
        itens: [
          "Preocupação persistente com novas crises de pânico ou com suas consequências (p.ex., perder o controle, ter um ataque cardíaco, 'enlouquecer')",
          "Mudança significativa e maladaptativa no comportamento relacionada às crises (p.ex., comportamentos destinados a evitar ter crises de pânico, como evitar exercícios físicos ou situações desconhecidas)",
        ],
      },
      {
        grupo: "Critério C",
        obrigatorio: true,
        descricao:
          "A perturbação não é atribuível aos efeitos fisiológicos de uma substância (p.ex., droga de abuso, medicamento) ou a outra condição médica (p.ex., hipertireoidismo, cardiopatia).",
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "A perturbação não é mais bem explicada por outro transtorno mental (p.ex., as crises de pânico não ocorrem apenas em resposta a situações sociais temidas, como no Transtorno de Ansiedade Social; em resposta a objetos ou situações fóbicas específicos, como na Fobia Específica; em resposta a obsessões, como no TOC; em resposta a rememorações de eventos traumáticos, como no TEPT; ou em resposta à separação das figuras de apego, como no Transtorno de Ansiedade de Separação).",
      },
      {
        grupo: "Especificador",
        obrigatorio: false,
        descricao:
          "Com agorafobia: medo ou ansiedade acerca de situações das quais seria difícil escapar ou onde a ajuda poderia não estar disponível caso ocorra crise de pânico (transporte público, espaços abertos, espaços fechados, filas/multidões, fora de casa sozinho). Codificação separada: 300.22 (F40.00).",
      },
    ],
    diagnostico_diferencial: [
      "Cardiopatias (arritmias, prolapso de valva mitral — solicitar ECG e Holter)",
      "Feocromocitoma e Hipertireoidismo (exames laboratoriais)",
      "Epilepsia autonômica (EEG)",
      "Fobia Específica Situacional (crise apenas em contexto fóbico específico)",
      "TAG (ansiedade contínua sem crises paroxísticas espontâneas)",
      "TEPT (crises desencadeadas por gatilhos traumáticos específicos)",
    ],
    comorbidades_frequentes: [
      "Agorafobia (em até 2/3 dos casos)",
      "TAG e Fobia Social",
      "Transtorno Depressivo Maior",
      "Transtorno por Uso de Álcool",
      "Hipocondria / Ansiedade de Doença",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "ISRS (sertralina, escitalopram, fluoxetina, paroxetina) ou IRSN (venlafaxina XR) são de primeira linha — início com doses baixas e aumento gradual para evitar piora inicial da ansiedade. Resposta esperada em 4–6 semanas. Benzodiazepínicos (alprazolam, clonazepam) para alívio agudo ou ponte para resposta do ISRS — evitar uso crônico. Imipramina é eficaz mas com pior tolerabilidade.",
      psicoterapia:
        "TCC é o tratamento de maior eficácia e com menor taxa de recaída após descontinuação. Componentes essenciais: psicoeducação sobre o pânico (ciclo medo-sintomas-medo), reestruturação cognitiva das interpretações catastróficas dos sintomas, exposição interoceptiva (induzir sintomas somáticos deliberadamente) e exposição situacional gradual.",
    },
    nota_clinica:
      "Crises de pânico com menos de 4 sintomas são denominadas crises sintomáticas limitadas (limited-symptom attacks) e também causam sofrimento clínico. Em média, pacientes com TP consultam 10 especialistas médicos antes do diagnóstico psiquiátrico correto — suspeitar em pacientes com múltiplas visitas ao pronto-socorro com queixas cardíacas ou neurológicas sem causa orgânica identificada. A combinação ISRS + TCC é superior a qualquer monoterapia.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 235–245.",
  },

  // ─── 6. TEPT ───────────────────────────────────────────────────────────────
  {
    codigo: "309.81 (F43.10)",
    cid11: "6B40",
    nome: "Transtorno de Estresse Pós-Traumático",
    sigla: "TEPT",
    area: "trauma",
    plano: "pro",
    descricao:
      "Transtorno que se desenvolve em resposta à exposição a evento(s) traumático(s) de natureza extrema, envolvendo morte real ou ameaçada, lesão grave ou violência sexual. Caracteriza-se por quatro grupos de sintomas: re-experienciamento, evitação, alterações cognitivas e do humor, e hiperexcitabilidade. Tem curso frequentemente crônico se não tratado, com grave impacto funcional.",
    criterios_dsm5: [
      {
        grupo: "Critério A — Exposição ao trauma",
        obrigatorio: true,
        descricao:
          "Exposição a morte real ou ameaçada, lesão grave ou violência sexual, de uma ou mais das seguintes maneiras:",
        itens: [
          "Experienciar diretamente o(s) evento(s) traumático(s)",
          "Testemunhar pessoalmente o(s) evento(s) traumático(s) ocorrendo com outros",
          "Saber que o(s) evento(s) traumático(s) ocorreu com familiar próximo ou amigo íntimo (em casos de morte real ou ameaçada, o evento deve ter sido violento ou acidental)",
          "Experienciar exposição repetida ou extrema a detalhes aversivos do(s) evento(s) traumático(s) (p.ex., socorristas recolhendo restos humanos; policiais repetidamente expostos a detalhes de abuso infantil)",
        ],
      },
      {
        grupo: "Critério B — Sintomas de intrusão (≥1)",
        obrigatorio: true,
        descricao:
          "Presença de um (ou mais) dos seguintes sintomas de intrusão associados ao evento traumático:",
        itens: [
          "Lembranças angustiantes, recorrentes, involuntárias e intrusivas do evento",
          "Sonhos angustiantes recorrentes relacionados ao evento",
          "Reações dissociativas (flashbacks) em que o indivíduo sente ou age como se o evento traumático estivesse ocorrendo novamente",
          "Sofrimento psicológico intenso ou prolongado à exposição a pistas internas ou externas que simbolizem ou se assemelhem ao evento",
          "Reações fisiológicas intensas a pistas internas ou externas que simbolizem ou se assemelhem ao evento",
        ],
        minimo: 1,
      },
      {
        grupo: "Critério C — Evitação (≥1)",
        obrigatorio: true,
        descricao:
          "Evitação persistente de estímulos associados ao evento traumático, a partir do evento, evidenciada por um ou ambos:",
        itens: [
          "Evitação de (ou esforços para evitar) memórias, pensamentos ou sentimentos angustiantes acerca do evento",
          "Evitação de (ou esforços para evitar) pistas externas que despertem memórias, pensamentos ou sentimentos angustiantes acerca do evento",
        ],
        minimo: 1,
      },
      {
        grupo: "Critério D — Alterações cognitivas e do humor (≥2)",
        obrigatorio: true,
        descricao:
          "Alterações negativas nas cognições e no humor associadas ao evento traumático, iniciando ou piorando após o evento, evidenciadas por dois ou mais dos seguintes:",
        itens: [
          "Incapacidade de lembrar algum aspecto importante do evento (amnésia dissociativa)",
          "Crenças ou expectativas negativas persistentes e exageradas acerca de si mesmo, de outros ou do mundo",
          "Cognições persistentes distorcidas acerca da causa ou das consequências do evento que levam o indivíduo a culpar a si mesmo ou outros",
          "Estado emocional negativo persistente (medo, horror, raiva, culpa, vergonha)",
          "Interesse ou participação em atividades significativas claramente diminuídos",
          "Sensação de distanciamento ou estranhamento em relação aos outros",
          "Incapacidade persistente de sentir emoções positivas",
        ],
        minimo: 2,
      },
      {
        grupo: "Critério E — Hiperexcitabilidade (≥2)",
        obrigatorio: true,
        descricao:
          "Alterações marcantes na excitabilidade e na reatividade associadas ao evento traumático, iniciando ou piorando após o evento, evidenciadas por dois ou mais dos seguintes:",
        itens: [
          "Comportamento irritadiço e crises de raiva (com pouca ou nenhuma provocação), tipicamente expressos como agressão verbal ou física a pessoas ou objetos",
          "Comportamento autodestrutivo ou imprudente",
          "Hipervigilância",
          "Resposta de sobressalto exagerada",
          "Dificuldades de concentração",
          "Perturbação do sono",
        ],
        minimo: 2,
      },
      {
        grupo: "Critério F — Duração",
        obrigatorio: true,
        descricao:
          "A perturbação (Critérios B, C, D e E) dura mais de 1 mês. (Se <1 mês: Transtorno de Estresse Agudo.)",
      },
      {
        grupo: "Critério G",
        obrigatorio: true,
        descricao:
          "A perturbação causa sofrimento clinicamente significativo ou prejuízo no funcionamento social, profissional ou em outras áreas importantes da vida.",
      },
      {
        grupo: "Critério H",
        obrigatorio: true,
        descricao:
          "A perturbação não é atribuível aos efeitos fisiológicos de uma substância ou a outra condição médica.",
      },
      {
        grupo: "Especificadores",
        obrigatorio: false,
        descricao: "Subtipos e modificadores.",
        itens: [
          "Com sintomas dissociativos: despersonalização ou desrealização persistentes ou recorrentes",
          "Com início retardado: critérios plenos satisfeitos ≥6 meses após o evento (embora início e sintomas parciais possam ser imediatos)",
        ],
      },
    ],
    diagnostico_diferencial: [
      "Transtorno de Estresse Agudo (duração <1 mês após o trauma)",
      "Transtorno Depressivo Maior pós-trauma (sem sintomas de intrusão e hiperexcitabilidade típicos)",
      "Transtorno de Ajustamento (estressor não necessariamente catastrófico; sintomas mais leves)",
      "TOC com conteúdo de obsessões relacionado a eventos passados",
      "Transtorno Dissociativo de Identidade (história traumática complexa, amnésia extensiva)",
      "Transtorno de Personalidade Borderline (trajetória crônica desde adolescência, sem evento único identificável)",
    ],
    comorbidades_frequentes: [
      "Transtorno Depressivo Maior (>50%)",
      "Transtorno por Uso de Álcool e outras substâncias (automedicação)",
      "Transtorno do Pânico e Agorafobia",
      "Transtorno de Personalidade Borderline (especialmente em trauma complexo e início precoce)",
      "Dor crônica e condições somáticas",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "ISRS (sertralina 50–200 mg/dia ou paroxetina 20–50 mg/dia) são os únicos aprovados pelo FDA para TEPT. Venlafaxina XR como alternativa. Prazosina (1–15 mg/dia à noite) para pesadelos e hiperexcitabilidade noturna. Evitar benzodiazepínicos — não reduzem sintomas nucleares do TEPT e aumentam risco de dependência. Segunda linha: mirtazapina, amitriptilina.",
      psicoterapia:
        "Terapias focadas no trauma são de primeira linha: Terapia de Processamento Cognitivo (TPC), Terapia de Exposição Prolongada (EP) e EMDR (Dessensibilização e Reprocessamento por Movimentos Oculares). Todas têm evidência nível A. A psicoeducação sobre o TEPT e a formulação colaborativa do caso são cruciais antes de iniciar exposição.",
    },
    nota_clinica:
      "TEPT complexo (TEPT-C) — não formalizado no DSM-5-TR mas reconhecido pelo CID-11 (6B41) — ocorre em trauma repetido, interpessoal e precoce (abuso, violência doméstica); caracterizado por desregulação emocional, alteração da identidade e relacionamentos perturbados. Triagem com PCL-5 (PTSD Checklist for DSM-5). Dissociação grave é fator de pior prognóstico e deve ser estabilizada antes da exposição ao trauma.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 301–319.",
  },

  // ─── 7. TOC ────────────────────────────────────────────────────────────────
  {
    codigo: "300.3 (F42.2)",
    cid11: "6B20",
    nome: "Transtorno Obsessivo-Compulsivo",
    sigla: "TOC",
    area: "ansiedade",
    plano: "pro",
    descricao:
      "Transtorno caracterizado pela presença de obsessões (pensamentos, impulsos ou imagens intrusivos, recorrentes e persistentes que causam ansiedade) e/ou compulsões (comportamentos ou atos mentais repetitivos realizados para neutralizar a ansiedade gerada pelas obsessões). Consome mais de 1 hora por dia ou causa prejuízo funcional significativo. Os temas obsessivos mais comuns incluem contaminação, simetria, pensamentos proibidos e dano.",
    criterios_dsm5: [
      {
        grupo: "Critério A — Obsessões e/ou Compulsões",
        obrigatorio: true,
        descricao: "Presença de obsessões, compulsões ou ambas.",
      },
      {
        grupo: "Critério A — Definição de Obsessões",
        obrigatorio: false,
        descricao:
          "Obsessões são definidas por (1) e (2):",
        itens: [
          "(1) Pensamentos, impulsos ou imagens recorrentes e persistentes que são vivenciados em algum momento durante a perturbação como intrusivos e indesejados e que na maioria das pessoas causam acentuada ansiedade ou sofrimento",
          "(2) O indivíduo tenta ignorar ou suprimir tais pensamentos, impulsos ou imagens ou neutralizá-los com algum outro pensamento ou ação (i.e., executando uma compulsão)",
        ],
      },
      {
        grupo: "Critério A — Definição de Compulsões",
        obrigatorio: false,
        descricao:
          "Compulsões são definidas por (1) e (2):",
        itens: [
          "(1) Comportamentos repetitivos (p.ex., lavar as mãos, organizar, verificar) ou atos mentais (p.ex., orar, contar, repetir palavras em silêncio) que o indivíduo se sente compelido a executar em resposta a uma obsessão ou de acordo com regras que devem ser rigidamente aplicadas",
          "(2) Os comportamentos ou atos mentais visam prevenir ou diminuir a ansiedade ou o sofrimento ou prevenir algum evento ou situação temida; entretanto, esses comportamentos ou atos mentais não têm uma conexão realista com o que visam neutralizar ou prevenir, ou são claramente excessivos",
        ],
      },
      {
        grupo: "Critério B — Tempo e Prejuízo",
        obrigatorio: true,
        descricao:
          "As obsessões ou compulsões tomam tempo (p.ex., mais de 1 hora por dia) ou causam sofrimento clinicamente significativo ou prejuízo no funcionamento social, profissional ou em outras áreas importantes da vida do indivíduo.",
      },
      {
        grupo: "Critério C",
        obrigatorio: true,
        descricao:
          "Os sintomas obsessivo-compulsivos não são atribuíveis aos efeitos fisiológicos de uma substância ou a outra condição médica.",
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "A perturbação não é mais bem explicada pelos sintomas de outro transtorno mental (p.ex., preocupações excessivas no TAG; preocupação com aparência no TDC; dificuldade de descartar em acumulação compulsiva; tricotilomania; escoriação; estereotipias no TEA; comportamento alimentar ritualístico nos transtornos alimentares; dependência de substâncias; jogo patológico; preocupações em ter uma doença grave na ansiedade de doença; impulsos ou fantasias sexuais no transtorno parafílico; impulsos no transtorno do controle dos impulsos; ruminações de culpa no TDM; inserção de pensamentos ou preocupações delirantes na esquizofrenia ou transtorno delirante).",
      },
      {
        grupo: "Especificadores de insight",
        obrigatorio: false,
        descricao: "Grau de convicção nas crenças do TOC:",
        itens: [
          "Com bom insight ou insight razoável: reconhece que as crenças do TOC definitivamente ou provavelmente não são verdadeiras",
          "Com insight pobre: acha que as crenças do TOC provavelmente são verdadeiras",
          "Com insight ausente/crenças delirantes: totalmente convicto de que as crenças do TOC são verdadeiras",
          "Com tique associado: história atual ou passada de transtorno de tique",
        ],
      },
    ],
    diagnostico_diferencial: [
      "TAG (preocupações sobre problemas da vida real; não há compulsões e os pensamentos são egossintônicos)",
      "Transtorno Dismórfico Corporal (preocupação focal com defeitos percebidos na aparência)",
      "Tricotilomania e Transtorno de Escoriação (sem obsessões antecedentes)",
      "Acumulação Compulsiva / Hoarding Disorder",
      "TOC-like em Transtorno Obsessivo-Compulsivo de Personalidade (TOCP — traço egossintônico, sem obsessões)",
      "Esquizofrenia com TOC comórbido (avaliar insight e natureza delirante)",
    ],
    comorbidades_frequentes: [
      "Transtorno de Tique / Síndrome de Tourette",
      "Transtorno Depressivo Maior (30–40%)",
      "Transtorno de Ansiedade (TAG, Pânico, Fobia Social)",
      "TDAH",
      "Transtorno de Personalidade Obsessiva-Compulsiva (TOCP)",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "ISRS em doses altas são a farmacoterapia de primeira linha: sertralina (100–200 mg/dia), fluoxetina (40–80 mg/dia), fluvoxamina (150–300 mg/dia), paroxetina (40–60 mg/dia), escitalopram (20–40 mg/dia). Clomipramina (tricíclico) é tão eficaz quanto ISRS mas com pior tolerabilidade — segunda linha ou casos resistentes. Tempo de resposta: 8–12 semanas em dose plena. Potencialização com antipsicótico (risperidona, aripiprazol, haloperidol) em casos refratários.",
      psicoterapia:
        "Exposição com Prevenção de Resposta (EPR) é o tratamento psicológico de primeira linha e gold standard — exposição gradual e hierárquica ao estímulo temido com bloqueio da compulsão. EPR intensiva (diária por 3 semanas) tem eficácia superior à semanal para casos graves. Combinação de EPR + ISRS é superior a qualquer monoterapia.",
    },
    nota_clinica:
      "Y-BOCS (Yale-Brown Obsessive Compulsive Scale) é a escala padrão para avaliar gravidade: score ≥16 indica TOC moderado, ≥24 grave. TOC com insight pobre ou ausente deve ser diferenciado de transtorno delirante — a rigidez é maior e a resposta à EPR é menor. Neurocirurgia (estimulação cerebral profunda do núcleo accumbens ou cápsula anterior) é opção para casos refratários graves.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 263–278.",
  },

  // ─── 8. TDAH TIPO COMBINADO ────────────────────────────────────────────────
  {
    codigo: "314.01 (F90.2)",
    cid11: "6A05.2",
    nome: "Transtorno do Déficit de Atenção/Hiperatividade, Apresentação Combinada",
    sigla: "TDAH",
    area: "neurodesenvolvimento",
    plano: "pro",
    descricao:
      "Transtorno do neurodesenvolvimento caracterizado por padrão persistente de desatenção e/ou hiperatividade-impulsividade que interfere no funcionamento e no desenvolvimento. A apresentação combinada requer critérios plenos tanto para desatenção quanto para hiperatividade-impulsividade. Sintomas devem estar presentes antes dos 12 anos e em dois ou mais contextos (escola/trabalho e casa).",
    criterios_dsm5: [
      {
        grupo: "Critério A1 — Desatenção (≥6 em crianças; ≥5 em ≥17 anos)",
        obrigatorio: true,
        descricao:
          "Seis (ou mais) dos seguintes sintomas de desatenção persistiram por pelo menos 6 meses, em um grau inconsistente com o nível de desenvolvimento e que impacta negativamente nas atividades sociais e acadêmicas/profissionais. Nota: Para indivíduos com 17 anos ou mais, são necessários apenas cinco sintomas.",
        itens: [
          "Frequentemente não presta atenção a detalhes ou comete erros por descuido em tarefas escolares, trabalho ou outras atividades",
          "Frequentemente tem dificuldade de manter atenção em tarefas ou atividades lúdicas",
          "Frequentemente parece não escutar quando lhe dirigem a palavra diretamente",
          "Frequentemente não segue instruções até o fim e não consegue terminar tarefas escolares ou obrigações de trabalho",
          "Frequentemente tem dificuldade de organizar tarefas e atividades",
          "Frequentemente evita, não gosta ou reluta em envolver-se em tarefas que exijam esforço mental prolongado",
          "Frequentemente perde coisas necessárias para tarefas ou atividades",
          "É facilmente distraído por estímulos externos",
          "Frequentemente é esquecido em atividades diárias",
        ],
        minimo: 6,
      },
      {
        grupo: "Critério A2 — Hiperatividade-Impulsividade (≥6 em crianças; ≥5 em ≥17 anos)",
        obrigatorio: true,
        descricao:
          "Seis (ou mais) dos seguintes sintomas de hiperatividade-impulsividade persistiram por pelo menos 6 meses, em grau inconsistente com o nível de desenvolvimento:",
        itens: [
          "Frequentemente mexe ou batuca as mãos ou os pés ou se remexe na cadeira",
          "Frequentemente levanta da cadeira em situações em que se espera que permaneça sentado",
          "Frequentemente corre ou sobe nas coisas em situações inapropriadas (em adolescentes e adultos: pode ser limitado a sensação subjetiva de inquietação)",
          "Frequentemente é incapaz de brincar ou envolver-se em atividades de lazer calmamente",
          "Frequentemente está 'a mil' ou age como se estivesse 'com o motor ligado'",
          "Frequentemente fala em excesso",
          "Frequentemente deixa escapar uma resposta antes de a pergunta ser concluída",
          "Frequentemente tem dificuldade de aguardar sua vez",
          "Frequentemente interrompe ou se intromete (p.ex., mete-se em conversas ou jogos)",
        ],
        minimo: 6,
      },
      {
        grupo: "Critério B — Início antes dos 12 anos",
        obrigatorio: true,
        descricao:
          "Vários sintomas de desatenção ou hiperatividade-impulsividade estavam presentes antes dos 12 anos de idade.",
      },
      {
        grupo: "Critério C — Dois ou mais contextos",
        obrigatorio: true,
        descricao:
          "Vários sintomas de desatenção ou hiperatividade-impulsividade estão presentes em dois ou mais contextos (p.ex., em casa, na escola ou no trabalho; com amigos ou parentes; em outras atividades).",
      },
      {
        grupo: "Critério D",
        obrigatorio: true,
        descricao:
          "Há evidências claras de que os sintomas interferem no funcionamento social, acadêmico ou profissional ou a este reduzem a qualidade.",
      },
      {
        grupo: "Critério E",
        obrigatorio: true,
        descricao:
          "Os sintomas não ocorrem exclusivamente durante o curso de Esquizofrenia ou outro Transtorno Psicótico e não são mais bem explicados por outro transtorno mental (p.ex., Transtorno do Humor, Transtorno de Ansiedade, Transtorno Dissociativo, Transtorno de Personalidade, intoxicação por substância ou abstinência).",
      },
      {
        grupo: "Especificador de apresentação",
        obrigatorio: false,
        descricao: "Tipo da apresentação atual:",
        itens: [
          "Apresentação combinada (314.01 / F90.2): critérios A1 e A2 satisfeitos nos últimos 6 meses",
          "Apresentação predominantemente desatenta (314.00 / F90.0): apenas critério A1 satisfeito",
          "Apresentação predominantemente hiperativa/impulsiva (314.01 / F90.1): apenas critério A2 satisfeito",
          "Em remissão parcial: critérios plenos anteriormente satisfeitos, mas <5 sintomas presentes nos últimos 6 meses",
          "Gravidade leve, moderada ou grave",
        ],
      },
    ],
    diagnostico_diferencial: [
      "TAG (preocupação como causa da distração; sem hiperatividade crônica pré-adolescência)",
      "Transtorno Bipolar (episodicidade vs. traço crônico; humor grandioso na mania)",
      "Transtorno Depressivo Maior (desatenção e lentidão durante o episódio; sem início na infância)",
      "Transtorno de Aprendizagem Específico (dificuldade em tarefa específica vs. global)",
      "Transtorno de Personalidade Borderline (impulsividade + instabilidade afetiva; início na adolescência)",
      "TDAH simulado em contexto de avaliação para benefícios ou estimulantes",
    ],
    comorbidades_frequentes: [
      "Transtorno de Oposição Desafiante e Transtorno de Conduta (em crianças e adolescentes)",
      "Transtorno de Ansiedade (30–50%)",
      "Transtorno Depressivo Maior (20–30%)",
      "Transtorno por Uso de Substâncias (especialmente álcool e cannabis na vida adulta)",
      "Transtorno de Aprendizagem Específico (dislexia, discalculia)",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "Estimulantes são de primeira linha: metilfenidato (0,3–1,0 mg/kg/dia, liberação imediata ou controlada) e lisdexanfetamina (30–70 mg/dia, disponível no Brasil). Não estimulantes de segunda linha: atomoxetina (1,2–1,8 mg/kg/dia) e bupropiona. Monitorar pressão arterial, frequência cardíaca e crescimento em crianças. Avaliação cardiovascular antes de iniciar estimulantes se fatores de risco.",
      psicoterapia:
        "Treinamento de pais em manejo comportamental (para crianças). TCC adaptada para TDAH em adultos: foco em organização, planejamento, regulação emocional e redução da procrastinação. Treinamento de habilidades de estudo e coaching. Psicoeducação para o paciente e família.",
    },
    nota_clinica:
      "TDAH em adultos frequentemente se apresenta com predomínio da desatenção e impulsividade (a hiperatividade motora diminui com a maturação). A escala ASRS-v1.1 é ferramenta de rastreio validada para adultos. Buscar fontes colaterais (relatório escolar, relato de familiar) para confirmar início antes dos 12 anos. Estimulantes em adultos com histórico de abuso de substâncias: preferir formulações de liberação controlada (menor potencial de abuso) ou não estimulantes.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 68–80.",
  },

  // ─── 9. TRANSTORNO DE PERSONALIDADE BORDERLINE ─────────────────────────────
  {
    codigo: "301.83 (F60.3)",
    cid11: "6D11.5",
    nome: "Transtorno de Personalidade Borderline",
    sigla: "TPB",
    area: "personalidade",
    plano: "pro",
    descricao:
      "Transtorno de personalidade caracterizado por padrão pervasivo de instabilidade nas relações interpessoais, na autoimagem e nos afetos, e por impulsividade acentuada, iniciando no início da vida adulta e presentes em vários contextos. Está associado a elevadas taxas de automutilação, tentativas de suicídio e internações, bem como intenso sofrimento subjetivo.",
    criterios_dsm5: [
      {
        grupo: "Critério único — padrão pervasivo (≥5 de 9)",
        obrigatorio: true,
        descricao:
          "Padrão pervasivo de instabilidade das relações interpessoais, da autoimagem e dos afetos e impulsividade acentuada que começa no início da vida adulta e está presente em vários contextos, indicado por cinco (ou mais) dos seguintes:",
        itens: [
          "Esforços frenéticos para evitar abandono real ou imaginado (não inclui comportamento suicida ou de automutilação do critério 5)",
          "Padrão de relacionamentos interpessoais instáveis e intensos caracterizado pela alternância entre os extremos de idealização e desvalorização (divisão/splitting)",
          "Perturbação de identidade: autoimagem ou sentido de self acentuadamente e persistentemente instável",
          "Impulsividade em pelo menos duas áreas potencialmente autodestrutivas (p.ex., gastos, sexo, abuso de substâncias, direção irresponsável, compulsão alimentar)",
          "Comportamento, gestos ou ameaças suicidas recorrentes ou comportamento automutilador",
          "Instabilidade afetiva por conta de reatividade acentuada do humor (p.ex., disforia episódica intensa, irritabilidade ou ansiedade que geralmente dura algumas horas e raramente mais do que alguns dias)",
          "Sentimentos crônicos de vazio",
          "Raiva intensa e inapropriada ou dificuldade de controlar a raiva",
          "Ideação paranoide transitória e relacionada a estresse ou sintomas dissociativos graves",
        ],
        minimo: 5,
      },
    ],
    diagnostico_diferencial: [
      "Transtorno Bipolar Tipo II (episodicidade vs. reatividade afetiva crônica; triggering interpessoal no TPB)",
      "Transtorno Depressivo Maior (episódios discretos sem instabilidade de identidade crônica)",
      "TEPT complexo (história traumática com dissociação e hiperexcitabilidade predominantes)",
      "Transtorno de Personalidade Histriônico (busca de atenção sem automutilação ou identidade instável tão marcada)",
      "Transtorno de Personalidade Narcisista (grandiosidade sem medo de abandono e automutilação)",
      "TDAH (impulsividade sem instabilidade de identidade e relações interpessoais caóticas)",
    ],
    comorbidades_frequentes: [
      "Transtorno Depressivo Maior (80%)",
      "TEPT (55–60%)",
      "Transtorno por Uso de Substâncias (35–65%)",
      "Transtornos Alimentares (especialmente bulimia nervosa)",
      "Outros Transtornos de Personalidade (Narcisista, Antissocial, Dependente)",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "Não há medicamento aprovado especificamente para TPB. Farmacoterapia é adjuvante e sintoma-direcionada: ISRS para disforia, impulsividade e automutilação; antipsicóticos em baixas doses (olanzapina, quetiapina) para instabilidade afetiva, ideação paranoide e agressividade; estabilizadores de humor (valproato, lamotrigina) para reatividade afetiva e impulsividade. Evitar benzodiazepínicos pelo risco de dependência e desinibição paradoxal.",
      psicoterapia:
        "Terapia Comportamental Dialética (DBT) é o tratamento com maior evidência para TPB — reduz automutilação, tentativas de suicídio e hospitalizações; componentes: habilidades de mindfulness, tolerância ao sofrimento, regulação emocional e efetividade interpessoal. Terapia Baseada em Mentalização (MBT) e Terapia Focada em Esquemas (TFE) também com evidência robusta.",
    },
    nota_clinica:
      "Risco de suicídio elevado ao longo da vida: 8–10% completam o suicídio; 70–75% realizam ao menos uma tentativa. A automutilação (cutting, burning) frequentemente tem função de regulação emocional — não equivale a tentativa de suicídio, mas deve ser avaliada individualmente. Contratransferência intensa é comum — supervisão clínica regular é essencial. O diagnóstico não deve ser feito antes dos 18 anos (embora o DSM permita exceções); antes, usar Transtorno de Regulação Emocional como formulação de trabalho.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 751–758.",
  },

  // ─── 10. TRANSTORNO POR USO DE ÁLCOOL, MODERADO ───────────────────────────
  {
    codigo: "303.90 (F10.20)",
    cid11: "6C40.1",
    nome: "Transtorno por Uso de Álcool, Moderado",
    sigla: "TUA",
    area: "substancias",
    plano: "pro",
    descricao:
      "Padrão problemático de uso de álcool levando a sofrimento ou prejuízo clinicamente significativo, manifestado por 4 a 5 dos 11 critérios diagnósticos nos últimos 12 meses (leve: 2–3 critérios; moderado: 4–5; grave: ≥6). Inclui elementos de tolerância, abstinência, uso compulsivo e prejuízo social e funcional. É a condição por uso de substância mais prevalente no Brasil e no mundo.",
    criterios_dsm5: [
      {
        grupo: "Critério A — Padrão problemático de uso de álcool (≥2 em 12 meses)",
        obrigatorio: true,
        descricao:
          "Padrão problemático de uso de álcool levando a sofrimento ou prejuízo clinicamente significativo, manifestado por pelo menos dois dos seguintes, ocorrendo num período de 12 meses. Moderado: 4–5 critérios; Grave: ≥6 critérios.",
        itens: [
          "O álcool é muitas vezes consumido em maiores quantidades ou por um período mais longo do que o pretendido",
          "Existe um desejo persistente ou esforços malsucedidos no sentido de reduzir ou controlar o uso de álcool",
          "Muito tempo é gasto em atividades necessárias para obter álcool, usar álcool ou recuperar-se de seus efeitos",
          "Fissura (craving): forte desejo ou necessidade urgente de usar álcool",
          "Uso recorrente de álcool resultando em fracasso em cumprir obrigações importantes no trabalho, na escola ou em casa",
          "Uso continuado de álcool apesar de problemas sociais ou interpessoais persistentes ou recorrentes causados ou exacerbados pelos efeitos do álcool",
          "Atividades sociais, profissionais ou recreativas importantes são abandonadas ou reduzidas em função do uso de álcool",
          "Uso recorrente de álcool em situações nas quais isso representa perigo físico",
          "Uso continuado de álcool apesar de saber que tem um problema físico ou psicológico persistente ou recorrente que tende a ser causado ou exacerbado pelo álcool",
          "Tolerância, definida por qualquer um dos seguintes: (a) necessidade de quantidades crescentes de álcool para atingir intoxicação ou efeito desejado; (b) efeito acentuadamente diminuído com uso continuado da mesma quantidade de álcool",
          "Abstinência, manifestada por qualquer um dos seguintes: (a) síndrome de abstinência característica do álcool; (b) álcool (ou substância estreitamente relacionada) é consumido para aliviar ou evitar sintomas de abstinência",
        ],
        minimo: 4,
      },
      {
        grupo: "Síndrome de Abstinência Alcoólica — para referência clínica",
        obrigatorio: false,
        descricao:
          "Cessação (ou redução) de uso pesado e prolongado de álcool, seguida de dois ou mais dos seguintes desenvolvendo-se em horas a alguns dias: tremores, sudorese, taquicardia, hipertensão, agitação, ansiedade, náusea/vômito, convulsões, alucinações. Síndrome grave: delirium tremens (DT) com confusão, agitação intensa, alucinações e instabilidade autonômica — risco de morte se não tratado.",
        itens: [
          "Hiperatividade autonômica (sudorese, frequência cardíaca >100 bpm)",
          "Tremores das mãos aumentados",
          "Insônia",
          "Náusea ou vômito",
          "Alucinações ou ilusões transitórias (visuais, táteis ou auditivas)",
          "Agitação psicomotora",
          "Ansiedade",
          "Crises convulsivas tônico-clônicas generalizadas",
        ],
      },
      {
        grupo: "Especificadores",
        obrigatorio: false,
        descricao: "Estado de remissão e ambiente:",
        itens: [
          "Em remissão precoce: nenhum critério satisfeito por 3–12 meses (exceto fissura)",
          "Em remissão sustentada: nenhum critério satisfeito por ≥12 meses (exceto fissura)",
          "Em ambiente protegido",
        ],
      },
    ],
    diagnostico_diferencial: [
      "Uso não problemático de álcool / uso nocivo sem síndrome de dependência",
      "Transtorno Depressivo Maior secundário ao uso de álcool vs. TDM primário com álcool como automedicação",
      "Transtorno de Ansiedade (TAG, pânico) desencadeados pela abstinência vs. transtorno primário",
      "Encefalopatia de Wernicke (deficiência de tiamina — tríade: confusão, ataxia, oftalmoplegia) — urgência neurológica",
      "Outras causas de tremores e convulsões",
      "Psicose alcoólica vs. esquizofrenia com uso comórbido",
    ],
    comorbidades_frequentes: [
      "Transtorno Depressivo Maior e Transtorno Bipolar",
      "Transtorno de Ansiedade (TAG, pânico, fobia social)",
      "TEPT",
      "Transtornos de Personalidade (antissocial, borderline)",
      "Hepatopatia alcoólica, polineuropatia, cardiomiopatia",
    ],
    tratamento_primeira_linha: {
      farmacologico:
        "Abstinência aguda/grave: benzodiazepínicos (diazepam 10–20 mg a cada 4–6h, titular pelo CIWA-Ar) + tiamina 100–300 mg IV/IM antes da glicose para prevenção da Encefalopatia de Wernicke. Manutenção da abstinência: naltrexona (50 mg/dia VO ou 380 mg/mês IM) — bloqueia euforia e reduz craving; acamprosato (666 mg 3x/dia) — reduz desconforto da abstinência prolongada; dissulfiram (250 mg/dia) — dissuasão por reação adversa ao álcool. Nalmefene para redução do consumo sem abstinência total.",
      psicoterapia:
        "Entrevista Motivacional (EM) para aumentar motivação para mudança — eficaz em qualquer estágio. TCC para prevenção de recaídas (identificação de gatilhos e estratégias de enfrentamento). Grupos de autoajuda (AA — Alcoólicos Anônimos) como adjuvante com evidência de eficácia. Terapia de Reforço Comunitário (CRA) para casos graves.",
    },
    nota_clinica:
      "CAGE (Cut, Annoyed, Guilty, Eye-opener) e AUDIT são ferramentas de rastreio validadas. CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol) quantifica a gravidade da abstinência e guia o manejo farmacológico. NUNCA dar glicose antes da tiamina em alcoolistas — precipita encefalopatia de Wernicke. Síndrome de Wernicke-Korsakoff: encefalopatia de Wernicke não tratada evolui para Psicose de Korsakoff (amnésia anterógrada irreversível com confabulação). Convulsões da abstinência geralmente ocorrem entre 6–48h após a última dose; DT entre 48–96h — período de maior risco.",
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 567–580.",
  },
];
