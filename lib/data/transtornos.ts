export interface LinhasTerapeuticas {
  linha: "1ª linha" | "2ª linha" | "3ª linha" | "Adjuvante" | "Potencialização" | "Alternativa";
  farmaco: string;
  notas?: string;
}

export interface PassoAlgoritmo {
  passo: number;
  titulo: string;
  descricao: string;
  duracao?: string;
}

export interface Transtorno {
  id: string;
  nome: string;
  nome_curto: string;
  descricao: string;
  gradiente: string;
  prevalencia?: string;
  linhas_terapeuticas: LinhasTerapeuticas[];
  algoritmo: PassoAlgoritmo[];
  pearls: string[];
  armadilhas: string[];
  nota_especial?: string;
}

export const transtornos: Transtorno[] = [
  {
    id: "depressao-maior",
    nome: "Transtorno Depressivo Maior",
    nome_curto: "TDM",
    descricao: "Episódios depressivos com humor deprimido ou anedonia por ≥2 semanas + ≥4 sintomas neurovegetativos. Tratamento escalonado: ISRS → augmentação → potencialização → ECT.",
    gradiente: "from-blue-500 to-indigo-600",
    prevalencia: "~7% anual",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Sertralina", notas: "Melhor perfil de segurança geral, referência em gestação" },
      { linha: "1ª linha", farmaco: "Escitalopram", notas: "Melhor tolerabilidade entre ISRS, 1 comprimido/dia" },
      { linha: "1ª linha", farmaco: "Fluoxetina", notas: "Meia-vida longa — menor síndrome de retirada; mais ativador" },
      { linha: "1ª linha", farmaco: "Venlafaxina XR", notas: "Quando dor crônica ou ansiedade comórbida é proeminente" },
      { linha: "1ª linha", farmaco: "Duloxetina", notas: "Dor neuropática comórbida; aprovada para fibromialgia" },
      { linha: "2ª linha", farmaco: "Bupropiona", notas: "Disfunção sexual prévia, fadiga, cessação tabágica concomitante" },
      { linha: "2ª linha", farmaco: "Mirtazapina", notas: "Insônia, hiporexia, perda de peso; início de ação mais rápido" },
      { linha: "2ª linha", farmaco: "Vortioxetina", notas: "Déficit cognitivo em primeiro plano; menor disfunção sexual" },
      { linha: "Potencialização", farmaco: "Aripiprazol", notas: "Augmentação de antidepressivo; FDA aprovado" },
      { linha: "Potencialização", farmaco: "Quetiapina XR", notas: "Insônia comórbida e augmentação; sedação útil" },
      { linha: "Potencialização", farmaco: "Lítio", notas: "Augmentação clássica; antisuicida; monitorar litemia" },
      { linha: "3ª linha", farmaco: "Esketamina intranasal", notas: "Depressão resistente (≥2 falhas) ou suicidabilidade aguda" },
      { linha: "3ª linha", farmaco: "Clomipramina", notas: "ATC potente — 2ª linha por segurança; útil em TOC comórbido" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Diagnóstico e estratificação", descricao: "Confirmar TDM (PHQ-9 ≥10), excluir bipolaridade, avaliar suicidabilidade (C-SSRS), comorbidades clínicas e preferências do paciente.", duracao: "Consulta inicial" },
      { passo: 2, titulo: "Iniciar 1ª linha", descricao: "ISRS em dose inicial baixa, titular em 1–2 semanas. Psicoeducação sobre latência de 2–4 semanas e síndrome de retirada.", duracao: "0–4 semanas" },
      { passo: 3, titulo: "Avaliar resposta", descricao: "Se resposta parcial (>25% de melhora no PHQ-9): otimizar dose (dose-dependente para venlafaxina, menos para ISRS). Se sem resposta após 4–6 semanas em dose adequada: troca.", duracao: "4–8 semanas" },
      { passo: 4, titulo: "Trocar ou augmentar", descricao: "Troca: outro ISRS ou IRSN. Augmentação: adicionar aripiprazol, quetiapina, ou lítio. Considerar vortioxetina se cognição for foco.", duracao: "8–12 semanas" },
      { passo: 5, titulo: "Depressão resistente", descricao: "≥2 ensaios adequados sem resposta: encaminhar para avaliação de ECT ou iniciar esketamina. Reavaliação diagnóstica (excluir TAB, hipotireoidismo, substâncias).", duracao: "3+ meses" },
      { passo: 6, titulo: "Manutenção", descricao: "1º episódio: 6–12 meses após remissão. 2º episódio: 2 anos. ≥3 episódios ou episódio grave: considerar manutenção indefinida.", duracao: "6 meses – indefinido" },
    ],
    pearls: [
      "Latência de resposta é de 2–4 semanas — não trocar antes desse período sem motivo claro (exceto intolerância grave)",
      "Risco de virada maníaca em bipolar não diagnosticado: sempre questionar sobre episódios maníacos/hipomaníacos antes de iniciar antidepressivo",
      "PHQ-9 ao longo do tempo é mais informativo do que impressão clínica subjetiva para medir resposta",
      "Lítio como augmentação tem 30–50% de resposta adicional em não respondedores a antidepressivos",
      "Esketamina pode mostrar efeito em horas — considerá-la quando há risco suicida agudo",
    ],
    armadilhas: [
      "Não confundir TDM com depressão bipolar — ISRS sem estabilizador pode precipitar virada maníaca ou ciclagem rápida",
      "Não suspender antidepressivo abruptamente — síndrome de retirada (FINISH) pode ser debilitante",
      "Paroxetina deve ser evitada na gestação (relativo — risco cardíaco fetal baixo mas presente)",
      "Augmentação com quetiapina como hipnótico sem indicação psiquiátrica = prática inadequada",
      "Alprazolam NÃO é antidepressivo — uso crônico para TDM é contraindicado",
    ],
    nota_especial: "Em pacientes jovens (<25 anos): monitorar intensamente nas primeiras 4 semanas por aumento paradoxal de ideação suicida (FDA black box). Isso não contraindica o uso — o risco de não tratar é maior.",
  },

  {
    id: "transtorno-bipolar",
    nome: "Transtorno Bipolar",
    nome_curto: "TAB",
    descricao: "Transtorno do humor com episódios maníacos, hipomaníacos e depressivos. Tratamento difere radicalmente conforme a fase: mania aguda, depressão bipolar ou manutenção.",
    gradiente: "from-amber-500 to-orange-600",
    prevalencia: "~2,4% (TAB I + II)",
    linhas_terapeuticas: [
      // Mania aguda
      { linha: "1ª linha", farmaco: "Lítio", notas: "Mania aguda moderada; iniciar concomitante a AP se agitação" },
      { linha: "1ª linha", farmaco: "Valproato", notas: "Mania aguda, estados mistos, ciclagem rápida; ação mais rápida que lítio" },
      { linha: "1ª linha", farmaco: "Olanzapina", notas: "Mania aguda + psicose; sedação útil na agitação" },
      { linha: "1ª linha", farmaco: "Quetiapina", notas: "Mania aguda e depressão bipolar; versatilidade" },
      // Depressão bipolar
      { linha: "1ª linha", farmaco: "Quetiapina", notas: "Depressão bipolar com melhor evidência (FDA aprovado)" },
      { linha: "1ª linha", farmaco: "Lurasidona + lítio/valproato", notas: "Depressão bipolar; perfil metabólico favorável" },
      { linha: "1ª linha", farmaco: "Cariprazina", notas: "Depressão bipolar (FDA aprovado 2015)" },
      { linha: "1ª linha", farmaco: "Lamotrigina", notas: "Prevenção de depressão bipolar — NÃO para fase aguda" },
      // Manutenção
      { linha: "1ª linha", farmaco: "Lítio", notas: "Manutenção — melhor evidência global; antisuicida" },
      { linha: "1ª linha", farmaco: "Lamotrigina", notas: "Manutenção — superior para prevenção de depressão" },
      { linha: "Adjuvante", farmaco: "Aripiprazol LAI", notas: "Manutenção com histórico de não adesão" },
      { linha: "Alternativa", farmaco: "Antidepressivos (ISRS)", notas: "Uso controverso — apenas com estabilizador, depressão aguda, curto prazo" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Determinar fase atual", descricao: "Mania (YMRS), depressão bipolar (MDQ+PHQ-9), hipomaníaco, misto, eutímico. Fase determina completamente a estratégia.", duracao: "Consulta inicial" },
      { passo: 2, titulo: "Mania aguda", descricao: "Iniciar estabilizador (lítio ou valproato) + antipsicótico se psicose ou agitação intensa. Remover antidepressivos se em uso.", duracao: "0–2 semanas" },
      { passo: 3, titulo: "Depressão bipolar", descricao: "Quetiapina, lurasidona ou cariprazina — NÃO iniciar ISRS sem estabilizador. Lamotrigina para prevenção. Excluir hipotireoidismo.", duracao: "4–8 semanas" },
      { passo: 4, titulo: "Manutenção", descricao: "Lítio para todos, se tolerado. Adicionar lamotrigina se polo depressivo predominante. Otimizar adesão — considerar LAI.", duracao: "Indefinido" },
    ],
    pearls: [
      "Lamotrigina não trata mania aguda — é para prevenção de depressão bipolar em manutenção",
      "Antidepressivos sem estabilizador no TAB podem precipitar virada maníaca e ciclagem rápida",
      "Lítio é o único fármaco com evidência antisuicida robusta — manter mesmo quando paciente questiona",
      "Valproato é TERATOGÊNICO — documentar e discutir contracepção dupla em todas as mulheres em idade fértil",
      "Depressão bipolar responde menos a antidepressivos do que depressão unipolar — não escalar antidepressivos indefinidamente",
    ],
    armadilhas: [
      "Iniciar ISRS sem estabilizador no TAB pode desencadear episódio maníaco grave",
      "Confundir TAB II com TDM é comum — sempre questionar episódios hipomaníacos",
      "Valproato em mulheres jovens sem contracepção adequada: risco de malformações congênitas severas",
      "Quetiapina como hipnótico sem indicação = prática inadequada que cria dependência",
      "Carbamazepina autoinduz enzimas — interações com anticoncepcional oral são clinicamente relevantes",
    ],
  },

  {
    id: "esquizofrenia",
    nome: "Esquizofrenia e Psicose",
    nome_curto: "Esquizofrenia",
    descricao: "Transtorno psicótico com sintomas positivos (alucinações, delírios), negativos (embotamento, alogia) e cognitivos. Tratamento com antipsicóticos — subclasse conforme perfil individual.",
    gradiente: "from-orange-500 to-red-600",
    prevalencia: "~1%",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Risperidona", notas: "2G — eficaz para sintomas positivos; LAI disponível; monitorar prolactina" },
      { linha: "1ª linha", farmaco: "Olanzapina", notas: "Alta eficácia; sedação útil em agitação; risco metabólico elevado" },
      { linha: "1ª linha", farmaco: "Quetiapina", notas: "Menor EPS e prolactina; depressão comórbida" },
      { linha: "1ª linha", farmaco: "Aripiprazol", notas: "3G — sem prolactina, menor metabólico; acatisia como EA principal" },
      { linha: "1ª linha", farmaco: "Cariprazina", notas: "3G — diferencial para sintomas negativos; D3 > D2" },
      { linha: "1ª linha", farmaco: "Paliperidona LAI", notas: "Mensal ou trimestral — primeira linha quando adesão é preocupação" },
      { linha: "3ª linha", farmaco: "Clozapina", notas: "≥2 APs sem resposta adequada (resistência) — o mais eficaz; monitoramento hematológico obrigatório" },
      { linha: "Adjuvante", farmaco: "Lítio / Valproato", notas: "Agitação crônica, impulsividade, suicidabilidade comórbida" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Primeiro episódio psicótico", descricao: "Iniciar com dose mínima eficaz de AP 2G. Psicoeducação. Risco de recaída é muito alto sem manutenção.", duracao: "0–8 semanas" },
      { passo: 2, titulo: "Avaliar resposta", descricao: "Sintomas positivos costumam responder em 4–6 semanas. Negativos e cognitivos são mais resistentes. Usar PANSS para acompanhamento.", duracao: "4–8 semanas" },
      { passo: 3, titulo: "Manutenção e adesão", descricao: "Primeiro episódio: tratar ≥2 anos. Múltiplos episódios: indefinido. Discutir LAI após primeiro episódio — não apenas na falha oral.", duracao: "2 anos – indefinido" },
      { passo: 4, titulo: "Esquizofrenia resistente", descricao: "Após falha de ≥2 APs (1 deles 2G) em dose e duração adequadas: indicar clozapina. Não adiar desnecessariamente.", duracao: "Após 2ª falha" },
    ],
    pearls: [
      "LAI deveria ser considerado após o primeiro episódio — cada recaída causa perda neurobiológica acumulativa",
      "Clozapina é o AP mais eficaz — resistência ao tratamento é indicação clara, não último recurso desesperado",
      "Sintomas negativos respondem melhor a AP 3G (aripiprazol, cariprazina) e psicossocial do que a AP típicos",
      "Psicose na DCL: clozapina ou quetiapina — AP típicos são contraindicados (risco de EPS grave e morte)",
      "Monitorar AIMS a cada 6–12 meses em todos os pacientes em AP crônico",
    ],
    armadilhas: [
      "Usar AP típico em DCL é potencialmente fatal — sensibilidade grave a EPS",
      "Não introduzir clozapina sem registro no programa de monitoramento hematológico",
      "Aumentar dose de AP em sintomas negativos — os negativos não são dose-responsivos da mesma forma que os positivos",
      "Tratar acatisia com anticolinérgico — acatisia responde a propranolol, BZD ou redução de dose",
      "Confundir akathisia com ansiedade e aumentar AP em vez de tratar o EA",
    ],
    nota_especial: "Parar de fumar durante clozapina: tabagismo induz CYP1A2 — cessação tabágica pode DOBRAR os níveis de clozapina em dias. Monitorar e reduzir dose proativamente.",
  },

  {
    id: "ansiedade",
    nome: "Transtornos de Ansiedade",
    nome_curto: "Ansiedade",
    descricao: "TAG, pânico, fobia social, agorafobia. ISRS e IRSN são primeira linha — BZD apenas para uso agudo e de curto prazo. TCC é adjuvante fundamental.",
    gradiente: "from-teal-500 to-cyan-600",
    prevalencia: "~18% anual (TAG ~3–5%)",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Escitalopram", notas: "TAG, pânico, fobia social — melhor tolerabilidade" },
      { linha: "1ª linha", farmaco: "Sertralina", notas: "TAG, pânico, fobia social, TEPT — versátil" },
      { linha: "1ª linha", farmaco: "Venlafaxina XR", notas: "TAG — efeito noradrenérgico adicional" },
      { linha: "1ª linha", farmaco: "Paroxetina", notas: "Pânico, fobia social — muito eficaz; mais EA e retirada difícil" },
      { linha: "2ª linha", farmaco: "Buspirona", notas: "TAG apenas (não pânico) — sem dependência; latência 2–4 semanas" },
      { linha: "2ª linha", farmaco: "Pregabalina", notas: "TAG — resposta em 1 semana; potencial de dependência" },
      { linha: "Adjuvante", farmaco: "Clonazepam", notas: "Ansiedade aguda ou ponte enquanto aguarda ISRS — curto prazo" },
      { linha: "Adjuvante", farmaco: "Propranolol", notas: "Ansiedade situacional/desempenho — sintomas autonômicos" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Diagnóstico diferencial", descricao: "Diferenciar TAG, pânico, fobia social, TEPT. Excluir causas clínicas (hipertireoidismo, feocromocitoma, arritmia). Avaliar uso de cafeína, álcool, substâncias.", duracao: "Inicial" },
      { passo: 2, titulo: "Iniciar ISRS ou IRSN", descricao: "Dose baixa inicial (ansiedade piora no início — ativação). Psicoeducação essencial. TCC deve ser ofertada concomitantemente.", duracao: "0–2 semanas" },
      { passo: 3, titulo: "Avaliar resposta", descricao: "GAD-7 de acompanhamento. Se parcial em 8 semanas: otimizar dose. Sem resposta: trocar classe ou adicionar buspirona.", duracao: "4–12 semanas" },
      { passo: 4, titulo: "Manutenção", descricao: "TAG e pânico: manutenção de 12 meses após remissão. Descontinuação gradual (10–25% a cada 2–4 semanas).", duracao: "12+ meses" },
    ],
    pearls: [
      "ISRS podem piorar ansiedade nas primeiras semanas — alertar o paciente e iniciar em dose baixa",
      "Pânico com agorafobia: exposição graduada (TCC) é tão importante quanto o farmacológico",
      "Buspirona não serve para crise aguda — tem latência de 2–4 semanas e não funciona em pânico",
      "BZD crônico em ansiedade: dependência ocorre em 4–6 semanas de uso diário — planejar saída desde o início",
      "Propranolol para ansiedade de desempenho é eficaz e não causa sedação cognitiva como os BZD",
    ],
    armadilhas: [
      "Usar BZD como primeira linha — dependência e tolerância surgem rapidamente",
      "Não alertar sobre ativação inicial dos ISRS — paciente abandona tratamento na semana 1",
      "Clonazepam crônico em ansiedade: cognitivo declina silenciosamente em idosos",
      "Alprazolam para ansiedade crônica: meia-vida curta = maior potencial de dependência e retirada mais difícil",
    ],
  },

  {
    id: "toc",
    nome: "TOC e Transtornos Relacionados",
    nome_curto: "TOC",
    descricao: "TOC requer ISRS em doses maiores do que para depressão (ex: fluoxetina 60–80 mg) por 8–12 semanas antes de considerar falha. Clomipramina e potencialização com AP 2G são alternativas.",
    gradiente: "from-violet-500 to-purple-600",
    prevalencia: "~2–3%",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Fluoxetina", notas: "60–80 mg — doses mais altas que em TDM; latência longa (10–12 sem)" },
      { linha: "1ª linha", farmaco: "Fluvoxamina", notas: "Mais estudada em TOC; agonista sigma-1 adicional" },
      { linha: "1ª linha", farmaco: "Sertralina", notas: "Boa tolerabilidade; doses até 200 mg/dia" },
      { linha: "1ª linha", farmaco: "Paroxetina", notas: "Eficaz; mais disfunção sexual e retirada difícil" },
      { linha: "2ª linha", farmaco: "Clomipramina", notas: "ATC mais serotonérgico — eficácia superior a ISRS em alguns estudos; mais EA" },
      { linha: "Potencialização", farmaco: "Aripiprazol", notas: "Adicionar a ISRS em resposta parcial — evidência sólida" },
      { linha: "Potencialização", farmaco: "Risperidona", notas: "Augmentação de ISRS — eficaz; monitorar prolactina" },
      { linha: "Adjuvante", farmaco: "TCC (ERP)", notas: "Exposição e prevenção de resposta — padrão ouro não farmacológico" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Confirmar diagnóstico e gravidade", descricao: "Y-BOCS basal. Diferenciar de TEPT, ansiedade social, hipocondria. Classificar subtipos (contaminação, simetria, intrusivos).", duracao: "Inicial" },
      { passo: 2, titulo: "ISRS em dose plena", descricao: "Iniciar dose baixa, escalar gradualmente até dose máxima tolerada (ex: fluoxetina 60–80 mg). Aguardar 10–12 semanas antes de concluir falha.", duracao: "8–12 semanas" },
      { passo: 3, titulo: "Augmentação ou troca", descricao: "Se resposta parcial: adicionar aripiprazol ou risperidona. Se falha: trocar para outro ISRS ou adicionar clomipramina.", duracao: "12–24 semanas" },
    ],
    pearls: [
      "TOC exige doses maiores de ISRS do que depressão — escalar até dose máxima antes de concluir falha",
      "Resposta é lenta — 10–12 semanas são necessárias; não trocar prematuramente",
      "ERP (Exposição e Prevenção de Resposta) é tão eficaz quanto ISRS — combinar as abordagens é superior a qualquer uma isolada",
      "Clomipramina pode ser superior a ISRS em casos graves, mas perfil de segurança é limitante (QTc, anticolin.)",
      "TOC com tiques: aripiprazol ou risperidona como augmentação têm evidência maior",
    ],
    armadilhas: [
      "Usar dose antidepressiva padrão para TOC — insuficiente para resposta clínica",
      "Concluir falha antes das 10–12 semanas em dose máxima",
      "Confundir TOC egodistônico com ideação delirante e usar apenas antipsicótico",
    ],
  },

  {
    id: "tept",
    nome: "TEPT",
    nome_curto: "TEPT",
    descricao: "Transtorno de Estresse Pós-Traumático. Psicoterapia trauma-focada (EMDR, TCC-Trauma) é o tratamento de referência. Farmacoterapia adjuvante: ISRS, com guanfacina para hiperalerta e nightmares.",
    gradiente: "from-slate-500 to-gray-600",
    prevalencia: "~7% (ao longo da vida)",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Sertralina", notas: "FDA aprovado para TEPT; versatilidade e tolerabilidade" },
      { linha: "1ª linha", farmaco: "Paroxetina", notas: "FDA aprovado para TEPT; mais EA e retirada difícil" },
      { linha: "2ª linha", farmaco: "Venlafaxina XR", notas: "Quando ISRS insuficiente; componente noradrenérgico útil" },
      { linha: "Adjuvante", farmaco: "Prazosin", notas: "Pesadelos e distúrbio do sono relacionado ao trauma — α1 bloqueio" },
      { linha: "Adjuvante", farmaco: "Guanfacina", notas: "Hiperalerta e reatividade autonômica; α2A agonista" },
      { linha: "Adjuvante", farmaco: "TCC Trauma / EMDR", notas: "Tratamento de referência — farmacológico é adjuvante" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Avaliação e segurança", descricao: "PCL-5 basal. Avaliar suicidabilidade, dissociação, comorbidades (TUS, depressão, TAB). Garantir ambiente seguro antes de trabalho trauma.", duracao: "Inicial" },
      { passo: 2, titulo: "Psicoterapia trauma-focada", descricao: "EMDR ou TCC-Trauma: padrão-ouro. Iniciar farmacoterapia como suporte — não substituto.", duracao: "Ao longo do tratamento" },
      { passo: 3, titulo: "Farmacoterapia adjuvante", descricao: "ISRS para humor e ansiedade. Prazosin para pesadelos. Guanfacina para hiperalerta. Evitar BZD crônicos (piora dessensibilização).", duracao: "3–6 meses mínimo" },
    ],
    pearls: [
      "EMDR e TCC-Trauma têm evidência de eficácia superior ao farmacológico isolado — encaminhar para psicoterapia",
      "Prazosin para pesadelos: iniciar 1 mg à noite, titular até 4–10 mg — monitorar hipotensão",
      "BZD crônicos em TEPT: podem bloquear extinção do medo e prejudicar a psicoterapia — usar apenas no curto prazo",
      "Comorbidade com TUS é extremamente comum — tratar ambos simultaneamente",
    ],
    armadilhas: [
      "Tratar TEPT apenas farmacologicamente sem psicoterapia trauma-focada",
      "BZD crônicos para hiperalerta: interferem na resposta ao trauma e criam dependência",
      "Ignorar dissociação que pode piorar com exposição traumática precoce sem preparo adequado",
    ],
  },

  {
    id: "tdah-transtorno",
    nome: "TDAH",
    nome_curto: "TDAH",
    descricao: "Transtorno do Neurodesenvolvimento com desatenção e/ou hiperatividade-impulsividade. Estimulantes são primeira linha. Não-estimulantes para comorbidades específicas ou contraindicações.",
    gradiente: "from-pink-500 to-rose-600",
    prevalencia: "~5% crianças; ~2,5% adultos",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Metilfenidato OROS", notas: "Formulação de longa ação preferida — menor abuso, cobertura escolar" },
      { linha: "1ª linha", farmaco: "Lisdexanfetamina", notas: "Pró-fármaco — início mais lento, menor abuso; aprovado para adultos" },
      { linha: "2ª linha", farmaco: "Atomoxetina", notas: "Sem potencial de abuso; TDAH com ansiedade comórbida; latência 4–6 semanas" },
      { linha: "2ª linha", farmaco: "Guanfacina ER", notas: "TDAH com tiques, ansiedade, agressividade; sedação" },
      { linha: "Adjuvante", farmaco: "Bupropiona", notas: "Off-label — adultos com TDM comórbido ou contraindicação a estimulantes" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Diagnóstico e comorbidades", descricao: "CONNERS ou ASRS (adultos). Excluir bipolaridade, ansiedade primária. Avaliar história de abuso de substâncias.", duracao: "Inicial" },
      { passo: 2, titulo: "Estimulante de longa ação", descricao: "OROS ou lisdexanfetamina. Titular dose a cada 1–2 semanas. Monitorar PA, FC e peso.", duracao: "0–4 semanas" },
      { passo: 3, titulo: "Resposta insuficiente ou comorbidade", descricao: "Se ansiedade intensa: atomoxetina. Se tiques: guanfacina. Se TAB: estabilizador primeiro. Combinação possível (estimulante + guanfacina).", duracao: "4–12 semanas" },
    ],
    pearls: [
      "TDAH + TAB: estabilizador PRIMEIRO, estimulante depois e com cautela",
      "TDAH + ansiedade: não tratar a ansiedade como primária se TDAH for o transtorno-base",
      "Em adultos, diagnóstico de TDAH de novo é válido — não é exclusivo de infância",
      "Lisdexanfetamina tem menor potencial de abuso por ser pró-fármaco ativado na hidrólise intestinal",
      "Férias de medicação ('drug holidays') podem ser consideradas em crianças em períodos sem demanda escolar intensa",
    ],
    armadilhas: [
      "Iniciar estimulante em TAB sem estabilizador pode precipitar episódio maníaco",
      "Focar apenas no farmacológico sem intervenções comportamentais/escolares",
      "Usar ISRS como primeira linha em TDAH sem comorbidade de humor/ansiedade",
    ],
  },

  {
    id: "insonia",
    nome: "Insônia",
    nome_curto: "Insônia",
    descricao: "Dificuldade de início ou manutenção do sono com comprometimento diurno. TCC-I é o tratamento de primeira linha. Farmacoterapia de segunda linha, iniciando com menor potencial de dependência.",
    gradiente: "from-indigo-500 to-blue-600",
    prevalencia: "~10–15% crônica",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "TCC-I (higiene do sono)", notas: "Primeira linha — controle de estímulo, restrição de sono, relaxamento" },
      { linha: "2ª linha", farmaco: "Suvorexanto / Lemborexanto", notas: "DORAs — sem dependência, preservam arquitetura do sono" },
      { linha: "2ª linha", farmaco: "Melatonina ER", notas: "Insônia circadiana; >55 anos; sem dependência" },
      { linha: "2ª linha", farmaco: "Zolpidem", notas: "Início do sono; curto prazo (≤4 semanas); menor dose em mulheres" },
      { linha: "Adjuvante", farmaco: "Trazodona 25–150 mg", notas: "Off-label hipnótico — sem dependência; hipotensão ortostática" },
      { linha: "Adjuvante", farmaco: "Mirtazapina 7,5–15 mg", notas: "Insônia com hiporexia/depressão comórbida; H1 bloqueio" },
      { linha: "Alternativa", farmaco: "Clonazepam", notas: "Curto prazo apenas — risco de dependência; evitar em idosos" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Diagnóstico e causas", descricao: "ISI (Insomnia Severity Index). Excluir apneia do sono (encaminhar para polissonografia se suspeita). Avaliar causas: dor, ansiedade, refluxo, medicamentos.", duracao: "Inicial" },
      { passo: 2, titulo: "TCC-I", descricao: "Psicoeducação sobre sono, higiene do sono, restrição de sono (contraintuitiva mas eficaz), controle de estímulo.", duracao: "4–8 semanas" },
      { passo: 3, titulo: "Farmacoterapia de curto prazo", descricao: "Se TCC-I insuficiente ou não disponível: DORA ou zolpidem por ≤4 semanas. Sempre com plano de descontinuação.", duracao: "2–4 semanas" },
    ],
    pearls: [
      "TCC-I é tão eficaz quanto hipnóticos a curto prazo e superior a longo prazo",
      "DORAs (suvorexanto, lemborexanto) preservam arquitetura do sono — superiores a BZD/Z-drugs nesse aspecto",
      "Zolpidem: dose em mulheres deve ser menor (metabolismo mais lento); FDA recomenda 5 mg IR para mulheres",
      "Trazodona como hipnótico: sem dependência, mas hipotensão ortostática pode ser limitante",
      "Apneia do sono não tratada torna qualquer hipnótico pouco eficaz — excluir primeiro",
    ],
    armadilhas: [
      "BZD ou Z-drugs como primeira linha crônica — dependência e tolerância surgem em semanas",
      "Quetiapina off-label como hipnótico sem indicação psiquiátrica — risco metabólico sem benefício justificado",
      "Ignorar apneia do sono como causa primária",
      "Usar zolpidem CR (liberação prolongada) em pacientes com histórico de sonambulismo",
    ],
  },

  {
    id: "dependencia-quimica",
    nome: "Transtornos por Uso de Substâncias",
    nome_curto: "Dependência",
    descricao: "Tratamento de substituição (opioides), redução de danos, farmacoterapia adjuvante. Integração com suporte psicossocial é essencial.",
    gradiente: "from-red-600 to-rose-700",
    prevalencia: "~10% (álcool); ~0,5% (opioides)",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Naltrexona (álcool)", notas: "Reduz fissura e probabilidade de recaída; não usar com opioides ativos" },
      { linha: "1ª linha", farmaco: "Acamprosato (álcool)", notas: "Manutenção da abstinência; seguro em hepatopatas leves" },
      { linha: "1ª linha", farmaco: "Buprenorfina/Naloxona", notas: "Tratamento de substituição para opioides — padrão ouro" },
      { linha: "1ª linha", farmaco: "Metadona", notas: "Tratamento de substituição para opioides — supervisionado" },
      { linha: "1ª linha", farmaco: "Vareniclina (tabagismo)", notas: "Mais eficaz para cessação tabágica — OR ~3 vs placebo" },
      { linha: "2ª linha", farmaco: "Dissulfiram (álcool)", notas: "Paciente motivado, supervisão da tomada; reação aversiva" },
      { linha: "Adjuvante", farmaco: "Diazepam (abstinência alcoólica)", notas: "Protocolo CIWA-Ar para abstinência aguda; não prolongar" },
      { linha: "Adjuvante", farmaco: "Naloxona intranasal", notas: "Kits de reversão de overdose — distribuição a pacientes e familiares" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Avaliação de gravidade", descricao: "AUDIT (álcool), DAST (drogas). Avaliar dependência física, comorbidades psiquiátricas (TEPT, depressão, TDAH). Motivação (entrevista motivacional).", duracao: "Inicial" },
      { passo: 2, titulo: "Gestão da abstinência aguda", descricao: "Álcool: CIWA-Ar + BZD (5–7 dias). Opioides: buprenorfina ou clonidina para sintomas. Não prolongar BZD além da fase aguda.", duracao: "3–7 dias" },
      { passo: 3, titulo: "Farmacoterapia de manutenção", descricao: "Álcool: naltrexona ou acamprosato. Opioides: buprenorfina/naloxona ou metadona (longo prazo). Tabagismo: vareniclina. Suporte psicossocial obrigatório.", duracao: "6–12+ meses" },
    ],
    pearls: [
      "Buprenorfina/naloxona: a naloxona oral tem mínima biodisponibilidade — age somente se injetada (previne abuso IV)",
      "Naltrexona: exige pelo menos 7–10 dias de abstinência de opioides antes de iniciar — caso contrário precipita abstinência grave",
      "Kits de naloxona para familiares: estratégia de redução de danos com evidência sólida",
      "Parar de fumar durante clozapina: monitorar litemia — CYP1A2 induzido pelo tabaco é revertido",
      "Dependência química e transtorno psiquiátrico: tratar ambos simultaneamente — tratamento sequencial piora prognóstico",
    ],
    armadilhas: [
      "Prescrever opioides para dor em paciente com TUS: abordar com cautela extrema",
      "Dissulfiram em paciente não motivado ou sem supervisão — ineficaz e perigoso",
      "BZD prolongados além da abstinência alcoólica aguda",
    ],
  },

  {
    id: "demencias",
    nome: "Demências",
    nome_curto: "Demências",
    descricao: "Alzheimer, DCL, DFT e outras demências. Tratamento sintomático com AChEI e memantina — sem modificação da progressão. Manejo de BPSD (sintomas comportamentais) com cautela.",
    gradiente: "from-teal-500 to-cyan-600",
    prevalencia: "~10% em >65 anos",
    linhas_terapeuticas: [
      { linha: "1ª linha", farmaco: "Donepezila", notas: "Alzheimer leve a grave; 5 mg (mod) ou 10 mg (mod-grave) ou 23 mg (grave)" },
      { linha: "1ª linha", farmaco: "Rivastigmina patch", notas: "AChEI + BuChE — única aprovada para DCL e DDP; patch minimiza EA GI" },
      { linha: "1ª linha", farmaco: "Galantamina ER", notas: "AChEI + modulador nAChR; 1x/dia" },
      { linha: "1ª linha", farmaco: "Memantina", notas: "Alzheimer moderado a grave; combinar com donepezila tem melhor evidência" },
      { linha: "Adjuvante", farmaco: "Quetiapina / Risperidona", notas: "BPSD: delírios e agressividade — usar menor dose possível e por menor tempo" },
      { linha: "Adjuvante", farmaco: "Citalopram / Escitalopram", notas: "Agitação em Alzheimer — evidência emergente; cuidado com QTc (citalopram >20 mg em >60a)" },
    ],
    algoritmo: [
      { passo: 1, titulo: "Confirmar diagnóstico e subtipos", descricao: "MEEM, MoCA, ADAS-Cog. Neuroimagem. Diferenciar Alzheimer de DCL (flutuação, parkinsonismo, alucinações visuais) e DFT (comportamento e linguagem).", duracao: "Inicial" },
      { passo: 2, titulo: "Iniciar AChEI", descricao: "Donepezila ou galantamina para Alzheimer; rivastigmina para DCL/DDP. Titular lentamente. Combinar com memantina no moderado-grave.", duracao: "0–12 semanas" },
      { passo: 3, titulo: "Manejo de BPSD", descricao: "Não farmacológico primeiro (estrutura, rotina, validação). Farmacológico: antipsicótico em dose mínima por tempo mínimo — Black box de mortalidade aumentada em idosos com demência.", duracao: "Conforme necessidade" },
    ],
    pearls: [
      "Rivastigmina (patch): única AChEI aprovada para DCL e demência do Parkinson",
      "Antipsicóticos típicos na DCL: CONTRAINDICADOS — sensibilidade grave com parkinsonismo severo e mortalidade",
      "Combinação donepezila + memantina: melhor evidência para Alzheimer moderado-grave do que monoterapia",
      "AChEI bradicardizam — cuidado com betabloqueadores e antiarrítmicos concomitantes",
      "DFT não tem tratamento modificador — donepezila pode piorar agitação em alguns casos",
    ],
    armadilhas: [
      "AP típico em DCL: contraindicado — risco de parkinsonismo grave e mortalidade aumentada",
      "Prescrever AChEI sem orientação sobre bradicardia e síncope",
      "Usar AP como hipnótico na demência sem indicação comportamental específica",
      "Ignorar o cuidador — estresse do cuidador é um desfecho clínico relevante",
    ],
  },
];

// Helpers
export function getTranstorno(id: string): Transtorno | undefined {
  return transtornos.find((t) => t.id === id);
}
