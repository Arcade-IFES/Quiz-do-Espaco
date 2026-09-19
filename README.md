# Quiz do Espaço

Um shooter arcade educacional: pilote a nave, responda perguntas de lógica de programação e limpe as ondas
de inimigos. Feito com HTML, CSS e JavaScript puro — basta abrir o arquivo `index.html`, sem instalação e
sem internet.

> Este jogo nasceu do [Spec-Kit-jogos](https://github.com/Arcade-IFES/Spec-Kit-jogos), o repositório central
> de regras e ferramentas da Arcade-IFES. As regras compartilhadas com os demais jogos estão na
> [Parte I da constituição](.specify/memory/constitution.md); as regras específicas deste jogo estão na Parte II.

## Status

✅ Jogável. A primeira feature (`specs/001-core-gameplay`) está implementada: nave, ondas de inimigos,
perguntas entre ondas, dificuldade adaptativa, som/mudo e ranking local. Próximas features (mais perguntas,
efeitos visuais, novos modos) continuam pelo fluxo do Spec Kit (`/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement`).

## Sobre o jogo

- **Assunto:** lógica de programação introdutória (variáveis, condicionais, laços, funções, estruturas de dados).
- **Público-alvo:** estudantes do ensino técnico (IFES) cursando programação introdutória.
- **Dificuldade:** aumenta em ondas conforme o jogador acerta perguntas em sequência; um erro reduz a
  dificuldade em um passo, sem punição severa.
- **Pontuação:** pontos base por acerto + bônus de sequência; erros não descontam pontos já ganhos.
- **Ranking:** top-10 local (iniciais de 3 letras), salvo no navegador — sem servidor, sem conta.

## Como jogar

1. Abra `index.html` no navegador (duplo clique — não precisa de servidor nem de internet).
2. Na tela inicial, veja o ranking local e clique em **Iniciar**.
3. Pilote a nave e atire nos inimigos que descem em cada onda.
4. Ao limpar uma onda, responda a pergunta de lógica de programação que aparece na tela:
   - **Acertou:** ganha pontos (com bônus por sequência de acertos), a explicação é mostrada e a próxima onda
     fica mais rápida e com perguntas mais difíceis a cada 3 acertos seguidos.
   - **Errou:** não perde vida nem pontos ganhos, a explicação correta é mostrada, e a dificuldade recua um
     passo.
5. Cada inimigo que alcança a nave custa 1 vida. Ao zerar as vidas, a partida termina e aparece um resumo com
   todas as perguntas que você errou (com a explicação de cada uma).
6. Se a pontuação entrar no top-10, digite suas iniciais (3 letras) para salvar no ranking local.

## Aviso de banco de perguntas ausente

Se o arquivo `perguntas.js` estiver ausente, vazio ou corrompido, a tela inicial mostra um aviso e o botão
**Iniciar** fica desabilitado — o jogo nunca trava silenciosamente por falta de perguntas.

## Controles

| Ação | Teclado | Toque |
|---|---|---|
| Mover | Setas / `WASD` | D-pad na tela |
| Atirar / confirmar resposta | `Space` | Botão na tela |
| Mudo | `M` | Botão na tela |

## Estrutura do projeto

```
index.html            ponto de entrada — abra este arquivo para jogar
css/style.css          visual (tema arcade, HUD, telas)
js/
  ranking.js            ranking local e preferência de mudo (localStorage)
  audio.js              efeitos sonoros e música via Web Audio API
  quiz.js               motor de perguntas (validação, embaralhamento, seleção por dificuldade)
  game.js               nave, ondas de inimigos, colisões e tiers de dificuldade
  main.js               telas, estado da partida e integração entre os módulos acima
perguntas.js          banco de perguntas (editável por um educador, sem tocar no código)
.specify/            ferramentas do Spec Kit (herdadas do repositório central)
specs/                especificações de cada feature (specs/001-…, specs/002-…)
```

## Créditos

Desenvolvido pelo grupo Arcade-IFES.

## Licença e conteúdo

Perguntas, arte e som devem ser originais ou devidamente licenciados (ver constituição, Princípio VIII).
