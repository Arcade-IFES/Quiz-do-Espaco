# Quickstart: Validate Core Gameplay

Manual validation guide — no build step, no test runner (constitution Principle II).

## Prerequisites

- A current desktop browser (Chrome, Firefox, or Edge).
- This feature implemented at the repository root: `index.html`, `css/style.css`, `js/*.js`, `perguntas.js`
  (see `plan.md` → Project Structure, and `contracts/perguntas-contract.md` for the question bank shape).

## Run it

1. Double-click `index.html` (or open it via `File → Open` in the browser). No server, no `npm install`,
   no internet connection required.
2. Confirm the start screen appears with a visible top-10 ranking (empty list is fine on first run) and a
   start control.

## Scenario 1 — Full run loop (spec User Story 1)

1. Click/press start. Confirm the first wave of enemies appears and the ship responds to keyboard movement.
2. Clear the wave's enemies. Confirm a question appears with shuffled alternatives.
3. Answer correctly. Confirm: the explanation shows, score increases, the next wave starts.
4. On a later wave, answer incorrectly on purpose. Confirm: the explanation still shows, score does not
   increase, no life is lost for the wrong answer, and the run continues.
5. Let an enemy reach the ship. Confirm exactly one life is lost.
6. Lose all lives. Confirm the run ends and a summary appears listing every missed question with its
   explanation.

**Pass condition**: every check above holds; SC-001 (first question within 30s of starting) and SC-003 (100%
of runs show a complete missed-question summary) are satisfied.

## Scenario 2 — Adaptive difficulty (spec User Story 2)

1. Start a new run and answer 3 questions correctly in a row.
2. Confirm the following wave's enemies are visibly faster and the next question is drawn from a harder tier
   (cross-check against the tier's configured subject/difficulty in `js/game.js`).
3. Answer incorrectly once. Confirm the difficulty tier steps down by one (not to zero, not run-ending).
4. Repeat wrong answers until at the easiest tier, then answer incorrectly again. Confirm the tier does not
   go below the floor.

**Pass condition**: SC-002 (visibly increasing difficulty within the same run for a player answering ≥70%
correctly) is satisfied.

## Scenario 3 — Sound, mute, ranking (spec User Story 3)

1. During a run, confirm sound effects play on fire, hit, correct answer, and wrong answer, plus background
   music.
2. Press the mute keyboard shortcut. Confirm all sound stops immediately and the on-screen mute button
   reflects the muted state. Reload the page; confirm it is still muted.
3. Un-mute via the on-screen button; confirm sound resumes.
4. Finish a run with a score that qualifies for the top 10. Confirm an initials prompt (3 letters) appears and
   the score is inserted into the ranking at the correct rank on the start screen.
5. Finish a run with a low score that does not qualify. Confirm no initials prompt appears and the ranking is
   unchanged.
6. In the browser's dev tools, block `localStorage` (or use a private window with storage disabled) and
   repeat a full run. Confirm the game still completes and shows the final score without crashing, even
   though nothing is saved.

**Pass condition**: SC-004 (mute + ranking persist when storage is available; no crash when it is not).

## Scenario 4 — Missing question bank (spec Edge Cases, FR-013)

1. Temporarily rename or empty `perguntas.js`.
2. Reload `index.html`. Confirm a clear warning is shown and the start control is disabled (no crash, no
   silent failure).
3. Restore `perguntas.js`.

## Done when

All four scenarios pass in at least one supported desktop browser, and the constitution's Quality Gate
(Principle XI: playable start-to-finish, sound/mute work) is satisfied ahead of opening the Pull Request.
