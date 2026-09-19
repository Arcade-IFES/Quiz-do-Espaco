# Feature Specification: Core Gameplay

**Feature Branch**: `001-core-gameplay`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Jogador pilota uma nave, atira em ondas de inimigos e responde perguntas de
logica de programacao para avancar; pontuacao, vidas, som e ranking local seguem a constituicao do jogo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a full run and get scored (Priority: P1)

A student opens the game, starts a run, pilots a ship against waves of enemies, and clears each wave by
correctly answering a programming-logic question. The run ends when the player runs out of lives or clears
the available waves, and the player sees a final score.

**Why this priority**: This is the entire arcade loop. Without it there is no playable game and nothing else
in this feature has value on its own.

**Independent Test**: Start a run, survive at least one wave by answering a question correctly, and confirm
the score increases and the next wave begins. This alone is a demonstrable, playable slice.

**Acceptance Scenarios**:

1. **Given** the start screen, **When** the player starts a run, **Then** the first wave of enemies appears
   and the player's ship responds to movement input.
2. **Given** an active wave, **When** the player defeats the wave's enemies, **Then** a question is presented
   before the next wave begins.
3. **Given** a question is on screen, **When** the player selects the correct alternative, **Then** the
   correct answer and its explanation are shown, points are added, and the next wave starts.
4. **Given** a question is on screen, **When** the player selects a wrong alternative, **Then** the correct
   answer and its explanation are shown, no points are added, the player's streak resets, and the run
   continues (no life is lost for a wrong answer).
5. **Given** an active wave, **When** an enemy reaches the player's ship, **Then** the player loses one life.
6. **Given** the player has lost all lives, **When** the last life is lost, **Then** the run ends and a
   summary screen shows the final score and the questions the player missed.

---

### User Story 2 - Difficulty responds to the player's streak (Priority: P2)

As the player answers several questions correctly in a row, waves get faster and questions get harder; a
wrong answer eases the difficulty back by one step instead of ending the run, so the player is never stuck
facing content far above their level.

**Why this priority**: This delivers the adaptive-difficulty rule from the constitution (Part II) and keeps
the game fair and motivating, but the game is already playable end-to-end without it (User Story 1 covers the
MVP loop with flat difficulty).

**Independent Test**: Play several waves answering correctly every time and observe enemy speed and question
difficulty increase; then answer incorrectly once and observe the difficulty step back down rather than the
run ending.

**Acceptance Scenarios**:

1. **Given** the player has answered 3 questions correctly in a row, **When** the next wave starts, **Then**
   enemies move faster and the next question is drawn from a harder difficulty tier than the starting tier.
2. **Given** the player is at a raised difficulty tier, **When** the player answers a question incorrectly,
   **Then** the difficulty tier steps down by one level for the following wave instead of resetting to zero
   or ending the run.
3. **Given** the player is already at the easiest difficulty tier, **When** the player answers incorrectly,
   **Then** the difficulty tier stays at the easiest level (it does not go below the floor).

---

### User Story 3 - Sound, mute, and local ranking (Priority: P3)

The game plays sound effects and background music during the run, the player can mute audio at any time and
the game remembers that choice, and after a run ends the player can enter three-letter initials that are
saved to a local top-10 ranking shown on the start screen.

**Why this priority**: Required by the constitution (Principles IV and V) and expected of an arcade game, but
it does not block the core play loop (User Stories 1–2) from being built, tested, and demoed first.

**Independent Test**: Toggle mute on and off (keyboard shortcut and on-screen button) and confirm audio state
persists after reloading the page; finish a run, enter initials, and confirm the run's score appears in a
top-10 list ordered from highest to lowest score.

**Acceptance Scenarios**:

1. **Given** a run is in progress, **When** the player fires, is hit, answers correctly, or answers
   incorrectly, **Then** a corresponding sound effect plays (unless muted).
2. **Given** the game is playing sound, **When** the player mutes via the keyboard shortcut or the on-screen
   button, **Then** all sound stops immediately and the button reflects the muted state.
3. **Given** the player has muted the game, **When** the page is reloaded, **Then** the game remains muted.
4. **Given** a run has just ended, **When** the final score qualifies for the top 10, **Then** the player is
   prompted for three-letter initials and the score is added to the ranking in the correct rank position.
5. **Given** a run has just ended, **When** the final score does not qualify for the top 10, **Then** no
   initials prompt is shown and the existing ranking is unchanged.
6. **Given** browser storage is unavailable or blocked, **When** a run ends, **Then** the game still shows the
   final score and summary without crashing, even though the ranking cannot be saved.

---

### Edge Cases

- What happens when the question bank (`perguntas.js`) is missing or empty? The game MUST show a clear
  warning on the start screen and disable the start control, per the constitution's Question Bank Contract.
- What happens when two enemies reach the player's ship at the same moment? Each MUST cost a separate life,
  and the run MUST end immediately if that reduces lives to zero, without waiting for further input.
- What happens if the player does not answer a question (leaves it idle)? The question MUST wait for an
  answer with no time limit, so a slow reader is never penalized by a clock; this is a deliberate scope
  boundary (see Assumptions).
- What happens when the player's streak/difficulty state is mid-run and the page is reloaded? The active run
  MUST NOT be restored; the player returns to the start screen and the saved ranking (only) is retained.
- What happens when the question bank has fewer questions than needed to avoid immediate repeats? The game
  MUST avoid showing the same question twice in a row when at least one alternative exists, and MAY repeat
  otherwise rather than failing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST present a start screen that lets the player begin a run and shows the current
  top-10 local ranking.
- **FR-002**: The game MUST let the player move a ship and fire at enemies during a wave, using either
  keyboard controls or on-screen touch controls (per the constitution, Part II).
- **FR-003**: The game MUST organize a run into waves of enemies; clearing a wave's enemies MUST trigger a
  question before the next wave starts.
- **FR-004**: The game MUST draw each question from the question bank (`perguntas.js`), shuffle its
  alternatives so the correct one is not always in the same position, and never expose which alternative is
  correct before the player answers.
- **FR-005**: The game MUST award points and increase the player's correct-answer streak when a question is
  answered correctly, and MUST show the explanation text (`e`) after every answer, right or wrong.
- **FR-006**: The game MUST reset the player's correct-answer streak, but MUST NOT deduct previously earned
  points, when a question is answered incorrectly.
- **FR-007**: The game MUST reduce the player's lives by one each time an enemy reaches the ship, and MUST
  end the run when lives reach zero.
- **FR-008**: The game MUST raise wave difficulty (enemy speed and question difficulty tier) as the streak
  grows, and MUST lower the difficulty tier by one step (not end the run) on a wrong answer, per User Story 2.
- **FR-009**: The game MUST show an end-of-run summary listing the final score and every question the player
  missed, each with its explanation, per the constitution's Educational Purpose principle.
- **FR-010**: The game MUST play sound effects for firing, being hit, correct answers, and wrong answers, and
  background music during a run, generated in real time (no external audio files), per the constitution.
- **FR-011**: The game MUST provide a mute control reachable by keyboard shortcut and by an on-screen button,
  and MUST persist the player's mute choice across page reloads using browser storage.
- **FR-012**: The game MUST keep a top-10 local ranking (three-letter initials plus score) stored in the
  browser, prompt for initials only when a run's score qualifies for the top 10, and MUST continue to
  function (without saving) when browser storage is unavailable.
- **FR-013**: The game MUST show a clear warning and disable the start control when the question bank is
  missing or empty, instead of crashing or starting a run with no questions.
- **FR-014**: The game MUST remain fully playable using keyboard alone or touch alone; no single control
  scheme MUST be required to complete a run.

### Key Entities

- **Run**: One playthrough from start to game-over. Tracks current score, current lives, current streak,
  current difficulty tier, and the list of missed questions for the end-of-run summary. Not persisted across
  page reloads.
- **Wave**: A group of enemies the player must clear before the next question is shown. Has a speed/intensity
  that scales with the run's current difficulty tier.
- **Question**: One entry from the question bank (`perguntas.js`): a statement, a set of alternatives with
  exactly one correct, an explanation, and a subject tag, as defined by the constitution's Question Bank
  Contract.
- **Ranking Entry**: Three-letter initials plus a score, one of at most 10 entries kept in browser storage,
  ordered from highest to lowest score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time player can go from the start screen to their first question within 30 seconds of
  starting a run, without instructions beyond what is shown on screen.
- **SC-002**: A player who answers at least 70% of questions correctly experiences visibly increasing
  difficulty (faster waves, harder questions) within the same run.
- **SC-003**: 100% of runs that end show a summary that includes every missed question and its explanation —
  no run ends without the player being able to see what they got wrong and why.
- **SC-004**: A player's mute preference and top-10 ranking survive a page reload in 100% of cases where
  browser storage is available, and the game never crashes when it is not.
- **SC-005**: A single run (start to game-over at default difficulty) is completable within a single class
  period (a few minutes), matching the constitution's target audience and session-length expectation.

## Assumptions

- Questions have no per-question time limit; only overall wave/enemy pressure creates urgency. This keeps
  the feature scope to the core loop and avoids adding a timer system not requested in the input description.
- A "run" is single-player, single-device, with no accounts or network play, consistent with the
  constitution's offline, server-less design (Principles II and V).
- The initial question bank content itself (writing the actual programming-logic questions) is not part of
  this feature; this feature only requires that `perguntas.js` exist in the contracted shape (constitution,
  Question Bank Contract) — a starter set of questions is provided as fixture content so the loop is testable,
  and growing the bank is expected to continue afterward.
- "Wave" is the unit of progression between questions; the exact number of enemies per wave and the exact
  number of waves in a run are implementation details left to the plan, not fixed by this spec.
- Difficulty tiers are a small, bounded set (not a continuous scale), consistent with "discrete waves" in the
  constitution's difficulty model.
