// js/main.js — orquestra as telas, o estado da partida (Run) e liga Game/Quiz/AudioFX/Ranking.
// T007: troca de telas e ranking. T009-T013 (este arquivo): fluxo completo da Historia 1
// (onda -> pergunta -> pontuacao/vidas -> fim de jogo). Dificuldade adaptativa (US2) e
// som/mudo/ranking de fim de partida (US3) entram nas tarefas seguintes.

(function () {
  var telaInicio = document.getElementById("tela-inicio");
  var telaJogo = document.getElementById("tela-jogo");
  var telaFim = document.getElementById("tela-fim");
  var listaRanking = document.getElementById("lista-ranking");
  var dpad = document.getElementById("dpad");
  var canvas = document.getElementById("canvas-jogo");
  var avisoPerguntas = document.getElementById("aviso-perguntas");
  var btnIniciar = document.getElementById("btn-iniciar");
  var btnJogarNovamente = document.getElementById("btn-jogar-novamente");

  var hudPontos = document.getElementById("hud-pontos");
  var hudVidas = document.getElementById("hud-vidas");

  var painelPergunta = document.getElementById("pergunta");
  var perguntaTexto = document.getElementById("pergunta-texto");
  var perguntaAlternativas = document.getElementById("pergunta-alternativas");
  var perguntaExplicacao = document.getElementById("pergunta-explicacao");

  var fimPontuacao = document.getElementById("fim-pontuacao");
  var fimErradas = document.getElementById("fim-erradas");

  var VIDAS_INICIAIS = 3;

  // Estado de uma partida (Run) — nao persiste entre recarregamentos da pagina
  // (specs/001-core-gameplay/data-model.md, Run).
  var run = null;
  var partidaEmAndamento = false;

  function novaPartida() {
    return {
      pontuacao: 0,
      vidas: VIDAS_INICIAIS,
      sequencia: 0,
      tier: 0,
      erradas: [],
      idUltimaPergunta: null
    };
  }

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

  function atualizarHud() {
    hudPontos.textContent = "Pontos: " + run.pontuacao;
    hudVidas.textContent = "Vidas: " + run.vidas;
  }

  // --- T013: controle de inicio ---------------------------------------------------------

  function verificarBancoDePerguntas() {
    if (Quiz.isAvailable()) {
      avisoPerguntas.hidden = true;
      btnIniciar.disabled = false;
    } else {
      avisoPerguntas.textContent = "O banco de perguntas (perguntas.js) está ausente ou vazio. Não é possível iniciar.";
      avisoPerguntas.hidden = false;
      btnIniciar.disabled = true;
    }
  }

  function iniciarPartida() {
    if (!Quiz.isAvailable()) return;
    run = novaPartida();
    partidaEmAndamento = true;
    atualizarHud();
    painelPergunta.hidden = true;
    mostrarTela(telaJogo);
    Game.start();
  }

  // --- T009: onda concluida -> pergunta ---------------------------------------------------

  function aoConcluirOnda() {
    if (!partidaEmAndamento) return;
    var pergunta = Quiz.drawNextQuestion(null, run.idUltimaPergunta);
    if (!pergunta) return; // banco ficou indisponivel em tempo de execucao; nao trava o jogo
    run.idUltimaPergunta = pergunta.id;
    mostrarPergunta(pergunta);
  }

  function mostrarPergunta(pergunta) {
    perguntaTexto.textContent = pergunta.texto;
    perguntaExplicacao.hidden = true;
    perguntaAlternativas.innerHTML = "";
    pergunta.alternativas.forEach(function (texto, indice) {
      var botao = document.createElement("button");
      botao.textContent = texto;
      botao.addEventListener("click", function () {
        responder(pergunta, indice, botao);
      });
      perguntaAlternativas.appendChild(botao);
    });
    painelPergunta.hidden = false;
  }

  // --- T010: resposta (acerto/erro), pontuacao e sequencia --------------------------------

  function responder(pergunta, indiceEscolhido, botaoEscolhido) {
    Array.prototype.forEach.call(perguntaAlternativas.children, function (botao) {
      botao.disabled = true;
    });

    var acertou = indiceEscolhido === pergunta.indiceCorreto;
    botaoEscolhido.classList.add(acertou ? "correta" : "errada");
    if (!acertou) {
      perguntaAlternativas.children[pergunta.indiceCorreto].classList.add("correta");
      run.sequencia = 0;
      run.erradas.push({ texto: pergunta.texto, explicacao: pergunta.explicacao });
      if (typeof AudioFX !== "undefined") AudioFX.playWrong();
    } else {
      run.pontuacao += 100 + run.sequencia * 20; // pontos base + bonus de sequencia
      run.sequencia += 1;
      if (typeof AudioFX !== "undefined") AudioFX.playCorrect();
    }

    perguntaExplicacao.textContent = pergunta.explicacao;
    perguntaExplicacao.hidden = false;
    atualizarHud();

    setTimeout(function () {
      painelPergunta.hidden = true;
      if (partidaEmAndamento) Game.nextWave();
    }, 2200);
  }

  // --- T011: vidas e fim de jogo -----------------------------------------------------------

  function aoPerderVida() {
    if (!partidaEmAndamento) return;
    run.vidas -= 1;
    atualizarHud();
    if (run.vidas <= 0) {
      finalizarPartida();
    }
  }

  function finalizarPartida() {
    if (!partidaEmAndamento) return;
    partidaEmAndamento = false;
    Game.stop();
    painelPergunta.hidden = true;
    mostrarResumoFim();
    mostrarTela(telaFim);
  }

  // --- T012: resumo de fim de partida -------------------------------------------------------

  function mostrarResumoFim() {
    fimPontuacao.textContent = "Pontuação final: " + run.pontuacao;
    fimErradas.innerHTML = "";
    if (run.erradas.length === 0) {
      var item = document.createElement("li");
      item.textContent = "Você não errou nenhuma pergunta. Mandou bem!";
      fimErradas.appendChild(item);
    } else {
      run.erradas.forEach(function (erro) {
        var linha = document.createElement("li");
        linha.textContent = erro.texto + " — " + erro.explicacao;
        fimErradas.appendChild(linha);
      });
    }
  }

  function inicializar() {
    Game.init(canvas);
    Game.onWaveCleared = aoConcluirOnda;
    Game.onLifeLost = aoPerderVida;

    if (ehDispositivoTouch()) {
      dpad.hidden = false;
    }

    verificarBancoDePerguntas();
    renderizarRanking();
    mostrarTela(telaInicio);

    btnIniciar.addEventListener("click", iniciarPartida);
    btnJogarNovamente.addEventListener("click", function () {
      renderizarRanking();
      mostrarTela(telaInicio);
    });
  }

  document.addEventListener("DOMContentLoaded", inicializar);
})();
