export type CategoriaPsicopatologia =
  | "percepcao"
  | "pensamento-forma"
  | "pensamento-conteudo"
  | "humor-afeto"
  | "consciencia"
  | "memoria"
  | "psicomotricidade"
  | "vontade-impulsos"
  | "inteligencia"
  | "insight";

export interface EntradaPsicopatologia {
  id: string;
  titulo: string;
  categoria: CategoriaPsicopatologia;
  plano: "free" | "pro";
  resumo: string;
  conteudo: string;
  fenomenos: {
    nome: string;
    definicao: string;
    exemplo?: string;
    diagnostico_associado?: string;
  }[];
  pearls: string[];
  referencia: string;
}

export const psicopatologia: EntradaPsicopatologia[] = [
  // ─── 1. ALTERAÇÕES DA PERCEPÇÃO ─────────────────────────────────────────────
  {
    id: "alteracoes-percepcao",
    titulo: "Alterações da Percepção",
    categoria: "percepcao",
    plano: "free",
    resumo:
      "A percepção é o processo de captação e elaboração dos estímulos do meio externo e interno. Suas alterações incluem alucinações, pseudoalucinações, ilusões e alucinoses, que diferem quanto à origem (com ou sem estímulo real), localização (espaço objetivo vs. subjetivo) e preservação do insight.",
    conteudo:
      "A percepção normal exige a presença de um estímulo externo ou interoceptivo que é captado pelos órgãos dos sentidos e elaborado pelo sistema nervoso central até a tomada de consciência do objeto percebido. Qualquer ruptura nesse processo pode gerar alterações qualitativas ou quantitativas da percepção.\n\nAs **alucinações** são as alterações perceptivas de maior relevância clínica. Definem-se como percepções sem objeto — o paciente percebe algo que não existe no ambiente externo, com a mesma vivacidade e certeza de uma percepção real, projetando-a no espaço objetivo. Não há consciência de artificialidade. As alucinações auditivas são as mais prevalentes nas psicoses funcionais (≈70% dos casos de esquizofrenia). Podem ser simples (fonemas, ruídos) ou elaboradas (vozes comentando ações, duas vozes discutindo sobre o paciente, vozes que dão ordens — este último tipo com alto risco de automutilação ou heteroagressão).\n\nAs **pseudoalucinações** localizam-se no espaço subjetivo interno (dentro da cabeça, sem projeção exterior) e cursam com crítica preservada — o paciente reconhece que não são percepções reais. São frequentes em estados dissociativos, esquizofrenia (onde convivem com alucinações verdadeiras) e transtornos de personalidade.\n\nAs **ilusões** diferem das alucinações por pressuporem um estímulo real existente, o qual é percebido de forma distorcida ou deformada. São classificadas em ilusões por desatenção (cansaço, distração), por afeto (medo intensifica ilusões ameaçadoras) e pareidolias (ilusões fisionômicas em superfícies texturizadas — fenômeno normal em pessoas criativas). Patologicamente, predominam em estados de rebaixamento de consciência (delirium) e intoxicações.\n\nA **alucinose** é uma alucinação com crítica preservada — o paciente reconhece o fenômeno como anormal e irreal. Característica de etiologias orgânicas: alucinose alcoólica (vozes ameaçadoras em plena consciência sem delirium), lesões do pedúnculo cerebral (alucinose peduncular de Lhermitte — figuras coloridas crepusculares), e epilepsia do lobo temporal.",
    fenomenos: [
      {
        nome: "Alucinação auditiva verbal",
        definicao:
          "Vozes percebidas como vindas do exterior, sem estímulo real. Podem ser comentadoras, imperativas ou dialogantes.",
        exemplo: "\"Ouço uma voz que fica me xingando o dia todo. Ela vem de fora, não da minha cabeça.\"",
        diagnostico_associado: "Esquizofrenia, Transtorno Esquizoafetivo, Psicose maníaca",
      },
      {
        nome: "Alucinação visual",
        definicao:
          "Percepção visual sem objeto real. Figuras geométricas simples (fotopsias) nas enxaquecas; figuras elaboradas em delirium, psicoses orgânicas e alucinações por psicodélicos.",
        exemplo: "Paciente no delirium tremens relata ver insetos saindo da parede.",
        diagnostico_associado: "Delirium, abstinência alcoólica, psicose por psicodélicos, demência com corpos de Lewy",
      },
      {
        nome: "Alucinação tátil (háptica)",
        definicao:
          "Sensação de toque, pressão ou movimento na superfície ou abaixo da pele sem estímulo externo.",
        exemplo: "\"Sinto bichos andando embaixo da minha pele\" (formigamento — formigas, cocaine bugs).",
        diagnostico_associado: "Abstinência de estimulantes (cocaína, anfetamina), delirium",
      },
      {
        nome: "Pseudoalucinação",
        definicao:
          "Percepção sem objeto, localizada no espaço interno subjetivo, com reconhecimento de artificialidade pelo paciente.",
        exemplo: "\"Ouço uma voz dentro da minha cabeça que me insulta, mas sei que não é real.\"",
        diagnostico_associado: "Esquizofrenia, transtornos dissociativos, TPB",
      },
      {
        nome: "Ilusão pareidólica",
        definicao:
          "Percepção de formas reconhecíveis (rostos, figuras humanas) em superfícies texturizadas ou padrões aleatórios. Ocorre em estados normais e é intensificada por ansiedade e intoxicações.",
        exemplo: "Ver rostos em manchas na parede ou nuvens.",
        diagnostico_associado: "Normal; intensificada em intoxicação por cannabis ou psicodélicos",
      },
      {
        nome: "Alucinose",
        definicao:
          "Alucinação com crítica preservada — percepção sem objeto real, reconhecida pelo paciente como não genuína.",
        exemplo: "\"Vejo homenzinhos na parede, mas sei que não estão lá.\"",
        diagnostico_associado: "Alucinose alcoólica, alucinose peduncular, epilepsia do lobo temporal",
      },
      {
        nome: "Despersonalização",
        definicao:
          "Sensação de estranhamento em relação a si mesmo — o paciente sente que está observando seus próprios pensamentos, sentimentos ou corpo de fora, como se fosse um robô ou sonâmbulo.",
        exemplo: "\"Me sinto como se estivesse fora do meu corpo, vendo a mim mesmo de longe.\"",
        diagnostico_associado: "Transtorno de Despersonalização/Desrealização, TEPT, Pânico, Esquizofrenia",
      },
      {
        nome: "Desrealização",
        definicao:
          "Sensação de que o ambiente externo é irreal, artificial, onírico ou distante — o mundo parece uma cenário de teatro.",
        exemplo: "\"Tudo ao meu redor parece falso, como se fosse um sonho ou uma decoração de papelão.\"",
        diagnostico_associado: "Transtorno de Despersonalização/Desrealização, episódios dissociativos, Pânico",
      },
    ],
    pearls: [
      "Vozes que comentam as ações do paciente na terceira pessoa ou que dialogam entre si são sintomas de primeira ordem de Schneider — alta especificidade para esquizofrenia, mas não patognomônicas.",
      "Alucinações visuais em psiquiatria sempre levantar suspeita orgânica (delirium, demência com corpos de Lewy, epilepsia, intoxicação) — são incomuns em psicoses funcionais puras.",
      "Alucinose alcoólica ocorre em alcoolistas crônicos, geralmente nas primeiras 24h da abstinência, com vozes ameaçadoras e crítica preservada — distingue-se do delirium tremens pela ausência de confusão e ocorre com o paciente lúcido.",
      "Despersonalização/desrealização transitória é comum em população geral — torna-se patológica quando intensa, persistente e causa sofrimento ou prejuízo funcional.",
      "Ao avaliar alucinações, sempre perguntar o conteúdo das vozes: vozes imperativas de automutilação ou heteroagressão exigem avaliação de risco imediata.",
    ],
    referencia:
      "Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 111–150.",
  },

  // ─── 2. ALTERAÇÕES DO PENSAMENTO — FORMA E CURSO ────────────────────────────
  {
    id: "pensamento-forma",
    titulo: "Alterações do Pensamento — Forma e Curso",
    categoria: "pensamento-forma",
    plano: "free",
    resumo:
      "As alterações formais do pensamento referem-se a perturbações na velocidade, continuidade, direção e coerência do fluxo de ideias. Incluem aceleração (fuga de ideias), lentificação, bloqueio do pensamento, tangencialidade, circunstancialidade, perseveração e desagregação, cada uma com implicações diagnósticas específicas.",
    conteudo:
      "O pensamento normal é linear, coerente, dirigido a objetivos e com velocidade adequada ao contexto. Suas alterações formais são identificadas pela análise do discurso — como o paciente fala revela como ele pensa.\n\nAs **alterações de velocidade** incluem a **aceleração do pensamento** (taquipsiquia), caracterizada por grande velocidade no encadeamento de ideias, saltando de tema em tema por associações sonoras (rimas, aliterações) ou por similaridade superficial — configurando a **fuga de ideias**, típica da mania. No extremo, o discurso torna-se ininteligível (rédea solta, Ideenflucht). Em contraste, a **lentificação** (bradipsiquia) traduz escassez de ideias e demora na resposta, observada na depressão e no hipotireoidismo.\n\nO **bloqueio do pensamento** (sperrung) é a interrupção abrupta e involuntária do fluxo discursivo — o paciente para no meio de uma frase sem conseguir retomá-la, frequentemente vivenciado como roubo do pensamento por uma força externa. É um dos sintomas de primeira ordem de Schneider para esquizofrenia.\n\nA **tangencialidade** ocorre quando o paciente responde a uma pergunta de forma oblíqua — vai ao redor do tema sem tocá-lo, nunca chegando à resposta esperada. A **circunstancialidade** difere por incluir rodeios excessivos e detalhes supérfluos, mas eventualmente atingir o objetivo — mais comum em mania leve, ansiedade e algumas personalidades.\n\nA **perseveração** é a repetição involuntária de uma palavra, frase ou tema após o estímulo que a provocou ter cessado. Típica de síndromes demenciais e transtornos orgânicos cerebrais.\n\nA **desagregação** (ou incoerência, salada de palavras) representa a forma mais severa de alteração formal — total perda da sintaxe e da coerência semântica, com justaposição de palavras sem sentido lógico. Ocorre em esquizofrenia grave, delirium e estados amentivos. Deve ser distinguida da **verbigeração** (repetição estereotipada de palavras sem conteúdo semântico), mais associada à catatonia.",
    fenomenos: [
      {
        nome: "Fuga de ideias",
        definicao:
          "Aceleração do pensamento com troca rápida de tema por associações superficiais (sonoras, visuais). O fio condutor ainda é perceptível ao examinador.",
        exemplo: "\"Vim aqui de carro, carro é lindo, lindamente eu canto, Cantora — já fui artista sabe, sabe...\"",
        diagnostico_associado: "Episódio maníaco, Hipomania, TB I/II",
      },
      {
        nome: "Bloqueio do pensamento (sperrung)",
        definicao:
          "Interrupção abrupta, involuntária e total do fluxo do pensamento, vivenciada como interferência externa. O paciente para no meio de uma frase e não consegue retomá-la.",
        exemplo: "\"Fui ao mercado e de repente... [silêncio prolongado]... perdi completamente o que estava falando.\"",
        diagnostico_associado: "Esquizofrenia (sintoma de 1ª ordem de Schneider)",
      },
      {
        nome: "Tangencialidade",
        definicao:
          "Resposta que parte do tema proposto mas não chega ao objetivo — o discurso vai em direção oblíqua ao ponto esperado.",
        exemplo: "Pergunta: \"Você está triste?\" Resposta: \"O clima aqui sempre foi muito úmido, né? Temperatura afeta tudo.\"",
        diagnostico_associado: "Esquizofrenia, Mania",
      },
      {
        nome: "Circunstancialidade",
        definicao:
          "Discurso excessivamente detalhado e prolixo, com muitos rodeios e digressões, mas que finalmente chega ao ponto. Difere da tangencialidade porque o objetivo é atingido.",
        exemplo: "Paciente leva 10 minutos descrevendo o dia inteiro antes de responder se dormiu bem.",
        diagnostico_associado: "Ansiedade, Mania leve, Epilepsia do lobo temporal",
      },
      {
        nome: "Perseveração",
        definicao:
          "Repetição involuntária de uma palavra, ideia ou tema já esgotado, mesmo após mudança de estímulo.",
        exemplo: "Após responder \"minha mãe\", o paciente continua repetindo \"minha mãe\" em resposta a perguntas diferentes.",
        diagnostico_associado: "Demência, lesão de lobo frontal, delirium",
      },
      {
        nome: "Desagregação (salada de palavras)",
        definicao:
          "Perda completa da sintaxe e da coerência — palavras e frases são justapostas sem nexo lógico ou gramatical.",
        exemplo: "\"Azul — minha dor — o cachorro voa pelas paredes da janela — fimbrendo estou.\"",
        diagnostico_associado: "Esquizofrenia grave, Delirium, Mania com estado misto grave",
      },
      {
        nome: "Neologismo",
        definicao:
          "Criação de novas palavras com significado particular para o paciente, sem correspondência no léxico convencional.",
        exemplo: "\"Estou sofrendo de 'fluboristia' — é a doença que me persegue.\"",
        diagnostico_associado: "Esquizofrenia",
      },
      {
        nome: "Mutismo",
        definicao:
          "Ausência completa da produção verbal — pode ser de origem catatônica, depressiva, dissociativa ou orgânica.",
        diagnostico_associado: "Catatonia, Depressão grave, Transtorno Dissociativo",
      },
    ],
    pearls: [
      "Fuga de ideias e pressão do discurso são os sinais mais específicos de mania — a distinção em relação ao pensamento esquizofrênico é que na mania as associações ainda fazem sentido superficialmente (conexão pelo som ou tema).",
      "Bloqueio do pensamento é diferente de pausas por ansiedade ou pela busca da palavra certa — no bloqueio verdadeiro, o paciente frequentemente vivencia uma força externa que rouba seus pensamentos (sintoma de 1ª ordem de Schneider).",
      "Pensamento concreto (incapacidade de abstração) é frequente na esquizofrenia e pode ser avaliado pedindo interpretação de provérbios — \"pedra que rola não cria limo\" interpretado como \"pedras de fato não criam limo\" é resposta concreta.",
      "Tangencialidade vs. Circunstancialidade: na tangencialidade o objetivo NUNCA é atingido; na circunstancialidade ele é atingido, apenas com muitos rodeios.",
      "Desagregação grave impede diagnóstico de conteúdo do pensamento — foque primeiro em estabilizar o paciente antes de tentar avaliação semiológica detalhada.",
    ],
    referencia:
      "Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 163–200.",
  },

  // ─── 3. ALTERAÇÕES DO PENSAMENTO — CONTEÚDO ─────────────────────────────────
  {
    id: "pensamento-conteudo",
    titulo: "Alterações do Pensamento — Conteúdo",
    categoria: "pensamento-conteudo",
    plano: "free",
    resumo:
      "As alterações do conteúdo do pensamento envolvem ideias anômalas quanto ao seu valor de realidade, grau de convicção e resistência à contra-argumentação. Os principais fenômenos são o delírio, a ideia sobrevalorizada, a ideia obsessiva e o pensamento mágico.",
    conteudo:
      "O **delírio** é a mais importante alteração do conteúdo do pensamento. Classicamente definido pela tríade de Jaspers: (1) certeza subjetiva absoluta, (2) impermeabilidade à contra-argumentação lógica ou à experiência e (3) impossibilidade ou falsidade do conteúdo. O delírio emerge como vivência primária — não deriva logicamente de outras ideias — e reorganiza a experiência subjetiva do paciente em torno de si.\n\nOs **temas delirantes** mais comuns incluem: persecutório (o mais prevalente — convicção de ser perseguido, espionado, envenenado); grandioso (poderes especiais, missão divina, riqueza inexistente); de referência (eventos neutros do ambiente têm mensagens especiais dirigidas ao paciente); de ciúme (Síndrome de Otelo — certeza de infidelidade do parceiro); de culpa (em depressão psicótica — convicção de ter cometido pecado imperdoável ou ser responsável por catástrofes); niilista (Síndrome de Cotard — convicção de que órgãos apodreceram, de estar morto ou de que o mundo não existe); somático (convicção de ter doença grave ou parasitas).\n\nOs **fenômenos de influência** de Schneider são delírios de passividade especialmente relevantes para esquizofrenia: pensamento imposto (inserção ou roubo de pensamentos por agente externo), difusão do pensamento (crença de que outros podem ler ou ouvir seus pensamentos), e experiências de influência sobre movimentos, emoções ou vontade.\n\nA **ideia sobrevalorizada** (overvalued idea) difere do delírio por ser compreensível no contexto biográfico do paciente — é uma ideia com carga afetiva intensa e parcialmente resistente à contra-argumentação, mas sem o grau de certeza absoluta do delírio. Exemplo: a ideia central no TOC de baixo insight, nos transtornos alimentares, na hipocondria.\n\nA **ideia obsessiva** é vivenciada como estranha ao ego (egodistônica), intrusiva e indesejada — o paciente reconhece sua origem própria e luta contra ela, mas não consegue suprimí-la. O conteúdo tipicamente envolve dúvida, contaminação, dano, simetria ou temas proibidos. Difere do delírio pelo insight preservado e do pensamento livre pelo caráter compulsivo.\n\nO **pensamento mágico** envolve crenças em conexões causais entre eventos sem base lógica ou empírica. É normal no desenvolvimento infantil, em culturas específicas e na criatividade; torna-se patológico quando rígido, intenso e causa prejuízo funcional (Transtorno de Personalidade Esquizotípica, Esquizofrenia).",
    fenomenos: [
      {
        nome: "Delírio persecutório",
        definicao:
          "Convicção inabalável de ser objeto de perseguição, espionagem, difamação, envenenamento ou agressão por pessoas, grupos ou forças identificadas.",
        exemplo: "\"A CIA colocou câmeras no meu apartamento. Meus vizinhos trabalham para eles e relatam tudo que faço.\"",
        diagnostico_associado: "Esquizofrenia, Transtorno Delirante, Mania com psicose, Paranoia",
      },
      {
        nome: "Delírio de referência",
        definicao:
          "Convicção de que eventos neutros do ambiente (notícias, comportamentos de estranhos, números de placas) têm mensagens ou significados especiais dirigidos ao paciente.",
        exemplo: "\"O apresentador do jornal estava me dando recados quando piscou o olho — é um código.\"",
        diagnostico_associado: "Esquizofrenia, Mania grave",
      },
      {
        nome: "Delírio de grandiosidade",
        definicao:
          "Convicção de ter poderes especiais, missão divina, identidade excepcional, riqueza ilimitada ou de ser uma figura histórica ou religiosa.",
        exemplo: "\"Sou enviado de Deus para curar a humanidade. Tenho poderes que mais ninguém tem.\"",
        diagnostico_associado: "Mania com psicose, Esquizofrenia, Paralisia geral (neurossífilis)",
      },
      {
        nome: "Delírio de Cotard (niilista)",
        definicao:
          "Convicção de que partes do corpo ou órgãos internos apodreceram, deixaram de existir, ou de que o próprio paciente está morto ou que o mundo deixou de existir.",
        exemplo: "\"Meu estômago não existe mais, estou apodrecendo por dentro. Já morri.\"",
        diagnostico_associado: "Depressão Psicótica grave, Esquizofrenia",
      },
      {
        nome: "Inserção/roubo/difusão do pensamento",
        definicao:
          "Inserção: pensamentos são colocados na mente por agente externo. Roubo: pensamentos são retirados pela cabeça antes de serem completados. Difusão: pensamentos são transmitidos para outras pessoas como se fossem audíveis.",
        exemplo: "\"Alguém me coloca pensamentos ruins na cabeça\" / \"Eles roubam meus pensamentos antes de eu terminá-los\" / \"Todos podem ouvir o que estou pensando.\"",
        diagnostico_associado: "Esquizofrenia (sintomas de 1ª ordem de Schneider)",
      },
      {
        nome: "Ideia obsessiva",
        definicao:
          "Pensamento intruso, egodistônico, recorrente e persistente que causa ansiedade ou sofrimento. O paciente reconhece sua origem interna e tenta resistir sem sucesso.",
        exemplo: "\"Fico pensando que posso contaminar minha família mesmo lavando as mãos várias vezes. Sei que é absurdo, mas não consigo parar.\"",
        diagnostico_associado: "TOC",
      },
      {
        nome: "Ideia sobrevalorizada",
        definicao:
          "Ideia com carga afetiva intensa, parcialmente compreensível no contexto biográfico, que domina o pensamento do paciente com resistência à contra-argumentação, mas sem a certeza absoluta do delírio.",
        exemplo: "Paciente com anorexia que acredita com grande intensidade ser obesa, mesmo vendo evidências contrárias.",
        diagnostico_associado: "Transtornos Alimentares, TOC com baixo insight, Hipocondria, Personalidade Paranoide",
      },
    ],
    pearls: [
      "Delírio primário emerge sem substrato compreensível — não deriva de humor nem de contexto biográfico; delírio secundário (sintomático) deriva de outro estado mental (delírio de culpa na depressão, de grandiosidade na mania) — a distinção tem implicações terapêuticas.",
      "Os 6 sintomas de 1ª ordem de Schneider (vozes comentadoras/dialogantes, eco do pensamento, inserção/roubo/difusão do pensamento, experiências de influência da vontade/afeto/movimentos) têm alta especificidade para esquizofrenia mas não são patognomônicos — ocorrem em 10–15% dos casos de mania grave.",
      "Delírio vs. crença cultural: avaliar o contexto sócio-cultural — crenças religiosas ou espirituais compartilhadas pela comunidade do paciente não são delírios. A rigidez, o isolamento social e o sofrimento causado pela crença orientam o diagnóstico.",
      "Ideias obsessivas são egodistônicas (o paciente luta contra elas) — diferentemente dos delírios (egossintônicos, vividos como verdade) e das preocupações comuns (egossintônicas e proporcionais ao contexto).",
      "Síndrome de Capgras (delírio de que pessoa próxima foi substituída por um impostor idêntico) tem associação frequente com demências e lesões do hemisfério direito — sempre considerar investigação orgânica.",
    ],
    referencia:
      "Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 201–240.",
  },

  // ─── 4. ALTERAÇÕES DO HUMOR E AFETO ─────────────────────────────────────────
  {
    id: "humor-afeto",
    titulo: "Alterações do Humor e Afeto",
    categoria: "humor-afeto",
    plano: "free",
    resumo:
      "Humor é o estado emocional de base, sustentado e pervasivo, que colore toda a experiência subjetiva. Afeto é a expressão observável e momentânea do estado emocional. Suas alterações — depressão, euforia, disforia, embotamento, labilidade — têm implicações diagnósticas e terapêuticas centrais na psiquiatria.",
    conteudo:
      "A distinção entre **humor** e **afeto** é fundamental na semiologia: o humor é como o clima (persistente, de fundo, relatado pelo próprio paciente), enquanto o afeto é como o tempo (observável pelo examinador, expressão momentânea das emoções).\n\nA **depressão** como alteração do humor vai além da tristeza circunstancial — é um rebaixamento persistente, pervasivo, que compromete a vivência de prazer (anedonia), a perspectiva de futuro e frequentemente acompanha-se de desesperança, baixa autoestima e ideação suicida. A qualidade depressiva melancólica tem especificidade biológica e histórica: piora matutina com despertar precoce, anedonia profunda mesmo para situações anteriormente prazerosas, e características psicomotoras marcantes.\n\nA **euforia** patológica é uma elevação do humor desproporcionada ao contexto, acompanhada de grandiosidade, redução da necessidade de sono, loquacidade e comportamentos de risco. Distingue-se da alegria normal pela desconexão com a realidade e pelo impacto funcional. A **hipomania** é uma euforia de menor intensidade (não causa hospitalização nem psicose), mas ainda representa desvio do funcionamento habitual.\n\nA **disforia** é um estado de humor desagradável misto — irritabilidade, tensão interior, agressividade latente, com elementos de ansiedade e depressão. Não é sinônimo de tristeza: o paciente disfórico frequentemente parece mais irritadiço ou explosivo do que triste. É central na mania mista, no TEPT, no TPB e na abstinência de substâncias.\n\nO **embotamento afetivo** (afeto plano ou embotado) refere-se à redução ou ausência da expressividade emocional — o paciente fala de temas de grande carga afetiva (morte de familiar, perseguição) com voz monótona, face inexpressiva e linguagem corporal ausente. É um sintoma negativo central da esquizofrenia e um marcador de pior prognóstico. Difere da anestesia afetiva (incapacidade de sentir qualquer emoção) e da alexitimia (dificuldade de identificar e descrever emoções).\n\nA **labilidade afetiva** é a alternância rápida e imprevisível do estado afetivo, frequentemente desproporcional ao estímulo, sem retorno à linha de base — o paciente passa do riso ao choro em segundos. Difere da reatividade afetiva normal e é característica do TPB, lesões do lobo frontal, esclerose múltipla, demências (especialmente com incontinência afetiva) e estados mistos bipolares.",
    fenomenos: [
      {
        nome: "Depressão patológica",
        definicao:
          "Estado de humor rebaixado, pervasivo e persistente, com perda de investimento libidinal no mundo, anedonia e coloração negativa de todas as experiências.",
        diagnostico_associado: "EDM, Distimia, TB fase depressiva",
      },
      {
        nome: "Euforia",
        definicao:
          "Elevação do humor acima do basal, com grandiosidade, desinibição, sensação de bem-estar intenso e energia aumentada, desproporcionais ao contexto.",
        diagnostico_associado: "Mania, Hipomania, intoxicação por estimulantes",
      },
      {
        nome: "Disforia",
        definicao:
          "Estado de humor desagradável com irritabilidade, tensão interna, inquietação e tendência à explosividade. Não é tristeza pura — tem componente de raiva e agitação.",
        diagnostico_associado: "Mania mista, TPB, TEPT, abstinência de opioide",
      },
      {
        nome: "Embotamento afetivo",
        definicao:
          "Redução acentuada ou ausência da expressividade emocional — voz monótona, face inexpressiva, postura rígida — independentemente do estado emocional interno.",
        diagnostico_associado: "Esquizofrenia (sintoma negativo), Depressão grave, uso de antipsicóticos (parkinsonismo)",
      },
      {
        nome: "Labilidade afetiva",
        definicao:
          "Oscilação rápida, imprevisível e muitas vezes desproporcional do afeto expresso, com transições abruptas entre estados emocionais distintos.",
        diagnostico_associado: "TPB, Mania mista, Demência (incontinência afetiva), Lesão frontal",
      },
      {
        nome: "Anedonia",
        definicao:
          "Incapacidade de sentir prazer em atividades anteriormente prazerosas. Pode ser física (falta de prazer sensorial) ou social (falta de prazer no contato interpessoal).",
        diagnostico_associado: "EDM (critério A), Esquizofrenia (sintoma negativo), uso crônico de opioide",
      },
      {
        nome: "Alexitimia",
        definicao:
          "Dificuldade persistente em identificar, nomear e descrever emoções próprias. Frequentemente acompanhada de pensamento operatório e pobres representações de fantasia.",
        diagnostico_associado: "Transtornos Alimentares, Transtornos Somáticos, Alexitimia primária",
      },
    ],
    pearls: [
      "Embotamento afetivo vs. embotamento por antipsicótico: o parkinsonismo medicamentoso pode mimetizar o embotamento esquizofrênico — avaliar outros sinais extrapiramidais (rigidez, bradicinesia, tremor) e correlacionar com o início do uso da medicação.",
      "Disforia não é equivalente de depressão — o paciente disfórico muitas vezes parece mais irritado, explosivo ou agitado do que triste. Essa distinção é fundamental na avaliação de mania mista e TPB.",
      "Incontinência afetiva (riso ou choro desproporcionais e incontroláveis) é sinal neurológico de síndrome pseudobulbar — ocorre em AVC bilateral, ELA, esclerose múltipla e outros. Difere da labilidade afetiva psiquiátrica pela ausência de correspondência subjetiva com o afeto expresso.",
      "Anedonia física e social têm vias neurobiológicas distintas — a anedonia social (prejuízo no prazer interpessoal) é mais específica para esquizofrenia; a anedonia física (prazer hedônico sensorial) é mais central na depressão.",
      "Na avaliação do humor, sempre perguntar sobre ideação suicida diretamente — a ideia de que perguntar sugere suicídio ao paciente é um mito; pelo contrário, a pergunta direta transmite escuta e abre caminho para discussão segura.",
    ],
    referencia:
      "Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 109–130.",
  },

  // ─── 5. SINTOMAS POSITIVOS VS. NEGATIVOS DA PSICOSE ─────────────────────────
  {
    id: "positivos-negativos-psicose",
    titulo: "Sintomas Positivos vs. Negativos da Psicose",
    categoria: "pensamento-conteudo",
    plano: "free",
    resumo:
      "A dimensionalidade positiva-negativa da psicose organiza os sintomas da esquizofrenia em dois polos com bases neurobiológicas, perfis clínicos e respostas terapêuticas distintos. Sintomas positivos refletem excesso de função (alucinações, delírios, desorganização) enquanto negativos refletem deficit de função (abulia, alogia, embotamento).",
    conteudo:
      "A distinção entre sintomas positivos e negativos da esquizofrenia foi sistematizada por Crow (1980) e permanece clinicamente útil mesmo com a adoção do modelo pentadimensional (positivo, negativo, desorganizado, cognitivo, depressivo).\n\n**Sintomas positivos** representam excessos ou distorções das funções normais. Os principais são alucinações (percepções sem objeto), delírios (crenças falsas irredutíveis), discurso desorganizado e comportamento grosseiramente desorganizado. Respondem bem aos antipsicóticos, têm início mais agudo e marcam os episódios de agudização. São o que tipicamente leva o paciente ao pronto-socorro.\n\n**Sintomas negativos** representam redução ou ausência de funções normais. O acrônimo **5As** organiza os sintomas negativos primários:\n- **Afeto embotado**: redução da expressividade emocional (facial, vocal, gestual)\n- **Alogia**: empobrecimento do discurso em quantidade e conteúdo\n- **Abulia**: redução da motivação e iniciativa para atividades dirigidas a objetivos\n- **Anedonia**: incapacidade de antecipar ou experimentar prazer\n- **Associabilidade** (associabilidade/associalidade): desinteresse pelo contato social\n\nSintomas negativos primários são inerentes à esquizofrenia; secundários derivam de outras causas: depressão comórbida, parkinsonismo por antipsicóticos (pseudossintomas negativos), privação ambiental institucional, sintomas positivos não tratados causando retirada social.\n\nA distinção entre primário e secundário tem impacto terapêutico: os secundários podem melhorar tratando a causa (ajuste do antipsicótico, tratar depressão). Os primários respondem marginalmente aos medicamentos disponíveis.\n\nA dimensão **cognitiva** da esquizofrenia — memória de trabalho, velocidade de processamento, funções executivas, atenção e aprendizagem verbal — é identificada separadamente e é o principal determinante do prognóstico funcional a longo prazo, mesmo que esteja ausente dos critérios diagnósticos formais do DSM-5-TR.",
    fenomenos: [
      {
        nome: "Alogia",
        definicao:
          "Empobrecimento do discurso em quantidade (brevidade das respostas, monossilabismo) e conteúdo (respostas vagas, sem substância). Reflete pobreza do pensamento subjacente.",
        exemplo: "Pergunta: \"O que você tem feito?\" Resposta: \"Nada.\" [silêncio] Pergunta: \"Sai de casa?\" Resposta: \"Às vezes.\"",
        diagnostico_associado: "Esquizofrenia (sintoma negativo primário), Depressão grave",
      },
      {
        nome: "Abulia",
        definicao:
          "Redução acentuada da motivação e iniciativa para iniciar e manter atividades dirigidas a objetivos — o paciente não quer fazer nada, fica horas sem atividade mesmo quando exteriormente capaz.",
        diagnostico_associado: "Esquizofrenia (sintoma negativo), Depressão, Lesão frontal",
      },
      {
        nome: "Associalidade",
        definicao:
          "Desinteresse pelo contato e relações sociais, com preferência pelo isolamento. Difere da introversão normal pela pervasividade e do isolamento por medo social.",
        diagnostico_associado: "Esquizofrenia (sintoma negativo), Personalidade Esquizoide/Esquizotípica",
      },
      {
        nome: "Comportamento desorganizado",
        definicao:
          "Dificuldade em manter comportamentos dirigidos a objetivos — atividades do cotidiano (banho, alimentação, vestuário) são realizadas de forma fragmentada, bizarra ou não concluídas.",
        diagnostico_associado: "Esquizofrenia (sintoma positivo de desorganização), Delirium",
      },
      {
        nome: "Déficit cognitivo",
        definicao:
          "Comprometimento de memória de trabalho, atenção sustentada, velocidade de processamento, funções executivas e aprendizagem verbal — presente premórbido, piora na fase ativa e não retorna completamente à linha de base.",
        diagnostico_associado: "Esquizofrenia (dimensão cognitiva), TEPT",
      },
    ],
    pearls: [
      "Sintomas negativos são o principal determinante do prognóstico funcional na esquizofrenia — muito mais do que sintomas positivos. Um paciente com sintomas positivos controlados mas negativos intensos permanece severamente prejudicado funcionalmente.",
      "Pseudossintomas negativos (secundários a antipsicóticos) podem ser confundidos com doença primária: rigidez facial por parkinsonismo, sonolência e acatisia com retirada social. Avalie sempre sinais extrapiramidais antes de atribuir sintomas negativos à doença.",
      "Nenhum antipsicótico aprovado tem eficácia robusta para sintomas negativos primários — cariprazina e brexpiprazol têm as melhores evidências disponíveis. Antidepressivos adjuvantes podem ajudar sintomas negativos secundários à depressão.",
      "A presença de sintomas negativos proeminentes no primeiro episódio psicótico é fator de pior prognóstico e maior resistência ao tratamento.",
      "Sintomas cognitivos da esquizofrenia precedem a psicose — frequentemente presentes na fase pré-mórbida e no pródromo, com queda do desempenho acadêmico antes do primeiro episódio.",
    ],
    referencia:
      "Tandon R, et al. Schizophrenia, \"Just the Facts\". Schizophr Res. 2009;110(1-3):1-23. / Andreasen NC. The Scale for the Assessment of Negative Symptoms. Iowa City: University of Iowa; 1984.",
  },

  // ─── 6. ALTERAÇÕES DA CONSCIÊNCIA ────────────────────────────────────────────
  {
    id: "alteracoes-consciencia",
    titulo: "Alterações da Consciência",
    categoria: "consciencia",
    plano: "free",
    resumo:
      "A consciência envolve dois componentes: nível (vigília — arousal) e conteúdo (cognição e experiência subjetiva). Suas alterações vão da obnubilação ao coma (redução do nível) e dos estados dissociativos e confusionais (alteração do conteúdo), com etiologias orgânicas e funcionais distintas.",
    conteudo:
      "A avaliação do nível de consciência é o passo inicial de toda avaliação psiquiátrica de urgência — alteração da consciência aponta para causa orgânica até prova em contrário.\n\n**Nível de consciência — escala crescente de rebaixamento:**\n- **Vigília normal**: resposta adequada a estímulos do ambiente\n- **Obnubilação (sonolência)**: resposta lentificada, atenção reduzida, dificuldade de manter-se acordado; responde a estímulo verbal\n- **Torpor (estupor não catatônico)**: desperta apenas a estímulos intensos (dor, voz alta); movimentos são lentos e pouco elaborados. Nota: o termo \"estupor\" tem dois usos — em neurologia, refere-se ao rebaixamento profundo; em psiquiatria clássica, pode referir-se ao estupor catatônico (imobilidade com consciência preservada)\n- **Coma**: não desperta a nenhum estímulo; reflexos progressivamente abolidos\n\n**Delirium (síndrome confusional aguda)**: o transtorno da consciência por excelência na interface psiquiatria-medicina. Caracteriza-se por distúrbio da atenção e da orientação, início agudo com curso flutuante, distúrbio cognitivo adicional, e evidência ou suspeita de causa médica. É subdiagnosticado (50% dos casos não reconhecidos), especialmente a forma hipoativa (paciente quieto, apagado). Marcadores de alerta: flutuação dos sintomas ao longo do dia, piora noturna, desorientação, alucinações visuais e táteis.\n\n**Estados dissociativos**: alteração do conteúdo da consciência sem rebaixamento do nível. Incluem amnésia dissociativa (perda de memória autobiográfica sem causa orgânica), fuga dissociativa (abandono da identidade anterior com nova identidade), despersonalização/desrealização (sensação de estranhamento do self e do mundo), e estados de transe. O denominador comum é a compartimentalização da experiência consciente.\n\n**Estreitamento da consciência**: redução do campo atencional com foco excessivo em determinado conteúdo — característico de estados hipnóticos, estados crepusculares epilépticos e fugas dissociativas. O paciente pode parecer vigil mas com alcance cognitivo severamente reduzido.",
    fenomenos: [
      {
        nome: "Delirium hiperativo",
        definicao:
          "Delirium com agitação, agressividade, tentativas de retirar dispositivos, hiperatividade autonômica. Mais facilmente reconhecido.",
        diagnostico_associado: "Abstinência alcoólica (DT), intoxicação por anticolinérgicos, sepse",
      },
      {
        nome: "Delirium hipoativo",
        definicao:
          "Delirium com sonolência, apatia, pouca movimentação, resposta mínima — frequentemente confundido com depressão ou demência. Pior prognóstico.",
        exemplo: "Idoso internado que está \"muito quietinho\" mas desorientado e confuso ao exame.",
        diagnostico_associado: "Causas metabólicas (hiponatremia, insuficiência hepática), sedação excessiva, sepse",
      },
      {
        nome: "Obnubilação",
        definicao:
          "Rebaixamento leve da consciência com sonolência e dificuldade de manter atenção sustentada — o paciente responde a voz normal mas lentificado.",
        diagnostico_associado: "Fase inicial do delirium, intoxicações, encefalopatia metabólica leve",
      },
      {
        nome: "Estado crepuscular epiléptico",
        definicao:
          "Alteração do nível e conteúdo da consciência associada a atividade ictal — confusão, comportamentos automáticos, amnésia do episódio. Pode durar de minutos a horas.",
        diagnostico_associado: "Epilepsia do lobo temporal, estado de mal epiléptico não convulsivo",
      },
      {
        nome: "Amnésia dissociativa",
        definicao:
          "Incapacidade de recordar informações autobiográficas importantes, geralmente de natureza traumática, sem causa neurológica estrutural identificada.",
        diagnostico_associado: "Transtorno Dissociativo, TEPT",
      },
    ],
    pearls: [
      "Delirium é emergência médica — mortalidade intra-hospitalar de 10–30%. Trate a causa base; haldol baixo é útil para agitação, mas não há medicamento aprovado para reverter o delirium.",
      "NUNCA atribuir rebaixamento de consciência a causa psiquiátrica primária sem excluir causas orgânicas — a regra de ouro é: alteração da consciência = causa orgânica até prova em contrário.",
      "CAM (Confusion Assessment Method) é a ferramenta mais validada para rastreio de delirium em leitos clínicos: início agudo + flutuação + desatenção + pensamento desorganizado ou rebaixamento da consciência.",
      "Delirium hipoativo é o mais comum e o mais perigoso por ser subdiagnosticado — em idosos hospitalizados, sempre avaliar atenção sustentada (pedir para listar os meses do ano ao contrário) mesmo no paciente aparentemente tranquilo.",
      "Dissociação patológica vs. sedação: o paciente dissociativo responde normalmente a estímulos físicos simples mas parece \"ausente\" psiquicamente — nível de consciência preservado com conteúdo restrito.",
    ],
    referencia:
      "Lipowski ZJ. Delirium: Acute Confusional States. New York: Oxford University Press; 1990. / Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 79–105.",
  },

  // ─── 7. SÍNDROMES ANSIOSAS ────────────────────────────────────────────────────
  {
    id: "sindromes-ansiosas",
    titulo: "Síndromes Ansiosas",
    categoria: "humor-afeto",
    plano: "free",
    resumo:
      "Ansiedade é uma resposta adaptativa ao perigo real ou percebido, tornando-se patológica quando desproporcional, persistente e causando prejuízo funcional. As síndromes ansiosas diferem na natureza do estímulo desencadeante, na temporalidade, nos sintomas predominantes e no tratamento.",
    conteudo:
      "A ansiedade é composta de três dimensões: cognitiva (preocupação, vigilância, antecipação de perigo), somática (ativação autonômica simpática: taquicardia, sudorese, tremores, tensão muscular) e comportamental (fuga e evitação).\n\nA **ansiedade generalizada** (TAG) caracteriza-se pela preocupação crônica e excessiva sobre múltiplos domínios da vida, difícil de controlar e associada a tensão muscular, fatigabilidade e perturbação do sono. É a mais prevalente das síndromes ansiosas. Correlato neurobiológico: disfunção no circuito amígdala-córtex pré-frontal com hiperatividade do sistema noradrenérgico.\n\nAs **crises de pânico** são episódios paroxísticos de terror com pico em minutos, sintomas autonômicos intensos (palpitações, falta de ar, dor torácica) e cognições catastrofistas (\"vou morrer\", \"vou enlouquecer\"). O Transtorno do Pânico agrega às crises a preocupação antecipatória e a evitação fóbica. Modelo cognitivo: interpretação catastrófica de sensações corporais normais → medo → mais sintomas autonômicos (ciclo vicioso).\n\nAs **fobias** são medos intensos, persistentes e irracionais de objetos ou situações específicos (fobia específica), de avaliação negativa social (fobia social/TAS) ou de situações sem escapatória (agorafobia). O medo é desencadeado pelo estímulo fóbico ou pela sua antecipação, e a evitação é o mecanismo central de manutenção.\n\nO **TEPT** e o **Transtorno de Estresse Agudo** são síndromes ansiosas pós-traumáticas (abordadas separadamente em diagnósticos). A **ansiedade de separação** e a **mutismo seletivo** completam o espectro.\n\nNo plantão psiquiátrico, a distinção entre crise de pânico e síndrome coronariana aguda é crucial: ambas apresentam dor torácica, taquicardia e ansiedade intensa. ECG normal, troponina negativa e ausência de fatores de risco cardiovascular fortalecem o diagnóstico de pânico — mas ECG deve sempre ser solicitado na primeira crise.",
    fenomenos: [
      {
        nome: "Ansiedade antecipatória",
        definicao:
          "Ansiedade gerada pela antecipação de situação temida antes que ela ocorra. Pode ser mais incapacitante que a própria situação temida.",
        diagnostico_associado: "Transtorno do Pânico, Fobias, TAG",
      },
      {
        nome: "Evitação fóbica",
        definicao:
          "Comportamento de esquiva do estímulo ansioso — inicialmente alivia a ansiedade mas reforça e perpetua o medo em longo prazo.",
        diagnostico_associado: "Fobia Específica, TAS, Agorafobia, TEPT",
      },
      {
        nome: "Hipervigilância",
        definicao:
          "Estado de alerta aumentado e persistente, com escaneamento constante do ambiente em busca de ameaças. Acompanhado de resposta de sobressalto exagerada.",
        diagnostico_associado: "TEPT, TAG, Transtorno do Pânico",
      },
      {
        nome: "Resposta de sobressalto exagerada",
        definicao:
          "Reação intensa e desproporcional a estímulos súbitos (barulho, toque) — reflexo de sobressalto amplificado pelo estado de hipervigilância.",
        diagnostico_associado: "TEPT (critério E)",
      },
      {
        nome: "Ansiedade social (evitação social)",
        definicao:
          "Medo intenso e persistente de situações de avaliação ou escrutínio social, com preocupação em agir de forma humilhante ou embaraçosa.",
        diagnostico_associado: "Transtorno de Ansiedade Social (Fobia Social)",
      },
    ],
    pearls: [
      "Hierarquia de exclusão: antes de diagnosticar qualquer transtorno ansioso, excluir causa orgânica (hipertireoidismo, feocromocitoma, hipoglicemia, arritmias, consumo de cafeína, abstinência de benzodiazepínicos) — solicitar TSH, glicemia, ECG e anamnese farmacológica.",
      "Evitação é o mecanismo central de manutenção de todos os transtornos fóbicos — o tratamento psicológico de todos eles envolve exposição ao estímulo temido com prevenção da evitação.",
      "Crise de pânico em si não é um transtorno — ocorre em múltiplos transtornos mentais (TAG, TAS, TEPT, EDM) e até em pessoas sem diagnóstico. O Transtorno do Pânico requer crises recorrentes e inesperadas + mês de preocupação ou mudança comportamental.",
      "Benzodiazepínicos aliviam a ansiedade rapidamente mas mantêm e até reforçam a evitação — não são de primeira linha para ansiedade crônica. Para uso agudo em crise, são eficazes e seguros.",
      "Na fobia social grave, o prejuízo funcional pode ser tão severo quanto na esquizofrenia — evitar minimizar o diagnóstico. Impacto em emprego, relacionamentos e qualidade de vida é substancial.",
    ],
    referencia:
      "American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 215–280. / Barlow DH. Anxiety and Its Disorders. 2nd ed. New York: Guilford; 2002.",
  },

  // ─── 8. ALTERAÇÕES PSICOMOTORAS ──────────────────────────────────────────────
  {
    id: "alteracoes-psicomotoras",
    titulo: "Alterações Psicomotoras",
    categoria: "psicomotricidade",
    plano: "pro",
    resumo:
      "A psicomotricidade integra cognição, emoção e movimento. Suas alterações incluem agitação, retardo psicomotor, catatonia e sintomas extrapiramidais induzidos por medicamentos. O reconhecimento correto dessas alterações é essencial no plantão para evitar iatrogenias.",
    conteudo:
      "A **agitação psicomotora** é um dos motivos mais frequentes de consulta psiquiátrica de urgência. Caracteriza-se por atividade motora excessiva, sem propósito, acompanhada de tensão interna. Pode ser leve (inquietação, incapacidade de permanecer sentado) a grave (agressividade, comportamentos de risco). As principais causas incluem mania, esquizofrenia aguda, delirium, intoxicação por álcool ou estimulantes, abstinência de depressores, dor intratável, transtorno de personalidade em crise e demência na fase agitada.\n\nO **retardo psicomotor** é o polo oposto — lentificação do pensamento e dos movimentos, redução da iniciativa, voz baixa e monótona, latência de resposta prolongada. É característico da depressão melancólica e pode ser tão severo que o paciente não se alimenta ou hidrata adequadamente (estupor depressivo).\n\nA **catatonia** merece entrada própria (ver item 12), mas no contexto psicomotor destaca-se como síndrome com espectro que vai do mutismo e estupor ao furor catatônico. É responsiva a benzodiazepínicos e ECT — o diagnóstico precoce é vital.\n\nOs **sintomas extrapiramidais (SEP)** induzidos por antipsicóticos são complicações frequentes que podem ser confundidas com sintomas psiquiátricos:\n- **Parkinsonismo**: rigidez em roda dentada, bradicinesia, tremor de repouso, hipomimia — mimetiza depressão e sintomas negativos da esquizofrenia\n- **Acatisia**: inquietação motora intensa com necessidade subjetiva de mover-se — pode ser confundida com agitação psicótica e tem alto risco de automutilação e suicídio se não tratada\n- **Distonia aguda**: contração muscular involuntária e sustentada — crise oculogírica (olhos virados para cima), torcicolo, protrusão de língua; ocorre nas primeiras 72h após início ou aumento do antipsicótico; tratada com biperideno IM\n- **Discinesia tardia**: movimentos orofaciais involuntários (mastigação, sucção, movimentos da língua) após uso prolongado; pode ser irreversível\n\n**Acatisia**: atenção especial. O paciente com acatisia fica andando de um lado para o outro, coçando os pés, impossibilitado de sentar — frequentemente interpretado como \"piora da agitação psicótica\" e medicado com mais antipsicótico, o que piora o quadro. Tratar com propranolol 20–40 mg/dia, redução da dose do antipsicótico ou adição de anticolinérgico.",
    fenomenos: [
      {
        nome: "Agitação psicomotora",
        definicao:
          "Excesso de atividade motora sem propósito, acompanhado de tensão interna, inquietação e frequentemente perturbação do pensamento.",
        diagnostico_associado: "Mania, Esquizofrenia aguda, Delirium, intoxicação/abstinência",
      },
      {
        nome: "Retardo psicomotor",
        definicao:
          "Lentificação global do pensamento e dos movimentos — latência aumentada, voz baixa, passos lentos, expressão facial reduzida.",
        diagnostico_associado: "Depressão melancólica, Hipotireoidismo, Parkinsonismo, Catatonia",
      },
      {
        nome: "Acatisia",
        definicao:
          "Sensação subjetiva de inquietação motora intensa com necessidade compulsiva de mover-se — o paciente não consegue ficar parado. Componente subjetivo (desconforto interior) é tão importante quanto o comportamental.",
        diagnostico_associado: "Efeito adverso de antipsicóticos (qualquer geração), ISRS",
      },
      {
        nome: "Distonia aguda",
        definicao:
          "Contração muscular involuntária, sustentada e dolorosa após exposição a antipsicótico ou antiemético (metoclopramida). Pode acometer qualquer grupo muscular.",
        exemplo: "Crise oculogírica: olhos fixados involuntariamente para cima; torcicolo espasmódico agudo.",
        diagnostico_associado: "Efeito adverso agudo de antipsicóticos/metoclopramida",
      },
      {
        nome: "Discinesia tardia",
        definicao:
          "Movimentos orofaciais involuntários (mastigação, sucção, protrusão de língua, grimacing) ou movimentos coreiformes de membros após uso prolongado de bloqueadores dopaminérgicos. Pode ser irreversível.",
        diagnostico_associado: "Uso crônico de antipsicóticos típicos (haloperidol, clorpromazina)",
      },
      {
        nome: "Estereotipias",
        definicao:
          "Movimentos repetitivos, rítmicos e aparentemente sem propósito (balanço do corpo, abanar das mãos) — não são involuntários mas parecem automáticos.",
        diagnostico_associado: "TEA, Esquizofrenia crônica, Deficiência Intelectual",
      },
    ],
    pearls: [
      "ACATISIA é a confundida mais perigosa — sempre perguntar ao paciente 'você consegue ficar sentado?' antes de aumentar antipsicótico em paciente aparentemente agitado. O erro de tratar acatisia com mais antipsicótico pode precipitar automutilação e suicídio.",
      "Distonia aguda responde dramaticamente ao biperideno 5 mg IM — a resposta favorável em minutos confirma o diagnóstico. Ter biperideno sempre disponível ao iniciar ou aumentar antipsicótico.",
      "AIMS (Abnormal Involuntary Movement Scale) deve ser aplicada periodicamente em todos os pacientes em uso de antipsicóticos para rastreio de discinesia tardia — monitoramento obrigatório em prontuário.",
      "Retardo psicomotor grave com ausência de alimentação e hidratação constitui urgência psiquiátrica — avaliar internação e considerar ECT precoce se estupor depressivo.",
      "Diferença entre agitação orgânica e psiquiátrica: na orgânica (delirium) há flutuação, desorientação e alucinações visuais/táteis; na psiquiátrica (mania, psicose) há maior preservação da orientação e o paciente pode ser mais redirecionável.",
    ],
    referencia:
      "Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 241–260. / Stahl SM. Stahl's Essential Psychopharmacology. 5th ed. Cambridge University Press; 2021.",
  },

  // ─── 9. ALTERAÇÕES DA MEMÓRIA E ORIENTAÇÃO ───────────────────────────────────
  {
    id: "memoria-orientacao",
    titulo: "Alterações da Memória e Orientação",
    categoria: "memoria",
    plano: "pro",
    resumo:
      "A memória é um sistema multifuncional que abrange codificação, armazenamento e recuperação de informações. Suas alterações incluem amnésias anterógrada e retrógrada, confabulação, paramnésias e demência. A orientação — alopsíquica (tempo, espaço) e autopsíquica (identidade) — é o parâmetro mais básico do exame do estado mental.",
    conteudo:
      "A memória é classicamente dividida em sistemas que podem ser acometidos seletivamente:\n\n**Memória declarativa (explícita)**:\n- *Episódica*: eventos autobiográficos situados no tempo e espaço (\"o que eu fiz ontem\") — dependente do hipocampo\n- *Semântica*: conhecimentos gerais sobre o mundo (\"a capital do Brasil é Brasília\") — relativamente preservada nas demências iniciais\n\n**Memória não declarativa (implícita)**:\n- *Procedural*: habilidades motoras e cognitivas adquiridas (andar de bicicleta) — preservada mesmo em amnésias graves\n- *Priming*: facilitação da resposta por exposição prévia a estímulo\n\n**Memória de trabalho**: manutenção e manipulação temporária de informações para uso imediato — comprometida em TDAH, esquizofrenia e depressão.\n\n**Amnésia anterógrada**: incapacidade de formar novas memórias após o evento causal — o paciente não retém o que acabou de ocorrer. Clássica na doença de Alzheimer inicial e na Síndrome de Korsakoff. O paciente repete as mesmas perguntas em minutos.\n\n**Amnésia retrógrada**: perda de memórias estabelecidas anteriormente ao evento causal. Nas lesões hipocampais segue a lei de Ribot — memórias remotas são mais preservadas que recentes. Na Síndrome de Korsakoff, pode ser extensa.\n\n**Confabulação**: preenchimento inconsciente de lacunas de memória com informações fabricadas, sem intenção de mentir — o paciente acredita genuinamente no que narra. Marcadora da Síndrome de Korsakoff e de lesões do lobo frontal.\n\n**Paramnésias**: distorções qualitativas da memória:\n- *Déjà vu*: sensação de que um evento novo foi vivido anteriormente\n- *Jamais vu*: sensação de que um evento familiar é completamente novo\n- *Criptomnésia*: lembrar como nova uma ideia que foi vivenciada anteriormente\n\n**Orientação alopsíquica** (para o ambiente): inclui orientação temporal (dia, mês, ano, estação) e espacial (local onde está, cidade). Perturbada no delirium e nas demências.\n\n**Orientação autopsíquica** (para si mesmo): nome, idade, identidade. Quando perturbada, indica comprometimento grave — demência avançada ou estado dissociativo.",
    fenomenos: [
      {
        nome: "Amnésia anterógrada",
        definicao:
          "Incapacidade de consolidar novas memórias após o evento causal. Paciente não retém informações por mais que alguns minutos.",
        exemplo: "Paciente pergunta 3 vezes em 10 minutos o nome do médico que acabou de se apresentar.",
        diagnostico_associado: "Doença de Alzheimer, Síndrome de Korsakoff, pós-ECT, uso de benzodiazepínicos",
      },
      {
        nome: "Amnésia retrógrada",
        definicao:
          "Perda de memórias anteriores ao evento causal, com gradiente temporal favorecendo preservação relativa de memórias remotas.",
        diagnostico_associado: "TCE, AVC, Síndrome de Korsakoff, Transtorno Dissociativo",
      },
      {
        nome: "Confabulação",
        definicao:
          "Preenchimento inconsciente de lacunas mnésticas com informações inventadas ou deslocadas no tempo, sem intenção consciente de mentir.",
        exemplo: "Paciente com Korsakoff descreve em detalhes o jantar de ontem — que não ocorreu — com total convicção.",
        diagnostico_associado: "Síndrome de Korsakoff, Lesão frontal, Demência avançada",
      },
      {
        nome: "Déjà vu patológico",
        definicao:
          "Ocorrência frequente e intensa da sensação de já ter vivido o momento presente — quando persistente, pode ser fenômeno ictal.",
        diagnostico_associado: "Epilepsia do lobo temporal (aura), Ansiedade, Depersonalização",
      },
      {
        nome: "Hipermnésia",
        definicao:
          "Memória excepcionalmente vívida e intrusiva de eventos específicos, frequentemente associados a carga emocional intensa.",
        diagnostico_associado: "TEPT (memórias traumáticas), Mania (sensação de memória aprimorada)",
      },
    ],
    pearls: [
      "Mini-Exame do Estado Mental (MEEM/MMSE) e MoCA (Montreal Cognitive Assessment) são as ferramentas de rastreio de comprometimento cognitivo mais utilizadas — MMSE tem menor sensibilidade para casos leves; MoCA detecta comprometimento cognitivo leve com melhor acurácia.",
      "Memória episódica recente é a primeira a se deteriorar na Doença de Alzheimer — a preservação de memórias remotas com perda de recentes é padrão característico. Quando a memória procedural é acometida precocemente, considerar Demência com Corpos de Lewy ou DFT.",
      "Confabulação vs. mentira: o confabulante não sabe que está confabulando e acredita genuinamente na história que narra. A confabulação produtiva (espontânea, elaborada) indica lesão frontal associada; a confabulação momentânea (resposta a questões sobre lacunas) é mais comum na Korsakoff.",
      "Síndrome de Wernicke-Korsakoff: a encefalopatia de Wernicke não tratada (confusão + ataxia + oftalmoplegia) evolui para Psicose de Korsakoff em 85% dos casos — amnésia anterógrada severa com confabulação e relativa preservação de outras funções. Tiamina IV antes de qualquer glicose em paciente alcoolista confuso.",
      "Orientação temporal é perdida antes da espacial, que é perdida antes da autopsíquica — essa hierarquia orienta a gravidade do comprometimento nas demências.",
    ],
    referencia:
      "Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 261–290. / Squire LR. Memory and the hippocampus. Psychol Rev. 1992;99(2):195-231.",
  },

  // ─── 10. AVALIAÇÃO DO INSIGHT E JUÍZO CRÍTICO ────────────────────────────────
  {
    id: "insight-juizo",
    titulo: "Avaliação do Insight e Juízo Crítico",
    categoria: "insight",
    plano: "pro",
    resumo:
      "Insight é a capacidade do paciente de reconhecer que tem uma doença mental, compreender sua natureza e aceitar tratamento. Juízo crítico é a capacidade de avaliar corretamente situações e tomar decisões sensatas. Ambos são fundamentais para a adesão ao tratamento, autonomia e decisões legais.",
    conteudo:
      "O **insight** em psiquiatria é um conceito multidimensional. David (1990) propõe três dimensões: (1) reconhecimento de que se tem uma doença mental, (2) capacidade de rotular os fenômenos mentais anômalos como patológicos (sintomas), e (3) adesão ao tratamento.\n\nInsight **preservado**: paciente reconhece que está doente, que seus sintomas são manifestações da doença e que precisa de tratamento. Associado a melhor prognóstico, maior adesão e melhor qualidade de vida.\n\nInsight **parcial**: reconhece alguns aspectos da doença mas não outros — pode aceitar que \"tem algum problema\" mas atribuir as alucinações a forças reais externas.\n\nInsight **ausente** (anosognosia): nega categoricamente qualquer doença, recusa tratamento, frequentemente interpretando as tentativas de tratamento como perseguição. Prevalente na esquizofrenia (50–80%), mania aguda e demências. A anosognosia na esquizofrenia tem componente neurobiológico (hipofunção frontal) e não é simplesmente negação psicológica.\n\nEscalas de insight: SAI (Schedule for the Assessment of Insight), BCIS (Beck Cognitive Insight Scale), SUMD (Scale to Assess Unawareness of Mental Disorder).\n\nO **juízo crítico** avalia a capacidade de apreciar e avaliar corretamente situações hipotéticas ou reais e de tomar decisões coerentes e socialmente adaptadas. Pode ser testado com questões situacionais: \"O que você faria se encontrasse um envelope com endereço e dinheiro na rua?\", \"O que você faria se visse um incêndio no cinema?\"\n\nA **capacidade** (competência) para decisões de saúde — conceito legal e ético — envolve quatro componentes: (1) compreensão das informações relevantes, (2) capacidade de valorar (apreciar) as informações no contexto próprio, (3) raciocínio para ponderar opções, e (4) comunicação de uma escolha consistente. Um paciente pode ter insight ausente e ainda ter capacidade para algumas decisões.\n\n**Crítica da doença** é termo popular usado clinicamente para descrever se o paciente tem consciência de sua condição — substituir por descrição detalhada das dimensões acima para maior precisão.",
    fenomenos: [
      {
        nome: "Anosognosia",
        definicao:
          "Incapacidade neuropsicológica de reconhecer a própria doença ou déficit — não é simplesmente negação psicológica, mas pode ter substrato neurobiológico (disfunção frontal/parietal).",
        diagnostico_associado: "Esquizofrenia, Mania aguda, Demência, AVC parietal direito",
      },
      {
        nome: "Insight preservado com insight cognitivo vs. clínico",
        definicao:
          "Distinção entre saber intelectualmente que se tem uma doença (insight cognitivo) e sentir visceralmente a realidade dessa experiência (insight experiencial). Pacientes podem ter insight cognitivo sem insight clínico funcional.",
        diagnostico_associado: "Esquizofrenia em remissão parcial, TOC",
      },
      {
        nome: "Juízo crítico comprometido",
        definicao:
          "Incapacidade de avaliar adequadamente situações e tomar decisões sensatas — o paciente pode não perceber perigos reais ou tomar decisões claramente prejudiciais a si mesmo.",
        diagnostico_associado: "Mania, Esquizofrenia, Demência, Intoxicação",
      },
    ],
    pearls: [
      "Insight ausente na esquizofrenia é o maior preditor de não adesão ao tratamento e de recaídas — ter isso em mente ao planejar o tratamento: formulações de longa ação (LAI) são estratégia farmacológica de adesão; psicoeducação e entrevista motivacional são estratégias psicossociais.",
      "Insight na mania: raramente presente durante o episódio agudo — o paciente eufórico frequentemente não quer tratamento porque se sente excelente. A melhora do insight com o tratamento é um marcador clínico útil de resposta.",
      "Distinção crucial: falta de insight (anosognosia) vs. negação psicológica vs. discordância do diagnóstico. Estas três situações requerem abordagens diferentes — respectivamente: estratégias motivacionais, exploração psicodinâmica e revisão diagnóstica.",
      "Avaliação de capacidade não é tudo-ou-nada — é específica para a decisão em questão e pode ser preservada para umas decisões e não para outras. Documentar no prontuário a avaliação de cada dimensão.",
      "CURB: Compreende as informações? Valoriza no contexto pessoal? Raciocina sobre as opções? Comunica escolha consistentemente? — mnemônico simples para avaliação de capacidade à beira do leito.",
    ],
    referencia:
      "David AS. Insight and psychosis. Br J Psychiatry. 1990;156:798-808. / Dalgalarrondo P. Psicopatologia e Semiologia dos Transtornos Mentais. 3ª ed. Porto Alegre: Artmed; 2019. p. 291–310.",
  },

  // ─── 11. AVALIAÇÃO DO RISCO DE SUICÍDIO E AUTOMUTILAÇÃO ──────────────────────
  {
    id: "risco-suicidio",
    titulo: "Avaliação do Risco de Suicídio e Automutilação",
    categoria: "vontade-impulsos",
    plano: "pro",
    resumo:
      "A avaliação do risco de suicídio é competência central da psiquiatria e deve ser realizada em toda consulta com paciente em sofrimento psíquico. Envolve identificação de fatores de risco e protetores, formulação clínica do risco e tomada de decisão sobre nível de cuidado. Automutilação sem intencionalidade suicida exige abordagem específica.",
    conteudo:
      "O suicídio representa a morte de aproximadamente 800.000 pessoas por ano no mundo (OMS, 2023). No Brasil, é a 4ª causa de morte em adultos jovens. A maioria dos suicídios ocorre em pacientes com transtorno mental, sendo a depressão o diagnóstico mais frequente (60%).\n\n**Espectro suicida** (Columbia Classification):\n- *Ideação suicida passiva*: desejos de estar morto sem plano ou intenção\n- *Ideação suicida ativa sem plano*: pensamentos de se matar sem método definido\n- *Ideação suicida ativa com plano*: método definido, sem intenção imediata\n- *Intenção suicida com plano*: decisão tomada com plano definido\n- *Tentativa de suicídio interrompida/abortada*: o paciente iniciou mas não completou\n- *Tentativa de suicídio*: ato autolesivo com intenção de morrer\n\n**Fatores de risco** (mnemônico SAD PERSONS): Sexo masculino, Idade (jovens 15-35 e idosos >65), Depressão, Tentativa prévia, Etilismo/drogas, Pensamento racional comprometido (psicose), Suporte social ausente, Organização do plano, Não casado, Somatização grave. **Tentativa prévia** é o maior preditor de tentativa futura.\n\n**Fatores protetores**: suporte social e familiar, filhos pequenos, religiosidade, acesso a tratamento, ausência de meios letais, razões para viver, comprometimento com tratamento.\n\n**Automutilação não suicida** (NSSI — Non-Suicidal Self-Injury): comportamento de lesão autoinfligida (cortes, queimaduras, batidas) sem intenção de morrer. Função primária: regulação emocional (alívio de tensão interna insuportável). Prevalente no TPB e em adolescentes com desregulação emocional. Não equivale a tentativa de suicídio — mas é fator de risco para tentativas futuras e deve ser avaliada individualmente.\n\n**Instrumentos de avaliação**: Columbia Suicide Severity Rating Scale (C-SSRS) — padrão-ouro validado; SBQ-R (Suicide Behaviors Questionnaire-Revised); PHQ-9 item 9 como rastreio inicial.\n\n**Tomada de decisão**: após avaliação, classifique o risco em baixo, moderado ou alto e documente a formulação. Risco alto: internação e restrição de meios. Moderado: intensificação do acompanhamento, plano de segurança. Baixo: plano de segurança e seguimento.",
    fenomenos: [
      {
        nome: "Ideação suicida egossintônica",
        definicao:
          "Pensamentos suicidas que o paciente não vivencia como perturbadores ou conflitantes, mas como lógicos ou desejáveis — indicam maior risco.",
        diagnostico_associado: "Depressão com características psicóticas, Transtorno Delirante, Anorexia Nervosa grave",
      },
      {
        nome: "Ambivalência suicida",
        definicao:
          "Coexistência de impulso para morrer e desejo de viver — presente na maioria dos pacientes com ideação suicida. A ambivalência é clinicamente explorável e é o espaço terapêutico da entrevista motivacional.",
        diagnostico_associado: "EDM, TPB, TEPT",
      },
      {
        nome: "Automutilação não suicida (NSSI)",
        definicao:
          "Lesão autoinfligida sem intenção de morrer, geralmente com função de regulação emocional. Cortes superficiais são mais comuns.",
        exemplo: "Adolescente que faz cortes nos braços quando se sente \"explodir por dentro\" — relata alívio imediato após o corte.",
        diagnostico_associado: "TPB, adolescentes com desregulação emocional, EDM",
      },
      {
        nome: "Plano suicida organizado",
        definicao:
          "Existência de método definido, acesso ao meio, timing estabelecido e preparativos (despedidas, testamento) — marcador de alto risco iminente.",
        diagnostico_associado: "Qualquer transtorno com fase de alto risco",
      },
    ],
    pearls: [
      "Perguntar diretamente sobre suicídio NÃO aumenta o risco — ao contrário, transmite escuta genuína e abre espaço para o paciente falar. Use linguagem direta: 'Você tem pensado em se machucar ou em suicídio?'",
      "Tentativa prévia é o maior fator de risco único para tentativa futura e morte por suicídio — sempre documenta-la e avaliá-la em detalhes (método, lethalidade, intenção, arrependimento posterior).",
      "Plano de segurança é superior ao contrato de não suicídio (que tem eficácia nula e pode criar falsa sensação de segurança) — o plano de segurança identifica gatilhos, estratégias de enfrentamento, pessoas de apoio e serviços de emergência.",
      "Restrição de acesso a meios letais (especialmente armas de fogo e estoque de medicamentos) é uma das intervenções com maior evidência de redução de mortalidade por suicídio — orientar família sobre guarda segura.",
      "NSSI e suicídio compartilham fatores de risco e tratamentos, mas têm funções distintas — não minimizar a NSSI ('só quer chamar atenção') e não tratar como equivalente a tentativa de suicídio. Avaliar função e contexto de cada episódio.",
    ],
    referencia:
      "Posner K, et al. The Columbia–Suicide Severity Rating Scale. Arch Gen Psychiatry. 2011;68(12):1266-1276. / OMS. Live Life: Implementing the WHO Mental Health Action Plan. Geneva: WHO; 2021.",
  },

  // ─── 12. SÍNDROME CATATÔNICA ──────────────────────────────────────────────────
  {
    id: "catatonia",
    titulo: "Síndrome Catatônica",
    categoria: "psicomotricidade",
    plano: "pro",
    resumo:
      "Catatonia é uma síndrome neuropsiquiátrica grave caracterizada por perturbações do tônus muscular, postura, movimento e responsividade. Ocorre em múltiplos contextos (esquizofrenia, mania, depressão, causas orgânicas) e responde dramaticamente a benzodiazepínicos e ECT — o diagnóstico precoce é vital para evitar complicações fatais.",
    conteudo:
      "A catatonia foi reconhecida como especificador transnosológico no DSM-5 e pode ocorrer em esquizofrenia, TB, depressão, TEA, encefalites autoimunes (especialmente anti-NMDAR), outras causas neurológicas e metabólicas. A etiologia mais comum hoje não é a esquizofrenia mas sim causas médicas e afetivas.\n\n**Diagnóstico DSM-5**: três (ou mais) dos 12 sintomas:\n1. Estupor catatônico\n2. Catalepsia (manutenção passiva de posturas impostas)\n3. Flexibilidade cérea (waxy flexibility — resistência leve como dobrar cera)\n4. Mutismo\n5. Negativismo (resistência a instruções ou contato)\n6. Postura rígida (manutenção ativa de postura contra resistência)\n7. Maneirismos (caricaturas bizarras de comportamentos normais)\n8. Estereotipias (movimentos repetitivos sem propósito)\n9. Agitação, não influenciada por estímulos externos\n10. Caretas (grimacing)\n11. Ecolalia (repetição de palavras do examinador)\n12. Ecopraxia (imitação de movimentos do examinador)\n\n**Catatonia maligna** (Síndrome Neuroléptica Maligna é um subtipo) = catatonia + febre + instabilidade autonômica + rabdomiólise. CPK elevada, leucocitose. Mortalidade de 10–30% se não tratada. A SNM é uma catatonia maligna induzida por antipsicóticos.\n\n**Diagnóstico diferencial com SNM**:\n- Em ambos: rigidez, hipertermia, alteração da consciência, instabilidade autonômica\n- SNM: induzida por antipsicótico (início ou aumento de dose) ou retirada de dopaminérgicos\n- Catatonia idiopática: não necessariamente associada a antipsicótico; BZD resolve; antipsicótico piora\n\n**Teste terapêutico com lorazepam** (1–2 mg IV ou IM): resolução parcial ou completa em 30–60 minutos apoia o diagnóstico e indica uso contínuo de BZD. A resposta dramática ao lorazepam é quase diagnóstica.\n\n**Escala de Bush-Francis Catatonia Rating Scale (BFCRS)**: padrão-ouro para diagnóstico e monitoramento — screening de 14 itens com pontuação ≥2 positivo para catatonia.\n\n**ECT** é o tratamento de segunda linha após falha de BZD e de primeira linha na catatonia maligna — altamente eficaz e pode ser salvador de vida.",
    fenomenos: [
      {
        nome: "Catalepsia",
        definicao:
          "Manutenção passiva de posturas impostas pelo examinador por período prolongado (minutos a horas), sem resistência e sem aparente desconforto subjetivo.",
        exemplo: "Examinador eleva o braço do paciente a 90° — paciente mantém a posição por 5 minutos sem questionar.",
        diagnostico_associado: "Catatonia (qualquer etiologia)",
      },
      {
        nome: "Flexibilidade cérea (waxy flexibility)",
        definicao:
          "Resistência leve e uniforme à movimentação passiva dos membros, semelhante à consistência de cera — o membro cede mas oferece resistência constante ao longo de todo o arco de movimento.",
        diagnostico_associado: "Catatonia, Esquizofrenia com catatonia",
      },
      {
        nome: "Negativismo catatônico",
        definicao:
          "Resistência ativa a todas as tentativas de contato, instrução ou movimento — sem motivação aparente. Contrário ao que se pede (gegenhalten ativo).",
        diagnostico_associado: "Catatonia, Esquizofrenia",
      },
      {
        nome: "Síndrome Neuroléptica Maligna (SNM)",
        definicao:
          "Catatonia maligna induzida por bloqueio dopaminérgico. Tétrade: hipertermia (>38°C), rigidez muscular grave, alteração da consciência, instabilidade autonômica. CPK >1000 U/L.",
        diagnostico_associado: "Uso ou aumento de antipsicóticos (especialmente típicos), retirada de agonistas dopaminérgicos",
      },
      {
        nome: "Estupor catatônico",
        definicao:
          "Imobilidade marcada, ausência de atividade espontânea e redução extrema da responsividade ao ambiente — com consciência frequentemente preservada internamente.",
        diagnostico_associado: "Catatonia (qualquer etiologia), especialmente encefalites autoimunes",
      },
      {
        nome: "Furor catatônico",
        definicao:
          "Agitação psicomotora intensa, impulsiva e não direcionada que pode ocorrer subitamente no contexto de catatonia — alterna com períodos de estupor.",
        diagnostico_associado: "Catatonia, Encefalite anti-NMDAR",
      },
    ],
    pearls: [
      "NUNCA dar antipsicótico como primeira escolha para agitação em paciente com catatonia suspeita — antipsicóticos podem precipitar ou agravar a catatonia, especialmente a SNM. Benzodiazepínico (lorazepam IV) é o tratamento de primeira linha.",
      "Encefalite anti-NMDAR deve ser incluída no diagnóstico diferencial de toda catatonia em mulher jovem — solicitar anticorpos anti-NMDAR em LCR/soro, especialmente se há movimentos orofaciais, disautonomia e alteração do nível de consciência.",
      "Teste de lorazepam: 1–2 mg IV/IM com reavaliação em 30 minutos usando BFCRS — melhora ≥3 pontos confirma o diagnóstico e justifica continuidade do BZD. Documente o resultado.",
      "CPK sérica deve ser colhida em todo paciente com suspeita de catatonia ou SNM — elevação indica rabdomiólise com risco de insuficiência renal. Hidratação agressiva é parte do manejo da SNM.",
      "Catatonia no TEA: pacientes autistas têm maior risco de desenvolver catatonia — muitas vezes subdiagnosticada e confundida com piora do TEA ou negativismo comportamental. Responde ao lorazepam.",
    ],
    referencia:
      "Fink M, Taylor MA. Catatonia: A Clinician's Guide to Diagnosis and Treatment. Cambridge: Cambridge University Press; 2003. / American Psychiatric Association. DSM-5-TR. Washington, DC: APA; 2022. p. 135–137.",
  },
];
