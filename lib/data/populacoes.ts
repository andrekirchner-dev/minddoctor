export interface RegraPrescricao {
  farmaco: string;
  conduta: "preferir" | "evitar" | "contraindicado" | "ajustar" | "monitorar";
  justificativa: string;
}

export interface Populacao {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
  gradiente: string;
  regras: RegraPrescricao[];
  pearls: string[];
  armadilhas: string[];
  nota?: string;
}

export const populacoes: Populacao[] = [
  {
    id: "gestacao",
    nome: "Gestação",
    icone: "Baby",
    descricao: "Psicofarmacologia na gravidez exige balanço risco-benefício rigoroso. Não tratar pode ser mais perigoso que o fármaco. Depressão peri-natal não tratada tem desfechos maternos e fetais adversos.",
    gradiente: "from-pink-500 to-rose-400",
    regras: [
      { farmaco: "Sertralina", conduta: "preferir", justificativa: "ISRS de referência na gestação — maior banco de dados de segurança, sem malformações consistentes" },
      { farmaco: "Fluoxetina", conduta: "preferir", justificativa: "Ampla segurança documentada; meia-vida longa facilita adesão" },
      { farmaco: "Paroxetina", conduta: "evitar", justificativa: "Possível associação com cardiopatia fetal (comunicação interventricular) — risco baixo mas documentado" },
      { farmaco: "Lítio", conduta: "ajustar", justificativa: "Anomalia de Ebstein (risco absoluto baixo ~0,05%); clearance aumenta na gravidez (doses maiores necessárias); vigilância ao parto (risco de toxicidade neonatal)" },
      { farmaco: "Valproato", conduta: "contraindicado", justificativa: "Teratógeno de alta potência: espinha bífida (1–2%), malformações craniofaciais, déficit cognitivo em filhos. Evitar em qualquer mulher em idade fértil sem dupla contracepção eficaz" },
      { farmaco: "Carbamazepina", conduta: "evitar", justificativa: "Teratogênica (spina bifida) e induz enzimas — aumenta metabolismo de folato" },
      { farmaco: "Lamotrigina", conduta: "monitorar", justificativa: "Relativamente segura; clearance aumenta 50% na gestação → monitorar níveis e ajustar dose. Risco de rash em qualquer fase" },
      { farmaco: "Clonazepam/BZD", conduta: "ajustar", justificativa: "Curto prazo tolerável; uso crônico associado a síndrome de abstinência neonatal e floppy infant. Evitar próximo ao parto" },
      { farmaco: "Haloperidol", conduta: "ajustar", justificativa: "AP mais estudado na gestação; usado para hiperemese gravídica; perfil relativamente seguro" },
      { farmaco: "Quetiapina/Olanzapina", conduta: "monitorar", justificativa: "Ganho de peso e diabetes gestacional são riscos reais; menor teratogenicidade estrutural" },
      { farmaco: "ISRS próximo ao parto", conduta: "monitorar", justificativa: "Síndrome de adaptação neonatal: tremores, taquipneia, irritabilidade — autolimitada, não é toxicidade" },
    ],
    pearls: [
      "Sertralina é o ISRS de referência — maior banco de dados de segurança em gestação",
      "Lítio: risco absoluto de anomalia de Ebstein é ~0,05% (versus 0,005% na população geral) — muito menor do que se acreditava",
      "Não tratar depressão/TAB grave na gestação tem riscos maiores do que os fármacos de primeira linha",
      "Folato 4–5 mg/dia é recomendado para mulheres com valproato ou carbamazepina que engravidam (apesar da contraindicação de uso)",
      "Lamotrigina: clearance aumenta ~50% na gravidez — monitorar níveis mensalmente e ajustar dose",
    ],
    armadilhas: [
      "Suspender abruptamente antidepressivo ao descobrir gravidez — risco de recaída severa",
      "Não documentar a conversa sobre valproato com mulheres em idade fértil",
      "Ignorar síndrome de adaptação neonatal com ISRS — tranquilizar a equipe neonatal preventivamente",
      "Não ajustar dose de lítio na gestação (clearance renal aumentado exige doses maiores)",
    ],
    nota: "Consultar psiquiatra e obstetra em conjunto. Registrar formalmente todas as conversas sobre risco-benefício de psicofármacos na gestação.",
  },

  {
    id: "lactacao",
    nome: "Lactação / Amamentação",
    icone: "Heart",
    descricao: "A maioria dos psicofármacos passa para o leite materno em pequenas quantidades. A decisão de amamentar deve considerar benefícios do aleitamento vs exposição do lactente.",
    gradiente: "from-rose-400 to-pink-500",
    regras: [
      { farmaco: "Sertralina", conduta: "preferir", justificativa: "Níveis séricos no lactente geralmente indetectáveis; primeira escolha" },
      { farmaco: "Paroxetina", conduta: "preferir", justificativa: "Baixa excreção no leite; segunda opção segura" },
      { farmaco: "Fluoxetina", conduta: "monitorar", justificativa: "Meia-vida longa (norfluoxetina) — acumulação possível no lactente; monitorar irritabilidade" },
      { farmaco: "Lítio", conduta: "evitar", justificativa: "Concentração no leite de 30–50% do soro materno — risco de toxicidade no lactente (desidratação, toxicidade renal/neurológica)" },
      { farmaco: "Valproato", conduta: "monitorar", justificativa: "Baixa excreção no leite; considerado compatível pela maioria das fontes, mas monitorar" },
      { farmaco: "Lamotrigina", conduta: "monitorar", justificativa: "Excreção significativa (45% do nível sérico materno no lactente) — monitorar rash no bebê" },
      { farmaco: "Quetiapina", conduta: "preferir", justificativa: "Níveis baixos no leite; dados de segurança razoáveis" },
      { farmaco: "Olanzapina", conduta: "monitorar", justificativa: "Excreção moderada; vigiar sedação e ganho de peso no lactente" },
      { farmaco: "BZD (curto prazo)", conduta: "ajustar", justificativa: "Uso pontual é tolerável; crônico pode causar sedação e dificuldade de sucção" },
      { farmaco: "Haloperidol", conduta: "monitorar", justificativa: "Excreção moderada; vigilância de EPS no lactente" },
    ],
    pearls: [
      "LactMed (NIH) é a referência mais atualizada para segurança de fármacos na amamentação — consultar sempre",
      "Sertralina tem a melhor relação leite/plasma entre os ISRS — primeira escolha no pós-parto",
      "Timing da amamentação: aleitar imediatamente antes da dose para minimizar pico no leite",
      "Lítio no aleitamento: alta concentração leite/soro — geralmente contraindicado, mas casos individuais devem ser avaliados",
    ],
    armadilhas: [
      "Contraindicar amamentação desnecessariamente — privar o bebê dos benefícios do leite materno sem evidência sólida de risco",
      "Não consultar LactMed atualizado — dados mudam com novos estudos",
      "Fluoxetina: meia-vida longa pode acumular no lactente — preferir sertralina no pós-parto",
    ],
  },

  {
    id: "idosos",
    nome: "Idosos (≥65 anos)",
    icone: "PersonStanding",
    descricao: "Farmacocinética alterada (menor clearance renal/hepático, maior sensibilidade do SNC), polifarmácia e maior vulnerabilidade a efeitos adversos. Critérios de Beers como guia essencial.",
    gradiente: "from-amber-500 to-orange-400",
    regras: [
      { farmaco: "BZD (qualquer)", conduta: "evitar", justificativa: "Critérios de Beers — quedas, fraturas de quadril, delirium, deterioração cognitiva. Se necessário: lorazepam de curta ação, dose mínima, <4 semanas" },
      { farmaco: "Z-drugs (zolpidem)", conduta: "evitar", justificativa: "Beers — mesmo risco de quedas que BZD; dose máxima 5 mg em idosos" },
      { farmaco: "ATC (amitriptilina, clomipramina)", conduta: "evitar", justificativa: "Beers — anticolinérgicos, delirium, quedas; nortriptilina é menos anticolinérgica se necessário" },
      { farmaco: "AP 1G (haloperidol)", conduta: "monitorar", justificativa: "EPS mais prevalente em idosos; BPSD em demência: Black box de mortalidade aumentada" },
      { farmaco: "Escitalopram/Sertralina", conduta: "preferir", justificativa: "ISRS com menor interação e melhor tolerabilidade em idosos" },
      { farmaco: "Citalopram", conduta: "ajustar", justificativa: "Beers: risco de QTc — dose máxima de 20 mg em ≥60 anos" },
      { farmaco: "Mirtazapina", conduta: "monitorar", justificativa: "Útil para anorexia e insônia em idosos; risco de sedação e quedas" },
      { farmaco: "Lítio", conduta: "ajustar", justificativa: "Clearance renal reduzido — doses menores; lítio-alvo menor (0,4–0,7 mEq/L); janela terapêutica estreita" },
      { farmaco: "Donepezila", conduta: "preferir", justificativa: "Padrão para Alzheimer; 1 comprimido/dia; monitorar bradicardia" },
      { farmaco: "AChEI + betabloqueador", conduta: "monitorar", justificativa: "Sinergia no bloqueio do nó sinusal → bradicardia significativa" },
    ],
    pearls: [
      "Critérios de Beers (AGS) e STOPP/START: ferramentas essenciais para avaliar medicamentos inapropriados em idosos",
      "'Start low, go slow': iniciar em metade da dose adulta e titular lentamente",
      "Sedação = queda = fratura de quadril = mortalidade — cadeia de eventos real em idosos frágeis",
      "Citalopram: dose máxima de 20 mg em >60 anos (risco de QTc) — prefira escitalopram",
      "Polifarmácia: revisão regular da lista de medicamentos é uma intervenção terapêutica por si só",
    ],
    armadilhas: [
      "Prescrever BZD para insônia em idoso — risco de queda e delirium supera o benefício do sono",
      "Não reduzir dose do lítio ao observar declínio do clearance renal com a idade",
      "Usar ATC para dor crônica em idosos sem avaliar risco anticolinérgico e cardíaco",
      "Tratar delirium com haloperidol sem investigar causa médica subjacente",
    ],
    nota: "Regra prática: qualquer novo sintoma em idoso polimedicado pode ser efeito adverso de um medicamento até que se prove o contrário.",
  },

  {
    id: "criancas-adolescentes",
    nome: "Crianças e Adolescentes",
    icone: "GraduationCap",
    descricao: "Apenas fármacos com aprovação pediátrica deveriam ser primeira escolha. A maioria dos estudos é em adultos — off-label é frequente e deve ser documentado com a família.",
    gradiente: "from-green-500 to-emerald-400",
    regras: [
      { farmaco: "Fluoxetina", conduta: "preferir", justificativa: "Único ISRS aprovado FDA para depressão ≥8 anos; aprovado para TOC ≥7 anos" },
      { farmaco: "Sertralina", conduta: "preferir", justificativa: "Aprovada FDA para TOC ≥6 anos; off-label para depressão (muito usada)" },
      { farmaco: "Escitalopram", conduta: "preferir", justificativa: "Aprovado FDA para depressão ≥12 anos" },
      { farmaco: "Metilfenidato OROS", conduta: "preferir", justificativa: "Primeira linha para TDAH ≥6 anos; formulação de longa ação preferida" },
      { farmaco: "ATC (qualquer)", conduta: "evitar", justificativa: "Cardiotoxicidade em crianças; Black box de suicídio; doses letais acessíveis" },
      { farmaco: "Paroxetina", conduta: "contraindicado", justificativa: "Estudos 329 (GSK) — eficácia não demonstrada em adolescentes + mais EA; não aprovado" },
      { farmaco: "Lítio", conduta: "ajustar", justificativa: "TAB em adolescentes (>12 anos); dose por peso; litiemia mais frequente" },
      { farmaco: "Valproato", conduta: "evitar", justificativa: "Em meninas adolescentes: SOP, hiperandrogenismo, teratogenicidade futura" },
      { farmaco: "Aripiprazol", conduta: "preferir", justificativa: "Aprovado FDA para esquizofrenia ≥13a, mania bipolar ≥10a, TEA irritabilidade ≥6a" },
      { farmaco: "Risperidona", conduta: "preferir", justificativa: "Irritabilidade no TEA (FDA ≥5a); menor risco metabólico que olanzapina" },
    ],
    pearls: [
      "Black box FDA para ISRS em <25 anos: aumento de ideação suicida (não suicídio consumado) — não contraindica, mas exige monitoramento semanal nas primeiras 4 semanas",
      "Psicoterapia é SEMPRE componente essencial no tratamento infanto-juvenil",
      "TDAH: férias de medicação em períodos sem demanda escolar podem ser consideradas para avaliar necessidade",
      "Consentimento informado da família é obrigatório para off-label — documentar na evolução",
      "Puberdade pode alterar significativamente o metabolismo de fármacos — revisar doses ao longo do crescimento",
    ],
    armadilhas: [
      "Usar paroxetina em adolescentes com depressão — sem eficácia e com mais risco (estudo 329)",
      "ATC em crianças: doses letais em superdosagem acidental são muito baixas",
      "Não monitorar crescimento (peso e altura) em crianças com estimulantes",
      "Valproato em meninas adolescentes: risco de SOP e teratogenicidade futura ao procriar",
    ],
  },

  {
    id: "insuficiencia-renal",
    nome: "Insuficiência Renal",
    icone: "Droplets",
    descricao: "Fármacos com excreção renal significativa exigem ajuste de dose ou substituição. Litio e gabapentina são os de maior risco em DRC.",
    gradiente: "from-cyan-500 to-teal-500",
    regras: [
      { farmaco: "Lítio", conduta: "contraindicado", justificativa: "TFG <30: acumulação tóxica — contraindicado. TFG 30–60: dose reduzida + monitoramento aumentado. Evitar como primeira linha em DRC moderada" },
      { farmaco: "Gabapentina/Pregabalina", conduta: "ajustar", justificativa: "Excreção 100% renal — ajuste de dose por TFG obrigatório; acumulação causa sedação intensa" },
      { farmaco: "Acamprosato", conduta: "ajustar", justificativa: "Excreção renal — reduzir dose em DRC moderada; contraindicado em grave" },
      { farmaco: "Memantina", conduta: "ajustar", justificativa: "Excreção renal — reduzir dose em TFG <30; meia-vida prolongada em DRC grave" },
      { farmaco: "Sertralina/Escitalopram", conduta: "preferir", justificativa: "Metabolismo principalmente hepático — sem ajuste necessário em DRC; preferidos" },
      { farmaco: "Bupropiona", conduta: "ajustar", justificativa: "Metabólitos ativos acumulam em DRC — dose máxima reduzida; risco de convulsão" },
      { farmaco: "Quetiapina/Risperidona", conduta: "monitorar", justificativa: "Metabólitos renais — monitore sedação e EPS; ajustes menores necessários" },
      { farmaco: "Lorazepam", conduta: "preferir", justificativa: "Glucuronidação direta — preferido em insuficiência renal e hepática vs diazepam" },
    ],
    pearls: [
      "TFG <30: evitar lítio; se indispensável, monitorar litemia semanalmente",
      "Gabapentina/Pregabalina em DRC: sedação excessiva é sinal de acumulação — checar TFG e ajustar dose",
      "ISRS são seguros em DRC — metabolismo principalmente hepático",
      "Memantina: ajuste obrigatório em TFG <30 — risco de confusão e sedação por acumulação",
    ],
    armadilhas: [
      "Manter lítio sem ajuste em paciente com DRC progressiva",
      "Gabapentina em dose padrão em paciente dialítico — acumulação grave",
      "Não checar TFG ao iniciar acamprosato",
    ],
  },

  {
    id: "insuficiencia-hepatica",
    nome: "Insuficiência Hepática",
    icone: "AlertCircle",
    descricao: "A maioria dos psicofármacos tem metabolismo hepático — hepatopatia grave pode levar a acumulação e toxicidade. Priorizar fármacos com metabolismo não-hepático.",
    gradiente: "from-orange-400 to-yellow-500",
    regras: [
      { farmaco: "Valproato", conduta: "contraindicado", justificativa: "Hepatotóxico — contraindicado em hepatopatia moderada a grave" },
      { farmaco: "Agomelatina", conduta: "contraindicado", justificativa: "Hepatotóxico — contraindicado em hepatopatia de qualquer grau" },
      { farmaco: "Nefazodona", conduta: "contraindicado", justificativa: "Hepatotoxicidade grave documentada" },
      { farmaco: "ATC", conduta: "ajustar", justificativa: "Metabolismo CYP — acumulação em cirrose; usar doses menores e com cuidado" },
      { farmaco: "Sertralina/Citalopram", conduta: "ajustar", justificativa: "Reduzir dose pela metade em Child-Pugh B/C; aumentar intervalo" },
      { farmaco: "Lorazepam", conduta: "preferir", justificativa: "Glucuronidação direta (fase II) — não depende do CYP hepático; preferido em hepatopatas" },
      { farmaco: "Oxazepam", conduta: "preferir", justificativa: "Semelhante ao lorazepam — glucuronidação direta" },
      { farmaco: "Naltrexona", conduta: "evitar", justificativa: "Hepatotóxico em doses altas; evitar em hepatite ativa ou transaminases >3x LSN" },
      { farmaco: "Quetiapina", conduta: "ajustar", justificativa: "Metabolismo CYP3A4 — reduzir dose inicial em hepatopatia grave" },
    ],
    pearls: [
      "Child-Pugh C (cirrose descompensada): qualquer psicofármaco exige ajuste extremo — iniciar em 25% da dose usual",
      "Lorazepam e oxazepam são os BZD de escolha em hepatopatas — glucuronidação direta não compromete",
      "Valproato em hepatopatia: contraindicação absoluta — risco de hepatotoxicidade fatal",
      "Monitorar amônia e encefalopatia hepática em pacientes com hepatopatia grave em uso de psicofármacos",
    ],
    armadilhas: [
      "Prescever valproato em paciente com hepatopatia",
      "Usar diazepam em hepatopata (metabolismo CYP comprometido — prefira lorazepam)",
      "Não ajustar dose de ATC em cirrose",
    ],
  },

  {
    id: "cardiopatas",
    nome: "Cardiopatias",
    icone: "Heart",
    descricao: "QTc prolongado, cardiotoxicidade de ATC em overdose e efeitos cronotrópicos e vasculares dos psicofármacos são os principais riscos em cardiopatas.",
    gradiente: "from-red-500 to-rose-400",
    regras: [
      { farmaco: "ATC (amitriptilina, imipramina)", conduta: "contraindicado", justificativa: "Prolongam QRS e QTc, são negativamente inotrópicos — contraindicados pós-IAM e em ICC; letais em overdose" },
      { farmaco: "Tioridazina", conduta: "contraindicado", justificativa: "Alto risco de QTc — virtualmente banido" },
      { farmaco: "Haloperidol IV", conduta: "monitorar", justificativa: "Risco de QTc significativamente maior do que VO — ECG em uso IV" },
      { farmaco: "Ziprasidona/Sertindol", conduta: "evitar", justificativa: "Prolongam QTc — evitar em cardiopatas ou com outros fármacos que prolongam QTc" },
      { farmaco: "Citalopram", conduta: "ajustar", justificativa: "QTc dose-dependente — máximo 20 mg em >60 anos; evitar em QTc basal >450 ms" },
      { farmaco: "Sertralina", conduta: "preferir", justificativa: "Melhor perfil cardiovascular entre os ISRS — seguro pós-IAM (SADHART)" },
      { farmaco: "Escitalopram", conduta: "preferir", justificativa: "Melhor tolerabilidade geral; cuidado com citalopram (enantiômero tem menos risco de QTc)" },
      { farmaco: "Venlafaxina", conduta: "monitorar", justificativa: "Pode elevar PA em doses altas (>225 mg) — monitorar em hipertensos" },
      { farmaco: "Clozapina", conduta: "monitorar", justificativa: "Miocardite (primeiras 4–8 semanas) — ECG e troponina ao início; taquicardia é EA frequente" },
    ],
    pearls: [
      "ECG basal antes de qualquer fármaco com risco de QTc — especialmente em cardiopatas",
      "Sertralina tem o melhor perfil cardiovascular pós-IAM entre os antidepressivos (SADHART Trial)",
      "Regra de Bazett para QTc: > 450 ms em homens, > 470 ms em mulheres = limiar de atenção",
      "Clozapina e miocardite: troponinaT e ECG semanais nas primeiras 4 semanas; taquicardia pode ser o único sinal inicial",
      "AChEI bradicardizam — cuidado em conjunto com betabloqueadores ou antiarrítmicos",
    ],
    armadilhas: [
      "ATC em paciente pós-IAM — risco de arritmia e morte súbita",
      "Haloperidol IV sem monitorização de ECG",
      "Citalopram em dose padrão em cardiopata >60 anos",
      "Não verificar lista completa de fármacos antes de adicionar AP com risco de QTc",
    ],
  },

  {
    id: "epilepsia-parkinson",
    nome: "Epilepsia e Parkinson",
    icone: "Brain",
    descricao: "Interações farmacocinéticas com anticonvulsivantes e o risco de precipitar EPS/piorar parkinsonismo determinam a escolha de psicofármacos nessas populações.",
    gradiente: "from-violet-500 to-purple-400",
    regras: [
      { farmaco: "Bupropiona", conduta: "evitar", justificativa: "Abaixa limiar convulsivo de forma dose-dependente — evitar em epilepsia não controlada" },
      { farmaco: "Clozapina", conduta: "ajustar", justificativa: "Epileptogênica em doses >600 mg — ECG para monitorar; doses menores são mais seguras" },
      { farmaco: "ATC (clomipramina)", conduta: "evitar", justificativa: "Epileptogênico — risco de convulsão, especialmente em doses altas" },
      { farmaco: "Haloperidol", conduta: "contraindicado", justificativa: "Na DCL: sensibilidade grave com parkinsonismo severo e mortalidade aumentada" },
      { farmaco: "Quetiapina", conduta: "preferir", justificativa: "AP de preferência em Parkinson/DCL — fast-off D2, menor EPS" },
      { farmaco: "Clozapina (baixas doses)", conduta: "preferir", justificativa: "Única AP sem agravar motricidade de forma significativa em Parkinson; baixas doses (12,5–50 mg)" },
      { farmaco: "Carbamazepina", conduta: "monitorar", justificativa: "Induz CYP3A4 — reduz níveis de quetiapina, lurasidona, anticoncepcionais. Testar HLA-B*1502 em asiáticos" },
      { farmaco: "Valproato + lamotrigina", conduta: "ajustar", justificativa: "Valproato DOBRA os níveis de lamotrigina — usar metade da dose de lamotrigina na combinação" },
    ],
    pearls: [
      "Em Parkinson com psicose: quetiapina ou clozapina em baixa dose — AP típicos pioram gravemente o quadro motor",
      "Carbamazepina autoindutura: níveis caem 30–40% após 3–4 semanas de tratamento — ajuste necessário",
      "Valproato + lamotrigina: dobra os níveis de lamotrigina — iniciar lamotrigina em metade da dose usual",
      "DCL com antipsicótico típico: contraindicado — risco de EPS grave, rigidez, diminuição da consciência e mortalidade",
    ],
    armadilhas: [
      "AP típico na DCL — contraindicado, potencialmente fatal",
      "Bupropiona em epiléptico não controlado",
      "Não ajustar lamotrigina ao combinar com valproato",
      "Carbamazepina sem teste HLA-B*1502 em asiático (risco de Stevens-Johnson)",
    ],
  },
];

// Helpers
export function getPopulacao(id: string): Populacao | undefined {
  return populacoes.find((p) => p.id === id);
}

export const condutaLabel: Record<RegraPrescricao["conduta"], string> = {
  preferir: "Preferir",
  evitar: "Evitar",
  contraindicado: "Contraindicado",
  ajustar: "Ajustar",
  monitorar: "Monitorar",
};

export const condutaColor: Record<RegraPrescricao["conduta"], string> = {
  preferir:      "bg-green-500/10 text-green-700 border-green-500/20",
  evitar:        "bg-amber-500/10 text-amber-700 border-amber-500/20",
  contraindicado:"bg-red-500/10 text-red-700 border-red-500/20",
  ajustar:       "bg-blue-500/10 text-blue-700 border-blue-500/20",
  monitorar:     "bg-violet-500/10 text-violet-700 border-violet-500/20",
};
