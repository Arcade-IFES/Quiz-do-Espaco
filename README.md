# Quiz do Espaço

Um shooter arcade educacional: pilote a nave, responda perguntas de lógica de programação e limpe as ondas
de inimigos. Feito com HTML, CSS e JavaScript puro — basta abrir o arquivo `index.html`, sem instalação e
sem internet.

> Este jogo nasceu do [Spec-Kit-jogos](https://github.com/Arcade-IFES/Spec-Kit-jogos), o repositório central
> de regras e ferramentas da Arcade-IFES. As regras compartilhadas com os demais jogos estão na
> [Parte I da constituição](.specify/memory/constitution.md); as regras específicas deste jogo estão na Parte II.

## Status

🚧 Em desenvolvimento. A primeira feature (`specs/001-core-gameplay`) ainda será especificada e implementada
via Spec Kit (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`).

## Sobre o jogo

- **Assunto:** lógica de programação introdutória (variáveis, condicionais, laços, funções, estruturas de dados).
- **Público-alvo:** estudantes do ensino técnico (IFES) cursando programação introdutória.
- **Dificuldade:** aumenta em ondas conforme o jogador acerta perguntas em sequência; um erro reduz a
  dificuldade em um passo, sem punição severa.
- **Pontuação:** pontos base por acerto + bônus de sequência; erros não descontam pontos já ganhos.
- **Ranking:** top-10 local (iniciais de 3 letras), salvo no navegador — sem servidor, sem conta.

## Como jogar

_A ser detalhado conforme a primeira feature for implementada._

## Controles

| Ação | Teclado | Toque |
|---|---|---|
| Mover | Setas / `WASD` | D-pad na tela |
| Atirar / confirmar resposta | `Space` | Botão na tela |
| Mudo | `M` | Botão na tela |

## Estrutura do projeto

```
.specify/            ferramentas do Spec Kit (herdadas do repositório central)
specs/                especificações de cada feature (specs/001-…, specs/002-…)
perguntas.js          banco de perguntas (editável por um educador, sem tocar no código)
```

## Créditos

Desenvolvido pelo grupo Arcade-IFES.

## Licença e conteúdo

Perguntas, arte e som devem ser originais ou devidamente licenciados (ver constituição, Princípio VIII).
