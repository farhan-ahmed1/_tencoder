# GITHUB_INSTRUCTIONS.md — \_tencoder

## Overview

\_tencoder is a **self-updating project planner**. It bridges the gap between where your project **is today** (via repo analysis) and where you want it to be (as defined by your **PRD**). It automatically generates, updates, and manages epics and tasks in its own UI, marking them complete when evidence appears in the repo. The system also detects drift (direction changes or PRD edits) and provides actionable feedback.

## Vision

- Provide direction to developers without interrupting flow.
- Continuously keep the backlog aligned with both the **ideal state** (PRD) and the **current state** (repo).
- Allow manual overrides while automating repetitive project planning work.

## Core Features

1. **PRD ingestion**
   - Upload or link a Markdown PRD with YAML metadata.
   - Parse objectives, milestones, constraints, definition of done.

2. **Repo analyzer (read-only)**
   - Detect project type (Node, Python, etc.).
   - Identify CI workflows, tests, coverage, linting, API routes.
   - Store structured signals like `ci_found=false`, `coverage=27%`.

3. **Planner**
   - Compare PRD goals vs repo state.
   - Generate epics and tasks to close the gap.
   - Auto-complete tasks when evidence is detected.
   - Adjust tasks if PRD changes or repo direction shifts.

4. **Backlog UI**
   - Kanban board: Todo / In Progress / Done / Out-of-date.
   - Epics group tasks; each task shows its evidence checkers.
   - Manual override (close/edit tasks yourself).

5. **Digest & Feedback**
   - Daily digest: “What changed / What’s next.”
   - Weekly reflection: progress summary, blockers, drift notes.
   - Targeted feedback tied to PRD (e.g., “Coverage target not met”).

## Tech Stack

**Backend**

- TypeScript + Fastify
- SQLite (dev), Postgres (prod)
- Prisma ORM
- BullMQ (Redis) for background jobs

**Frontend**

- Next.js + React
- TailwindCSS for styling
- shadcn/ui for components
- Zustand for lightweight state management

**Integration**

- GitHub App (read-only access to repo code, workflows, checks)
- Local scanners to extract repo signals

**AI Usage**

- LLM (OpenAI GPT-4.1-mini/4.1) for:
  - Converting PRD → backlog (epics & tasks)
  - Detecting drift and proposing replans

- Evidence checkers are rule-based (deterministic, no LLM).

**Deployment**

- Vercel for frontend + API routes
- Fly.io or Railway for worker services
- GitHub Actions for CI/CD

## Project Structure

```
/tencoder
  /apps
    /web        # Next.js frontend
    /api        # Fastify backend
    /worker     # Background jobs (webhooks, scanning)
  /packages
    /core       # Shared types (Task, Epic, Signal)
    /analyzer   # Repo analyzers
    /planner    # Planner loop (diff, reconcile)
    /ui         # Shared UI components
  /infra
    docker-compose.yml
    prisma schema
  .tencoder.yml # Project config (coverage targets, debounce settings)
```

## Task Model

```ts
Task {
  id: string
  epicId: string
  title: string
  status: "todo" | "in_progress" | "done" | "out_of_date"
  acceptance: string[]
  checkers: Checker[]
  trace: { prdRefs: string[], repoSignals: string[] }
}
```

## Evidence Checkers (MVP)

- **fileExists**: validate presence of key files.
- **ciGreen**: confirm CI status = success.
- **coverageAbove**: parse coverage reports, compare vs target.
- **routeExists**: detect if a required API route is implemented.

## Success Criteria

- With a PRD + repo connected, \_tencoder generates epics and tasks.
- When repo changes match acceptance criteria, tasks are auto-marked Done.
- If PRD is edited or frameworks change, new tasks are proposed.
- Daily digest clearly shows completed work and next steps.

## Stretch Goals

- Support multi-repo projects.
- Export tasks to Linear/Jira.
- AI-assisted PR feedback.
- Weekly reflection mode with learnings and improvements.
