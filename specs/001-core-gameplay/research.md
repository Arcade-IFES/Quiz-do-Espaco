# Phase 0 Research: Core Gameplay

The constitution already fixes the stack (plain HTML/CSS/vanilla JS, Web Audio API, `localStorage`), so there
are no technology-choice unknowns to research. The open questions below are implementation-approach decisions
needed to turn the spec into a buildable plan.

## Rendering approach

- **Decision**: Render the ship, enemies, and projectiles on an HTML5 `<canvas>` with `requestAnimationFrame`;
  render the question overlay, HUD (score/lives), and menus as regular DOM elements positioned above the
  canvas.
- **Rationale**: Canvas is the natural fit for a moving-sprite arcade loop (Principle III) and needs no
  external library. DOM for the question/menu UI gives free text layout, accessibility, and touch-target
  sizing (44×44px per Part II) without hand-rolling hit-testing for buttons on canvas.
- **Alternatives considered**: Pure DOM/CSS sprites (rejected — harder to keep 60fps with many moving enemies);
  a canvas-drawn question UI (rejected — reinvents text layout/touch targets the DOM already gives for free).

## Sound synthesis approach

- **Decision**: One shared `AudioContext` created on first user interaction (autoplay-policy compliant),
  short synthesized effects (`OscillatorNode` + `GainNode` envelopes) for fire/hit/correct/wrong, and a simple
  generative/looping background pattern for music. Mute sets `GainNode` gain to 0 rather than stopping nodes,
  so toggling is instant and glitch-free.
- **Rationale**: Matches Principle IV exactly (no audio files, real-time generation) and keeps the mute control
  simple and reliable.
- **Alternatives considered**: Pre-recorded audio files (forbidden by Principle IV); `<audio>` element beeps
  (rejected — far less control over the arcade "feel" and over instant mute).

## Persistence schema (`localStorage`)

- **Decision**: Two keys under a namespaced prefix, e.g. `quizDoEspaco.ranking` (JSON array of
  `{ initials, score }`, max 10, sorted desc) and `quizDoEspaco.muted` (`"true"`/`"false"`). All reads/writes
  go through `js/ranking.js`, wrapped in `try/catch`; on failure, in-memory fallbacks are used so the run
  still completes per spec FR-012.
- **Rationale**: A small, explicit schema is easy for the next feature (`002-question-system` or
  `003-scoring-and-ranking`, per the central README's example feature breakdown) to extend without migration
  concerns, and namespacing avoids clashing with any other script on a shared `file://` origin.
- **Alternatives considered**: `sessionStorage` (rejected — ranking and mute must survive across sessions, not
  just page reloads within one tab); `IndexedDB` (rejected — unnecessary complexity for ≤10 small records).

## Difficulty tiering

- **Decision**: A small fixed array of tiers (e.g., 4 tiers: 0–3), each defining enemy speed multiplier and
  the question-difficulty tag(s) eligible to be drawn. Tier increases by one after every 3 consecutive correct
  answers; tier decreases by one (floor 0) on any wrong answer. Tier state resets to 0 at the start of each run
  (spec Edge Cases: no run is restored across reloads).
- **Rationale**: Directly implements spec User Story 2 and the constitution's "discrete waves" difficulty
  model (Part II) with a rule simple enough to unit-check from the browser console without a test framework.
- **Alternatives considered**: Continuous difficulty scaling (rejected — constitution specifies discrete
  steps); per-question timers driving difficulty (rejected — spec Assumptions explicitly excludes time limits).

## Question selection (no immediate repeat)

- **Decision**: Track the last-asked question's id; when drawing the next question, filter it out of the
  eligible pool for the current difficulty tier before random selection, unless the pool for that tier has
  only one question (then allow the repeat, per spec Edge Cases).
- **Rationale**: Matches the spec's edge case exactly with a minimal, dependency-free algorithm.
- **Alternatives considered**: Full shuffle-bag across all difficulty tiers (rejected — would let an easy
  question appear at a hard tier, contradicting the adaptive-difficulty requirement).

## Outcome

All unknowns from the Technical Context are resolved above; none remain marked `NEEDS CLARIFICATION`.
