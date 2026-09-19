// js/game.js — loop do canvas, nave, ondas de inimigos, colisoes, tiers de dificuldade.
// Nesta etapa (T006): apenas o boot do canvas, a nave e o controle de movimento/tiro
// (teclado + d-pad na tela). Ondas/inimigos entram na tarefa T008, tiers na T014.

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

    ctx.clearRect(0, 0, largura, altura);
    desenharNave();
    desenharTiros();

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
    posicionarNaveInicial();
    ultimoTempo = 0;
    if (animacaoId === null) {
      animacaoId = window.requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (animacaoId !== null) {
      window.cancelAnimationFrame(animacaoId);
      animacaoId = null;
    }
  }

  return {
    init: init,
    start: start,
    stop: stop,
    set onWaveCleared(fn) { onWaveCleared = fn; },
    set onLifeLost(fn) { onLifeLost = fn; }
  };
})();
