export type TipoSecao = "texto" | "lista" | "tabela" | "cards" | "legal";

export interface ItemLista {
  nome: string;
  detalhe: string;
  tag?: string;
  alerta?: "info" | "atencao" | "perigo";
}

export interface SecaoModulo {
  id: string;
  titulo: string;
  tipo: TipoSecao;
  intro?: string;
  texto?: string;
  items?: ItemLista[];
  tabela?: {
    headers: string[];
    linhas: string[][];
    nota?: string;
  };
  pearls?: string[];
  referencia: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  subtitulo: string;
  cor: string;
  gradient: string;
  descricao: string;
  plano: "free" | "pro";
  secoes: SecaoModulo[];
}

export const modulos: Modulo[] = [

  // ─── 1. INFÂNCIA E ADOLESCÊNCIA ────────────────────────────────────────────
  {
    id: "infancia",
    titulo: "Infância e Adolescência",
    subtitulo: "Doses pediátricas · Marcos de desenvolvimento · CAPSi",
    cor: "violet",
    gradient: "from-violet-500 to-purple-500",
    descricao: "Referência clínica para psiquiatria da infância e adolescência com tabelas de dosagem pediátrica, marcos de desenvolvimento e critérios diagnósticos adaptados.",
    plano: "free",
    secoes: [
      {
        id: "doses-pediatricas",
        titulo: "Doses Pediátricas",
        tipo: "tabela",
        intro: "Doses baseadas em peso devem ser calculadas individualmente. Iniciar sempre pela dose mínima e titular a cada 1–2 semanas. Ajustar conforme resposta e tolerabilidade.",
        tabela: {
          headers: ["Medicamento", "Indicação", "Dose inicial", "Dose máxima", "Faixa etária", "Evidência"],
          linhas: [
            ["Metilfenidato IR", "TDAH", "0,3 mg/kg/dia (5 mg)", "60 mg/dia (ou 2 mg/kg)", "6–17 anos", "A"],
            ["Metilfenidato XR", "TDAH", "10 mg/dia pela manhã", "54 mg/dia", "6–17 anos", "A"],
            ["Lisdexanfetamina", "TDAH", "20 mg/dia pela manhã", "70 mg/dia", "6–17 anos", "A"],
            ["Atomoxetina", "TDAH (1ª linha sem comorbidade)", "0,5 mg/kg/dia", "1,8 mg/kg/dia (máx 100 mg)", "6–17 anos", "A"],
            ["Risperidona", "TEA – irritabilidade / agitação", "0,25 mg/dia", "3 mg/dia (<20 kg); 6 mg/dia (>20 kg)", "5–17 anos", "A"],
            ["Aripiprazol", "TEA – irritabilidade / bipolar", "2 mg/dia", "15 mg/dia", "6–17 anos", "A"],
            ["Fluoxetina", "TDM / TOC", "10 mg/dia", "60 mg/dia", "8–17 anos", "A"],
            ["Sertralina", "TDM / Ansiedade / TOC", "25 mg/dia", "200 mg/dia", "6–17 anos", "A"],
            ["Escitalopram", "TDM / TAG", "10 mg/dia", "20 mg/dia", "12–17 anos", "A"],
            ["Fluvoxamina", "TOC", "25 mg/dia", "200 mg/dia", "8–17 anos", "A"],
            ["Quetiapina", "Bipolar / psicose", "25 mg/noite", "600 mg/dia", "10–17 anos", "B"],
            ["Valproato", "Epilepsia / bipolar", "15 mg/kg/dia", "60 mg/kg/dia", ">2 anos", "B"],
            ["Clonidina", "TDAH / tiques / insônia", "0,05 mg/noite", "0,4 mg/dia", "6–17 anos", "B"],
            ["Bupropiona", "TDAH (3ª linha)", "37,5 mg/dia", "300 mg/dia", "≥12 anos", "C"],
            ["Melatonina", "Insônia / TEA / TDAH", "0,5–1 mg/noite", "5 mg/noite", "≥2 anos", "B"],
          ],
          nota: "IR = liberação imediata; XR = liberação estendida. Evidência: A = múltiplos ECRs; B = ECR único ou estudos observacionais; C = série de casos / experiência clínica.",
        },
        pearls: [
          "Em crianças <30 kg, ajustar antipsicóticos por peso — risperidona >3 mg/dia raramente necessária; hiperprolactinemia e ganho ponderal são efeitos adversos frequentes.",
          "Metilfenidato deve ser suspenso em feriados escolares? Depende: se há TDAH grave com impacto em todas as esferas, manter. Se impacto exclusivamente escolar, férias drug holiday são aceitáveis.",
          "ISRS em crianças: FDA exige black box warning sobre risco aumentado de ideação suicida — monitorar de perto nas primeiras 4 semanas, especialmente em <12 anos.",
        ],
        referencia: "Cordioli AV et al. Psicofármacos. 4ª ed. Artmed; 2011. / NICE. Attention deficit hyperactivity disorder: diagnosis and management. NG87. 2019. / FDA prescribing information.",
      },
      {
        id: "marcos-desenvolvimento",
        titulo: "Marcos de Desenvolvimento",
        tipo: "tabela",
        intro: "Marcos representam o que a maioria das crianças consegue fazer até determinada idade. Ausência de marcos não equivale a diagnóstico — necessita avaliação especializada.",
        tabela: {
          headers: ["Faixa Etária", "Motor", "Linguagem", "Cognitivo / Social", "Sinal de Alerta"],
          linhas: [
            ["0–3 meses", "Sustenta cabeça brevemente; reflexo de Moro", "Choro diferenciado; vocaliza 'aah'", "Fixa olhar; sorri responsivamente", "Sem sorriso social; hipotonia marcada; sem resposta ao som"],
            ["3–6 meses", "Rola; apanha objetos com as mãos", "Gorjeios; ri alto", "Reconhece rosto dos pais; reage a estranhos", "Sem vocalização; não alcança objetos; não sustenta cabeça"],
            ["6–12 meses", "Senta sem apoio; engatinha; levanta com apoio", "Balbucia; 'mamã/papá' inespecífico", "Imita gestos; ansiedade do estranho; estranhamento (8–10 meses)", "Sem balbucio; não responde ao nome; sem gestos apontar"],
            ["12–18 meses", "Anda solo; sobe escadas com apoio", "5–10 palavras; diz 'não'", "Aponta para pedir; jogo funcional simples", "Sem palavras; sem apontar; sem andar aos 18 meses"],
            ["18–24 meses", "Corre; chuta bola; empilha cubos", "50+ palavras; frases 2 palavras", "Jogo simbólico (faz de conta); imita adultos", "Sem frases de 2 palavras; perda de linguagem adquirida"],
            ["2–3 anos", "Pula com 2 pés; despe-se", "Frases de 3–4 palavras; pergunta 'por quê?'", "Jogo paralelo; noção de 'meu' e 'teu'", "Sem frases; não é compreendido por estranhos; sem jogo simbólico"],
            ["3–5 anos", "Pedala triciclo; desenha círculo/cruz", "Narrativa simples; 4–5 palavras por frase", "Jogo cooperativo; noção de regras", "Linguagem ininteligível; não brinca com outras crianças; ecolalia persistente"],
            ["5–7 anos", "Pula corda; escreve nome", "Lê palavras simples; frases complexas", "Leitura inicial; raciocínio lógico concreto", "Dificuldade persistente com letras; hiperatividade extrema; agressividade grave"],
            ["7–12 anos", "Esportes organizados; coordenação fina", "Linguagem abstrata; leitura fluente", "Operações lógicas; grupos de amigos", "Rendimento escolar muito abaixo; isolamento social; comportamento regredido"],
            ["12–18 anos", "Desenvolvimento puberal; coordenação adulta", "Pensamento abstrato e hipotético; debate", "Identidade; grupos de pares; separação dos pais", "Isolamento social extremo; ideação suicida; uso de substâncias; psicose"],
          ],
          nota: "Regressão de marcos já adquiridos é sempre sinal de alerta — investigar TEA, trauma, doença neurológica ou psiquiátrica.",
        },
        pearls: [
          "A ausência de apontar proto-declarativo (mostrar algo para compartilhar interesse) até 12 meses é um dos sinais precoces mais sensíveis para TEA — mais específico que apontar proto-imperativo (pedir).",
          "M-CHAT-R/F é o instrumento de triagem recomendado para TEA entre 16–30 meses em consultas de rotina de pediatria — sensibilidade >85% para TEA clássico.",
        ],
        referencia: "Sociedade Brasileira de Pediatria. Guias de Vigilância do Desenvolvimento. 2022. / CDC Developmental Milestones. 2022. / Zeanah CH. Handbook of Infant Mental Health. 4ª ed.",
      },
      {
        id: "diagnosticos-infancia",
        titulo: "Diagnósticos Principais",
        tipo: "cards",
        intro: "Critérios e características clínicas dos principais transtornos psiquiátricos em crianças e adolescentes — DSM-5-TR.",
        items: [
          {
            nome: "TDAH",
            tag: "neurodesenvolvimento",
            detalhe: "≥6 sintomas de desatenção e/ou hiperatividade-impulsividade (≥5 em adolescentes); início <12 anos; presente em ≥2 contextos; prejuízo funcional. 3 apresentações: predominantemente desatenta, hiperative-impulsiva ou combinada. Comorbidade com TEA (~70%), ansiedade (~50%) e dificuldades de aprendizagem (30%).",
          },
          {
            nome: "TEA",
            tag: "neurodesenvolvimento",
            detalhe: "Déficits persistentes na comunicação social (3 critérios obrigatórios) + padrões restritos/repetitivos de comportamento (≥2 de 4). Sintomas no período desenvolvimental precoce. Gravidade por nível de suporte (1, 2, 3). Comorbidade com TDAH (40–70%), ansiedade (40%), epilepsia (30%), DI (31%).",
            alerta: "atencao",
          },
          {
            nome: "Depressão Infanto-Juvenil",
            tag: "humor",
            detalhe: "Mesmos critérios do adulto, mas humor pode ser irritável (e não triste). Apresentação atípica frequente: queixas somáticas, recusa escolar, agressividade. PHQ-A é instrumento de triagem recomendado para adolescentes. Risco de suicídio sempre avaliar — 2ª causa de morte em 10–24 anos no Brasil.",
            alerta: "perigo",
          },
          {
            nome: "Ansiedade de Separação",
            tag: "ansiedade",
            detalhe: "Medo/ansiedade excessivos acerca de separação das figuras de apego; ao menos 3 dos 8 critérios DSM-5-TR; dura ≥4 semanas em crianças; causa prejuízo funcional (recusa escolar, insônia). Mais prevalente em 7–11 anos. TCC é tratamento de 1ª linha; ISRS se necessário.",
          },
          {
            nome: "TOC em Crianças",
            tag: "ansiedade",
            detalhe: "Obsessões e compulsões como no adulto; em crianças pequenas compulsões sem insight são comuns (não reconhecem o comportamento como excessivo). Y-BOCS-CY para avaliação. TCC com EPR é gold standard; fluoxetina ou fluvoxamina se TCC insuficiente. Comorbidade com tiques em 20–30%.",
          },
          {
            nome: "Tiques e Síndrome de Tourette",
            tag: "neurodesenvolvimento",
            detalhe: "Tourette: tiques motores múltiplos + ao menos 1 tique vocal; duração >1 ano; início <18 anos. Comorbidade com TDAH (60%) e TOC (30%). Primeira intervenção: psicoeducação familiar. Tratamento farmacológico: haloperidol, pimozida, risperidona, aripiprazol, clonidina. Tiques simples transitórios não necessitam tratamento.",
          },
        ],
        pearls: [
          "TDAH e TEA têm alta comorbidade (~50%) — não há exclusão mútua no DSM-5-TR. Tratar TDAH melhora também sintomas de TEA em muitos casos.",
          "Depressão antes da puberdade é mais comum em meninos; após puberdade, 2–3x mais comum em meninas. A virada de prevalência ocorre por volta dos 13–14 anos.",
        ],
        referencia: "APA. DSM-5-TR. Washington DC; 2022. / NICE. CG158: Autism spectrum disorder in under 19s. / AACAP. Practice Parameters. 2020.",
      },
      {
        id: "capsi",
        titulo: "CAPSi e Internação de Menores",
        tipo: "lista",
        intro: "Especificidades da Rede de Atenção Psicossocial para crianças e adolescentes (0–17 anos) no Brasil.",
        items: [
          {
            nome: "CAPSi I",
            tag: "RAPS",
            detalhe: "Municípios com 70.000–150.000 habitantes. Atendimento de segunda a sexta, mínimo 8h/dia. Equipe mínima: médico com formação em saúde mental, enfermeiro, psicólogo, assistente social e técnicos de saúde mental. Capacidade para 30 atendimentos/dia.",
          },
          {
            nome: "CAPSi II",
            tag: "RAPS",
            detalhe: "Municípios com >150.000 habitantes. Atendimento de segunda a sexta, mínimo 8h/dia. Equipe ampliada com fonoaudiólogo, terapeuta ocupacional e pedagogo. Capacidade para 45 atendimentos/dia.",
          },
          {
            nome: "CAPSi AD",
            tag: "RAPS",
            detalhe: "Especializado em álcool e outras drogas para crianças e adolescentes. Funciona 24h (modalidade III) com 8 leitos de acolhimento. Diferencia-se do CAPSi por foco em substâncias e por possibilitar acolhimento noturno voluntário.",
          },
          {
            nome: "Critérios de encaminhamento ao CAPSi",
            tag: "fluxo",
            detalhe: "Transtornos mentais graves e persistentes (psicose, bipolar, TEA grave, TDM recorrente); uso abusivo de substâncias; múltiplas reinternações; necessidade de tratamento intensivo ambulatorial. Casos leves-moderados permanecem no ambulatório de saúde mental ou UBS.",
          },
          {
            nome: "Internação psiquiátrica de menor",
            tag: "legal",
            alerta: "atencao",
            detalhe: "Regida pela Lei 10.216/2001 + ECA (Lei 8.069/1990). Internação voluntária: requer consentimento do responsável legal + assentimento do menor com capacidade de discernimento. Involuntária: indicada por médico quando há risco a si ou a terceiros; notificar MP em 72h. Compulsória: determinada pelo juiz da infância e juventude. Unidades devem ser exclusivas para crianças/adolescentes.",
          },
          {
            nome: "Hospital Dia (HD) para adolescentes",
            tag: "fluxo",
            detalhe: "Alternativa à internação integral. Atendimento 5 dias/semana, 4–8h/dia. Indicado quando ambulatório é insuficiente mas internação integral não é necessária. Mantém vínculo escolar e familiar. Mais eficaz que internação para transtornos de humor e alimentares em adolescentes.",
          },
        ],
        pearls: [
          "Psiquiatra infantil deve ser acionado quando: ideação suicida com plano, primeira quebra psicótica, TEA grave com auto e heteroagressão, anorexia nervosa com IMC <15 ou recusa alimentar total.",
          "Crianças menores de 6 anos raramente precisam de psicofármacos — intervenções comportamentais e psicoeducação familiar devem ser a primeira linha em quase todos os casos.",
        ],
        referencia: "Portaria GM/MS nº 3.088/2011. RAPS. / Lei 10.216/2001. / ECA Lei 8.069/1990. / CFM. Resolução 2.057/2013.",
      },
    ],
  },

  // ─── 2. PSIQUIATRIA FORENSE ────────────────────────────────────────────────
  {
    id: "forense",
    titulo: "Psiquiatria Forense",
    subtitulo: "Lei 10.216 · Imputabilidade · Laudos periciais",
    cor: "slate",
    gradient: "from-slate-600 to-gray-700",
    descricao: "Fundamentos de psiquiatria forense: reforma psiquiátrica brasileira, critérios de imputabilidade, medidas de segurança e estrutura do laudo pericial.",
    plano: "pro",
    secoes: [
      {
        id: "lei-10216",
        titulo: "Lei 10.216 — Reforma Psiquiátrica",
        tipo: "legal",
        texto: "A Lei 10.216/2001 (Lei Paulo Delgado) é o marco regulatório da saúde mental no Brasil. Dispõe sobre a proteção e os direitos das pessoas portadoras de transtornos mentais e redireciona o modelo assistencial em saúde mental — do hospital psiquiátrico para a rede comunitária (RAPS). É o fundamento legal de toda internação psiquiátrica no Brasil.",
        items: [
          {
            nome: "Art. 2 — Direitos do paciente com transtorno mental",
            tag: "direitos",
            detalhe: "Direito a: ter acesso ao melhor tratamento disponível; ser tratado com humanidade e respeito; ser protegido contra abuso e exploração; ter garantia de sigilo nas informações; ter direito à presença médica em qualquer tempo; receber mais de uma opção de tratamento; ser tratado preferencialmente em serviços comunitários; livre acesso a meios de comunicação; receber medicação gratuita na internação; ser informado sobre seu diagnóstico e tratamento.",
          },
          {
            nome: "Art. 6 — Tipos de internação psiquiátrica",
            tag: "internação",
            detalhe: "Art. 6 define três tipos: I — Voluntária: paciente solicita e consente por escrito; II — Involuntária: a pedido de terceiro ou do médico, sem consentimento do paciente; III — Compulsória: determinada pela Justiça. Parágrafo único: todo paciente internado tem alta garantida quando médico determinar, salvo determinação judicial.",
          },
          {
            nome: "Art. 7 — Deveres na internação voluntária",
            tag: "internação",
            detalhe: "O paciente internado voluntariamente deve ser comunicado dos seus direitos. Tem direito a solicitar alta a qualquer momento (a ser notificada ao responsável técnico). O médico avalia a alta em até 72h; se contraindicada clinicamente, a internação converte-se em involuntária com notificação ao MP.",
          },
          {
            nome: "Art. 8 — Internação involuntária — deveres",
            tag: "internação",
            alerta: "atencao",
            detalhe: "A internação involuntária deve ser comunicada ao Ministério Público estadual pelo responsável técnico em até 72 horas. A alta involuntária pode ser solicitada pelo familiar/responsável ou pelo médico. Proibida a internação por razões de ordem moral, econômica, social, racial ou de existência de conflito afetivo.",
          },
          {
            nome: "Art. 9 — Internação compulsória",
            tag: "internação",
            detalhe: "Determinada pela Justiça mediante laudo médico circunstanciado que caracterize os seus motivos. Deve ser realizada em estabelecimento adequado. O laudo deve ser feito por perito judicial, mas emergências exigem laudo do médico assistente. Revisão periódica obrigatória.",
          },
          {
            nome: "Art. 10 — Comunicação ao MP",
            tag: "legal",
            alerta: "perigo",
            detalhe: "O responsável técnico da unidade de internação deve enviar comunicação escrita ao Ministério Público estadual em até 72 horas após qualquer internação involuntária. O não cumprimento sujeita o responsável a sanções administrativas e jurídicas. Modalidade e prazo são frequentemente cobrados em provas de residência e TEP.",
          },
          {
            nome: "Art. 12 — Proibição de construção/expansão de hospitais psiquiátricos",
            tag: "política",
            detalhe: "Determina que o Executivo Federal deve criar e manter programa permanente de desinstitucionalização. Proíbe a construção de novos hospitais psiquiátricos públicos ou o contrato de novos leitos em hospitais privados. Orienta recursos para a rede comunitária (CAPS, RT, UA, CR).",
          },
        ],
        pearls: [
          "A Lei 10.216 não proíbe internação psiquiátrica — proíbe internação involuntária sem critério clínico e sem notificação ao MP em 72h. Hospitais psiquiátricos existentes continuam funcionando, apenas não podem expandir.",
          "Questão TEP clássica: médico que realiza internação involuntária deve notificar o MP em 72h — não o juiz, não o conselho de medicina, não a família. É o MP.",
        ],
        referencia: "Lei nº 10.216, de 6 de abril de 2001. / CFM. Resolução CFM nº 2.057/2013. / Taborda JGV, Chalub M, Abdalla-Filho E. Psiquiatria Forense. 3ª ed. Artmed; 2016.",
      },
      {
        id: "imputabilidade",
        titulo: "Imputabilidade e Capacidade Civil",
        tipo: "lista",
        intro: "Conceitos jurídico-psiquiátricos fundamentais. O Brasil adota o critério biopsicológico: é necessário diagnóstico psiquiátrico (bio) E incapacidade de entender/autodeterminar-se (psicológico).",
        items: [
          {
            nome: "Inimputável — Art. 26, caput, CP",
            tag: "penal",
            detalhe: "Isento de pena quem, por doença mental ou desenvolvimento mental incompleto ou retardado, era, ao tempo da ação ou omissão, inteiramente incapaz de entender o caráter ilícito do fato ou de determinar-se de acordo com esse entendimento. Consequência: medida de segurança (não pena). Diagnósticos frequentes: esquizofrenia grave, DI profunda, psicose dissociativa.",
          },
          {
            nome: "Semi-imputável — Art. 26, parágrafo único, CP",
            tag: "penal",
            detalhe: "Perturbação da saúde mental (não doença mental plena) que reduz — mas não elimina — a capacidade de entendimento ou autodeterminação ao tempo do fato. Consequência: pena reduzida de 1/3 a 2/3 (sistema vicariante) ou substituição por medida de segurança. Diagnósticos frequentes: TPB, transtornos da personalidade, TUS grave.",
          },
          {
            nome: "Imputável — Regra geral",
            tag: "penal",
            detalhe: "Indivíduo com capacidade plena de entendimento e autodeterminação ao tempo do fato. Mesmo portadores de transtorno mental podem ser imputáveis se o transtorno não interferiu na conduta criminosa. A responsabilidade penal é a regra — inimputabilidade deve ser provada por perícia.",
          },
          {
            nome: "Critério biopsicológico — Aplicação prática",
            tag: "metodologia",
            alerta: "info",
            detalhe: "O perito deve responder a dois elementos: 1) Existia doença ou perturbação mental ao tempo do fato? (critério biológico) 2) A doença/perturbação suprimia ou reduzia a capacidade de entendimento ou autodeterminação? (critério psicológico). Ambos devem estar presentes para inimputabilidade. Diagnóstico isolado não basta.",
          },
          {
            nome: "Medida de segurança",
            tag: "penal",
            detalhe: "Aplicada ao inimputável ou semi-imputável (no lugar de, ou reduzindo a pena). Modalidades: internação em hospital de custódia e tratamento psiquiátrico (HCTP) ou tratamento ambulatorial. Prazo mínimo de 1 a 3 anos (conforme a pena do crime correspondente); prazo máximo — STF 2020: não pode ultrapassar o máximo da pena abstrata prevista para o crime.",
          },
          {
            nome: "Capacidade civil — CC art. 3 e 4",
            tag: "civil",
            detalhe: "Absolutamente incapazes: menores de 16 anos (art. 3). Relativamente incapazes (art. 4): ébrios habituais, viciados em tóxicos, pessoas que não possam exprimir vontade (transtorno mental grave). Curatela (CC art. 1767): juiz decreta incapacidade relativa após avaliação pericial. Após Estatuto da Pessoa com Deficiência (Lei 13.146/2015): presunção de capacidade — curatela deve ser exceção e a mais restrita possível.",
          },
        ],
        pearls: [
          "O perito responde à pergunta sobre capacidade ao tempo do fato — não sobre o estado atual. Um paciente estabilizado no momento da perícia pode ter sido inimputável ao tempo do crime.",
          "Psicopatia (Transtorno de Personalidade Antissocial) per se NÃO configura inimputabilidade — a maioria dos psicopatas é plenamente capaz de entender o caráter ilícito do ato.",
          "STF — HC 84.219 (2020): estabeleceu que a medida de segurança não pode ter prazo indeterminado; limite = máximo da pena abstrata prevista para o crime análogo.",
        ],
        referencia: "Código Penal Brasileiro, arts. 26–28. / CC 2002, arts. 3–4. / Taborda JGV. Psiquiatria Forense. 3ª ed. Artmed; 2016. / STF HC 84.219/SP.",
      },
      {
        id: "internacao-tipos",
        titulo: "Internação Psiquiátrica — Tipos e Fluxo",
        tipo: "lista",
        intro: "Modalidades de internação psiquiátrica segundo a Lei 10.216/2001 e responsabilidades do médico em cada cenário.",
        items: [
          {
            nome: "Internação Voluntária",
            tag: "lei 10.216 art.6 I",
            detalhe: "Paciente solicita e assina Termo de Consentimento por escrito. Paciente pode solicitar alta a qualquer momento — médico tem até 72h para avaliar; se alta é contraindicada, converte para involuntária com notificação ao MP. Adequada quando paciente tem insight preservado e aceita tratamento.",
          },
          {
            nome: "Internação Involuntária",
            tag: "lei 10.216 art.6 II",
            alerta: "atencao",
            detalhe: "A pedido de familiar/responsável OU por indicação médica, sem consentimento do paciente. Critérios clínicos: risco a si, risco a terceiros, incapacidade de autocuidado grave. Obrigações: notificar o MP estadual em até 72h por escrito; documentar critérios; revisar periodicamente. Alta é competência médica.",
          },
          {
            nome: "Internação Compulsória",
            tag: "lei 10.216 art.6 III",
            alerta: "perigo",
            detalhe: "Determinada pelo Poder Judiciário. Exige laudo médico circunstanciado. Frequente em dependência química severa (após polêmica da Cracolândia/SP). Médico que presta laudo pericial para internação compulsória tem responsabilidade ética — deve basear-se em critérios clínicos, nunca sociais ou morais.",
          },
          {
            nome: "Critérios clínicos para internação",
            tag: "clínico",
            detalhe: "Risco imediato de auto ou heteroagressão; incapacidade grave de autocuidado (alimentação, higiene, segurança); tentativa de suicídio recente com risco de repetição; psicose aguda com perda de contato com a realidade; síndrome de abstinência grave com riscos orgânicos; refratariedade ao tratamento ambulatorial após múltiplos esquemas adequados.",
          },
          {
            nome: "Comunicação ao Ministério Público — Prazo e forma",
            tag: "legal",
            alerta: "perigo",
            detalhe: "Obrigatória em qualquer internação involuntária. Prazo: 72 horas após a internação. Forma: escrita, pelo responsável técnico da unidade. Conteúdo mínimo: identificação do paciente, diagnóstico, motivo da internação, nome do médico responsável. Omissão configura infração ético-administrativa.",
          },
          {
            nome: "Alta hospitalar psiquiátrica — Critérios e responsabilidade",
            tag: "clínico",
            detalhe: "Competência exclusiva do médico assistente (não da família, não do juiz, salvo HC). Alta deve ser planejada com CAPS de referência antes da saída. Carta de alta com: diagnóstico, medicação, plano de seguimento, próxima consulta. Altas sem vinculação com serviço ambulatorial associam-se a reinternação em <30 dias em 35% dos casos.",
          },
        ],
        pearls: [
          "Internação involuntária é indicação médica — não é punição, não pode ser solicitada por razões sociais, econômicas ou morais. Art. 4 da Lei 10.216 é explícito nisso.",
          "O médico que determina a internação involuntária tem obrigação legal de notificar o MP — não o hospital, não a família, não o coordenador. É responsabilidade pessoal do médico.",
        ],
        referencia: "Lei nº 10.216/2001. / CFM. Resolução CFM nº 2.057/2013. / CFM. Manual de Ética Médica. 2019.",
      },
      {
        id: "laudo-pericial",
        titulo: "Laudo Pericial Psiquiátrico",
        tipo: "texto",
        texto: "O laudo pericial psiquiátrico é documento técnico-científico elaborado por médico perito designado pelo juiz (ou pelas partes na perícia particular). Deve ser fundamentado, imparcial e responder objetivamente aos quesitos formulados.",
        items: [
          {
            nome: "1. Preâmbulo e qualificação do periciado",
            detalhe: "Nome completo, data de nascimento, naturalidade, estado civil, profissão, grau de instrução, endereço. Data, horário e local do exame pericial. Documentos e prontuários analisados.",
          },
          {
            nome: "2. Histórico",
            detalhe: "Anamnese completa: queixa principal, história da doença atual (início, evolução, episódios anteriores), antecedentes pessoais (doenças, internações, tratamentos), antecedentes familiares, histórico social e profissional, uso de substâncias. Relato do fato delituoso quando relevante — datas, circunstâncias, comportamento na época.",
          },
          {
            nome: "3. Exame do Estado Mental",
            detalhe: "Descrição sistematizada: nível de consciência, orientação, atenção, memória, senso-percepção (alucinações, ilusões), pensamento (forma e conteúdo), juízo e crítica, inteligência, afetividade, psicomotricidade, linguagem, insight, sono, apetite. Comportamento durante o exame.",
          },
          {
            nome: "4. Diagnóstico",
            detalhe: "Diagnóstico psiquiátrico com código CID-11 (ou DSM-5-TR em perícias cíveis). Fundamentação da hipótese diagnóstica com base nos achados clínicos e documentação revisada. Quando relevante, comentar sobre cronicidade, gravidade e evolução.",
          },
          {
            nome: "5. Discussão e Conclusão",
            detalhe: "Análise da relação entre o diagnóstico e a capacidade de entendimento/autodeterminação ao tempo do fato (penal) ou de exprimir vontade (cível). Resposta objetiva a cada quesito formulado. Linguagem clara, acessível ao juiz não especialista.",
          },
          {
            nome: "Quesito padrão — Juízo Criminal",
            tag: "modelo",
            alerta: "info",
            detalhe: "Quesito clássico: '1. O periciado é portador de doença mental, desenvolvimento mental incompleto ou retardado? 2. Em caso afirmativo, ao tempo da ação ou da omissão, era inteiramente incapaz de entender o caráter ilícito do fato ou de determinar-se de acordo com esse entendimento?' Respostas devem ser sim/não seguidas de fundamentação.",
          },
        ],
        pearls: [
          "O perito é auxiliar do juízo — não é advogado da acusação nem da defesa. Imparcialidade é requisito ético. Quesitos da defesa merecem a mesma atenção que os da acusação.",
          "Simulação e dissimulação devem ser consideradas: aplicar testes de validade de sintomas (TOMM, SVT) quando há suspeita de exagero de sintomas por ganho secundário.",
        ],
        referencia: "CFM. Manual de Perícias Médicas. / Taborda JGV, Chalub M, Abdalla-Filho E. Psiquiatria Forense. 3ª ed. Artmed; 2016. / CPP arts. 149–180.",
      },
    ],
  },

  // ─── 3. PSICOGERIATRIA ────────────────────────────────────────────────────
  {
    id: "psicogeriatria",
    titulo: "Psicogeriatria",
    subtitulo: "Critérios de Beers · Demências · Desprescrição",
    cor: "amber",
    gradient: "from-amber-500 to-orange-500",
    descricao: "Psicofarmacologia do idoso: medicamentos potencialmente inapropriados, diagnóstico diferencial das demências e princípios de desprescrição.",
    plano: "free",
    secoes: [
      {
        id: "criterios-beers",
        titulo: "Critérios de Beers 2023",
        tipo: "tabela",
        intro: "Medicamentos Potencialmente Inapropriados (MPI) para idosos ≥65 anos — American Geriatrics Society (AGS) 2023. Evitar na maioria dos idosos salvo alternativas indisponíveis e após avaliação de risco-benefício.",
        tabela: {
          headers: ["Medicamento / Classe", "Motivo do risco no idoso", "Alternativa preferível"],
          linhas: [
            ["Benzodiazepínicos (todos)", "Risco de sedação, queda, fratura, dependência, piora cognitiva — idosos metabolizam mais lentamente", "TCC-I para insônia; buspirona/ISRS para ansiedade"],
            ["Zolpidem e análogos (Z-drugs)", "Mesmos riscos dos BZD + eventos adversos complexos do sono (sonambulismo, acidentes)", "Melatonina de liberação prolongada; higiene do sono"],
            ["Difenidramina (antihistamínico)", "Efeito anticolinérgico potente — confusão, retenção urinária, constipação, delirium", "Loratadina ou fexofenadina para alergia"],
            ["Amitriptilina e ATC em geral", "Alta carga anticolinérgica, hipotensão ortostática, arritmias, efeitos cognitivos", "ISRS ou IRSN para depressão e dor"],
            ["Antipsicóticos típicos (haloperidol, clorpromazina)", "Risco de DPOC cognitivo, efeitos extrapiramidais graves, AVC em demência (+50% mortalidade)", "Antipsicóticos atípicos em dose mínima se essencial"],
            ["Antipsicóticos em demência (qualquer)", "Aumentam mortalidade e risco de AVC — FDA black box warning. Usar apenas para agressividade grave refratária", "Intervenções não farmacológicas; mirtazapina para agitação leve"],
            ["Metoclopramida", "Bloqueador dopaminérgico central — risco de discinesia tardia mesmo em uso breve; pior em idosos", "Domperidona (risco cardíaco menor); ondansetrona"],
            ["AINEs (ibuprofeno, diclofenaco oral)", "Risco de sangramento GI, insuficiência renal, retenção hídrica, hipertensão — risco cardiovascular em doença prévia", "Paracetamol; capsaicina tópica; fisioterapia"],
            ["Glibenclamida (sulfonilureia 1ª geração)", "Hipoglicemia prolongada e grave — meia-vida longa e metabólito ativo. Alta morbimortalidade em idosos", "Metformina; gliclazida; DPP-4i; SGLT2i"],
            ["Digoxina >0,125 mg/dia", "Janela terapêutica estreita, redução do clearance renal com idade — toxicidade mesmo em dose 'terapêutica'", "Dosar nível sérico; reduzir dose; preferir bisoprolol para FA"],
            ["Clonidina", "Hipotensão ortostática grave, bradicardia, sedação, efeito rebote na retirada", "Anlodipina; losartana para HAS"],
            ["Relaxantes musculares (ciclobenzaprina)", "Efeito anticolinérgico, sedação, fraqueza — idosos mais vulneráveis ao risco de quedas", "Fisioterapia; paracetamol + calor local"],
            ["Nitrofurantoína (uso longo prazo)", "Toxicidade pulmonar e hepática em uso crônico; ineficaz quando TFG <30 ml/min", "Fosfomicina; cefalexina para ITU não complicada"],
            ["Meperidina (petidina)", "Metabólito neurotóxico (normeperidina) acumula — delirium, convulsões; não usar para analgesia no idoso", "Morfina ou tramadol (com cautela); fentanil para dor oncológica"],
            ["Anticongestionantes orais (pseudoefedrina)", "Hipertensão, arritmia, insônia, agitação; contraindicados em HAS, cardiopatia, glaucoma de ângulo fechado", "Lavagem nasal salina; budesonida nasal"],
          ],
          nota: "Esta lista é um guia, não contraindicação absoluta. O risco deve sempre ser balanceado com o benefício individual e as alternativas disponíveis. Critérios de Beers não se aplicam a cuidados paliativos.",
        },
        pearls: [
          "Carga anticolinérgica acumulada é dose-dependente — avaliar todos os medicamentos do paciente, não apenas os individualmente identificados nos Critérios de Beers (ARS – Anticholinergic Risk Scale).",
          "Polifarmácia (≥5 medicamentos) afeta >40% dos idosos brasileiros. A cada medicamento adicionado acima de 5, o risco de interação clinicamente significativa aumenta 100%.",
        ],
        referencia: "American Geriatrics Society. 2023 AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults. J Am Geriatr Soc. 2023;71(7):2052-2081.",
      },
      {
        id: "demencias",
        titulo: "Diagnóstico Diferencial das Demências",
        tipo: "tabela",
        intro: "Características diferenciadoras dos principais tipos de demência neurodegenerativa e vascular. Biomarcadores e neuroimagem guiam o diagnóstico definitivo.",
        tabela: {
          headers: ["Demência", "Início / Idade", "Sintoma cardinal precoce", "Neuroimagem", "Biomarcador / Histologia", "Tratamento"],
          linhas: [
            ["Doença de Alzheimer (DA)", "Insidioso; >65a (forma tardia)", "Amnésia episódica anterógrada — perde eventos recentes, preserva remotos", "Atrofia hipocampal e parietal; PET amiloide +", "Placas de beta-amiloide + emaranhados tau (LCR: ↓Aβ42, ↑tau)", "IChE (donepezila, rivastigmina, galantamina); memantina na fase moderada-grave"],
            ["Demência com Corpos de Lewy (DCL)", "Insidioso; 65–75a", "Alucinações visuais vívidas + flutuação cognitiva + parkinsonismo (tríade)", "SPECT DAT scan ↓; hipometabolismo parieto-occipital no PET", "Corpos de Lewy (alfa-sinucleína) corticais; biomarcadores em LCR e pele", "Rivastigmina (IChE); EVITAR antipsicóticos típicos — risco de morte"],
            ["Demência Frontotemporal (DFT)", "Insidioso; 55–65a (pré-senil)", "Desinibição / mudança de personalidade / apático OU afasia progressiva", "Atrofia frontal e temporal anterior; hipometabolismo PET frontotemporal", "TDP-43, FUS, tau (3R ou 4R) — sem marcador único em LCR", "Sem aprovados. ISRS para sintomas comportamentais; memantina sem evidência"],
            ["Demência Vascular (DV)", "Abrupto ou escalonado pós-AVC", "Déficit executivo; marcha apraxica; incontinência urinária precoce", "Leucaraiose; infartos lacunares; infartos estratégicos no flair/T2 de RM", "Sem biomarcador específico — diagnóstico clínico-radiológico", "Controle de fatores de risco vascular (HAS, DM, fibrilação atrial)"],
            ["Demência na Parkinson (DP-D)", "Após ≥1 ano de DP; >70a", "Déficit visuoespacial e executivo; alucinações (tardias em DP)", "Atrofia difusa; sem padrão específico — SPECT DAT normal (é DP)", "Alfa-sinucleína no SNC e periferia (pele, reto)", "Rivastigmina (IChE) — aprovado para DP-D; cuidado com quetiapina para alucinações"],
            ["Hidrocefalia de Pressão Normal (HPN)", "Crônico; >60a", "Tríade de Hakim: distúrbio da marcha (magnético) + demência subcortical + incontinência urinária", "Ventrículos dilatados desproporcional ao córtex; índice de Evans >0,3", "Sem biomarcador — tap test (melhora >15% na marcha após PL de 30mL)", "Derivação ventriculoperitoneal (DVP) — curável se diagnóstico precoce"],
            ["Encefalopatia de Wernicke / Korsakoff", "Agudo (Wernicke) / crônico (Korsakoff)", "Tríade de Wernicke: confusão + oftalmoplegia + ataxia. Korsakoff: amnésia anterógrada + confabulação", "RM: sinal hiperintenso em corpos mamilares e tálamo medial (T2/FLAIR)", "↓Tiamina sérica / eritrocitária — deficiência por alcoolismo, má absorção, hiperemese", "Tiamina IV emergencial: 500mg 3x/dia por 3–5 dias antes de qualquer glicose"],
            ["Doença de Creutzfeldt-Jakob (DCJ)", "Rápido; 50–70a", "Demência rapidamente progressiva + mioclonias + ataxia — óbito em meses", "Sinal 'cortical ribboning' na RM DWI; EEG com complexos periódicos", "Proteína 14-3-3 no LCR; RT-QuIC (alta sensibilidade)", "Sem tratamento — notificação compulsória (doença de declaração obrigatória)"],
          ],
          nota: "DCL: hipersensibilidade a antipsicóticos típicos pode causar síndrome neuroléptica maligna grave e óbito — contraindicação absoluta em DCL confirmada.",
        },
        pearls: [
          "DCL: a tríade (alucinações visuais vívidas + flutuação cognitiva + parkinsonismo) já é suficiente para diagnóstico provável — SPECT DAT ajuda mas não é obrigatório.",
          "DFT antes dos 65 anos em paciente com comportamento desinibido, euforia ou perseveração: pensar em FTD, NÃO em Alzheimer — o perfil de memória na DFT é relativamente preservado no início.",
          "Wernicke é emergência: tiamina ANTES da glicose — glicose sem tiamina em carente pode precipitar ou piorar a encefalopatia de Wernicke.",
        ],
        referencia: "APA. DSM-5-TR. 2022. / Knopman DS et al. Dementia. Lancet. 2021;397(10291):1819-1831. / McKhann GM et al. Alzheimer Dement. 2011. / McKeith IG et al. Neurology. 2017.",
      },
      {
        id: "deprescricao",
        titulo: "Desprescrição e STOPP/START",
        tipo: "lista",
        intro: "Desprescrição é o processo supervisionado de redução ou interrupção de medicamentos cujo potencial de dano supera o benefício, com objetivo de melhorar qualidade de vida e reduzir polifarmácia.",
        items: [
          {
            nome: "Princípios da desprescrição",
            tag: "abordagem",
            detalhe: "1) Revisar toda a medicação periodicamente (mínimo anual); 2) Identificar medicamentos sem indicação atual, preventivos com benefício improvável na expectativa de vida restante, ou com dano > benefício; 3) Priorizar a suspensão dos mais nocivos; 4) Reduzir gradualmente quando há risco de abstinência ou efeito rebote; 5) Monitorar após cada mudança.",
          },
          {
            nome: "STOPP — Critérios para PARAR",
            tag: "ferramenta",
            alerta: "atencao",
            detalhe: "STOPP v3 (2023): Screening Tool of Older Persons' Potentially inappropriate Prescriptions. Exemplos práticos: AAS sem cardiopatia isquêmica documentada em >70a; estatinas para prevenção primária em >85a com expectativa de vida <5 anos; IBP em dose plena por >8 semanas sem indicação; BZD em qualquer idoso; metformina se TFG <30; digoxina >0,125mg sem monitoramento de nível.",
          },
          {
            nome: "START — Critérios para INICIAR",
            tag: "ferramenta",
            detalhe: "START v3 (2023): Screening Tool to Alert to Right Treatment. Medicamentos frequentemente omitidos em idosos elegíveis: estatina em DCV documentada sem contraindicação; IECA ou BRA em IC sistólica; bisfosfonato em osteoporose com fratura prévia; vitamina D + cálcio em osteoporose; vacina pneumocócica ≥65a; ISRS em depressão maior.",
          },
          {
            nome: "Cascata de prescrição",
            tag: "conceito",
            alerta: "info",
            detalhe: "Fenômeno em que efeito adverso de um medicamento é interpretado como nova doença, levando à prescrição de outro medicamento para tratar o efeito adverso. Exemplo clássico: metoclopramida → parkinsonismo → levodopa prescrita (erro diagnóstico). Outro: IECA → tosse → prescrito codeína → constipação → laxativo.",
          },
          {
            nome: "Medicamentos com retirada gradual obrigatória",
            tag: "cuidado",
            alerta: "perigo",
            detalhe: "BZD e análogos: reduzir 25% a cada 2 semanas — síndrome de abstinência grave. Antidepressivos: reduzir 25%/semana — síndrome de descontinuação (ISRS, IRSN). Antipsicóticos: reduzir 10-25%/mês — risco de psicose de rebound. Clonidina: reduzir gradualmente — hipertensão rebote grave. Corticosteroides crônicos: reduzir lentamente — insuficiência adrenal.",
          },
          {
            nome: "Ferramenta de desprescrição — Algoritmo de Scott",
            tag: "metodologia",
            detalhe: "5 passos: 1) Liste todos os medicamentos (incluindo fitoterapia e automedicação); 2) Considere se cada um tem indicação atual; 3) Estime expectativa de vida e horizonte de benefício de cada medicamento; 4) Priorize os mais prejudiciais; 5) Reduza ou suspenda um medicamento por vez e monitore. Envolva o paciente e família na decisão.",
          },
        ],
        pearls: [
          "A revisão da medicação deve incluir todos os prescritores — fragmentação do cuidado é a principal causa de polifarmácia. Um único médico deve consolidar e revisar toda a lista.",
          "Estatinas para prevenção primária em pacientes >85 anos raramente têm benefício demonstrado em horizonte de vida restante — candidatos ideais para desprescrição.",
        ],
        referencia: "O'Mahony D et al. STOPP/START criteria version 3. Eur Geriatr Med. 2023. / Scott IA et al. JAMA Intern Med. 2015;175(5):827-834. / Reeve E et al. Int J Clin Pharm. 2014.",
      },
      {
        id: "delirium-geriatria",
        titulo: "Delirium no Idoso",
        tipo: "lista",
        intro: "Delirium é síndrome neuropsiquiátrica aguda caracterizada por alteração aguda da consciência com flutuação, desatenção e distúrbio cognitivo. No idoso, é emergência médica frequentemente subdiagnosticada.",
        items: [
          {
            nome: "Critérios diagnósticos — CAM (Confusion Assessment Method)",
            tag: "diagnóstico",
            detalhe: "Diagnóstico requer: 1) Início agudo e flutuação do quadro; 2) Desatenção (obrigatório); 3) Pensamento desorganizado OU 4) Alteração do nível de consciência. Critérios 1+2+3 ou 1+2+4 = delirium. CAM tem sensibilidade 94% e especificidade 89% por profissional treinado. CAM-ICU adapta para pacientes ventilados.",
          },
          {
            nome: "Apresentações clínicas",
            tag: "clínico",
            detalhe: "Hiperativo (agitação, alucinações): 25% — mais reconhecido. Hipoativo (sonolência, retardo): 50% — frequentemente confundido com demência ou tristeza, maior mortalidade. Misto: 25%. Delirium hipoativo é o mais subdiagnosticado e com maior mortalidade — requerer atenção ativa, não esperar agitação.",
          },
          {
            nome: "Fatores predisponentes (vulnerabilidade de base)",
            tag: "risco",
            detalhe: "Idade avançada (>75a), demência prévia (risco 5x maior), déficit sensorial (visual/auditivo), imobilidade, desnutrição, desidratação, polifarmácia, comorbidades múltiplas, história prévia de delirium. Pacientes com demência têm maior vulnerabilidade a desencadeantes mesmo menores.",
          },
          {
            nome: "Fatores precipitantes — mnemônico I-WATCH-DEATH",
            tag: "diagnóstico",
            alerta: "info",
            detalhe: "I=Infecção; W=Withdrawal (abstinência); A=Acute metabolic (ureia, eletrólitos, glicose, TFH); T=Trauma (cirurgia, TCE); C=CNS (AVC, meningite, convulsão); H=Hypoxia; D=Deficiências (B12, tiamina, folato); E=Endocrinopatia (tireoide, adrenal); A=Acute vascular; T=Toxins/drugs (incluindo MPI); H=Heavy metals. Buscar e tratar causa.",
          },
          {
            nome: "Prevenção não farmacológica — HELP Protocol",
            tag: "prevenção",
            detalhe: "Hospital Elder Life Program (HELP): reorientação diária (calendário, relógio, janela); mobilização precoce; estimulação cognitiva; correção de déficits sensoriais (óculos, aparelhos auditivos); otimização do sono (evitar drogas, minimizar ruído noturno); hidratação adequada; evitar cateter vesical e restrições físicas. Reduz incidência de delirium em 40%.",
          },
          {
            nome: "Manejo farmacológico — quando e como",
            tag: "tratamento",
            alerta: "atencao",
            detalhe: "Farmacoterapia é SINTOMÁTICA para agitação grave com risco a si ou ao cuidador — não trata a causa. Haloperidol 0,25–0,5 mg VO/IM (preferível em delirium hiperativo); quetiapina 12,5–25 mg se parkinsonismo; EVITAR BZD (exceto em abstinência alcoólica). Dexmedetomidina em UTI reduz duração de delirium. Antipsicóticos aumentam mortalidade em demência — usar dose mínima e por tempo mínimo.",
          },
        ],
        pearls: [
          "Delirium em idosos hospitalizado associa-se a mortalidade de 20–35% durante a internação e de 40% em 6 meses — é um marcador de gravidade, não apenas 'confusão esperada'.",
          "Busque sempre a causa orgânica: ITU, pneumonia, obstrução urinária, constipação, hipo/hipernatremia e hipoglicemia são as causas mais comuns e tratáveis de delirium no idoso.",
          "CAM negativo NÃO exclui delirium hipoativo — se há suspeita, reavaliar em 4h com CAM completo. Documentar flutuação ao longo do dia.",
        ],
        referencia: "Inouye SK et al. Delirium in elderly patients. Lancet. 2014;383(9920):911-922. / Oh ES et al. Ann Intern Med. 2017. / AGS/BGS. Clinical Practice Guideline for Postoperative Delirium. 2015.",
      },
    ],
  },

  // ─── 4. INTERCONSULTA PSIQUIÁTRICA ────────────────────────────────────────
  {
    id: "interconsulta",
    titulo: "Interconsulta Psiquiátrica",
    subtitulo: "UTI · Oncologia · HIV · Doença Renal",
    cor: "blue",
    gradient: "from-blue-600 to-indigo-500",
    descricao: "Psiquiatria em contextos hospitalares especializados: delirium em UTI, neuropsiquiatria do HIV, oncologia e ajuste de dose em insuficiência renal.",
    plano: "free",
    secoes: [
      {
        id: "psiquiatria-uti",
        titulo: "Psiquiatria em UTI",
        tipo: "lista",
        intro: "Psiquiatria de ligação na UTI aborda principalmente delirium, sedação e agitação, abstinência alcoólica e sequelas psiquiátricas pós-UTI.",
        items: [
          {
            nome: "Delirium em UTI — CAM-ICU",
            tag: "diagnóstico",
            detalhe: "CAM-ICU: avalia desatenção (letras ou imagens), alteração aguda e flutuante, e nível de consciência (RASS ≠ 0). ICDSC (Intensive Care Delirium Screening Checklist) alternativo. Delirium em UTI ocorre em 60–80% dos pacientes ventilados e em 20–40% dos não-ventilados. Avaliar 2x/dia.",
          },
          {
            nome: "Manejo do delirium em UTI — ABCDEF Bundle",
            tag: "protocolo",
            detalhe: "A=Analgesia first; B=Awakening + Breathing (protocolos de despertar diário e desmame de VM); C=Coordenação; D=Delirium assessment; E=Early mobility and Exercise; F=Family engagement. Bundle ABCDEF reduz delirium em 30–40% e mortalidade na UTI. Sedação leve (RASS −1 a 0) é meta — evitar supersedação.",
          },
          {
            nome: "Sedação em UTI — Escala RASS e agentes",
            tag: "farmacologia",
            detalhe: "Richmond Agitation Sedation Scale (RASS): de −5 (não desperta) a +4 (combativo). Meta habitual: RASS −1 a 0. Dexmedetomidina: alfa-2 agonista, sedação leve, não causa delirium, permite despertar e comunicação — preferível a BZD. Propofol: curta ação, para sedação profunda e desmame rápido. BZD (midazolam): reservar para convulsão e abstinência alcóolica — associados a delirium.",
          },
          {
            nome: "SAA — Síndrome de Abstinência Alcoólica",
            tag: "urgência",
            alerta: "perigo",
            detalhe: "Início: 6–24h após última dose. Tremor e ansiedade (6–12h) → convulsão (24–48h) → delirium tremens (48–72h, até 5% mortalidade). CIWA-Ar guia tratamento. Tratamento: diazepam 10–20 mg/h IV até controle (dose-guided); tiamina 500 mg IV antes de glicose; hidratação; monitorização contínua. Fenobarbital segunda linha para abstinência refratária.",
          },
          {
            nome: "Psicofármacos seguros em UTI",
            tag: "farmacologia",
            detalhe: "Antipsicóticos: haloperidol VO/IV (cuidado com QTc); quetiapina VO; olanzapina IM. ISRS: citalopram, sertralina (menos interações). BZD: midazolam IV, lorazepam IV. Sedativos: propofol IV, dexmedetomidina IV. EVITAR: clorpromazina (hipotensão); clozapina (agranulocitose); lítio (janela terapêutica estreita, monitorar Na+ e hidratação).",
          },
          {
            nome: "Síndrome Pós-UTI (PICS)",
            tag: "seguimento",
            alerta: "info",
            detalhe: "Post-Intensive Care Syndrome: comprometimento cognitivo (50%), TEPT (30%), depressão (30%), ansiedade (40%) após alta da UTI. Fatores de risco: duração de delirium, sedação prolongada, sepse, ventilação mecânica prolongada. Rastrear com PCL-5 (TEPT), PHQ-9 (depressão) e MoCA (cognitivo) nas consultas de seguimento pós-UTI.",
          },
        ],
        pearls: [
          "Dexmedetomidina é superior a midazolam para sedação em UTI em termos de delirium, tempo de ventilação mecânica e RASS controlado — preferir quando viável.",
          "Cada dia de delirium em UTI aumenta em 10% a mortalidade hospitalar. Prevenir é mais eficaz que tratar.",
        ],
        referencia: "Devlin JW et al. SCCM Guidelines for Prevention and Management of Pain, Agitation/Sedation, Delirium. Crit Care Med. 2018;46(9):e825-e873. / Pandharipande PP et al. NEJM. 2013.",
      },
      {
        id: "oncologia-psiquiatria",
        titulo: "Psiquiatria em Oncologia",
        tipo: "lista",
        intro: "Complicações neuropsiquiátricas são extremamente comuns em pacientes oncológicos — depressão afeta 30–50%, delirium ocorre em 80% nos últimos dias de vida.",
        items: [
          {
            nome: "Depressão em câncer — diagnóstico e triagem",
            tag: "diagnóstico",
            detalhe: "PHQ-4 (2 perguntas de humor + 2 de ansiedade) é instrumento de triagem ideal em oncologia — rápido e validado. Dificuldade diagnóstica: sobreposição de sintomas somáticos (fadiga, anorexia, insônia) entre TDM e a doença oncológica. Critérios cognitivo-afetivos são mais específicos: anedonia, desesperança, sentimento de inutilidade, ideação suicida.",
          },
          {
            nome: "Tratamento da depressão em câncer",
            tag: "tratamento",
            detalhe: "ISRS são 1ª linha: sertralina e escitalopram têm perfil de interação favorável. Mirtazapina: útil quando há anorexia, náusea e insônia. Psicoestimulantes (metilfenidato 5–20 mg/dia): úteis em depressão com fadiga intensa em fase avançada — efeito rápido em 3–5 dias. Duloxetina: util em depressão + dor neuropática. Evitar ATC pelos efeitos adversos.",
          },
          {
            nome: "Delirium terminal",
            tag: "urgência",
            alerta: "atencao",
            detalhe: "Ocorre em 80–90% nas últimas 48h de vida. Pode ser reversível (desidratação, hipercalcemia, infecção) ou irreversível (falência multissistêmica). Avaliação: tratar causas reversíveis se compatível com metas de conforto. Manejo paliativo: haloperidol 1–2 mg SC/IV q4-6h; sedação paliativa com midazolam se delirium refratário e sofrimento intenso.",
          },
          {
            nome: "Efeitos neuropsiquiátricos de corticosteroides",
            tag: "farmacologia",
            alerta: "atencao",
            detalhe: "Corticosteroides em altas doses (≥40 mg prednisona/dia ou equivalente) causam sintomas neuropsiquiátricos em 20% dos pacientes: insônia, irritabilidade, euforia, mania, depressão, psicose. Risco dose-dependente. Psicose por corticoide: antipsicótico atípico e redução da dose do corticoide. Não usar lítio ou valproato como profilaxia.",
          },
          {
            nome: "Risco de suicídio em câncer",
            tag: "urgência",
            alerta: "perigo",
            detalhe: "Risco 2x maior que população geral. Fatores de risco: diagnóstico recente (especialmente pâncreas, pulmão), dor refratária, depressão não tratada, perda de autonomia funcional, isolamento social. Perguntar diretamente sobre ideação suicida. Distinguir desejo de morte (comum e não suicida) de ideação ativa com plano.",
          },
          {
            nome: "Neurotoxicidade de quimioterápicos",
            tag: "farmacologia",
            detalhe: "Ifosfamida: encefalopatia aguda (confusão, convulsão) — tratar com azul de metileno IV. Metotrexato em altas doses: leucoencefalopatia. Interferons: depressão, ideação suicida — monitorar humor; prophylaxia com ISRS se histórico depressivo. Procarbazina: inibidor de MAO — evitar interações alimentares e medicamentosas.",
          },
        ],
        pearls: [
          "Corticosteroides como dexametasona em alta dose (antiemético, antiedema cerebral) podem causar insônia e irritabilidade mesmo em doses agudas — orientar o paciente e preferir dose pela manhã.",
          "Mirtazapina 15 mg ao deitar é uma escolha interessante em oncologia: antidepressivo + ansiolítico + antiemético + estimulante do apetite — múltiplos efeitos benéficos em dose única.",
        ],
        referencia: "Grassi L et al. ESMO Clinical Practice Guidelines: Psychosocial Care in Cancer. Ann Oncol. 2023. / Breitbart W, Alici Y. Evidence-Based Treatment of Delirium in Patients with Cancer. J Clin Oncol. 2012.",
      },
      {
        id: "hiv-psiquiatria",
        titulo: "Neuropsiquiatria do HIV/AIDS",
        tipo: "lista",
        intro: "Manifestações neuropsiquiátricas ocorrem em >50% das pessoas vivendo com HIV. Podem ser primárias (HIV direto no SNC) ou secundárias (oportunistas, TARV, comorbidades).",
        items: [
          {
            nome: "HAND — HIV-Associated Neurocognitive Disorder",
            tag: "diagnóstico",
            detalhe: "Espectro: ANI (assintomático) → MND (transtorno neurocognitivo menor) → HAD (demência associada ao HIV). Prevalência: 30–50% mesmo com TARV supressora. Domínios mais afetados: velocidade de processamento, memória de trabalho, função executiva, habilidades motoras. Diagnóstico: avaliação neuropsicológica formal; CD4 e carga viral não são preditores confiáveis de HAND.",
          },
          {
            nome: "Depressão no HIV",
            tag: "prevalência",
            detalhe: "Prevalência de 30–50% — 3x maior que população geral. Causa multifatorial: inflamação neurológica por HIV, efeitos de TARV, estigma, perda social, comorbidades (hepatite C, drogas). Tratar agressivamente: TDM não tratada associa-se a pior adesão à TARV, maior carga viral e progressão da imunodeficiência. ISRS são 1ª linha — cuidado com interações.",
          },
          {
            nome: "Interações TARV × Psicofármacos",
            tag: "farmacologia",
            alerta: "perigo",
            detalhe: "Inibidores de protease (IP: ritonavir, lopinavir) e INNTR (efavirenz, nevirapina) são potentes moduladores de CYP3A4, 2D6. Interações críticas: Ritonavir + quetiapina: aumenta níveis de quetiapina 10–50x — sedação grave, prolongamento QTc. Efavirenz + metadona: reduz nível de metadona — risco de abstinência. Preferir psicofármacos com menor metabolismo pelo CYP3A4 (lorazepam, aripiprazol com cautela, escitalopram).",
          },
          {
            nome: "Efavirenz — efeitos neuropsiquiátricos",
            tag: "TARV",
            alerta: "atencao",
            detalhe: "Efavirenz afeta o SNC em 30–50% dos pacientes: sonhos vívidos/pesadelos, insônia, tontura, irritabilidade, dificuldade de concentração, depressão. Geralmente melhora em 2–4 semanas. Persistindo: trocar para dolutegravir ou rilpivirina (menos efeitos neuropsiquiátricos). Efavirenz raramente causa psicose em pacientes predispostos.",
          },
          {
            nome: "Infecções oportunistas neuropsiquiátricas",
            tag: "diagnóstico",
            alerta: "perigo",
            detalhe: "Toxoplasmose cerebral (CD4<200): alterações focais, convulsão, febre — RM com lesões com realce em anel; responder empiricamente. Meningite por Criptococo (CD4<100): cefaleia + febre gradual + meningismo tardio; LCR com tinta nanquim. LEMP (Leucoencefalopatia Multifocal Progressiva): JC virus, leucaraiose confluente sem realce, prognóstico grave. CMV: encefalite em CD4<50.",
          },
          {
            nome: "Mania secundária ao HIV",
            tag: "diagnóstico",
            detalhe: "Mania de instalação tardia (após 40a), sem história pessoal ou familiar de TAB, deve levantar suspeita de causa orgânica — no HIV, mania pode ser manifestação de HIV direto no SNC (mania HIV-associada) ou de infecção oportunista. Tratar causa de base + estabilizador (valproato preferível ao lítio — menor toxicidade renal e interação com TARV).",
          },
        ],
        pearls: [
          "Sempre checar interações TARV-psicofármaco antes de prescrever — ferramentas: HIV Drug Interactions Checker (Liverpool) ou Drugs.com. Ritonavir é o maior 'boosting' de CYP3A4.",
          "Dolutegravir substituiu efavirenz como TARV de 1ª linha no Brasil (PCDT 2023) — menos efeitos neuropsiquiátricos, mas ganho ponderal em ~20% dos pacientes.",
        ],
        referencia: "Antinori A et al. Updated research nosology for HIV-associated neurocognitive disorders. Neurology. 2007. / PCDT HIV/AIDS. Ministério da Saúde. 2023. / Liverpool HIV Drug Interactions. hiv-druginteractions.org.",
      },
      {
        id: "renal-psiquiatria",
        titulo: "Psiquiatria e Doença Renal",
        tipo: "lista",
        intro: "Doença Renal Crônica (DRC) altera farmacocinética de psicofármacos pela redução do clearance renal. Ajuste de dose e escolha correta evitam toxicidade.",
        items: [
          {
            nome: "Encefalopatia urêmica",
            tag: "diagnóstico",
            detalhe: "Síndrome neuropsiquiátrica da DRC avançada (TFG<15). Manifestações: confusão, letargia, alterações perceptivas, asterixis (flapping tremor), mioclonias, convulsões. Diferencial com delirium, demência urêmica. Tratamento: diálise — melhora neurológica é marcador de adequação dialítica. Na fase aguda: controle de eletrólitos, evitar medicamentos nefrotóxicos.",
          },
          {
            nome: "Lítio na DRC — contraindicação",
            tag: "farmacologia",
            alerta: "perigo",
            detalhe: "Lítio é eliminado exclusivamente por via renal. TFG<30 ml/min: contraindicação relativa (risco alto de toxicidade). TFG<15 ml/min ou hemodiálise: contraindicado (janela terapêutica impossível de manter). Alternativas para TAB em DRC: valproato (hepático, verificar hepatopatia), lamotrigina (requer ajuste moderado em DRC avançada), quetiapina (segura).",
          },
          {
            nome: "ISRS na DRC — ajuste de dose",
            tag: "farmacologia",
            detalhe: "Sertralina: 1ª escolha em DRC — metabolismo hepático, sem ajuste renal. Escitalopram: seguro, monitorar QTc em DRC avançada. Fluoxetina: meia-vida muito longa, acúmulo em DRC — evitar em TFG<30. Paroxetina: anticolinérgico, evitar em DRC grave. Citalopram: risco de QTc em dose alta — limitar a 20 mg/dia em DRC avançada.",
          },
          {
            nome: "Antipsicóticos na DRC",
            tag: "farmacologia",
            detalhe: "Haloperidol: metabolismo hepático, seguro em DRC — 1ª escolha para delirium e psicose em renal. Quetiapina: segura, sem ajuste necessário. Risperidona: metabólito ativo acumula em DRC — reduzir dose 50% em TFG<30. Olanzapina: hepática, segura. Clozapina: evitar — risco de agranulocitose aumentado, interações complexas.",
          },
          {
            nome: "Complicações psiquiátricas do transplante renal",
            tag: "transplante",
            detalhe: "Pré-transplante: avaliação psiquiátrica obrigatória — rastrear depressão, TUS, adesão prévia, suporte social. Pós-transplante imediato: delirium (50%), psicose por corticosteroide, ansiedade. Médio prazo: depressão (30%), TEPT (15%), disfunção sexual. Imunossupressores (ciclosporina, tacrolimus) podem causar tremor, cefaleia, encefalopatia.",
          },
          {
            nome: "Hemodiálise — aspectos psiquiátricos",
            tag: "contexto",
            detalhe: "Pacientes em hemodiálise têm prevalência de depressão de 20–40% e ansiedade de 30%. Impacto na qualidade de vida é enorme — restrições de dieta, fluidos, viagens, trabalho. Rastrear PHQ-9 regularmente. Medicamentos dialisáveis: lítio e gabapentina são removidos pela hemodiálise — dosar nível sérico no pré-diálise; dose suplementar pode ser necessária.",
          },
        ],
        pearls: [
          "Regra prática: psicofármacos com metabolismo predominantemente hepático (haloperidol, quetiapina, olanzapina, sertralina) são mais seguros em DRC — evitar os com eliminação renal significativa (lítio, gabapentina, pregabalina).",
          "Encefalopatia urêmica pode mimetizar psicose funcional — sempre dosar ureia, creatinina e TFG antes de iniciar antipsicótico em paciente com primeiro episódio psicótico.",
        ],
        referencia: "Hedayati SS et al. Non-pharmacological and pharmacological management of depression in patients with CKD. Am J Kidney Dis. 2017. / Psychiatric aspects of CKD — UpToDate. 2024.",
      },
    ],
  },

  // ─── 5. CAPS E RAPS ────────────────────────────────────────────────────────
  {
    id: "caps-raps",
    titulo: "CAPS e RAPS",
    subtitulo: "Tipos de CAPS · Componentes da RAPS · Encaminhamento",
    cor: "green",
    gradient: "from-green-500 to-emerald-600",
    descricao: "Rede de Atenção Psicossocial brasileira: tipos de CAPS, componentes da RAPS, fluxos de encaminhamento e critérios de internação psiquiátrica.",
    plano: "free",
    secoes: [
      {
        id: "tipos-caps",
        titulo: "Tipos de CAPS",
        tipo: "tabela",
        intro: "Os Centros de Atenção Psicossocial (CAPS) são serviços comunitários especializados em saúde mental. São o principal ponto de atenção especializada na RAPS — regulamentados pela Portaria GM/MS nº 3.088/2011.",
        tabela: {
          headers: ["Tipo", "Porte municipal", "Horário", "Público-alvo", "Leitos (acolhimento)"],
          linhas: [
            ["CAPS I", "Municípios 20.000–70.000 hab.", "2ª a 6ª, mínimo 8h/dia", "Adultos com transtornos mentais graves e persistentes", "Nenhum"],
            ["CAPS II", "Municípios 70.000–200.000 hab.", "2ª a 6ª, mínimo 8h/dia", "Adultos com transtornos mentais graves e persistentes", "Nenhum"],
            ["CAPS III", "Municípios >200.000 hab.", "24h, 7 dias/semana", "Adultos — acolhimento em crise, incluindo noturno", "Até 5 leitos de acolhimento noturno"],
            ["CAPS AD I", "Municípios 20.000–70.000 hab.", "2ª a 6ª, mínimo 8h/dia", "Álcool e outras drogas — adultos e adolescentes", "Nenhum"],
            ["CAPS AD II", "Municípios 70.000–200.000 hab.", "2ª a 6ª, mínimo 8h/dia", "Álcool e outras drogas — adultos e adolescentes", "Nenhum"],
            ["CAPS AD III", "Municípios >200.000 hab.", "24h, 7 dias/semana", "Álcool e outras drogas — adultos e adolescentes", "Até 8 leitos de acolhimento"],
            ["CAPSi I", "Municípios 70.000–150.000 hab.", "2ª a 6ª, mínimo 8h/dia", "Crianças e adolescentes (0–17 anos)", "Nenhum"],
            ["CAPSi II", "Municípios >150.000 hab.", "2ª a 6ª, mínimo 8h/dia", "Crianças e adolescentes (0–17 anos)", "Nenhum"],
          ],
          nota: "CAPS III e CAPS AD III são os únicos com funcionamento 24h e capacidade de acolhimento noturno — não são hospitais, são serviços de base comunitária com leitos transitórios.",
        },
        pearls: [
          "CAPS não é pronto-socorro — crise aguda com risco a si ou a terceiros deve ser encaminhada para UPA/PS para estabilização antes do encaminhamento ao CAPS.",
          "CAPS AD III é referência nacional para crack e álcool em grandes municípios — tem Unidade de Acolhimento (UA) integrada e acesso a 24h sem necessidade de internação.",
        ],
        referencia: "Portaria GM/MS nº 3.088, de 23 de dezembro de 2011. Institui a Rede de Atenção Psicossocial (RAPS). / Portaria GM/MS nº 3.090/2011 (Residências Terapêuticas).",
      },
      {
        id: "componentes-raps",
        titulo: "Componentes da RAPS",
        tipo: "lista",
        intro: "A Rede de Atenção Psicossocial (RAPS) é composta por pontos de atenção articulados para oferecer cuidado integral em saúde mental, do básico ao especializado, da crise à reabilitação.",
        items: [
          {
            nome: "Atenção Básica — UBS e Nasf-AB",
            tag: "porta de entrada",
            detalhe: "Porta de entrada preferencial para casos leves a moderados. UBS realiza acolhimento, diagnóstico e acompanhamento de transtornos comuns (ansiedade, depressão leve, uso problemático de álcool). Nasf-AB (Núcleo Ampliado de Saúde da Família): apoio matricial ao PSF — psicólogo, psiquiatra ou TO do Nasf auxilia a equipe de saúde da família sem assumir o caso.",
          },
          {
            nome: "CAPS (Centros de Atenção Psicossocial)",
            tag: "especializado",
            detalhe: "Referência para transtornos mentais graves e persistentes. Oferecem tratamento intensivo, semi-intensivo e não-intensivo. Modalidades: atendimento individual (consultas, psicoterapia), grupos terapêuticos, oficinas, visitas domiciliares, articulação com família e rede social.",
          },
          {
            nome: "UA — Unidade de Acolhimento",
            tag: "moradia",
            detalhe: "Moradia transitória voluntária para adultos com necessidades relacionadas ao crack, álcool e outras drogas que estejam em processo de inclusão social. Acolhimento por até 6 meses. NÃO é internação — voluntário, sem grades, sem contenção. Vinculado ao CAPS AD para projeto terapêutico.",
          },
          {
            nome: "RT — Residência Terapêutica",
            tag: "moradia",
            detalhe: "Moradia permanente na comunidade para pessoas com transtornos mentais egressas de hospitais psiquiátricos ou de longa permanência que perderam vínculos familiares. Casa com 8–10 moradores, suporte de profissional de saúde. Diferente da UA: é moradia definitiva, não transitória, e não vinculada a uso de substâncias.",
          },
          {
            nome: "CR — Centro de Convivência e Cultura",
            tag: "reabilitação",
            detalhe: "Espaço público para convivência, produção cultural e inclusão social de pessoas com transtornos mentais. Oficinas de arte, cultura, trabalho. Não realiza tratamento clínico — é dispositivo de reabilitação e inclusão social.",
          },
          {
            nome: "SR — Serviço de Reabilitação Psicossocial",
            tag: "reabilitação",
            detalhe: "Cooperativas sociais, empreendimentos solidários e iniciativas de geração de renda para pessoas com transtorno mental e dependência química. Inclui cooperativas de trabalho, hortas comunitárias, panificadoras solidárias. Base na Economia Solidária.",
          },
          {
            nome: "Atenção de Urgência — UPA e SAMU",
            tag: "urgência",
            detalhe: "UPA 24h: atendimento de crise aguda, tentativa de suicídio, intoxicação, agitação psicomotora. Deve ter protocolo de saúde mental. SAMU: acionamento para emergências psiquiátricas com risco de vida. Objetivo: estabilização e encaminhamento — não são serviços de internação psiquiátrica.",
          },
          {
            nome: "Hospital Geral — leitos de saúde mental",
            tag: "internação",
            detalhe: "Portaria 148/2012: hospitais gerais devem ter leitos de saúde mental para internação em crise — preferencialmente integrados ao hospital (não unidades isoladas). Reduz estigma, facilita cuidado de comorbidades clínicas. Meta do MS: ampliar leitos em HG e reduzir em hospitais especializados.",
          },
          {
            nome: "Hospital Psiquiátrico Especializado",
            tag: "internação",
            alerta: "info",
            detalhe: "Ainda existem — Lei 10.216 não fecha os existentes, apenas proíbe novos. Devem ser avaliados periodicamente e credenciados pelo MS. Devem funcionar em articulação com a RAPS (não como substitutos). Tendência de redução progressiva de leitos e desinstitucionalização dos moradores.",
          },
        ],
        pearls: [
          "A RAPS não é linear — é uma rede. O paciente pode entrar por qualquer ponto (UBS, UPA, CAPS) e ser referenciado para outros pontos conforme a necessidade clínica.",
          "Matriciamento: CAPS ou Nasf-AB oferecem suporte técnico às equipes de saúde da família — o psiquiatra do Nasf NÃO assume o paciente, ele apoia o generalista a cuidar dele na UBS.",
        ],
        referencia: "Portaria GM/MS nº 3.088/2011. RAPS. / Brasil. Ministério da Saúde. Saúde Mental no SUS: as novas fronteiras da Reforma Psiquiátrica. 2011.",
      },
      {
        id: "fluxo-encaminhamento",
        titulo: "Fluxos de Encaminhamento",
        tipo: "lista",
        intro: "Como articular os diferentes pontos da RAPS na prática clínica — quem encaminha para onde e com qual critério.",
        items: [
          {
            nome: "UBS → CAPS: critérios de encaminhamento",
            tag: "fluxo",
            detalhe: "Encaminhar ao CAPS quando: transtorno mental grave com prejuízo funcional significativo (psicose, bipolar com ciclagem, depressão grave recorrente); necessidade de abordagem multiprofissional intensiva; risco à integridade própria ou alheia sem necessidade de internação imediata; falha de resposta ao tratamento na atenção básica após 2–3 meses.",
          },
          {
            nome: "CAPS → Internação hospitalar: critérios",
            tag: "fluxo",
            alerta: "atencao",
            detalhe: "Encaminhar para internação quando: risco imediato de suicídio com plano e meios; heteroagressão iminente; crise psicótica grave sem resposta ao tratamento intensivo ambulatorial em 2–4 semanas; SAA grave; desnutrição grave por transtorno alimentar; incapacidade total de autocuidado sem suporte domiciliar.",
          },
          {
            nome: "Crise aguda → UPA/PS → CAPS",
            tag: "urgência",
            alerta: "perigo",
            detalhe: "Fluxo: UPA/PS estabiliza a crise (farmacológica, controle de agitação, hidratação, exames) → alta com referenciamento ao CAPS → agendamento em CAPS em até 48h–7 dias (conforme urgência). NÃO encaminhar crise aguda diretamente ao CAPS se há risco a si ou a terceiros — CAPS não tem estrutura de contenção.",
          },
          {
            nome: "Internação → CAPS: alta planejada",
            tag: "fluxo",
            detalhe: "Alta hospitalar deve ser planejada com o CAPS de referência do território ANTES da saída. Mínimo: telefonema ao CAPS referência; carta de alta detalhada; agendamento de consulta em até 7 dias. Seguimento precoce pós-alta reduz reinternação em 30–50%. Alta sem vinculação = porta giratória.",
          },
          {
            nome: "Paciente crônico estabilizado no CAPS → UBS",
            tag: "fluxo",
            detalhe: "Contrarreferência ao nível básico: paciente estabilizado clinicamente, com projeto de vida consolidado, funcionamento social adequado, adesão medicamentosa preservada. UBS assume acompanhamento longitudinal com suporte do Nasf-AB. CAPS mantém disponibilidade para crises.",
          },
          {
            nome: "Encaminhamento para leito de RT",
            tag: "moradia",
            detalhe: "Indicado para egressos de hospitais psiquiátricos com: tempo de internação >2 anos; ausência de vínculos familiares funcionais; incapacidade de moradia independente mesmo com suporte. Processo: avaliação pela equipe do CAPS + assistente social + coordenação de saúde mental municipal. Vaga via lista de espera municipal.",
          },
        ],
        pearls: [
          "Território é a unidade organizadora da RAPS — cada CAPS atende um território geográfico definido. O paciente deve ser encaminhado ao CAPS do seu território, não ao mais próximo do hospital.",
          "Projeto Terapêutico Singular (PTS): plano individualizado elaborado pela equipe multiprofissional do CAPS + paciente + família. Define metas, responsabilidades e periodicidade — é a ferramenta central do cuidado no CAPS.",
        ],
        referencia: "Brasil. Ministério da Saúde. Linha de Cuidado para Atenção às Pessoas com Transtornos do Espectro do Autismo e suas Famílias. 2015. / CFM. Resolução 2.057/2013.",
      },
      {
        id: "internacao-psiquiatrica",
        titulo: "Internação Psiquiátrica",
        tipo: "lista",
        intro: "Critérios, modalidades e responsabilidades legais na internação psiquiátrica no Brasil — Lei 10.216/2001.",
        items: [
          {
            nome: "Indicações clínicas de internação",
            tag: "clínico",
            detalhe: "Risco imediato e grave de suicídio (com plano e meios); heteroagressão com risco de dano físico a terceiros; psicose aguda grave com perda total de contato com a realidade; síndrome de abstinência grave com risco de vida (DT, convulsão); incapacidade total de autocuidado sem suporte; anorexia nervosa com IMC <13 ou recusa alimentar total; refratariedade a múltiplos esquemas ambulatoriais.",
          },
          {
            nome: "Internação voluntária — protocolo",
            tag: "legal",
            detalhe: "Paciente solicita e assina Termo de Consentimento. Direito de solicitar alta a qualquer momento — médico tem até 72h para avaliar; se clinicamente contraindicada, converter para involuntária com notificação ao MP. Médico deve documentar os critérios clínicos de manutenção da internação.",
          },
          {
            nome: "Internação involuntária — protocolo",
            tag: "legal",
            alerta: "atencao",
            detalhe: "Indicada por médico ou solicitada por familiar/responsável quando paciente não tem capacidade de consentir ou recusa tratamento com risco a si ou terceiros. Obrigações: 1) Documentar critérios clínicos; 2) Notificar MP estadual em até 72h por escrito; 3) Revisar necessidade de internação periodicamente; 4) Alta é competência médica — não do familiar.",
          },
          {
            nome: "Internação compulsória — protocolo",
            tag: "legal",
            alerta: "perigo",
            detalhe: "Determinada pelo Poder Judiciário mediante laudo médico circunstanciado. Frequente em situações de dependência química grave com recusa de tratamento (Cracolândia). Médico que fornece laudo para internação compulsória deve basear-se em critérios clínicos rigorosos — internação por razões sociais, morais ou de ordem pública é ilegal e antiética (Art. 4, Lei 10.216).",
          },
          {
            nome: "Hospital Dia (HD)",
            tag: "alternativa",
            detalhe: "Alternativa à internação integral: atendimento 5 dias/semana, 4–8h/dia, com retorno ao domicílio. Indicado quando tratamento ambulatorial é insuficiente mas internação integral é desnecessária. Mantém vínculo familiar, social e profissional. Eficaz para: TDM moderado-grave, transtornos alimentares, TP em fase de crise, refratariedade com risco baixo.",
          },
          {
            nome: "Alta hospitalar — responsabilidade e planejamento",
            tag: "alta",
            detalhe: "Competência exclusiva do médico assistente. Alta deve ser planejada antes da saída: contato com CAPS de referência; carta de alta completa (diagnóstico, medicação, plano terapêutico, próxima consulta); agendamento em até 7 dias (idealmente <72h para casos de alto risco). Família deve ser orientada sobre sinais de recaída e o que fazer.",
          },
        ],
        pearls: [
          "A Lei 10.216 estabelece que internação por tempo indeterminado é exceção — a necessidade deve ser revista periodicamente e documentada. Internação longa sem revisão é ilegal.",
          "Hospital de Custódia e Tratamento Psiquiátrico (HCTP): local da medida de segurança para inimputáveis — NÃO é hospital psiquiátrico comum, é estabelecimento penal. Subordinado ao sistema de justiça, não à Saúde.",
        ],
        referencia: "Lei nº 10.216, de 6 de abril de 2001. / CFM. Resolução CFM nº 2.057/2013. / Portaria GM/MS nº 2.391/2002 (regulamenta internação psiquiátrica involuntária).",
      },
    ],
  },
];
