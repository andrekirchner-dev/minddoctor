// ─────────────────────────────────────────────────────────────────────────────
// FARMACOGENÉTICA — Dados clínicos
// ─────────────────────────────────────────────────────────────────────────────

export interface VarianteGenetica {
  gene: string;
  variante: string;
  fenotipo: string;
  frequencia: string;
  descricao: string;
  impacto_clinico: string;
}

export interface FarmacoFarmacogenetica {
  id: string;
  nome: string;
  gene_principal: string;
  genes_secundarios: string[];
  metabolismo: string;
  recomendacao_pm: string;   // Poor Metabolizer
  recomendacao_im: string;   // Intermediate Metabolizer
  recomendacao_em: string;   // Extensive Metabolizer (normal)
  recomendacao_um: string;   // Ultra-rapid Metabolizer
  nivel_evidencia: "A" | "B" | "C";
  fonte: string;
}

export interface SistemaGenetico {
  id: string;
  gene: string;
  nome_completo: string;
  localizacao: string;
  descricao: string;
  relevancia_clinica: string;
  gradiente: string;
  substratos_psiq: string[];
  inibidores_psiq: string[];
  indutores_psiq: string[];
  variantes: VarianteGenetica[];
  farmacos: FarmacoFarmacogenetica[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DADOS
// ─────────────────────────────────────────────────────────────────────────────

export const sistemasFarmacogenetica: SistemaGenetico[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. CYP2D6
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "cyp2d6",
    gene: "CYP2D6",
    nome_completo: "Citocromo P450 2D6",
    localizacao: "Cromossomo 22q13.1",
    descricao:
      "Enzima hepática responsável pelo metabolismo de ~25% dos fármacos clinicamente utilizados. Altamente polimórfico — mais de 100 alelos conhecidos. Ausente no cérebro em concentrações funcionais clinicamente relevantes.",
    relevancia_clinica:
      "Metaboliza a maioria dos antidepressivos e antipsicóticos de uso frequente. Poor metabolizers (PM) têm exposição aumentada → maior risco de efeitos adversos e SEP. Ultra-rapid metabolizers (UM) têm eficácia reduzida → risco de falha terapêutica.",
    gradiente: "from-violet-500 to-purple-600",
    substratos_psiq: [
      "Haloperidol",
      "Risperidona",
      "Aripiprazol",
      "Clozapina (parcial)",
      "Fluoxetina",
      "Paroxetina",
      "Venlafaxina",
      "Amitriptilina",
      "Nortriptilina",
      "Imipramina",
      "Codeína → Morfina",
    ],
    inibidores_psiq: [
      "Fluoxetina (potente — evitar em PMs)",
      "Paroxetina (potente — evitar em PMs)",
      "Bupropiona (moderado)",
      "Duloxetina (moderado)",
    ],
    indutores_psiq: [
      "Carbamazepina",
      "Rifampicina",
    ],
    variantes: [
      {
        gene: "CYP2D6",
        variante: "*1/*1",
        fenotipo: "Metabolizador Extenso (EM)",
        frequencia: "~70%",
        descricao:
          "Dois alelos funcionais. Atividade enzimática normal. Fenótipo de referência para dosagem padrão.",
        impacto_clinico:
          "Doses convencionais são adequadas. Nenhum ajuste necessário para a maioria dos fármacos.",
      },
      {
        gene: "CYP2D6",
        variante: "*4/*1",
        fenotipo: "Metabolizador Intermediário (IM)",
        frequencia: "~15%",
        descricao:
          "Um alelo não-funcional e um funcional. Atividade enzimática reduzida (~50% do normal).",
        impacto_clinico:
          "Exposição moderadamente aumentada. Monitorar para sinais de toxicidade, especialmente com ADTs e risperidona. Considerar redução de dose em 25–30%.",
      },
      {
        gene: "CYP2D6",
        variante: "*4/*4",
        fenotipo: "Metabolizador Pobre (PM)",
        frequencia: "~7%",
        descricao:
          "Dois alelos não-funcionais. Ausência de atividade enzimática CYP2D6. Mais comum em caucasianos.",
        impacto_clinico:
          "Exposição 2–5× maior para risperidona e aripiprazol → maior risco de SEP e hiperprolactinemia. Para ADTs: risco de toxicidade cardíaca. Para codeína: risco de acumulação de codeína não convertida (ineficácia analgésica). Evitar fluoxetina e paroxetina.",
      },
      {
        gene: "CYP2D6",
        variante: "*1xN/*1",
        fenotipo: "Metabolizador Ultra-rápido (UM)",
        frequencia: "~8%",
        descricao:
          "Duplicação ou multiplicação gênica — atividade enzimática muito elevada. Mais prevalente em populações norte-africanas e do Oriente Médio.",
        impacto_clinico:
          "Risco de falha terapêutica com antidepressivos e antipsicóticos em doses convencionais. Para codeína: conversão excessiva em morfina → risco de toxicidade opioide. Considerar fármaco alternativo ou doses significativamente mais altas com monitoramento.",
      },
    ],
    farmacos: [
      {
        id: "cyp2d6-risperidona",
        nome: "Risperidona",
        gene_principal: "CYP2D6",
        genes_secundarios: [],
        metabolismo:
          "Metabolizada principalmente por CYP2D6 para 9-OH-risperidona (paliperidona), que é igualmente ativa. A soma risperidona + 9-OH-risperidona determina a fração ativa total.",
        recomendacao_pm:
          "Reduzir dose em 50%. AUC aumentada em 2–3×. Risco elevado de SEP, sedação e hiperprolactinemia. Monitorar rigorosamente.",
        recomendacao_im:
          "Reduzir dose em 25–30%. Monitorar sinais de SEP e hiperprolactinemia.",
        recomendacao_em:
          "Dose padrão (2–8 mg/dia). Sem ajuste necessário.",
        recomendacao_um:
          "Pode necessitar de doses maiores para efeito terapêutico. Monitorar eficácia clínica.",
        nivel_evidencia: "A",
        fonte: "CPIC Guidelines — CYP2D6 and Risperidone (2021)",
      },
      {
        id: "cyp2d6-aripiprazol",
        nome: "Aripiprazol",
        gene_principal: "CYP2D6",
        genes_secundarios: ["CYP3A4"],
        metabolismo:
          "Metabolizado por CYP2D6 (primário) e CYP3A4 (secundário) para dehidro-aripiprazol (metabólito ativo). Em PMs, a via CYP3A4 compensa parcialmente.",
        recomendacao_pm:
          "Reduzir dose em 40–50% (ver bula FDA). AUC total aumentada em ~60%. Risco de acatisia e SEP.",
        recomendacao_im:
          "Considerar redução de dose em 20–30%. Monitorar tolerabilidade.",
        recomendacao_em:
          "Dose padrão (10–30 mg/dia). Sem ajuste necessário.",
        recomendacao_um:
          "Pode requerer dose superior à usual. Avaliar resposta clínica e ajustar.",
        nivel_evidencia: "A",
        fonte: "FDA Drug Label — Aripiprazol; CPIC CYP2D6 Guideline",
      },
      {
        id: "cyp2d6-haloperidol",
        nome: "Haloperidol",
        gene_principal: "CYP2D6",
        genes_secundarios: ["CYP3A4"],
        metabolismo:
          "Metabolizado por CYP2D6 e CYP3A4. Em PMs, exposição aumentada com maior risco de SEP grave e prolongamento de QTc.",
        recomendacao_pm:
          "Reduzir dose em 30–50%. Monitorar ECG para QTc e sinais extrapiramidais.",
        recomendacao_im:
          "Reduzir dose em 15–25%. Vigilância para SEP.",
        recomendacao_em:
          "Dose padrão (0,5–20 mg/dia). Sem ajuste.",
        recomendacao_um:
          "Eficácia pode ser reduzida. Considerar dose maior ou antipsicótico alternativo.",
        nivel_evidencia: "B",
        fonte: "PharmGKB — Haloperidol/CYP2D6 annotation",
      },
      {
        id: "cyp2d6-fluoxetina",
        nome: "Fluoxetina",
        gene_principal: "CYP2D6",
        genes_secundarios: ["CYP2C9"],
        metabolismo:
          "Substrato e inibidor potente de CYP2D6. Metabolizada para norfluoxetina (ativa, meia-vida ~7–15 dias). Em PMs: exposição muito elevada. ATENÇÃO: a própria fluoxetina converte EMs em PMs funcionais (inibição fenotípica).",
        recomendacao_pm:
          "Evitar ou usar dose mínima possível (10 mg/dia). Risco de toxicidade serotoninérgica e prolongamento de QTc.",
        recomendacao_im:
          "Iniciar com 10 mg/dia. Titular lentamente. Monitorar.",
        recomendacao_em:
          "Dose padrão (20–80 mg/dia). Considerar que fluoxetina inibe CYP2D6 e pode afetar coadministração de outros substratos.",
        recomendacao_um:
          "Dose padrão ou levemente aumentada. Resposta pode ser menor — avaliar alternativas se ineficaz.",
        nivel_evidencia: "A",
        fonte: "CPIC Guideline — CYP2D6 and SSRIs",
      },
      {
        id: "cyp2d6-paroxetina",
        nome: "Paroxetina",
        gene_principal: "CYP2D6",
        genes_secundarios: [],
        metabolismo:
          "Substrato e inibidor potente de CYP2D6. Autoinibição: em doses terapêuticas, converte o fenótipo EM em PM funcional. Maior potencial de interação medicamentosa da classe ISRS.",
        recomendacao_pm:
          "Evitar. Alternativas: sertralina, escitalopram (metabolismo mínimo por CYP2D6).",
        recomendacao_im:
          "Usar com cautela. Dose mínima. Preferir sertralina ou escitalopram.",
        recomendacao_em:
          "Dose padrão (20–60 mg/dia), mas considerar impacto na inibição de CYP2D6 sobre outros fármacos concomitantes.",
        recomendacao_um:
          "Eficácia reduzida improvável (autoinibição compensa). Monitorar resposta clínica.",
        nivel_evidencia: "A",
        fonte: "CPIC Guideline — CYP2D6 and SSRIs",
      },
      {
        id: "cyp2d6-venlafaxina",
        nome: "Venlafaxina",
        gene_principal: "CYP2D6",
        genes_secundarios: ["CYP3A4"],
        metabolismo:
          "Metabolizada por CYP2D6 para O-desmetilvenlafaxina (desvenlafaxina), que é mais potente inibidor de noradrenalina. PM: acumulação de venlafaxina → perfil serotoninérgico dominante. UM: maior proporção de desvenlafaxina → efeito noradrenérgico mais intenso.",
        recomendacao_pm:
          "Reduzir dose em 25–50%. Risco de efeitos cardiovasculares (taquicardia, hipertensão) e serotoninérgicos. Monitorar PA.",
        recomendacao_im:
          "Iniciar com dose baixa. Monitorar PA e FC.",
        recomendacao_em:
          "Dose padrão (75–225 mg/dia). Sem ajuste.",
        recomendacao_um:
          "Pode apresentar perfil noradrenérgico mais pronunciado. Monitorar PA.",
        nivel_evidencia: "B",
        fonte: "PharmGKB — Venlafaxina/CYP2D6",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CYP2C19
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "cyp2c19",
    gene: "CYP2C19",
    nome_completo: "Citocromo P450 2C19",
    localizacao: "Cromossomo 10q23.33",
    descricao:
      "Enzima hepática responsável por metabolismo de antidepressivos (especialmente escitalopram e citalopram), benzodiazepínicos e inibidores de bomba de prótons. Polimorfismo com diferenças étnicas marcantes: PM muito mais frequente em asiáticos.",
    relevancia_clinica:
      "PM tem exposição dobrada a escitalopram/citalopram → risco aumentado de prolongamento de QTc, especialmente combinado a outros fármacos QT-prolonging. UM tem exposição subterapêutica → falha clínica com ISRSs dependentes de CYP2C19.",
    gradiente: "from-blue-500 to-indigo-600",
    substratos_psiq: [
      "Escitalopram",
      "Citalopram",
      "Sertralina (parcial)",
      "Clomipramina",
      "Imipramina",
      "Amitriptilina",
      "Diazepam",
      "Omeprazol (co-medicação frequente)",
    ],
    inibidores_psiq: [
      "Fluoxetina (moderado)",
      "Fluvoxamina (potente)",
      "Omeprazol (moderado — afeta escitalopram)",
    ],
    indutores_psiq: [
      "Carbamazepina",
      "Rifampicina",
    ],
    variantes: [
      {
        gene: "CYP2C19",
        variante: "*1/*1",
        fenotipo: "Metabolizador Extenso (EM)",
        frequencia: "~65–70% caucasianos",
        descricao:
          "Dois alelos funcionais. Atividade enzimática normal. Referência para dosagem.",
        impacto_clinico:
          "Doses convencionais de escitalopram, citalopram e demais substratos são adequadas.",
      },
      {
        gene: "CYP2C19",
        variante: "*2/*1",
        fenotipo: "Metabolizador Intermediário (IM)",
        frequencia: "~25%",
        descricao:
          "Um alelo não-funcional (*2) e um funcional. Atividade reduzida em ~50%.",
        impacto_clinico:
          "Exposição moderadamente aumentada a escitalopram/citalopram. Monitorar QTc. Considerar limite superior de 20 mg/dia para escitalopram.",
      },
      {
        gene: "CYP2C19",
        variante: "*2/*2",
        fenotipo: "Metabolizador Pobre (PM)",
        frequencia: "~2–3% caucasianos; ~15–20% asiáticos",
        descricao:
          "Dois alelos não-funcionais. Ausência de atividade CYP2C19. Diferença étnica clinicamente relevante.",
        impacto_clinico:
          "Exposição 2× maior para escitalopram e citalopram → reduzir dose em 50% (máx. 10 mg escitalopram, 20 mg citalopram). Risco aumentado de prolongamento de QTc. Clomipramina: evitar. Diazepam: usar benzodiazepínico alternativo (lorazepam, oxazepam — não dependem de CYP450).",
      },
      {
        gene: "CYP2C19",
        variante: "*17/*17",
        fenotipo: "Metabolizador Ultra-rápido (UM)",
        frequencia: "~5%",
        descricao:
          "Dois alelos com ganho de função (*17). Atividade enzimática muito elevada.",
        impacto_clinico:
          "Escitalopram e citalopram subterapêuticos em doses padrão. Considerar sertralina ou outro ISRS com menor dependência de CYP2C19. Se mantiver escitalopram, monitorar resposta clínica e considerar dose mais alta com precaução (QTc).",
      },
    ],
    farmacos: [
      {
        id: "cyp2c19-escitalopram",
        nome: "Escitalopram",
        gene_principal: "CYP2C19",
        genes_secundarios: ["CYP3A4"],
        metabolismo:
          "Metabolizado predominantemente por CYP2C19 (S-desmetilcitalopram). Variações em CYP2C19 têm impacto direto na AUC e risco de QTc.",
        recomendacao_pm:
          "Reduzir dose em 50% (máx. 10 mg/dia). FDA e EMA contraindicam doses >10 mg em PMs. Monitorar ECG (QTc) especialmente se >450 ms.",
        recomendacao_im:
          "Iniciar com 10 mg/dia. Dose máxima: 20 mg/dia. Monitorar QTc.",
        recomendacao_em:
          "Dose padrão (10–20 mg/dia). Sem ajuste.",
        recomendacao_um:
          "Exposição subterapêutica possível. Considerar sertralina como alternativa. Se mantiver, avaliar resposta em 4–6 semanas.",
        nivel_evidencia: "A",
        fonte: "CPIC Guideline — CYP2C19 and SSRIs (2015, updated 2021)",
      },
      {
        id: "cyp2c19-citalopram",
        nome: "Citalopram",
        gene_principal: "CYP2C19",
        genes_secundarios: [],
        metabolismo:
          "Racemato de escitalopram; ambas as vias CYP2C19 e CYP2D6 envolvidas. PMs têm maior impacto ainda que escitalopram (menor contribuição de outras vias).",
        recomendacao_pm:
          "Reduzir dose em 50% (máx. 20 mg/dia). Risco significativo de QTc prolongado. Monitorar ECG.",
        recomendacao_im:
          "Iniciar com 10–20 mg/dia. Máx. 20 mg/dia. Monitorar QTc.",
        recomendacao_em:
          "Dose padrão (20–40 mg/dia). Sem ajuste.",
        recomendacao_um:
          "Resposta subterapêutica. Preferir sertralina ou antidepressivo com menor dependência de CYP2C19.",
        nivel_evidencia: "A",
        fonte: "CPIC Guideline — CYP2C19 and SSRIs; FDA Drug Label",
      },
      {
        id: "cyp2c19-clomipramina",
        nome: "Clomipramina",
        gene_principal: "CYP2C19",
        genes_secundarios: ["CYP2D6"],
        metabolismo:
          "Metabolizada por CYP2C19 (desmetilclomipramina) e CYP2D6. PM em ambas as enzimas: acumulação grave com risco cardíaco.",
        recomendacao_pm:
          "Evitar sempre que possível. Se necessário, iniciar com dose muito baixa (10–25 mg/dia) com monitoramento de ECG e níveis séricos.",
        recomendacao_im:
          "Reduzir dose em 25–30%. Monitorar ECG.",
        recomendacao_em:
          "Dose padrão (75–250 mg/dia para TOC). Monitorar ECG.",
        recomendacao_um:
          "Eficácia reduzida. Avaliar nível sérico. Considerar clomipramina IV ou outro fármaco.",
        nivel_evidencia: "B",
        fonte: "PharmGKB — Clomipramina/CYP2C19/CYP2D6",
      },
      {
        id: "cyp2c19-diazepam",
        nome: "Diazepam",
        gene_principal: "CYP2C19",
        genes_secundarios: ["CYP3A4"],
        metabolismo:
          "Metabolizado a N-desmetildiazepam (desmethyldiazepam, ativo, longa meia-vida) por CYP2C19. PMs: acumulação de desmethyldiazepam → sedação prolongada.",
        recomendacao_pm:
          "Preferir lorazepam ou oxazepam (conjugação direta, sem CYP450). Se necessário diazepam, reduzir dose em 50% e aumentar intervalo.",
        recomendacao_im:
          "Reduzir dose em 25%. Monitorar sedação.",
        recomendacao_em:
          "Dose padrão. Sem ajuste.",
        recomendacao_um:
          "Efeito ansiolítico reduzido possível. Monitorar resposta clínica.",
        nivel_evidencia: "B",
        fonte: "PharmGKB — Diazepam/CYP2C19",
      },
      {
        id: "cyp2c19-sertralina",
        nome: "Sertralina",
        gene_principal: "CYP2C19",
        genes_secundarios: ["CYP2D6", "CYP3A4"],
        metabolismo:
          "Metabolismo via múltiplas vias (CYP2C19, CYP2D6, CYP3A4). Menor dependência de uma única enzima — ISRS com perfil mais robusto farmacogeneticamente.",
        recomendacao_pm:
          "Dose padrão na maioria dos casos. Monitorar — aumento de AUC é modesto (~30%). Considerada alternativa preferida a escitalopram em PMs de CYP2C19.",
        recomendacao_im:
          "Dose padrão. Sem ajuste necessário.",
        recomendacao_em:
          "Dose padrão (50–200 mg/dia). Sem ajuste.",
        recomendacao_um:
          "Dose padrão. Menor impacto de CYP2C19 UM que escitalopram. Monitorar resposta.",
        nivel_evidencia: "B",
        fonte: "CPIC Guideline — CYP2C19 and SSRIs",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. CYP3A4/5
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "cyp3a4",
    gene: "CYP3A4/5",
    nome_completo: "Citocromo P450 3A4 e 3A5",
    localizacao: "Cromossomo 7q22.1",
    descricao:
      "Maior família de enzimas CYP — responsável por ~50% de todos os fármacos metabolizados pelo fígado e intestino delgado. CYP3A5 tem relevância clínica principalmente em afrodescendentes (alelo *1 funcional mais frequente). Variabilidade genética menos pronunciada que CYP2D6/CYP2C19 — interações medicamentosas com inibidores/indutores são mais clinicamente relevantes que polimorfismos.",
    relevancia_clinica:
      "Carbamazepina (autoindutor potente) e erva de São João são os maiores indutores clínicos. Fluconazol e eritromicina são inibidores relevantes no contexto psiquiátrico. CYP3A5*3 (não metabolizador de CYP3A5) é prevalente em caucasianos, mas CYP3A4 compensa.",
    gradiente: "from-emerald-500 to-teal-600",
    substratos_psiq: [
      "Quetiapina",
      "Aripiprazol (secundário)",
      "Lurasidona",
      "Alprazolam",
      "Midazolam",
      "Clonazepam",
      "Carbamazepina (autoindutor)",
      "Pimozida",
      "Ziprasidona",
    ],
    inibidores_psiq: [
      "Fluconazol (potente)",
      "Eritromicina (moderado)",
      "Suco de toranja / Pomelo (moderado a potente — bloqueia CYP3A4 intestinal)",
      "Fluvoxamina (moderado)",
      "Nefazodona (potente — descontinuada no Brasil)",
    ],
    indutores_psiq: [
      "Carbamazepina (potente — autoindutor!)",
      "Fenitoína (potente)",
      "Rifampicina (potente)",
      "Erva de São João — Hypericum perforatum (moderado a potente)",
      "Modafinila (fraco a moderado)",
    ],
    variantes: [
      {
        gene: "CYP3A5",
        variante: "*1/*1 ou *1/*3",
        fenotipo: "Metabolizador CYP3A5 Expressador",
        frequencia: "~10–15% caucasianos; ~50–70% afrodescendentes",
        descricao:
          "Alelo *1 funcional → CYP3A5 ativo. Em afrodescendentes, CYP3A5 contribui significativamente para metabolismo de substratos CYP3A.",
        impacto_clinico:
          "Metabolismo total (CYP3A4 + CYP3A5) aumentado. Pode ser necessário maior dose de quetiapina e outros substratos CYP3A em afrodescendentes.",
      },
      {
        gene: "CYP3A5",
        variante: "*3/*3",
        fenotipo: "Não Expressador CYP3A5",
        frequencia: "~85–90% caucasianos; ~30–40% afrodescendentes",
        descricao:
          "Variante de perda de função. CYP3A5 sem atividade — metabolismo CYP3A depende exclusivamente de CYP3A4.",
        impacto_clinico:
          "Fenótipo de base em maioria dos caucasianos. Interações com inibidores/indutores de CYP3A4 têm impacto proporcionalmente maior.",
      },
      {
        gene: "CYP3A4",
        variante: "*22 (rs35599367)",
        fenotipo: "Metabolizador Lento CYP3A4",
        frequencia: "~5–7% caucasianos",
        descricao:
          "Variante de perda de função parcial em CYP3A4. Redução de expressão hepática de ~40%.",
        impacto_clinico:
          "Exposição aumentada a quetiapina e benzodiazepínicos. Monitorar para sedação excessiva. Associado a maior risco de reações adversas com substratos CYP3A4.",
      },
      {
        gene: "CYP3A4",
        variante: "*1B (rs2740574)",
        fenotipo: "Indução Aumentada Potencial",
        frequencia: "~5% caucasianos; ~35% afrodescendentes",
        descricao:
          "Variante promotora com maior induzibilidade. Efeito isolado modesto; mais relevante em contexto de co-indutores.",
        impacto_clinico:
          "Modestamente maior clearance de substratos CYP3A. Clinicamente relevante principalmente quando combinado a indutores.",
      },
    ],
    farmacos: [
      {
        id: "cyp3a4-quetiapina",
        nome: "Quetiapina",
        gene_principal: "CYP3A4",
        genes_secundarios: [],
        metabolismo:
          "Metabolizada quase exclusivamente por CYP3A4. Altamente sensível a indutores e inibidores. Carbamazepina reduz AUC de quetiapina em ~80% — risco de falha terapêutica severa.",
        recomendacao_pm:
          "CYP3A4 PM (*22 homozigotos): Reduzir dose em 30–40%. Monitorar sedação, prolongamento de QTc e hipotensão.",
        recomendacao_im:
          "Dose padrão com cautela. Iniciar com dose baixa. Monitorar.",
        recomendacao_em:
          "Dose padrão (150–800 mg/dia dependendo da indicação). Sem ajuste.",
        recomendacao_um:
          "Dose pode ser insuficiente — avaliar resposta clínica. Verificar uso concomitante de indutores (carbamazepina, fenitoína).",
        nivel_evidencia: "B",
        fonte: "PharmGKB — Quetiapina/CYP3A4; Stahl's Essential Psychopharmacology",
      },
      {
        id: "cyp3a4-lurasidona",
        nome: "Lurasidona",
        gene_principal: "CYP3A4",
        genes_secundarios: [],
        metabolismo:
          "Metabolizada exclusivamente por CYP3A4. Contraindicada com inibidores potentes (fluconazol, eritromicina em doses altas) e indutores potentes (carbamazepina, rifampicina).",
        recomendacao_pm:
          "Reduzir dose em 50% se há evidência de atividade reduzida de CYP3A4. Monitorar efeitos adversos (acatisia, SEP, sedação).",
        recomendacao_im:
          "Iniciar com dose baixa (20–40 mg/dia). Monitorar.",
        recomendacao_em:
          "Dose padrão (40–160 mg/dia com alimento). Sem ajuste.",
        recomendacao_um:
          "Verificar indutores co-administrados. Dose pode ser insuficiente — monitorar resposta.",
        nivel_evidencia: "B",
        fonte: "FDA Drug Label — Lurasidona; PharmGKB",
      },
      {
        id: "cyp3a4-alprazolam",
        nome: "Alprazolam",
        gene_principal: "CYP3A4",
        genes_secundarios: [],
        metabolismo:
          "Metabolizado por CYP3A4 para alfa-hidroxialprazolam (fraca atividade). Altamente sensível a inibidores: fluconazol e eritromicina aumentam AUC em 2–3×.",
        recomendacao_pm:
          "Reduzir dose em 30–50%. Risco de sedação excessiva e depressão respiratória.",
        recomendacao_im:
          "Reduzir dose inicial. Monitorar sedação.",
        recomendacao_em:
          "Dose padrão (0,25–2 mg 2–3×/dia). Sem ajuste.",
        recomendacao_um:
          "Efeito ansiolítico reduzido. Considerar lorazepam (conjugação direta, independente de CYP450).",
        nivel_evidencia: "C",
        fonte: "PharmGKB; Micromedex — Alprazolam Pharmacogenomics",
      },
      {
        id: "cyp3a4-carbamazepina",
        nome: "Carbamazepina",
        gene_principal: "CYP3A4",
        genes_secundarios: ["CYP2B6", "CYP1A2"],
        metabolismo:
          "Substrato e indutor potente de CYP3A4 (autoindutor). Metabolizada a carbamazepina-10,11-epóxido (ativo, neurotóxico em concentrações altas). ATENÇÃO: HLA-B*1502 associado a risco de síndrome de Stevens-Johnson — testagem obrigatória antes de uso em pacientes de ascendência sul-asiática e de sudeste asiático.",
        recomendacao_pm:
          "Autoindutor — após 3–4 semanas, induz seu próprio metabolismo independentemente do fenótipo CYP3A4 basal. Monitorar níveis séricos.",
        recomendacao_im:
          "Monitorar níveis. Clearance autoindutor pode normalizar diferenças fenotípicas.",
        recomendacao_em:
          "Dose padrão (400–1600 mg/dia). Monitorar nível sérico (4–12 μg/mL).",
        recomendacao_um:
          "Monitorar nível. Autoindutor pode compensar. Risco de nível subterapêutico antes da autoinduação.",
        nivel_evidencia: "A",
        fonte: "CPIC Guideline — HLA-B and Carbamazepine; FDA Drug Label",
      },
      {
        id: "cyp3a4-midazolam",
        nome: "Midazolam",
        gene_principal: "CYP3A4",
        genes_secundarios: [],
        metabolismo:
          "Benzodiazepínico de ação ultracurta; substrato índice de CYP3A4. Metabolismo exclusivamente via CYP3A4 — ferramenta padrão para avaliar atividade de CYP3A4 em estudos clínicos.",
        recomendacao_pm:
          "Reduzir dose em 50%. Risco de sedação prolongada e depressão respiratória.",
        recomendacao_im:
          "Reduzir dose em 25%. Monitorar.",
        recomendacao_em:
          "Dose padrão (titulação clínica — 0,5–5 mg IV/IM). Sem ajuste.",
        recomendacao_um:
          "Sedação pode ser insuficiente. Ajustar por titulação clínica.",
        nivel_evidencia: "C",
        fonte: "PharmGKB — Midazolam/CYP3A4",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const fenotipoColors: Record<string, { bg: string; text: string; border: string }> = {
  PM: { bg: "bg-red-500/10",    text: "text-red-600 dark:text-red-400",    border: "border-red-500/20" },
  IM: { bg: "bg-amber-500/10",  text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
  EM: { bg: "bg-green-500/10",  text: "text-green-600 dark:text-green-400", border: "border-green-500/20" },
  UM: { bg: "bg-blue-500/10",   text: "text-blue-600 dark:text-blue-400",  border: "border-blue-500/20" },
};

export const nivelEvidenciaConfig: Record<"A" | "B" | "C", { label: string; cls: string }> = {
  A: { label: "Evidência A", cls: "bg-green-500/10 text-green-600 border-green-500/20" },
  B: { label: "Evidência B", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  C: { label: "Evidência C", cls: "bg-muted text-muted-foreground border-border" },
};
