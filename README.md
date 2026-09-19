# Spec-Kit-jogos — Central Spec Repository for the Arcade-IFES Games

This repository is the **starting point of every arcade game** built by our group.
It contains no game. It contains the *rules and the tooling* that every game must start from:
the [GitHub Spec Kit](https://github.com/github/spec-kit) setup, the shared **constitution**,
the templates, and the AI-agent commands (Claude Code, Gemini CLI and GitHub Copilot).

> Read this file first. Then read [`docs/COMMANDS.md`](docs/COMMANDS.md) (what each Spec Kit command does)
> and [`docs/CONSTITUTION-GUIDE.md`](docs/CONSTITUTION-GUIDE.md) (which shared rules we define here).

---

## 1. The idea in one picture

```
   Spec-Kit-jogos  (this repo, GitHub "template repository")
   ├── .specify/memory/constitution.md   ← shared rules for ALL games
   ├── .specify/templates/               ← spec / plan / tasks templates
   ├── .specify/scripts/                 ← helper scripts used by the commands
   └── .claude/skills/  .gemini/commands/  .github/skills/  ← the /speckit-* commands
                │
                │  "Use this template"  (a copy — fresh git history)
                ▼
   Game repository  (one per game, e.g. Orbita-do-Saber)
   ├── everything above, copied
   ├── constitution.md  →  shared rules  +  the game's own rules
   ├── specs/001-…/     →  spec.md, plan.md, tasks.md … for each feature
   └── the game's source code
```

**Important — how Spec Kit really works.** Spec Kit is *per repository*: each repo has its own
`.specify/` folder and its own constitution. We found no built-in "inheritance" from a parent repo
(the official docs describe presets and extensions, but nothing that links a constitution across repos).
So our "central repo" works as a **template that is copied**. A copy does not update itself:
when the central rules change, each game repo has to pull the change on purpose (see section 6).

---

## 2. What lives where

| Item | Central repo (this one) | Each game repo |
|---|---|---|
| `.specify/memory/constitution.md` | **Part I – Arcade-IFES common rules** (owned here) | Part I copied, plus **Part II – game-specific rules** |
| `.specify/templates/`, `.specify/scripts/` | Owned here | Copied, normally left untouched |
| `.claude/skills/`, `.gemini/commands/`, `.github/skills/` | Owned here | Copied, normally left untouched |
| `README.md` | This guide | The game's own README (how to play, controls, rules) |
| `specs/` | **Empty** — no feature belongs here | One folder per feature: `specs/001-…`, `specs/002-…` |
| Game source code | Never | Yes |
| Game-specific decisions (genre, controls, difficulty, devices, scoring, subject of the questions) | Never | Yes (`/speckit-specify`, `/speckit-plan`) |

Rule of thumb: **if a rule must be true for every game, it goes in the central constitution.
If it is about one game, it goes in that game's spec/plan or in Part II of its constitution.**

---

## 2.1 Language rules

| What | Language |
|---|---|
| Spec Kit documentation and artifacts: constitution, `specs/`, plans, tasks, checklists, this repo's docs | **English** (course requirement) |
| The game: on-screen text, questions and explanations (`perguntas.js`), game README, game code and comments | **Portuguese (pt-BR)** |

When an English spec needs to mention on-screen text, it quotes the Portuguese text.

## 3. What we define in the central repository

Detailed list and a ready-to-run prompt are in [`docs/CONSTITUTION-GUIDE.md`](docs/CONSTITUTION-GUIDE.md). Summary:

1. **The constitution** (`/speckit-constitution`) — the shared principles: language rules, the fixed tech stack,
   arcade identity, sound, local ranking, the `perguntas.js` contract, versioning, educational purpose,
   quality gates, and how the constitution itself is amended.
2. **Templates** — only when we want every spec/plan to have the same shape (for example, extra mandatory
   sections such as "Learning objective" or "Controls"). Edit files in `.specify/templates/`.
3. **One AI agent set-up that works for everyone** — Claude Code (`.claude/skills/`, the default), Gemini CLI (`.gemini/commands/`) and GitHub Copilot (`.github/skills/`) are all installed;
   Spec Kit supports several agents in the same repo.
4. **This documentation.**

## 4. What we define in each game repository

1. **Part II of the constitution** — rules that only apply to this game (`/speckit-constitution`).
2. **The features**, one at a time, through the command flow (`/speckit-specify` → … → `/speckit-implement`).
   A game is usually several features, for example: `001-core-gameplay`, `002-question-system`,
   `003-scoring-and-ranking`, `004-sound`.
3. **The game's README** (how to play, controls, credits) — replace the central README.

---

## 5. Creating a new game repository from this one

### Requirements (once per machine)

- Git, and a GitHub account in the **Arcade-IFES** organization.
- [Claude Code](https://claude.com/claude-code) (or Gemini CLI / GitHub Copilot).
- [GitHub CLI](https://cli.github.com/) `gh` (optional, only for the one-line method).
- **PowerShell.** The Spec Kit helper scripts in this repo are PowerShell (`.specify/scripts/powershell/`).
  Windows already has it. On macOS/Linux install PowerShell 7 (`pwsh`) — or see "Maintainer notes" for the alternative.

### Step 1 — Create the repository from the template

*Web:* open this repository on GitHub → **Use this template** → **Create a new repository**
→ owner **Arcade-IFES**, choose the game's name → **Create repository**.

*Command line:*

```bash
gh repo create Arcade-IFES/<game-name> --template Arcade-IFES/Spec-Kit-jogos --private --clone
cd <game-name>
```

(Use `--public` instead of `--private` if the course asks for it.)

> The "Use this template" button only exists after a maintainer ticks
> **Settings → General → Template repository** in this repo (see Maintainer notes).

The new repository contains all files of the central repo's default branch, with a fresh git history.

### Step 2 — Open the agent in the new repository

```bash
claude          # Claude Code; skills in .claude/skills are loaded automatically
```

Check that typing `/speckit-` lists the commands (`speckit-specify`, `speckit-plan`, …).

### Step 3 — Add the game's own rules (once)

```
/speckit-constitution Keep Part I (Arcade-IFES common rules) exactly as is. Fill Part II with the rules
for this game: <genre, controls, difficulty, supported devices, scoring model, subject area, target audience, anything specific>.
```

### Step 4 — Build the game feature by feature

For each feature, create a branch and run the flow (details in [`docs/COMMANDS.md`](docs/COMMANDS.md)):

```bash
git switch -c 001-core-gameplay
```

```
/speckit-specify   <what the player can do, in plain language — no tech stack here>
/speckit-clarify   (optional, answer the questions)
/speckit-plan      <architecture choices; the stack is already fixed by the constitution>
/speckit-tasks
/speckit-analyze   (optional consistency check)
/speckit-implement
/speckit-converge  (repeat implement/converge until it reports converged)
```

Commit `specs/001-core-gameplay/` together with the code, open a Pull Request, and get it reviewed
against the constitution.

> This repo has no git extension installed, so `/speckit-specify` does **not** create the git branch
> by itself. Create it manually as shown above.

### Step 5 — Next feature

Return to `main`, create the next branch (`002-…`) and repeat Step 4. Spec Kit numbers the folders
in `specs/` sequentially by itself.

### Step 6 — Replace the README

Rewrite `README.md` for the game (how to play, controls, structure, credits). Keep a link back to the
central repository.

---

## 6. Keeping a game in sync with the central repo

Because a game repo is a copy, central changes do not arrive automatically. To pull them:

```bash
git remote add central https://github.com/Arcade-IFES/Spec-Kit-jogos.git    # first time only
git fetch central

# 1) Look at what changed before touching anything
git diff HEAD central/main -- .specify/memory/constitution.md .specify/templates .claude .gemini .github/skills

# 2) Tooling and templates (only if the game did not customize them)
git checkout central/main -- .specify/templates .specify/scripts .claude .gemini .github/skills

# 3) Constitution: copy ONLY Part I from central/main into your constitution.md by hand.
#    Do not overwrite the file: Part II belongs to the game.
git show central/main:.specify/memory/constitution.md
```

Then run `/speckit-analyze` on the features in progress, because a changed rule can invalidate an existing spec or plan.
When a constitution change is copied, bump the version line at the bottom of the constitution.

---

## 7. Maintainer notes (central repo only)

**Changing the central repo.** Every change goes through a Pull Request reviewed by at least one other
member. A change to Part I of the constitution must state its version bump
(MAJOR = removes/redefines a rule, MINOR = adds a rule, PATCH = wording) and must be announced to the group,
because games will need to sync it.

**Before the first game repo is created — checklist:**

- [x] Constitution filled — version **2.0.0** (see `docs/CONSTITUTION-GUIDE.md`). It replaced a first version (1.0.0,
      commit `e6be92c`); the old text stays in git history. Still to do: review it, commit it, and get the group's approval.
- [x] `.claude/` committed.
- [x] `.gitattributes` added (LF line endings), so Windows/Linux line-ending noise in `.specify/` is gone.
- [x] Default agent set to **Claude** (`specify integration use claude`); Claude, Gemini and Copilot are all installed.
      `specify integration status` reports one error, `unsafe-multi-install`, only because Copilot is not declared
      safe to combine with other agents (Claude and Gemini are). If it ever causes trouble, remove Copilot with
      `specify integration uninstall copilot`.
- [ ] Decide the script flavour. Scripts are PowerShell only (`--script ps`). If some classmates are on
      macOS/Linux and do not want PowerShell, regenerate with `--script sh`. Keep **one** flavour for the whole group.
- [ ] Tick **Settings → General → Template repository** on GitHub.
- [ ] Keep `specs/` empty in this repo.
- [ ] Do a dry run: create a throw-away repo from the template, run the flow once, delete it.

**Upgrading Spec Kit itself** (installed version: 1.0.7): `specify self check`, then `specify self upgrade --dry-run`
and `specify self upgrade`. Do it in the central repo first, review the diff, merge, then let the games sync (section 6).
Keep tooling upgrades separate from feature work.

**Version-controlled vs. local files.** `.specify/feature.json` (pointer to the feature being worked on) and
local extension overrides are git-ignored by Spec Kit on purpose. Do not commit them.

---

## 8. Reference games

- `Orbita-do-Saber` — educational arcade shooter (HTML/CSS/JS, question bank in `perguntas.js`, local ranking, sound,
  versioned releases). It was written **before** this Spec Kit setup and has no `.specify/` or `specs/`; it is the model
  for the rules in the constitution, not a Spec Kit repo. The **next game is the first one built from this template**.
- `Corrida-Contra-o-Sino`, `-Logic-Dungeon-` — other games of the organization.
