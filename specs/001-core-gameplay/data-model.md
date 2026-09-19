# Phase 1 Data Model: Core Gameplay

In-memory entities live for the duration of one run (tab session); only `RankingEntry` and the mute flag are
persisted, in `localStorage` (see `research.md`).

## Run (in-memory, not persisted)

| Field | Type | Notes |
|---|---|---|
| `score` | integer ≥ 0 | Increases on correct answers only (spec FR-005/006) |
| `lives` | integer ≥ 0 | Starts at a fixed value (implementation constant); run ends at 0 (FR-007) |
| `streak` | integer ≥ 0 | Consecutive correct answers; resets to 0 on a wrong answer (FR-006) |
| `difficultyTier` | integer, 0..N-1 | See Difficulty tiering in `research.md`; floor 0, never restored across reloads |
| `missed` | array of `{ question, chosenAnswer }` | Built during the run, shown in the end-of-run summary (FR-009) |

## Wave (in-memory)

| Field | Type | Notes |
|---|---|---|
| `enemies` | array of enemy sprites | Position, speed derived from `difficultyTier` |
| `cleared` | boolean | True once all enemies in the wave are defeated; triggers the next Question |

## Question (loaded from `perguntas.js`, read-only at runtime)

Per the constitution's Question Bank Contract, each entry is `{ q, a, e, m }`:

| Field | Type | Notes |
|---|---|---|
| `q` | string (pt-BR) | The question statement shown to the player |
| `a` | array of strings (pt-BR) | Alternatives; index 0 is always the correct one in the source file, shuffled for display |
| `e` | string (pt-BR) | Explanation shown after the player answers, right or wrong (FR-005) |
| `m` | string | Subject tag; combined with `difficultyTier` to filter the eligible pool (`research.md`) |

**Validation rule**: if `PERGUNTAS` is missing, not an array, or empty, the start control is disabled and a
warning is shown (FR-013) — no Question entity can be constructed.

## RankingEntry (persisted: `localStorage["quizDoEspaco.ranking"]`)

| Field | Type | Notes |
|---|---|---|
| `initials` | string, exactly 3 letters, uppercase | Player-entered at end of a qualifying run (FR-012) |
| `score` | integer ≥ 0 | Final `Run.score` |

Stored as a JSON array of at most 10 `RankingEntry` objects, sorted by `score` descending. A run's score is
inserted only if it would place within the top 10 (spec User Story 3, scenario 5).

## Mute preference (persisted: `localStorage["quizDoEspaco.muted"]`)

A single boolean, read on boot to set initial audio state and written whenever the player toggles mute
(FR-011).

## Relationships

```
Run 1───* Wave            (a run progresses through a sequence of waves)
Wave 1───1 Question        (clearing a wave's enemies triggers exactly one question before the next wave)
Run 1───* missed Question  (0..n entries copied into Run.missed for the summary)
RankingEntry *───1 localStorage list  (independent of any single Run; read on the start screen, written at run end)
```

No entity requires a state-transition diagram beyond what `research.md`'s difficulty-tiering decision already
describes (tier increments/decrements are the only state machine in this feature).
