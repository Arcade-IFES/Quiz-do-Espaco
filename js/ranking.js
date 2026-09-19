// js/ranking.js — persistencia local (ranking top-10 e preferencia de mudo).
// Contrato de dados: specs/001-core-gameplay/data-model.md (RankingEntry, mute preference).
// Toda leitura/escrita e protegida com try/catch: se localStorage estiver indisponivel,
// caimos para um estado em memoria e o jogo continua funcionando sem salvar (FR-012).

var Ranking = (function () {
  var CHAVE_RANKING = "quizDoEspaco.ranking";
  var CHAVE_MUDO = "quizDoEspaco.muted";
  var MAX_ENTRADAS = 10;

  var rankingEmMemoria = [];
  var mudoEmMemoria = false;

  function lerRanking() {
    try {
      var bruto = window.localStorage.getItem(CHAVE_RANKING);
      if (!bruto) return [];
      var lista = JSON.parse(bruto);
      if (!Array.isArray(lista)) return [];
      return lista;
    } catch (erro) {
      return rankingEmMemoria.slice();
    }
  }

  function salvarRanking(lista) {
    rankingEmMemoria = lista.slice();
    try {
      window.localStorage.setItem(CHAVE_RANKING, JSON.stringify(lista));
    } catch (erro) {
      // Sem storage disponivel: mantemos apenas em memoria (FR-012).
    }
  }

  function getRanking() {
    return lerRanking()
      .slice()
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, MAX_ENTRADAS);
  }

  function isTopTen(score) {
    var lista = getRanking();
    if (lista.length < MAX_ENTRADAS) return true;
    return score > lista[lista.length - 1].score;
  }

  function addRankingEntry(iniciais, score) {
    var iniciaisNormalizadas = String(iniciais || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 3);
    var lista = lerRanking();
    lista.push({ initials: iniciaisNormalizadas || "???", score: score });
    lista.sort(function (a, b) { return b.score - a.score; });
    salvarRanking(lista.slice(0, MAX_ENTRADAS));
  }

  function getMuted() {
    try {
      return window.localStorage.getItem(CHAVE_MUDO) === "true";
    } catch (erro) {
      return mudoEmMemoria;
    }
  }

  function setMuted(mudo) {
    mudoEmMemoria = !!mudo;
    try {
      window.localStorage.setItem(CHAVE_MUDO, mudo ? "true" : "false");
    } catch (erro) {
      // Sem storage disponivel: mantemos apenas em memoria.
    }
  }

  return {
    getRanking: getRanking,
    isTopTen: isTopTen,
    addRankingEntry: addRankingEntry,
    getMuted: getMuted,
    setMuted: setMuted
  };
})();
