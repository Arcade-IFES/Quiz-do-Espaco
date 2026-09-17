<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: PRINCIPLE_1_NAME -> I. Web-Native Arcade Foundation;
	PRINCIPLE_2_NAME -> II. Educator-Editable Content;
	PRINCIPLE_3_NAME -> III. Learning-First Arcade Mechanics;
	PRINCIPLE_4_NAME -> IV. Fair Competition and Accessible Controls;
	PRINCIPLE_5_NAME -> V. Feedback, Presentation, and Documentation
- Added sections: Technology and File Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Follow-up TODOs: RATIFICATION_DATE is unknown and requires confirmation.
-->

# Ifes Educational Arcade Games Constitution

## Core Principles

### I. Web-Native Arcade Foundation
Every game MUST use HTML5, CSS3, and standard JavaScript as its core stack. Canvas 2D
MUST be used for the interactive arcade playfield when the game requires real-time
rendering; HTML and CSS MUST be used for menus, HUDs, instructions, results, and other
interface content. The game MUST run in a current desktop browser without a build step,
package installation, or required runtime dependency. Browser APIs such as Web Audio API,
LocalStorage, Pointer Events, and Canvas are permitted. External resources MUST have a
local fallback or the game MUST remain playable when the resource is unavailable.

This preserves the zero-install, directly runnable format shared by the reference games
while keeping deployment and classroom maintenance simple.

### II. Educator-Editable Content
The question bank MUST be stored separately from game logic in a file named
`perguntas.js`, loaded explicitly by the main HTML entry point. Each question MUST use
the following structure: `q` for the prompt, `a` for an array of answer choices with the
correct answer at index zero, `e` for a concise explanation, and `m` for the subject or
topic. Games MUST shuffle displayed choices without changing the source correctness
contract. Choices MUST be short enough for the chosen playfield, while prompts and
explanations MAY be longer and must remain readable.

The game MUST validate that the bank exists and is non-empty, fail with a clear user-facing
message rather than a runtime crash, and allow an educator to add or revise questions
without editing game mechanics. When multiple subjects exist, question selection MUST
shuffle within subjects and interleave subjects to avoid repetitive runs and improve
coverage. The separated bank, schema, and balanced selection are adopted from the most
maintainable reference implementation, Órbita do Saber.

### III. Learning-First Arcade Mechanics
Every question MUST be integrated into the core game loop and MUST produce immediate,
legible feedback. A correct answer MUST provide a meaningful game consequence such as
score, combo, progress, experience, or a power-up. An incorrect answer MUST show the
correct answer and its explanation during or after the round, and MUST be recorded for a
review summary when the game has a results screen.

Games MUST encourage informed attempts: an educational mistake MUST NOT silently end a
round, and question failure SHOULD cost the current reward before it costs a life unless
the specification explicitly justifies another rule. Difficulty MAY increase through
gameplay, but the question text, choices, and feedback MUST remain understandable and
must not be obscured by action effects.

### IV. Fair Competition and Accessible Controls
Each game MUST define a deterministic, documented scoring model; a visible score; a
visible life, health, or equivalent failure state; and a clear game-over condition. A
combo or multiplier MAY reward skill, but taking damage MUST have a documented effect on
that multiplier. The default starting state MUST use three lives or an equivalent
three-attempt model unless the game's mechanics make that inappropriate.

The game MUST provide keyboard controls and touch controls for every essential action.
Keyboard controls MUST include a documented alternative where practical; touch controls
MUST be visible on small or coarse-pointer screens, support press and release behavior,
and prevent accidental page scrolling during play. Pointer, touch, and keyboard input
MUST share the same game actions rather than separate implementations. A leaderboard MUST
store at least score and a meaningful progress metric, retain a documented top-ten limit
by default, and isolate persistence behind small load/save functions so local storage can
be replaced by an Ifes-hosted service without rewriting game logic.

The shared, comparable difficulty and three-life model from Órbita do Saber are preferred
for class rankings; a game that intentionally differs MUST document why.

### V. Feedback, Presentation, and Documentation
Audio and visuals MUST communicate game state, action, success, failure, and educational
feedback. Games MUST provide synthesized or bundled sound effects through a user-initiated
audio context, handle browsers that block audio, and remain playable with audio disabled.
Visual feedback MUST include readable HUD state and distinct success and error states;
Canvas effects such as particles, glow, screen shake, sprites, or animation MAY be used
when they do not reduce text legibility or accessibility. Layouts MUST resize for desktop
and mobile viewports without clipping essential controls or questions.

Every game MUST include a `README.md` written in English that documents its purpose,
educational audience, setup and local execution, controls for keyboard and touch, game
rules, scoring and lives, question-bank schema and editing procedure, leaderboard
persistence, technology choices, file structure, and known limitations. All specs, plans,
tasks, source code, comments, commit messages, README content, and other documentation
MUST be written in English, even when the game teaches content originally authored in
Portuguese.

## Technology and File Constraints

The minimum project structure is:

```text
<game-name>.html   # Entry point, interface, rendering, and game logic
perguntas.js       # Educator-editable question bank
README.md          # English project documentation
```

The main HTML file MAY be split into additional JavaScript or CSS files when that improves
maintainability, but the entry point MUST remain obvious and the question bank MUST remain
independent. New dependencies, frameworks, build tools, network services, or asset
pipelines require a documented rationale in the README and MUST NOT be necessary for a
basic local run. Repository names, public identifiers, and user-facing game text SHOULD
avoid relying on a single game-specific character, level, enemy, or setting.

## Development Workflow and Quality Gates

Before implementation, the specification MUST define the educational objective, target
audience, question interaction, controls, scoring, lives, leaderboard behavior, audio and
visual feedback, responsive behavior, and file structure. The plan and tasks MUST preserve
the constitution's English-only and separated-question-bank requirements.

Before review, a game MUST be checked in a current desktop browser and a narrow or touch
viewport. Review MUST verify that the game starts, the question bank loads and validates,
keyboard and touch actions work, correct and incorrect answers produce their documented
effects, lives reach game over correctly, results and ranking persist as documented, and
audio failure does not block play. The README MUST be checked against the implemented
controls, files, and execution steps. Any deliberate deviation from a principle MUST be
recorded in the plan and README with its educational or technical rationale.

## Governance

This constitution is the highest-level project guidance for the Ifes educational arcade
collection. Specifications, plans, tasks, implementation reviews, and README files MUST
identify any conflict with it. A deviation requires explicit rationale, review approval,
and a documented migration or compatibility plan when existing games are affected.

Amendments MUST update this file, include a Sync Impact Report at the top for human review,
state the reason for the change, and update the version and last-amended date. Versioning
uses semantic versioning: MAJOR for incompatible removals or redefinitions, MINOR for new
principles or materially expanded requirements, and PATCH for clarifications or wording
that does not change obligations. Every pull request or equivalent review MUST verify
constitution compliance and resolve all unexplained TODOs before release. The constitution
MUST be reviewed whenever the common game template, platform integration, or educational
requirements change.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-09-16
