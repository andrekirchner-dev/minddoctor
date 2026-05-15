export type NivelRisco = "alto" | "moderado" | "baixo" | "variavel" | "na";
export type PerfilAtivacao = "ativador" | "sedativo" | "neutro" | "variavel";
export type EfeitoProlactina = "eleva" | "reduz" | "neutro";

export interface PerfilClinico {
  ativacao: PerfilAtivacao;
  risco_sexual: NivelRisco;
  risco_metabolico: NivelRisco;
  risco_qtc: NivelRisco;
  risco_eps: NivelRisco;
  prolactina: EfeitoProlactina;
}

export interface SubclasseFarmacologica {
  id: string;
  nome: string;
  nome_completo: string;
  classe_id: string;
  descricao: string;
  mecanismo: string;
  moleculas: string[];
  indicacoes: string[];
  perfil: PerfilClinico;
  efeitos_adversos: string[];
  contraindicacoes: string[];
  monitoramento: string[];
  diferenciais?: string[];
  nota_clinica?: string;
}

export interface ClasseFarmacologica {
  id: string;
  nome: string;
  descricao: string;
  gradiente: string;
  subclasses: SubclasseFarmacologica[];
}

// ─────────────────────────────────────────────────────────────────────────────
export const classes: ClasseFarmacologica[] = [
  // ── A. ANTIDEPRESSIVOS ────────────────────────────────────────────────────
  {
    id: "antidepressivos",
    nome: "Antidepressivos",
    descricao: "Fármacos que modulam sistemas monoaminérgicos para tratar depressão, ansiedade e transtornos relacionados.",
    gradiente: "from-blue-500 to-indigo-600",
    subclasses: [
      {
        id: "isrs",
        nome: "ISRS",
        nome_completo: "Inibidores Seletivos da Recaptação de Serotonina",
        classe_id: "antidepressivos",
        descricao: "Primeira linha para depressão e ansiedade. Inibem o SERT com alta seletividade e mínima ação sobre outros receptores.",
        mecanismo: "Bloqueio do transportador SERT → ↑5-HT na fenda sináptica. Após 2–4 semanas: dessensibilização dos autorreceptores 5-HT1A → amplificação do sinal serotoninérgico.",
        moleculas: ["Sertralina", "Fluoxetina", "Escitalopram", "Citalopram", "Paroxetina", "Fluvoxamina"],
        indicacoes: ["Transtorno depressivo maior (TDM)", "TAG", "Transtorno de pânico", "TOC", "TEPT", "Fobia social", "TDPM"],
        perfil: { ativacao: "variavel", risco_sexual: "alto", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Náusea (início do tratamento)", "Disfunção sexual (ejaculação precoce, anorgasmia)", "Insônia ou sonolência", "Sudorese", "Bruxismo", "Hiponatremia (SIADH)", "Aumento de risco de sangramento GI", "Síndrome serotoninérgica (interação com IMAOs)"],
        contraindicacoes: ["Uso concomitante com IMAOs (washout 14 dias irreversíveis)", "Hipersensibilidade"],
        monitoramento: ["Ideação suicida nas primeiras semanas (especialmente <25 anos)", "Sódio sérico em idosos", "Sintomas de síndrome serotoninérgica", "Peso e função sexual"],
        diferenciais: [
          "Fluoxetina: meia-vida longa (norfluoxetina ~1–2 semanas) — menor síndrome de retirada; inibe CYP2D6; mais ativadora",
          "Paroxetina: anticolinérgica + NET leve; maior disfunção sexual; síndrome de retirada mais intensa; menor na gravidez",
          "Sertralina: bom perfil cardiovascular; referência em gestação e pós-parto",
          "Escitalopram: enantiômero ativo do citalopram; melhor tolerabilidade geral",
          "Citalopram: risco de QTc dose-dependente (limite: 40 mg em adultos, 20 mg em >60 anos)",
          "Fluvoxamina: inibe potentemente CYP1A2 e CYP2C19; agonista sigma-1; TOC e uso off-label em COVID",
        ],
        nota_clinica: "Latência de 2–4 semanas para efeito antidepressivo. Descontinuação deve ser gradual (redução de 25%/2 semanas) para evitar síndrome de retirada (FINISH: Flu-like, Insomnia, Nausea, Sensory disturbances, Hyperactivation).",
      },
      {
        id: "irsn",
        nome: "IRSN",
        nome_completo: "Inibidores da Recaptação de Serotonina e Noradrenalina",
        classe_id: "antidepressivos",
        descricao: "SERT dominante em doses baixas; efeito NET clinicamente relevante em doses maiores. Úteis em depressão com dor e ansiedade.",
        mecanismo: "Inibição de SERT + NET (dose-dependente). Efeito noradrenérgico amplifica analgesia e benefícios no CPF.",
        moleculas: ["Venlafaxina", "Desvenlafaxina", "Duloxetina", "Milnaciprano"],
        indicacoes: ["TDM", "TAG", "Pânico", "Dor neuropática", "Fibromialgia", "TEPT", "Sintomas vasomotores da menopausa"],
        perfil: { ativacao: "variavel", risco_sexual: "moderado", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Náusea", "Sudorese", "Aumento de PA (especialmente venlafaxina em doses altas)", "Taquicardia", "Insônia", "Síndrome de retirada intensa (venlafaxina)", "Disfunção sexual"],
        contraindicacoes: ["IMAOs", "Hipertensão não controlada (cautela com venlafaxina >150 mg)"],
        monitoramento: ["PA e FC (venlafaxina)", "Função hepática (duloxetina)", "Sintomas de retirada na descontinuação"],
        diferenciais: [
          "Venlafaxina: NET relevante acima de ~150 mg/dia; síndrome de retirada severa; XR preferida pela tolerabilidade",
          "Duloxetina: SERT + NET equilibrados; aprovada para dor neuropática diabética, fibromialgia, enurese noturna",
          "Desvenlafaxina: metabólito ativo da venlafaxina; farmacocinética mais previsível; menor interação CYP",
        ],
        nota_clinica: "Síndrome de retirada da venlafaxina é das mais intensas entre antidepressivos — planejar descontinuação muito gradual ou troca para fluoxetina antes da retirada.",
      },
      {
        id: "atc",
        nome: "ATC",
        nome_completo: "Antidepressivos Tricíclicos",
        classe_id: "antidepressivos",
        descricao: "Potentes, mas com janela terapêutica estreita e carga receptorial intensa. Segunda linha por perfil de segurança, mas ainda muito usados para dor crônica e insônia.",
        mecanismo: "Inibição de SERT + NET + bloqueio H1 (sedação), M1 (anticolinérgico), α1 (hipotensão).",
        moleculas: ["Amitriptilina", "Nortriptilina", "Imipramina", "Clomipramina", "Desipramina", "Doxepina"],
        indicacoes: ["TDM (segunda linha)", "Dor crônica e neuropática", "Enxaqueca (profilaxia)", "TOC (clomipramina — primeira linha)", "Insônia (baixas doses)", "Enurese noturna (imipramina)"],
        perfil: { ativacao: "sedativo", risco_sexual: "alto", risco_metabolico: "moderado", risco_qtc: "alto", risco_eps: "baixo", prolactina: "neutro" },
        efeitos_adversos: ["Sedação intensa", "Boca seca, constipação, retenção urinária (anticolinérgico)", "Ganho de peso", "Hipotensão ortostática", "Prolongamento de QRS e QTc", "Cardiotoxicidade grave em overdose", "Confusão e delirium (idosos)"],
        contraindicacoes: ["IAM recente", "Bloqueio de ramo", "Glaucoma de ângulo fechado", "Hiperplasia prostática com retenção", "IMAOs", "Idosos (Beers)"],
        monitoramento: ["ECG basal e seguimento (QTc, QRS)", "Nível sérico se suspeita de toxicidade", "Função cognitiva em idosos"],
        diferenciais: [
          "Clomipramina: maior seletividade SERT entre os ATCs — primeira linha no TOC",
          "Nortriptilina: menor carga anticolinérgica que amitriptilina; melhor para dor em idosos",
          "Amitriptilina: mais sedativa; dor crônica, enxaqueca, insônia",
          "Desipramina: predominantemente NET; menos anticolinérgica; mais ativadora",
        ],
        nota_clinica: "Potencialmente fatais em overdose (arritmia, convulsão, hipotensão). Evitar prescrição de >1 semana de doses letais em pacientes com risco suicida. Considerar cofre de medicamentos.",
      },
      {
        id: "imao",
        nome: "IMAO",
        nome_completo: "Inibidores da Monoamina Oxidase",
        classe_id: "antidepressivos",
        descricao: "Potentes antidepressivos com indicações específicas (depressão atípica, resistente). Uso limitado por interações graves e necessidade de dieta restrita.",
        mecanismo: "Inibição de MAO-A/B → ↑5-HT, ↑NA, ↑DA. Irreversíveis (tranilcipromina, fenelzina) exigem washout prolongado; moclobemida (RIMA) é reversível e mais segura.",
        moleculas: ["Tranilcipromina", "Fenelzina", "Moclobemida"],
        indicacoes: ["Depressão atípica (hipersonia, hiperfagia, rejeição interpessoal — primeira linha)", "Depressão resistente", "Fobia social (fenelzina)"],
        perfil: { ativacao: "ativador", risco_sexual: "moderado", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Crise hipertensiva (ingestão de tiramina com irreversíveis)", "Síndrome serotoninérgica (interação com serotoninérgicos)", "Hipotensão ortostática", "Insônia", "Aumento de peso (fenelzina)"],
        contraindicacoes: ["ISRS, IRSN, ATC, tramadol, meperidina (risco de síndrome serotoninérgica)", "Simpaticomiméticos", "Triptanos", "Linezolida", "Alimentos ricos em tiramina (irreversíveis)"],
        monitoramento: ["PA (crise hipertensiva)", "Sinais de síndrome serotoninérgica", "Dieta — lista de alimentos proibidos"],
        nota_clinica: "Washout obrigatório: 14 dias após IMAO irreversível antes de qualquer serotoninérgico (5 semanas após fluoxetina pela meia-vida longa). Moclobemida reversível: washout de apenas 24h.",
      },
      {
        id: "atipicos-antidep",
        nome: "Atípicos / Multimodais",
        nome_completo: "Antidepressivos Atípicos e Multimodais",
        classe_id: "antidepressivos",
        descricao: "Grupo heterogêneo com mecanismos únicos. Permitem individualização por perfil clínico: ativação, sono, peso, cognição ou disfunção sexual.",
        mecanismo: "Variado: NDRI (bupropiona), antagonista α2+5-HT2+H1 (mirtazapina), SARI (trazodona), multimodal 5-HT (vortioxetina), MT1/MT2+5-HT2C (agomelatina), NMDA (esketamina).",
        moleculas: ["Bupropiona", "Mirtazapina", "Trazodona", "Vortioxetina", "Vilazodona", "Agomelatina", "Esketamina"],
        indicacoes: ["TDM com perfil específico", "Fadiga/hiporexia (mirtazapina)", "Insônia (trazodona)", "Déficit cognitivo (vortioxetina)", "Depressão resistente (esketamina)", "Tabagismo/TDAH off-label (bupropiona)"],
        perfil: { ativacao: "variavel", risco_sexual: "variavel", risco_metabolico: "variavel", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Bupropiona: insônia, ansiedade, convulsão dose-dependente", "Mirtazapina: sedação, aumento de peso, aumento de apetite", "Trazodona: hipotensão ortostática, sedação, priapismo (raro)", "Vortioxetina: náusea (início)", "Agomelatina: hepatotoxicidade (monitorar TGO/TGP)", "Esketamina: dissociação, aumento de PA, euforia"],
        contraindicacoes: ["Bupropiona: epilepsia, transtornos alimentares (bulimia/anorexia)", "Agomelatina: hepatopatia grave", "Esketamina: psicose ativa não controlada, hipertensão grave"],
        monitoramento: ["Agomelatina: LFTs antes de iniciar e após 3, 6, 12 semanas e periodicamente", "Esketamina: ambiente monitorado 2h pós-dose (dissociação, PA)", "Bupropiona: limiar convulsivo"],
        diferenciais: [
          "Bupropiona: NDRI — ativador, menor disfunção sexual, útil em tabagismo e TDAH off-label; EVITAR em transtornos alimentares",
          "Mirtazapina: α2-antagonista — sedativa, aumenta apetite, útil em hiporexia e insônia; PARADOXO: menos sedativa em doses maiores",
          "Trazodona: hipnótico em 25–150 mg, antidepressivo em doses maiores; priapismo raro mas emergência urológica",
          "Vortioxetina: multimodal 5-HT (SERT+1A+1B+3+7) — benefício pró-cognitivo; menor disfunção sexual",
          "Agomelatina: MT1/MT2+5-HT2C — normaliza ritmo circadiano; sem disfunção sexual; monitorar fígado",
          "Esketamina (Spravato): NMDA — ação em horas; depressão resistente; sessão supervisionada obrigatória",
        ],
      },
    ],
  },

  // ── B. ESTABILIZADORES ────────────────────────────────────────────────────
  {
    id: "estabilizadores",
    nome: "Estabilizadores de Humor",
    descricao: "Fármacos para tratamento e manutenção do TAB, modulação de impulsividade e prevenção de recaídas.",
    gradiente: "from-emerald-500 to-teal-600",
    subclasses: [
      {
        id: "litio",
        nome: "Lítio",
        nome_completo: "Lítio",
        classe_id: "estabilizadores",
        descricao: "Estabilizador de humor clássico com evidência antisuicida única. Mecanismo pleiotrópico com ação neuroprotetora.",
        mecanismo: "Inibe GSK-3β, inositol monofosfatase e adenilato ciclase. Modula glutamato (NMDA), dopamina e serotonina. Efeito neuroprotetor via BDNF e aumento de volume de hipocampo.",
        moleculas: ["Carbonato de lítio", "Citrato de lítio"],
        indicacoes: ["Mania aguda", "Manutenção do TAB (melhor evidência)", "Depressão bipolar", "Potencialização antidepressiva (depressão unipolar)", "Redução do risco de suicídio"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Tremor fino (dose-dependente)", "Poliúria e polidipsia (diabetes insípido nefrogênico)", "Ganho de peso", "Hipotireoidismo (20–40%)", "Hiperparatireoidismo/hipercalcemia", "Acne/psoríase", "Disfunção renal crônica em uso prolongado"],
        contraindicacoes: ["Doença renal crônica avançada (TFG <30)", "Distúrbios graves do sódio", "Gravidez primeiro trimestre (relativo — anomalia de Ebstein, risco baixo)", "Síndrome do nó sinusal"],
        monitoramento: ["Litemia (alvo 0,6–1,0 mEq/L manutenção; 0,8–1,2 mania aguda) — coleta 12h após última dose", "Creatinina e TFG a cada 6 meses", "TSH/T4L a cada 6–12 meses", "Cálcio/PTH anualmente", "Peso"],
        diferenciais: ["Único estabilizador com evidência antisuicida robusta (reduz suicídio e tentativas em ~60%)", "Efeito neuroprotetor diferencial dos demais estabilizadores"],
        nota_clinica: "Toxicidade: tremor grosseiro, ataxia, confusão (>1,5 mEq/L) → emergência. Interações críticas que elevam litemia: AINEs, IECA/BRA, tiazídicos, desidratação. Sódio baixo aumenta reabsorção renal de lítio.",
      },
      {
        id: "valproato",
        nome: "Valproato",
        nome_completo: "Valproato / Divalproato",
        classe_id: "estabilizadores",
        descricao: "Estabilizador com ação antimaníaca robusta. Particularmente útil em ciclagem rápida, estados mistos e impulsividade.",
        mecanismo: "Bloqueio de canais de Na⁺ + potenciação GABAérgica + redução de glutamato + inibição de histona deacetilase (HDAC) → efeito epigenético.",
        moleculas: ["Valproato de sódio", "Divalproato de sódio (Depakote)", "Ácido valpróico"],
        indicacoes: ["Mania aguda (primeira linha)", "Estados mistos", "Ciclagem rápida", "Epilepsia", "Profilaxia de enxaqueca", "Impulsividade/agressividade"],
        perfil: { ativacao: "sedativo", risco_sexual: "baixo", risco_metabolico: "moderado", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Tremor", "Sedação", "Ganho de peso", "Queda de cabelo (reversível)", "Náusea/dispepsia", "Trombocitopenia", "Hiperamonemia (encefalopatia)", "Síndrome dos ovários policísticos (mulheres jovens)", "Hepatotoxicidade (raro, mais em <2 anos)", "Pancreatite (raro)"],
        contraindicacoes: ["Gestação (teratogênico — spina bifida, malformações craniofaciais, deficit neurocognitivo — EVITAR em mulheres em idade fértil sem contracepção dupla eficaz)", "Hepatopatia grave", "Pancreatite"],
        monitoramento: ["Nível sérico (50–100 µg/mL para mania; 50–125 µg/mL epilepsia)", "TGO/TGP e bilirrubina", "Hemograma com plaquetas", "Amilase/lipase se suspeita de pancreatite", "Peso e ciclo menstrual (mulheres)"],
        nota_clinica: "Interação crítica com lamotrigina: valproato DOBRA os níveis de lamotrigina — usar metade da dose de lamotrigina na combinação. Valproato + carbamazepina: múltiplas interações complexas.",
      },
      {
        id: "lamotrigina",
        nome: "Lamotrigina",
        nome_completo: "Lamotrigina",
        classe_id: "estabilizadores",
        descricao: "Melhor estabilizador para prevenção de depressão bipolar. Sem efeito antimaníaco robusto. Titulação lenta obrigatória.",
        mecanismo: "Bloqueio de canais de Na⁺ voltagem-dependentes + redução da liberação pré-sináptica de glutamato.",
        moleculas: ["Lamotrigina"],
        indicacoes: ["Depressão bipolar (manutenção — melhor evidência)", "Prevenção de recaída depressiva no TAB", "Epilepsia"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Rash/exantema (5–10% — maioria benigno, mas risco de Stevens-Johnson/NET raro)", "Cefaleia", "Tontura", "Ataxia (dose alta)", "Insônia", "Visão turva (dose alta)"],
        contraindicacoes: ["Hipersensibilidade à lamotrigina"],
        monitoramento: ["Rash cutâneo — suspender imediatamente se exantema com febre, mucosas, bolhas", "Humor (foco no polo depressivo)"],
        diferenciais: ["NÃO é antimaníaca robusta — não usar como único agente em episódio maníaco ativo", "Melhor tolerabilidade metabólica e sexual que valproato e lítio"],
        nota_clinica: "Titulação OBRIGATORIAMENTE lenta: 25 mg/dia × 2 sem → 50 mg × 2 sem → 100 mg × 1 sem → 200 mg. COM valproato: iniciar em 12,5 mg e titular mais lentamente. COM carbamazepina/anticoncepcional oral: pode necessitar doses maiores (enzimas indutoras reduzem níveis).",
      },
      {
        id: "carbamazepina",
        nome: "Carbamazepina",
        nome_completo: "Carbamazepina / Oxcarbazepina",
        classe_id: "estabilizadores",
        descricao: "Estabilizador com ação antimaníaca. Uso limitado pelas múltiplas interações farmacocinéticas (autoindutor CYP).",
        mecanismo: "Bloqueio de canais de Na⁺ dependente de uso. Oxcarbazepina: metabólito ativo (10-OH-carbamazepina) com menos interações.",
        moleculas: ["Carbamazepina", "Oxcarbazepina"],
        indicacoes: ["Mania aguda (alternativa)", "Epilepsia (focal e generalizada)", "Neuralgia do trigêmeo", "Dor neuropática"],
        perfil: { ativacao: "sedativo", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Diplopia e ataxia (dose-dependente)", "Sedação", "Hiponatremia (SIADH — mais na oxcarbazepina)", "Rash (Stevens-Johnson em HLA-B*1502 — asiáticos)", "Náusea", "Agranulocitose (raro — carbamazepina)", "Hepatotoxicidade"],
        contraindicacoes: ["HLA-B*1502 positivo sem teste prévio em asiáticos (Stevens-Johnson)", "Bloqueio AV", "Porfiria aguda intermitente", "IMAOs"],
        monitoramento: ["Hemograma (agranulocitose — carbamazepina)", "TGO/TGP", "Sódio sérico (hiponatremia)", "Nível sérico (4–12 µg/mL)", "Teste HLA-B*1502 em pacientes asiáticos"],
        nota_clinica: "Carbamazepina autoinduz CYP3A4 após 3–4 semanas → reduz seus próprios níveis e de quetiapina, lurasidona, anticoncepcionais, varfarina. Ajuste de dose frequentemente necessário.",
      },
    ],
  },

  // ── C. ANTIPSICÓTICOS ─────────────────────────────────────────────────────
  {
    id: "antipsicoticos",
    nome: "Antipsicóticos",
    descricao: "Fármacos que modulam o sistema dopaminérgico e serotoninérgico para tratar psicose, mania, depressão bipolar e agitação.",
    gradiente: "from-orange-500 to-red-500",
    subclasses: [
      {
        id: "ap1g",
        nome: "1ª Geração (Típicos)",
        nome_completo: "Antipsicóticos de Primeira Geração",
        classe_id: "antipsicoticos",
        descricao: "Bloqueio D2 potente e de alta afinidade. Eficazes para sintomas positivos, mas com alto risco de EPS e hiperprolactinemia.",
        mecanismo: "Antagonismo D2 de alta afinidade e baixa dissociação ('tight binding'). Sem antagonismo 5-HT2A significativo.",
        moleculas: ["Haloperidol", "Flufenazina", "Trifluoperazina", "Pimozida", "Clorpromazina", "Levomepromazina", "Periciazina", "Zuclopentixol"],
        indicacoes: ["Esquizofrenia", "Mania aguda (adjuvante)", "Agitação psicomotora aguda (haloperidol IM)", "Delirium (haloperidol)", "Transtorno de Tourette (pimozida, haloperidol)", "Soluço intratável (clorpromazina)"],
        perfil: { ativacao: "neutro", risco_sexual: "moderado", risco_metabolico: "variavel", risco_qtc: "moderado", risco_eps: "alto", prolactina: "eleva" },
        efeitos_adversos: ["EPS: parkinsonismo, distonia aguda, acatisia, discinesia tardia", "Hiperprolactinemia (amenorreia, galactorreia, disfunção sexual)", "Síndrome Neuroléptica Maligna (SNM)", "Sedação (baixa potência)", "Ganho de peso (baixa potência)", "QTc (haloperidol IV, tioridazina)", "Hipotensão (baixa potência)"],
        contraindicacoes: ["Doença de Parkinson (relativo)", "DCL (muito sensíveis a EPS — contraindicado)", "Coma ou depressão do SNC", "QTc prolongado (haloperidol IV)"],
        monitoramento: ["AIMS (Abnormal Involuntary Movement Scale) — discinesia tardia", "Escala de Barnes — acatisia", "Prolactina se sintomas", "ECG (QTc) — especialmente haloperidol IV e tioridazina"],
        diferenciais: [
          "Alta potência (haloperidol): menor sedação/metabólico, maior EPS/prolactina",
          "Baixa potência (clorpromazina, levomepromazina): maior sedação/α1, moderado EPS",
          "Haloperidol IV: risco de QTc significativamente maior que VO",
          "Zuclopentixol: disponível como VO, IM curta ação (acetato) e LAI (decanoato)",
        ],
        nota_clinica: "EPS são dose-dependentes. Biperideno é útil para distonia aguda e parkinsonismo, mas NÃO para acatisia (propranolol é mais eficaz). SNM é emergência médica: rigidez, hipertermia, instabilidade autonômica, CPK elevado.",
      },
      {
        id: "ap2g",
        nome: "2ª Geração (Atípicos)",
        nome_completo: "Antipsicóticos de Segunda Geração",
        classe_id: "antipsicoticos",
        descricao: "Paradigma D2 + 5-HT2A. Menor EPS que os típicos, mas com perfis metabólicos e sedativos distintos entre as moléculas.",
        mecanismo: "Antagonismo D2 + 5-HT2A (ratio alta). Bloqueio 5-HT2A em neurônios nigroestriatais desinibe DA → menos EPS. Perfis adicionais (H1, M1, α1) variam por molécula.",
        moleculas: ["Risperidona", "Paliperidona", "Olanzapina", "Quetiapina", "Ziprasidona", "Lurasidona", "Asenapina", "Amisulprida", "Sertindol"],
        indicacoes: ["Esquizofrenia", "Mania aguda e manutenção do TAB", "Depressão bipolar (quetiapina, lurasidona)", "Depressão unipolar adjuvante (quetiapina, aripiprazol, brexpiprazol)"],
        perfil: { ativacao: "variavel", risco_sexual: "variavel", risco_metabolico: "variavel", risco_qtc: "variavel", risco_eps: "moderado", prolactina: "neutro" },
        efeitos_adversos: ["Síndrome metabólica (olanzapina, clozapina — maior risco)", "Sedação (quetiapina, olanzapina)", "Hiperprolactinemia (risperidona, paliperidona, amisulprida)", "EPS dose-dependente (risperidona em doses altas)", "QTc (ziprasidona, sertindol)", "Hipotensão ortostática (quetiapina, risperidona)"],
        contraindicacoes: ["DCL (risperidona — alto risco de EPS grave e mortalidade aumentada)", "QTc prolongado (ziprasidona, sertindol)"],
        monitoramento: ["Peso, IMC, circunferência abdominal", "Glicemia em jejum e HbA1c", "Lipídios", "PA", "ECG (ziprasidona, sertindol)", "Prolactina se sintomas", "AIMS"],
        diferenciais: [
          "Olanzapina: maior risco metabólico; alta sedação; disponível IM para agitação",
          "Quetiapina: fast-off D2 (menor EPS/prolactina); alta afinidade H1 (sedação); NÃO usar como hipnótico isolado sem indicação psiquiátrica",
          "Risperidona/Paliperidona: maior prolactina entre os atípicos; EPS dose-dependente",
          "Ziprasidona: menor risco metabólico; tomar com alimento (>500 kcal); risco QTc",
          "Lurasidona: menor metabólico; pró-cognitivo (5-HT7); tomar com alimento ≥350 kcal; substrato CYP3A4",
          "Amisulprida: seletivo D2/D3; maior hiperprolactinemia; menor metabolismo CYP",
        ],
        nota_clinica: "Quetiapina como hipnótico isolado (sem indicação psiquiátrica) é prática inadequada que expõe o paciente a todos os riscos metabólicos sem o benefício terapêutico justificado.",
      },
      {
        id: "ap3g",
        nome: "3ª Geração (AP Dopaminérgicos)",
        nome_completo: "Agonistas Parciais Dopaminérgicos",
        classe_id: "antipsicoticos",
        descricao: "Estabilizadores dopaminérgicos: agonismo parcial D2/D3 — funcionam como antagonistas quando DA está elevada (psicose) e como agonistas quando DA está baixa (sintomas negativos/cognitivos).",
        mecanismo: "Agonismo parcial D2 e D3 + agonismo parcial 5-HT1A + antagonismo 5-HT2A. Sem bloqueio pleno D2 → menor EPS e prolactina.",
        moleculas: ["Aripiprazol", "Brexpiprazol", "Cariprazina"],
        indicacoes: ["Esquizofrenia", "Mania aguda e manutenção (TAB)", "Depressão bipolar (cariprazina — aprovação FDA)", "Depressão unipolar adjuvante (aripiprazol, brexpiprazol)", "Irritabilidade no TEA (aripiprazol)"],
        perfil: { ativacao: "ativador", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "baixo", prolactina: "reduz" },
        efeitos_adversos: ["Acatisia (principalmente aripiprazol e cariprazina)", "Ativação/insônia (aripiprazol)", "Náusea", "Cefaleia", "Ganho de peso moderado"],
        contraindicacoes: [],
        monitoramento: ["Acatisia (Escala de Barnes)", "Humor (ativação pode precipitar mania em TAB sem cobertura)"],
        diferenciais: [
          "Aripiprazol: mais ativador; útil para reduzir hiperprolactinemia de outros APs; LAI disponível",
          "Brexpiprazol: menos ativação/acatisia que aripiprazol; depressão adjuvante; TEPT",
          "Cariprazina: maior afinidade por D3 — diferencial para sintomas negativos e anedonia; aprovado para depressão bipolar",
        ],
        nota_clinica: "Aripiprazol adicionado a outros APs (ex: risperidona) pode reduzir hiperprolactinemia sem trocar o antipsicótico principal. Cariprazina tem meia-vida muito longa (didehidro-cariprazina ~1–3 semanas).",
      },
      {
        id: "clozapina",
        nome: "Clozapina",
        nome_completo: "Clozapina — Módulo Especial",
        classe_id: "antipsicoticos",
        descricao: "Antipsicótico com indicações exclusivas e monitoramento hematológico obrigatório. O mais eficaz para esquizofrenia resistente.",
        mecanismo: "D4 > D2 (baixa afinidade, fast-off) + 5-HT2A + 5-HT2C + M1 + M3 + H1 + α1 + sigma-1. Perfil receptor amplo = eficácia única + carga de EA elevada.",
        moleculas: ["Clozapina"],
        indicacoes: ["Esquizofrenia resistente ao tratamento (após 2+ APs adequados)", "Redução de suicidabilidade em esquizofrenia e TAB", "Agressividade resistente", "Psicose na doença de Parkinson (única AP sem agravar motricidade de forma significativa)"],
        perfil: { ativacao: "sedativo", risco_sexual: "baixo", risco_metabolico: "alto", risco_qtc: "moderado", risco_eps: "baixo", prolactina: "neutro" },
        efeitos_adversos: ["Neutropenia/agranulocitose (0,8% — obriga monitoramento hematológico)", "Miocardite/cardiomiopatia (primeiras 4–8 semanas)", "Constipação grave/íleo paralítico (potencialmente fatal — subestimado)", "Sialorreia (paradoxal — agonismo M4)", "Convulsões dose-dependentes (>600 mg/dia)", "Ganho de peso e síndrome metabólica intensa", "Sedação", "Hipotensão ortostática", "Taquicardia"],
        contraindicacoes: ["Histórico de agranulocitose por clozapina", "Mielossupressão grave ativa", "Epilepsia não controlada (relativo)", "Íleo paralítico ativo"],
        monitoramento: ["Hemograma: semanal nas primeiras 26 semanas; quinzenal até 1 ano; mensal após", "Clozapinemia (alvo 350–600 ng/mL)", "Glicemia, lipídios, peso, PA", "ECG e troponina (primeiros 30 dias — miocardite)", "Frequência de evacuações (constipação)"],
        nota_clinica: "INTERAÇÃO CRÍTICA: tabagismo induz CYP1A2 → ao PARAR de fumar, níveis de clozapina podem dobrar em dias → risco de convulsão e toxicidade. Monitorar clozapinemia e reduzir dose proativamente. Fluvoxamina inibe CYP1A2 → pode triplicar níveis.",
      },
      {
        id: "lai",
        nome: "LAI",
        nome_completo: "Antipsicóticos Injetáveis de Longa Ação",
        classe_id: "antipsicoticos",
        descricao: "Formulações depot que garantem adesão e fornecem farmacocinética previsível. Subestimados — deveriam ser considerados mais precocemente.",
        mecanismo: "Mesmo mecanismo do AP correspondente em formulação oral, liberado lentamente do depósito intramuscular ou subcutâneo.",
        moleculas: ["Haloperidol decanoato", "Flufenazina decanoato", "Zuclopentixol decanoato", "Risperidona LAI", "Paliperidona palmitato (mensal, trimestral, semestral)", "Aripiprazol monoidratado", "Olanzapina pamoato"],
        indicacoes: ["Baixa adesão ao tratamento oral", "Preferência do paciente", "Primeiro episódio (prevenção de recaída)", "Recaídas frequentes relacionadas à não adesão"],
        perfil: { ativacao: "variavel", risco_sexual: "variavel", risco_metabolico: "variavel", risco_qtc: "variavel", risco_eps: "variavel", prolactina: "neutro" },
        efeitos_adversos: ["Dor no local de injeção", "Síndrome pós-injeção (olanzapina pamoato — sedação intensa, desorientação — 0,07%)", "EA do AP correspondente (sem picos)"],
        contraindicacoes: ["Recusa do paciente", "Alergia ao veículo"],
        monitoramento: ["Local de injeção (abscessos)", "Olanzapina pamoato: observação por 3h pós-injeção (síndrome pós-injeção)"],
        diferenciais: [
          "Paliperidona trimestral/semestral: máxima conveniência — injeção a cada 3–6 meses",
          "Aripiprazol LAI: menor EPS/prolactina/metabólico; requer sobreposição oral por 2 semanas",
          "Olanzapina pamoato: observação obrigatória de 3h após cada injeção (síndrome pós-injeção)",
          "Risperidona SC: injeção subcutânea quinzenal — menor volume e menor dor",
        ],
        nota_clinica: "A cada recaída na esquizofrenia há perda neurobiológica acumulativa. LAI deveria ser considerado após o primeiro episódio ou na primeira evidência de não adesão, não apenas como último recurso.",
      },
    ],
  },

  // ── D. ANSIOLÍTICOS E HIPNÓTICOS ─────────────────────────────────────────
  {
    id: "ansioliticos-hipnoticos",
    nome: "Ansiolíticos e Hipnóticos",
    descricao: "Fármacos para controle de ansiedade aguda e crônica, insônia e sedação. Perfis de segurança e dependência muito distintos entre as subclasses.",
    gradiente: "from-yellow-500 to-amber-600",
    subclasses: [
      {
        id: "bzd",
        nome: "Benzodiazepínicos",
        nome_completo: "Benzodiazepínicos",
        classe_id: "ansioliticos-hipnoticos",
        descricao: "Moduladores alostéricos positivos do GABA-A. Eficazes para uso agudo e de curto prazo; uso crônico cria dependência.",
        mecanismo: "Ligam-se ao sítio BZD da subunidade γ do receptor GABA-A → aumentam frequência de abertura do canal de Cl⁻ → hiperpolarização neuronal.",
        moleculas: ["Clonazepam", "Diazepam", "Alprazolam", "Lorazepam", "Bromazepam", "Midazolam", "Clobazam"],
        indicacoes: ["Ansiedade aguda", "Catatonia (lorazepam IM/EV)", "Agitação psicomotora", "Abstinência alcoólica (CIWA-Ar)", "Insônia de curto prazo", "Epilepsia (clonazepam, clobazam)", "Procedimentos (midazolam)"],
        perfil: { ativacao: "sedativo", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Sedação e comprometimento cognitivo", "Dependência física e psicológica", "Tolerância", "Amnésia anterógrada", "Quedas e fraturas em idosos", "Delirium (idosos)", "Depressão respiratória (com álcool/opioides)", "Síndrome de abstinência grave (convulsões, delirium)"],
        contraindicacoes: ["Apneia do sono grave não tratada", "DPOC grave", "Histórico de dependência (relativo)", "Miastenia gravis", "Gestação (primeiro trimestre — relativo)"],
        monitoramento: ["Sinais de dependência e tolerância", "Função cognitiva (especialmente idosos)", "Doses crescentes sem indicação clínica"],
        diferenciais: [
          "Meia-vida longa (diazepam, clonazepam): menor risco de retirada abrupta; maior acúmulo em idosos",
          "Meia-vida curta (alprazolam, lorazepam): mais retirada entre doses; maior potencial de dependência",
          "Lorazepam: preferido em hepatopatas (glucuronidação direta, sem metabolismo hepático complexo)",
          "Clonazepam: meia-vida longa; preferido para ansiedade crônica e pânico (evitar alprazolam)",
        ],
        nota_clinica: "Retirada de BZD: NUNCA abrupta após uso crônico (risco de convulsão grave). Protocolo: redução de 10–25% a cada 2 semanas. Em uso prolongado, conversão para diazepam (meia-vida longa) antes da retirada facilita o processo.",
      },
      {
        id: "zdrugs",
        nome: "Z-drugs",
        nome_completo: "Hipnóticos Não-Benzodiazepínicos (Z-drugs)",
        classe_id: "ansioliticos-hipnoticos",
        descricao: "Seletivos para subunidade α1 do GABA-A. Mais hipnóticos que ansiolíticos. Perfil de segurança distinto dos BZD, mas com riscos próprios.",
        mecanismo: "Moduladores alostéricos positivos do GABA-A com seletividade para subunidade α1 → sedação e hipnose com menor efeito ansiolítico e miorrelaxante.",
        moleculas: ["Zolpidem", "Zopiclona", "Eszopiclona"],
        indicacoes: ["Insônia (dificuldade de início do sono — zolpidem; manutenção do sono — eszopiclona)", "Uso de curto prazo"],
        perfil: { ativacao: "sedativo", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Comportamentos complexos do sono (sonambulismo, condução, alimentação — sem memória do evento)", "Amnésia anterógrada", "Sonolência residual (especialmente zolpidem de liberação prolongada)", "Dependência", "Quedas noturnas"],
        contraindicacoes: ["Apneia do sono grave", "Histórico de sonambulismo grave", "Gravidez"],
        monitoramento: ["Comportamentos complexos do sono (interrogar ativamente)", "Sonolência residual diurna"],
        nota_clinica: "FDA reduziu dose recomendada do zolpidem em mulheres (5 mg IR, 6,25 mg CR) por clearance mais lento. Evitar em idosos (Beers). Historicamente subestimado o potencial de dependência.",
      },
      {
        id: "buspirona",
        nome: "Buspirona",
        nome_completo: "Buspirona",
        classe_id: "ansioliticos-hipnoticos",
        descricao: "Ansiolítico não-sedativo e sem dependência. Eficaz apenas para TAG com uso contínuo.",
        mecanismo: "Agonismo parcial 5-HT1A (pré e pós-sináptico) → reduz disparo serotoninérgico gradualmente → efeito ansiolítico após 2–4 semanas.",
        moleculas: ["Buspirona"],
        indicacoes: ["TAG (uso contínuo)", "Ansiedade comórbida à depressão (adjuvante a ISRS)"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Tontura", "Cefaleia", "Náusea", "Nervosismo inicial"],
        contraindicacoes: ["IMAOs"],
        monitoramento: [],
        nota_clinica: "Não funciona para crise aguda de ansiedade (início lento de 2–4 semanas). Sem efeito em pânico. Sem tolerância cruzada com BZD — pacientes dependentes de BZD não se beneficiam da troca imediata.",
      },
      {
        id: "orexina-antagonistas",
        nome: "Antagonistas de Orexina",
        nome_completo: "Antagonistas Duais de Receptores de Orexina (DORAs)",
        classe_id: "ansioliticos-hipnoticos",
        descricao: "Nova classe de hipnóticos que bloqueiam o sistema de promoção da vigília sem suprimir a arquitetura do sono como os BZD.",
        mecanismo: "Bloqueio dos receptores OX1 e OX2 (orexina/hipocretina) → remove a promoção ativa da vigília → sono fisiológico preservando REM e SWS.",
        moleculas: ["Suvorexanto", "Lemborexanto", "Daridorexanto"],
        indicacoes: ["Insônia (dificuldade de início e/ou manutenção do sono)"],
        perfil: { ativacao: "sedativo", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Sonolência residual", "Cefaleia", "Sonhos vívidos (raramente perturbadores)", "Paralisia do sono (raro)"],
        contraindicacoes: ["Narcolepsia (pela dependência de orexina)", "Inibidores potentes de CYP3A4 (substrato)"],
        monitoramento: ["Sonolência residual diurna"],
        nota_clinica: "Diferencial importante vs BZD/Z-drugs: preservam arquitetura normal do sono (REM e SWS), sem amnésia anterógrada significativa, menor dependência e sem comportamentos complexos do sono.",
      },
    ],
  },

  // ── E. TDAH ───────────────────────────────────────────────────────────────
  {
    id: "tdah",
    nome: "TDAH / Estimulantes",
    descricao: "Fármacos estimulantes e não-estimulantes para TDAH. Aumentam dopamina e noradrenalina no CPF, melhorando atenção, controle inibitório e memória de trabalho.",
    gradiente: "from-pink-500 to-rose-600",
    subclasses: [
      {
        id: "estimulantes",
        nome: "Estimulantes",
        nome_completo: "Estimulantes do SNC para TDAH",
        classe_id: "tdah",
        descricao: "Primeira linha para TDAH. Atuam em DAT e NET elevando dopamina e noradrenalina no CPF.",
        mecanismo: "Metilfenidato: inibe DAT e NET (sem liberar monoaminas ativamente). Anfetaminas: inibem DAT/NET + promovem liberação ativa de DA e NA (mais potente).",
        moleculas: ["Metilfenidato IR", "Metilfenidato ER/OROS", "Lisdexanfetamina", "Dextroanfetamina"],
        indicacoes: ["TDAH em crianças, adolescentes e adultos", "Narcolepsia (anfetaminas)", "Hipersonia residual (off-label)"],
        perfil: { ativacao: "ativador", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Anorexia e perda de peso", "Insônia (tomar até 14h)", "Aumento de FC e PA", "Cefaleia", "Irritabilidade ao fim do efeito (rebound)", "Psicose ou mania em vulneráveis", "Tiques (relativo — pode não piorar)"],
        contraindicacoes: ["Cardiopatia estrutural grave", "Hipertensão não controlada", "Psicose ativa não tratada", "Hipertireoidismo", "TAB sem estabilizador (relativo)"],
        monitoramento: ["PA e FC a cada visita", "Peso e altura em crianças", "ECG basal se história cardíaca ou familiar", "Humor (virada maníaca, psicose)", "Apetite e sono"],
        diferenciais: [
          "Metilfenidato OROS: liberação controlada osmótica — menor pico, menor potencial de abuso; 12h de duração",
          "Lisdexanfetamina: pró-fármaco ativado pela hidrólise intestinal — menor potencial de abuso por início mais lento",
          "Metilfenidato IR: início rápido (30 min); duração 3–5h; rebound mais pronunciado",
        ],
        nota_clinica: "Em TDAH com TAB: estabilizador primeiro, estimulante depois (e com cautela). Em TDAH com ansiedade: preferir não-estimulante ou combinar com cuidado. Risco de abuso é real — preferir formulações de longa ação.",
      },
      {
        id: "nao-estimulantes-tdah",
        nome: "Não-Estimulantes",
        nome_completo: "Não-Estimulantes para TDAH",
        classe_id: "tdah",
        descricao: "Alternativas sem potencial de abuso para TDAH. Indicados quando há contraindicações a estimulantes, preferência do paciente ou comorbidades específicas.",
        mecanismo: "Atomoxetina: inibidor seletivo de NET → ↑NA e DA no CPF. Guanfacina/Clonidina: agonistas α2A no CPF → melhoram atenção e controle inibitório.",
        moleculas: ["Atomoxetina", "Guanfacina", "Clonidina", "Bupropiona (off-label)"],
        indicacoes: ["TDAH com ansiedade comórbida", "TDAH com TAB", "TDAH com dependência química", "TDAH com tiques (guanfacina, clonidina)", "Preferência por não-estimulante", "TEPT com hiperalerta (guanfacina)"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Atomoxetina: náusea, sonolência, PA/FC, hepatotoxicidade (raro), ideação suicida (adolescentes — black box)", "Guanfacina: sedação, hipotensão, bradicardia", "Clonidina: sedação intensa, hipotensão, não retirar abruptamente (rebound hipertensivo)"],
        contraindicacoes: ["Atomoxetina + IMAOs", "Guanfacina + hipotensão grave"],
        monitoramento: ["Atomoxetina: PA/FC, LFTs, crescimento em crianças, humor", "Guanfacina/Clonidina: PA e FC"],
        nota_clinica: "Atomoxetina tem início de ação lento (4–6 semanas para efeito pleno). Guanfacina ER (XR) tem menos sedação que clonidina e maior seletividade α2A — melhor perfil para TDAH. Clonidina de ação curta NÃO retirar abruptamente.",
      },
    ],
  },

  // ── F. DEPENDÊNCIA ────────────────────────────────────────────────────────
  {
    id: "dependencia",
    nome: "Dependência Química",
    descricao: "Farmacoterapia adjuvante ao tratamento psicossocial para transtornos por uso de substâncias.",
    gradiente: "from-red-600 to-rose-700",
    subclasses: [
      {
        id: "alcool-farm",
        nome: "Álcool",
        nome_completo: "Farmacoterapia para Transtorno por Uso de Álcool",
        classe_id: "dependencia",
        descricao: "Fármacos para redução do consumo, manutenção da abstinência e tratamento da abstinência aguda.",
        mecanismo: "Naltrexona: antagonismo mu-opioide → reduz reforço positivo e fissura. Acamprosato: modula glutamato/GABA → reduz desconforto da abstinência prolongada. Dissulfiram: inibe aldeído desidrogenase → reação aversiva ao álcool.",
        moleculas: ["Naltrexona", "Acamprosato", "Dissulfiram", "Topiramato (off-label)", "Diazepam/Lorazepam (abstinência aguda)"],
        indicacoes: ["Redução do consumo de álcool (naltrexona, acamprosato)", "Manutenção da abstinência (dissulfiram — motivado)", "Abstinência aguda (BZD — CIWA-Ar)", "Prevenção de recaída"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Naltrexona: náusea, hepatotoxicidade em doses altas (contra-indicada em hepatite ativa)", "Acamprosato: diarreia (ajustar renal)", "Dissulfiram: reação dissulfiram-álcool (flush, taquicardia, náusea, hipotensão)"],
        contraindicacoes: ["Naltrexona: uso atual de opioides (precipita abstinência), hepatite grave", "Dissulfiram: cardiopatia grave, psicose ativa, gravidez"],
        monitoramento: ["Naltrexona: TGO/TGP antes e durante", "Acamprosato: função renal (excreção renal)", "Dissulfiram: adesão e motivação"],
        nota_clinica: "BZD para abstinência alcoólica aguda: protocolo CIWA-Ar — diazepam VO (preferido por meia-vida longa) ou lorazepam em hepatopatas. Não prolongar BZD além da abstinência aguda (5–7 dias).",
      },
      {
        id: "opioides-farm",
        nome: "Opioides",
        nome_completo: "Farmacoterapia para Transtorno por Uso de Opioides",
        classe_id: "dependencia",
        descricao: "Tratamento de substituição e redução de danos para dependência de opioides.",
        mecanismo: "Metadona: agonista pleno mu (longa meia-vida). Buprenorfina: agonista parcial mu + antagonista kappa (menor overdose). Naltrexona: antagonismo mu (bloqueio do efeito). Naloxona: antagonismo mu de curta ação (reversão de overdose).",
        moleculas: ["Metadona", "Buprenorfina/Naloxona (Suboxone)", "Naltrexona", "Naloxona"],
        indicacoes: ["Tratamento de substituição (metadona, buprenorfina/naloxona)", "Prevenção de recaída (naltrexona)", "Reversão de overdose (naloxona)"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "moderado", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Metadona: QTc prolongado (ECG obrigatório), sedação, constipação, interações CYP", "Buprenorfina: precipitação de abstinência se tomada com opioides ativos", "Naltrexona: precipita abstinência imediata se opioides em uso — exige abstinência de 7–10 dias"],
        contraindicacoes: ["Naltrexona: opioides em uso atual", "Metadona: QTc >500 ms"],
        monitoramento: ["Metadona: ECG (QTc)", "Buprenorfina: adesão (urina)", "Naltrexona: LFTs"],
        nota_clinica: "Buprenorfina/naloxona: a naloxona oral tem biodisponibilidade mínima e só age se injetada (evita abuso IV). Naloxona intranasal/IM: distribuição a pacientes e familiares é estratégia de redução de danos validada.",
      },
      {
        id: "tabagismo-farm",
        nome: "Tabagismo",
        nome_completo: "Farmacoterapia para Cessação Tabágica",
        classe_id: "dependencia",
        descricao: "Combinação de terapias de reposição de nicotina, vareniclina e bupropiona para cessação tabágica.",
        mecanismo: "Vareniclina: agonismo parcial α4β2 → reduz fissura + bloqueia reforço da nicotina. TRN: nicotina exógena sem os carcinógenos → redução gradual. Bupropiona: DAT/NET + antagonismo nAChR.",
        moleculas: ["Vareniclina", "Adesivo de nicotina", "Goma/pastilha de nicotina", "Bupropiona"],
        indicacoes: ["Cessação tabágica"],
        perfil: { ativacao: "variavel", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Vareniclina: náusea (tomar com alimento), sonhos vívidos, cefaleia; revisão FDA 2016 suavizou alertas neuropsiquiátricos", "Bupropiona: insônia, boca seca, risco de convulsão"],
        contraindicacoes: ["Bupropiona: epilepsia, transtornos alimentares", "Vareniclina: insuficiência renal grave (ajuste)"],
        monitoramento: ["Humor e sintomas neuropsiquiátricos (vareniclina — monitorar ativamente em pacientes com TAB ou psicose)"],
        nota_clinica: "Vareniclina é a farmacoterapia mais eficaz para cessação tabágica (OR ~3 vs placebo). Combinação TRN longa ação (adesivo) + curta ação (goma/pastilha) é mais eficaz que monoterapia. Parar de fumar durante uso de clozapina: ↑níveis de clozapina (CYP1A2) — monitorar.",
      },
    ],
  },

  // ── G. COGNITIVOS / DEMÊNCIA ──────────────────────────────────────────────
  {
    id: "cognitivos",
    nome: "Cognitivos / Demência",
    descricao: "Fármacos para tratamento sintomático de demências e distúrbios do sono/vigília.",
    gradiente: "from-teal-500 to-cyan-600",
    subclasses: [
      {
        id: "achei",
        nome: "Inibidores de AChE",
        nome_completo: "Inibidores da Acetilcolinesterase",
        classe_id: "cognitivos",
        descricao: "Tratamento sintomático de demências colinérgicas. Aumentam ACh sináptica por inibição da enzima de degradação.",
        mecanismo: "Inibição da acetilcolinesterase (AChE) → ↑ ACh na fenda sináptica → compensação parcial da disfunção colinérgica.",
        moleculas: ["Donepezila", "Rivastigmina", "Galantamina"],
        indicacoes: ["Doença de Alzheimer (leve a grave)", "Demência com Corpos de Lewy (DCL) — rivastigmina", "Demência da Doença de Parkinson (DDP) — rivastigmina", "Alzheimer com alucinações"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Náusea e vômito (início, especialmente rivastigmina oral)", "Diarreia", "Bradicardia e síncope (interação com betabloqueadores)", "Sonhos vívidos e pesadelos", "Anorexia e perda de peso", "Cãibras"],
        contraindicacoes: ["Bradicardia significativa não tratada", "Bloqueio AV de segundo ou terceiro grau"],
        monitoramento: ["FC (bradicardia)", "Peso", "Sintomas GI nas primeiras semanas"],
        diferenciais: [
          "Donepezila: 1x/dia; disponível para todos os estágios (5 mg leve-mod; 10 mg moderado-grave; 23 mg grave); menor EA GI",
          "Rivastigmina: inibe AChE + BuChE; patch transdérmico minimiza EA GI; ÚNICA aprovada para DCL e DDP",
          "Galantamina: inibe AChE + modula nAChR (α7); ER 1x/dia",
        ],
        nota_clinica: "Benefício sintomático modesto mas clinicamente significativo (3–4 pontos no ADAS-Cog). Não modifica a progressão da doença. Em DCL: AChEI são essenciais — antipsicóticos típicos são perigosos (hipersensibilidade grave).",
      },
      {
        id: "memantina",
        nome: "Memantina",
        nome_completo: "Memantina",
        classe_id: "cognitivos",
        descricao: "Antagonista NMDA de baixa afinidade. Reduz excitotoxicidade glutamatérgica na demência moderada a grave.",
        mecanismo: "Bloqueio de baixa afinidade e voltagem-dependente dos receptores NMDA → reduz ativação tônica excessiva sem comprometer a LTP fisiológica.",
        moleculas: ["Memantina"],
        indicacoes: ["Alzheimer moderado a grave", "Combinação com donepezila (moderado-grave)", "Possível benefício em agitação em demência"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Tontura", "Cefaleia", "Constipação", "Sonolência", "Confusão leve (doses altas)"],
        contraindicacoes: ["Insuficiência renal grave (ajuste de dose necessário)"],
        monitoramento: ["Função renal (excreção renal)"],
        nota_clinica: "Combinação memantina + donepezila tem maior evidência de eficácia em Alzheimer moderado-grave do que monoterapia. Titulação: iniciar 5 mg/dia, aumentar 5 mg/semana até 20 mg/dia.",
      },
    ],
  },

  // ── H. MANEJO DE EA ───────────────────────────────────────────────────────
  {
    id: "manejo-ea",
    nome: "Manejo de Efeitos Adversos",
    descricao: "Fármacos usados especificamente para tratar efeitos adversos neurológicos de antipsicóticos e outros psicofármacos.",
    gradiente: "from-slate-500 to-gray-600",
    subclasses: [
      {
        id: "anticolin-eps",
        nome: "Anticolinérgicos (EPS)",
        nome_completo: "Anticolinérgicos para Sintomas Extrapiramidais",
        classe_id: "manejo-ea",
        descricao: "Usados para tratar parkinsonismo induzido por antipsicóticos e distonia aguda. NÃO indicados para uso profilático rotineiro.",
        mecanismo: "Bloqueio de receptores muscarínicos M1 no estriado → restaura equilíbrio DA/ACh perturbado pelo bloqueio D2.",
        moleculas: ["Biperideno", "Benzatropina", "Triexifenidil"],
        indicacoes: ["Distonia aguda (emergência — biperideno IM)", "Parkinsonismo induzido por AP", "NÃO para acatisia isolada"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Boca seca", "Constipação", "Retenção urinária", "Visão turva", "Confusão e delirium (idosos)", "Piora cognitiva", "Taquicardia"],
        contraindicacoes: ["Glaucoma de ângulo fechado", "Hiperplasia prostática com retenção", "Demência (alto risco de delirium)"],
        monitoramento: ["Sinais anticolinérgicos", "Função cognitiva"],
        nota_clinica: "Anticolinérgicos NÃO são eficazes para acatisia (para isso: propranolol, BZD, redução de dose ou troca de AP). Uso prolongado de anticolinérgicos está associado a maior risco de demência — evitar uso crônico.",
      },
      {
        id: "discinesia-tardia-farm",
        nome: "Discinesia Tardia",
        nome_completo: "Farmacoterapia para Discinesia Tardia",
        classe_id: "manejo-ea",
        descricao: "Inibidores VMAT2 são os únicos fármacos aprovados especificamente para discinesia tardia.",
        mecanismo: "Inibição do VMAT2 → depleta DA pré-sináptica nos terminais nigroestriatais → reduz hiperatividade dopaminérgica pós-sináptica (supersensibilidade D2).",
        moleculas: ["Valbenazina", "Deutetrabenazina", "Tetrabenazina"],
        indicacoes: ["Discinesia tardia (valbenazina e deutetrabenazina — aprovados FDA)", "Coreia de Huntington (deutetrabenazina, tetrabenazina)"],
        perfil: { ativacao: "neutro", risco_sexual: "baixo", risco_metabolico: "baixo", risco_qtc: "baixo", risco_eps: "na", prolactina: "neutro" },
        efeitos_adversos: ["Sonolência", "Acatisia paradoxal (raro)", "Depressão (tetrabenazina — maior risco)", "Parkinsonismo (tetrabenazina)"],
        contraindicacoes: ["Depressão grave não tratada (tetrabenazina — black box suicídio)", "Uso com IMAOs"],
        monitoramento: ["AIMS (Abnormal Involuntary Movement Scale) — basal e seguimento", "Humor (especialmente tetrabenazina)", "Sinais de parkinsonismo"],
        diferenciais: [
          "Valbenazina: 1x/dia; melhor perfil de EA que tetrabenazina; sem aumento de depressão",
          "Deutetrabenazina: formulação deuterada (meia-vida mais longa); 2x/dia; menos EA que tetrabenazina",
          "Tetrabenazina: mais antigo; maior risco de depressão e parkinsonismo; substrato CYP2D6",
        ],
        nota_clinica: "Avaliar DT com AIMS a cada 6–12 meses em todos os pacientes em uso prolongado de AP. DT pode persistir ou piorar mesmo após retirada do AP. Clozapina pode melhorar DT como alternativa em pacientes que precisam continuar AP.",
      },
    ],
  },
];

// Helpers
export function getSubclasse(id: string): SubclasseFarmacologica | undefined {
  for (const classe of classes) {
    const sub = classe.subclasses.find((s) => s.id === id);
    if (sub) return sub;
  }
  return undefined;
}

export function getClasse(id: string): ClasseFarmacologica | undefined {
  return classes.find((c) => c.id === id);
}

export function getClasseDaSubclasse(subclasseId: string): ClasseFarmacologica | undefined {
  return classes.find((c) => c.subclasses.some((s) => s.id === subclasseId));
}

export const nivelRiscoLabel: Record<NivelRisco, string> = {
  alto: "Alto",
  moderado: "Moderado",
  baixo: "Baixo",
  variavel: "Variável",
  na: "N/A",
};

export const nivelRiscoColor: Record<NivelRisco, string> = {
  alto:     "bg-red-500/10 text-red-700 border-red-500/20",
  moderado: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  baixo:    "bg-green-500/10 text-green-700 border-green-500/20",
  variavel: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  na:       "bg-muted text-muted-foreground border-border",
};

export const ativacaoLabel: Record<PerfilAtivacao, string> = {
  ativador: "Ativador",
  sedativo: "Sedativo",
  neutro:   "Neutro",
  variavel: "Variável",
};

export const ativacaoColor: Record<PerfilAtivacao, string> = {
  ativador: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  sedativo: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  neutro:   "bg-gray-500/10 text-gray-700 border-gray-500/20",
  variavel: "bg-purple-500/10 text-purple-700 border-purple-500/20",
};
