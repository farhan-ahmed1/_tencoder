# \_tencoder

A **self-updating pro4. **Set Up Environment**
`6. **Start Developm7. **Verify Setup**

`````bash
# Run tests
pnpm test

# Check linting
pnpm lint

# Verify build
pnpm build
````bash
pnpm dev
`````

This starts:

- **API Server**: http://localhost:3002
- **Web Interface**: http://localhost:3000
- **Background Worker**: Processes repo analysis jobs

7. **Verify Setup** Copy environment template
   cp apps/api/.env.example apps/api/.env.local
   cp apps/web/.env.example apps/web/.env.local

   # Edit the files with your configuration

   ```

   ```

8. **Initialize Database**

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

9. **Start Development**hat bridges the gap between where your project **is today** (via repo analysis) and where you want it to be (as defined by your **PRD**).

## Vision

\_tencoder provides direction to developers without interrupting flow by continuously keeping the backlog aligned with both the **ideal state** (PRD) and the **current state** (repo). It automatically generates, updates, and manages epics and tasks, marking them complete when evidence appears in the repo.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended package manager)
- **Git** (for version control)

### Zero-to-Dev in Under 10 Minutes

1. **Clone and Install**

   ```bash
   git clone https://github.com/farhan-ahmed1/_tencoder.git
   cd _tencoder
   pnpm install
   ```

2. **Build Dependencies**

   ```bash
   pnpm build
   ```

3. **Generate Database Client**

   ```bash
   pnpm db:generate
   ```

4. **Set Up Environment**

   ```bash
   # Copy environment template
   cp apps/api/.env.example apps/api/.env.local
   cp apps/web/.env.example apps/web/.env.local

   # Edit the files with your configuration
   ```

5. **Initialize Database**

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

6. **Start Development**

   ```bash
   pnpm dev
   ```

   This starts:
   - **API Server**: http://localhost:3002
   - **Web Interface**: http://localhost:3000
   - **Background Worker**: Processes repo analysis jobs

7. **Verify Setup**

   ```bash
   # Run tests
   pnpm test

   # Check linting
   pnpm lint

   # Verify build
   pnpm build
   ```

## 🏗️ Architecture

```
/tencoder
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Fastify backend
│   └── worker/       # Background jobs
├── packages/
│   ├── core/         # Shared types & schemas
│   ├── analyzer/     # Repo analysis logic
│   ├── planner/      # Planning algorithms
│   └── ui/           # Shared UI components
└── infra/            # Infrastructure configs
```

## 📋 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev          # Start all services in development mode
pnpm build        # Build all packages and apps
pnpm test         # Run all tests
pnpm lint         # Lint all packages

# Database
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
pnpm db:reset     # Reset database (migrate + seed)

# Utilities
pnpm clean        # Clean all build artifacts
pnpm typecheck    # Type check all packages
pnpm format       # Format code with Prettier
```

### Individual App Commands

```bash
# API (apps/api)
cd apps/api
pnpm dev          # Start API server
pnpm test         # Run API tests
pnpm db:studio    # Open Prisma Studio

# Web (apps/web)
cd apps/web
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server

# Worker (apps/worker)
cd apps/worker
pnpm dev          # Start background worker
```

## 🔧 Core Features

### 1. PRD Ingestion

- Upload or link Markdown PRDs with YAML metadata
- Parse objectives, milestones, constraints, and definition of done
- Track changes and version history

### 2. Repo Analysis (Read-Only)

- Auto-detect project type (Node.js, Python, etc.)
- Identify CI workflows, tests, coverage, linting
- Extract API routes, database schemas, dependencies
- Store structured signals like `ci_found=false`, `coverage=27%`

### 3. Intelligent Planning

- Compare PRD goals vs current repo state
- Generate epics and tasks to close the gap
- Auto-complete tasks when evidence is detected
- Adjust backlog when PRD changes or repo direction shifts

### 4. Backlog Management UI

- **Kanban Board**: Todo / In Progress / Done / Out-of-date
- **Epics Grouping**: Related tasks organized under epics
- **Evidence Tracking**: Each task shows its validation criteria
- **Manual Override**: Close/edit tasks yourself when needed

### 5. Digest & Feedback

- **Daily Digest**: "What changed / What's next"
- **Weekly Reflection**: Progress summary, blockers, drift analysis
- **Targeted Feedback**: PRD-tied recommendations (e.g., "Coverage target not met")

## 🛠️ Tech Stack

### Backend

- **TypeScript** + **Fastify** (high-performance web framework)
- **SQLite** (development) / **PostgreSQL** (production)
- **Prisma ORM** (type-safe database access)
- **BullMQ** + **Redis** (background job processing)
- **Pino** (structured logging)

### Frontend

- **Next.js 14** + **React 18** (app router)
- **TailwindCSS** (utility-first styling)
- **shadcn/ui** (component library)
- **Zustand** (lightweight state management)

### Development

- **TypeScript** (type safety)
- **ESLint** + **Prettier** (code quality)
- **Jest** (testing framework)
- **Turbo** (monorepo build system)
- **Husky** (git hooks)

### Integration

- **GitHub App** (read-only repo access)
- **OpenAI GPT-4** (PRD analysis, task generation)
- **Webhooks** (real-time repo change detection)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
cd apps/api && pnpm test

# Run tests with coverage
cd apps/api && pnpm test --coverage
```

### Test Structure

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Full workflow testing
- **Database Tests**: Isolated test database

## 🚀 Deployment

### Development

```bash
pnpm dev  # All services with hot reload
```

### Production

- **Frontend**: Deploy to Vercel (recommended)
- **API**: Deploy to Fly.io or Railway
- **Worker**: Background service on Fly.io/Railway
- **Database**: PostgreSQL on Railway/Supabase
- **Redis**: Upstash Redis (for BullMQ)

### Environment Variables

#### API (.env.local)

```bash
NODE_ENV=development
PORT=3002
DATABASE_URL="file:./dev.db"
LOG_LEVEL=info
NEXTAUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-app-id"
GITHUB_CLIENT_SECRET="your-github-app-secret"
OPENAI_API_KEY="your-openai-key"
```

#### Web (.env.local)

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-app-id"
GITHUB_CLIENT_SECRET="your-github-app-secret"
API_URL=http://localhost:3002
```

## 📊 Monitoring & Observability

- **Structured Logging**: Pino with request tracing
- **Health Checks**: `/health` endpoints on all services
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Built-in metrics and timing

## 🔒 Security

- **Authentication**: NextAuth.js with GitHub OAuth
- **Authorization**: Role-based access control
- **API Security**: Rate limiting, input validation
- **Database**: Parameterized queries, no SQL injection
- **Secrets**: Environment variable management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests (`pnpm test`)
5. Run linting (`pnpm lint`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure zero linting errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

- **Documentation**: [Wiki](https://github.com/farhan-ahmed1/_tencoder/wiki)
- **Issues**: [GitHub Issues](https://github.com/farhan-ahmed1/_tencoder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/farhan-ahmed1/_tencoder/discussions)

---

**Made with ❤️ by the \_tencoder team**
