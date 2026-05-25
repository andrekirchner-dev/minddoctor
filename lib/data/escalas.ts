export interface ItemEscala {
  id: number;
  pergunta: string;
  subtexto?: string;
  opcoes: { valor: number; label: string }[];
}

export interface FaixaEscala {
  min: number;
  max: number;
  label: string;
  cor: "verde" | "amarelo" | "laranja" | "vermelho";
  descricao: string;
  conduta?: string;
}

export interface Escala {
  id: string;
  sigla: string;
  nome: string;
  area: "humor" | "ansiedade" | "psicose" | "suicidio" | "alcool" | "cognicao" | "mania" | "trauma";
  descricao: string;
  instrucoes: string;
  tempo_min: number;
  plano: "free" | "pro";
  referencia: string;
  itens: ItemEscala[];
  faixas: FaixaEscala[];
  nota_clinica?: string;
}

const opcoes03 = (labels: [string, string, string, string]) =>
  labels.map((label, i) => ({ valor: i, label }));

// ─── PHQ-9 ───────────────────────────────────────────────────────────────────
export const PHQ9: Escala = {
  id: "phq9",
  sigla: "PHQ-9",
  nome: "Patient Health Questionnaire-9",
  area: "humor",
  descricao: "Rastreio e monitoramento de depressão. Amplamente validado em atenção primária e psiquiatria.",
  instrucoes: "Durante as ÚLTIMAS 2 SEMANAS, com que frequência você foi incomodado pelos problemas abaixo?",
  tempo_min: 5,
  plano: "free",
  referencia: "Kroenke K, Spitzer RL, Williams JBW. JAMA. 2001;286(20):2725-2730.",
  nota_clinica: "Pontuação ≥10 sugere depressão moderada. Item 9 (pensamentos de morte) deve sempre ser avaliado independente do score total.",
  itens: [
    { id: 1, pergunta: "Pouco interesse ou prazer em fazer as coisas", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 2, pergunta: "Sentir-se para baixo, deprimido(a) ou sem perspectiva", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 3, pergunta: "Dificuldade para dormir, ficar dormindo ou dormir mais do que de costume", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 4, pergunta: "Sentir-se cansado(a) ou com pouca energia", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 5, pergunta: "Falta de apetite ou comer demais", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 6, pergunta: "Sentir-se mal consigo mesmo(a) — ou que é um fracasso ou que decepcionou sua família ou a você mesmo(a)", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 7, pergunta: "Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 8, pergunta: "Lentidão para se movimentar ou falar, a ponto de outras pessoas perceberem? Ou então o oposto — mais agitado(a) ou inquieto(a) do que de costume", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 9, pergunta: "Pensar em se machucar de alguma forma ou que seria melhor estar morto(a)", subtexto: "⚠ Avaliar risco de suicídio independente do score total", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
  ],
  faixas: [
    { min: 0,  max: 4,  label: "Mínimo",              cor: "verde",    descricao: "Sem depressão significativa.", conduta: "Monitorar. Sem tratamento específico indicado." },
    { min: 5,  max: 9,  label: "Leve",                cor: "amarelo",  descricao: "Sintomas depressivos leves.", conduta: "Psicoeducação, atividade física, revisão em 4–6 semanas." },
    { min: 10, max: 14, label: "Moderado",             cor: "laranja",  descricao: "Depressão moderada.", conduta: "Considerar psicoterapia e/ou antidepressivo. Reavaliar em 2–4 semanas." },
    { min: 15, max: 19, label: "Moderadamente Grave",  cor: "laranja",  descricao: "Depressão moderadamente grave.", conduta: "Tratamento ativo recomendado: psicofarmacologia + psicoterapia." },
    { min: 20, max: 27, label: "Grave",                cor: "vermelho", descricao: "Depressão grave.", conduta: "Tratamento imediato. Avaliar internação, risco de suicídio e ajuste medicamentoso." },
  ],
};

// ─── GAD-7 ───────────────────────────────────────────────────────────────────
export const GAD7: Escala = {
  id: "gad7",
  sigla: "GAD-7",
  nome: "Generalized Anxiety Disorder-7",
  area: "ansiedade",
  descricao: "Rastreio e monitoramento de transtorno de ansiedade generalizada.",
  instrucoes: "Durante as ÚLTIMAS 2 SEMANAS, com que frequência você foi incomodado pelos problemas abaixo?",
  tempo_min: 3,
  plano: "free",
  referencia: "Spitzer RL et al. Arch Intern Med. 2006;166(10):1092-1097.",
  nota_clinica: "Pontuação ≥10 indica TAG moderado-grave. Útil também para rastreio de outros transtornos de ansiedade.",
  itens: [
    { id: 1, pergunta: "Sentir-se nervoso(a), ansioso(a) ou no limite", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 2, pergunta: "Não ser capaz de impedir ou de controlar as preocupações", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 3, pergunta: "Preocupar-se muito com diversas coisas", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 4, pergunta: "Dificuldade para relaxar", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 5, pergunta: "Ficar tão agitado(a) que se torna difícil permanecer sentado(a)", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 6, pergunta: "Sentir-se facilmente irritado(a) ou irritável", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
    { id: 7, pergunta: "Sentir medo como se algo terrível pudesse acontecer", opcoes: opcoes03(["Nenhuma vez","Vários dias","Mais da metade dos dias","Quase todos os dias"]) },
  ],
  faixas: [
    { min: 0,  max: 4,  label: "Mínimo",   cor: "verde",    descricao: "Ansiedade mínima.", conduta: "Sem intervenção específica indicada." },
    { min: 5,  max: 9,  label: "Leve",     cor: "amarelo",  descricao: "Ansiedade leve.", conduta: "Psicoeducação, técnicas de relaxamento. Reavaliar." },
    { min: 10, max: 14, label: "Moderado", cor: "laranja",  descricao: "Ansiedade moderada.", conduta: "Psicoterapia (TCC) e/ou farmacoterapia (ISRS/IRSN)." },
    { min: 15, max: 21, label: "Grave",    cor: "vermelho", descricao: "Ansiedade grave.", conduta: "Tratamento ativo. Considerar combinação psicoterapia + farmacoterapia." },
  ],
};

// ─── HAM-D 17 ────────────────────────────────────────────────────────────────
export const HAMD: Escala = {
  id: "hamd17",
  sigla: "HAM-D 17",
  nome: "Hamilton Depression Rating Scale",
  area: "humor",
  descricao: "Escala heteroaplicada para avaliação da gravidade da depressão. Padrão-ouro em ensaios clínicos.",
  instrucoes: "Avaliação clínica da semana passada pelo aplicador. Selecione a pontuação que melhor descreve o paciente.",
  tempo_min: 15,
  plano: "pro",
  referencia: "Hamilton M. J Neurol Neurosurg Psychiatry. 1960;23:56-62.",
  nota_clinica: "Escala heteroaplicada — deve ser preenchida pelo clínico, não pelo paciente. Considera comportamento e relato da última semana.",
  itens: [
    { id: 1, pergunta: "Humor deprimido (tristeza, sem esperança, desamparado, inútil)", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Estes sentimentos são relatados somente quando perguntado" },{ valor: 2, label: "Estes sentimentos são relatados espontaneamente" },{ valor: 3, label: "Comunica sentimentos não verbalmente" },{ valor: 4, label: "Só expressa estes sentimentos verbal e não verbalmente de forma espontânea" }] },
    { id: 2, pergunta: "Sentimentos de culpa", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Auto-recriminação, sente que decepcionou as pessoas" },{ valor: 2, label: "Ideias de culpa ou ruminação de erros passados" },{ valor: 3, label: "Doença atual vista como punição, delírios de culpa" },{ valor: 4, label: "Ouve vozes acusatórias ou denunciatórias" }] },
    { id: 3, pergunta: "Suicídio", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Sente que a vida não vale a pena" },{ valor: 2, label: "Deseja estar morto ou tem pensamentos sobre morte" },{ valor: 3, label: "Ideias ou gestos suicidas" },{ valor: 4, label: "Tentativas de suicídio" }] },
    { id: 4, pergunta: "Insônia inicial (dificuldade para adormecer)", opcoes: [{ valor: 0, label: "Sem dificuldade" },{ valor: 1, label: "Queixa-se de dificuldade ocasional" },{ valor: 2, label: "Queixa-se de dificuldade para dormir todas as noites" }] },
    { id: 5, pergunta: "Insônia intermediária (acorda no meio da noite)", opcoes: [{ valor: 0, label: "Sem dificuldade" },{ valor: 1, label: "Paciente queixa-se de agitação e distúrbio do sono" },{ valor: 2, label: "Acorda à noite" }] },
    { id: 6, pergunta: "Insônia tardia (acorda cedo e não consegue voltar a dormir)", opcoes: [{ valor: 0, label: "Sem dificuldade" },{ valor: 1, label: "Acorda no início da manhã, mas volta a dormir" },{ valor: 2, label: "Incapaz de voltar a dormir se levantar" }] },
    { id: 7, pergunta: "Trabalho e atividades (produtividade e participação)", opcoes: [{ valor: 0, label: "Sem dificuldade" },{ valor: 1, label: "Pensamentos e sentimentos de incapacidade, fadiga" },{ valor: 2, label: "Perda de interesse em atividades ou declínio real" },{ valor: 3, label: "Diminuição do tempo gasto em atividades — <3h/dia" },{ valor: 4, label: "Parou de trabalhar por doença" }] },
    { id: 8, pergunta: "Retardo (lentidão de pensamento e fala, concentração diminuída)", opcoes: [{ valor: 0, label: "Normal" },{ valor: 1, label: "Leve retardo na entrevista" },{ valor: 2, label: "Retardo óbvio na entrevista" },{ valor: 3, label: "Entrevista difícil" },{ valor: 4, label: "Entrevista impossível" }] },
    { id: 9, pergunta: "Agitação psicomotora", opcoes: [{ valor: 0, label: "Nenhuma" },{ valor: 1, label: "Inquietação" },{ valor: 2, label: "Bruxismo, torcendo as mãos, inquietação extrema" }] },
    { id: 10, pergunta: "Ansiedade psíquica", opcoes: [{ valor: 0, label: "Sem dificuldade" },{ valor: 1, label: "Tensão e irritabilidade subjetivas" },{ valor: 2, label: "Preocupa-se com assuntos menores" },{ valor: 3, label: "Atitude apreensiva aparente na face ou fala" },{ valor: 4, label: "Medos expressos sem questionamento" }] },
    { id: 11, pergunta: "Ansiedade somática (físico: GI, cardiovascular, etc.)", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Leve" },{ valor: 2, label: "Moderada" },{ valor: 3, label: "Grave" },{ valor: 4, label: "Incapacitante" }] },
    { id: 12, pergunta: "Sintomas somáticos GI (apetite, digestão)", opcoes: [{ valor: 0, label: "Nenhum" },{ valor: 1, label: "Perda de apetite, mas come sem pressão" },{ valor: 2, label: "Dificuldade para comer — precisa ser persuadido" }] },
    { id: 13, pergunta: "Sintomas somáticos gerais (fadiga, fraqueza)", opcoes: [{ valor: 0, label: "Nenhum" },{ valor: 1, label: "Peso nos membros, costas ou cabeça; dores lombares" },{ valor: 2, label: "Qualquer sintoma somático nítido" }] },
    { id: 14, pergunta: "Sintomas genitais (libido, distúrbios menstruais)", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Leve" },{ valor: 2, label: "Grave" }] },
    { id: 15, pergunta: "Hipocondria", opcoes: [{ valor: 0, label: "Não presente" },{ valor: 1, label: "Auto-observação excessiva" },{ valor: 2, label: "Preocupação com saúde" },{ valor: 3, label: "Queixas frequentes, pedidos de ajuda" },{ valor: 4, label: "Delírio hipocondríaco" }] },
    { id: 16, pergunta: "Perda de peso", opcoes: [{ valor: 0, label: "Nenhuma" },{ valor: 1, label: "Provável perda associada à doença atual" },{ valor: 2, label: "Perda de peso definida (≥0,5 kg/semana)" }] },
    { id: 17, pergunta: "Insight (consciência da doença)", opcoes: [{ valor: 0, label: "Reconhece estar deprimido e doente" },{ valor: 1, label: "Reconhece estar doente mas atribui a causas externas" },{ valor: 2, label: "Nega estar doente" }] },
  ],
  faixas: [
    { min: 0,  max: 7,  label: "Normal / Remissão", cor: "verde",    descricao: "Sem depressão significativa.", conduta: "Manutenção ou alta em tratamento." },
    { min: 8,  max: 13, label: "Leve",               cor: "amarelo",  descricao: "Depressão leve.", conduta: "Monitorar. Psicoterapia indicada." },
    { min: 14, max: 18, label: "Moderado",            cor: "laranja",  descricao: "Depressão moderada.", conduta: "Psicofarmacologia + psicoterapia." },
    { min: 19, max: 22, label: "Grave",               cor: "vermelho", descricao: "Depressão grave.", conduta: "Tratamento ativo. Avaliar internação." },
    { min: 23, max: 52, label: "Muito Grave",         cor: "vermelho", descricao: "Depressão muito grave.", conduta: "Intervenção urgente. Internação, ECT a considerar." },
  ],
};

// ─── BPRS-18 ─────────────────────────────────────────────────────────────────
const opcoes17 = [
  { valor: 1, label: "1 — Não avaliável" },
  { valor: 2, label: "2 — Normal" },
  { valor: 3, label: "3 — Muito leve" },
  { valor: 4, label: "4 — Leve" },
  { valor: 5, label: "5 — Moderado" },
  { valor: 6, label: "6 — Moderadamente grave" },
  { valor: 7, label: "7 — Grave" },
];

export const BPRS: Escala = {
  id: "bprs",
  sigla: "BPRS-18",
  nome: "Brief Psychiatric Rating Scale",
  area: "psicose",
  descricao: "Avaliação heteroaplicada de sintomas psiquiátricos amplos, especialmente psicóticos. Padrão em ensaios com antipsicóticos.",
  instrucoes: "Avalie a gravidade de cada sintoma na ÚLTIMA SEMANA com base na entrevista clínica. Escala de 1 a 7.",
  tempo_min: 20,
  plano: "free",
  referencia: "Overall JE, Gorham DR. Psychol Rep. 1962;10:799-812.",
  nota_clinica: "Escala heteroaplicada. Score = soma dos 18 itens (18–126). Baseline antes de iniciar antipsicótico é recomendado.",
  itens: [
    { id: 1,  pergunta: "Preocupações somáticas — preocupação com saúde física", opcoes: opcoes17 },
    { id: 2,  pergunta: "Ansiedade — preocupação, medo e apreensão excessivos", opcoes: opcoes17 },
    { id: 3,  pergunta: "Retraimento emocional — déficit de relação afetiva com entrevistador", opcoes: opcoes17 },
    { id: 4,  pergunta: "Desorganização conceitual — grau de confusão no pensamento", opcoes: opcoes17 },
    { id: 5,  pergunta: "Autovaloração — autoestima exagerada, grandiosidade", opcoes: opcoes17 },
    { id: 6,  pergunta: "Ansiedade somática — manifestações físicas de ansiedade", opcoes: opcoes17 },
    { id: 7,  pergunta: "Estranheza motora — bizarria de postura, maneirismos", opcoes: opcoes17 },
    { id: 8,  pergunta: "Grandiosidade — opinião exagerada sobre si mesmo ou poderes especiais", opcoes: opcoes17 },
    { id: 9,  pergunta: "Humor depressivo — tristeza, desesperança, pessimismo", opcoes: opcoes17 },
    { id: 10, pergunta: "Hostilidade — animosidade, desprezo, beligerância", opcoes: opcoes17 },
    { id: 11, pergunta: "Desconfiança — convicção de que outros têm intenções hostis", opcoes: opcoes17 },
    { id: 12, pergunta: "Alucinações — percepções sem estímulo externo real", opcoes: opcoes17 },
    { id: 13, pergunta: "Retardo motor — lentidão de movimento e fala", opcoes: opcoes17 },
    { id: 14, pergunta: "Não cooperação — resistência, falta de colaboração", opcoes: opcoes17 },
    { id: 15, pergunta: "Conteúdo do pensamento incomum — ideias estranhas, bizarras", opcoes: opcoes17 },
    { id: 16, pergunta: "Afeto embotado — redução do tônus emocional e expressão", opcoes: opcoes17 },
    { id: 17, pergunta: "Agitação — hiperatividade motora e ansiedade", opcoes: opcoes17 },
    { id: 18, pergunta: "Desorientação — confusão quanto a pessoas, local, tempo", opcoes: opcoes17 },
  ],
  faixas: [
    { min: 18, max: 30, label: "Dentro da normalidade", cor: "verde",    descricao: "Sem psicopatologia significativa.", conduta: "Monitorar." },
    { min: 31, max: 40, label: "Leve",                  cor: "amarelo",  descricao: "Psicopatologia leve.", conduta: "Monitorar de perto, avaliar início de tratamento." },
    { min: 41, max: 60, label: "Moderado",               cor: "laranja",  descricao: "Psicopatologia moderada.", conduta: "Tratamento ativo indicado." },
    { min: 61, max: 126,label: "Grave",                  cor: "vermelho", descricao: "Psicopatologia grave.", conduta: "Tratamento urgente. Avaliar internação." },
  ],
};

// ─── AUDIT ───────────────────────────────────────────────────────────────────
export const AUDIT: Escala = {
  id: "audit",
  sigla: "AUDIT",
  nome: "Alcohol Use Disorders Identification Test",
  area: "alcool",
  descricao: "Rastreio de uso nocivo e dependência de álcool. Desenvolvido pela OMS.",
  instrucoes: "Perguntas sobre uso de álcool no ÚLTIMO ANO. Selecione a resposta que melhor se aplica.",
  tempo_min: 5,
  plano: "free",
  referencia: "Saunders JB et al. Addiction. 1993;88(6):791-804. WHO, 2001.",
  nota_clinica: "AUDIT-C: primeiros 3 itens (pontuação 0–12). ≥4 homens / ≥3 mulheres = rastreio positivo.",
  itens: [
    { id: 1, pergunta: "Com que frequência você consome bebidas alcoólicas?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Mensalmente ou menos" },{ valor: 2, label: "2 a 4 vezes ao mês" },{ valor: 3, label: "2 a 3 vezes por semana" },{ valor: 4, label: "4 ou mais vezes por semana" }] },
    { id: 2, pergunta: "Quantas doses você consome em um dia típico quando bebe?", subtexto: "1 dose = 350ml cerveja, 150ml vinho ou 45ml destilado", opcoes: [{ valor: 0, label: "1 ou 2" },{ valor: 1, label: "3 ou 4" },{ valor: 2, label: "5 ou 6" },{ valor: 3, label: "7 a 9" },{ valor: 4, label: "10 ou mais" }] },
    { id: 3, pergunta: "Com que frequência você consome 5 ou mais doses em uma única ocasião?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Menos de uma vez ao mês" },{ valor: 2, label: "Mensalmente" },{ valor: 3, label: "Semanalmente" },{ valor: 4, label: "Diariamente ou quase" }] },
    { id: 4, pergunta: "Quantas vezes no último ano você achou que não conseguia parar de beber depois de começar?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Menos de uma vez ao mês" },{ valor: 2, label: "Mensalmente" },{ valor: 3, label: "Semanalmente" },{ valor: 4, label: "Diariamente ou quase" }] },
    { id: 5, pergunta: "Quantas vezes no último ano você deixou de fazer o que era esperado por causa do álcool?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Menos de uma vez ao mês" },{ valor: 2, label: "Mensalmente" },{ valor: 3, label: "Semanalmente" },{ valor: 4, label: "Diariamente ou quase" }] },
    { id: 6, pergunta: "Quantas vezes você precisou beber pela manhã para se sentir melhor depois de ter bebido muito?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Menos de uma vez ao mês" },{ valor: 2, label: "Mensalmente" },{ valor: 3, label: "Semanalmente" },{ valor: 4, label: "Diariamente ou quase" }] },
    { id: 7, pergunta: "Com que frequência você sentiu culpa ou remorso depois de beber?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Menos de uma vez ao mês" },{ valor: 2, label: "Mensalmente" },{ valor: 3, label: "Semanalmente" },{ valor: 4, label: "Diariamente ou quase" }] },
    { id: 8, pergunta: "Com que frequência você não conseguiu lembrar o que aconteceu na noite anterior por ter bebido?", opcoes: [{ valor: 0, label: "Nunca" },{ valor: 1, label: "Menos de uma vez ao mês" },{ valor: 2, label: "Mensalmente" },{ valor: 3, label: "Semanalmente" },{ valor: 4, label: "Diariamente ou quase" }] },
    { id: 9, pergunta: "Você ou outra pessoa já se machucou por causa da sua bebida?", opcoes: [{ valor: 0, label: "Não" },{ valor: 2, label: "Sim, mas não no último ano" },{ valor: 4, label: "Sim, no último ano" }] },
    { id: 10, pergunta: "Algum familiar, amigo, médico ou profissional de saúde já demonstrou preocupação com seu consumo de álcool ou sugeriu que você diminuísse?", opcoes: [{ valor: 0, label: "Não" },{ valor: 2, label: "Sim, mas não no último ano" },{ valor: 4, label: "Sim, no último ano" }] },
  ],
  faixas: [
    { min: 0,  max: 7,  label: "Baixo risco",            cor: "verde",    descricao: "Uso de baixo risco.", conduta: "Psicoeducação sobre uso seguro de álcool." },
    { min: 8,  max: 15, label: "Uso nocivo",             cor: "amarelo",  descricao: "Uso nocivo — risco aumentado de danos.", conduta: "Intervenção breve, aconselhamento motivacional." },
    { min: 16, max: 19, label: "Dependência provável",   cor: "laranja",  descricao: "Alta probabilidade de dependência.", conduta: "Avaliação especializada. Considerar tratamento estruturado." },
    { min: 20, max: 40, label: "Dependência grave",      cor: "vermelho", descricao: "Dependência grave.", conduta: "Tratamento especializado urgente. Avaliar necessidade de desintoxicação supervisionada." },
  ],
};

// ─── C-SSRS (versão simplificada para rastreio) ───────────────────────────────
export const CSSRS: Escala = {
  id: "cssrs",
  sigla: "C-SSRS",
  nome: "Columbia Suicide Severity Rating Scale",
  area: "suicidio",
  descricao: "Avaliação estruturada de ideação e comportamento suicida. Padrão-ouro recomendado pela FDA.",
  instrucoes: "Avalie a presença e intensidade de ideação e comportamento suicida. Responda com base no ÚLTIMO MÊS (exceto comportamentos, verificar vida toda).",
  tempo_min: 10,
  plano: "free",
  referencia: "Posner K et al. Am J Psychiatry. 2011;168(12):1266-1277. Columbia University.",
  nota_clinica: "Qualquer pontuação ≥3 em Ideação ou qualquer comportamento suicida indica avaliação urgente de risco.",
  itens: [
    { id: 1, pergunta: "Desejo de estar morto — pensamentos como 'queria estar morto' ou 'seria melhor estar morto'", opcoes: [{ valor: 0, label: "Não" },{ valor: 1, label: "Sim" }] },
    { id: 2, pergunta: "Pensamentos suicidas não específicos — pensamentos em se matar sem método, plano ou intenção", opcoes: [{ valor: 0, label: "Não" },{ valor: 2, label: "Sim" }] },
    { id: 3, pergunta: "Ideação suicida com método — pensamentos de se matar com método (mas sem plano de tempo/lugar)", opcoes: [{ valor: 0, label: "Não" },{ valor: 3, label: "Sim" }] },
    { id: 4, pergunta: "Ideação suicida com intenção de agir — pensamentos de se matar com alguma intenção de agir", opcoes: [{ valor: 0, label: "Não" },{ valor: 4, label: "Sim" }] },
    { id: 5, pergunta: "Ideação suicida com plano e intenção — pensamentos de se matar com plano específico e intenção", opcoes: [{ valor: 0, label: "Não" },{ valor: 5, label: "Sim" }] },
    { id: 6, pergunta: "Comportamento suicida — automutilação com intenção de morrer ou tentativa de suicídio (VIDA TODA)", opcoes: [{ valor: 0, label: "Não" },{ valor: 6, label: "Sim" }] },
    { id: 7, pergunta: "Comportamento suicida — atos preparatórios para suicídio (ÚLTIMO MÊS)", opcoes: [{ valor: 0, label: "Não" },{ valor: 6, label: "Sim" }] },
  ],
  faixas: [
    { min: 0, max: 0,  label: "Sem ideação",               cor: "verde",    descricao: "Sem ideação ou comportamento suicida relatados.", conduta: "Documentar e monitorar." },
    { min: 1, max: 2,  label: "Ideação passiva",            cor: "amarelo",  descricao: "Desejo passivo de estar morto.", conduta: "Reavaliar frequentemente. Psicoeducação. Plano de segurança." },
    { min: 3, max: 5,  label: "Ideação ativa",              cor: "laranja",  descricao: "Ideação ativa com ou sem método/plano.", conduta: "Avaliação urgente. Plano de segurança detalhado. Considerar internação." },
    { min: 6, max: 30, label: "Comportamento suicida",      cor: "vermelho", descricao: "Comportamento suicida presente.", conduta: "Internação imediata. Avaliação de risco completa. Medidas de proteção." },
  ],
};

// ─── MADRS ───────────────────────────────────────────────────────────────────
const opcoesMadrs = (labels: [string, string, string, string]) => [
  { valor: 0, label: labels[0] },
  { valor: 2, label: labels[1] },
  { valor: 4, label: labels[2] },
  { valor: 6, label: labels[3] },
];

export const MADRS: Escala = {
  id: "madrs",
  sigla: "MADRS",
  nome: "Montgomery-Åsberg Depression Rating Scale",
  area: "humor",
  descricao: "Escala heteroaplicada para avaliação da gravidade da depressão. Especialmente sensível a mudanças com o tratamento.",
  instrucoes: "Avaliação clínica da ÚLTIMA SEMANA pelo aplicador. Cada item é pontuado de 0 a 6. Selecione o valor que melhor descreve o paciente.",
  tempo_min: 15,
  plano: "free",
  referencia: "Montgomery SA, Åsberg M. Br J Psychiatry. 1979;134:382-389.",
  nota_clinica: "Escala heteroaplicada. Score total 0–60. Pontuação ≥20 indica depressão moderada. Amplamente usada para monitorar resposta terapêutica em ensaios clínicos.",
  itens: [
    { id: 1, pergunta: "Tristeza aparente — tristeza observada no comportamento, expressão e postura", opcoes: opcoesMadrs(["Nenhuma tristeza", "Parece abatido, mas facilmente se anima", "Parece triste e infeliz durante a maior parte do tempo", "Parece miserável todo o tempo"]) },
    { id: 2, pergunta: "Tristeza relatada — sentimentos de tristeza, depressão e desamparo relatados pelo paciente", opcoes: opcoesMadrs(["Tristeza ocasional compatível com as circunstâncias", "Tristeza ou humor depressivo presentes mas transitórios", "Sentimentos de tristeza ou depressão predominantes", "Sentimentos de tristeza ou miséria contínuos e irresistíveis"]) },
    { id: 3, pergunta: "Tensão interior — sentimentos de mal-estar, inquietação, ansiedade ou angústia", opcoes: opcoesMadrs(["Serenidade interior", "Tensão ou mal-estar vagos e ocasionais", "Sentimentos de tensão ou miséria contínuos", "Terror ou angústia constante e insuportável"]) },
    { id: 4, pergunta: "Sono reduzido — duração ou profundidade do sono reduzidas em relação ao padrão habitual", opcoes: opcoesMadrs(["Sono habitual", "Dificuldade leve para adormecer ou sono levemente reduzido", "Sono reduzido ou interrompido por pelo menos 2 horas", "Menos de 2–3 horas de sono"]) },
    { id: 5, pergunta: "Apetite reduzido — sensação de perda do apetite comparado ao habitual", opcoes: opcoesMadrs(["Apetite normal ou aumentado", "Apetite levemente reduzido", "Sem apetite — os alimentos parecem insípidos", "Necessidade de ser persuadido a comer"]) },
    { id: 6, pergunta: "Dificuldade de concentração — dificuldade em reunir pensamentos chegando à incapacidade de ler", opcoes: opcoesMadrs(["Sem dificuldade de concentração", "Dificuldades ocasionais em reunir pensamentos", "Dificuldade para concentrar-se e manter atenção — reduz capacidade de leitura", "Incapaz de ler ou conversar sem grande dificuldade"]) },
    { id: 7, pergunta: "Lassidão — dificuldade em iniciar atividades; lentidão para iniciar e manter atividades de rotina", opcoes: opcoesMadrs(["Sem dificuldade para iniciar tarefas", "Dificuldade para iniciar atividades", "Dificuldade para iniciar atividades simples de rotina", "Incapaz de fazer qualquer coisa sem ajuda"]) },
    { id: 8, pergunta: "Incapacidade de sentir — experiência subjetiva de emoções reduzidas; falta de envolvimento emocional", opcoes: opcoesMadrs(["Interesse normal pelo ambiente e pelas pessoas", "Habilidade reduzida de se envolver com o ambiente", "Perda de interesse pelo ambiente e pelas pessoas", "Experiência de estar sem sentimento e de sofrimento doloroso"]) },
    { id: 9, pergunta: "Pensamentos pessimistas — pensamentos de culpa, inferioridade, autoacusação, pecado e ruína", opcoes: opcoesMadrs(["Sem pensamentos pessimistas", "Ideias flutuantes de fracasso, autorrepreensão ou autodepreciação", "Autoacusação persistente ou ideias de culpa/pecado", "Delírios de ruína, remorso ou pecado"]) },
    { id: 10, pergunta: "Pensamentos suicidas — sentimento de que a vida não vale a pena, desejo de estar morto, ideação suicida", opcoes: opcoesMadrs(["Aprecia a vida ou a toma como ela é", "Cansado da vida — pensamentos suicidas passageiros", "Provavelmente melhor estar morto; ideação suicida frequente", "Planos explícitos de suicídio quando há oportunidade"]) },
  ],
  faixas: [
    { min: 0,  max: 6,  label: "Remissão",  cor: "verde",    descricao: "Sem depressão significativa.", conduta: "Manutenção. Monitorar." },
    { min: 7,  max: 19, label: "Leve",      cor: "amarelo",  descricao: "Depressão leve.", conduta: "Psicoterapia. Reavaliar em 2–4 semanas." },
    { min: 20, max: 34, label: "Moderado",  cor: "laranja",  descricao: "Depressão moderada.", conduta: "Psicofarmacologia e/ou psicoterapia ativa." },
    { min: 35, max: 60, label: "Grave",     cor: "vermelho", descricao: "Depressão grave.", conduta: "Tratamento imediato. Avaliar internação e risco de suicídio." },
  ],
};

// ─── YMRS ────────────────────────────────────────────────────────────────────
export const YMRS: Escala = {
  id: "ymrs",
  sigla: "YMRS",
  nome: "Young Mania Rating Scale",
  area: "mania",
  descricao: "Escala heteroaplicada para avaliação da gravidade de episódio maníaco. Padrão em ensaios com estabilizadores de humor.",
  instrucoes: "Avaliação clínica pelo aplicador. Itens 1–7 pontuados de 0 a 4; itens 8–11 pontuados de 0 a 8 (em passos de 2). Basear-se na ÚLTIMA SEMANA.",
  tempo_min: 15,
  plano: "free",
  referencia: "Young RC et al. Br J Psychiatry. 1978;133:429-435.",
  nota_clinica: "Escala heteroaplicada. Score total 0–60. Itens 8, 9, 10 e 11 têm peso duplo (0–8). Pontuação ≥20 = mania moderada; ≥26 = mania grave.",
  itens: [
    { id: 1,  pergunta: "Humor elevado", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Levemente ou possivelmente aumentado ao perguntar" },{ valor: 2, label: "Humor elevado subjetivo; otimista, confiante; alegre; apropriado ao conteúdo" },{ valor: 3, label: "Humor elevado; inadequado ao conteúdo; jocoso" },{ valor: 4, label: "Eufórico; risadas inadequadas; cantando" }] },
    { id: 2,  pergunta: "Atividade motora aumentada — energia", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Subjetivamente aumentada" },{ valor: 2, label: "Animado, gesticula mais" },{ valor: 3, label: "Energia excessiva; hiperativo às vezes; inquieto (pode ser acalmado)" },{ valor: 4, label: "Agitação ou hiperatividade motora; não consegue ficar parado" }] },
    { id: 3,  pergunta: "Interesse sexual", opcoes: [{ valor: 0, label: "Normal; sem aumento" },{ valor: 1, label: "Levemente aumentado ou ao perguntar" },{ valor: 2, label: "Aumento subjetivo ao perguntar" },{ valor: 3, label: "Espontaneamente verbalizado; conteúdo aumentado na entrevista; preocupado com aspectos sexuais" },{ valor: 4, label: "Comportamento aberto; inapropriado" }] },
    { id: 4,  pergunta: "Sono — horas por noite (redução em relação ao habitual)", opcoes: [{ valor: 0, label: "Sem redução" },{ valor: 1, label: "Redução em menos de 1 hora" },{ valor: 2, label: "Redução de 1–2 horas" },{ valor: 3, label: "Redução de mais de 2 horas" },{ valor: 4, label: "Nega necessidade de sono" }] },
    { id: 5,  pergunta: "Irritabilidade", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Subjetivamente aumentada" },{ valor: 2, label: "Irritável durante a entrevista; episódios recentes de raiva" },{ valor: 3, label: "Frequentemente irritável durante a entrevista; grosseiro e rude" },{ valor: 4, label: "Hostil, não cooperativo; entrevista impossível" }] },
    { id: 6,  pergunta: "Discurso (velocidade e quantidade)", opcoes: [{ valor: 0, label: "Sem aumento" },{ valor: 1, label: "Sentimento de tagarelice" },{ valor: 2, label: "Aumentado ao perguntar; ou espontaneamente tagarela" },{ valor: 3, label: "Pressão de fala; difícil de interromper" },{ valor: 4, label: "Ininterrupto; fuga de ideias" }] },
    { id: 7,  pergunta: "Distúrbio de linguagem-pensamento", opcoes: [{ valor: 0, label: "Ausente" },{ valor: 1, label: "Circunstancial; pensamentos ligeiramente distraídos" },{ valor: 2, label: "Distraído; perde objetivo; muda de assunto com frequência" },{ valor: 3, label: "Fuga de ideias; tangencial; difícil de seguir; rimas, sons" },{ valor: 4, label: "Incoerente; não comunicativo" }] },
    { id: 8,  pergunta: "Conteúdo do pensamento", opcoes: [{ valor: 0, label: "Normal" },{ valor: 2, label: "Planos questionáveis; novos interesses" },{ valor: 4, label: "Projetos especiais; hipereligioso" },{ valor: 6, label: "Grandioso ou paranoico; ideias de referência" },{ valor: 8, label: "Delírios; alucinações" }] },
    { id: 9,  pergunta: "Comportamento disruptivo-agressivo", opcoes: [{ valor: 0, label: "Ausente; cooperativo" },{ valor: 2, label: "Sarcástico; barulhento; desconfiado; reclama" },{ valor: 4, label: "Exige; ameaça; entrevista difícil" },{ valor: 6, label: "Ameaça; grita; entrevista difícil" },{ valor: 8, label: "Agressivo; destrutivo; entrevista impossível" }] },
    { id: 10, pergunta: "Aparência", opcoes: [{ valor: 0, label: "Bem arrumado e vestido adequadamente" },{ valor: 2, label: "Levemente descuidado" },{ valor: 4, label: "Mal arrumado; moderadamente desordenado; maquiagem excessiva" },{ valor: 6, label: "Desordenado; parcialmente vestido; maquiagem exagerada" },{ valor: 8, label: "Completamente descuidado; adornos bizarros" }] },
    { id: 11, pergunta: "Insight", opcoes: [{ valor: 0, label: "Presente; admite a doença; concorda com tratamento" },{ valor: 2, label: "Admite possível mudança de humor, mas nega doença" },{ valor: 4, label: "Admite mudança de comportamento, mas nega doença" },{ valor: 6, label: "Admite possível mudança de humor, mas nega doença" },{ valor: 8, label: "Nega qualquer mudança de humor" }] },
  ],
  faixas: [
    { min: 0,  max: 12, label: "Remissão",          cor: "verde",    descricao: "Sem mania significativa.", conduta: "Manutenção. Monitorar estabilidade do humor." },
    { min: 13, max: 19, label: "Hipomania / Leve",  cor: "amarelo",  descricao: "Hipomania ou mania leve.", conduta: "Revisar estabilizador de humor. Monitorar de perto." },
    { min: 20, max: 25, label: "Moderado",          cor: "laranja",  descricao: "Mania moderada.", conduta: "Ajuste farmacológico. Considerar antipsicótico atípico." },
    { min: 26, max: 60, label: "Grave",             cor: "vermelho", descricao: "Mania grave.", conduta: "Tratamento intensivo. Avaliar internação." },
  ],
};

// ─── PANSS ───────────────────────────────────────────────────────────────────
const opcoesPanss = [
  { valor: 1, label: "1 — Ausente" },
  { valor: 2, label: "2 — Mínimo" },
  { valor: 3, label: "3 — Leve" },
  { valor: 4, label: "4 — Moderado" },
  { valor: 5, label: "5 — Moderadamente grave" },
  { valor: 6, label: "6 — Grave" },
  { valor: 7, label: "7 — Extremo" },
];

export const PANSS: Escala = {
  id: "panss",
  sigla: "PANSS",
  nome: "Positive and Negative Syndrome Scale",
  area: "psicose",
  descricao: "Avaliação heteroaplicada de sintomas positivos, negativos e psicopatologia geral em esquizofrenia e psicoses.",
  instrucoes: "Avalie cada item com base na entrevista clínica e informações de familiares/equipe da ÚLTIMA SEMANA. Escala de 1 (ausente) a 7 (extremo).",
  tempo_min: 30,
  plano: "pro",
  referencia: "Kay SR et al. Schizophr Bull. 1987;13(2):261-276.",
  nota_clinica: "Escala heteroaplicada. Score mínimo: 30. Score médio em esquizofrenia: 75–95. Subescalas: Positiva (P1–P7, 7–49), Negativa (N1–N7, 7–49), Geral (G1–G16, 16–112).",
  itens: [
    // Subescala Positiva
    { id: 1,  pergunta: "P1 — Delírios — crenças falsas, inabaláveis e sem base na realidade", opcoes: opcoesPanss },
    { id: 2,  pergunta: "P2 — Desorganização conceitual — pensamento desorganizado, tangencial ou incoerente", opcoes: opcoesPanss },
    { id: 3,  pergunta: "P3 — Alucinações — percepções sem estímulo externo (auditivas, visuais, outras)", opcoes: opcoesPanss },
    { id: 4,  pergunta: "P4 — Excitação — hiperatividade, impulsividade, agitação ou irritabilidade", opcoes: opcoesPanss },
    { id: 5,  pergunta: "P5 — Grandiosidade — autoavaliação exagerada ou convicções de poderes especiais", opcoes: opcoesPanss },
    { id: 6,  pergunta: "P6 — Suspeita/Perseguição — ideias de ser prejudicado, perseguido ou observado", opcoes: opcoesPanss },
    { id: 7,  pergunta: "P7 — Hostilidade — animosidade verbal ou física em relação a outros", opcoes: opcoesPanss },
    // Subescala Negativa
    { id: 8,  pergunta: "N1 — Embotamento afetivo — redução da expressão emocional e da ressonância afetiva", opcoes: opcoesPanss },
    { id: 9,  pergunta: "N2 — Retraimento emocional — falta de interesse em interações sociais e no ambiente", opcoes: opcoesPanss },
    { id: 10, pergunta: "N3 — Contato pobre — relacionamento interpessoal distante e superficial", opcoes: opcoesPanss },
    { id: 11, pergunta: "N4 — Retraimento social passivo/apático — redução da iniciativa social e afastamento", opcoes: opcoesPanss },
    { id: 12, pergunta: "N5 — Dificuldade no pensamento abstrato — prejuízo na formação de conceitos abstratos", opcoes: opcoesPanss },
    { id: 13, pergunta: "N6 — Falta de espontaneidade e fluidez na conversação — redução da iniciativa verbal", opcoes: opcoesPanss },
    { id: 14, pergunta: "N7 — Pensamento estereotipado — pensamento rígido, repetitivo e inflexível", opcoes: opcoesPanss },
    // Psicopatologia Geral
    { id: 15, pergunta: "G1 — Preocupações somáticas — queixas físicas sem base orgânica estabelecida", opcoes: opcoesPanss },
    { id: 16, pergunta: "G2 — Ansiedade — sentimentos de apreensão, preocupação ou medo excessivos", opcoes: opcoesPanss },
    { id: 17, pergunta: "G3 — Sentimentos de culpa — autocensura e remorso por atos passados", opcoes: opcoesPanss },
    { id: 18, pergunta: "G4 — Tensão — manifestações físicas de tensão e nervosismo", opcoes: opcoesPanss },
    { id: 19, pergunta: "G5 — Maneirismos e posturas — movimentos ou posturas incomuns e repetitivos", opcoes: opcoesPanss },
    { id: 20, pergunta: "G6 — Depressão — humor triste, pessimismo, desesperança", opcoes: opcoesPanss },
    { id: 21, pergunta: "G7 — Retardo motor — lentidão do movimento e da fala", opcoes: opcoesPanss },
    { id: 22, pergunta: "G8 — Não cooperação — resistência ou recusa em colaborar com entrevistador ou equipe", opcoes: opcoesPanss },
    { id: 23, pergunta: "G9 — Conteúdo incomum do pensamento — ideias estranhas, bizarras ou atípicas", opcoes: opcoesPanss },
    { id: 24, pergunta: "G10 — Desorientação — confusão quanto a pessoa, lugar ou tempo", opcoes: opcoesPanss },
    { id: 25, pergunta: "G11 — Atenção ruim — dificuldade em focar e manter atenção durante a entrevista", opcoes: opcoesPanss },
    { id: 26, pergunta: "G12 — Falta de julgamento e crítica — capacidade prejudicada de avaliar situações", opcoes: opcoesPanss },
    { id: 27, pergunta: "G13 — Perturbação da volição — deficiência na iniciativa, motivação e energia", opcoes: opcoesPanss },
    { id: 28, pergunta: "G14 — Controle de impulsos ruim — dificuldade em inibir impulsos agressivos ou sexuais", opcoes: opcoesPanss },
    { id: 29, pergunta: "G15 — Preocupação — absorção por pensamentos e sentimentos internos", opcoes: opcoesPanss },
    { id: 30, pergunta: "G16 — Evitação social ativa — evitação intencional de interações sociais", opcoes: opcoesPanss },
  ],
  faixas: [
    { min: 30, max: 58, label: "Leve",                  cor: "amarelo",  descricao: "Sintomas psicóticos leves.", conduta: "Monitorar. Otimizar antipsicótico." },
    { min: 59, max: 75, label: "Moderado",              cor: "laranja",  descricao: "Sintomas psicóticos moderados.", conduta: "Revisão farmacológica. Suporte psicossocial." },
    { min: 76, max: 95, label: "Moderadamente Grave",  cor: "vermelho", descricao: "Sintomas psicóticos moderadamente graves.", conduta: "Ajuste terapêutico urgente. Avaliar internação." },
    { min: 96, max: 210,label: "Grave",                cor: "vermelho", descricao: "Sintomas psicóticos graves.", conduta: "Internação. Otimização antipsicótica imediata." },
  ],
};

// ─── PCL-5 ───────────────────────────────────────────────────────────────────
const opcoesPcl5 = [
  { valor: 0, label: "0 — Nada" },
  { valor: 1, label: "1 — Um pouco" },
  { valor: 2, label: "2 — Moderadamente" },
  { valor: 3, label: "3 — Bastante" },
  { valor: 4, label: "4 — Extremamente" },
];

export const PCL5: Escala = {
  id: "pcl5",
  sigla: "PCL-5",
  nome: "PTSD Checklist for DSM-5",
  area: "trauma",
  descricao: "Autoavaliação de sintomas de Transtorno de Estresse Pós-Traumático (TEPT) conforme critérios do DSM-5.",
  instrucoes: "Abaixo está uma lista de problemas que às vezes as pessoas têm em resposta a uma experiência muito estressante. Pensando no seu pior evento estressante, o quanto você foi incomodado por cada um dos problemas a seguir no último mês?",
  tempo_min: 10,
  plano: "free",
  referencia: "Weathers FW et al. National Center for PTSD. 2013.",
  nota_clinica: "Score total 0–80. Ponto de corte ≥31–33 para TEPT provável (sensibilidade e especificidade adequadas). Clusters: B=Reexperienciação (1–5), C=Evitação (6–7), D=Cognições/humor negativo (8–14), E=Hiperexcitabilidade (15–20).",
  itens: [
    // Cluster B — Reexperienciação
    { id: 1,  pergunta: "B1 — Memórias perturbadoras repetidas, involuntárias e intrusivas do evento estressante", opcoes: opcoesPcl5 },
    { id: 2,  pergunta: "B2 — Sonhos perturbadores repetidos relacionados ao evento estressante", opcoes: opcoesPcl5 },
    { id: 3,  pergunta: "B3 — Sentir ou agir de repente como se o evento estivesse acontecendo novamente (flashbacks)", opcoes: opcoesPcl5 },
    { id: 4,  pergunta: "B4 — Sentir-se muito perturbado quando algo lembra o evento estressante", opcoes: opcoesPcl5 },
    { id: 5,  pergunta: "B5 — Ter reações físicas fortes quando algo lembra o evento (coração acelerado, falta de ar)", opcoes: opcoesPcl5 },
    // Cluster C — Evitação
    { id: 6,  pergunta: "C1 — Evitar memórias, pensamentos ou sentimentos relacionados ao evento estressante", opcoes: opcoesPcl5 },
    { id: 7,  pergunta: "C2 — Evitar lembretes externos do evento (pessoas, lugares, conversas, atividades, objetos, situações)", opcoes: opcoesPcl5 },
    // Cluster D — Cognições e humor negativos
    { id: 8,  pergunta: "D1 — Dificuldade em lembrar partes importantes do evento estressante", opcoes: opcoesPcl5 },
    { id: 9,  pergunta: "D2 — Crenças negativas fortes sobre si mesmo, outras pessoas ou o mundo (ex.: 'Sou uma pessoa ruim')", opcoes: opcoesPcl5 },
    { id: 10, pergunta: "D3 — Culpar a si mesmo ou outras pessoas pelo evento estressante ou pelas suas consequências", opcoes: opcoesPcl5 },
    { id: 11, pergunta: "D4 — Sentimentos negativos fortes (medo, horror, raiva, culpa, vergonha)", opcoes: opcoesPcl5 },
    { id: 12, pergunta: "D5 — Perda de interesse em atividades que antes eram importantes ou agradáveis", opcoes: opcoesPcl5 },
    { id: 13, pergunta: "D6 — Sentir-se distante ou isolado das outras pessoas", opcoes: opcoesPcl5 },
    { id: 14, pergunta: "D7 — Dificuldade em sentir emoções positivas (amor, alegria, satisfação)", opcoes: opcoesPcl5 },
    // Cluster E — Hiperexcitabilidade
    { id: 15, pergunta: "E1 — Comportamento irritável, explosões de raiva ou agir de forma agressiva", opcoes: opcoesPcl5 },
    { id: 16, pergunta: "E2 — Assumir riscos excessivos ou fazer coisas que poderiam se machucar", opcoes: opcoesPcl5 },
    { id: 17, pergunta: "E3 — Estar superalerta, vigilante ou de guarda", opcoes: opcoesPcl5 },
    { id: 18, pergunta: "E4 — Sentir-se sobressaltado facilmente ou assustar-se com facilidade", opcoes: opcoesPcl5 },
    { id: 19, pergunta: "E5 — Dificuldade de concentração", opcoes: opcoesPcl5 },
    { id: 20, pergunta: "E6 — Dificuldade para dormir (adormecer ou permanecer dormindo)", opcoes: opcoesPcl5 },
  ],
  faixas: [
    { min: 0,  max: 30, label: "Abaixo do limiar",   cor: "verde",    descricao: "Sintomas de TEPT abaixo do ponto de corte.", conduta: "Monitorar. Avaliar contexto clínico e funcional." },
    { min: 31, max: 49, label: "TEPT Provável",       cor: "laranja",  descricao: "Score acima do ponto de corte — TEPT provável.", conduta: "Encaminhamento para avaliação diagnóstica formal. Considerar TCC focada no trauma ou EMDR." },
    { min: 50, max: 80, label: "TEPT Grave",          cor: "vermelho", descricao: "Sintomas graves de TEPT.", conduta: "Tratamento especializado urgente. Psicoterapia focada no trauma + avaliação farmacológica (ISRS/IRSN)." },
  ],
};

export const escalas: Escala[] = [PHQ9, GAD7, HAMD, BPRS, AUDIT, CSSRS, MADRS, YMRS, PANSS, PCL5];
