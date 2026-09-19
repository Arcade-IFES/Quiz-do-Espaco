// perguntas.js — banco de perguntas do Quiz do Espaço.
// Contrato (constituição, Princípio VI / specs/001-core-gameplay/contracts/perguntas-contract.md):
//   PERGUNTAS = [{ q, a, e, m }, ...]
//   q = enunciado (pt-BR) | a = alternativas, a[0] é sempre a correta neste arquivo
//   e = explicação mostrada após a resposta | m = assunto (usado para sortear por dificuldade)
// Edite este arquivo livremente para adicionar ou ajustar perguntas — nenhum código precisa mudar.

const PERGUNTAS = [
  // variaveis
  {
    q: "Uma variável guarda, principalmente, o quê em um programa?",
    a: [
      "Um valor que pode mudar durante a execução",
      "Um comando que o computador executa uma única vez",
      "Um arquivo salvo no disco rígido",
      "Um endereço de internet"
    ],
    e: "Variável é um espaço nomeado na memória usado para guardar um valor que pode ser lido e alterado enquanto o programa roda.",
    m: "variaveis"
  },
  {
    q: "Depois de `x = 5` e depois `x = x + 1`, qual é o valor de `x`?",
    a: ["6", "5", "1", "x + 1"],
    e: "O lado direito é calculado primeiro com o valor atual de x (5), soma 1, e o resultado (6) é guardado de volta em x.",
    m: "variaveis"
  },
  {
    q: "Qual dessas é a melhor prática ao nomear uma variável que guarda a idade de um usuário?",
    a: [
      "Usar um nome descritivo, como `idade`",
      "Usar sempre uma única letra, como `a`",
      "Usar o mesmo nome de outra variável já existente",
      "Usar um número como nome, como `1`"
    ],
    e: "Nomes descritivos tornam o código mais fácil de entender e manter, mesmo quando o resto da lógica é simples.",
    m: "variaveis"
  },

  // condicionais
  {
    q: "Para que servem as estruturas condicionais (como `se`/`senão`) em um programa?",
    a: [
      "Para o programa tomar caminhos diferentes dependendo de uma condição",
      "Para repetir um bloco de código várias vezes",
      "Para guardar vários valores em uma única variável",
      "Para definir o nome de uma função"
    ],
    e: "Condicionais testam uma expressão (verdadeira ou falsa) e escolhem qual bloco de código executar com base nesse resultado.",
    m: "condicionais"
  },
  {
    q: "Se `idade = 16`, o que o trecho `se (idade >= 18) então diz \"maior\" senão diz \"menor\"` mostra?",
    a: ["\"menor\"", "\"maior\"", "16", "nada, dá erro"],
    e: "16 não é maior ou igual a 18, então a condição é falsa e o caminho do `senão` é executado.",
    m: "condicionais"
  },
  {
    q: "O que acontece se uma condição dentro de um `se` for falsa e não existir um `senão`?",
    a: [
      "O bloco do `se` é simplesmente ignorado e o programa continua",
      "O programa trava imediatamente",
      "O bloco do `se` é executado mesmo assim",
      "A variável usada na condição é apagada"
    ],
    e: "Sem um `senão`, uma condição falsa apenas pula o bloco associado; o programa segue normalmente para a próxima instrução.",
    m: "condicionais"
  },

  // lacos
  {
    q: "Para que serve um laço de repetição (como `para` ou `enquanto`)?",
    a: [
      "Para executar um bloco de código várias vezes sem repetir o código manualmente",
      "Para guardar um único valor na memória",
      "Para decidir entre dois caminhos possíveis",
      "Para nomear uma função"
    ],
    e: "Laços repetem um bloco de instruções enquanto uma condição for verdadeira (ou por um número definido de vezes), evitando copiar e colar código.",
    m: "lacos"
  },
  {
    q: "Quantas vezes o bloco dentro de `para i de 1 até 5` é executado?",
    a: ["5 vezes", "4 vezes", "6 vezes", "Infinitas vezes"],
    e: "O laço percorre i = 1, 2, 3, 4, 5 — um total de 5 execuções do bloco.",
    m: "lacos"
  },
  {
    q: "O que é um laço infinito?",
    a: [
      "Um laço cuja condição de parada nunca se torna falsa",
      "Um laço que executa exatamente uma vez",
      "Um laço usado apenas dentro de funções",
      "Um erro de sintaxe que impede o programa de rodar"
    ],
    e: "Se a condição que deveria encerrar o laço nunca muda para falsa, o bloco se repete para sempre, travando o programa.",
    m: "lacos"
  },

  // funcoes
  {
    q: "Qual é a principal vantagem de organizar um código em funções?",
    a: [
      "Reaproveitar um bloco de lógica em vários lugares sem repetir o código",
      "Fazer o programa rodar em qualquer computador automaticamente",
      "Impedir que o programa tenha erros",
      "Guardar dados permanentemente no disco"
    ],
    e: "Uma função empacota um bloco de lógica com um nome; ela pode ser chamada quantas vezes for preciso, em vez de repetir o mesmo código.",
    m: "funcoes"
  },
  {
    q: "O que uma função pode receber para trabalhar com valores diferentes a cada chamada?",
    a: ["Parâmetros (argumentos)", "Comentários", "Variáveis globais obrigatórias", "Laços aninhados"],
    e: "Parâmetros são valores passados para a função no momento da chamada, permitindo que ela se comporte de forma diferente conforme a entrada.",
    m: "funcoes"
  },
  {
    q: "Uma função `soma(a, b)` que calcula `a + b` e devolve o resultado está fazendo o quê ao devolver esse valor?",
    a: ["Retornando (return) o resultado para quem a chamou", "Apagando as variáveis a e b", "Criando um novo laço", "Imprimindo na tela obrigatoriamente"],
    e: "`return` envia um valor de volta para o ponto onde a função foi chamada, que pode então usar esse resultado.",
    m: "funcoes"
  },

  // estruturas-de-dados
  {
    q: "Para guardar uma lista de vários números em uma única estrutura, o que é mais adequado?",
    a: ["Um vetor/lista (array)", "Uma única variável numérica", "Um comentário", "Um laço `para`"],
    e: "Um vetor (array) guarda vários valores em sequência, acessíveis por posição (índice), diferente de uma variável simples que guarda um único valor.",
    m: "estruturas-de-dados"
  },
  {
    q: "Em um vetor `[10, 20, 30]`, qual é o valor no índice 0 (considerando que a contagem começa em 0)?",
    a: ["10", "20", "30", "Não existe índice 0"],
    e: "Na maioria das linguagens, a indexação começa em 0, então o índice 0 aponta para o primeiro elemento, 10.",
    m: "estruturas-de-dados"
  },
  {
    q: "O que diferencia um vetor (array) de um dicionário/mapa (chave-valor)?",
    a: [
      "O vetor acessa itens por posição numérica; o dicionário acessa por uma chave (nome)",
      "O vetor só pode guardar texto; o dicionário só números",
      "O dicionário não pode ter mais de um item",
      "Não há diferença, são a mesma coisa"
    ],
    e: "Um vetor usa índices numéricos (0, 1, 2, ...); um dicionário/mapa associa cada valor a uma chave escolhida (como um nome), não a uma posição fixa.",
    m: "estruturas-de-dados"
  }
];
