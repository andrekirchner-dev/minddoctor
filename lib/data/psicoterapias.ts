export type AbordagemTipo =
  | "cognitivo-comportamental"
  | "psicodinamica"
  | "humanista"
  | "sistemica"
  | "terceira-onda"
  | "integrativa";

export interface Psicoterapia {
  id: string;
  nome: string;
  sigla?: string;
  abordagem: AbordagemTipo;
  descricao: string;
  mecanismo: string;
  indicacoes: string[];
  contraindicacoes?: string[];
  duracao_sessoes: string;
  numero_sessoes: string;
  evidencia: "alta" | "moderada" | "emergente";
  referencia: string;
  tecnicas_principais: string[];
  nota_clinica?: string;
}

export const psicoterapias: Psicoterapia[] = [
  // ─── TCC ─────────────────────────────────────────────────────────────────────
  {
    id: "tcc",
    nome: "Terapia Cognitivo-Comportamental",
    sigla: "TCC",
    abordagem: "cognitivo-comportamental",
    descricao:
      "Abordagem estruturada, orientada a problemas e baseada em evidências que foca na relação entre pensamentos, emoções e comportamentos. Trabalha pensamentos automáticos negativos, crenças disfuncionais e padrões comportamentais maladaptativos. É a psicoterapia com o maior volume de evidências empíricas em psiquiatria.",
    mecanismo:
      "O modelo cognitivo postula que distorções cognitivas e crenças nucleares disfuncionais (Beck) medeiam a relação entre eventos e respostas emocionais/comportamentais. A modificação dessas cognições e dos comportamentos associados produz mudança terapêutica duradoura. A exposição gradual com prevenção de resposta é o componente comportamental central nos transtornos de ansiedade.",
    indicacoes: [
      "Transtorno depressivo maior",
      "Transtorno de ansiedade generalizada",
      "Transtorno do pânico",
      "Fobia social (transtorno de ansiedade social)",
      "Fobias específicas",
      "TOC (com ERP)",
      "TEPT",
      "Insônia (TCC-I)",
      "Bulimia nervosa",
      "Transtorno de dor crônica",
    ],
    contraindicacoes: [
      "Psicose ativa grave não estabilizada",
      "Déficit cognitivo grave que impeça a estrutura do modelo",
      "Crise suicida aguda sem estabilização prévia",
    ],
    duracao_sessoes: "50 min, semanal",
    numero_sessoes: "12–20 sessões (focal); 6–12 para fobias específicas",
    evidencia: "alta",
    referencia: "Beck AT. Cognitive Therapy of Depression. 1979; APA Treatment Guidelines.",
    tecnicas_principais: [
      "Identificação e registro de pensamentos automáticos",
      "Reestruturação cognitiva (questionamento socrático)",
      "Exposição gradual com prevenção de resposta (ERP) — para TOC e fobias",
      "Ativação comportamental — para depressão",
      "Psicoeducação sobre o modelo cognitivo",
    ],
    nota_clinica:
      "TCC-I (para insônia) é superior às hipnóticas em longo prazo e deve ser tratamento de primeira linha. Na depressão, associação TCC + antidepressivo é superior a ambos isoladamente em depressão moderada-grave.",
  },

  // ─── DBT ─────────────────────────────────────────────────────────────────────
  {
    id: "dbt",
    nome: "Terapia Comportamental Dialética",
    sigla: "DBT",
    abordagem: "terceira-onda",
    descricao:
      "Tratamento multimodal desenvolvido por Marsha Linehan especificamente para indivíduos com desregulação emocional grave e comportamentos suicidas/parasuicidas. Integra estratégias cognitivo-comportamentais com aceitação e dialética. O formato padrão inclui terapia individual, treinamento de habilidades em grupo, consultoria telefônica e equipe de consultoria do terapeuta.",
    mecanismo:
      "Fundamenta-se na teoria biossocial: desregulação emocional resulta da interação entre vulnerabilidade biológica e ambiente invalidante. A dialética central é a tensão entre aceitação (o paciente é válido como é) e mudança (mudança de comportamento é necessária). Quatro módulos de habilidades (mindfulness, tolerância ao mal-estar, regulação emocional, efetividade interpessoal) constroem uma 'life worth living'.",
    indicacoes: [
      "Transtorno de personalidade borderline (indicação primária)",
      "Comportamento suicida e parasuicida crônico",
      "Transtorno de uso de substâncias com desregulação emocional",
      "Transtorno alimentar (especialmente BED)",
      "Transtorno de estresse pós-traumático complexo (TEPT-C)",
      "Adolescentes com automutilação",
    ],
    contraindicacoes: [
      "Psicose ativa não tratada (requer estabilização prévia)",
      "Déficit cognitivo grave que impeça aprendizado das habilidades",
    ],
    duracao_sessoes: "50 min individual + 2h grupo/semana",
    numero_sessoes: "1 ano (ciclo completo padrão); adaptações existem para 6 meses",
    evidencia: "alta",
    referencia: "Linehan MM. Cognitive-Behavioral Treatment of Borderline Personality Disorder. 1993; Linehan MM et al. Arch Gen Psychiatry. 2006.",
    tecnicas_principais: [
      "Análise em cadeia (chain analysis) de comportamentos-problema",
      "Habilidades de mindfulness (mente sábia, mente emocional, mente racional)",
      "Tolerância ao mal-estar: TIPP, ACCEPTS, autossuficiência",
      "Regulação emocional: check the facts, ação oposta ao impulso emocional",
      "Efetividade interpessoal: DEAR MAN, GIVE, FAST",
    ],
    nota_clinica:
      "Única psicoterapia com nível A de evidência para redução de tentativas de suicídio e automutilação em TBP. A consulta telefônica entre sessões é componente essencial — serve para generalização de habilidades, não como suporte emocional genérico.",
  },

  // ─── ACT ─────────────────────────────────────────────────────────────────────
  {
    id: "act",
    nome: "Terapia de Aceitação e Compromisso",
    sigla: "ACT",
    abordagem: "terceira-onda",
    descricao:
      "Abordagem transdiagnóstica da terceira onda cognitivo-comportamental que foca na aceitação de experiências internas indesejadas, desfusão cognitiva (mudar a relação com os pensamentos) e compromisso com ações alinhadas aos valores pessoais. Ao contrário da TCC clássica, não visa eliminar sintomas, mas mudar a relação funcional com eles.",
    mecanismo:
      "Baseia-se na Teoria Relacional de Enquadramento (RFT) e postula que a inflexibilidade psicológica — evitação experiencial, fusão cognitiva, dominância do self conceituado — é o núcleo da psicopatologia transdiagnóstica. O modelo Hexaflex trabalha seis processos centrais: aceitação, desfusão, self como contexto, momento presente, valores e ação comprometida.",
    indicacoes: [
      "Transtornos de ansiedade (ansiedade generalizada, pânico, fobia social)",
      "Depressão, especialmente recorrente",
      "Dor crônica",
      "Transtorno obsessivo-compulsivo",
      "Transtorno de estresse pós-traumático",
      "Transtornos do uso de substâncias",
      "Condições clínicas crônicas (oncologia, doenças autoimunes)",
    ],
    duracao_sessoes: "50 min, semanal",
    numero_sessoes: "8–16 sessões (focal); pode ser mais longo em casos complexos",
    evidencia: "alta",
    referencia: "Hayes SC, Strosahl KD, Wilson KG. Acceptance and Commitment Therapy. 2ª ed. 2012.",
    tecnicas_principais: [
      "Desfusão cognitiva (distanciamento dos pensamentos, ex: 'Estou tendo o pensamento de que...')",
      "Exercícios de aceitação e abertura experiencial",
      "Clarificação de valores pessoais (cartão de valores, bússola de vida)",
      "Ação comprometida alinhada a valores",
      "Exercícios de mindfulness e self como contexto (céu e nuvens)",
    ],
    nota_clinica:
      "Particularmente útil para pacientes que já fizeram TCC clássica sem resposta adequada, e em condições de dor crônica onde a luta contra os sintomas é parte do problema. Eficaz como intervenção transdiagnóstica.",
  },

  // ─── PSICANÁLISE / PSICODINÂMICA ─────────────────────────────────────────────
  {
    id: "psicodinamica",
    nome: "Psicoterapia Psicodinâmica",
    abordagem: "psicodinamica",
    descricao:
      "Psicoterapia derivada da psicanálise que trabalha com a influência de conflitos inconscientes, padrões de relacionamento internalizados (relações objetais), mecanismos de defesa e experiências do desenvolvimento no sofrimento atual. Na forma focal (de tempo limitado), foca em um conflito central definido colaborativamente; na forma aberta, explora mais amplamente a vida mental do paciente.",
    mecanismo:
      "Parte do pressuposto de que conflitos inconscientes, padrões relacionais derivados de vínculos precoces e mecanismos de defesa mal-adaptativos produzem sintomas. A mudança terapêutica ocorre por meio da elaboração da transferência (repetição na relação terapêutica de padrões relacionais antigos), aumento da insight, interpretação e experiência relacional correctiva.",
    indicacoes: [
      "Transtornos de personalidade",
      "Depressão crônica e recorrente",
      "Transtornos de ansiedade",
      "Transtornos somáticos (somatização, conversão)",
      "Transtornos alimentares",
      "Dificuldades relacionais e interpessoais",
      "Grief complicado",
    ],
    contraindicacoes: [
      "Psicose aguda não estabilizada",
      "Crise suicida aguda",
      "Paciente com capacidade reflexiva muito limitada (ego muito frágil para tolerar interpretações)",
    ],
    duracao_sessoes: "50 min; 1–3 vezes/semana",
    numero_sessoes: "12–40 sessões (focal); indeterminado (psicoterapia de longo prazo)",
    evidencia: "alta",
    referencia: "Shedler J. Am Psychol. 2010; Leichsenring F et al. JAMA Psychiatry. 2015.",
    tecnicas_principais: [
      "Interpretação de conteúdos inconscientes e padrões relacionais",
      "Análise da transferência e contratransferência",
      "Identificação e elaboração de mecanismos de defesa",
      "Escuta flutuante e associação livre",
      "Foco no conflito central (CCRT — Tema Central de Conflito Relacional)",
    ],
    nota_clinica:
      "Meta-análises de Shedler (2010) demonstram tamanho de efeito comparável ao da TCC. Os efeitos da psicoterapia psicodinâmica tendem a continuar crescendo após o término do tratamento — 'efeito de adormecimento' (sleeper effect). TFP (Terapia Focada na Transferência) é variante específica para TBP com excelente evidência.",
  },

  // ─── EMDR ────────────────────────────────────────────────────────────────────
  {
    id: "emdr",
    nome: "Dessensibilização e Reprocessamento por Movimentos Oculares",
    sigla: "EMDR",
    abordagem: "integrativa",
    descricao:
      "Abordagem integrativa que usa estimulação bilateral (movimentos oculares, tapping ou sons alternados) enquanto o paciente evoca memórias traumáticas, facilitando o reprocessamento adaptativo da memória traumática. Desenvolvida por Francine Shapiro em 1987 e reconhecida como tratamento de primeira linha para TEPT pela OMS, APA e ISTSS.",
    mecanismo:
      "O Modelo de Processamento Adaptativo de Informação (AIP) postula que traumas não processados ficam armazenados em redes de memória disfuncionais, preservando a perturbação emocional original. A estimulação bilateral durante a ativação da memória traumática facilita o processamento adaptativo — conectando a memória traumática a redes associativas mais adaptativas. Mecanismo neurobiológico ainda investigado: hipóteses envolvem interrupção da memória de trabalho e ativação de processamento similar ao REM.",
    indicacoes: [
      "TEPT (indicação primária — recomendação grau A/nível 1)",
      "Trauma simples e trauma complexo",
      "TEPT em criança e adolescente",
      "Fobias específicas",
      "Luto complicado",
      "Transtorno do pânico com eventos traumáticos precipitantes",
      "Depressão com componente traumático",
    ],
    contraindicacoes: [
      "Dissociação grave não estabilizada (necessita estabilização prévia — fase 1–2 do protocolo)",
      "Psicose ativa",
      "Epilepsia não controlada",
      "Gravidez (cuidado com estimulação bilateral intensa)",
    ],
    duracao_sessoes: "60–90 min, semanal",
    numero_sessoes: "6–12 sessões para trauma simples; 20–40+ para trauma complexo/TEPT-C",
    evidencia: "alta",
    referencia: "Shapiro F. Eye Movement Desensitization and Reprocessing. 3ª ed. 2018; WHO Guidelines PTSD 2013.",
    tecnicas_principais: [
      "Protocolo de 8 fases (história, preparação, avaliação, dessensibilização, instalação, body scan, fechamento, reavaliação)",
      "Estimulação bilateral durante ativação do alvo traumático",
      "Cognições negativas e positivas para quantificação da mudança",
      "Escala de Unidades Subjetivas de Perturbação (SUDS) e VOC",
      "Técnicas de estabilização (lugar seguro, container) para preparação",
    ],
    nota_clinica:
      "Contrariamente a percepções antigas, EMDR não é apenas movimentos oculares — a exposição à memória traumática em contexto de segurança é o componente central. Pode ser usado sem movimentos oculares (tapping bilateral). Eficaz em TEPT em apenas 3 sessões para trauma simples nos estudos de Shapiro.",
  },

  // ─── TERAPIA DE ESQUEMAS ──────────────────────────────────────────────────────
  {
    id: "terapia-esquemas",
    nome: "Terapia de Esquemas",
    sigla: "TE",
    abordagem: "cognitivo-comportamental",
    descricao:
      "Terapia integrativa desenvolvida por Jeffrey Young que expande a TCC clássica para tratar transtornos de personalidade e condições crônicas resistentes a tratamentos breves. Trabalha com Esquemas Iniciais Desadaptativos (EIDs) — padrões emocionais e cognitivos profundos formados na infância — e com os modos de esquema (estados emocionais dominantes do momento).",
    mecanismo:
      "Esquemas Iniciais Desadaptativos são estruturas cognitivo-afetivas estáveis, formadas por necessidades emocionais não atendidas na infância, que se perpetuam ao longo da vida por meio de três respostas de enfrentamento: evitação, compensação e manutenção. Dezoito EIDs agrupados em 5 domínios (desconexão/rejeição, autonomia prejudicada, limites prejudicados, orientação para o outro, hipervigilância). O trabalho terapêutico inclui experiências emocionais corretivas via modo do Adulto Saudável.",
    indicacoes: [
      "Transtornos de personalidade (borderline, narcisista, evitativo, dependente)",
      "Depressão crônica resistente",
      "Transtornos alimentares",
      "Problemas relacionais crônicos",
      "Pacientes com histórico de trauma na infância",
      "TCC refratária",
    ],
    duracao_sessoes: "50 min, semanal",
    numero_sessoes: "25–50+ sessões (tratamento longo); grupos de 8–20 sessões para formato abreviado",
    evidencia: "moderada",
    referencia: "Young JE, Klosko JS, Weishaar ME. Schema Therapy. 2003; Giesen-Bloo J et al. Arch Gen Psychiatry. 2006.",
    tecnicas_principais: [
      "Inventário de Esquemas de Young (YSQ) para identificação dos EIDs",
      "Análise dos modos de esquema e do 'criança vulnerável', 'pai punitivo' e 'adulto saudável'",
      "Imagens mentais com rescritura (imagery rescripting) — para mudança emocional profunda",
      "Diálogos de cadeiras (empty chair) — para trabalhar conflitos internos entre modos",
      "Reparentalidade limitada na relação terapêutica",
    ],
    nota_clinica:
      "Estudo de Giesen-Bloo et al. (2006) demonstrou superioridade da TE sobre TFP (Terapia Focada na Transferência) para TBP em critérios de recovery (45,5% vs 23,8%). Formato em grupo é custo-efetivo para contextos de saúde pública.",
  },

  // ─── TIP ─────────────────────────────────────────────────────────────────────
  {
    id: "tip",
    nome: "Terapia Interpessoal",
    sigla: "TIP",
    abordagem: "integrativa",
    descricao:
      "Psicoterapia de tempo limitado, manualizável, desenvolvida por Klerman e Weissman, que foca no impacto dos relacionamentos interpessoais nos sintomas psiquiátricos — especialmente na depressão. Parte do pressuposto de que os episódios depressivos estão associados a problemas interpessoais em uma de quatro áreas focais. Trabalho estruturado em três fases.",
    mecanismo:
      "Baseia-se na teoria interpessoal de Sullivan e na teoria do apego. Não trabalha conflitos intrapsíquicos ou cognições, mas sim a comunicação, os papéis sociais e as relações interpessoais. A mudança nos padrões interpessoais disfuncionais leva à redução dos sintomas depressivos. Cada tratamento foca em 1–2 das quatro áreas problemáticas identificadas na avaliação.",
    indicacoes: [
      "Depressão maior (indicação primária com forte evidência)",
      "Depressão na gravidez e puerpério",
      "Luto complicado",
      "Bulimia nervosa",
      "Depressão bipolar (em combinação com farmacoterapia)",
      "Depressão em adolescentes",
    ],
    duracao_sessoes: "50 min, semanal",
    numero_sessoes: "12–16 sessões (focal; 3 fases: inicial 1–3, média 4–13, final 14–16)",
    evidencia: "alta",
    referencia: "Klerman GL, Weissman MM et al. Interpersonal Psychotherapy of Depression. 1984; Cuijpers P et al. Am J Psychiatry. 2011.",
    tecnicas_principais: [
      "Inventário interpessoal (mapeamento das relações significativas do paciente)",
      "Identificação da área focal (luto, transições de papel, disputas de papel, déficits interpessoais)",
      "Análise de comunicação e treinamento de habilidades de comunicação",
      "Exploração das mudanças desejadas nas relações",
      "Dramatização (role play) de situações interpessoais",
    ],
    nota_clinica:
      "Efficacy comparável à TCC para depressão aguda. Preferível quando os problemas interpessoais são claramente precipitantes do episódio depressivo. Amplamente utilizada no SUS em formato de grupo (TIPg) em alguns serviços de saúde mental.",
  },

  // ─── MBCT ────────────────────────────────────────────────────────────────────
  {
    id: "mbct",
    nome: "Terapia Cognitiva Baseada em Mindfulness",
    sigla: "MBCT",
    abordagem: "terceira-onda",
    descricao:
      "Intervenção em grupo de 8 semanas que integra práticas de mindfulness (atenção plena) com elementos da TCC, desenvolvida por Segal, Williams e Teasdale especificamente para prevenir recaída depressiva. É a abordagem de escolha para manutenção em pacientes com depressão recorrente (3 ou mais episódios), onde reduz recaída em ~50% comparada ao tratamento habitual.",
    mecanismo:
      "Fundamenta-se na teoria da reatividade cognitiva: em pacientes com histórico de depressão, estados de humor leve negativo reativam padrões de pensamento rumativo e depressogênico que podem precipitar recaída. O treinamento em mindfulness desenvolve metacognição descentrada — a capacidade de observar pensamentos como eventos mentais passageiros, sem se fundir com eles — interrompendo o ciclo de ruminação.",
    indicacoes: [
      "Prevenção de recaída em depressão recorrente (3+ episódios — indicação primária, grau A)",
      "Depressão atual em remissão parcial",
      "Ansiedade generalizada",
      "Transtorno bipolar (manutenção, fase eutímica)",
      "Burnout e estresse crônico",
      "Dor crônica",
    ],
    contraindicacoes: [
      "Depressão aguda grave (indicado apenas para prevenção/manutenção, não para episódio agudo)",
      "Psicose ativa",
      "Trauma severo não trabalhado (mindfulness pode deflagrar flashbacks)",
    ],
    duracao_sessoes: "2h grupo semanal + práticas diárias de 45 min entre sessões",
    numero_sessoes: "8 sessões semanais (protocolo padrão) + prática diária entre sessões",
    evidencia: "alta",
    referencia: "Segal ZV, Williams JMG, Teasdale JD. Mindfulness-Based Cognitive Therapy for Depression. 2ª ed. 2013; Kuyken W et al. JAMA Psychiatry. 2016.",
    tecnicas_principais: [
      "Escaneamento corporal (body scan)",
      "Meditação de atenção plena na respiração e nos sons",
      "Mindfulness em atividades cotidianas (yoga suave, movimento consciente)",
      "Espaço de respiração de 3 minutos (prática âncora para uso na vida diária)",
      "Identificação de padrões de ruminação e uso de mindfulness como resposta habilidosa",
    ],
    nota_clinica:
      "MBCT é recomendada pelo NICE (UK) como tratamento de primeira linha para prevenção de recaída depressiva em pacientes com 3+ episódios. Kuyken et al. (2016) demonstraram que MBCT é equivalente a antidepressivos de manutenção na prevenção de recaída e superior em qualidade de vida. Pode ser usado como alternativa à farmacoterapia de manutenção em pacientes que preferem abordagem não medicamentosa.",
  },
];
