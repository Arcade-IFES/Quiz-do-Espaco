# Spec Kit commands — short guide

Spec Kit (installed version 1.0.7) is *Spec-Driven Development*: we write **what** the game must do first,
then **how**, then break it into tasks, and only then does the AI agent write code.
The specification is the source of truth; code follows it.

## How to call the commands

| Agent | Syntax | Where the commands live |
|---|---|---|
| Claude Code | `/speckit-specify`, `/speckit-plan`, … | `.claude/skills/speckit-*/SKILL.md` |
| GitHub Copilot | `/speckit.specify`, `/speckit.plan`, … (the separator is set in `.specify/integration.json`; check what your editor shows) | `.github/skills/speckit-*/SKILL.md` |

Everything after the command name is free text (the "arguments"), for example
`/speckit-specify A quiz round where the player shoots the correct answer`.
This guide uses the Claude Code spelling.

## The flow

```
 once per repo              once per FEATURE (repeat for every feature of the game)
 ──────────────     ─────────────────────────────────────────────────────────────────────────
 constitution  →  specify → (clarify) → plan → tasks → (analyze) → implement → converge ─┐
                                                                         ▲──────────────┘
                                                                repeat until "converged"
```

Optional helpers: `checklist` (any time after `specify`), `taskstoissues` (after `tasks`).

## Command reference

| Command | Use it when | What it does | Creates / changes |
|---|---|---|---|
| `/speckit-constitution` | Once per repo; again only to amend rules | Creates or updates the **project rules** every later command must respect. Bumps the constitution version. | `.specify/memory/constitution.md` |
| `/speckit-specify` | Start of every feature | Turns a plain-language description into a structured spec: prioritized user stories, acceptance scenarios, functional requirements, success criteria. **Describe the *what* and *why*, not the tech stack.** Numbers the feature automatically (`001-…`). | `specs/NNN-name/spec.md`, `specs/NNN-name/checklists/requirements.md`, `.specify/feature.json` (local, git-ignored) |
| `/speckit-clarify` | After `specify`, **before** `plan`, if the spec has gaps | Asks up to 5 targeted questions and writes your answers back into the spec. | Updates `spec.md` |
| `/speckit-plan` | After the spec is approved | Reads the spec **and the constitution**, decides the technical approach (architecture and structure; the stack itself is already fixed by the constitution), fills the *Constitution Check* gate, and produces design documents. | `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/` |
| `/speckit-tasks` | After the plan | Produces an ordered, dependency-aware task list grouped by user story. | `tasks.md` |
| `/speckit-analyze` | After `tasks`, before `implement` | **Read-only** consistency check across spec, plan and tasks. Any conflict with the constitution is reported as CRITICAL. Does not edit files. | Report only |
| `/speckit-checklist` | Any time after `specify` | Generates a custom quality checklist ("unit tests for the requirements"), e.g. accessibility or controls. | `checklists/<topic>.md` |
| `/speckit-implement` | After tasks (and analyze) | Executes `tasks.md` step by step, writing the code and ticking tasks off. | Source code, `tasks.md` |
| `/speckit-converge` | After `implement` | Compares the real code with spec, plan and tasks; appends whatever is still missing to `tasks.md` as a *Convergence* phase. Run `implement` again, then `converge` again, until nothing is left. | Appends to `tasks.md` |
| `/speckit-taskstoissues` | Optional, after `tasks` | Converts the tasks into GitHub issues so the group can assign them. Needs a GitHub `origin` remote **and** the GitHub MCP server configured in your agent. | GitHub issues |

All of these files live under `specs/NNN-feature-name/`, and the folder name is also the branch name we use.

## Which command decides what?

| Question | Where it is decided |
|---|---|
| "Every game is in Portuguese, has sound, a local ranking and opens without installing anything" | **Constitution** (central, Part I) |
| "This game uses lives, a ranking and questions between waves" | **Spec** (`/speckit-specify`) and, for the whole game, **constitution Part II** |
| "Canvas or DOM? How are the waves structured? Which files inside the game?" | **Plan** (`/speckit-plan`). The stack itself (plain HTML/CSS/JS, `perguntas.js`) is already fixed by the constitution |
| "Which files to create, in which order" | **Tasks** (`/speckit-tasks`) |

## Good habits

- **Do not skip the order.** `plan` needs an approved spec; `implement` needs `tasks.md`.
- **Review every generated file** (spec, plan, tasks) before running the next command. The agent proposes; the group decides.
- **Keep the spec free of tech.** If you catch yourself writing "canvas" or "JavaScript" in `/speckit-specify`, move it to `/speckit-plan`.
- **English documents, Portuguese game.** Write the command arguments and every generated document in English, but quote on-screen text in Portuguese (for example: shows "FIM DE JOGO").
- **Use `[NEEDS CLARIFICATION]` markers as a to-do list.** They mean the agent guessed nothing; answer them with `/speckit-clarify`.
- **One feature per branch, one Pull Request per feature**, with `specs/NNN-…/` committed together with the code.
- **Changing the game later?** Update the spec first (`/speckit-specify` again or edit `spec.md`), then re-run `plan`/`tasks`/`implement`.
- **A rule keeps getting broken?** It belongs in the constitution, not in a chat message.
- **Never edit the generated skills/commands to fit one game.** If a command must behave differently for all games, change it in the central repo.

## Where things are (per repo)

```
.specify/
  memory/constitution.md      shared + game rules (read by plan, analyze, implement)
  templates/                  spec / plan / tasks / checklist templates
  scripts/powershell/         helper scripts the commands call
  init-options.json, integration.json, integrations/*.manifest.json   Spec Kit bookkeeping
  workflows/                  bundled "full cycle" workflow (specify → plan → tasks → implement with review gates); not covered here
.claude/skills/               Claude Code versions of the commands
.github/skills/               GitHub Copilot versions of the commands
specs/NNN-feature-name/       one folder per feature (created by the commands)
```
