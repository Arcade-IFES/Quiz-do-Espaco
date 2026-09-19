---

description: "Task list template for feature implementation"
---

# Tasks: Core Gameplay

**Input**: Design documents from `/specs/001-core-gameplay/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/perguntas-contract.md, quickstart.md

**Tests**: Not requested — the feature spec has no explicit test requirement and the constitution (Principle
II) forbids requiring package dependencies, so no test-runner tasks are generated. `quickstart.md` is the
verification method (see the Polish phase).

**Organization**: Tasks are grouped by user story (spec.md) to enable independent implementation and testing
of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths below follow plan.md → Project Structure (flat, no `src/`, no build step)

---

## Phase 1: Setup

**Purpose**: Create the project skeleton every story builds on.

- [X] T001 Create the project skeleton per plan.md → Project Structure: `index.html` (canvas + start/run/game-over
      screen containers), `css/style.css` (base reset), and empty `js/main.js`, `js/game.js`, `js/quiz.js`,
      `js/audio.js`, `js/ranking.js` module files loaded via plain `<script>` tags (no bundler — Principle II).
- [X] T002 [P] Author the starter `perguntas.js` fixture at the repository root: ~15 original pt-BR questions
      covering the subject tags `variaveis`, `condicionais`, `lacos`, `funcoes`, `estruturas-de-dados`, each
      shaped exactly as `{ q, a, e, m }` with the correct alternative at `a[0]`, per
      `contracts/perguntas-contract.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infrastructure every user story depends on. Sound and ranking storage are included here (not
deferred to US3) because the constitution (Principles IV/V) treats them as always-on, not as optional
add-ons — US3 later wires their UI/trigger points, but the underlying modules must exist first so US1/US2 can
call into them without stubs.

**⚠️ CRITICAL**: No user story task may start until this phase is complete.

- [X] T003 Implement `js/ranking.js`: `getRanking()` / `isTopTen(score)` / `addRankingEntry(initials, score)`
      backed by `localStorage["quizDoEspaco.ranking"]` (data-model.md RankingEntry: `initials` exactly 3
      uppercase letters, `score` integer ≥ 0, list capped at 10 entries sorted by `score` descending), plus
      `getMuted()` / `setMuted(bool)` backed by `localStorage["quizDoEspaco.muted"]`. Every read/write wrapped
      in `try/catch` with an in-memory fallback so nothing throws when storage is unavailable (FR-012).
- [X] T004 Implement `js/audio.js`: create one shared `AudioContext` on first user interaction, synthesize
      fire/hit/correct/wrong effects and a looping background pattern via `OscillatorNode`/`GainNode`
      envelopes (no audio files — Principle IV), and expose `setMuted(bool)` that zeroes a master `GainNode`
      and persists through `js/ranking.js`'s `getMuted()`/`setMuted()` (depends on T003).
- [X] T005 Implement the `js/quiz.js` question engine: on load, validate `PERGUNTAS` per
      `contracts/perguntas-contract.md` and expose an "unavailable" state when it is missing, not an array, or
      empty (FR-013); expose `shuffleAlternatives(question)` that shuffles `a` while tracking the new correct
      index; expose `drawNextQuestion(tier, lastQuestionId)` that filters the pool by the tier's eligible
      subject tags and excludes `lastQuestionId` unless the pool has only one question (research.md Question
      selection).
- [ ] T006 Implement the `js/game.js` canvas boot: `requestAnimationFrame` loop, a ship entity that responds
      to keyboard (arrows/`WASD`) and touch (on-screen d-pad, ≥44×44px per constitution Part II) movement, and
      an empty-wave rendering scaffold (no enemies or questions wired yet).
- [ ] T007 Implement screen wiring in `js/main.js` / `index.html` / `css/style.css`: start screen (ranking
      list placeholder + start control), run screen (HUD placeholders for score/lives + canvas), game-over
      screen (summary placeholder) — show/hide transitions only, no game logic yet.

**Checkpoint**: Foundation ready — user story phases below can now begin.

---

## Phase 3: User Story 1 - Play a full run and get scored (Priority: P1) 🎯 MVP

**Goal**: A player can start a run, clear waves by answering questions, lose lives to enemies, and see a
final score and missed-question summary when the run ends.

**Independent Test**: quickstart.md Scenario 1 — survive at least one wave by answering correctly and confirm
score and wave progression; run out of lives and confirm the summary appears.

### Implementation for User Story 1

- [ ] T008 [US1] Implement the wave/enemy model in `js/game.js`: spawn a wave's enemies, move them toward the
      ship, detect an enemy reaching the ship (signal 1 life lost) and an enemy being defeated by ship fire
      (FR-002, FR-007).
- [ ] T009 [US1] Wire wave-cleared → question trigger in `js/main.js`: when a wave's `cleared` flag becomes
      true (T008), call `js/quiz.js` `drawNextQuestion` and show the run screen's question overlay (FR-003).
- [ ] T010 [US1] Implement answer handling in `js/main.js`: on the player's selection, compare against the
      shuffled correct index from T005, show the question's `e` (explanation) either way, increase
      `Run.score`/`Run.streak` on a correct answer (FR-005), reset `Run.streak` without deducting `Run.score`
      on a wrong answer (FR-006), then start the next wave.
- [ ] T011 [US1] Implement the lives/game-over transition in `js/main.js`: decrement `Run.lives` on each
      enemy-reaches-ship event from T008, end the run when `Run.lives` reaches 0 (FR-007), and route to the
      game-over screen.
- [ ] T012 [US1] Implement the end-of-run summary in `js/main.js` / `css/style.css`: append each wrong answer
      to `Run.missed` (T010) and list every entry (question + explanation) on the game-over screen (FR-009,
      data-model.md `Run.missed`).
- [ ] T013 [US1] Wire the start control in `js/main.js`: disable it and show the FR-013 warning when
      `js/quiz.js` reports the question bank unavailable (T005); otherwise start a fresh `Run` (score 0, lives
      at an implementation constant, streak 0, tier 0) and the first wave.

**Checkpoint**: User Story 1 is fully playable start-to-finish, independent of US2/US3 (quickstart.md
Scenario 1).

---

## Phase 4: User Story 2 - Difficulty responds to the player's streak (Priority: P2)

**Goal**: Waves get faster and questions get harder as the player's correct-answer streak grows; a wrong
answer eases difficulty back by one step instead of ending the run.

**Independent Test**: quickstart.md Scenario 2 — answer 3 in a row correctly and observe faster/harder waves;
answer incorrectly and observe the difficulty step down instead of the run ending.

### Implementation for User Story 2

- [ ] T014 [US2] Add a difficulty-tier table to `js/game.js`: a small fixed array (research.md Difficulty
      tiering) where each tier defines an enemy speed multiplier and its eligible subject tag(s).
- [ ] T015 [US2] In `js/main.js`, increase `Run.difficultyTier` by 1 after every 3 consecutive correct answers
      (depends on T010's streak tracking, T014).
- [ ] T016 [US2] In `js/main.js`, decrease `Run.difficultyTier` by 1 (floor 0, run continues) on a wrong
      answer (depends on T010, T014).
- [ ] T017 [US2] In `js/main.js`, feed `Run.difficultyTier` into `js/game.js` wave spawning (enemy speed
      multiplier, T014) and into `js/quiz.js` `drawNextQuestion` (eligible tags, T005).

**Checkpoint**: User Stories 1 and 2 both work independently (quickstart.md Scenario 2).

---

## Phase 5: User Story 3 - Sound, mute, and local ranking (Priority: P3)

**Goal**: Sound plays during a run, the player can mute and the choice persists, and a qualifying final score
is saved to a local top-10 ranking shown on the start screen.

**Independent Test**: quickstart.md Scenario 3 — toggle mute and reload to confirm persistence; finish a run
and confirm the ranking updates (or doesn't, if it doesn't qualify).

### Implementation for User Story 3

- [ ] T018 [P] [US3] Wire `js/audio.js` (T004) effect calls into the fire/hit events in `js/game.js` (T008)
      and the correct/wrong events in `js/main.js` (T010).
- [ ] T019 [US3] Implement mute controls: a keyboard shortcut (`M`) and an on-screen button in
      `index.html`/`js/main.js` calling `js/audio.js` `setMuted()` (T004); reflect the muted state on the
      button and read the persisted value from `js/ranking.js` `getMuted()` on boot (FR-011).
- [ ] T020 [US3] Implement the end-of-run ranking flow in `js/main.js`: on game-over, call `js/ranking.js`
      `isTopTen(Run.score)` (T003); if true, show a 3-letter initials prompt and call `addRankingEntry`
      (FR-012); render the current top-10 on the start screen (T007's placeholder) via `getRanking()`.

**Checkpoint**: All three user stories are independently functional (quickstart.md Scenario 3).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final pass across all stories before opening the Pull Request.

- [ ] T021 [P] Apply arcade-style visual polish in `css/style.css` (cabinet framing, HUD styling, readable
      fonts) per constitution Principle III.
- [ ] T022 Run `quickstart.md` end-to-end — all 4 scenarios, including Scenario 4 (missing/empty question
      bank) — and fix any gap found.
- [ ] T023 Update `README.md`'s "Como jogar" section with the final controls and flow, replacing the "a ser
      detalhado" placeholder.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational only.
- **User Story 2 (Phase 4)**: Depends on Foundational and on US1's streak tracking (T010) — implement US1
  first in practice, even though this is a single-developer project and stories are not built by parallel
  teams here.
- **User Story 3 (Phase 5)**: Depends on Foundational (T003/T004 already built the modules) and on US1's
  fire/hit/answer event points (T008, T010) as wiring targets.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### Within Each User Story

- US1: wave/enemy model (T008) before the question trigger (T009) before answer handling (T010) before
  lives/summary (T011, T012) before the start-control wiring (T013).
- US2: tier table (T014) before increase/decrease rules (T015, T016) before feeding the tier into game/quiz
  (T017).
- US3: T018 (effect wiring) is independent of T019/T020 and can run in parallel with them.

### Parallel Opportunities

- T002 (question fixture) can be written in parallel with T001 (project skeleton) — different files.
- Within Phase 5, T018 [P] can run alongside T019/T020.
- This is a single small codebase built by one person/agent in practice; the `[P]` markers above record
  genuine file-level independence for reference, not an expectation of a multi-developer team.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. **STOP and VALIDATE**: run quickstart.md Scenario 1 in a browser.
4. This is already a demoable arcade loop, per spec.md's User Story 1 priority rationale.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. Add US1 → validate with quickstart.md Scenario 1 (MVP).
3. Add US2 → validate with quickstart.md Scenario 2.
4. Add US3 → validate with quickstart.md Scenario 3.
5. Polish (Phase 6) → validate with quickstart.md Scenario 4 and the full pass, then open the PR against the
   constitution's Quality Gate (Principle XI).

## Notes

- No test-runner tasks are included (see **Tests** above); `quickstart.md` is the verification method, run as
  T022.
- Commit after each task or logical group, per this session's request to keep commits separated by artifact.
- Avoid: vague tasks, same-file conflicts inside a phase, and cross-story dependencies that would break a
  story's independent testability beyond what is explicitly noted above (US2/US3 building on US1's event
  points).
