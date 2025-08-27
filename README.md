# \_tencoder

Self-updating project planner that bridges the gap between your project's current state and desired goals.

## Day 1 Progress ✅

**Build:**

- ✅ Initialized Turborepo with pnpm workspaces
- ✅ Created apps: web (Next.js), api (Fastify), worker
- ✅ Created packages: core, planner, analyzer, ui
- ✅ Set up TypeScript project references and base tsconfig
- ✅ Added Prettier for code formatting
- ✅ Configured Husky pre-commit hooks with lint-staged
- ✅ Created GitHub Actions CI workflow

**Status:**

- ✅ `pnpm build` succeeds across all packages
- ✅ `pnpm typecheck` passes
- 🟡 `pnpm lint` needs minor config adjustments (TypeScript parsing)
- ✅ Monorepo structure committed
- ✅ CI workflow configured

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Type check all packages
pnpm typecheck

# Start development
pnpm dev
```

## Project Structure

```
apps/
  web/          # Next.js frontend
  api/          # Fastify backend
  worker/       # Background jobs
packages/
  core/         # Shared types & interfaces
  planner/      # Planning logic
  analyzer/     # Repo analysis
  ui/           # Shared UI components
```

## Next Steps

- Complete ESLint configuration
- Add CI badge
- Implement basic PRD ingestion
- Set up repo analyzer foundations
