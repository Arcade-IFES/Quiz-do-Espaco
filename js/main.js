// js/main.js — orquestra as telas, o estado da partida (Run) e liga Game/Quiz/AudioFX/Ranking.
// Nesta etapa (T007): apenas a troca de telas e a renderizacao do ranking no inicio.
// Estado da partida e o fluxo do jogo entram nas tarefas T009-T013 (US1) em diante.

(function () {
  var telaInicio = document.getElementById("tela-inicio");
  var telaJogo = document.getElementById("tela-jogo");
  var telaFim = document.getElementById("tela-fim");
  var listaRanking = document.getElementById("lista-ranking");
  var dpad = document.getElementById("dpad");
  var canvas = document.getElementById("canvas-jogo");

  function mostrarTela(tela) {
    [telaInicio, telaJogo, telaFim].forEach(function (elemento) {
      elemento.hidden = elemento !== tela;
    });
  }

  function renderizarRanking() {
    var entradas = Ranking.getRanking();
    listaRanking.innerHTML = "";
    if (entradas.length === 0) {
      var vazio = document.createElement("li");
      vazio.textContent = "Nenhum recorde ainda — seja o primeiro!";
      listaRanking.appendChild(vazio);
      return;
    }
    entradas.forEach(function (entrada) {
      var item = document.createElement("li");
      item.textContent = entrada.initials + " — " + entrada.score;
      listaRanking.appendChild(item);
    });
  }

  function ehDispositivoTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  function inicializar() {
    Game.init(canvas);
    if (ehDispositivoTouch()) {
      dpad.hidden = false;
    }
    renderizarRanking();
    mostrarTela(telaInicio);
  }

  document.addEventListener("DOMContentLoaded", inicializar);
})();
