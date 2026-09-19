# Implementation Plan: Core Gameplay

**Branch**: `001-core-gameplay` | **Date**: 2026-09-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-core-gameplay/spec.md`

## Summary

Build the playable core loop of Quiz do Espaço: a single-page arcade shooter where the player pilots a ship
through waves of enemies and, between waves, answers a programming-logic question drawn from `perguntas.js`.
Score, lives, and a per-run difficulty tier (driven by the correct-answer streak) drive progression; sound
effects/music, a persistent mute control, and a local top-10 ranking wrap the loop, all per the constitution's
fixed stack (plain HTML/CSS/vanilla JS, zero dependencies, offline, `localStorage`, Web Audio API).

## Technical Context

**Language/Version**: HTML5, CSS3, ECMAScript 2020+ (vanilla JavaScript, no transpilation) — fixed by the
constitution, Principle II.

**Primary Dependencies**: None. No frameworks, bundlers, or package dependencies (Principle II). Browser-native
APIs only: Canvas 2D (rendering), Web Audio API (sound, Principle IV), `localStorage` (ranking + mute state,
Principle V).

**Storage**: `localStorage` only, for the mute preference and the top-10 ranking. No server, no database, no
network calls (Principles II and V).

**Testing**: Manual playtest against `quickstart.md`, run directly in a browser. No automated test framework is
introduced, because the constitution (Principle II) forbids requiring package dependencies and the quality
gate (Principle XI) is "starts and is playable start-to-finish," not automated coverage. Pure logic that is
easy to break silently (difficulty step, scoring, question shuffling/no-repeat) is isolated into small
dependency-free functions in `js/quiz.js` and `js/game.js` so it can be exercised from the browser console
during manual QA without a test runner.

**Target Platform**: Desktop/laptop browsers (Chrome, Firefox, Edge — current versions), opened directly from
the filesystem (`file://`, double-click `index.html`) with no build step and no internet required, plus touch
support for tablets (constitution Part II).

**Project Type**: Single-page client-side game (static HTML/CSS/JS, no backend).

**Performance Goals**: Smooth 60fps canvas rendering during waves on mid-range laptop hardware; input
(keyboard/touch) to on-screen reaction perceived as instant (<100ms).

**Constraints**: Zero install, offline-capable, no build/bundle step, no external audio/image files (sound is
synthesized via Web Audio API per Principle IV), must degrade gracefully (no crash) when `localStorage` is
unavailable (spec FR-012, Edge Cases).

**Scale/Scope**: Single-player, single device, single browser tab per run. Starter question-bank fixture of
~15 programming-logic questions (enough to avoid immediate repeats per spec Edge Cases); a handful of waves per
run, a small bounded set of difficulty tiers (spec Assumptions).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Language | Spec/plan/tasks in English; all in-game text, `perguntas.js` content, README, and code comments in pt-BR | PASS (planned) |
| II. Technology Stack | Plain HTML/CSS/vanilla JS only, no frameworks/bundlers/deps/servers, works via double-click + offline | PASS — no dependency introduced by this plan |
| III. Arcade Identity | Short waves, immediate feedback (sound + explanation on every answer), skill-rewarding score | PASS (spec US1–US2) |
| IV. Sound | Web Audio API sound effects + music, mute via keyboard + on-screen button, persisted choice, no audio files | PASS (spec US3, FR-010/011) |
| V. Ranking | Top-10, 3-letter initials, `localStorage`, per-machine, works (without saving) when storage unavailable | PASS (spec US3, FR-012) |
| VI. Question Bank Contract | `perguntas.js` with `PERGUNTAS = [{q,a,e,m}]`, correct answer always index 0 pre-shuffle, missing/empty bank disables start with a warning | PASS (spec FR-004, FR-013) |
| VII. Educational Purpose | No harsh punishment for a wrong answer (streak-only reset, no life lost), explanation always shown, end summary reviews mistakes | PASS (spec FR-005/006/009) |
| VIII. Content Originality | Starter question fixture MUST be original, not copied from exams/textbooks; credits kept in README | PASS (process constraint on Phase 1/implementation content) |
| IX. Versioning and Releases | Out of scope for this feature; first tagged release happens once the loop is playable (tracked at repo level, not blocked by this plan) | N/A for this feature |
| X. Spec-Driven Workflow | This feature has an approved spec (`spec.md`) before this plan; branch `001-core-gameplay` already created; `specs/001-core-gameplay/` will be committed with the code | PASS |
| XI. Quality Gates | Gated at `/speckit-implement`/PR time: playable start-to-finish, sound/mute work, this plan's Constitution Check passes, README updated, reviewed | Tracked, not yet satisfied |

No violations requiring justification — the Complexity Tracking table below is empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-gameplay/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html              # Single entry point; double-click to play (Principle II)
css/
└── style.css            # Arcade look: cabinet framing, HUD, screens (start/run/game-over)
js/
├── main.js               # Boot: wires screens together, start/game-over screen logic
├── game.js                # Core loop: ship, waves, enemies, collisions, lives, difficulty tiers
├── quiz.js                # Question flow: draw from PERGUNTAS, shuffle alternatives, no-immediate-repeat, scoring/streak
├── audio.js                # Web Audio API sound effects + music, mute state (persisted via ranking.js's storage helper)
└── ranking.js               # localStorage-backed top-10 ranking and mute-preference persistence, storage-unavailable fallback
perguntas.js             # Question bank content (constitution Question Bank Contract); kept at repo root, outside js/, so an educator finds and edits it without digging into code
```

**Structure Decision**: Single static-site project (no `src/`, no backend, no `tests/` tree) — the
constitution fixes a zero-dependency, zero-build client-side game, so the "Option 1: Single project" template
layout is replaced with a flat, browser-loadable structure. `perguntas.js` stays at the repository root (not
nested under `js/`) specifically so it is the obvious, easy-to-find file for a non-programmer educator to
edit, per Principle VI's intent.

## Complexity Tracking

*No entries — Constitution Check has no unresolved violations.*
