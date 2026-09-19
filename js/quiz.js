// js/quiz.js — motor de perguntas: validacao do banco (contracts/perguntas-contract.md),
// embaralhamento das alternativas e selecao por dificuldade sem repetir a pergunta anterior
// (specs/001-core-gameplay/research.md, "Question selection").

var Quiz = (function () {
  function isAvailable() {
    return typeof PERGUNTAS !== "undefined" && Array.isArray(PERGUNTAS) && PERGUNTAS.length > 0;
  }

  function embaralhar(lista) {
    var copia = lista.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copia[i];
      copia[i] = copia[j];
      copia[j] = temp;
    }
    return copia;
  }

  // Recebe uma entrada crua de PERGUNTAS ({ q, a, e, m }) e devolve uma versao pronta para
  // exibir, com as alternativas embaralhadas e o novo indice da correta rastreado (a
  // correta e sempre a[0] no arquivo de origem, nunca apos o embaralhamento).
  function shuffleAlternatives(pergunta) {
    var ordemOriginal = pergunta.a.map(function (texto, indice) { return { texto: texto, correta: indice === 0 }; });
    var embaralhada = embaralhar(ordemOriginal);
    var indiceCorreto = embaralhada.findIndex(function (item) { return item.correta; });
    return {
      alternativas: embaralhada.map(function (item) { return item.texto; }),
      indiceCorreto: indiceCorreto
    };
  }

  function poolPorTags(tagsElegiveis) {
    if (!tagsElegiveis || tagsElegiveis.length === 0) {
      return PERGUNTAS.map(function (p, indice) { return indice; });
    }
    var indices = [];
    PERGUNTAS.forEach(function (p, indice) {
      if (tagsElegiveis.indexOf(p.m) !== -1) indices.push(indice);
    });
    return indices.length > 0 ? indices : PERGUNTAS.map(function (p, indice) { return indice; });
  }

  function drawNextQuestion(tagsElegiveis, idUltimaPergunta) {
    if (!isAvailable()) return null;
    var pool = poolPorTags(tagsElegiveis);
    if (pool.length > 1 && idUltimaPergunta !== undefined && idUltimaPergunta !== null) {
      var semRepeticao = pool.filter(function (indice) { return indice !== idUltimaPergunta; });
      if (semRepeticao.length > 0) pool = semRepeticao;
    }
    var idEscolhido = pool[Math.floor(Math.random() * pool.length)];
    var bruta = PERGUNTAS[idEscolhido];
    var pronta = shuffleAlternatives(bruta);
    return {
      id: idEscolhido,
      texto: bruta.q,
      alternativas: pronta.alternativas,
      indiceCorreto: pronta.indiceCorreto,
      explicacao: bruta.e,
      assunto: bruta.m
    };
  }

  return {
    isAvailable: isAvailable,
    shuffleAlternatives: shuffleAlternatives,
    drawNextQuestion: drawNextQuestion
  };
})();
