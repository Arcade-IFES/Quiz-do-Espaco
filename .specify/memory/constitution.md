# Arcade-IFES Games Constitution

## Part I — Arcade-IFES Common Rules

These rules apply to every game created from the central repository. They are owned by the central
repository and MUST NOT be edited inside a game repository. A game adds its own rules only in Part II.

### I. Language
Spec Kit artifacts (this constitution, specs, plans, tasks, checklists, and the central documentation)
MUST be written in English. Everything the player sees or an educator edits (menus, messages, questions,
explanations, and the game's own README) MUST be written in Brazilian Portuguese (pt-BR). Game source
code and comments follow the game and MUST be in Portuguese. When an English spec refers to on-screen
text, it MUST quote that text in Portuguese.

Rationale: the course requires English Spec Kit documentation, while the games serve Portuguese-speaking
students and teachers.

### II. Technology Stack
Every game MUST use plain HTML, CSS, and vanilla JavaScript only. Frameworks, bundlers, package
dependencies, and servers MUST NOT be required. The game MUST open by double-clicking its HTML file from a
folder and MUST work offline. External web fonts MAY be used only with a system-font fallback.

Rationale: a zero-install game is easy to run in a classroom and easy for a teacher to maintain.

### III. Arcade Identity
Every game MUST reproduce the look and feel of golden-age arcades: cabinet-style presentation, short
sessions, immediate feedback, and a score that rewards skill. Difficulty, controls, and supported devices
are deliberately NOT fixed by this constitution: each game MUST define them in its own spec and in Part II.

### IV. Sound
Every game MUST have sound effects and music. It MUST provide a mute control, both as a keyboard shortcut and
as an on-screen button, and MUST remember the player's choice in the browser. Sound MUST be generated in
real time with the Web Audio API, and the game MUST NOT require audio files.

### V. Ranking
Every game MUST keep a top-10 ranking with three-letter initials, stored in the browser (`localStorage`).
Each machine keeps its own ranking. The game MUST NOT depend on servers, accounts, or network calls for the
ranking, and MUST keep working when browser storage is unavailable.

### VI. Question Bank Contract
Questions MUST live in a separate file named `perguntas.js`, so an educator can edit them without touching
game code. The file MUST declare `const PERGUNTAS = [{ q, a, e, m }, ...]` where `q` is the statement, `a` is
the list of alternatives with the first one always correct (the game shuffles them), `e` is a short
explanation shown after the player answers, and `m` is the subject used for balanced drawing. If the file is
missing or empty, the game MUST show a clear warning and disable the start button instead of crashing.
Additional limits, such as the maximum length of an alternative, belong to the individual game.

### VII. Educational Purpose
Every game MUST teach something. A wrong answer MUST NOT punish harshly, and the correct answer with its
explanation MUST always be shown. The end-of-match summary MUST review the player's mistakes. Learning content
MUST NOT take over the arcade loop.

### VIII. Content Originality
Questions, art, and music MUST be original or properly licensed. Copying from exams (such as ENEM and
vestibulares), textbooks, or other games is prohibited. Credits MUST appear in the game's README.

### IX. Versioning and Releases
Every game MUST use semantic versioning (`MAJOR.MINOR.PATCH`), published on GitHub as tags (`vX.Y.Z`) and
Releases, and MUST show its current version in the game. How the game automates this is left to the game.

### X. Spec-Driven Workflow
No code MUST be written for a feature without an approved spec, plan, and tasks. Each feature MUST have its own
branch and Pull Request, and `specs/NNN-.../` MUST be committed together with the code. Specs MUST stay
technology-agnostic, because the stack is already fixed by Principle II.

### XI. Quality Gates
A feature MUST NOT be merged unless: the game starts and is playable start-to-finish on the devices its own
spec declares; sound and the mute control work; the plan's Constitution Check passes; the game's README is
updated; and a second member has reviewed the Pull Request.

## Governance

Part I changes only through a Pull Request to the central repository, with a semantic version bump and an
announcement to the group. MAJOR removes or redefines a rule, MINOR adds a rule, and PATCH is wording only.
Game repositories MUST sync Part I deliberately; they MUST NOT edit it locally. Part II belongs to each game.
Specs, plans, tasks, and Pull Requests MUST identify any conflict with this constitution, and a deviation
requires a written rationale and reviewer approval.

## Part II — Game-Specific Rules

This part is intentionally empty in the central repository. Each game repository MUST fill it with the rules
that apply only to that game, and it MUST at least state the game's difficulty model, controls, supported
devices, scoring model, subject area, and target audience.

**Version**: 2.0.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-19
