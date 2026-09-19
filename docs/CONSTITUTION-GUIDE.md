# Constitution guide — what we define centrally

The **constitution** (`.specify/memory/constitution.md`) is the one document that every Spec Kit command
reads: `/speckit-plan` checks the design against it, `/speckit-analyze` treats any violation as CRITICAL,
and `/speckit-implement` follows it while coding. That makes it the right place for rules that must hold
in **every** game — and the wrong place for anything about a single game.

Status today: the file in this repo is still the **unfilled template** (`[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`, …).
Until it is filled, the "central rules" idea has no effect. The decisions below are the content to put in it.

## Decisions already taken by the group

| Topic | Decision |
|---|---|
| Spec Kit documentation (constitution, specs, plans, tasks, this repo's docs) | **English** (course requirement) |
| The games themselves (in-game text, questions, explanations, game README) | **Portuguese** |
| Tech stack | Plain **HTML + CSS + JavaScript**, no build step, no dependencies, opened straight from a folder |
| Question bank | A separate **`perguntas.js`** file |
| Ranking | Always **local to the browser** |
| Versioning | Semantic versioning through **GitHub** (tags and Releases) |
| Look and feel | **Period arcade** (1980s cabinet style) **with sound** |

## Recommended structure

```
# Arcade-IFES Games Constitution

## Part I — Arcade-IFES Common Rules   (owned by the central repo; never edited in a game repo)
### I.    Language
### II.   Technology stack
### III.  Arcade identity
### IV.   Sound
### V.    Ranking
### VI.   Question bank contract
### VII.  Educational purpose
### VIII. Content originality
### IX.   Versioning and releases
### X.    Spec-driven workflow
### XI.   Quality gates
## Governance                            (how Part I is amended and versioned)

## Part II — Game-Specific Rules         (empty in central; each game fills its own)
```

Splitting Part I / Part II is what makes syncing possible (README, section 6): a game can receive a new Part I
without losing its own Part II.

## Part I — proposed content

Everything below reflects the decisions above plus what **Orbita-do-Saber** already does. Rules marked *(assumed)*
are my reading of what the group said and are worth a quick confirmation.

| # | Principle | Proposed rule |
|---|---|---|
| I | **Language** | Spec Kit artifacts (constitution, specs, plans, tasks, checklists, central docs) are written in **English**. Everything the player sees or the teacher edits — menus, messages, questions, explanations, the game's README — is **Portuguese (pt-BR)**. When a spec mentions in-game text, it quotes it in Portuguese. *(assumed: game source code and comments follow the game, i.e. Portuguese, as in Orbita-do-Saber; commit messages too.)* |
| II | **Technology stack** | HTML, CSS and vanilla JavaScript only. No frameworks, no bundlers, no `npm install`, no server. The game opens by double-clicking the HTML file and works offline (external web fonts are allowed only with a system-font fallback). |
| III | **Arcade identity** | Golden-age arcade look and feel: cabinet-style presentation, short sessions, immediate feedback and a score that rewards skill. **Difficulty, controls and supported devices are deliberately not fixed here** — each game defines them in its own spec and Part II. |
| IV | **Sound** | Every game has sound effects **and** music, with a mute control (keyboard shortcut plus an on-screen button) whose choice is remembered in the browser. Sound is generated in real time with the Web Audio API so the game needs no audio files *(assumed — same approach as Orbita-do-Saber)*. |
| V | **Ranking** | Top 10 with three-letter initials, stored in the browser (`localStorage`). Each machine keeps its own ranking. No servers, accounts or network calls. The game must keep working when browser storage is unavailable. |
| VI | **Question bank contract** | Questions live in `perguntas.js`, separate from the game, so a teacher can edit them without touching game code. Format: `const PERGUNTAS = [{ q, a, e, m }, …]` where `q` = statement, `a` = alternatives with the **first one always correct** (the game shuffles them), `e` = short explanation shown after answering, `m` = subject used for balanced drawing. If the file is missing or empty the game shows a clear warning and disables the start button instead of crashing. Any extra limits (for example maximum alternative length) belong to the individual game. |
| VII | **Educational purpose** | Every game teaches something. A wrong answer never punishes harshly; the correct answer and its explanation are always shown, and the end-of-match summary reviews mistakes. The learning content must not take over the arcade loop. |
| VIII | **Content originality** | Questions, art and music are original or properly licensed. Do not copy from exams (ENEM, vestibulares), textbooks or other games. Credits appear in the game's README. |
| IX | **Versioning and releases** | Every game uses semantic versioning (`MAJOR.MINOR.PATCH`), published on GitHub as tags (`vX.Y.Z`) and Releases, and shows its current version in the game. **How** the game automates this is up to the game (the GitHub Actions workflow in Orbita-do-Saber is a possible reference, not a shared file). |
| X | **Spec-driven workflow** | No code without an approved spec → plan → tasks for that feature. One feature per branch and Pull Request; `specs/NNN-…/` is committed together with the code. Specs stay technology-agnostic (the stack is already fixed by principle II). |
| XI | **Quality gates** | A feature is merged only if: the game starts and is playable start-to-finish on the devices its own spec declares; sound and mute work; the plan's *Constitution Check* passes; the game's README is updated; a second member reviewed the PR. |
| — | **Governance** | Part I changes only through a Pull Request to the central repo, with a version bump (MAJOR = removes or redefines a rule, MINOR = adds a rule, PATCH = wording) and an announcement to the group. Game repos sync Part I deliberately (README, section 6). Part II is owned by the game. |

## Optional: make the rules easier to follow

- **A spec template nudge.** If we want every spec to state the learning subject, controls, difficulty and scoring,
  add those as mandatory sections in `.specify/templates/spec-template.md`. Nothing else needs to be shipped in the
  template: the constitution only says what every game must have, and each game implements it its own way.

## Ready-to-run prompt

Run this **once, in the central repo**. It contains no blanks.

```
/speckit-constitution Create the constitution for the "Arcade-IFES Games" project, written in English, with this structure:
"Part I — Arcade-IFES Common Rules" (shared by every game, never edited inside a game repo), a Governance section, and an
empty "Part II — Game-Specific Rules" that each game repository will fill. Set version 1.0.0 and today's date as ratified.

Part I principles:
I. Language — Spec Kit artifacts (constitution, specs, plans, tasks, checklists, central docs) are in English. Everything the
player sees or a teacher edits (menus, messages, questions, explanations, the game's README) is in Brazilian Portuguese; game
source code and comments follow the game and are in Portuguese. Specs quote in-game text in Portuguese.
II. Technology stack — plain HTML, CSS and vanilla JavaScript only; no frameworks, bundlers, npm dependencies or servers; the
game opens from a folder by double-clicking the HTML file and works offline (web fonts only with a system-font fallback).
III. Arcade identity — golden-age arcade look and feel, short sessions, immediate feedback, a score that rewards skill.
Difficulty, controls and supported devices are deliberately not fixed by the constitution: each game defines them in its own
spec and Part II.
IV. Sound — sound effects and music in every game, with a mute control (keyboard shortcut and on-screen button) remembered in
the browser; sound generated in real time with the Web Audio API, no audio files.
V. Ranking — top 10 with three-letter initials stored in the browser (localStorage); each machine keeps its own ranking; no
servers, accounts or network calls; the game keeps working when browser storage is unavailable.
VI. Question bank contract — questions live in a separate file named perguntas.js with the format
const PERGUNTAS = [{ q, a, e, m }]: q is the statement, a is the list of alternatives with the first one always correct (the
game shuffles them), e is a short explanation shown after answering, m is the subject used for balanced drawing. If the file
is missing or empty the game shows a clear warning and disables the start button.
VII. Educational purpose — every game teaches something; wrong answers never punish harshly; the correct answer and its
explanation are always shown; the end-of-match summary reviews mistakes; learning content must not take over the arcade loop.
VIII. Content originality — questions, art and music are original or properly licensed; no copying from exams, textbooks or
other games; credits go in the game's README.
IX. Versioning and releases — every game uses semantic versioning (MAJOR.MINOR.PATCH), published on GitHub as tags (vX.Y.Z) and
Releases, and shows its current version in the game; how the game automates this is up to the game.
X. Spec-driven workflow — no code without an approved spec, plan and tasks; one feature per branch and Pull Request; specs stay
technology-agnostic because the stack is fixed by principle II.
XI. Quality gates — a feature is merged only if the game is playable start-to-finish on the devices its spec declares, sound and mute work,
the Constitution Check passes, the game's README is updated, and a second member reviewed the Pull Request.

Governance: Part I changes only through a Pull Request to the central repository with a semantic version bump (MAJOR removes or
redefines a rule, MINOR adds a rule, PATCH is wording) and an announcement to the group; game repositories sync Part I
deliberately; Part II belongs to each game and is where it states its difficulty, controls and supported devices.
```

## Amending later

- **Central rule change:** `/speckit-constitution <what changes>` in the central repo → review the diff → PR → announce → games sync.
- **Game-only rule:** `/speckit-constitution` in the game repo, touching **Part II only**.
- After any amendment, run `/speckit-analyze` on the features in progress.
