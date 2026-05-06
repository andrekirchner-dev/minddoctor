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
  area: "humor" | "ansiedade" | "psicose" | "suicidio" | "alcool" | "cognicao";
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

export const escalas: Escala[] = [PHQ9, GAD7, HAMD, BPRS, AUDIT, CSSRS];
