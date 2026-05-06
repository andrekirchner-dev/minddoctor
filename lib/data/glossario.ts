export type CategoriaGlossario =
  | "percepcao"
  | "pensamento"
  | "humor"
  | "consciencia"
  | "memoria"
  | "atencao"
  | "psicomotricidade"
  | "vontade"
  | "linguagem";

export interface TermoGlossario {
  id: string;
  termo: string;
  categoria: CategoriaGlossario;
  definicao: string;
  exemplo?: string;
  sinonimos?: string[];
  relevancia: "alta" | "media";
}

export const glossario: TermoGlossario[] = [
  // ─── PERCEPÇÃO ───────────────────────────────────────────────────────────────
  {
    id: "alucinacao",
    termo: "Alucinação",
    categoria: "percepcao",
    definicao:
      "Percepção sem objeto correspondente no mundo externo, vivida pelo paciente com a mesma qualidade de realidade que uma percepção genuína. Ocorre no espaço objetivo (projetada para fora), sem necessidade de estímulo externo. Pode acometer qualquer modalidade sensorial, sendo as auditivas as mais frequentes nas psicoses funcionais.",
    exemplo: "\"Eu ouço vozes que falam comigo — elas estão aqui agora, não são pensamentos meus.\"",
    sinonimos: ["alucinação verdadeira"],
    relevancia: "alta",
  },
  {
    id: "pseudoalucinacao",
    termo: "Pseudoalucinação",
    categoria: "percepcao",
    definicao:
      "Percepção sem objeto externo, vivida no espaço subjetivo interno (dentro da cabeça, não projetada para fora), com caráter involuntário mas com crítica preservada — o paciente reconhece que não é uma percepção real. Difere da alucinação pela localização interna e pelo insight parcial. Frequente em transtornos dissociativos e na esquizofrenia.",
    exemplo: "\"Ouço uma voz dentro da minha cabeça, sei que não é real, mas ela fica repetindo meu nome.\"",
    relevancia: "alta",
  },
  {
    id: "ilusao",
    termo: "Ilusão",
    categoria: "percepcao",
    definicao:
      "Percepção distorcida ou deformada de um estímulo real presente. Há um objeto externo concreto, mas é percebido de forma errônea ou transformada. Pode ocorrer em estados fisiológicos (cansaço, febre), emocionais intensos ou psicopatológicos. Distingue-se da alucinação por exigir um estímulo real como ponto de partida.",
    exemplo: "Paciente interpreta a sombra de uma cortina como a silhueta de um intruso no quarto.",
    sinonimos: ["percepção ilusória"],
    relevancia: "alta",
  },
  {
    id: "alucinose",
    termo: "Alucinose",
    categoria: "percepcao",
    definicao:
      "Alucinação com crítica preservada — o paciente percebe o fenômeno como anormal e não real, mesmo sem conseguir controlá-lo. Típica de etiologias orgânicas (alucinose alcoólica, lesões do tronco encefálico, epilepsia do lobo temporal). A crítica intacta é o elemento diferenciador da alucinação verdadeira.",
    exemplo: "\"Eu vejo pessoas pequenas na parede, mas sei que não estão de verdade lá.\"",
    sinonimos: ["alucinação com crítica"],
    relevancia: "alta",
  },

  // ─── PENSAMENTO ──────────────────────────────────────────────────────────────
  {
    id: "delirio",
    termo: "Delírio",
    categoria: "pensamento",
    definicao:
      "Convicção falsa, irredutível à argumentação lógica e incongruente com o contexto sociocultural do indivíduo. O conteúdo é mantido com certeza absoluta, apesar de evidências contrárias. Representa uma alteração formal do juízo de realidade e é o sintoma nuclear das psicoses. Classifica-se pelo conteúdo (perseguição, grandiosidade, ciúme, referência etc.) e pela estrutura (sistematizado ou não).",
    exemplo: "\"Tenho certeza que estão me monitorando pelo satélite — vejo nos sinais da TV, nas matrículas dos carros.\"",
    sinonimos: ["ideia delirante", "ideia fixa"],
    relevancia: "alta",
  },
  {
    id: "ideia-sobrevalorizada",
    termo: "Ideia Sobrevalorizada",
    categoria: "pensamento",
    definicao:
      "Ideia que ocupa lugar desproporcional na vida mental do indivíduo, a qual ele se dedica com grande carga afetiva e que interfere significativamente em sua vida, embora mantenha algum grau de crítica e a ideia não seja completamente irredutível à argumentação. Situa-se entre a ideia obsessiva e o delírio. Frequente em transtornos de personalidade paranoide e na hipocondria.",
    exemplo: "Paciente que dedica toda sua energia a provar que foi injustiçado no trabalho, sem abertura para outras perspectivas, mas reconhece que pode estar exagerando.",
    relevancia: "alta",
  },
  {
    id: "ideia-obsessiva",
    termo: "Ideia Obsessiva",
    categoria: "pensamento",
    definicao:
      "Pensamento, impulso ou imagem recorrente e persistente que irrompe involuntariamente na consciência, é reconhecido como produto da própria mente (ego-distônico), gera sofrimento intenso e é de difícil controle voluntário. Diferencia-se do delírio pela crítica preservada e do pensamento sobrevalorizado pela natureza egodistônica. É o sintoma central do TOC.",
    exemplo: "\"Fico pensando que posso ter contaminado minha família — sei que é absurdo, mas não consigo parar.\"",
    sinonimos: ["obsessão"],
    relevancia: "alta",
  },
  {
    id: "pensamento-magico",
    termo: "Pensamento Mágico",
    categoria: "pensamento",
    definicao:
      "Crença de que pensamentos, palavras ou ações podem influenciar causalmente eventos externos sem mecanismo físico plausível. Presente normalmente no desenvolvimento infantil, em culturas específicas e em estados criativos; torna-se patológico quando rígido, perturbador e descontextualizado. Frequente no TOC (como obsessão), na esquizofrenia e nos transtornos de personalidade esquizotípico.",
    exemplo: "\"Se eu pensar em acidente enquanto alguém da minha família estiver na rua, algo ruim vai acontecer com eles.\"",
    relevancia: "media",
  },
  {
    id: "pensamento-concreto",
    termo: "Pensamento Concreto",
    categoria: "pensamento",
    definicao:
      "Incapacidade de operar no nível abstrato, com predomínio do pensamento literal e dificuldade em compreender metáforas, provérbios e conceitos abstratos. Sinal de disfunção cognitiva ou de desorganização do pensamento. Frequente na esquizofrenia, deficiência intelectual e quadros demenciais.",
    exemplo: "Ao ser perguntado sobre o significado de 'pedra no sapato', o paciente responde: 'Uma pedra pequena que entra no sapato e machuca o pé.'",
    relevancia: "alta",
  },
  {
    id: "neologismo",
    termo: "Neologismo",
    categoria: "pensamento",
    definicao:
      "Criação de novas palavras com significado idiossincrático ou uso de palavras existentes com sentido completamente novo e privado, incompreensível para os ouvintes. Sinal de grave desorganização formal do pensamento, altamente sugestivo de esquizofrenia. Distingue-se do jargão afásico pela ausência de lesão neurológica estrutural.",
    exemplo: "\"Preciso que você traga o flumentrasso para que o cérebro se desengrenhe.\"",
    relevancia: "alta",
  },
  {
    id: "fuga-de-ideias",
    termo: "Fuga de Ideias",
    categoria: "pensamento",
    definicao:
      "Aceleração marcante do fluxo do pensamento com sequência rápida de associações, geralmente com alguma conexão perceptível (rima, som, associação superficial), mas sem aprofundamento de nenhum tema. A velocidade é tão elevada que o discurso torna-se difícil de acompanhar. Sintoma cardinal da mania e da hipomania.",
    exemplo: "\"Hoje está sol, sol na janela, janela de oportunidades, oportunidades são para os corajosos, os corajosos ganham batalhas...\" (sem pausas, rapidamente).",
    sinonimos: ["taquipsiquismo do pensamento", "ideorreia"],
    relevancia: "alta",
  },
  {
    id: "bradipsiquismo",
    termo: "Bradipsiquismo",
    categoria: "pensamento",
    definicao:
      "Lentificação do fluxo e curso do pensamento, com redução da velocidade de elaboração das ideias, aumento das latências de resposta e empobrecimento do conteúdo. O paciente experimenta o pensamento como pesado, difícil e devagar. Sintoma cardinal da depressão maior, presente também em hipotireoidismo e quadros demenciais.",
    exemplo: "\"Não consigo pensar direito... as ideias demoram muito para vir... é como nadar em cimento.\"",
    sinonimos: ["lentificação do pensamento", "inibição do pensamento"],
    relevancia: "alta",
  },
  {
    id: "taquipsiquismo",
    termo: "Taquipsiquismo",
    categoria: "pensamento",
    definicao:
      "Aceleração do curso do pensamento, com aumento da velocidade de elaboração das ideias e da quantidade de associações. Em graus moderados manifesta-se como pensamento produtivo e criativo; em graus intensos culmina em fuga de ideias. Presente na mania, hipomania, intoxicação por estimulantes e ansiedade intensa.",
    exemplo: "\"Minha cabeça não para — tenho mil ideias ao mesmo tempo e mal consigo acompanhá-las todas.\"",
    sinonimos: ["aceleração do pensamento"],
    relevancia: "alta",
  },
  {
    id: "bloqueio-pensamento",
    termo: "Bloqueio do Pensamento",
    categoria: "pensamento",
    definicao:
      "Interrupção súbita e involuntária do curso do pensamento, vivenciada como se as ideias fossem 'roubadas' ou 'apagadas'. O paciente para abruptamente no meio de uma frase e fica em silêncio, sem conseguir retomar o fio do raciocínio. Sinal de Schneider de primeiro escalão; altamente sugestivo de esquizofrenia quando presente.",
    exemplo: "\"Eu estava dizendo que... [pausa longa e perplexa]... desculpe, sumiram todos os meus pensamentos.\"",
    sinonimos: ["interceptação do pensamento", "pensamento bloqueado"],
    relevancia: "alta",
  },
  {
    id: "circunstancialidade",
    termo: "Circunstancialidade",
    categoria: "pensamento",
    definicao:
      "Perturbação do curso do pensamento caracterizada por discurso prolixo, com excessivos detalhes e digressões, mas que, ao final, retorna ao tema principal. O objetivo comunicativo é atingido, embora de forma muito demorada e ineficiente. Frequente em transtorno de ansiedade, personalidade obsessiva, mania leve e epilepsia do lobo temporal.",
    exemplo: "Perguntado sobre a hora que dormiu, o paciente narra toda a rotina da noite com detalhes minuciosos antes de informar o horário.",
    sinonimos: ["pensamento circunstancial"],
    relevancia: "alta",
  },
  {
    id: "tangencialidade",
    termo: "Tangencialidade",
    categoria: "pensamento",
    definicao:
      "Perturbação do curso do pensamento em que o paciente responde às perguntas de forma oblíqua ou irrelevante, sem jamais atingir o objetivo comunicativo original. Diferencia-se da circunstancialidade pela ausência de retorno ao tema central. Sinal de desorganização formal do pensamento, sugestivo de esquizofrenia ou mania grave.",
    exemplo: "Perguntado 'Como você está se sentindo?', responde: 'O governo precisa cuidar melhor das estradas, sabe? Tem muita gente que sofre...'",
    sinonimos: ["pensamento tangencial"],
    relevancia: "alta",
  },

  // ─── HUMOR ───────────────────────────────────────────────────────────────────
  {
    id: "humor-deprimido",
    termo: "Humor Deprimido",
    categoria: "humor",
    definicao:
      "Estado afetivo persistente de tristeza, vazio ou desesperança, que representa uma mudança em relação ao funcionamento habitual do indivíduo. Diferencia-se da tristeza reativa normal pela intensidade, duração, pervasividade e pelo comprometimento funcional. Sintoma cardinal do episódio depressivo maior, presente também no transtorno distímico e no episódio misto.",
    exemplo: "\"Não sinto mais nada — é como um peso no peito, um buraco vazio que não passa.\"",
    sinonimos: ["depressão do humor", "humor triste"],
    relevancia: "alta",
  },
  {
    id: "euforia",
    termo: "Euforia",
    categoria: "humor",
    definicao:
      "Estado afetivo de alegria excessiva, expansividade e elevação patológica do humor, desproporcionais ao contexto. Acompanha-se de aumento da energia, diminuição da necessidade de sono, grandiosidade e desinibição. Sintoma cardinal do episódio maníaco; pode ocorrer em intoxicação por estimulantes e lesões frontais.",
    exemplo: "\"Nunca me senti tão bem na vida! Tenho energia infinita, não preciso dormir, sou capaz de tudo!\"",
    sinonimos: ["exaltação do humor", "humor eufórico", "elação"],
    relevancia: "alta",
  },
  {
    id: "disforia",
    termo: "Disforia",
    categoria: "humor",
    definicao:
      "Estado afetivo desagradável caracterizado por irritabilidade, raiva, tensão interna e mal-estar subjetivo, distinto da tristeza pura. Frequente em episódios mistos do transtorno bipolar, no episódio depressivo com características mistas, no TEPT, na abstinência de substâncias e no transtorno disfórico pré-menstrual.",
    exemplo: "\"Estou com raiva de tudo e de todos, irritado sem motivo claro, qualquer coisa me tira do sério.\"",
    sinonimos: ["humor disfórico", "irritabilidade patológica"],
    relevancia: "alta",
  },
  {
    id: "anedonia",
    termo: "Anedonia",
    categoria: "humor",
    definicao:
      "Incapacidade ou diminuição marcante da capacidade de sentir prazer em atividades anteriormente prazerosas. Pode ser anedonia antecipatória (não consegue imaginar que algo será prazeroso) ou consumatória (não sente prazer enquanto realiza a atividade). Sintoma nuclear da depressão e do episódio depressivo bipolar; também presente como sintoma negativo na esquizofrenia.",
    exemplo: "\"Antes adorava tocar violão, ver meus filhos, sair com amigos — agora não sinto absolutamente nada com nada disso.\"",
    relevancia: "alta",
  },
  {
    id: "labilidade-afetiva",
    termo: "Labilidade Afetiva",
    categoria: "humor",
    definicao:
      "Variações rápidas, excessivas e pouco controláveis do estado afetivo, com transições abruptas de um polo ao outro (de choro ao riso, de calma à raiva intensa) sem correspondência proporcional com os estímulos externos. Frequente no transtorno bipolar, no transtorno de personalidade borderline, na demência frontal e após AVE.",
    exemplo: "Paciente que ri e chora alternadamente durante a mesma entrevista, sem controle e com mínimos estímulos.",
    sinonimos: ["instabilidade afetiva", "incontinência afetiva"],
    relevancia: "alta",
  },
  {
    id: "afeto-embotado",
    termo: "Afeto Embotado",
    categoria: "humor",
    definicao:
      "Redução marcante da amplitude e intensidade da expressão afetiva, com diminuição dos gestos, da prosódia, da expressão facial e da reatividade emocional. O paciente parece indiferente ou frio, mas pode relatar vida emocional interna presente. Sintoma negativo cardinal da esquizofrenia; diferencia-se da depressão pelo caráter persistente e pela menor subjetividade de sofrimento.",
    exemplo: "Paciente conta a morte do filho sem alteração da expressão facial, tom de voz monotônico, sem gestos.",
    sinonimos: ["embotamento afetivo", "afeto plano", "achatamento afetivo"],
    relevancia: "alta",
  },
  {
    id: "afeto-inapropriado",
    termo: "Afeto Inapropriado",
    categoria: "humor",
    definicao:
      "Incongruência entre a expressão afetiva e o contexto ou o conteúdo do pensamento — o paciente ri ao falar de tema triste, chora ao falar de algo alegre. Reflete desconexão entre cognição e afeto. Presente na esquizofrenia desorganizada e em alguns quadros neurológicos (lesões frontais, gelasmo epiléptico).",
    exemplo: "Paciente ri ao relatar a morte recente da mãe, sem aparente percepção da incongruência.",
    sinonimos: ["paratimia", "afeto incongruente"],
    relevancia: "alta",
  },
  {
    id: "alexitimia",
    termo: "Alexitimia",
    categoria: "humor",
    definicao:
      "Dificuldade em identificar, nomear e descrever os próprios estados emocionais, com tendência ao pensamento operatório (focado em fatos concretos e externos em detrimento da vida emocional interna). Associada a sintomas somáticos e transtornos psicossomáticos. Não é um diagnóstico, mas um traço ou dimensão clínica relevante.",
    exemplo: "\"Não sei se estou triste ou com raiva — só sei que tenho muita dor de cabeça e estômago ruim.\"",
    relevancia: "media",
  },

  // ─── CONSCIÊNCIA ─────────────────────────────────────────────────────────────
  {
    id: "obnubilacao",
    termo: "Obnubilação",
    categoria: "consciencia",
    definicao:
      "Rebaixamento leve a moderado do nível de consciência, com redução da clareza e lucidez da experiência, dificuldade de atenção e concentração, lentificação do pensamento e tendência ao sono, mas sem perda completa da responsividade. Representa o grau inicial do contínuo de rebaixamento da consciência. Frequente no delirium inicial, intoxicações leves e quadros metabólicos.",
    exemplo: "Paciente responde às perguntas com latência aumentada, parece 'nublado', perde o fio do raciocínio facilmente.",
    sinonimos: ["torpor leve", "obnubilação da consciência"],
    relevancia: "alta",
  },
  {
    id: "estupor",
    termo: "Estupor",
    categoria: "consciencia",
    definicao:
      "Estado de grave redução da responsividade com ausência de atividade espontânea e de linguagem, mas com preservação de respostas a estímulos intensos (dor, voz alta). O paciente parece imóvel e não responsivo, mas não está em coma. Pode ser de origem neurológica (lesão estrutural) ou psiquiátrica (estupor catatônico, estupor depressivo, estupor dissociativo).",
    exemplo: "Paciente imóvel, olhos abertos, sem resposta verbal, mas reage retirando o membro ao estímulo doloroso.",
    relevancia: "alta",
  },
  {
    id: "coma",
    termo: "Coma",
    categoria: "consciencia",
    definicao:
      "Estado de inconsciência profunda com ausência de responsividade a quaisquer estímulos externos e ausência de ciclo sono-vigília. Representa o grau máximo de rebaixamento da consciência. A escala de Glasgow é utilizada para graduar a profundidade. Sempre de origem orgânica — exige investigação neurológica e clínica urgente.",
    exemplo: "Glasgow 3: sem abertura ocular, sem resposta verbal, sem resposta motora.",
    relevancia: "alta",
  },
  {
    id: "sonambulismo",
    termo: "Sonambulismo",
    categoria: "consciencia",
    definicao:
      "Estado de consciência dissociada com ocorrência durante o sono NREM (fase 3), em que o indivíduo realiza comportamentos motores complexos (caminhar, falar, comer) com a consciência parcialmente comprometida e sem memória posterior do episódio. Benign na infância; na vida adulta pode associar-se a transtornos do sono, uso de medicações e estresse.",
    exemplo: "Criança encontrada na cozinha à noite, olhos abertos, sem reconhecer os pais, retornando ao leito sem recordação posterior.",
    sinonimos: ["parassonia NREM", "somnambulismo"],
    relevancia: "media",
  },
  {
    id: "despersonalizacao",
    termo: "Despersonalização",
    categoria: "consciencia",
    definicao:
      "Experiência de estranheza ou irrealidade em relação ao próprio self — o paciente sente-se como um observador externo de seus próprios pensamentos, sentimentos, corpo ou ações ('como se eu estivesse fora de mim'). A crítica está preservada (sabe que não é real). Pode ocorrer fisiologicamente, em privação de sono e cannabis; tornapatológica quando persistente e perturbadora.",
    exemplo: "\"Me sinto olhando a mim mesmo de fora, como se eu fosse um robô executando ações sem ser de verdade eu.\"",
    relevancia: "alta",
  },
  {
    id: "desrealizacao",
    termo: "Desrealização",
    categoria: "consciencia",
    definicao:
      "Experiência de estranheza ou irrealidade do ambiente externo — o mundo parece nebuloso, artificial, distante ou irreal ('como em um sonho'), embora o paciente mantenha o teste de realidade intacto. Frequentemente acompanha a despersonalização. Presente no transtorno de despersonalização/desrealização, ataques de pânico, TEPT, epilepsia do lobo temporal e uso de cannabis.",
    exemplo: "\"O mundo ao meu redor parece uma pintura falsa, como se eu estivesse dentro de um filme.\"",
    sinonimos: ["sentimento de irrealidade do ambiente"],
    relevancia: "alta",
  },
  {
    id: "estado-dissociativo",
    termo: "Estado Dissociativo",
    categoria: "consciencia",
    definicao:
      "Perturbação da integração normal da consciência, memória, identidade, emoção, percepção, comportamento e sentido de self, resultando em descontinuidades na experiência subjetiva. Mecanismo de defesa primário contra trauma. Manifesta-se como amnésia dissociativa, fuga dissociativa, identidade dissociativa ou estados alterados de consciência sem substrato orgânico.",
    exemplo: "Paciente relata períodos em que 'perde' horas do dia sem recordação, frequentemente após situações de estresse intenso.",
    sinonimos: ["dissociação", "estado alterado de consciência"],
    relevancia: "alta",
  },

  // ─── MEMÓRIA ─────────────────────────────────────────────────────────────────
  {
    id: "amnesia-anterograda",
    termo: "Amnésia Anterógrada",
    categoria: "memoria",
    definicao:
      "Incapacidade de formar novas memórias após o evento causador da amnésia, com preservação relativa da memória de eventos anteriores. Reflete disfunção da consolidação mnêmica (hipocampo e estruturas medianas temporais). Presente na síndrome de Korsakoff, após TCE, encefalite herpética, anóxia cerebral e uso de benzodiazepínicos.",
    exemplo: "Paciente não se lembra do que comeu no almoço ou do nome do médico que acabou de se apresentar, mas descreve detalhes de sua infância.",
    sinonimos: ["amnésia de fixação"],
    relevancia: "alta",
  },
  {
    id: "amnesia-retrograda",
    termo: "Amnésia Retrógrada",
    categoria: "memoria",
    definicao:
      "Perda de memórias anteriores ao evento causador da amnésia, geralmente com gradiente temporal (eventos mais recentes são mais afetados que os remotos — lei de Ribot). Afeta memórias episódicas mais que semânticas ou procedurais. Presente após TCE, AVE, cirurgias e estados dissociativos.",
    exemplo: "Paciente pós-TCE não reconhece a esposa e não lembra de eventos dos últimos 5 anos, mas recorda a infância.",
    sinonimos: ["amnésia de evocação"],
    relevancia: "alta",
  },
  {
    id: "paramnesia",
    termo: "Paramnésia",
    categoria: "memoria",
    definicao:
      "Distorção qualitativa da memória, com falsas recordações ou erros de reconhecimento, sem necessariamente perda quantitativa. Inclui o déjà vu (familiar que é novo), jamais vu (familiar que parece novo), cryptomnesia (lembrança como nova) e memórias-tela. Presente em epilepsia do lobo temporal, esquizofrenia e na síndrome de Capgras.",
    exemplo: "\"Tenho certeza que já estive neste lugar antes\" (déjà vu); ou \"Este lugar me parece completamente estranho\" (jamais vu).",
    sinonimos: ["distorção de memória", "falsas recordações"],
    relevancia: "media",
  },
  {
    id: "confabulacao",
    termo: "Confabulação",
    categoria: "memoria",
    definicao:
      "Preenchimento inconsciente de lacunas de memória com narrativas inventadas, relatadas pelo paciente com convicção e sem intenção de mentir. Resulta de falhas de monitoramento da fonte das memórias (lobo frontal) combinadas com amnésia. Patognomônica da síndrome de Korsakoff (encefalopatia de Wernicke-Korsakoff); presente também em demências frontais.",
    exemplo: "Paciente que não recorda o que fez ontem afirma com certeza que foi ao cinema com amigos — evento que não ocorreu.",
    relevancia: "alta",
  },

  // ─── ATENÇÃO ─────────────────────────────────────────────────────────────────
  {
    id: "hiperprosexia",
    termo: "Hiperprosexia",
    categoria: "atencao",
    definicao:
      "Aumento patológico da capacidade de fixação atencional em determinados estímulos, frequentemente com hipervigilância e hipersensibilidade a estímulos do ambiente. Pode manifestar-se como atenção seletiva exagerada a detalhes específicos ou hiperestesia sensorial. Presente em estados maníacos, paranoides e em intoxicação por estimulantes.",
    exemplo: "Paciente maníaco que percebe e comenta cada detalhe do consultório, interrompendo constantemente a entrevista.",
    sinonimos: ["atenção aumentada", "hipervigilância"],
    relevancia: "media",
  },
  {
    id: "hipoprosexia",
    termo: "Hipoprosexia",
    categoria: "atencao",
    definicao:
      "Redução da capacidade de concentração, fixação e manutenção da atenção, com dificuldade em manter o foco em tarefas e tendência à distratibilidade. Pode afetar a atenção seletiva, sustentada ou dividida. Presente na depressão, ansiedade, TDAH, delirium, esquizofrenia e quadros demenciais iniciais.",
    exemplo: "\"Não consigo mais ler um parágrafo inteiro — minha mente dispersa antes de terminar a frase.\"",
    sinonimos: ["déficit atencional", "concentração reduzida"],
    relevancia: "alta",
  },
  {
    id: "aprosexia",
    termo: "Aprosexia",
    categoria: "atencao",
    definicao:
      "Abolição ou comprometimento gravíssimo da capacidade atencional, com impossibilidade de fixar ou manter a atenção em qualquer estímulo. Representa o grau mais severo de comprometimento atencional. Presente em estados confusionais agudos graves (delirium hiperativo/misto), demências avançadas e catatonia.",
    exemplo: "Paciente em delirium agitado que não mantém contato visual por mais de 2 segundos e não responde a perguntas consecutivas.",
    sinonimos: ["abolição da atenção"],
    relevancia: "media",
  },

  // ─── PSICOMOTRICIDADE ─────────────────────────────────────────────────────────
  {
    id: "agitacao-psicomotora",
    termo: "Agitação Psicomotora",
    categoria: "psicomotricidade",
    definicao:
      "Aumento patológico e não direcionado da atividade motora, com inquietação intensa, incapacidade de permanecer parado, gesticulação excessiva e possível agressividade. Pode ter etiologia psiquiátrica (mania, psicose, transtorno de personalidade em crise) ou orgânica (delirium, intoxicação, abstinência). A avaliação da causa é fundamental para o manejo.",
    exemplo: "Paciente que caminha sem parar pelo corredor, fala alto, gesticula, não consegue sentar-se para a consulta.",
    sinonimos: ["agitação motora"],
    relevancia: "alta",
  },
  {
    id: "retardo-psicomotor",
    termo: "Retardo Psicomotor",
    categoria: "psicomotricidade",
    definicao:
      "Redução global e observável da atividade motora e do discurso, com lentificação dos movimentos, diminuição dos gestos, pausas prolongadas antes de responder e expressão facial empobrecida. Sinal objetivo e mensurável (distingue-se da lentificação subjetiva do bradipsiquismo). Sintoma cardinal da depressão melancólica; presente também em hipotireoidismo, intoxicação por sedativos e catatonia.",
    exemplo: "Paciente com latência de 15–20 segundos entre a pergunta e a resposta, movimentos lentos e deliberados, expressão facial imóvel.",
    sinonimos: ["inibição psicomotora", "lentificação psicomotora"],
    relevancia: "alta",
  },
  {
    id: "catatonia",
    termo: "Catatonia",
    categoria: "psicomotricidade",
    definicao:
      "Síndrome psicomotora caracterizada por pelo menos 3 dos seguintes: estupor, catalepsia, flexibilidade cérea, mutismo, negativismo, postura anormal, maneirismo, estereotipia, agitação, careteamento, ecolalia ou ecopraxia. Pode ser retardada ou excitada. Ocorre em transtornos mentais (afetivos, psicóticos) e causas orgânicas (encefalite anti-NMDA, encefalopatias). O lorazepam EV é o tratamento inicial.",
    exemplo: "Paciente imóvel há horas em posição de estátua, com rigidez, mutismo, que mantém qualquer posição em que o braço é colocado.",
    relevancia: "alta",
  },
  {
    id: "estereotipia",
    termo: "Estereotipia",
    categoria: "psicomotricidade",
    definicao:
      "Repetição uniforme, rítmica e sem propósito de movimentos, gestos, posturas ou falas, que não são desencadeadas por estímulos externos e persistem de forma monótona. Distingue-se do maneirismo por ser mais simples e regular. Presente na esquizofrenia crônica, autismo, deficiência intelectual grave e transtornos do movimento.",
    exemplo: "Paciente que balança o tronco para frente e para trás ininterruptamente por horas, sem responder ao ambiente.",
    sinonimos: ["movimento estereotipado"],
    relevancia: "alta",
  },
  {
    id: "maneirismo",
    termo: "Maneirismo",
    categoria: "psicomotricidade",
    definicao:
      "Execução de movimentos ou atos habituais de forma estranha, bizarra, extravagante ou exagerada — o movimento tem alguma finalidade reconhecível, mas é realizado de forma peculiar e caricata. Distingue-se da estereotipia por ter finalidade e da catatonia por ser menos rígido. Presente na esquizofrenia desorganizada e em alguns transtornos do neurodesenvolvimento.",
    exemplo: "Paciente que cumprimenta fazendo reverências elaboradas e caminha na ponta dos pés com movimentos theatrais.",
    sinonimos: ["conduta maneirosa"],
    relevancia: "alta",
  },
  {
    id: "ecolalia",
    termo: "Ecolalia",
    categoria: "psicomotricidade",
    definicao:
      "Repetição automática e involuntária das últimas palavras ou frases ditas pelo interlocutor. Pode ser imediata (repete na hora) ou retardada. Presente na catatonia, autismo, síndrome de Tourette e em alguns quadros demenciais (demência fronto-temporal).",
    exemplo: "Entrevistador: 'Como você está se sentindo?' — Paciente: 'Como você está se sentindo?'",
    relevancia: "alta",
  },
  {
    id: "ecopraxia",
    termo: "Ecopraxia",
    categoria: "psicomotricidade",
    definicao:
      "Imitação automática e involuntária dos movimentos do interlocutor, sem solicitação. Presente na catatonia, autismo, síndrome de Tourette e quadros neurológicos frontais. Frequentemente coexiste com ecolalia.",
    exemplo: "Examinador levanta o braço para saudar, e o paciente imediatamente levanta o seu próprio braço de forma idêntica.",
    relevancia: "alta",
  },
  {
    id: "negativismo",
    termo: "Negativismo",
    categoria: "psicomotricidade",
    definicao:
      "Resistência ativa ou passiva, sem motivo aparente, a qualquer solicitação ou movimento induzido externamente. No negativismo ativo o paciente faz o oposto do que é pedido; no negativismo passivo resiste sem executar ação contrária. Sinal catatônico clássico, presente também em alguns transtornos de personalidade em contexto de entrevista.",
    exemplo: "Ao ser solicitado a abrir a boca, o paciente contrai a mandíbula com força; ao ser solicitado a estender o braço, flexiona-o mais.",
    sinonimos: ["negativismo catatônico"],
    relevancia: "alta",
  },
  {
    id: "flexibilidade-cerea",
    termo: "Flexibilidade Cérea",
    categoria: "psicomotricidade",
    definicao:
      "Manutenção passiva de qualquer postura em que o membro ou o corpo é colocado pelo examinador, com resistência ligeira semelhante à da cera mole sendo moldada. O paciente mantém posições desconfortáveis por longos períodos sem protestar. Sinal patognomônico de catatonia (catalepsia).",
    exemplo: "Examinador eleva o braço do paciente a 90° — paciente mantém o braço nesta posição por vários minutos sem alterá-la.",
    sinonimos: ["catalepsia", "catalepsia catatônica"],
    relevancia: "alta",
  },

  // ─── VONTADE ─────────────────────────────────────────────────────────────────
  {
    id: "abulia",
    termo: "Abulia",
    categoria: "vontade",
    definicao:
      "Redução ou abolição da capacidade de iniciar e manter atividades e comportamentos direcionados a objetivos, com diminuição da motivação intrínseca, espontaneidade e iniciativa. Distingue-se da anedonia por ser mais ampla (afeta a vontade em geral, não apenas o prazer). Sintoma negativo proeminente da esquizofrenia; presente também na depressão grave e em lesões frontais.",
    exemplo: "\"Fico horas sentado na cadeira sem conseguir me levantar para fazer nada — nem para comer ou tomar banho.\"",
    sinonimos: ["hipobulia grave", "apatia"],
    relevancia: "alta",
  },
  {
    id: "hiperbulia",
    termo: "Hiperbulia",
    categoria: "vontade",
    definicao:
      "Aumento patológico da vontade e da determinação em alcançar objetivos específicos, com persistência excessiva, inflexibilidade e tendência a não considerar obstáculos. Frequentemente direcionada a conteúdos delirantes ou a projetos grandiosos na mania. Distingue-se da determinação saudável pela rigidez e pela desconexão com a realidade.",
    exemplo: "Paciente maníaco que passa a noite inteira executando plano de negócios, sem cansaço, certo de que será milionário.",
    sinonimos: ["vontade aumentada", "determinação patológica"],
    relevancia: "media",
  },
  {
    id: "impulsividade",
    termo: "Impulsividade",
    categoria: "vontade",
    definicao:
      "Predisposição a agir de forma rápida, sem reflexão prévia adequada sobre as consequências, em resposta a estímulos internos ou externos. Pode manifestar-se como agressividade impulsiva, comportamentos de risco, gastos excessivos, automutilação ou uso de substâncias. Presente no transtorno de personalidade borderline, TDAH, mania, transtornos do controle de impulsos e intoxicações.",
    exemplo: "Paciente que, ao sentir raiva, quebra objetos ou realiza compras impulsivas sem capacidade de frear o impulso.",
    sinonimos: ["agir sem pensar", "controle de impulsos reduzido"],
    relevancia: "alta",
  },

  // ─── LINGUAGEM ───────────────────────────────────────────────────────────────
  {
    id: "mutismo",
    termo: "Mutismo",
    categoria: "linguagem",
    definicao:
      "Ausência completa de produção verbal, com preservação da capacidade física de falar. Pode ser seletivo (em situações específicas, como no mutismo seletivo da infância) ou total. Presente na catatonia (mutismo catatônico), no estupor depressivo, no mutismo seletivo e em alguns quadros neurológicos (mutismo acinético).",
    exemplo: "Paciente que não emite nenhuma palavra durante toda a entrevista, mas comunica-se com gestos ou escrita.",
    sinonimos: ["ausência de fala"],
    relevancia: "alta",
  },
  {
    id: "logorreia",
    termo: "Logorreia",
    categoria: "linguagem",
    definicao:
      "Produção verbal aumentada, com discurso excessivo, acelerado e de difícil interrupção. Frequentemente associada à pressão para falar. Expressa o correlato linguístico do taquipsiquismo e da fuga de ideias. Sintoma característico da mania e da hipomania; pode ocorrer em intoxicação por estimulantes e em alguns estados ansiosos.",
    exemplo: "Paciente que fala ininterruptamente por 20 minutos sem conseguir ser interrompido, tratando de múltiplos temas simultaneamente.",
    sinonimos: ["pressão do discurso", "taquilalia", "verborragia"],
    relevancia: "alta",
  },
  {
    id: "afasia",
    termo: "Afasia",
    categoria: "linguagem",
    definicao:
      "Perturbação adquirida da linguagem, tanto na expressão quanto na compreensão, por lesão das áreas corticais da linguagem (área de Broca — afasia expressiva; área de Wernicke — afasia receptiva). Distingue-se dos transtornos psiquiátricos da linguagem pela presença de substrato neurológico e pela presença de parafasias, anomias e jargão afásico. Exige avaliação neurológica.",
    exemplo: "Paciente pós-AVE que compreende comandos mas só produz sílabas repetitivas ('pa-pa-pa'), sem conseguir nomear objetos.",
    sinonimos: ["distúrbio da linguagem adquirido"],
    relevancia: "alta",
  },
];
