# Contract: `perguntas.js` (Question Bank)

This is the one external interface of this feature: the boundary between the game code and the content an
educator edits. It follows the constitution's Question Bank Contract (Principle VI) exactly; this document
pins down the concrete shape `js/quiz.js` is allowed to assume.

## File

`perguntas.js`, at the repository root, loaded by `index.html` via a plain `<script>` tag (no module bundler,
no `fetch`/`import`, no build step — Principle II).

## Shape

```js
const PERGUNTAS = [
  {
    q: "string — pt-BR question statement",
    a: ["string — correct answer (always index 0 in this file)", "string — wrong", "string — wrong", "..."],
    e: "string — pt-BR explanation shown after answering",
    m: "string — subject tag, e.g. 'variaveis' | 'condicionais' | 'lacos' | 'funcoes' | 'estruturas-de-dados'"
  },
  // ...at least enough entries per subject tag to avoid immediate repeats (spec Edge Cases)
];
```

## Guarantees the game code may rely on

- `PERGUNTAS` is a global `const` array, present after the script tag executes.
- Each entry has exactly the four fields above; `a` has at least 2 and no fixed maximum alternatives.
- `a[0]` is always the correct alternative in the source file — `js/quiz.js` MUST shuffle `a` before display
  and MUST track the correct alternative's new position itself; it MUST NOT assume index 0 after shuffling.
- `m` values used by any question MUST also be referenced by the difficulty-tier configuration in
  `js/game.js` (`research.md`, Difficulty tiering) — an untagged or unmapped `m` is a content bug, not
  something the game code needs to guard against at runtime beyond not crashing.

## Guarantees the game code MUST provide (failure handling)

- If `perguntas.js` fails to load, or `PERGUNTAS` is undefined, not an array, or has zero entries: the start
  control on the start screen MUST be disabled and a clear on-screen warning shown (FR-013). This MUST be
  checked at boot, before the player can start a run.

## Starter fixture (this feature's scope)

This feature ships a starter `perguntas.js` with ~15 original pt-BR questions covering the subject tags used
by the difficulty tiers (variables, conditionals, loops, functions, basic data structures — constitution Part
II subject area). Growing the bank beyond this starter set is explicitly out of scope for `001-core-gameplay`
(spec Assumptions) and is expected to continue in later work.
