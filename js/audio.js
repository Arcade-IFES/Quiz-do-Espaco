// js/audio.js — sons sintetizados via Web Audio API (Principio IV: sem arquivos de audio).
// contexto e criado no primeiro gesto do usuario (politica de autoplay dos navegadores).

var AudioFX = (function () {
  var contexto = null;
  var ganhoMestre = null;
  var mudo = Ranking.getMuted();
  var musicaIniciada = false;

  function garantirContexto() {
    if (contexto) return;
    var Ctor = window.AudioContext || window.webkitAudioContext;
    contexto = new Ctor();
    ganhoMestre = contexto.createGain();
    ganhoMestre.gain.value = mudo ? 0 : 1;
    ganhoMestre.connect(contexto.destination);
  }

  function init() {
    garantirContexto();
    if (contexto.state === "suspended") {
      contexto.resume();
    }
    if (!musicaIniciada) {
      musicaIniciada = true;
      tocarMusicaFundo();
    }
  }

  function tocarTom(frequencia, duracao, tipo, volume) {
    if (!contexto) return;
    var agora = contexto.currentTime;
    var oscilador = contexto.createOscillator();
    var ganho = contexto.createGain();
    oscilador.type = tipo || "square";
    oscilador.frequency.setValueAtTime(frequencia, agora);
    ganho.gain.setValueAtTime(volume || 0.2, agora);
    ganho.gain.exponentialRampToValueAtTime(0.001, agora + duracao);
    oscilador.connect(ganho);
    ganho.connect(ganhoMestre);
    oscilador.start(agora);
    oscilador.stop(agora + duracao);
  }

  function playFire() {
    init();
    tocarTom(880, 0.08, "square", 0.15);
  }

  function playHit() {
    init();
    tocarTom(120, 0.25, "sawtooth", 0.25);
  }

  function playCorrect() {
    init();
    tocarTom(660, 0.12, "triangle", 0.2);
    setTimeout(function () { tocarTom(990, 0.15, "triangle", 0.2); }, 90);
  }

  function playWrong() {
    init();
    tocarTom(220, 0.3, "sawtooth", 0.2);
  }

  // Padrao de fundo simples e gerado em loop; volume baixo para nao competir com os efeitos.
  var NOTAS_FUNDO = [220, 262, 220, 196];
  var passoFundo = 0;
  function tocarMusicaFundo() {
    if (!contexto) return;
    tocarTom(NOTAS_FUNDO[passoFundo % NOTAS_FUNDO.length], 0.5, "sine", 0.05);
    passoFundo++;
    setTimeout(tocarMusicaFundo, 600);
  }

  function setMuted(valor) {
    mudo = !!valor;
    Ranking.setMuted(mudo);
    if (ganhoMestre) {
      ganhoMestre.gain.value = mudo ? 0 : 1;
    }
  }

  function isMuted() {
    return mudo;
  }

  return {
    init: init,
    playFire: playFire,
    playHit: playHit,
    playCorrect: playCorrect,
    playWrong: playWrong,
    setMuted: setMuted,
    isMuted: isMuted
  };
})();
