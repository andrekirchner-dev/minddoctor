export type TipoNo = "pergunta" | "info" | "acao" | "resultado" | "aviso";
export type CorAlerta = "perigo" | "atencao" | "info" | "sucesso";

export interface Opcao {
  label: string;
  proximo: string;
}

export interface Alerta {
  tipo: CorAlerta;
  texto: string;
}

export interface No {
  id: string;
  tipo: TipoNo;
  titulo?: string;
  conteudo: string;
  sub?: string;
  alerta?: Alerta;
  acoes?: string[];
  opcoes?: Opcao[];   // branching: picks next node
  proximo?: string;  // linear: goes to next node automatically (after user confirms)
}

export type AreaEmergencia = "agitacao" | "delirium" | "suicidio" | "serotoninergica" | "snm";

export interface Protocolo {
  id: string;
  titulo: string;
  sigla?: string;
  area: AreaEmergencia;
  cor: string;       // tailwind color name (red, orange, yellow...)
  descricao: string;
  tempo_min: number;
  plano: "free" | "pro";
  referencia: string;
  inicio: string;    // id of the first node
  nos: No[];
}

// ─── AGITAÇÃO PSICOMOTORA ─────────────────────────────────────────────────────
const agitacao: Protocolo = {
  id: "agitacao",
  titulo: "Agitação Psicomotora",
  area: "agitacao",
  cor: "red",
  descricao: "Abordagem sistematizada da agitação aguda — desescalada verbal, exclusão orgânica e manejo farmacológico.",
  tempo_min: 5,
  plano: "free",
  referencia: "Diretriz ABP 2023; Wilson MP et al. West J Emerg Med. 2012.",
  inicio: "seguranca",
  nos: [
    {
      id: "seguranca",
      tipo: "aviso",
      titulo: "Segurança imediata",
      conteudo: "Antes de qualquer avaliação, garanta a segurança do ambiente.",
      alerta: { tipo: "perigo", texto: "Remova objetos cortantes/perfurantes. Posicione-se próximo à saída. Chame apoio se necessário." },
      acoes: [
        "Apresente-se com calma e tom de voz baixo",
        "Mantenha distância segura (1–2 metros)",
        "Não confronte diretamente — use perguntas abertas",
        "Ofereça espaço, água, medicação oral antes de qualquer contenção",
      ],
      proximo: "causa_organica",
    },
    {
      id: "causa_organica",
      tipo: "pergunta",
      titulo: "Identificar etiologia",
      conteudo: "Há sinais de causa orgânica?",
      sub: "Febre >38°C, hipertensão grave, taquicardia, hipóxia, confusão aguda flutuante, Glasgow reduzido, déficit neurológico focal, trauma crânio-encefálico",
      opcoes: [
        { label: "Sim — sinais orgânicos presentes", proximo: "organico_manejo" },
        { label: "Não — quadro provável psiquiátrico", proximo: "contexto_psiq" },
        { label: "Incerto — preciso avaliar melhor", proximo: "exclusao_lista" },
      ],
    },
    {
      id: "exclusao_lista",
      tipo: "info",
      titulo: "Exclusão orgânica mínima",
      conteudo: "Solicite urgente antes de atribuir causa psiquiátrica:",
      acoes: [
        "Glicemia capilar (hipoglicemia é causa frequente)",
        "Oximetria de pulso (hipóxia)",
        "Temperatura (infecção do SNC, NMS)",
        "Pressão arterial e FC",
        "ECG (arritmia, QTc prolongado)",
        "EAS + ureia/creatinina (encefalopatia metabólica)",
        "Considerar TC crânio se trauma ou déficit focal",
      ],
      proximo: "causa_organica",
    },
    {
      id: "organico_manejo",
      tipo: "resultado",
      titulo: "Agitação de causa orgânica — Delirium",
      conteudo: "Priorize tratamento da causa de base. Contenção farmacológica apenas se risco imediato.",
      alerta: { tipo: "atencao", texto: "Benzodiazepínicos pioram delirium. Use com extrema cautela." },
      acoes: [
        "Haloperidol 0,5–1 mg VO/IM a cada 4–6h (baixas doses em idosos)",
        "Ambiente calmo, baixa estimulação, familiar presente se possível",
        "Corrigir a causa base (hidratação, infecção, distúrbio metabólico)",
        "Reorientação constante — luz natural, relógio visível",
        "Evitar contenção física se possível — aumenta mortalidade",
      ],
    },
    {
      id: "contexto_psiq",
      tipo: "pergunta",
      titulo: "Contexto clínico psiquiátrico",
      conteudo: "Qual o contexto clínico mais provável?",
      opcoes: [
        { label: "Psicose aguda / Esquizofrenia", proximo: "farm_psicose" },
        { label: "Mania / Transtorno Bipolar", proximo: "farm_mania" },
        { label: "Intoxicação / Abstinência de substâncias", proximo: "farm_substancias" },
        { label: "Transtorno de personalidade / Dissociativo / Ansiedade", proximo: "farm_ansiedade" },
        { label: "Desconhecido / Incerto", proximo: "farm_generico" },
      ],
    },
    {
      id: "farm_psicose",
      tipo: "resultado",
      titulo: "Manejo — Psicose aguda",
      conteudo: "Primeira linha: combinação antipsicótico + sedação",
      alerta: { tipo: "atencao", texto: "Olanzapina IM não deve ser usada com benzodiazepínico IM — risco de depressão respiratória fatal." },
      acoes: [
        "Haloperidol 5 mg IM + Prometazina 50 mg IM (1ª linha, muito eficaz)",
        "Alternativa: Olanzapina 10 mg IM (SE sem BZD nos últimos 60 min)",
        "Alternativa oral: Risperidona 2 mg + Clonazepam 1–2 mg VO",
        "Repetir haloperidol a cada 20–30 min se sem resposta (máx 20 mg/dia)",
        "Ziprasidona 10–20 mg IM: alternativa (menor sedação, mais risco QTc)",
        "Monitorar sinais vitais a cada 15 min após IM",
      ],
    },
    {
      id: "farm_mania",
      tipo: "resultado",
      titulo: "Manejo — Mania agitada",
      conteudo: "Sedação rápida com menor risco extrapiramidal",
      acoes: [
        "Olanzapina 10 mg IM — primeira escolha na mania agitada",
        "Alternativa: Haloperidol 5 mg IM + Prometazina 50 mg IM",
        "Clonazepam 1–2 mg IM como adjuvante (se sem psicose ativa)",
        "Valproato IV (15–20 mg/kg) se internação disponível",
        "Lítio: início mais lento — não ideal para controle imediato",
        "Monitorar sinais vitais; ECG se Olanzapina",
      ],
    },
    {
      id: "farm_substancias",
      tipo: "pergunta",
      titulo: "Substância envolvida",
      conteudo: "Qual a substância mais provável?",
      opcoes: [
        { label: "Álcool (intoxicação ou abstinência)", proximo: "farm_alcool" },
        { label: "Estimulantes (cocaína, anfetamina)", proximo: "farm_estimulante" },
        { label: "Cannabis / Dissociativos (ketamina, PCP)", proximo: "farm_cannabis" },
        { label: "Opioide / Depressor SNC", proximo: "farm_opioide" },
      ],
    },
    {
      id: "farm_alcool",
      tipo: "resultado",
      titulo: "Manejo — Álcool",
      conteudo: "Diferenciar intoxicação de abstinência — tratamentos opostos.",
      alerta: { tipo: "perigo", texto: "Abstinência alcoólica grave (tremores, convulsões, delirium tremens) é emergência médica com mortalidade significativa." },
      acoes: [
        "Intoxicação: suporte, tiamina 300 mg EV, observação",
        "Abstinência leve-moderada: Diazepam 10–20 mg VO a cada 6h, titular por CIWA",
        "Abstinência grave / Delirium tremens: Diazepam EV 10 mg a cada 5–10 min até sedação",
        "Fenobarbital IV se refratário ao BZD",
        "Tiamina SEMPRE antes de glicose (prevenir Wernicke)",
        "Haloperidol pode ser adjuvante nas alucinações, mas NÃO reduz risco de convulsão",
      ],
    },
    {
      id: "farm_estimulante",
      tipo: "resultado",
      titulo: "Manejo — Estimulantes",
      conteudo: "Cocaína, anfetaminas, MDMA — hiperatividade adrenérgica.",
      alerta: { tipo: "atencao", texto: "Evite beta-bloqueadores puros — risco de vasoconstrição paradoxal com cocaína." },
      acoes: [
        "Benzodiazepínicos são a primeira linha — Diazepam 5–10 mg EV ou Clonazepam 1–2 mg IM",
        "Resfriamento ativo se hipertermia",
        "Controle da hipertensão: Nitroprussiato ou labetalol (não propranolol puro)",
        "Haloperidol para componente psicótico persistente",
        "Hidratação + monitoramento cardíaco contínuo",
      ],
    },
    {
      id: "farm_cannabis",
      tipo: "resultado",
      titulo: "Manejo — Cannabis / Dissociativos",
      conteudo: "Cannabis de alta potência pode induzir psicose aguda transitória.",
      acoes: [
        "Ambiente calmo, baixa estimulação sensorial",
        "Benzodiazepínico: Clonazepam 1–2 mg VO ou Diazepam 10 mg VO",
        "Se psicose franca persistente: Haloperidol 2,5–5 mg IM ou Olanzapina 5–10 mg IM",
        "Observação por 4–6h mínimo",
        "Avaliar risco de psicose induzida vs. psicose primária desencadeada",
      ],
    },
    {
      id: "farm_opioide",
      tipo: "resultado",
      titulo: "Manejo — Opioide / Depressor SNC",
      conteudo: "Agitação paradoxal ou síndrome de abstinência.",
      alerta: { tipo: "perigo", texto: "Suspeita de overdose de opioide: Naloxona 0,4 mg EV/IM imediato. Repetir a cada 2–3 min." },
      acoes: [
        "Abstinência de opioide: Metadona ou buprenorfina se disponível",
        "Clonidina 0,1 mg VO para sintomas autonômicos da abstinência",
        "Não use antagonistas sem suporte — risco de abstinência precipitada grave",
        "BZD com cautela — risco de depressão respiratória somada",
      ],
    },
    {
      id: "farm_ansiedade",
      tipo: "resultado",
      titulo: "Manejo — Agitação ansioso-dissociativa",
      conteudo: "Contexto de transtorno de personalidade, dissociação, pânico ou crise situacional.",
      acoes: [
        "Desescalada verbal é a primeira e mais eficaz intervenção",
        "Ambiente calmo, presença de pessoa de confiança",
        "Clonazepam 1–2 mg VO ou SL — primeira linha farmacológica",
        "Diazepam 5–10 mg VO se resposta insuficiente",
        "Evitar antipsicóticos se não houver componente psicótico",
        "Contenção física: último recurso — avalia o contexto ético/legal",
      ],
    },
    {
      id: "farm_generico",
      tipo: "resultado",
      titulo: "Manejo — Etiologia incerta",
      conteudo: "Quando a causa é desconhecida, priorize segurança e sedação mínima eficaz.",
      alerta: { tipo: "atencao", texto: "Não administre olanzapina IM se benzodiazepínico IM foi dado nos últimos 60 min." },
      acoes: [
        "Haloperidol 5 mg IM + Prometazina 50 mg IM: combinação segura e eficaz",
        "Alternativa: Droperidol 5 mg IM (onde disponível)",
        "Excluir ativamente causas orgânicas antes de alta",
        "Monitorar sinais vitais, Glasgow, oximetria",
        "Documentar resposta e ajustar conforme evolução",
      ],
    },
  ],
};

// ─── DELIRIUM VS. PSICOSE ─────────────────────────────────────────────────────
const delirium: Protocolo = {
  id: "delirium",
  titulo: "Delirium vs. Psicose Aguda",
  area: "delirium",
  cor: "orange",
  descricao: "Diagnóstico diferencial entre delirium e primeiro episódio psicótico. Erros aqui mudam radicalmente o tratamento.",
  tempo_min: 7,
  plano: "free",
  referencia: "DSM-5-TR; CAM (Inouye 1990); Meagher DJ. Lancet. 2001.",
  inicio: "cam_inicio",
  nos: [
    {
      id: "cam_inicio",
      tipo: "info",
      titulo: "Confusion Assessment Method (CAM)",
      conteudo: "O CAM tem sensibilidade 94% e especificidade 89% para delirium. Avalie os 4 critérios:",
      acoes: [
        "1. Início agudo e curso flutuante — mudança do estado mental basal, piora e melhora ao longo do dia?",
        "2. Desatenção — dificuldade em manter foco, facilmente distraído?",
        "3. Pensamento desorganizado — fala incoerente, lógica ilógica?",
        "4. Nível de consciência alterado — hiperalerta, letárgico, estupor?",
      ],
      proximo: "cam_resultado",
    },
    {
      id: "cam_resultado",
      tipo: "pergunta",
      titulo: "Resultado CAM",
      conteudo: "Critério 1 + Critério 2 + (Critério 3 OU Critério 4) = Delirium",
      opcoes: [
        { label: "CAM positivo — critérios 1+2+3/4 presentes", proximo: "delirium_confirmado" },
        { label: "CAM negativo — critérios incompletos", proximo: "diferencial_tabela" },
        { label: "Incerto — preciso de mais dados", proximo: "diferencial_tabela" },
      ],
    },
    {
      id: "delirium_confirmado",
      tipo: "info",
      titulo: "Delirium confirmado — próximos passos",
      conteudo: "Delirium é sempre secundário a uma causa orgânica. Investigue urgente:",
      alerta: { tipo: "perigo", texto: "Mortalidade hospitalar do delirium é de 10–26%. Não trate como psiquiátrico." },
      acoes: [
        "Hemograma completo + PCR (infecção)",
        "Ureia, creatinina, eletrólitos, glicemia (metabólico)",
        "TGO, TGP, bilirrubinas (encefalopatia hepática)",
        "Gasometria arterial (hipóxia, hipercapnia)",
        "ECG + troponina se >65 anos",
        "TC crânio se TCE, déficit focal, ICSUS novo",
        "Urina tipo I + urocultura (ITU é causa frequente)",
        "EEG se suspeita de estado epiléptico não-convulsivo",
      ],
      proximo: "delirium_manejo",
    },
    {
      id: "delirium_manejo",
      tipo: "resultado",
      titulo: "Manejo do Delirium",
      conteudo: "Medidas não-farmacológicas são pilares do tratamento.",
      alerta: { tipo: "atencao", texto: "Benzodiazepínicos pioram delirium — usar apenas em delirium por álcool/BZD ou convulsões." },
      acoes: [
        "Tratar causa base com prioridade máxima",
        "Reorientação: identificar-se sempre, luz natural, relógio/calendário visível",
        "Mobilização precoce: sentar no leito, fisioterapia desde o 1º dia",
        "Correção sensorial: óculos, aparelho auditivo, prótese dentária",
        "Sono-vigília: luz dia, escuro à noite, evitar sedativos noturnos",
        "Farmacológico se agitação grave: Haloperidol 0,5–1 mg VO/IM (idosos 0,25 mg)",
        "Quetiapina 25–50 mg à noite: alternativa em Parkinson ou Lewy",
        "Melatonina 3–5 mg à noite: melhora ciclo sono-vigília",
      ],
    },
    {
      id: "diferencial_tabela",
      tipo: "info",
      titulo: "Diferencial clínico: Delirium × Psicose",
      conteudo: "Compare as características:",
      acoes: [
        "INÍCIO: Delirium = horas/dias | Psicose = dias/semanas/meses",
        "CURSO: Delirium = flutuante (piora à noite) | Psicose = relativamente estável",
        "CONSCIÊNCIA: Delirium = rebaixada/flutuante | Psicose = preservada",
        "ATENÇÃO: Delirium = comprometida (sinal cardinal) | Psicose = relativamente preservada",
        "ALUCINAÇÕES: Delirium = visuais (objetos, animais) | Psicose = auditivas (vozes)",
        "MEMÓRIA: Delirium = comprometida | Psicose = geralmente preservada",
        "ORIENTAÇÃO: Delirium = desorientado (T/E/P) | Psicose = orientado",
        "PENSAMENTO: Delirium = incoerente, perseverativo | Psicose = delírios sistematizados",
        "HISTÓRIA: Delirium = doença médica nova | Psicose = histórico psiquiátrico, uso de substâncias",
      ],
      proximo: "diferencial_pergunta",
    },
    {
      id: "diferencial_pergunta",
      tipo: "pergunta",
      titulo: "Após comparação clínica",
      conteudo: "Com base no quadro clínico completo, qual o diagnóstico mais provável?",
      opcoes: [
        { label: "Mais provável Delirium → tratar como orgânico", proximo: "delirium_confirmado" },
        { label: "Mais provável Psicose Aguda → avaliar psiquiátrico", proximo: "psicose_avaliacao" },
        { label: "Ainda incerto — solicitar EEG/neuroimagem", proximo: "incerto_conduta" },
      ],
    },
    {
      id: "psicose_avaliacao",
      tipo: "resultado",
      titulo: "Psicose Aguda — avaliação inicial",
      conteudo: "Mesmo com quadro psiquiátrico provável, sempre realize exclusão orgânica mínima.",
      acoes: [
        "Exclusão orgânica mínima obrigatória: glicemia, Na, TSH, hemograma",
        "Urina para drogas de abuso (especialmente THC, anfetamina, PCP)",
        "Histórico detalhado: primeiro episódio? histórico familiar? uso de substâncias?",
        "Avaliação de risco: agitação, risco a terceiros, autocuidado",
        "Antipsicótico: Risperidona 1–2 mg VO ou Olanzapina 5–10 mg (1º episódio → dose mínima)",
        "Hospitalização se: 1º episódio, sem suporte, sem insight, risco de auto/heteroagressão",
      ],
    },
    {
      id: "incerto_conduta",
      tipo: "resultado",
      titulo: "Quadro incerto — conduta conservadora",
      conteudo: "Na dúvida, tratar como orgânico até prova em contrário.",
      alerta: { tipo: "info", texto: "Erro de tratar psicose como delirium é menos grave que tratar delirium como psicose." },
      acoes: [
        "Internação para investigação completa",
        "EEG (estado epiléptico não-convulsivo é difícil de diagnosticar clinicamente)",
        "Neuroimagem com contraste se suspeita de encefalite",
        "Considerar punção lombar se febre + alteração consciência",
        "LCR: células, proteína, glicose, cultura, autoanticorpos (anti-NMDA, LGI1)",
        "Encaminhar para neurologia se foco orgânico suspeito",
      ],
    },
  ],
};

// ─── RISCO DE SUICÍDIO ────────────────────────────────────────────────────────
const suicidio: Protocolo = {
  id: "suicidio",
  titulo: "Avaliação de Risco de Suicídio",
  area: "suicidio",
  cor: "yellow",
  descricao: "Estratificação estruturada do risco suicida com base em fatores de risco, proteção e C-SSRS.",
  tempo_min: 10,
  plano: "free",
  referencia: "C-SSRS (Posner 2011); Diretrizes ABP 2022; Zero Suicide Institute.",
  inicio: "rs_abordagem",
  nos: [
    {
      id: "rs_abordagem",
      tipo: "info",
      titulo: "Abordagem inicial",
      conteudo: "Perguntar diretamente sobre suicídio NÃO aumenta o risco — é sempre necessário.",
      alerta: { tipo: "info", texto: "Use linguagem direta: \"Você está pensando em se machucar ou tirar sua própria vida?\"" },
      acoes: [
        "Garantir privacidade para a entrevista",
        "Remover itens de risco imediato do ambiente se possível",
        "Adote postura empática e não julgativa",
        "Não prometa confidencialidade sobre risco de vida",
      ],
      proximo: "rs_cssrs",
    },
    {
      id: "rs_cssrs",
      tipo: "pergunta",
      titulo: "C-SSRS — Ideação (último mês)",
      conteudo: "Qual o nível mais grave de ideação suicida presente no último mês?",
      opcoes: [
        { label: "Nenhuma ideação — não pensa em se machucar", proximo: "rs_comportamento" },
        { label: "Desejo passivo de morte — 'seria melhor estar morto'", proximo: "rs_comportamento" },
        { label: "Ideação sem método — pensa em se matar sem forma específica", proximo: "rs_comportamento" },
        { label: "Ideação com método — pensa em se matar com método específico", proximo: "rs_comportamento" },
        { label: "Ideação com intenção — pensa em se matar com intenção de agir", proximo: "rs_comportamento" },
        { label: "Ideação com plano e intenção — plano específico + intenção", proximo: "rs_comportamento" },
      ],
    },
    {
      id: "rs_comportamento",
      tipo: "pergunta",
      titulo: "C-SSRS — Comportamento suicida",
      conteudo: "Há algum comportamento suicida (vida toda ou último mês)?",
      opcoes: [
        { label: "Não — sem histórico de tentativas ou atos preparatórios", proximo: "rs_fatores" },
        { label: "Atos preparatórios — organizou coisas, se despediu, acessou meios", proximo: "rs_fatores" },
        { label: "Tentativa anterior — independente de quando", proximo: "rs_fatores" },
        { label: "Tentativa em curso ou muito recente (últimas 24h)", proximo: "rs_urgencia" },
      ],
    },
    {
      id: "rs_urgencia",
      tipo: "resultado",
      titulo: "EMERGÊNCIA — Risco imediato",
      conteudo: "Tentativa em curso ou iminência de ato suicida.",
      alerta: { tipo: "perigo", texto: "Não deixe o paciente sozinho. Acionar equipe de emergência imediatamente." },
      acoes: [
        "Acionar SAMU 192 se fora de hospital ou emergência hospitalar",
        "Garantir segurança física imediata — remover meios letais",
        "Contenção suave e presença constante",
        "Acionar familiares / responsável legal",
        "Internação compulsória se necessário (Lei 10.216)",
        "Documentar avaliação detalhadamente",
      ],
    },
    {
      id: "rs_fatores",
      tipo: "info",
      titulo: "Fatores de risco e proteção",
      conteudo: "Avalie para estratificação:",
      acoes: [
        "RISCO ↑: tentativa prévia (maior preditor), impulsividade, abuso de substâncias ativo, isolamento social, acesso a meios letais (arma de fogo), dor crônica, diagnóstico recente grave",
        "RISCO ↑: homem >45 anos, histórico familiar de suicídio, recente alta hospitalar (<90 dias), evento de vida adverso recente",
        "PROTEÇÃO ↓: suporte familiar sólido, vínculos religiosos/espirituais, filhos pequenos, esperança quanto ao futuro, acesso a tratamento, insight sobre a doença",
        "ACESSO AO MEIO: perguntar diretamente sobre armas de fogo, medicamentos em casa — é intervençãode alta eficácia",
      ],
      proximo: "rs_estratificacao",
    },
    {
      id: "rs_estratificacao",
      tipo: "pergunta",
      titulo: "Estratificação do risco",
      conteudo: "Com base na ideação (C-SSRS), comportamento e fatores, classifique:",
      opcoes: [
        { label: "Baixo — desejo passivo de morte, sem plano/intenção, múltiplos protetores", proximo: "rs_baixo" },
        { label: "Moderado — ideação sem intenção clara, alguns fatores de risco", proximo: "rs_moderado" },
        { label: "Alto — ideação com método ou intenção, tentativa anterior, poucos protetores", proximo: "rs_alto" },
      ],
    },
    {
      id: "rs_baixo",
      tipo: "resultado",
      titulo: "Risco Baixo — Conduta",
      conteudo: "Paciente pode ser manejado ambulatorialmente com suporte adequado.",
      acoes: [
        "Psicoeducação para paciente e família",
        "Plano de segurança escrito (o que fazer em crise, quem ligar, onde ir)",
        "Orientar sobre restrição de acesso a meios letais (armas, medicamentos)",
        "Agendar retorno em 48–72h ou antes se piora",
        "Fornecer contatos de crise: CVV 188 (24h), CAPS local",
        "Comunicar equipe de saúde mental de referência",
        "Documentar avaliação completa no prontuário",
      ],
    },
    {
      id: "rs_moderado",
      tipo: "resultado",
      titulo: "Risco Moderado — Conduta",
      conteudo: "Avaliação cuidadosa sobre necessidade de internação.",
      alerta: { tipo: "atencao", texto: "A decisão de internar deve considerar o contexto completo, não apenas o score isolado." },
      acoes: [
        "Avaliação conjunta com psiquiatra / equipe de saúde mental",
        "Envolver familiar ou acompanhante de confiança",
        "Plano de segurança detalhado e verbalizado",
        "Prescrever apenas quantidade segura de medicação (sem grande estoque)",
        "Considerar hospitalização-dia ou observação 12–24h em emergência",
        "Internação se: sem suporte, sem insight, acesso a meio letal, incapaz de garantir segurança",
        "Retorno em 24–48h se ambulatorial",
      ],
    },
    {
      id: "rs_alto",
      tipo: "resultado",
      titulo: "Risco Alto — Internação indicada",
      conteudo: "Risco imediato — hospitalização para estabilização.",
      alerta: { tipo: "perigo", texto: "Não libere sem avaliação psiquiátrica presencial. Internação é a conduta padrão." },
      acoes: [
        "Internação psiquiátrica voluntária ou, se necessário, involuntária (Lei 10.216)",
        "Remover acesso a meios letais com apoio familiar",
        "Iniciar ou otimizar tratamento farmacológico: antidepressivo, lítio (evidência antisuicida), clozapina (esquizofrenia)",
        "Psicoterapia em crise: DBT, terapia de resolução de problemas",
        "Avaliar ECT em depressão psicótica ou catatônica com risco imediato",
        "Comunicar caso ao CAPS para seguimento pós-alta",
        "Documentar raciocínio clínico, fatores considerados, decisão e alternativas",
      ],
    },
  ],
};

// ─── SÍNDROME SEROTONINÉRGICA ─────────────────────────────────────────────────
const serotoninergica: Protocolo = {
  id: "serotoninergica",
  titulo: "Síndrome Serotoninérgica",
  area: "serotoninergica",
  cor: "purple",
  descricao: "Diagnóstico e manejo da toxicidade serotoninérgica — diferenciação de SNM e tratamento urgente.",
  tempo_min: 8,
  plano: "free",
  referencia: "Hunter Criteria (Dunkley 2003); Boyer EW. N Engl J Med. 2005.",
  inicio: "ss_contexto",
  nos: [
    {
      id: "ss_contexto",
      tipo: "pergunta",
      titulo: "Contexto clínico",
      conteudo: "Suspeita de síndrome serotoninérgica. Há uso de agente serotoninérgico?",
      sub: "ISRS, IRSN, ADT, lítio, tramadol, metadona, linezolida, triptanos, IMAO, anfetaminas, MDMA, opioides (fentanil, meperidina), azul de metileno, ondansetrona em doses altas",
      opcoes: [
        { label: "Sim — uso de agente serotoninérgico confirmado ou suspeito", proximo: "ss_hunter" },
        { label: "Não — sem exposição serotoninérgica conhecida", proximo: "ss_alternativas" },
        { label: "Incerto — revisar medicações completas", proximo: "ss_lista_drogas" },
      ],
    },
    {
      id: "ss_lista_drogas",
      tipo: "info",
      titulo: "Agentes serotoninérgicos — referência rápida",
      conteudo: "Risco elevado de síndrome serotoninérgica especialmente em combinações:",
      alerta: { tipo: "perigo", texto: "IMAO + qualquer serotoninérgico = contraindicação absoluta (síndrome letal)." },
      acoes: [
        "ISRS/IRSN: fluoxetina, sertralina, paroxetina, escitalopram, venlafaxina, duloxetina",
        "IMAO: fenelzina, tranilcipromina, selegilina (incluindo patch)",
        "Opioides serotoninérgicos: tramadol, meperidina, fentanil, oxicodona",
        "Outros: triptanos, lítio, valproato, linezolida, ritonavir, azul de metileno",
        "Drogas recreativas: MDMA (ecstasy), LSD, cocaína, anfetaminas",
        "Interação crítica: fluoxetina + IMAO (washout 5 semanas) / paroxetina + IMAO (2 semanas)",
      ],
      proximo: "ss_contexto",
    },
    {
      id: "ss_hunter",
      tipo: "info",
      titulo: "Critérios de Hunter (mais específicos)",
      conteudo: "Diagnóstico de SS se USO de serotoninérgico + pelo menos 1 dos seguintes:",
      acoes: [
        "1. Clonus espontâneo (contração rítmica)",
        "2. Clonus induzível + agitação OU diaforese",
        "3. Clonus ocular + agitação OU diaforese",
        "4. Tremor + hiperreflexia",
        "5. Hipertonia + temperatura >38°C + clonus ocular ou induzível",
      ],
      proximo: "ss_hunter_resultado",
    },
    {
      id: "ss_hunter_resultado",
      tipo: "pergunta",
      titulo: "Critérios de Hunter preenchidos?",
      conteudo: "Algum dos 5 critérios foi identificado?",
      opcoes: [
        { label: "Sim — SS confirmada pelos critérios de Hunter", proximo: "ss_gravidade" },
        { label: "Não — critérios negativos", proximo: "ss_alternativas" },
        { label: "Parcial — alguns achados mas incompleto", proximo: "ss_gravidade" },
      ],
    },
    {
      id: "ss_gravidade",
      tipo: "pergunta",
      titulo: "Gravidade da síndrome",
      conteudo: "Qual a apresentação clínica dominante?",
      opcoes: [
        { label: "Leve — tremor, taquicardia, diaforese, mioclônus intermitente", proximo: "ss_leve" },
        { label: "Moderada — hiperreflexia, clonus, hipertermia <40°C, agitação", proximo: "ss_moderada" },
        { label: "Grave — hipermia >41°C, rigidez muscular grave, rabdomiólise, instabilidade hemodinâmica", proximo: "ss_grave" },
      ],
    },
    {
      id: "ss_leve",
      tipo: "resultado",
      titulo: "SS Leve — Manejo",
      conteudo: "Descontinuação do agente causador + observação.",
      acoes: [
        "Suspender imediatamente todos os agentes serotoninérgicos",
        "Observação em emergência por 6–12h",
        "Hidratação oral ou IV conforme tolerância",
        "BZD para agitação/ansiedade: Diazepam 5–10 mg VO",
        "Monitorar temperatura, FC e PA a cada hora",
        "Alta com orientação sobre washout antes de reintroduzir qualquer serotoninérgico",
      ],
    },
    {
      id: "ss_moderada",
      tipo: "resultado",
      titulo: "SS Moderada — Manejo",
      conteudo: "Internação + ciproeptadina + suporte ativo.",
      alerta: { tipo: "atencao", texto: "Ciproeptadina é antagonista 5-HT2A — pode ser dispensada em farmácias de manipulação." },
      acoes: [
        "Suspender TODOS os agentes serotoninérgicos imediatamente",
        "Internar para monitorização contínua",
        "Ciproeptadina 12 mg VO inicial, depois 4 mg a cada 4h (máx 32 mg/dia)",
        "BZD para controle de agitação e mioclônus: Lorazepam 2 mg EV ou Diazepam 10 mg EV",
        "Resfriamento ativo se temperatura >39°C",
        "Hidratação vigorosa IV: 2–3 L/dia + monitorar diurese",
        "Contraindicado: antipsicóticos, fisostigmina",
        "Monitorar: CK, função renal, eletrólitos, lactato",
      ],
    },
    {
      id: "ss_grave",
      tipo: "resultado",
      titulo: "SS Grave — EMERGÊNCIA",
      conteudo: "UTI imediata. Risco de morte por hipertermia maligna e rabdomiólise.",
      alerta: { tipo: "perigo", texto: "Hipermia >41,1°C com rigidez muscular grave = mortalidade de até 25%. UTI imediata." },
      acoes: [
        "UTI — monitorização contínua, acesso venoso central",
        "Suspensão imediata de todos os serotoninérgicos",
        "Intubação orotraqueal + sedação se hipoxemia ou agitação extrema",
        "Paralisia neuromuscular se hiprtermia refratária (vecurônio) — NÃO use succinilcolina (hiperpotassemia + rabdomiólise)",
        "Resfriamento agressivo: compressas geladas, lavagem gástrica com soro frio, resfriamento externo",
        "Ciproeptadina via SNG + BZD EV",
        "Vasopressores se instabilidade hemodinâmica (noradrenalina é preferida)",
        "Hemodiálise se IRA grave",
      ],
    },
    {
      id: "ss_alternativas",
      tipo: "resultado",
      titulo: "Diagnósticos alternativos a considerar",
      conteudo: "Se critérios de SS negativos, considere:",
      acoes: [
        "Síndrome Neuroléptica Maligna: início insidioso, rigidez em 'cano de chumbo', bradicinesia, sem clonus",
        "Hipertermia maligna: exposição a anestésicos halogenados + succinilcolina, herança autossômica dominante",
        "Síndrome anticolinérgica: midríase, boca seca, retenção urinária, pele seca e quente, sem hiperreflexia",
        "Intoxicação por estimulantes (cocaína, MDMA): investigar uso",
        "Delirium febril por infecção do SNC: investigar com LCR",
      ],
    },
  ],
};

// ─── SÍNDROME NEUROLÉPTICA MALIGNA ────────────────────────────────────────────
const snm: Protocolo = {
  id: "snm",
  titulo: "Síndrome Neuroléptica Maligna",
  area: "snm",
  cor: "blue",
  descricao: "Emergência medicamentosa rara por bloqueio dopaminérgico — diagnóstico precoce é vital.",
  tempo_min: 8,
  plano: "free",
  referencia: "Levenson 1985; Gurrera RJ. Ann Intern Med. 2017; Strawn JR. Am J Psychiatry. 2007.",
  inicio: "snm_suspeita",
  nos: [
    {
      id: "snm_suspeita",
      tipo: "pergunta",
      titulo: "Suspeita de SNM",
      conteudo: "Há uso de agente bloqueador dopaminérgico recente ou interrupção de dopaminérgico?",
      sub: "Antipsicóticos típicos/atípicos, metoclopramida, domperidona, prometazina, droperidol. Ou interrupção abrupta de levodopa/amantadina em Parkinsonismo.",
      opcoes: [
        { label: "Sim — uso de bloqueador dopaminérgico confirmado", proximo: "snm_criterios" },
        { label: "Não — sem exposição a bloqueadores dopaminérgicos", proximo: "snm_alternativas" },
        { label: "Incerto — investigar medicações", proximo: "snm_drogas" },
      ],
    },
    {
      id: "snm_drogas",
      tipo: "info",
      titulo: "Agentes que causam SNM",
      conteudo: "Risco presente mesmo com doses terapêuticas habituais:",
      acoes: [
        "Antipsicóticos de alta potência típicos: haloperidol (maior risco), flufenazina",
        "Antipsicóticos de baixa potência: clorpromazina, tioridazina",
        "Antipsicóticos atípicos: clozapina, olanzapina, risperidona, quetiapina (menor risco mas possível)",
        "Antieméticos: metoclopramida (causa mais comum em pacientes não psiquiátricos!), domperidona",
        "Outros: droperidol, prometazina, lítio (aumenta risco quando combinado)",
        "Interrupção de agonistas dopaminérgicos: levodopa, amantadina, pramipexole",
        "Fatores de risco adicionais: agitação prévia, desidratação, uso de lítio, hipertireoidismo",
      ],
      proximo: "snm_suspeita",
    },
    {
      id: "snm_criterios",
      tipo: "info",
      titulo: "Critérios diagnósticos de SNM",
      conteudo: "Critérios de Levenson (diagnóstico = 3 maiores OU 2 maiores + 4 menores):",
      acoes: [
        "MAIORES: (1) Febre >38°C, (2) Rigidez muscular grave, (3) Elevação de CK (>4× normal)",
        "MENORES: taquicardia, hipertensão/hipotensão instável, taquipneia, sudorese, leucocitose, alteração do nível de consciência",
        "Evolução típica: 24–72h após início ou aumento de dose do antipsicótico",
        "DIFERENÇA CHAVE da SS: início insidioso (dias), rigidez 'cano de chumbo' (vs. clonus na SS), bradicinesia, sem hiperreflexia",
      ],
      proximo: "snm_laboratorio",
    },
    {
      id: "snm_laboratorio",
      tipo: "info",
      titulo: "Investigação laboratorial",
      conteudo: "Solicitar urgente:",
      alerta: { tipo: "atencao", texto: "CK muito elevada (>10.000 U/L) indica rabdomiólise com risco de IRA." },
      acoes: [
        "CK total (elevar até 100× o normal nos casos graves)",
        "Hemograma: leucocitose frequente",
        "Eletrólitos, ureia, creatinina (rabdomiólise → IRA)",
        "Transaminases, LDH",
        "Mioglobinúria: urina escura (cor de chá) — sinal de alerta",
        "Gasometria arterial se taquipneia/hipóxia",
        "Coagulograma (CIVD em casos graves)",
        "Hemocultura se febre (diagnóstico diferencial com infecção)",
        "LCR se suspeita de meningite/encefalite",
      ],
      proximo: "snm_manejo",
    },
    {
      id: "snm_manejo",
      tipo: "pergunta",
      titulo: "Gravidade clínica",
      conteudo: "Qual a intensidade dos achados?",
      opcoes: [
        { label: "Leve — febre baixa, rigidez discreta, CK levemente elevada, estável", proximo: "snm_leve" },
        { label: "Moderada — febre >39°C, rigidez importante, CK muito elevada, taquicardia", proximo: "snm_moderada" },
        { label: "Grave — febre >40°C, rigidez extrema, rebaixamento de consciência, instabilidade hemodinâmica", proximo: "snm_grave" },
      ],
    },
    {
      id: "snm_leve",
      tipo: "resultado",
      titulo: "SNM Leve — Manejo",
      conteudo: "Descontinuação + suporte + monitorização intensiva.",
      acoes: [
        "Suspender IMEDIATAMENTE o agente causador",
        "Internação com monitorização de sinais vitais a cada 2–4h",
        "Hidratação EV vigorosa (2–3 L/dia) — prevenir IRA por rabdomiólise",
        "Monitorar CK, creatinina e mioglobinúria a cada 6–12h",
        "Antipiréticos: paracetamol EV (AINEs menos eficazes nesta hipertermia central)",
        "Resfriamento físico se temperatura > 38,5°C",
        "Bromocriptina 2,5 mg VO a cada 8h (agonista dopaminérgico): considerar",
        "Não reintroduzir antipsicótico por mínimo 2 semanas após resolução",
      ],
    },
    {
      id: "snm_moderada",
      tipo: "resultado",
      titulo: "SNM Moderada — Manejo",
      conteudo: "UTI ou observação intensiva obrigatória.",
      alerta: { tipo: "atencao", texto: "Dantrolene está disponível em alguns hospitais — contatar farmácia hospitalar." },
      acoes: [
        "Suspensão imediata do antipsicótico causador",
        "UTI ou semi-intensiva — monitorização cardíaca contínua",
        "Hidratação agressiva EV: 3–5 L/dia com monitoramento da diurese (alvo >1 mL/kg/h)",
        "Bromocriptina 2,5–5 mg VO/SNG a cada 6–8h (máx 40 mg/dia)",
        "Amantadina 100 mg VO a cada 8h como alternativa à bromocriptina",
        "Dantrolene 1–2,5 mg/kg EV a cada 6h se rigidez grave (máx 10 mg/kg/dia)",
        "Benzodiazepínico para agitação: Lorazepam 2 mg EV",
        "Monitorar CK, creatinina, eletrólitos, LDH a cada 6–12h",
        "Hemodiálise preemptiva se IRA oligúrica",
      ],
    },
    {
      id: "snm_grave",
      tipo: "resultado",
      titulo: "SNM Grave — EMERGÊNCIA — UTI imediata",
      conteudo: "Mortalidade de até 20% — tratamento agressivo imediato.",
      alerta: { tipo: "perigo", texto: "NÃO use succinilcolina para intubação — risco de parada cardíaca por hipercalemia." },
      acoes: [
        "UTI IMEDIATA — monitorização invasiva (PAM, débito urinário contínuo)",
        "Intubação orotraqueal se Glasgow <12 ou hipóxia — rocurônio para indução (NÃO succinilcolina)",
        "Dantrolene 2,5 mg/kg EV a cada 6h — medicação específica para hipertermia maligna",
        "Bromocriptina 5 mg SNG a cada 4–6h",
        "Resfriamento externo agressivo: cobertores de resfriamento, banho de imersão fria",
        "Vasopressores se hipotensão: noradrenalina ou fenilefrina",
        "Plasmaférese ou hemodiálise se refratário",
        "Anticoagulação profilática para TVP (imobilização)",
        "Não reintroduzir antipsicótico por mínimo 4–6 semanas após resolução completa",
        "Alternativa futura: clozapina ou quetiapina (menor risco de recorrência de SNM)",
      ],
    },
    {
      id: "snm_alternativas",
      tipo: "resultado",
      titulo: "Diagnósticos alternativos",
      conteudo: "Se SNM improvável, considere:",
      acoes: [
        "Síndrome Serotoninérgica: clonus, hiperreflexia, início mais rápido (horas)",
        "Hipertermia maligna anestésica: exposição a halogenados + succinilcolina",
        "Encefalite autoimune (anti-NMDA): investigar com LCR e painel de anticorpos",
        "Síndrome anticolinérgica: midríase, boca seca, retenção urinária",
        "Febre, sepse ou infecção do SNC: LCR, hemoculturas",
        "Catatonia maligna: início sem agente bloqueador, resposta ao BZD",
      ],
    },
  ],
};

export const protocolos: Protocolo[] = [agitacao, delirium, suicidio, serotoninergica, snm];
