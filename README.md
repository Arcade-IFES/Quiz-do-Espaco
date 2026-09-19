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
   Spec-Kit-jogos  (this repo — the "upstream" of every game)
   ├── .specify/memory/constitution.md   ← shared rules for ALL games
   ├── .specify/templates/               ← spec / plan / tasks templates
   ├── .specify/scripts/                 ← helper scripts used by the commands
   └── .claude/skills/  .gemini/commands/  .github/skills/  ← the /speckit-* commands
                │
                │  git clone  →  rename the remote "origin" to "upstream"
                ▼
   Game repository  (one per game, e.g. Orbita-do-Saber)   ← its own "origin" on GitHub
   ├── everything above, with the same git history as the central repo
   ├── constitution.md  →  shared rules (Part I)  +  the game's own rules (Part II)
   ├── specs/001-…/     →  spec.md, plan.md, tasks.md … for each feature
   └── the game's source code
                ▲
                │  git fetch upstream  →  git merge upstream/main   (when the central rules change)
                │
   Spec-Kit-jogos
```

**Important — how Spec Kit really works.** Spec Kit is *per repository*: each repo has its own
`.specify/` folder and its own constitution. We found no built-in "inheritance" from a parent repo
(the official docs describe presets and extensions, but nothing that links a constitution across repos).
So each game is a **clone of the central repo whose original remote was renamed to `upstream`**.
The game keeps the central history, so when the central rules change, the game pulls them with a normal
`git merge` (see section 6). It is **not** a GitHub fork and **not** a template copy: do not use the
"Fork" or "Use this template" buttons.

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
- [GitHub CLI](https://cli.github.com/) `gh`, logged in (`gh auth login`). Optional: without it, create the empty
  repository on the GitHub website (see Step 1, "Without `gh`").
- **PowerShell.** The Spec Kit helper scripts in this repo are PowerShell (`.specify/scripts/powershell/`).
  Windows already has it. On macOS/Linux install PowerShell 7 (`pwsh`) — or see "Maintainer notes" for the alternative.

### Step 1 — Clone the central repo and point it to a new game repository

```bash
git clone https://github.com/Arcade-IFES/Spec-Kit-jogos.git <game-name>
cd <game-name>

git remote rename origin upstream                 # the central repo becomes "upstream"
git remote set-url --push upstream DISABLED       # nobody can push a game into the central repo by accident
git config remote.upstream.tagOpt --no-tags       # never import central tags into the game (games have their own vX.Y.Z tags)

gh repo create Arcade-IFES/<game-name> --private --source=. --remote=origin --push
```

The last command creates the new repository on GitHub, adds it as `origin` and pushes `main`.
Use `--public` instead of `--private` if the course asks for it.

*Without `gh`:* on GitHub create a new **empty** repository in the Arcade-IFES organization (no README,
no .gitignore, no license), then:

```bash
git remote add origin https://github.com/Arcade-IFES/<game-name>.git
git push -u origin main
```

Check the result with `git remote -v`. It must look like this:

```
origin    https://github.com/Arcade-IFES/<game-name>.git (fetch)
origin    https://github.com/Arcade-IFES/<game-name>.git (push)
upstream  https://github.com/Arcade-IFES/Spec-Kit-jogos.git (fetch)
upstream  DISABLED (push)
```

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

Commit `specs/001-core-gameplay/` together with the code, open a Pull Request **on the game's repository**,
and get it reviewed against the constitution.

> This repo has no git extension installed, so `/speckit-specify` does **not** create the git branch
> by itself. Create it manually as shown above.

### Step 5 — Next feature

Return to `main`, create the next branch (`002-…`) and repeat Step 4. Spec Kit numbers the folders
in `specs/` sequentially by itself.

### Step 6 — Replace the README

Rewrite `README.md` for the game, **in Portuguese** (how to play, controls, structure, credits — see the constitution).
Keep a link back to the central repository. Later merges from `upstream` will conflict on this file whenever the
central README changes; the game's version always wins (see section 6).

### Rules for game repositories

- Do **not** edit the tooling in a game repo (`.specify/templates/`, `.specify/scripts/`, `.claude/`, `.gemini/`,
  `.github/skills/`) and do not touch Part I of the constitution. That keeps every merge from `upstream` clean.
- Do **not** improve the central repo from inside a game repo. Make the change in a separate clone of
  `Spec-Kit-jogos`, through a Pull Request (see section 7), and then merge it into the games.

---

## 6. Keeping a game in sync with the central repo

Run this inside the game repo, on a clean `main` (everything committed), whenever the group announces a central change.

```bash
git fetch upstream

git log --oneline HEAD..upstream/main       # what is new in the central repo
git diff HEAD...upstream/main --stat        # which files it changes

git switch -c sync-central                  # do the merge on a branch, so `main` stays safe
git merge upstream/main
```

If git reports no conflicts, the merge is done. If it stops with conflicts, resolve them as follows
(`git status` lists the files; "ours" = the game, "theirs" = the central repo):

| File | What to do |
|---|---|
| `README.md` | Keep the game's version: `git checkout --ours README.md && git add README.md` |
| `.specify/memory/constitution.md` | Usually merges by itself, because Part I (central) and Part II (game) are different blocks. If the **Version** line conflicts, keep both parts, use the higher of the two version numbers with the MINOR number raised by one, and set *Last Amended* to today. |
| Anything under `.specify/`, `.claude/`, `.gemini/`, `.github/skills/` | Someone edited tooling inside the game. Take the central version: `git checkout --theirs <file> && git add <file>` |

Then finish:

```bash
git commit                                  # completes the merge (only needed after conflicts)
```

Run `/speckit-analyze` on the features in progress, because a changed rule can invalidate an existing spec or plan,
fix what it reports, and open a Pull Request from `sync-central` into `main`. To give up halfway: `git merge --abort`.

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
- [ ] Commit and push everything pending (Gemini reinstall, docs) and get the group's approval of constitution 2.0.0.
- [ ] Decide the script flavour. Scripts are PowerShell only (`--script ps`). If some classmates are on
      macOS/Linux and do not want PowerShell, regenerate with `--script sh`. Keep **one** flavour for the whole group.
- [ ] Protect `main` on GitHub (Pull Request + one review required): games merge from `upstream/main`,
      so everything on it must have been reviewed.
- [ ] Keep `specs/` empty in this repo.
- [ ] Do a dry run: follow section 5 to create a throw-away game repo, run the flow once, merge a small central
      change following section 6, then delete the game repo.

**No tags in the central repo.** Games use `vX.Y.Z` tags for their own releases (constitution, Principle IX),
so central tags would collide with them. Games also set `remote.upstream.tagOpt --no-tags` (section 5, Step 1).

**Upgrading Spec Kit itself** (installed version: 1.0.7): `specify self check`, then `specify self upgrade --dry-run`
and `specify self upgrade`. Do it in the central repo first, review the diff, merge, then let the games sync (section 6).
Keep tooling upgrades separate from feature work.

**Version-controlled vs. local files.** `.specify/feature.json` (pointer to the feature being worked on) and
local extension overrides are git-ignored by Spec Kit on purpose. Do not commit them.

---

## 8. Reference games

- `Orbita-do-Saber` — educational arcade shooter (HTML/CSS/JS, question bank in `perguntas.js`, local ranking, sound,
  versioned releases). It was written **before** this Spec Kit setup and has no `.specify/` or `specs/`; it is the model
  for the rules in the constitution, not a Spec Kit repo. The **next game is the first one created from this repository** (section 5).
- `Corrida-Contra-o-Sino`, `-Logic-Dungeon-` — other games of the organization.
