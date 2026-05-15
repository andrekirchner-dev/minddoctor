export type AcaoFarmaco =
  | "agonista"
  | "antagonista"
  | "ag_parcial"
  | "inibidor"
  | "modulador_pos"
  | "modulador_neg"
  | "substrato";

export interface FarmacoLink {
  nome: string;
  acao: AcaoFarmaco;
  nota?: string;
}

export interface AlvoFarmacologico {
  id: string;
  nome: string;
  nome_completo?: string;
  tipo: string;
  localizacao: string[];
  funcao: string;
  agonismo?: string;
  antagonismo?: string;
  farmacos: FarmacoLink[];
  nivel: "essencial" | "avancado";
  nota?: string;
}

export interface SistemaReceptorial {
  id: string;
  nome: string;
  descricao: string;
  relevancia_clinica: string;
  gradiente: string;
  alvos: AlvoFarmacologico[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DADOS
// ─────────────────────────────────────────────────────────────────────────────

export const sistemas: SistemaReceptorial[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // A. SEROTONINÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "serotoninergico",
    nome: "Sistema Serotoninérgico",
    descricao: "Regula humor, ansiedade, sono, cognição, apetite e comportamento impulsivo. Origem nos núcleos da rafe com projeções amplas.",
    relevancia_clinica: "Alvo central de antidepressivos, ansiolíticos, antipsicóticos atípicos e psicodélicos. Modulação de SERT e múltiplos receptores 5-HT determina eficácia e perfil de efeitos adversos.",
    gradiente: "from-rose-500 to-pink-600",
    alvos: [
      {
        id: "5ht1a",
        nome: "5-HT1A",
        nome_completo: "Receptor serotoninérgico 1A",
        tipo: "GPCR — Gi/o (inibitório)",
        localizacao: ["Núcleo da rafe dorsal (autorreceptor)", "Córtex pré-frontal", "Hipocampo", "Sistema límbico"],
        funcao: "Autorregulador da liberação de serotonina nas rafes. Pós-sináptico em regiões límbicas e corticais, medeia respostas ansiolíticas e antidepressivas.",
        agonismo: "Reduz firing dos neurônios serotoninérgicos (autorreceptor pré-sináptico). Pós-sinapticamente: ansiolítico, melhora do humor, modulação da impulsividade.",
        antagonismo: "Aumenta liberação de serotonina; potencializa resposta antidepressiva em combinação com ISRS (hipótese da dessensibilização).",
        farmacos: [
          { nome: "Buspirona",     acao: "ag_parcial",   nota: "Agonismo parcial 5-HT1A — principal mecanismo ansiolítico" },
          { nome: "Vilazodona",    acao: "ag_parcial",   nota: "ISRS + agonismo parcial 5-HT1A" },
          { nome: "Aripiprazol",   acao: "ag_parcial",   nota: "Agonismo parcial D2/D3 e 5-HT1A" },
          { nome: "Brexpiprazol",  acao: "ag_parcial",   nota: "Perfil similar ao aripiprazol com menor ativação" },
          { nome: "Cariprazina",   acao: "ag_parcial",   nota: "Alta afinidade por D3 e agonismo parcial 5-HT1A" },
          { nome: "Vortioxetina",  acao: "ag_parcial",   nota: "Multimodal: SERT + agonismo 5-HT1A/1B + antagonismo 5-HT3/5-HT7" },
          { nome: "Clozapina",     acao: "ag_parcial",   nota: "Agonismo parcial 5-HT1A parcialmente responsável por perfil favorável" },
        ],
        nivel: "essencial",
        nota: "A dessensibilização dos autorreceptores 5-HT1A após uso prolongado de ISRS explica a latência de 2–4 semanas para o efeito antidepressivo.",
      },
      {
        id: "5ht1b_1d",
        nome: "5-HT1B / 5-HT1D",
        nome_completo: "Receptores serotoninérgicos 1B e 1D",
        tipo: "GPCR — Gi/o (inibitório)",
        localizacao: ["Terminais pré-sinápticos", "Gânglios da base", "Vasos cerebrais (5-HT1B)"],
        funcao: "Modulação pré-sináptica da liberação de serotonina e outros neurotransmissores. 5-HT1D importante na enxaqueca e modulação da impulsividade.",
        agonismo: "Reduz liberação de neurotransmissores (heterorreceptor); vasoconstricção cerebral via 5-HT1B.",
        antagonismo: "Pode aumentar liberação de DA e NA em regiões límbicas.",
        farmacos: [
          { nome: "Triptanos (sumatriptano, rizatriptano)", acao: "agonista", nota: "Agonismo 5-HT1B/D — vasoconstrição e inibição da liberação de CGRP na enxaqueca" },
          { nome: "Vortioxetina", acao: "ag_parcial", nota: "Agonismo parcial 5-HT1B contribui para efeito pró-cognitivo" },
        ],
        nivel: "avancado",
      },
      {
        id: "5ht2a",
        nome: "5-HT2A",
        nome_completo: "Receptor serotoninérgico 2A",
        tipo: "GPCR — Gq (excitatório)",
        localizacao: ["Córtex pré-frontal", "Estriado", "Neurônios dopaminérgicos nigroestriatais"],
        funcao: "Regulação de liberação dopaminérgica nigroestriatal, modulação do sono (reduz SWS), processamento sensório-perceptual, cognição.",
        agonismo: "Distorção sensório-perceptual, alucinações visuais (psicodélicos), insônia, agitação.",
        antagonismo: "Reduz EPS por desinibição dopaminérgica nigroestriatal; melhora do sono profundo; atenua sintomas negativos e cognitivos da esquizofrenia.",
        farmacos: [
          { nome: "Risperidona",    acao: "antagonista", nota: "Bloqueio D2 + 5-HT2A — paradigma dos atípicos" },
          { nome: "Olanzapina",     acao: "antagonista", nota: "Alta afinidade 5-HT2A + D2 + H1 + M1" },
          { nome: "Quetiapina",     acao: "antagonista", nota: "Afinidade 5-HT2A moderada; maior sedação via H1" },
          { nome: "Clozapina",      acao: "antagonista", nota: "5-HT2A entre múltiplos alvos do perfil clozapina" },
          { nome: "Ziprasidona",    acao: "antagonista", nota: "Alta relação 5-HT2A/D2 — menor EPS e metabolismo" },
          { nome: "Lurasidona",     acao: "antagonista", nota: "5-HT2A + D2 + 5-HT7; sem ganho de peso relevante" },
          { nome: "Asenapina",      acao: "antagonista", nota: "Perfil multimodal com 5-HT2A, 5-HT2C, H1, D2" },
          { nome: "Mirtazapina",    acao: "antagonista", nota: "Bloqueio 5-HT2A + H1 + alfa-2 → sedação e ganho de peso" },
          { nome: "Trazodona",      acao: "antagonista", nota: "5-HT2A antagonismo + SERT fraco → hipnótico/antidepressivo" },
          { nome: "Pimavanserina",  acao: "antagonista", nota: "Antagonista seletivo 5-HT2A/2C — psicose na DP sem bloqueio D2" },
          { nome: "Psilocibina",    acao: "agonista",    nota: "Agonismo 5-HT2A → alucinações/dissociação (uso experimental)" },
        ],
        nivel: "essencial",
        nota: "Razão alta 5-HT2A/D2 é o marcador clássico dos antipsicóticos atípicos. Bloqueio 5-HT2A em neurônios nigroestriatais desinibe dopamina, reduzindo EPS.",
      },
      {
        id: "5ht2c",
        nome: "5-HT2C",
        nome_completo: "Receptor serotoninérgico 2C",
        tipo: "GPCR — Gq (excitatório)",
        localizacao: ["Hipotálamo (regulação do apetite)", "Sistema límbico", "Córtex pré-frontal", "Núcleo accumbens"],
        funcao: "Controle do apetite e peso corporal, modulação da liberação de dopamina e noradrenalina cortical, impulsividade.",
        agonismo: "Reduz apetite, aumenta saciedade. Aumenta liberação de DA/NA pré-frontais.",
        antagonismo: "Aumenta apetite e pode causar ganho de peso. Reduz inibição tônica do sistema dopaminérgico mesolímbico.",
        farmacos: [
          { nome: "Olanzapina",    acao: "antagonista", nota: "Antagonismo 5-HT2C + H1 explica ganho de peso significativo" },
          { nome: "Clozapina",     acao: "antagonista", nota: "Maior risco metabólico parcialmente via 5-HT2C" },
          { nome: "Mirtazapina",   acao: "antagonista", nota: "Bloqueio 5-HT2C → aumento de apetite e ganho de peso" },
          { nome: "Agomelatina",   acao: "antagonista", nota: "MT1/MT2 + antagonismo 5-HT2C → antidepressivo com perfil circadiano" },
          { nome: "Fluoxetina",    acao: "modulador_neg", nota: "Efeitos indiretos em 5-HT2C podem atenuar ganho de peso por outros fármacos" },
          { nome: "Lorcaserina",   acao: "ag_parcial",  nota: "Agonismo 5-HT2C → redução de peso (uso não psiquiátrico)" },
        ],
        nivel: "essencial",
        nota: "Antagonistas 5-HT2C contribuem para ganho de peso de antipsicóticos e antidepressivos. Fluoxetina pode atenuar esse efeito quando combinada.",
      },
      {
        id: "5ht3",
        nome: "5-HT3",
        nome_completo: "Receptor serotoninérgico tipo 3",
        tipo: "Ionotrópico (canal de cátions — Na⁺/K⁺)",
        localizacao: ["Trato gastrointestinal", "Área postrema (zona do gatilho do vômito)", "Neurônios periféricos e centrais"],
        funcao: "Mediador de náusea, vômito e motilidade intestinal. Modulação de ansiedade e cognição no SNC.",
        agonismo: "Náusea, vômito, hipermotilidade intestinal.",
        antagonismo: "Antiemético, reduz náusea (especialmente induzida por quimioterapia e opioides). Pode contribuir para efeitos pró-cognitivos.",
        farmacos: [
          { nome: "Ondansetrona",    acao: "antagonista", nota: "Antagonista 5-HT3 seletivo — antiemético, uso em agitação/abstinência" },
          { nome: "Vortioxetina",    acao: "antagonista", nota: "Antagonismo 5-HT3 contribui para perfil pró-cognitivo e tolerabilidade GI" },
          { nome: "Clozapina",       acao: "antagonista", nota: "Antagonismo 5-HT3 parcialmente relevante" },
          { nome: "Mirtazapina",     acao: "antagonista", nota: "Bloqueio 5-HT3 reduz náusea e diarreia" },
        ],
        nivel: "essencial",
      },
      {
        id: "5ht4",
        nome: "5-HT4",
        nome_completo: "Receptor serotoninérgico tipo 4",
        tipo: "GPCR — Gs",
        localizacao: ["Trato gastrointestinal", "Hipocampo", "Estriado"],
        funcao: "Motilidade gastrointestinal, cognição, memória e possível efeito pró-cognitivo/antidepressivo.",
        agonismo: "Melhora motilidade GI; potencial pró-cognitivo e antidepressivo.",
        farmacos: [
          { nome: "Metoclopramida", acao: "ag_parcial", nota: "Procinético via 5-HT4 além de bloqueio D2" },
          { nome: "Cisaprida",      acao: "agonista",   nota: "Procinético seletivo; retirado por risco QT" },
        ],
        nivel: "avancado",
        nota: "Interesse crescente como alvo antidepressivo. Ainda sem fármacos psiquiátricos aprovados com ação primária em 5-HT4.",
      },
      {
        id: "5ht6",
        nome: "5-HT6",
        nome_completo: "Receptor serotoninérgico tipo 6",
        tipo: "GPCR — Gs",
        localizacao: ["Estriado", "Córtex pré-frontal", "Hipocampo"],
        funcao: "Modulação de cognição, memória, apetite e comunicação corticoestrial. Antagonistas promovem liberação de glutamato/acetilcolina em CPF.",
        antagonismo: "Melhora de funções cognitivas e memória; possível redução do peso.",
        farmacos: [
          { nome: "Clozapina",  acao: "antagonista", nota: "Antagonismo 5-HT6 contribui para perfil pró-cognitivo" },
          { nome: "Olanzapina", acao: "antagonista", nota: "Antagonismo 5-HT6 moderado" },
        ],
        nivel: "avancado",
        nota: "Alvo em investigação para demência e déficits cognitivos em esquizofrenia. Idalopirdine e intepirdine foram estudados mas não aprovados.",
      },
      {
        id: "5ht7",
        nome: "5-HT7",
        nome_completo: "Receptor serotoninérgico tipo 7",
        tipo: "GPCR — Gs",
        localizacao: ["Hipotálamo", "Tálamo", "Hipocampo", "Córtex"],
        funcao: "Regulação do ritmo circadiano, humor, sono REM, cognição e plasticidade sináptica.",
        agonismo: "Envolvido na regulação circadiana e manutenção do sono REM.",
        antagonismo: "Reduz sono REM, potencial antidepressivo; melhora de cognição.",
        farmacos: [
          { nome: "Lurasidona",    acao: "antagonista", nota: "Antagonismo 5-HT7 diferencia lurasidona — perfil pró-cognitivo" },
          { nome: "Vortioxetina",  acao: "antagonista", nota: "Componente do perfil multimodal" },
          { nome: "Amisulprida",   acao: "antagonista", nota: "Em doses baixas, antagonismo 5-HT7 contribui para efeito antidepressivo" },
          { nome: "Aripiprazol",   acao: "ag_parcial",  nota: "Agonismo parcial 5-HT7 em alguns estudos" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // B. DOPAMINÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "dopaminergico",
    nome: "Sistema Dopaminérgico",
    descricao: "Fundamental para motivação, recompensa, cognição executiva, controle motor e regulação de prolactina. Organizado em quatro grandes vias.",
    relevancia_clinica: "Alvo central de antipsicóticos (bloqueio D2), agonistas parciais (aripiprazol, cariprazina) e estimulantes (DAT). Hipótese dopaminérgica da psicose e dos sintomas negativos.",
    gradiente: "from-indigo-500 to-violet-600",
    alvos: [
      {
        id: "d1",
        nome: "D1",
        nome_completo: "Receptor dopaminérgico D1",
        tipo: "GPCR — Gs (aumenta AMPc)",
        localizacao: ["Córtex pré-frontal", "Estriado", "Núcleo accumbens", "Neurônios excitatórios"],
        funcao: "Cognição, memória operacional, função executiva e motivação no CPF. Importante para processamento de recompensa.",
        agonismo: "Melhora da cognição e memória de trabalho em doses ótimas (curva em U invertido).",
        antagonismo: "Prejuízo cognitivo e de memória operacional.",
        farmacos: [
          { nome: "Estimulantes (metilfenidato, anfetaminas)", acao: "modulador_pos", nota: "Aumentam DA extracelular indiretamente, estimulando D1 no CPF" },
          { nome: "Apomorfina", acao: "agonista", nota: "Agonista D1/D2 não seletivo — uso em Parkinson" },
        ],
        nivel: "avancado",
        nota: "A relação dose-resposta em D1 do CPF é em U invertido: doses muito altas ou muito baixas prejudicam cognição. Explica por que estimulantes perdem eficácia em doses excessivas.",
      },
      {
        id: "d2",
        nome: "D2",
        nome_completo: "Receptor dopaminérgico D2",
        tipo: "GPCR — Gi/o (inibe AMPc)",
        localizacao: [
          "Via mesolímbica (núcleo accumbens) — recompensa/psicose",
          "Via mesocortical (CPF) — cognição/sintomas negativos",
          "Via nigroestriatal (putâmen) — controle motor",
          "Via tuberoinfundibular (hipotálamo) — prolactina",
        ],
        funcao: "Regulação de recompensa, motivação, cognição executiva, controle motor e inibição tônica de prolactina.",
        agonismo: "Reduz liberação de prolactina; melhora de sintomas motores em Parkinson; em excesso: náusea, vômito, hipotensão.",
        antagonismo: "Efeito antipsicótico (via mesolímbica); EPS como parkinsonismo, distonia e acatisia (via nigroestriatal); hiperprolactinemia (via tuberoinfundibular); possível piora de sintomas negativos/cognitivos (via mesocortical em excesso).",
        farmacos: [
          { nome: "Haloperidol",         acao: "antagonista",  nota: "Antagonista D2 de alta potência — EPS e prolactina elevados" },
          { nome: "Risperidona",         acao: "antagonista",  nota: "D2 + 5-HT2A; altas doses aumentam EPS e prolactina" },
          { nome: "Paliperidona",        acao: "antagonista",  nota: "Metabólito ativo da risperidona" },
          { nome: "Olanzapina",          acao: "antagonista",  nota: "D2 + 5-HT2A + H1 + M1 — metabolismo significativo" },
          { nome: "Quetiapina",          acao: "antagonista",  nota: "Fast-off D2 — menor EPS; alta sedação via H1" },
          { nome: "Clozapina",           acao: "antagonista",  nota: "Baixa afinidade D2 + fast-off; múltiplos alvos; menor EPS/prolactina" },
          { nome: "Ziprasidona",         acao: "antagonista",  nota: "D2 + 5-HT2A + 5-HT1A; risco de QT" },
          { nome: "Lurasidona",          acao: "antagonista",  nota: "D2 + 5-HT2A + 5-HT7; sem ganho de peso significativo" },
          { nome: "Amisulprida",         acao: "antagonista",  nota: "Seletivo D2/D3; maior hiperprolactinemia" },
          { nome: "Aripiprazol",         acao: "ag_parcial",   nota: "Agonismo parcial D2 — estabilizador dopaminérgico; menor prolactina" },
          { nome: "Brexpiprazol",        acao: "ag_parcial",   nota: "Agonismo parcial D2 com menor ativação que aripiprazol" },
          { nome: "Cariprazina",         acao: "ag_parcial",   nota: "Agonismo parcial D2/D3; alta afinidade D3" },
          { nome: "Metoclopramida",      acao: "antagonista",  nota: "Antiemético com risco de EPS e hiperprolactinemia" },
          { nome: "Domperidona",         acao: "antagonista",  nota: "Periférico; hiperprolactinemia sem EPS central significativo" },
        ],
        nivel: "essencial",
        nota: "Ocupação de ~60–80% dos receptores D2 é necessária para efeito antipsicótico; acima de 80% aumenta EPS e hiperprolactinemia. Clozapina e quetiapina usam mecanismo fast-off (dissociação rápida) que explica menor EPS com eficácia antipsicótica.",
      },
      {
        id: "d3",
        nome: "D3",
        nome_completo: "Receptor dopaminérgico D3",
        tipo: "GPCR — Gi/o",
        localizacao: ["Sistema límbico", "Núcleo accumbens", "Tubérculo olfatório", "Hipocampo"],
        funcao: "Motivação, recompensa, anedonia, cognição, dependência química e resposta ao estresse.",
        agonismo: "Melhora da motivação e cognição (em doses fisiológicas).",
        antagonismo: "Potencial antipsicótico adicional, redução de sintomas negativos e anedonia.",
        farmacos: [
          { nome: "Cariprazina",  acao: "ag_parcial", nota: "Maior afinidade por D3 que D2 — diferencial para sintomas negativos" },
          { nome: "Aripiprazol",  acao: "ag_parcial", nota: "Agonismo parcial D3, mas preferência por D2" },
          { nome: "Pramipexol",   acao: "ag_parcial", nota: "Agonista D3 preferencial — Parkinson; estudado em depressão bipolar" },
          { nome: "Amisulprida",  acao: "antagonista", nota: "D2/D3 seletivo" },
        ],
        nivel: "avancado",
        nota: "A alta afinidade da cariprazina por D3 diferencia seu perfil para sintomas negativos e motivação na esquizofrenia.",
      },
      {
        id: "d4",
        nome: "D4",
        nome_completo: "Receptor dopaminérgico D4",
        tipo: "GPCR — Gi/o",
        localizacao: ["Córtex pré-frontal", "Sistema límbico", "Hipocampo"],
        funcao: "Modulação de cognição e plasticidade sináptica. Associado historicamente ao perfil da clozapina.",
        antagonismo: "Contribui para o perfil antipsicótico da clozapina sem causar EPS (não é via nigroestriatal).",
        farmacos: [
          { nome: "Clozapina",  acao: "antagonista", nota: "Alta afinidade por D4 — hipótese histórica de seu mecanismo atípico" },
          { nome: "Olanzapina", acao: "antagonista", nota: "Moderada afinidade por D4" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // C. NORADRENÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "noradrenergico",
    nome: "Sistema Noradrenérgico",
    descricao: "Regula atenção, alerta, resposta ao estresse, ansiedade, sono e função cardiovascular. Origem no locus coeruleus com projeções ao córtex, amígdala e medula espinhal.",
    relevancia_clinica: "Alvo de antidepressivos IRSN, atomoxetina, tricíclicos e alfa-agonistas como clonidina e guanfacina (TDAH, TEPT). Bloqueio alfa-1 causa hipotensão ortostática em vários psicofármacos.",
    gradiente: "from-blue-500 to-cyan-600",
    alvos: [
      {
        id: "alfa1",
        nome: "α1 (Alfa-1)",
        nome_completo: "Receptor adrenérgico alfa-1 (A, B, D)",
        tipo: "GPCR — Gq (excitatório)",
        localizacao: ["Vasos sanguíneos", "SNC (neurônios pós-sinápticos)", "Coração", "Trato urinário"],
        funcao: "Vasoconstrição periférica, excitação neuronal no SNC, contração uretral.",
        agonismo: "Vasoconstrição, midríase, contração do esfíncter uretral.",
        antagonismo: "Hipotensão ortostática, tontura, sedação indireta, congestão nasal, risco de queda especialmente em idosos.",
        farmacos: [
          { nome: "Quetiapina",    acao: "antagonista", nota: "Bloqueio α1 contribui para hipotensão e sedação" },
          { nome: "Clozapina",     acao: "antagonista", nota: "α1 + M1 + H1 — sedação e hipotensão marcantes" },
          { nome: "Risperidona",   acao: "antagonista", nota: "α1 significativo — hipotensão com titulação rápida" },
          { nome: "Olanzapina",    acao: "antagonista", nota: "Bloqueio α1 moderado" },
          { nome: "Trazodona",     acao: "antagonista", nota: "α1 contribui para hipotensão ortostática e efeito hipnótico" },
          { nome: "Tricíclicos",   acao: "antagonista", nota: "Bloqueio α1 intenso — alto risco de hipotensão" },
          { nome: "Prazosina",     acao: "antagonista", nota: "Antagonista seletivo α1 — pesadelos no TEPT, hipotensão na abstinência" },
        ],
        nivel: "essencial",
        nota: "Monitorar PA ao iniciar ou titular fármacos com bloqueio α1 significativo. Especialmente relevante em idosos e cardiopatas.",
      },
      {
        id: "alfa2a",
        nome: "α2A (Alfa-2A)",
        nome_completo: "Receptor adrenérgico alfa-2A",
        tipo: "GPCR — Gi/o (inibitório)",
        localizacao: ["Locus coeruleus (autorreceptor)", "Córtex pré-frontal", "Medula espinhal"],
        funcao: "Autorregulação da liberação de noradrenalina. Modula atenção, impulsividade e hiperatividade autonômica. No CPF: melhora memória de trabalho.",
        agonismo: "Reduz disparo noradrenérgico (sedação, hipotensão, bradicardia). No CPF: melhora atenção e memória de trabalho (guanfacina), reduz hiperatividade autonômica (clonidina).",
        antagonismo: "Aumenta liberação de NA e 5-HT (mecanismo da mirtazapina).",
        farmacos: [
          { nome: "Guanfacina",   acao: "agonista", nota: "Agonista α2A seletivo — TDAH, impulsividade, TEPT (pesadelos/hiperalerta)" },
          { nome: "Clonidina",    acao: "agonista", nota: "Agonista α2 não seletivo — TDAH, abstinência, tiques, hipertensão" },
          { nome: "Mirtazapina",  acao: "antagonista", nota: "Antagonismo α2A/B/C pré-sináptico → ↑NA e ↑5-HT + bloqueio 5-HT2/5-HT3/H1" },
        ],
        nivel: "essencial",
        nota: "Guanfacina (agonista α2A) melhora cognição e controle inibitório no CPF com menor sedação que clonidina. Frequentemente usada no TDAH com ansiedade.",
      },
      {
        id: "alfa2bc",
        nome: "α2B / α2C",
        nome_completo: "Receptores adrenérgicos alfa-2B e alfa-2C",
        tipo: "GPCR — Gi/o",
        localizacao: ["Vasos sanguíneos (α2B)", "Estriado e CPF (α2C)", "Terminais dopaminérgicos"],
        funcao: "α2B: vasoconstrição periférica. α2C: modulação de liberação dopaminérgica e noradrenérgica no estriado e CPF.",
        antagonismo: "α2C: pode aumentar liberação de DA em regiões pré-frontais — interesse cognitivo.",
        farmacos: [
          { nome: "Mirtazapina", acao: "antagonista", nota: "Antagonismo α2B e α2C contribui para efeitos DA/NA" },
        ],
        nivel: "avancado",
      },
      {
        id: "net",
        nome: "NET",
        nome_completo: "Transportador de Noradrenalina (Norepinephrine Transporter)",
        tipo: "Transportador de membrana (SLC6A2)",
        localizacao: ["Terminais noradrenérgicos no SNC e SNP", "CPF", "Locus coeruleus"],
        funcao: "Recaptação de noradrenalina da fenda sináptica, encerrando o sinal noradrenérgico.",
        antagonismo: "Bloquear NET aumenta NA extracelular → efeitos antidepressivos, pró-atencionais, analgésicos e ansiolíticos.",
        farmacos: [
          { nome: "Venlafaxina (doses altas)",  acao: "inibidor", nota: "NET relevante acima de ~150 mg/dia" },
          { nome: "Duloxetina",    acao: "inibidor", nota: "SERT + NET equipotente — dor neuropática e depressão" },
          { nome: "Desvenlafaxina",acao: "inibidor", nota: "NET moderado em doses habituais" },
          { nome: "Atomoxetina",   acao: "inibidor", nota: "Inibidor seletivo de NET — TDAH sem risco de abuso" },
          { nome: "Reboxetina",    acao: "inibidor", nota: "NARI seletivo — pouco disponível no Brasil" },
          { nome: "Bupropiona",    acao: "inibidor", nota: "DAT + NET — antidepressivo ativador, tabagismo, TDAH" },
          { nome: "Tricíclicos",   acao: "inibidor", nota: "SERT + NET + múltiplos bloqueios receptoriais" },
          { nome: "Metilfenidato", acao: "inibidor", nota: "DAT > NET; efeito noradrenérgico pré-frontal relevante para TDAH" },
        ],
        nivel: "essencial",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // D. GLUTAMATÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "glutamatergico",
    nome: "Sistema Glutamatérgico",
    descricao: "Principal sistema excitatório do SNC. Essencial para neuroplasticidade, aprendizado, memória e neurodesenvolvimento.",
    relevancia_clinica: "Hipofunção NMDA como hipótese central da esquizofrenia. Cetamina/esketamina como antidepressivo de ação rápida via antagonismo NMDA. Memanina em demências.",
    gradiente: "from-amber-500 to-yellow-600",
    alvos: [
      {
        id: "nmda",
        nome: "NMDA",
        nome_completo: "Receptor NMDA (N-metil-D-aspartato)",
        tipo: "Ionotrópico — canal de Ca²⁺/Na⁺/K⁺ dependente de voltagem e ligante",
        localizacao: ["Hipocampo", "Córtex pré-frontal", "Estriado", "Amígdala"],
        funcao: "Plasticidade sináptica (LTP/LTD), aprendizado e memória, neurodesenvolvimento. Requer co-agonismo de glutamato + glicina/D-serina + despolarização.",
        agonismo: "LTP, memória de longa duração, neuroplasticidade.",
        antagonismo: "Em doses baixas: dissociação, analgesia, efeito antidepressivo rápido. Em doses altas: psicose, prejuízo cognitivo, efeito anestésico.",
        farmacos: [
          { nome: "Cetamina",       acao: "antagonista", nota: "Antagonismo NMDA no canal aberto → antidepressivo rápido, dissociação" },
          { nome: "Esketamina",     acao: "antagonista", nota: "S-cetamina intranasal aprovada para depressão resistente (Spravato)" },
          { nome: "Memantina",      acao: "antagonista", nota: "Antagonismo de baixa afinidade NMDA — Alzheimer moderado/grave" },
          { nome: "Dextrometorfano",acao: "antagonista", nota: "NMDA + sigma-1; combinado com bupropiona (Auvelity) para depressão" },
          { nome: "Amantadina",     acao: "antagonista", nota: "NMDA fraco — Parkinson, discinesia tardia" },
          { nome: "Fenciclidina (PCP)", acao: "antagonista", nota: "Antagonismo NMDA potente — modelo animal de psicose" },
        ],
        nivel: "essencial",
        nota: "A hipótese NMDA da esquizofrenia (hipofunção glutamatérgica em interneurônios GABAérgicos) explica por que antagonistas NMDA como PCP/cetamina induzem psicose. Cetamina produz antidepressão em horas — mecanismo via AMPA, BDNF e mTOR.",
      },
      {
        id: "ampa",
        nome: "AMPA",
        nome_completo: "Receptor AMPA (ácido alfa-amino-3-hidroxi-5-metil-4-isoxazolepropiônico)",
        tipo: "Ionotrópico — canal de Na⁺/K⁺ (e Ca²⁺ sem subunidade GluA2)",
        localizacao: ["Hipocampo", "Córtex pré-frontal", "Estriado"],
        funcao: "Transmissão excitatória rápida. Base celular do aprendizado e da memória (junto com NMDA).",
        agonismo: "Potenciação sináptica; efeito antidepressivo secundário à cetamina (mediado por AMPA após bloqueio NMDA).",
        farmacos: [
          { nome: "Cetamina/Esketamina", acao: "modulador_pos", nota: "Bloqueio NMDA desinibe AMPA → efluente de BDNF e ativação mTOR" },
          { nome: "Ampakinas (CX-516)",  acao: "modulador_pos", nota: "Potenciadores AMPA em pesquisa para cognição e esquizofrenia" },
        ],
        nivel: "avancado",
        nota: "O mecanismo antidepressivo rápido da cetamina depende de ativação AMPA secundária: bloqueio NMDA em interneurônios GABAérgicos → desinibe neurônios piramidais → burst de glutamato → ativa AMPA → sintetiza BDNF.",
      },
      {
        id: "mglu2_3",
        nome: "mGluR2 / mGluR3",
        nome_completo: "Receptores metabotrópicos de glutamato grupo II",
        tipo: "GPCR — Gi/o (pré-sináptico inibitório)",
        localizacao: ["Terminais glutamatérgicos e GABAérgicos", "Córtex", "Hipocampo", "Tálamo"],
        funcao: "Autorreceptores e heterorreceptores pré-sinápticos que reduzem liberação de glutamato e GABA.",
        agonismo: "Reduz liberação de glutamato → ansiolítico; potencial antipsicótico.",
        farmacos: [
          { nome: "LY404039 (Pomaglumetad)", acao: "agonista", nota: "Agonista mGluR2/3 — estudado em esquizofrenia sem sucesso em fase III" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // E. GABAÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "gabargico",
    nome: "Sistema GABAérgico",
    descricao: "Principal sistema inibitório do SNC. GABA (ácido γ-aminobutírico) controla a excitabilidade neuronal global.",
    relevancia_clinica: "Alvo de benzodiazepínicos, Z-drugs, barbitúricos, anticonvulsivantes e álcool. Essencial para compreender sedação, dependência, abstinência e tratamento da ansiedade.",
    gradiente: "from-green-500 to-emerald-600",
    alvos: [
      {
        id: "gaba_a",
        nome: "GABA-A",
        nome_completo: "Receptor GABA-A",
        tipo: "Ionotrópico — canal de Cl⁻",
        localizacao: ["Difuso pelo SNC", "Córtex", "Hipocampo", "Amígdala", "Cerebelo"],
        funcao: "Hiperpolarização neuronal via influxo de Cl⁻. Mediador da inibição rápida no SNC.",
        agonismo: "Sedação, hipnose, amnésia, miorrelaxamento, anticonvulsivante, ansiolítico.",
        antagonismo: "Excitação, convulsão (bloqueio total como flumazenil reverte BZD).",
        farmacos: [
          { nome: "Benzodiazepínicos (clonazepam, diazepam, alprazolam, lorazepam)", acao: "modulador_pos", nota: "Moduladores alostéricos positivos no sítio BZD — potenciam efeito do GABA" },
          { nome: "Z-drugs (zolpidem, zopiclona)",    acao: "modulador_pos", nota: "Seletivos para subunidade α1 — hipnóticos com menor ansiolítico" },
          { nome: "Barbitúricos (fenobarbital)",       acao: "modulador_pos", nota: "Menor margem de segurança; abrem canal GABA-A diretamente em altas doses" },
          { nome: "Álcool (etanol)",                  acao: "modulador_pos", nota: "Potencia GABA-A e bloqueia NMDA — base da intoxicação e abstinência" },
          { nome: "Propofol",                         acao: "modulador_pos", nota: "Anestésico geral via GABA-A" },
          { nome: "Neuroesteroides (brexanolona)",    acao: "modulador_pos", nota: "Modulação alostérica positiva — aprovado para depressão pós-parto" },
          { nome: "Flumazenil",                       acao: "antagonista",   nota: "Antagonista competitivo no sítio BZD — reversão de intoxicação" },
        ],
        nivel: "essencial",
        nota: "Subunidades GABA-A definem o perfil farmacológico: α1 = sedação/hipnose/amnésia (alvo dos Z-drugs e BZD hipnóticos); α2/α3 = efeito ansiolítico; α5 = memória/cognição (potencialmente pró-cognitivo bloquear α5); γ2 = sítio de ligação dos BZD.",
      },
      {
        id: "gaba_b",
        nome: "GABA-B",
        nome_completo: "Receptor GABA-B",
        tipo: "GPCR — Gi/o (inibitório)",
        localizacao: ["Terminais pré-sinápticos", "Medula espinhal", "Hipocampo", "Tálamo"],
        funcao: "Inibição pré-sináptica de longa duração. Mediador do efeito do baclofeno. Relevante em espasticidade, dependência e ansiedade.",
        agonismo: "Miorrelaxamento, redução da liberação de glutamato, redução da fissura alcoólica.",
        farmacos: [
          { nome: "Baclofeno", acao: "agonista", nota: "Agonista GABA-B — espasticidade, estudado em alcoolismo (uso off-label)" },
          { nome: "GHB (oxibato de sódio)", acao: "ag_parcial", nota: "Agonista GABA-B + receptor GHB — narcolepsia, abuso" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // F. HISTAMINÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "histaminergico",
    nome: "Sistema Histaminérgico",
    descricao: "Regula vigília, apetite, cognição e resposta inflamatória. Neurônios histaminérgicos concentram-se no núcleo tuberomamilar do hipotálamo.",
    relevancia_clinica: "Bloqueio H1 é a principal causa de sedação e ganho de peso de vários psicofármacos. Antagonistas H1 usados como antihistamínicos sedativos e ansiolíticos.",
    gradiente: "from-orange-500 to-amber-600",
    alvos: [
      {
        id: "h1",
        nome: "H1",
        nome_completo: "Receptor histaminérgico H1",
        tipo: "GPCR — Gq",
        localizacao: ["Córtex cerebral", "Hipotálamo", "Cerebelo", "Vias de vigília", "Periférico (vasos, brônquios)"],
        funcao: "Promoção da vigília e alerta. No SNC periférico: mediador de reações alérgicas.",
        agonismo: "Mantém estado de alerta e vigília.",
        antagonismo: "Sedação significativa, sonolência diurna, aumento de apetite, ganho de peso, possível prejuízo cognitivo em idosos.",
        farmacos: [
          { nome: "Quetiapina",     acao: "antagonista", nota: "Alta afinidade H1 — principal responsável pela sedação" },
          { nome: "Olanzapina",     acao: "antagonista", nota: "H1 + 5-HT2C + M1 — sedação e ganho de peso" },
          { nome: "Clozapina",      acao: "antagonista", nota: "Maior sedação entre antipsicóticos atípicos; H1 + M1 + α1" },
          { nome: "Mirtazapina",    acao: "antagonista", nota: "H1 + 5-HT2A + 5-HT2C — forte sedação, antiemético, ganho de peso" },
          { nome: "Prometazina",    acao: "antagonista", nota: "Anti-H1 clássico sedativo — agitação aguda, vômito" },
          { nome: "Hidroxizina",    acao: "antagonista", nota: "Anti-H1 + anticolinérgico suave — ansiedade, prurido, insônia" },
          { nome: "Difenidramina",  acao: "antagonista", nota: "Anti-H1 com forte componente anticolinérgico — evitar em idosos" },
          { nome: "Doxilamina",     acao: "antagonista", nota: "Anti-H1 sedativo — insônia, enjoo gravídico" },
          { nome: "Tricíclicos (amitriptilina, doxepina)", acao: "antagonista", nota: "Bloqueio H1 intenso contribui para sedação" },
        ],
        nivel: "essencial",
        nota: "Bloqueio H1 no SNC = sedação dose-dependente. Em idosos: risco de queda, confusão e delirium. A Mirtazapina paradoxalmente é MENOS sedativa em doses maiores (pois H1 já é bloqueado, e NA aumenta alerta).",
      },
      {
        id: "h3",
        nome: "H3",
        nome_completo: "Receptor histaminérgico H3",
        tipo: "GPCR — Gi/o (autorreceptor inibitório)",
        localizacao: ["Terminais histaminérgicos (autorreceptor)", "Terminais de DA, NA, ACh (heterorreceptor)"],
        funcao: "Autorregulação da liberação de histamina. Modula vigília, cognição e liberação de múltiplos neurotransmissores.",
        antagonismo: "Aumenta histamina, DA, NA, ACh no CPF → efeito pró-cognitivo e de alerta.",
        farmacos: [
          { nome: "Pitolisant", acao: "antagonista", nota: "Antagonista/agonista inverso H3 — narcolepsia, hipersonolência" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // G. COLINÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "colinergico",
    nome: "Sistema Colinérgico",
    descricao: "Regulação de cognição, memória, atenção e função autonômica. Deficiência colinérgica central é a base fisiopatológica da doença de Alzheimer.",
    relevancia_clinica: "Bloqueio muscarínico (anticolinérgico) causa efeitos adversos clássicos: boca seca, constipação, retenção urinária, visão turva, confusão e delirium. Inibidores de AChE usados em demências.",
    gradiente: "from-teal-500 to-cyan-600",
    alvos: [
      {
        id: "m1",
        nome: "M1",
        nome_completo: "Receptor muscarínico M1",
        tipo: "GPCR — Gq",
        localizacao: ["Córtex pré-frontal", "Hipocampo", "Estriado"],
        funcao: "Cognição, memória, aprendizado e processamento no CPF e hipocampo.",
        agonismo: "Melhora cognitiva e de memória (interesse em Alzheimer e esquizofrenia).",
        antagonismo: "Prejuízo cognitivo, confusão mental, delirium (especialmente em idosos), alucinações.",
        farmacos: [
          { nome: "Clozapina",              acao: "antagonista", nota: "Anticolinérgico intenso — boca seca, constipação grave, sialorreia paradoxal" },
          { nome: "Olanzapina",             acao: "antagonista", nota: "Bloqueio M1 moderado a intenso" },
          { nome: "Tricíclicos",            acao: "antagonista", nota: "Anticolinérgico marcante — risco de delirium em idosos" },
          { nome: "Biperideno",             acao: "antagonista", nota: "Anticolinérgico para EPS — evitar em idosos e demência" },
          { nome: "Xanomeline-trospium",    acao: "agonista",    nota: "Agonista M1/M4 + trospium periférico — aprovado para esquizofrenia (KarXT)" },
          { nome: "Donepezila",             acao: "modulador_pos", nota: "Inibe AChE → ↑ACh endógena → ativa M1 e nAChR" },
        ],
        nivel: "essencial",
        nota: "Carga anticolinérgica cumulativa em idosos aumenta risco de delirium e demência. Evitar combinação de múltiplos fármacos com bloqueio muscarínico.",
      },
      {
        id: "m3",
        nome: "M3",
        nome_completo: "Receptor muscarínico M3",
        tipo: "GPCR — Gq",
        localizacao: ["Glândulas salivares e gástricas", "Intestino", "Bexiga urinária", "Olho (músculo ciliar)", "Pâncreas"],
        funcao: "Secreção glandular, motilidade intestinal, contração vesical, acomodação ocular.",
        antagonismo: "Boca seca, constipação, retenção urinária, visão turva, ciclopleja, possível impacto metabólico (bloqueio M3 pancreático pode reduzir secreção de insulina).",
        farmacos: [
          { nome: "Clozapina",    acao: "antagonista", nota: "Alto risco de constipação grave e íleo paralítico" },
          { nome: "Olanzapina",   acao: "antagonista", nota: "Boca seca e constipação" },
          { nome: "Tricíclicos",  acao: "antagonista", nota: "Retenção urinária em hiperplasia prostática" },
          { nome: "Biperideno",   acao: "antagonista", nota: "Anticolinérgico para EPS" },
        ],
        nivel: "essencial",
      },
      {
        id: "m4",
        nome: "M4",
        nome_completo: "Receptor muscarínico M4",
        tipo: "GPCR — Gi/o",
        localizacao: ["Estriado", "Sistema límbico", "Córtex"],
        funcao: "Modulação de liberação dopaminérgica no estriado. Interesse crescente em psicose.",
        agonismo: "Reduz liberação dopaminérgica no estriado; potencial antipsicótico sem bloqueio D2.",
        farmacos: [
          { nome: "Xanomeline-trospium", acao: "agonista", nota: "Agonismo M1/M4 como mecanismo antipsicótico alternativo ao bloqueio D2" },
        ],
        nivel: "avancado",
        nota: "O agonismo M4 representa uma nova abordagem para tratar psicose sem os efeitos adversos do bloqueio D2 (EPS, hiperprolactinemia).",
      },
      {
        id: "nacho_a4b2",
        nome: "nAChR α4β2",
        nome_completo: "Receptor nicotínico alfa-4 beta-2",
        tipo: "Ionotrópico (canal de cátions)",
        localizacao: ["Córtex pré-frontal", "Tálamo", "Vias mesolímbicas"],
        funcao: "Atenção, recompensa e dependência ao tabaco. Principal receptor nicotínico envolvido na dependência à nicotina.",
        agonismo: "Alerta, atenção, liberação de DA no accumbens → reforço positivo do tabagismo.",
        antagonismo: "Reduz dependência e fissura ao tabaco.",
        farmacos: [
          { nome: "Vareniclina",  acao: "ag_parcial", nota: "Agonismo parcial α4β2 — reduz fissura e bloqueia reforço da nicotina" },
          { nome: "Nicotina",     acao: "agonista",   nota: "Agonismo pleno — TRN (adesivo, goma, pastilha)" },
          { nome: "Bupropiona",   acao: "antagonista",nota: "Bloqueio nAChR contribui para cessação tabágica" },
        ],
        nivel: "essencial",
      },
      {
        id: "nacho_a7",
        nome: "nAChR α7",
        nome_completo: "Receptor nicotínico alfa-7",
        tipo: "Ionotrópico (canal de Ca²⁺ principalmente)",
        localizacao: ["Hipocampo", "Córtex pré-frontal", "Neurônios GABAérgicos e glutamatérgicos"],
        funcao: "Cognição, memória, atenção e neuroproteção. Associado a déficits cognitivos na esquizofrenia.",
        agonismo: "Melhora de cognição e memória; efeito anti-inflamatório via via colinérgica anti-inflamatória.",
        farmacos: [
          { nome: "Encenicline (EVP-6124)", acao: "agonista", nota: "Agonista α7 em estudos para cognição em esquizofrenia" },
          { nome: "Nicotina", acao: "agonista", nota: "Agonismo α7 associado a efeitos pró-cognitivos" },
        ],
        nivel: "avancado",
        nota: "Pacientes com esquizofrenia têm hipofunção do receptor α7, o que contribui para déficits cognitivos. Alta prevalência de tabagismo na esquizofrenia pode ser uma automedicação.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // H. OPIOIDE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "opioide",
    nome: "Sistema Opioide",
    descricao: "Regula dor, prazer, recompensa, humor e resposta ao estresse. Envolve três famílias de receptores: mu, kappa e delta.",
    relevancia_clinica: "Alvo de opioides analgésicos, antagonistas (naltrexona, naloxona) para dependência, e novos antidepressivos (buprenorfina/samidorfana). Kappa-opioide ligado a disforia e depressão.",
    gradiente: "from-red-500 to-rose-600",
    alvos: [
      {
        id: "mu",
        nome: "Mu (μ)",
        nome_completo: "Receptor opioide mu (MOR)",
        tipo: "GPCR — Gi/o",
        localizacao: ["Área periaquedutal cinzenta", "Corno dorsal da medula", "Núcleo accumbens", "VTA"],
        funcao: "Analgesia, euforia, reforço positivo, depressão respiratória, constipação, supressão do eixo HPA.",
        agonismo: "Analgesia potente, euforia, sedação, depressão respiratória, dependência.",
        antagonismo: "Reversão de overdose, redução da fissura por opioides e álcool.",
        farmacos: [
          { nome: "Morfina, Codeína, Oxicodona", acao: "agonista",   nota: "Opioides analgésicos de agonismo pleno" },
          { nome: "Metadona",                    acao: "agonista",   nota: "Agonismo pleno + bloqueio NMDA + risco QT" },
          { nome: "Buprenorfina",                acao: "ag_parcial", nota: "Agonismo parcial mu + antagonismo kappa — TSO, dor" },
          { nome: "Naltrexona",                  acao: "antagonista",nota: "Antagonismo mu — dependência química (álcool e opioides)" },
          { nome: "Naloxona",                    acao: "antagonista",nota: "Antagonismo mu de curta ação — reversão de overdose" },
          { nome: "Buprenorfina/Samidorfana",    acao: "ag_parcial", nota: "Agonismo parcial mu + antagonismo mu — em estudo para depressão" },
        ],
        nivel: "essencial",
      },
      {
        id: "kappa",
        nome: "Kappa (κ)",
        nome_completo: "Receptor opioide kappa (KOR)",
        tipo: "GPCR — Gi/o",
        localizacao: ["Hipotálamo", "Amígdala", "Córtex", "Núcleo accumbens"],
        funcao: "Disforia, anedonia, resposta ao estresse, alucinações. Antimodulador do circuito de recompensa.",
        agonismo: "Disforia intensa, alucinações sedativas, anedonia, efeitos dissociativos.",
        antagonismo: "Potencial antidepressivo, redução da disforia e anedonia.",
        farmacos: [
          { nome: "Buprenorfina",    acao: "antagonista",nota: "Antagonismo kappa — contribui para efeito antidepressivo" },
          { nome: "CERC-501 (Aticaprant)", acao: "antagonista", nota: "Antagonista kappa seletivo em estudos para depressão anedônica" },
          { nome: "Pentazocina",     acao: "ag_parcial", nota: "Analgésico opioide com agonismo kappa — disforia como EA" },
        ],
        nivel: "avancado",
        nota: "A hiperfunção do sistema kappa é associada a estados disfóricos, anedonia e depressão. Buprenorfina tem efeito antidepressivo parcialmente via antagonismo kappa.",
      },
      {
        id: "delta",
        nome: "Delta (δ)",
        nome_completo: "Receptor opioide delta (DOR)",
        tipo: "GPCR — Gi/o",
        localizacao: ["Córtex", "Estriado", "Amígdala", "Bulbo olfatório"],
        funcao: "Modulação de humor, analgesia e comportamento de recompensa.",
        agonismo: "Analgesia moderada, potencial ansiolítico e antidepressivo.",
        farmacos: [],
        nivel: "avancado",
        nota: "Poucos fármacos aprovados com ação delta seletiva. Alvo de interesse para depressão e dor crônica.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // I. ENDOCANABINOIDE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "endocanabinoide",
    nome: "Sistema Endocanabinoide",
    descricao: "Sistema de sinalização retrógrada que modula liberação de GABA, glutamato e dopamina. Envolvido em plasticidade sináptica, apetite, dor, memória e resposta ao estresse.",
    relevancia_clinica: "CB1 central como alvo da cannabis (THC) — riscos de psicose e dependência. CBD tem perfil ansiolítico/antiepiléptico. Interesse crescente em uso medicinal.",
    gradiente: "from-lime-600 to-green-600",
    alvos: [
      {
        id: "cb1",
        nome: "CB1",
        nome_completo: "Receptor canabinóide tipo 1",
        tipo: "GPCR — Gi/o",
        localizacao: ["Córtex pré-frontal", "Hipocampo", "Gânglios da base", "Cerebelo", "Amígdala"],
        funcao: "Sinalização retrógrada: reduz liberação pré-sináptica de GABA e glutamato. Regula apetite, humor, memória e analgesia.",
        agonismo: "Euforia, relaxamento, aumento de apetite, analgesia, comprometimento de memória de curto prazo, risco de psicose em uso crônico/vulneráveis.",
        antagonismo: "Redução de apetite, supressão da dependência a cannabis, possível ansiedade.",
        farmacos: [
          { nome: "THC (delta-9-tetrahidrocanabinol)", acao: "ag_parcial", nota: "Agonismo parcial CB1 — componente psicoativo da cannabis" },
          { nome: "CBD (canabidiol)",                  acao: "modulador_neg", nota: "Modulador negativo alostérico CB1 + múltiplos outros alvos" },
          { nome: "Rimonabanto",                       acao: "antagonista",  nota: "Antagonista/agonista inverso CB1 — retirado por depressão/suicídio" },
          { nome: "Dronabinol",                        acao: "agonista",     nota: "THC sintético — náusea em quimioterapia, anorexia em AIDS" },
        ],
        nivel: "essencial",
        nota: "Cannabis com alto teor de THC e baixo CBD aumenta o risco de psicose, especialmente em adolescentes e geneticamente vulneráveis (COMT Val/Val). CBD tem efeito antipsicótico parcial.",
      },
      {
        id: "cb2",
        nome: "CB2",
        nome_completo: "Receptor canabinóide tipo 2",
        tipo: "GPCR — Gi/o",
        localizacao: ["Células imunes", "Microglia", "Neurônios (em menor densidade)"],
        funcao: "Imunomodulação e neuroinflamação. Menor papel na regulação do humor direto.",
        agonismo: "Anti-inflamatório, neuroprotetor.",
        farmacos: [
          { nome: "CBD (canabidiol)", acao: "modulador_pos", nota: "Efeitos CB2 contribuem para perfil anti-inflamatório" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // J. MELATONINÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "melatoninergico",
    nome: "Sistema Melatoninérgico",
    descricao: "Regula o ritmo circadiano, início do sono e fase do ciclo sono-vigília. Melatonina secretada pela epífise em resposta à escuridão.",
    relevancia_clinica: "Alvo da agomelatina (MT1/MT2 + antagonismo 5-HT2C) e do ramelteona. Melatonina exógena usada para insônia e jet lag.",
    gradiente: "from-indigo-500 to-blue-600",
    alvos: [
      {
        id: "mt1",
        nome: "MT1",
        nome_completo: "Receptor melatoninérgico MT1",
        tipo: "GPCR — Gi/o",
        localizacao: ["Núcleo supraquiasmático (NSQ)", "Hipófise"],
        funcao: "Inibição do NSQ (marcapasso circadiano) → indução do sono. Regulação do início e latência do sono.",
        agonismo: "Reduz latência do sono, sincroniza ritmo circadiano.",
        farmacos: [
          { nome: "Melatonina",  acao: "agonista", nota: "MT1/MT2 — reposição fisiológica; jet lag, insônia em idosos, distúrbios circadianos" },
          { nome: "Ramelteona",  acao: "agonista", nota: "MT1/MT2 altamente seletivo — aprovado para insônia" },
          { nome: "Agomelatina", acao: "agonista", nota: "MT1/MT2 + antagonismo 5-HT2C → antidepressivo com ação circadiana" },
        ],
        nivel: "essencial",
      },
      {
        id: "mt2",
        nome: "MT2",
        nome_completo: "Receptor melatoninérgico MT2",
        tipo: "GPCR — Gi/o",
        localizacao: ["Núcleo supraquiasmático", "Retina"],
        funcao: "Regulação de fase do ciclo sono-vigília (phase-shifting) e consolidação do ritmo circadiano.",
        agonismo: "Avança ou atrasa a fase do ritmo circadiano conforme o horário de administração.",
        farmacos: [
          { nome: "Melatonina",  acao: "agonista", nota: "MT1/MT2 — timing de administração crucial para phase-shift" },
          { nome: "Ramelteona",  acao: "agonista", nota: "MT1/MT2 seletivo" },
          { nome: "Agomelatina", acao: "agonista", nota: "MT1/MT2 + 5-HT2C" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // K. OREXINÉRGICO
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "orexinergico",
    nome: "Sistema Orexinérgico / Hipocretina",
    descricao: "Sistema de promoção da vigília e estabilização do ciclo sono-vigília. Neurônios orexinérgicos localizam-se no hipotálamo lateral.",
    relevancia_clinica: "Perda de neurônios orexinérgicos causa narcolepsia tipo 1. Antagonistas de orexina são hipnóticos de nova geração com perfil diferenciado dos BZD/Z-drugs.",
    gradiente: "from-purple-500 to-violet-600",
    alvos: [
      {
        id: "ox1_ox2",
        nome: "OX1 / OX2",
        nome_completo: "Receptores orexina-1 e orexina-2",
        tipo: "GPCR — Gq (principalmente)",
        localizacao: ["Locus coeruleus (OX1 preferencial)", "Núcleo tuberomamilar, RD, VTA (OX2)", "Hipotálamo", "Tronco encefálico"],
        funcao: "OX2: promoção da vigília (principal). OX1: modulação de recompensa e apetite. Ambos: estabilização do ciclo sono-vigília impedindo transições abruptas.",
        agonismo: "Promoção e manutenção da vigília, aumento do apetite.",
        antagonismo: "Indução de sono sem supressão do sono REM como os BZD. Redução da latência e manutenção do sono.",
        farmacos: [
          { nome: "Suvorexanto",    acao: "antagonista", nota: "Antagonista dual OX1/OX2 — aprovado para insônia" },
          { nome: "Lemborexanto",   acao: "antagonista", nota: "Antagonista dual OX1/OX2 — maior manutenção do sono" },
          { nome: "Daridorexanto",  acao: "antagonista", nota: "Antagonista dual — aprovado em 2023; menor efeito residual" },
        ],
        nivel: "essencial",
        nota: "Diferencial dos antagonistas de orexina vs BZD/Z-drugs: preservam arquitetura normal do sono (incluindo REM), sem amnésia anterógrada, menor risco de dependência e comportamentos complexos.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // L. SIGMA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "sigma",
    nome: "Sistema Sigma",
    descricao: "Receptores reguladores de estresse celular, neuroplasticidade e modulação de múltiplos sistemas. Não são receptores de neurotransmissores clássicos.",
    relevancia_clinica: "Sigma-1 tem propriedades neuroprotetoras e moduladoras de receptores NMDA. Alvo da fluvoxamina e dextrometorfano. Relevante em depressão e neuroproteção.",
    gradiente: "from-slate-500 to-zinc-600",
    alvos: [
      {
        id: "sigma1",
        nome: "Sigma-1",
        nome_completo: "Receptor Sigma-1 (σ1R)",
        tipo: "Proteína chaperona (MAM — mitocondria-associated membrane)",
        localizacao: ["Retículo endoplasmático", "Mitocôndria", "Neurônios do tronco encefálico e córtex"],
        funcao: "Modulação de canais iônicos (incluindo NMDA), homeostase do cálcio, estresse de retículo, neuroplasticidade e resposta ao estresse celular.",
        agonismo: "Neuroproteção, modulação de receptores NMDA, potencial antidepressivo e ansiolítico.",
        farmacos: [
          { nome: "Fluvoxamina",      acao: "agonista", nota: "ISRS com maior afinidade sigma-1 — potencial em inflamação e COVID" },
          { nome: "Dextrometorfano",  acao: "agonista", nota: "Sigma-1 + NMDA — combinado com bupropiona (Auvelity) para depressão" },
          { nome: "Escitalopram",     acao: "agonista", nota: "Afinidade sigma-1 moderada" },
          { nome: "Haloperidol",      acao: "antagonista", nota: "Antagonismo sigma-1 entre outros alvos" },
        ],
        nivel: "avancado",
        nota: "A alta afinidade da fluvoxamina pelo sigma-1 foi proposta como mecanismo para reduzir inflamação citocínica e foi estudada no contexto de COVID-19.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // M. TRANSPORTADORES DE MONOAMINAS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "transportadores",
    nome: "Transportadores de Monoaminas",
    descricao: "Proteínas de membrana responsáveis pela recaptação de serotonina, noradrenalina, dopamina e monoaminas vesiculares. Alvos primários da maioria dos antidepressivos.",
    relevancia_clinica: "SERT, NET e DAT são os alvos dos ISRS, IRSN, ATC, IMAO e estimulantes. VMAT2 é o alvo para tratamento da discinesia tardia.",
    gradiente: "from-cyan-600 to-blue-600",
    alvos: [
      {
        id: "sert",
        nome: "SERT",
        nome_completo: "Transportador de Serotonina (Serotonin Reuptake Transporter — SLC6A4)",
        tipo: "Transportador de membrana",
        localizacao: ["Terminais serotoninérgicos", "Plaquetas (SERT periférico)"],
        funcao: "Recaptação de serotonina da fenda sináptica para o neurônio pré-sináptico. Terminação do sinal serotoninérgico.",
        antagonismo: "↑5-HT extracelular → efeito antidepressivo, ansiolítico, TOC, disfunção sexual.",
        farmacos: [
          { nome: "Escitalopram",  acao: "inibidor", nota: "ISRS de maior seletividade SERT; melhor tolerabilidade" },
          { nome: "Sertralina",    acao: "inibidor", nota: "Referência no TDM; efeito DAT mínimo" },
          { nome: "Fluoxetina",    acao: "inibidor", nota: "Meia-vida longa (norfluoxetina); inibe CYP2D6" },
          { nome: "Citalopram",    acao: "inibidor", nota: "Risco QT dose-dependente; limite 40 mg (20 mg >60 anos)" },
          { nome: "Paroxetina",    acao: "inibidor", nota: "ISRS + anticolinérgico + NET fraco; maior síndrome de retirada" },
          { nome: "Fluvoxamina",   acao: "inibidor", nota: "ISRS + agonista sigma-1; TOC, interações CYP" },
          { nome: "Venlafaxina",   acao: "inibidor", nota: "SERT dominante em doses baixas; NET em doses maiores" },
          { nome: "Duloxetina",    acao: "inibidor", nota: "SERT + NET — dor neuropática" },
          { nome: "Clomipramina",  acao: "inibidor", nota: "ATC com maior potência serotoninérgica — TOC" },
          { nome: "Vortioxetina",  acao: "inibidor", nota: "SERT + modulação direta de 5-HT1A/1B/3/7" },
          { nome: "MDMA",          acao: "inibidor", nota: "Reversor de SERT — liberação maciça de 5-HT (uso illícito / pesquisa TEPT)" },
        ],
        nivel: "essencial",
      },
      {
        id: "dat",
        nome: "DAT",
        nome_completo: "Transportador de Dopamina (Dopamine Transporter — SLC6A3)",
        tipo: "Transportador de membrana",
        localizacao: ["Terminais dopaminérgicos do estriado e CPF"],
        funcao: "Recaptação de dopamina da fenda sináptica. Terminação rápida do sinal dopaminérgico.",
        antagonismo: "↑DA extracelular → efeito estimulante, melhora de atenção, reforço de recompensa, potencial de abuso.",
        farmacos: [
          { nome: "Metilfenidato",  acao: "inibidor", nota: "DAT > NET — TDAH; forma OROS tem menor potencial de abuso" },
          { nome: "Anfetaminas",    acao: "inibidor", nota: "DAT + liberação ativa de DA/NA — mais potente que metilfenidato" },
          { nome: "Lisdexanfetamina",acao:"inibidor", nota: "Pró-fármaco de d-anfetamina — menor abuso por ativação lenta" },
          { nome: "Bupropiona",     acao: "inibidor", nota: "DAT + NET fraco — antidepressivo ativador, tabagismo" },
          { nome: "Modafinil",      acao: "inibidor", nota: "DAT fraco + outros mecanismos — vigília" },
          { nome: "Cocaína",        acao: "inibidor", nota: "Bloqueio DAT, NET e SERT — alto potencial de abuso" },
        ],
        nivel: "essencial",
      },
      {
        id: "vmat2",
        nome: "VMAT2",
        nome_completo: "Transportador Vesicular de Monoaminas tipo 2 (SLC18A2)",
        tipo: "Transportador vesicular",
        localizacao: ["Vesículas de neurônios monoaminérgicos (DA, NA, 5-HT, histamina)"],
        funcao: "Empacotamento de monoaminas em vesículas sinápticas para liberação exocitótica.",
        antagonismo: "Depleta monoaminas pré-sinapticamente → reduz movimentos involuntários hiperdopaminérgicos (discinesia tardia, coreia).",
        farmacos: [
          { nome: "Valbenazina",       acao: "inibidor", nota: "Inibidor VMAT2 seletivo — aprovado para discinesia tardia" },
          { nome: "Deutetrabenazina",  acao: "inibidor", nota: "VMAT2 — discinesia tardia e coreia de Huntington" },
          { nome: "Tetrabenazina",     acao: "inibidor", nota: "VMAT2 original — menos seletivo, mais EA (depressão, parkinsonismo)" },
        ],
        nivel: "essencial",
        nota: "VMAT2 é o alvo dos únicos fármacos aprovados especificamente para discinesia tardia. Mecanismo: reduz liberação dopaminérgica pré-sináptica sem bloquear D2.",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // N. ENZIMAS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "enzimas",
    nome: "Enzimas Relevantes",
    descricao: "MAO (metabolismo de monoaminas), COMT (catecolaminas) e CYP450 (biotransformação hepática). Determinam metabolismo, interações e farmacogenética.",
    relevancia_clinica: "IMAOs: interações potencialmente fatais (síndrome serotoninérgica, crise hipertensiva). CYP450: base das interações medicamentosas farmacocinéticas.",
    gradiente: "from-violet-600 to-purple-700",
    alvos: [
      {
        id: "mao_a",
        nome: "MAO-A",
        nome_completo: "Monoamina oxidase A",
        tipo: "Enzima mitocondrial (oxidação)",
        localizacao: ["Mitocôndrias de neurônios serotoninérgicos e noradrenérgicos", "Intestino (barreira à tiramina)"],
        funcao: "Metabolismo de serotonina, noradrenalina, dopamina e tiramina.",
        antagonismo: "↑5-HT, ↑NA → efeito antidepressivo potente. Risco de crise hipertensiva com tiramina (queijo, embutidos) e síndrome serotoninérgica.",
        farmacos: [
          { nome: "Tranilcipromina",  acao: "inibidor", nota: "IMAO irreversível não seletivo (MAO-A e MAO-B) — dieta pobre em tiramina" },
          { nome: "Fenelzina",        acao: "inibidor", nota: "IMAO irreversível — depressão atípica" },
          { nome: "Moclobemida",      acao: "inibidor", nota: "IMAO-A reversível (RIMA) — menor risco de crise hipertensiva" },
          { nome: "Linezolida",       acao: "inibidor", nota: "Antibiótico com inibição MAO-A — síndrome serotoninérgica com ISRS" },
        ],
        nivel: "essencial",
        nota: "Washout de 14 dias é necessário após IMAO irreversível antes de qualquer serotoninérgico. Com moclobemida, washout de 24h é suficiente. Linezolida e azul de metileno são inibidores de MAO ocultos.",
      },
      {
        id: "mao_b",
        nome: "MAO-B",
        nome_completo: "Monoamina oxidase B",
        tipo: "Enzima mitocondrial",
        localizacao: ["Neurônios dopaminérgicos e serotoninérgicos", "Plaquetas"],
        funcao: "Metabolismo preferencial de dopamina e β-feniletlamina.",
        antagonismo: "↑DA → efeito antiparkinsoniano. Em doses baixas e seletivas, menor risco de interação com tiramina.",
        farmacos: [
          { nome: "Selegilina",   acao: "inibidor", nota: "MAO-B seletivo em doses baixas — Parkinson; parche transdérmico aprovado para depressão" },
          { nome: "Rasagilina",   acao: "inibidor", nota: "MAO-B irreversível seletivo — Parkinson" },
          { nome: "Safinamida",   acao: "inibidor", nota: "MAO-B + bloqueio de canais de Na — adjuvante em Parkinson" },
        ],
        nivel: "avancado",
      },
      {
        id: "cyp2d6",
        nome: "CYP2D6",
        nome_completo: "Citocromo P450 2D6",
        tipo: "Enzima hepática de biotransformação",
        localizacao: ["Fígado (90% do metabolismo)", "Intestino delgado"],
        funcao: "Metabolismo de ~25% dos fármacos em uso clínico, incluindo antidepressivos, antipsicóticos e opioides.",
        farmacos: [
          { nome: "Fluoxetina",  acao: "inibidor", nota: "Inibidor potente CYP2D6 — eleva níveis de tricíclicos, antipsicóticos, tamoxifeno" },
          { nome: "Paroxetina",  acao: "inibidor", nota: "Inibidor potente CYP2D6 — autoinibição + interações múltiplas" },
          { nome: "Bupropiona",  acao: "inibidor", nota: "Inibidor moderado CYP2D6" },
          { nome: "Risperidona", acao: "substrato", nota: "Metabolizado por CYP2D6 e CYP3A4" },
          { nome: "Aripiprazol", acao: "substrato", nota: "Substrato de CYP2D6 e CYP3A4" },
          { nome: "Codeína",     acao: "substrato", nota: "Pró-fármaco → morfina via CYP2D6; PM pode ter dose insuficiente" },
          { nome: "Tamoxifeno",  acao: "substrato", nota: "Inibidores CYP2D6 reduzem eficácia em câncer de mama" },
        ],
        nivel: "essencial",
        nota: "Variabilidade genética: PM (metabolizador pobre, 7% populaçao caucasiana) e UM (ultrarrápido, >2 cópias). Fluoxetina e paroxetina transformam MEs em PMs funcionais — cuidado com ajuste de dose de substratos.",
      },
      {
        id: "cyp3a4",
        nome: "CYP3A4",
        nome_completo: "Citocromo P450 3A4",
        tipo: "Enzima hepática e intestinal de biotransformação",
        localizacao: ["Fígado (60% da metabolização hepática)", "Enterócitos (efeito de primeira passagem)"],
        funcao: "Principal enzima do metabolismo de fármacos — responsável por ~50% dos medicamentos metabolizados.",
        farmacos: [
          { nome: "Quetiapina",    acao: "substrato", nota: "Indutores CYP3A4 (carbamazepina) reduzem níveis até 5x" },
          { nome: "Lurasidona",    acao: "substrato", nota: "Contraindicado com inibidores potentes de CYP3A4" },
          { nome: "Cariprazina",   acao: "substrato", nota: "CYP3A4 primário" },
          { nome: "Alprazolam",    acao: "substrato", nota: "Benzodiazepínico sensível a CYP3A4" },
          { nome: "Zolpidem",      acao: "substrato", nota: "Hipnótico metabolizado por CYP3A4" },
          { nome: "Carbamazepina", acao: "inibidor",  nota: "Autoindutor de CYP3A4 + indutor de outros CYPs" },
          { nome: "Cetoconazol",   acao: "inibidor",  nota: "Inibidor potente — aumenta levels de substratos" },
          { nome: "Succo de toranja", acao: "inibidor", nota: "Inibe CYP3A4 intestinal — aumenta biodisponibilidade de vários fármacos" },
        ],
        nivel: "essencial",
      },
      {
        id: "cyp1a2",
        nome: "CYP1A2",
        nome_completo: "Citocromo P450 1A2",
        tipo: "Enzima hepática",
        localizacao: ["Fígado"],
        funcao: "Metabolismo de clozapina, olanzapina, cafeína e alguns outros fármacos.",
        farmacos: [
          { nome: "Clozapina",     acao: "substrato", nota: "70% metabolizado por CYP1A2 — tabagismo induz CYP1A2, reduzindo níveis" },
          { nome: "Olanzapina",    acao: "substrato", nota: "~50% via CYP1A2" },
          { nome: "Cafeína",       acao: "substrato", nota: "Marcador funcional de CYP1A2" },
          { nome: "Fluvoxamina",   acao: "inibidor",  nota: "Inibidor potente CYP1A2 — eleva muito níveis de clozapina/olanzapina" },
          { nome: "Tabagismo",     acao: "inibidor",  nota: "Hidrocarbonetos policíclicos induzem CYP1A2 — parar de fumar pode dobrar níveis de clozapina" },
        ],
        nivel: "essencial",
        nota: "Pearl crítico: ao parar de fumar durante uso de clozapina, os níveis de clozapina podem aumentar 50–100% com risco de convulsão/toxicidade. Monitorar clinimetria e ajustar dose proativamente.",
      },
      {
        id: "cyp2c19",
        nome: "CYP2C19",
        nome_completo: "Citocromo P450 2C19",
        tipo: "Enzima hepática",
        localizacao: ["Fígado"],
        funcao: "Metabolismo de escitalopram, citalopram, sertralina (parcial) e diazepam.",
        farmacos: [
          { nome: "Escitalopram",  acao: "substrato", nota: "PM CYP2C19 pode ter níveis 2x maiores — monitorar QT" },
          { nome: "Citalopram",    acao: "substrato", nota: "Risco QT ampliado em PMs" },
          { nome: "Diazepam",      acao: "substrato", nota: "Clearance reduzido em PMs" },
          { nome: "Omeprazol",     acao: "inibidor",  nota: "Inibe CYP2C19 — pode elevar escitalopram" },
          { nome: "Fluvoxamina",   acao: "inibidor",  nota: "Inibidor moderado a potente de CYP2C19" },
        ],
        nivel: "avancado",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // O. CANAIS IÔNICOS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "canais",
    nome: "Canais Iônicos",
    descricao: "Alvos de anticonvulsivantes com uso psiquiátrico. Canais de sódio (estabilizadores de humor), cálcio (ansiolíticos/antiálgicos) e VGSC na base da maioria dos estabilizadores.",
    relevancia_clinica: "Carbamazepina, lamotrigina e valproato agem em canais de Na⁺. Pregabalina e gabapentina em canais de Ca²⁺ — essenciais para dor neuropática, ansiedade e abuso potencial.",
    gradiente: "from-yellow-500 to-amber-600",
    alvos: [
      {
        id: "canal_na",
        nome: "Canais de Sódio Voltagem-Dependentes (VGSC)",
        nome_completo: "Voltage-Gated Sodium Channels (Nav1.x)",
        tipo: "Canal iônico voltagem-dependente",
        localizacao: ["Axônios", "Somas neuronais", "Dendritos"],
        funcao: "Geração e propagação do potencial de ação. Essenciais para excitabilidade neuronal.",
        antagonismo: "Estabilização de membrana → redução de firing de alta frequência → anticonvulsivante e estabilizador de humor.",
        farmacos: [
          { nome: "Carbamazepina",  acao: "antagonista", nota: "Bloqueio canal Na dependente de uso — mania, epilepsia, neuralgia" },
          { nome: "Oxcarbazepina",  acao: "antagonista", nota: "Análogo da carbamazepina; menos interações CYP" },
          { nome: "Lamotrigina",    acao: "antagonista", nota: "Bloqueia Na + reduz liberação de glutamato pré-sináptico" },
          { nome: "Valproato",      acao: "antagonista", nota: "Na + outros mecanismos (GABAérgico, histona deacetilase)" },
          { nome: "Fenitoína",      acao: "antagonista", nota: "Epilepsia; poucos usos psiquiátricos" },
          { nome: "Topiramato",     acao: "antagonista", nota: "Na + GABA-A + antagonismo AMPA — epilepsia, off-label psiquiátrico" },
        ],
        nivel: "essencial",
      },
      {
        id: "canal_ca_a2d",
        nome: "Canais de Cálcio — Subunidade α2δ",
        nome_completo: "Canais de Cálcio Voltagem-Dependentes — subunidade auxiliar α2δ",
        tipo: "Canal iônico voltagem-dependente (subunidade auxiliar)",
        localizacao: ["Terminais pré-sinápticos", "Neurônios sensoriais", "SNC"],
        funcao: "Regulação da liberação de neurotransmissores, transmissão da dor, excitabilidade neuronal.",
        antagonismo: "Reduz liberação de neurotransmissores excitatórios → ansiolítico, antiálgico, hipnótico.",
        farmacos: [
          { nome: "Pregabalina", acao: "antagonista", nota: "TAG, dor neuropática, fibromialgia — potencial de abuso significativo" },
          { nome: "Gabapentina", acao: "antagonista", nota: "Similar à pregabalina; menor afinidade e biodisponibilidade não linear" },
        ],
        nivel: "essencial",
        nota: "Pregabalina e gabapentina NÃO agem diretamente em receptores GABA, apesar dos nomes. Atuam na subunidade α2δ de canais de cálcio. Potencial de abuso crescente — especialmente em pacientes com histórico de dependência.",
      },
      {
        id: "sv2a",
        nome: "SV2A",
        nome_completo: "Glicoproteína de vesícula sináptica SV2A",
        tipo: "Proteína de vesícula sináptica",
        localizacao: ["Vesículas sinápticas de neurônios inibitórios e excitatórios"],
        funcao: "Regulação da fusão de vesículas e liberação de neurotransmissores em sinapses de alta frequência.",
        antagonismo: "Reduz liberação excitatória de alta frequência — anticonvulsivante.",
        farmacos: [
          { nome: "Levetiracetam", acao: "antagonista", nota: "Antiepiléptico com mecanismo único — pode causar irritabilidade, depressão, psicose" },
          { nome: "Brivaracetam",  acao: "antagonista", nota: "Maior afinidade SV2A que levetiracetam; menos EA psiquiátricos" },
        ],
        nivel: "avancado",
        nota: "Levetiracetam pode causar ou agravar irritabilidade, ansiedade e depressão em ~10–15% dos casos — efeito importante a monitorar em pacientes com histórico psiquiátrico.",
      },
    ],
  },
];

// Helpers
export function getSistema(id: string): SistemaReceptorial | undefined {
  return sistemas.find((s) => s.id === id);
}

export function getAlvo(sistemaId: string, alvoId: string): AlvoFarmacologico | undefined {
  return getSistema(sistemaId)?.alvos.find((a) => a.id === alvoId);
}

export const acaoLabel: Record<AcaoFarmaco, string> = {
  agonista:      "Agonista",
  antagonista:   "Antagonista",
  ag_parcial:    "Ag. Parcial",
  inibidor:      "Inibidor",
  modulador_pos: "Modulador +",
  modulador_neg: "Modulador −",
  substrato:     "Substrato",
};

export const acaoColor: Record<AcaoFarmaco, string> = {
  agonista:      "bg-green-500/10 text-green-700 border-green-500/20",
  antagonista:   "bg-red-500/10 text-red-700 border-red-500/20",
  ag_parcial:    "bg-blue-500/10 text-blue-700 border-blue-500/20",
  inibidor:      "bg-orange-500/10 text-orange-700 border-orange-500/20",
  modulador_pos: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  modulador_neg: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  substrato:     "bg-gray-500/10 text-gray-700 border-gray-500/20",
};
