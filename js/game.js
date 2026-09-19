// js/game.js — loop do canvas, nave, ondas de inimigos, colisoes, tiers de dificuldade.
// T006: boot do canvas, nave, movimento/tiro. T008: ondas de inimigos e colisoes
// (este arquivo). Tiers de dificuldade entram na tarefa T014.

var Game = (function () {
  var canvas, ctx;
  var largura, altura;
  var animacaoId = null;
  var ultimoTempo = 0;

  var nave = { x: 0, y: 0, largura: 32, altura: 24, velocidade: 220 };
  var teclas = { esquerda: false, direita: false, cima: false, baixo: false };
  var atirando = false;
  var tiros = [];
  var VELOCIDADE_TIRO = 360;
  var INTERVALO_TIRO = 0.25;
  var tempoDesdeUltimoTiro = 0;

  var inimigos = [];
  var ondaAtiva = false;
  var multiplicadorVelocidade = 1;
  var BASE_VELOCIDADE_INIMIGO = 60;
  var INIMIGOS_POR_ONDA = 5;

  // Callbacks que main.js define antes de Game.start(); ficam vazios ate la.
  var onWaveCleared = function () {};
  var onLifeLost = function () {};

  function limitar(valor, min, max) {
    return Math.max(min, Math.min(max, valor));
  }

  function posicionarNaveInicial() {
    nave.x = largura / 2 - nave.largura / 2;
    nave.y = altura - nave.altura - 16;
  }

  function ligarTeclado() {
    window.addEventListener("keydown", function (evento) {
      aplicarTecla(evento.key, true);
    });
    window.addEventListener("keyup", function (evento) {
      aplicarTecla(evento.key, false);
    });
  }

  function aplicarTecla(tecla, pressionada) {
    switch (tecla) {
      case "ArrowLeft": case "a": case "A": teclas.esquerda = pressionada; break;
      case "ArrowRight": case "d": case "D": teclas.direita = pressionada; break;
      case "ArrowUp": case "w": case "W": teclas.cima = pressionada; break;
      case "ArrowDown": case "s": case "S": teclas.baixo = pressionada; break;
      case " ": atirando = pressionada; break;
    }
  }

  function ligarBotao(id, aoPressionar, aoSoltar) {
    var elemento = document.getElementById(id);
    if (!elemento) return;
    elemento.addEventListener("pointerdown", function (e) { e.preventDefault(); aoPressionar(); });
    elemento.addEventListener("pointerup", function (e) { e.preventDefault(); aoSoltar(); });
    elemento.addEventListener("pointerleave", function () { aoSoltar(); });
    elemento.addEventListener("pointercancel", function () { aoSoltar(); });
  }

  function ligarDpad() {
    ligarBotao("dpad-esquerda", function () { teclas.esquerda = true; }, function () { teclas.esquerda = false; });
    ligarBotao("dpad-direita", function () { teclas.direita = true; }, function () { teclas.direita = false; });
    ligarBotao("dpad-cima", function () { teclas.cima = true; }, function () { teclas.cima = false; });
    ligarBotao("dpad-baixo", function () { teclas.baixo = true; }, function () { teclas.baixo = false; });
    ligarBotao("dpad-atirar", function () { atirando = true; }, function () { atirando = false; });
  }

  function atualizarNave(dt) {
    if (teclas.esquerda) nave.x -= nave.velocidade * dt;
    if (teclas.direita) nave.x += nave.velocidade * dt;
    if (teclas.cima) nave.y -= nave.velocidade * dt;
    if (teclas.baixo) nave.y += nave.velocidade * dt;
    nave.x = limitar(nave.x, 0, largura - nave.largura);
    nave.y = limitar(nave.y, altura / 2, altura - nave.altura);
  }

  function atualizarTiros(dt) {
    tempoDesdeUltimoTiro += dt;
    if (atirando && tempoDesdeUltimoTiro >= INTERVALO_TIRO) {
      tempoDesdeUltimoTiro = 0;
      tiros.push({ x: nave.x + nave.largura / 2 - 2, y: nave.y, largura: 4, altura: 10 });
      if (typeof AudioFX !== "undefined") AudioFX.playFire();
    }
    tiros.forEach(function (tiro) { tiro.y -= VELOCIDADE_TIRO * dt; });
    tiros = tiros.filter(function (tiro) { return tiro.y + tiro.altura > 0; });
  }

  function gerarOnda() {
    inimigos = [];
    for (var i = 0; i < INIMIGOS_POR_ONDA; i++) {
      inimigos.push({
        x: (largura / (INIMIGOS_POR_ONDA + 1)) * (i + 1) - 14,
        y: -30 - i * 40,
        largura: 28,
        altura: 22,
        velocidade: BASE_VELOCIDADE_INIMIGO * multiplicadorVelocidade
      });
    }
    ondaAtiva = true;
  }

  function sobrepoe(a, b) {
    return a.x < b.x + b.largura && a.x + a.largura > b.x && a.y < b.y + b.altura && a.y + a.altura > b.y;
  }

  function atualizarInimigos(dt) {
    if (!ondaAtiva) return;

    inimigos.forEach(function (inimigo) { inimigo.y += inimigo.velocidade * dt; });

    // Inimigo alcancou a nave (ou a base do campo): custa 1 vida e sai de jogo (FR-007).
    var alcancaram = inimigos.filter(function (inimigo) { return inimigo.y + inimigo.altura >= nave.y; });
    if (alcancaram.length > 0) {
      inimigos = inimigos.filter(function (inimigo) { return inimigo.y + inimigo.altura < nave.y; });
      alcancaram.forEach(function () { onLifeLost(); });
    }

    // Colisao tiro x inimigo: os dois somem, sem custo de vida (FR-002/FR-007).
    var tirosRestantes = [];
    tiros.forEach(function (tiro) {
      var atingiu = inimigos.find(function (inimigo) { return sobrepoe(tiro, inimigo); });
      if (atingiu) {
        inimigos = inimigos.filter(function (inimigo) { return inimigo !== atingiu; });
        if (typeof AudioFX !== "undefined") AudioFX.playHit();
      } else {
        tirosRestantes.push(tiro);
      }
    });
    tiros = tirosRestantes;

    if (ondaAtiva && inimigos.length === 0) {
      ondaAtiva = false;
      onWaveCleared();
    }
  }

  function desenharInimigos() {
    ctx.fillStyle = "#ff5da2";
    inimigos.forEach(function (inimigo) { ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura); });
  }

  function desenharNave() {
    ctx.fillStyle = "#7cf9ff";
    ctx.fillRect(nave.x, nave.y, nave.largura, nave.altura);
  }

  function desenharTiros() {
    ctx.fillStyle = "#ffd166";
    tiros.forEach(function (tiro) { ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura); });
  }

  function loop(tempoAtual) {
    var dt = ultimoTempo ? (tempoAtual - ultimoTempo) / 1000 : 0;
    ultimoTempo = tempoAtual;

    atualizarNave(dt);
    atualizarTiros(dt);
    atualizarInimigos(dt);

    ctx.clearRect(0, 0, largura, altura);
    desenharNave();
    desenharTiros();
    desenharInimigos();

    animacaoId = window.requestAnimationFrame(loop);
  }

  function init(elementoCanvas) {
    canvas = elementoCanvas;
    ctx = canvas.getContext("2d");
    largura = canvas.width;
    altura = canvas.height;
    posicionarNaveInicial();
    ligarTeclado();
    ligarDpad();
  }

  function start() {
    tiros = [];
    multiplicadorVelocidade = 1;
    posicionarNaveInicial();
    ultimoTempo = 0;
    gerarOnda();
    if (animacaoId === null) {
      animacaoId = window.requestAnimationFrame(loop);
    }
  }

  function nextWave() {
    tiros = [];
    gerarOnda();
  }

  function stop() {
    ondaAtiva = false;
    if (animacaoId !== null) {
      window.cancelAnimationFrame(animacaoId);
      animacaoId = null;
    }
  }

  return {
    init: init,
    start: start,
    nextWave: nextWave,
    stop: stop,
    set onWaveCleared(fn) { onWaveCleared = fn; },
    set onLifeLost(fn) { onLifeLost = fn; }
  };
})();
