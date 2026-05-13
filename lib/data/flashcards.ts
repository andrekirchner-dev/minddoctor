export interface Flashcard {
  id: string;
  frente: string;
  verso: string;
  dica?: string;
  tags: string[];
  dificuldade: "basico" | "intermediario" | "avancado";
}

export interface Deck {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  cor: string;
  gradient: string;
  plano: "free" | "pro";
  cards: Flashcard[];
}

// ─── Deck 1: TEP — Prova de Título ────────────────────────────────────────────
const deckTep: Deck = {
  id: "tep",
  titulo: "TEP — Prova de Título",
  descricao: "Questões essenciais para a prova de título em Psiquiatria (ABP)",
  area: "Concurso",
  cor: "text-violet-600",
  gradient: "from-violet-500 to-purple-600",
  plano: "free",
  cards: [
    {
      id: "tep-01",
      frente: "Qual é o mecanismo de ação do lítio?",
      verso: "Inibe a inositol monofosfatase (depleção do inositol) e a GSK-3β, modulando vias de sinalização neuronal. Também inibe o NAD-dependente isocitrato desidrogenase. Efeito estabilizador de membrana e neuroprotetor.",
      dica: "Pense em IP3 → inositol",
      tags: ["farma", "lítio", "bipolar"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-02",
      frente: "Quais são os critérios de síndrome serotoninérgica de Hunter (mnemônico)?",
      verso: "HUNTER: Agente serotoninérgico + qualquer um de: (1) clonus espontâneo, (2) clonus induzível + agitação ou diaforese, (3) clonus ocular + agitação ou diaforese, (4) tremor + hiperreflexia, (5) hipertonia + temperatura >38 °C + clonus ocular ou induzível.",
      dica: "Critérios de Hunter — mais sensíveis que Sternbach",
      tags: ["emergência", "serotonina", "toxicidade"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-03",
      frente: "Qual antidepressivo é contraindicado no IAM recente e por quê?",
      verso: "Antidepressivos tricíclicos (ADTs) — cardiotoxicidade por bloqueio dos canais de sódio cardíacos (efeito quinidina-like), prolongamento do intervalo QT e PR, risco de arritmias. ISRSs são seguros no pós-IAM; sertralina tem maior evidência.",
      dica: "ADTs prolongam QT",
      tags: ["farma", "cardiovascular", "antidepressivo"],
      dificuldade: "basico",
    },
    {
      id: "tep-04",
      frente: "Qual é a diferença entre inimputabilidade e semi-imputabilidade no CP brasileiro?",
      verso: "Inimputável (art. 26 caput): doença mental ou desenvolvimento incompleto/retardado → isento de pena → medida de segurança. Semi-imputável (art. 26 parágrafo único): perturbação da saúde mental → pena reduzida 1/3 a 2/3 ou medida de segurança substitutiva.",
      dica: "Art. 26 CP — caput vs parágrafo único",
      tags: ["forense", "imputabilidade", "CP"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-05",
      frente: "Qual é o critério temporal para distinguir episódio depressivo maior de luto normal (DSM-5-TR)?",
      verso: "O DSM-5-TR removeu a exclusão de luto dos critérios de TDM. Luto pode coexistir com TDM. Diagnóstico baseia-se na intensidade dos sintomas, presença de ideação suicida, comprometimento funcional grave, sintomas psicóticos e duração ≥2 semanas — não há mais prazo de exclusão por luto.",
      dica: "DSM-5-TR removeu a 'bereavement exclusion'",
      tags: ["diagnóstico", "depressão", "DSM-5-TR"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-06",
      frente: "Qual é o mecanismo de ação da clozapina que explica sua eficácia na esquizofrenia resistente?",
      verso: "Antagonismo D4 > D2, com alta afinidade por receptores 5-HT2A, M1, H1, α1 e α2. O baixo bloqueio D2 estriatal explica a ausência de sintomas extrapiramidais. Mecanismo exato da eficácia na resistência não totalmente elucidado — possivelmente glutamato/NMDA e efeito em múltiplas vias.",
      dica: "Baixo D2, alto 5-HT2A, alto D4",
      tags: ["farma", "clozapina", "antipsicótico"],
      dificuldade: "avancado",
    },
    {
      id: "tep-07",
      frente: "Quais são os 4 domínios do PANSS?",
      verso: "1. Escala Positiva (7 itens): delírios, desorganização, alucinações, excitação, grandiosidade, suspeita, hostilidade. 2. Escala Negativa (7 itens): embotamento afetivo, retraimento emocional, contato pobre, retraimento social, pensamento abstrato, ausência de espontaneidade, pensamento estereotipado. 3. Psicopatologia Geral (16 itens). Score total: 30–210.",
      dica: "P(7) + N(7) + G(16) = 30 itens",
      tags: ["escalas", "psicose", "PANSS"],
      dificuldade: "basico",
    },
    {
      id: "tep-08",
      frente: "O que é tardive dyskinesia e qual antipsicótico tem menor risco?",
      verso: "Discinesia tardia: movimentos involuntários coreoatetoides — lábios, língua, face, membros — após uso prolongado de antipsicóticos. Mecanismo: hipersensibilidade de receptores D2. Menor risco: clozapina (quasi-zero) e quetiapina. Tratamento: valbenazina ou deutetrabenazina (inibidores VMAT2). Switching para clozapina.",
      dica: "VMAT2 inibidores são o tratamento",
      tags: ["farma", "efeitos adversos", "antipsicótico"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-09",
      frente: "Quais são os critérios diagnósticos de TEPT (DSM-5-TR)? Mnemônico TEARS",
      verso: "T — Trauma (exposição a evento traumático). E — Evitação (de estímulos associados). A — Alterações cognitivas/humor negativo. R — Reexperienciação (flashbacks, pesadelos, sofrimento psicológico). S — Sintomas de excitabilidade aumentada (hipervigilância, sobressalto). Duração >1 mês, prejuízo funcional.",
      dica: "TEARS: Trauma, Evitação, Alterações, Reexperienciação, Sobressalto",
      tags: ["diagnóstico", "TEPT", "trauma"],
      dificuldade: "basico",
    },
    {
      id: "tep-10",
      frente: "Qual é o tratamento de 1ª linha para TOC segundo CANMAT/WFSBP?",
      verso: "1ª linha: ISRSs em dose alta (sertralina 200 mg, fluoxetina 60–80 mg, fluvoxamina 300 mg, paroxetina 60 mg, escitalopram 40 mg) + TCC com Exposição e Prevenção de Resposta (EPR). Clomipramina é igualmente eficaz mas pior tolerabilidade. Augmentação: antipsicótico atípico (risperidona, aripiprazol). Refratário: estimulação cerebral profunda.",
      dica: "ISRS em dose alta + EPR é padrão ouro",
      tags: ["tratamento", "TOC", "TCC"],
      dificuldade: "basico",
    },
    {
      id: "tep-11",
      frente: "Qual é a diferença entre alucinação, ilusão e pseudoalucinação?",
      verso: "Alucinação: percepção sem objeto real — com crítica de realidade ausente, sentida como externa. Ilusão: percepção distorcida de um objeto real existente. Pseudoalucinação: percepção sem objeto externo, mas reconhecida como gerada internamente (insight preservado) — ex: 'voz dentro da cabeça'. Importante no diagnóstico diferencial de psicose vs dissociação.",
      dica: "Pseudo = crítica de realidade preservada",
      tags: ["psicopatologia", "percepção", "semiologia"],
      dificuldade: "basico",
    },
    {
      id: "tep-12",
      frente: "Quais são os critérios de hospitalização involuntária pela Lei 10.216?",
      verso: "Art. 6º, parágrafo único: internação involuntária quando o paciente não tem condição de expressar consentimento, a pedido de terceiro (familiar ou responsável), fundamentada por laudo médico. Deve ser comunicada ao Ministério Público em 72h. Diferente da internação compulsória (ordem judicial, art. 9º).",
      dica: "Lei 10.216 — comunicar MP em 72h",
      tags: ["forense", "Lei 10.216", "internação"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-13",
      frente: "Qual é o mecanismo de ação e uso clínico da naltrexona?",
      verso: "Antagonista opioide — bloqueia receptores μ, κ e δ. Indicações: (1) Dependência de álcool: reduz craving e prazer pelo álcool (COMBINE trial — NNT ~8); (2) Dependência de opioides: previne recaída após desintoxicação. Dose: 50 mg/dia VO ou 380 mg/mês IM (Vivitrol). Contraindicado em uso atual de opioides (risco de abstinência precipitada).",
      dica: "COMBINE trial — álcool; desintoxicação antes de iniciar",
      tags: ["farma", "álcool", "dependência"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-14",
      frente: "O que é a síndrome neuroléptica maligna (SNM) e qual é o tratamento?",
      verso: "SNM: reação idiossincrática a antipsicóticos — tétrade: (1) hipertermia >38°C, (2) rigidez muscular grave ('lead-pipe'), (3) instabilidade autonômica, (4) alteração do nível de consciência. CPK muito elevada. Tratamento: (1) suspender antipsicótico, (2) resfriamento, hidratação, (3) bromocriptina 2,5–10 mg 8/8h (agonista D2), (4) dantrolene 1–3 mg/kg IV (relaxante muscular), (5) ECT se refratário.",
      dica: "Hipertermia + rigidez + CPK + instabilidade autonômica",
      tags: ["emergência", "SNM", "antipsicótico"],
      dificuldade: "avancado",
    },
    {
      id: "tep-15",
      frente: "Quais são as diferenças entre depressão bipolar e depressão unipolar para fins terapêuticos?",
      verso: "Bipolar: evitar antidepressivo em monoterapia (risco de virada maníaca, ciclagem rápida). 1ª linha: quetiapina, lurasidona, lamotrigina (manutenção). Unipolar: ISRSs, SNRIs, bupropiona são 1ª linha. Pistas para bipolar: início precoce, história familiar, episódios breves, hipersônia e hiperfagia no episódio, irritabilidade proeminente, antecedente de episódio misto/hipomânico.",
      dica: "Antidepressivo sozinho = risco de virada em bipolar",
      tags: ["tratamento", "bipolar", "depressão"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-16",
      frente: "O que é dissociação? Quais são os dois mecanismos principais?",
      verso: "Dissociação: interrupção nas funções normalmente integradas de consciência, memória, identidade, emoção e comportamento. Dois mecanismos: (1) Despersonalização — sensação de desapego do próprio corpo/mente ('robô', 'fora do corpo'); (2) Desrealização — ambiente parece irreal, distante, em névoa. Comum em TEPT, transtorno dissociativo de identidade, borderline.",
      dica: "Despersonalização = eu / Desrealização = mundo",
      tags: ["psicopatologia", "dissociação", "semiologia"],
      dificuldade: "basico",
    },
    {
      id: "tep-17",
      frente: "Qual é a eficácia comparativa das psicoterapias para depressão unipolar?",
      verso: "Metanálise Cuijpers 2019: TCC, Terapia Interpessoal (TIP), Ativação Comportamental e Psicoterapia de Solução de Problemas são igualmente eficazes para TDM moderado. TCC + antidepressivo superior à farmacoterapia isolada para TDM grave. Para depressão crônica (>2 anos): CBASP (Cognitive Behavioral Analysis System of Psychotherapy) tem melhor evidência. Terapia Analítica Funcional para TDM com componente interpessoal.",
      dica: "CBASP para depressão crônica",
      tags: ["psicoterapia", "depressão", "evidência"],
      dificuldade: "avancado",
    },
    {
      id: "tep-18",
      frente: "Quais são os critérios diagnósticos de Borderline (TPB) no DSM-5-TR? Mnemônico PRAISE",
      verso: "P — Paranoia (transitória) / Pensamentos dissociativos. R — Raiva intensa e inapropriada. A — Abandono (esforços para evitar). I — Impulsividade (≥2 áreas). S — Suicidabilidade (ameaças/comportamentos) / Automutilação. E — Esvaziamento (sentimentos crônicos de vazio). + Instabilidade emocional + Relacionamentos instáveis + Identidade instável. 5/9 critérios.",
      dica: "PRAISE + 5/9",
      tags: ["diagnóstico", "borderline", "personalidade"],
      dificuldade: "intermediario",
    },
    {
      id: "tep-19",
      frente: "Qual é o nível sérico terapêutico e tóxico do lítio?",
      verso: "Terapêutico: 0,6–1,2 mEq/L (manutenção); 0,8–1,2 mEq/L (fase aguda maníaca). Idosos: 0,4–0,8 mEq/L. Toxicidade: >1,5 mEq/L (sintomas leves-moderados: tremor grosseiro, ataxia, confusão); >2,0 mEq/L (grave: convulsões, coma, arritmia). Coletar 12h após última dose. Monitorar creatinina, TSH e ECG regularmente.",
      dica: "0,6–1,2 mEq/L; tóxico >1,5",
      tags: ["farma", "lítio", "monitoramento"],
      dificuldade: "basico",
    },
    {
      id: "tep-20",
      frente: "O que é akathisia e como diferenciar de agitação psicótica?",
      verso: "Akathisia: inquietação motora subjetiva e objetiva por antipsicóticos — sensação insuportável de necessidade de mover-se, piora em repouso, melhora ao caminhar. Barnes Akathisia Rating Scale (BARS). Diferencial de agitação psicótica: akathisia não acompanha pensamento desorganizado ou piora de psicose. Tratamento: reduzir dose, propranolol 20–40 mg/dia, benzodiazepínico, clonidina.",
      dica: "BARS scale; propranolol 1ª linha",
      tags: ["efeitos adversos", "akathisia", "antipsicótico"],
      dificuldade: "intermediario",
    },
  ],
};

// ─── Deck 2: Psicofarmacologia ─────────────────────────────────────────────────
const deckFarma: Deck = {
  id: "psicofarmacologia",
  titulo: "Psicofarmacologia",
  descricao: "Mecanismos de ação, doses, interações e efeitos adversos dos principais psicofármacos",
  area: "Farmacologia",
  cor: "text-blue-600",
  gradient: "from-blue-500 to-indigo-600",
  plano: "free",
  cards: [
    {
      id: "farma-01",
      frente: "Qual é a diferença entre ISRS, IRSN e ADT em termos de mecanismo?",
      verso: "ISRS: inibe apenas o transportador de serotonina (SERT). IRSN: inibe SERT + NET (norepinefrina). ADT: inibe SERT + NET + bloqueia H1, M1, α1 (efeitos colaterais cardíacos, anticolinérgicos, sedação). ISRSs têm melhor perfil de tolerabilidade; IRSNs têm vantagem em dor neuropática e fadiga; ADTs têm mais overdose letal.",
      tags: ["ISRS", "IRSN", "ADT", "mecanismo"],
      dificuldade: "basico",
    },
    {
      id: "farma-02",
      frente: "Quais ISRSs têm maior e menor potencial de interação por inibição de CYP450?",
      verso: "Maior potencial de inibição: Fluoxetina (CYP2D6, CYP3A4 — inibidor potente), Fluvoxamina (CYP1A2, CYP2C19 — inibidor mais potente da classe), Paroxetina (CYP2D6 potente). Menor potencial: Escitalopram e Citalopram (mínima inibição de CYP). Sertralina é intermediária (CYP2D6 fraco). Para pacientes polifarmácia: preferir escitalopram ou sertralina.",
      tags: ["ISRS", "CYP450", "interações"],
      dificuldade: "avancado",
    },
    {
      id: "farma-03",
      frente: "Quais são as contraindicações absolutas do lítio?",
      verso: "Contraindicações: (1) Insuficiência renal grave (TFG <30) — excreção renal exclusiva; (2) Gravidez 1º trimestre (anomalia de Ebstein — relativo); (3) Síndrome do nó sinusal, bloqueio AV grave; (4) Dieta hipossódica severa (aumenta reabsorção renal de Li); (5) Desidratação. AINEs, diuréticos tiazídicos e IECA aumentam litemia — monitorar.",
      tags: ["lítio", "contraindicações", "renal"],
      dificuldade: "intermediario",
    },
    {
      id: "farma-04",
      frente: "Como calcular a dose equivalente de antipsicóticos em clorpromazina (CPZ)?",
      verso: "Dose CPZ (mg) = Dose do fármaco (mg) ÷ Equivalente CPZ do fármaco (mg por 100 mg CPZ). Exemplos: Haloperidol 2 mg = 100 mg CPZ (eq. 2 mg). Risperidona 1 mg = 75 mg CPZ (eq. 1,33 mg). Olanzapina 2,5 mg = 100 mg CPZ (eq. 2,5 mg). Quetiapina 75 mg = 100 mg CPZ (eq. 75 mg). Clozapina 50 mg = 100 mg CPZ (eq. 50 mg). Fonte: Leucht et al. 2016.",
      dica: "Leucht 2016 é a referência padrão",
      tags: ["antipsicótico", "equivalência", "CPZ"],
      dificuldade: "intermediario",
    },
    {
      id: "farma-05",
      frente: "Qual é o mecanismo de ação do valproato no transtorno bipolar?",
      verso: "Múltiplos mecanismos: (1) Inibe canais de sódio voltagem-dependentes (estabiliza membrana); (2) Aumenta GABA (inibe GABA transaminase + estimula síntese); (3) Inibe canais de cálcio tipo-T; (4) Inibe GSK-3β (neuroproteção). Monitorar: amônia (encefalopatia), VPA sérico (50–125 mcg/mL), hemograma, TGO/TGP. Teratogênico — evitar em mulheres em idade fértil.",
      tags: ["valproato", "bipolar", "mecanismo"],
      dificuldade: "intermediario",
    },
    {
      id: "farma-06",
      frente: "Quais são as vantagens da lamotrigina no bipolar e como titulá-la?",
      verso: "Vantagens: melhor para fase depressiva do bipolar (não tem eficácia em mania aguda); sem ganho de peso; sem efeitos cognitivos. Risco principal: Síndrome de Stevens-Johnson (1 em 1000) — por titulação rápida. Titulação sem valproato: 25 mg/2 semanas → 50 mg/2 semanas → 100 mg/1 semana → alvo 200 mg/dia. Com valproato (inibe metabolismo): metade da dose. Sem lamotrigina em gravidez (relativo — fenda palatina).",
      dica: "Stevens-Johnson por titulação rápida",
      tags: ["lamotrigina", "bipolar", "titulação"],
      dificuldade: "avancado",
    },
    {
      id: "farma-07",
      frente: "Quais benzodiazepínicos são preferíveis em pacientes com doença hepática e por quê?",
      verso: "Preferir: Lorazepam, Oxazepam, Temazepam (mnemônico LOT) — metabolizados por glucuronidação direta, sem metabólitos ativos. Evitar: Diazepam, Clonazepam, Alprazolam — oxidação hepática (CYP) com metabólitos ativos que acumulam na insuficiência hepática. Na cirrose grave: até LOT tem meia-vida prolongada — usar com cautela.",
      dica: "LOT = sem acúmulo hepático",
      tags: ["benzodiazepínico", "hepático", "metabolismo"],
      dificuldade: "intermediario",
    },
    {
      id: "farma-08",
      frente: "O que é síndrome de descontinuação de ISRS e quais medicamentos têm maior risco?",
      verso: "Síndrome de descontinuação (FINISH): Flu-like symptoms, Insônia, Náusea, Instabilidade/tontura, Sensações elétricas (brain zaps), Hiperatividade/ansiedade. Maior risco: Paroxetina (meia-vida mais curta, mais colinérgica), Venlafaxina. Menor risco: Fluoxetina (meia-vida 4–6 dias + metabólito ativo norfluoxetina 4–16 dias — auto-tapering). Tratamento: reinstituir e desmame gradual.",
      dica: "FINISH mnemônico; fluoxetina tem menor risco",
      tags: ["ISRS", "descontinuação", "retirada"],
      dificuldade: "basico",
    },
    {
      id: "farma-09",
      frente: "Quais antipsicóticos prolongam mais o QTc e qual é o limiar de risco?",
      verso: "Maior risco: Tioridazina (retirada do mercado), Ziprasidona (+20ms), Haloperidol IV (+15ms), Quetiapina. Risco moderado: Olanzapina, Risperidona. Menor risco: Aripiprazol, Lurasidona. Limiar de risco: QTc >500 ms ou prolongamento >60 ms da basal → suspender/trocar. Fatores de risco para TdP: hipocalemia, hipomagnesemia, QTc basal prolongado, sexo feminino.",
      dica: "QTc >500 ms = suspender",
      tags: ["QTc", "arritmia", "antipsicótico"],
      dificuldade: "avancado",
    },
    {
      id: "farma-10",
      frente: "Quais são as classes farmacológicas aprovadas para dependência de opioides?",
      verso: "3 classes: (1) Metadona — agonista pleno μ, IMAT e antagonista NMDA; manutenção em centros especializados; meia-vida longa (24–36h). (2) Buprenorfina — agonista parcial μ + antagonista κ; teto de depressão respiratória; combinada com naloxona (Suboxone) para reduzir desvio. (3) Naltrexona — antagonista μ (após desintoxicação); IM mensal (Vivitrol) melhora adesão.",
      tags: ["opioides", "dependência", "MAT"],
      dificuldade: "intermediario",
    },
    {
      id: "farma-11",
      frente: "Qual é o mecanismo de ação e uso clínico da bupropiona?",
      verso: "Mecanismo: inibidor fraco da recaptação de norepinefrina e dopamina (NDRI); sem ação serotoninérgica. Não causa disfunção sexual nem ganho de peso — diferencial dos ISRSs. Indicações: TDM, cessação do tabagismo (reduz craving dopaminérgico), TDAH adulto (off-label). Cuidado: reduz limiar convulsivo (contraindicado em bulimia, epilepsia, abstinência de álcool/BZD). Dose: 150–450 mg/dia.",
      dica: "NDRI; não causa disfunção sexual",
      tags: ["bupropiona", "NDRI", "antidepressivo"],
      dificuldade: "basico",
    },
    {
      id: "farma-12",
      frente: "Quais são as indicações de clozapina além da esquizofrenia resistente?",
      verso: "Indicações reconhecidas: (1) Esquizofrenia resistente (falha ≥2 antipsicóticos adequados); (2) Risco suicida persistente na esquizofrenia/TAE; (3) Discinesia tardia grave refratária; (4) Psicose na doença de Parkinson (pequenas doses). Monitoramento obrigatório: contagem absoluta de neutrófilos (CAN) — agranulocitose em 1–2%. Programa REMS: semanal (6 meses), quinzenal (6 meses), mensal após.",
      dica: "CAN semanal por 6 meses — agranulocitose",
      tags: ["clozapina", "resistência", "indicações"],
      dificuldade: "avancado",
    },
  ],
};

// ─── Deck 3: DSM-5-TR — Critérios ─────────────────────────────────────────────
const deckDsm: Deck = {
  id: "dsm5tr",
  titulo: "DSM-5-TR — Critérios",
  descricao: "Critérios diagnósticos dos principais transtornos psiquiátricos segundo o DSM-5-TR",
  area: "Diagnóstico",
  cor: "text-emerald-600",
  gradient: "from-emerald-500 to-teal-600",
  plano: "free",
  cards: [
    {
      id: "dsm-01",
      frente: "Quais são os critérios A de Episódio Depressivo Maior (TDM)?",
      verso: "5 ou mais dos 9 sintomas por ≥2 semanas, com pelo menos (1) humor deprimido OU (2) anedonia: (1) Humor deprimido, (2) Anedonia, (3) Alteração de peso/apetite (±5%/mês), (4) Insônia ou hipersonia, (5) Agitação ou retardo psicomotor (observável), (6) Fadiga ou perda de energia, (7) Sentimentos de inutilidade ou culpa excessiva, (8) Dificuldade de concentração, (9) Pensamentos de morte/ideação suicida.",
      dica: "SIG E CAPS — mnemônico dos 9 sintomas",
      tags: ["depressão", "DSM-5-TR", "critérios"],
      dificuldade: "basico",
    },
    {
      id: "dsm-02",
      frente: "Quais são os critérios de Episódio Maníaco (DSM-5-TR)?",
      verso: "A: Humor elevado, expansivo ou irritável + aumento de atividade/energia orientada a objetivos por ≥1 semana (hospitalizável). B: 3 dos 7 (4 se irritável): DIGFAST — Distractibilidade, Impulsividade (atividade prazerosa de risco), Grandiosidade, Fuga de ideias, Agitação/atividade aumentada, Sono reduzido (<3h sem cansaço), Tagarelice (pressão do discurso). C: Prejuízo funcional grave ou hospitalização.",
      dica: "DIGFAST — 7 sintomas B",
      tags: ["mania", "bipolar", "DSM-5-TR"],
      dificuldade: "basico",
    },
    {
      id: "dsm-03",
      frente: "Qual é a diferença entre TAG e Transtorno de Pânico nos critérios DSM-5-TR?",
      verso: "TAG: preocupação excessiva, difícil de controlar, sobre múltiplos temas por ≥6 meses + 3/6 sintomas (tensão muscular, fadiga, concentração, irritabilidade, insônia, inquietação). Pânico: ataques recorrentes (pico em minutos, 4/13 sintomas somáticos/cognitivos) + 1 mês de preocupação com novos ataques OU mudança comportamental significativa. TAG é crônico e generalizado; pânico é episódico e focal.",
      dica: "TAG ≥6 meses + 3/6 sintomas; pânico = episódico",
      tags: ["ansiedade", "TAG", "pânico"],
      dificuldade: "intermediario",
    },
    {
      id: "dsm-04",
      frente: "Quais são os critérios de TDAH para adultos no DSM-5-TR?",
      verso: "≥5 sintomas (não 6) de desatenção e/ou hiperatividade-impulsividade (reduzido para adultos). Início: vários sintomas antes dos 12 anos. Presente em ≥2 contextos. Prejuízo funcional. 3 apresentações: predominantemente desatenta, predominantemente hiperative-impulsiva, combinada. Especificadores: remissão parcial; leve/moderado/grave.",
      dica: "≥5 sintomas em adultos (vs ≥6 em crianças)",
      tags: ["TDAH", "adulto", "DSM-5-TR"],
      dificuldade: "intermediario",
    },
    {
      id: "dsm-05",
      frente: "Quais são os critérios de Transtorno de Uso de Substâncias (DSM-5-TR)?",
      verso: "≥2 de 11 critérios em 12 meses: (1) Uso em quantidades maiores/período maior que pretendido, (2) Desejo persistente de reduzir, (3) Muito tempo gasto, (4) Fissura, (5) Falha em papel social/profissional, (6) Uso apesar de problemas interpessoais, (7) Abandono de atividades importantes, (8) Uso em situações de risco, (9) Uso apesar de dano físico/psicológico, (10) Tolerância, (11) Abstinência. Leve: 2-3; moderado: 4-5; grave: ≥6.",
      dica: "11 critérios — leve 2-3, moderado 4-5, grave ≥6",
      tags: ["dependência", "substâncias", "DSM-5-TR"],
      dificuldade: "basico",
    },
    {
      id: "dsm-06",
      frente: "O que distingue Esquizofrenia de Transtorno Esquizoafetivo no DSM-5-TR?",
      verso: "Esquizofrenia: episódios de humor ocorrem por fração menor do total da doença. Esquizoafetivo: episódio de humor maior (maníaco ou depressivo) coexiste com critério A da esquizofrenia por maior parte do total da doença; alucinações/delírios por ≥2 semanas na ausência de episódio de humor. Chave: duração relativa do episódio de humor — predominante (esquizoafetivo) vs minoritária (esquizofrenia).",
      dica: "Predominância do humor = esquizoafetivo",
      tags: ["esquizofrenia", "esquizoafetivo", "diagnóstico diferencial"],
      dificuldade: "avancado",
    },
    {
      id: "dsm-07",
      frente: "Quais são os critérios de Transtorno de Personalidade Borderline (TPB)?",
      verso: "Padrão difuso de instabilidade: (1) Esforços para evitar abandono, (2) Relacionamentos intensos e instáveis, (3) Perturbação de identidade, (4) Impulsividade em ≥2 áreas, (5) Comportamento suicida/automutilação, (6) Instabilidade afetiva, (7) Vazio crônico, (8) Raiva intensa inapropriada, (9) Ideação paranoide transitória/dissociação. 5/9 critérios. Início na adolescência/início da vida adulta.",
      dica: "5/9 critérios — PRAISE + 3 mais",
      tags: ["borderline", "personalidade", "DSM-5-TR"],
      dificuldade: "intermediario",
    },
    {
      id: "dsm-08",
      frente: "Como o DSM-5-TR distingue Luto de Transtorno de Luto Prolongado?",
      verso: "Transtorno de Luto Prolongado (TLP — novo no DSM-5-TR): ≥12 meses (adultos) / ≥6 meses (crianças) de saudade ou preocupação com o falecido + ≥3 de 8 sintomas (dificuldade de aceitar a morte, anestesia emocional, amargura, identidade perturbada, evitar lembretes, sentir parte de si foi morta, dificuldade de se envolver com outros, sensação de que a vida não tem sentido). Luto normal: não atinge esses critérios — não patologizar luto típico.",
      dica: "≥12 meses + 3/8 sintomas específicos",
      tags: ["luto", "TLP", "DSM-5-TR"],
      dificuldade: "avancado",
    },
    {
      id: "dsm-09",
      frente: "Quais são os specifiers de gravidade do Transtorno Bipolar Tipo I em episódio maníaco?",
      verso: "Leve: poucos sintomas acima do mínimo, disfunção menor. Moderado: aumento de atividade ou julgamento prejudicado. Grave sem características psicóticas: supervisão quase constante necessária. Grave com características psicóticas: delírios e alucinações. Remissão parcial: sintomas presentes mas critérios completos não atingidos. Remissão total: nenhum sintoma por ≥2 meses.",
      dica: "Psicótico = grave com características psicóticas",
      tags: ["bipolar", "especificadores", "gravidade"],
      dificuldade: "basico",
    },
    {
      id: "dsm-10",
      frente: "O que são sintomas de Primeira Ordem de Schneider na esquizofrenia?",
      verso: "Kurt Schneider (1959) — sintomas de alta especificidade (embora não patognomônicos): (1) Vozes que comentam os atos, (2) Vozes que debatem entre si, (3) Eco do pensamento (sonorização), (4) Roubo do pensamento, (5) Inserção do pensamento, (6) Difusão/transmissão do pensamento, (7) Percepção delirante, (8) Influência externa sobre sentimentos/vontades/impulsos. Relevantes no diagnóstico de esquizofrenia, mas não são critério DSM-5-TR.",
      dica: "Schneider: 8 sintomas de 1ª ordem",
      tags: ["esquizofrenia", "Schneider", "psicose"],
      dificuldade: "intermediario",
    },
    {
      id: "dsm-11",
      frente: "Quais são os critérios diagnósticos de TOC (DSM-5-TR)?",
      verso: "A: Presença de obsessões, compulsões ou ambas. Obsessão: pensamentos/imagens/impulsos recorrentes e persistentes, intrusivos, que causam ansiedade — pessoa tenta ignorar ou neutralizar. Compulsão: comportamentos ou atos mentais repetitivos em resposta à obsessão ou regras rígidas — visam prevenir angústia ou evento temido (não realistas). B: Consomem >1h/dia ou causam sofrimento/prejuízo. Especificador: bom/médio/mau insight.",
      dica: ">1h/dia ou prejuízo; especificar insight",
      tags: ["TOC", "obsessão", "compulsão"],
      dificuldade: "basico",
    },
    {
      id: "dsm-12",
      frente: "Qual é a diferença entre Anorexia Nervosa Restritiva e Purgativa no DSM-5-TR?",
      verso: "Tipo Restritivo: emagrecimento por dieta/restrição/exercício — sem episódios de binge/purga nos últimos 3 meses. Tipo Purgativo/Binge: episódios recorrentes de compulsão alimentar e/ou purgação (vômito, laxante, diurético, enema) nos últimos 3 meses. Critério de peso: IMC <18,5 (leve ≥17; moderada 16–17; grave 15–16; extrema <15). Distorção da imagem corporal e medo intenso de ganhar peso são obrigatórios.",
      dica: "Restritiva vs purgativa pelos últimos 3 meses",
      tags: ["anorexia", "transtorno alimentar", "DSM-5-TR"],
      dificuldade: "intermediario",
    },
  ],
};

export const decks: Deck[] = [deckTep, deckFarma, deckDsm];

export function getDeck(id: string): Deck | undefined {
  return decks.find((d) => d.id === id);
}
