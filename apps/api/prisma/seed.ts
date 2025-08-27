import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: "demo@tencoder.com" },
    update: {},
    create: {
      email: "demo@tencoder.com",
      name: "Demo User",
      avatarUrl: "https://avatars.githubusercontent.com/u/demo?v=4",
    },
  });

  console.log("✅ Created user:", user.email);

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: "sample-project-id" },
    update: {},
    create: {
      id: "sample-project-id",
      name: "Sample Todo App",
      description:
        "A full-stack todo application with React frontend and Node.js backend",
      repoUrl: "https://github.com/demo/todo-app",
      repoOwner: "demo",
      repoName: "todo-app",
      userId: user.id,
      isActive: true,
    },
  });

  console.log("✅ Created project:", project.name);

  // Create a sample PRD
  const samplePRDMetadata = {
    objectives: [
      "Build a modern, responsive todo application",
      "Implement user authentication and authorization",
      "Provide real-time updates and synchronization",
      "Ensure 95%+ test coverage",
      "Deploy with CI/CD pipeline",
    ],
    milestones: [
      {
        name: "MVP Backend",
        description: "Basic CRUD API with authentication",
        dueDate: "2025-09-15",
        dependencies: [],
      },
      {
        name: "Frontend MVP",
        description: "React app with basic todo functionality",
        dueDate: "2025-09-30",
        dependencies: ["MVP Backend"],
      },
      {
        name: "Production Ready",
        description: "Testing, CI/CD, monitoring, and deployment",
        dueDate: "2025-10-15",
        dependencies: ["Frontend MVP"],
      },
    ],
    constraints: [
      "Must support mobile devices",
      "Must be accessible (WCAG AA)",
      "API response time < 200ms",
      "Support for 1000+ concurrent users",
    ],
    definitionOfDone: [
      "All acceptance criteria met",
      "Unit tests written and passing",
      "Integration tests passing",
      "Code reviewed and approved",
      "Documentation updated",
      "Deployed to staging environment",
    ],
    targetAudience: "Productivity-focused individuals and teams",
    successMetrics: [
      {
        name: "User Engagement",
        target: "80% daily active users",
        measurement: "Analytics dashboard",
      },
      {
        name: "Performance",
        target: "Page load time < 2s",
        measurement: "Lighthouse CI",
      },
      {
        name: "Reliability",
        target: "99.9% uptime",
        measurement: "Monitoring alerts",
      },
    ],
  };

  const prd = await prisma.pRD.upsert({
    where: { id: "sample-prd-id" },
    update: {},
    create: {
      id: "sample-prd-id",
      projectId: project.id,
      title: "Todo App PRD v1.0",
      content: `# Todo Application PRD

## Overview
A modern, full-stack todo application designed for productivity-focused users.

## Features
- User authentication and registration
- Create, read, update, delete todos
- Real-time synchronization across devices
- Mobile-responsive design
- Offline support with sync
- Team collaboration features

## Technical Requirements
- React frontend with TypeScript
- Node.js backend with Express/Fastify
- PostgreSQL database
- JWT authentication
- Real-time updates with WebSockets
- Comprehensive test suite
- CI/CD pipeline with GitHub Actions

## Success Criteria
- 95%+ test coverage
- Sub-200ms API response times
- Mobile-first responsive design
- WCAG AA accessibility compliance
`,
      metadata: JSON.stringify(samplePRDMetadata),
      version: "1.0.0",
      isActive: true,
    },
  });

  console.log("✅ Created PRD:", prd.title);

  // Create sample epics
  const backendEpic = await prisma.epic.upsert({
    where: { id: "backend-epic-id" },
    update: {},
    create: {
      id: "backend-epic-id",
      projectId: project.id,
      title: "Backend API Development",
      description:
        "Develop the core backend API with authentication, CRUD operations, and real-time features",
      status: "in_progress",
      priority: 1,
    },
  });

  const frontendEpic = await prisma.epic.upsert({
    where: { id: "frontend-epic-id" },
    update: {},
    create: {
      id: "frontend-epic-id",
      projectId: project.id,
      title: "Frontend Application",
      description:
        "Build the React frontend with modern UI/UX and responsive design",
      status: "todo",
      priority: 2,
    },
  });

  const deploymentEpic = await prisma.epic.upsert({
    where: { id: "deployment-epic-id" },
    update: {},
    create: {
      id: "deployment-epic-id",
      projectId: project.id,
      title: "Deployment & DevOps",
      description:
        "Set up CI/CD pipeline, monitoring, and production deployment",
      status: "todo",
      priority: 3,
    },
  });

  console.log("✅ Created epics:", [
    backendEpic.title,
    frontendEpic.title,
    deploymentEpic.title,
  ]);

  // Create sample tasks
  const tasks = [
    {
      id: "task-auth-setup",
      epicId: backendEpic.id,
      title: "Set up authentication system",
      status: "done",
      acceptance: [
        "JWT-based authentication implemented",
        "User registration endpoint created",
        "Login endpoint with validation",
        "Password hashing with bcrypt",
        "JWT middleware for protected routes",
      ],
      checkers: [
        {
          type: "routeExists",
          config: { path: "/api/auth/register", method: "POST" },
        },
        {
          type: "routeExists",
          config: { path: "/api/auth/login", method: "POST" },
        },
        { type: "testExists", config: { pattern: "**/auth.test.ts" } },
      ],
      trace: {
        prdRefs: ["user-authentication", "jwt-auth"],
        repoSignals: ["auth_routes_found", "jwt_middleware_detected"],
      },
      priority: 1,
    },
    {
      id: "task-todo-crud",
      epicId: backendEpic.id,
      title: "Implement todo CRUD operations",
      status: "in_progress",
      acceptance: [
        "Create todo endpoint",
        "Get todos endpoint with pagination",
        "Update todo endpoint",
        "Delete todo endpoint",
        "Proper error handling and validation",
      ],
      checkers: [
        { type: "routeExists", config: { path: "/api/todos", method: "GET" } },
        { type: "routeExists", config: { path: "/api/todos", method: "POST" } },
        { type: "testExists", config: { pattern: "**/todos.test.ts" } },
      ],
      trace: {
        prdRefs: ["crud-operations", "todo-management"],
        repoSignals: ["todo_routes_partial", "tests_incomplete"],
      },
      priority: 2,
    },
    {
      id: "task-database-setup",
      epicId: backendEpic.id,
      title: "Set up database schema and migrations",
      status: "done",
      acceptance: [
        "Prisma schema defined",
        "User and Todo models created",
        "Database migrations working",
        "Seed script for development data",
      ],
      checkers: [
        { type: "fileExists", config: { path: "prisma/schema.prisma" } },
        { type: "fileExists", config: { path: "prisma/migrations" } },
      ],
      trace: {
        prdRefs: ["database-design", "data-models"],
        repoSignals: ["prisma_schema_found", "migrations_applied"],
      },
      priority: 1,
    },
    {
      id: "task-react-setup",
      epicId: frontendEpic.id,
      title: "Set up React application with TypeScript",
      status: "todo",
      acceptance: [
        "React app created with TypeScript",
        "Tailwind CSS configured",
        "ESLint and Prettier setup",
        "Basic routing with React Router",
      ],
      checkers: [
        { type: "fileExists", config: { path: "package.json" } },
        { type: "fileExists", config: { path: "tsconfig.json" } },
        { type: "fileExists", config: { path: "tailwind.config.js" } },
      ],
      trace: {
        prdRefs: ["react-frontend", "typescript-setup"],
        repoSignals: [],
      },
      priority: 1,
    },
    {
      id: "task-ci-setup",
      epicId: deploymentEpic.id,
      title: "Set up CI/CD pipeline",
      status: "todo",
      acceptance: [
        "GitHub Actions workflow created",
        "Automated testing on pull requests",
        "Build and deployment to staging",
        "Code coverage reporting",
      ],
      checkers: [
        { type: "fileExists", config: { path: ".github/workflows/ci.yml" } },
        { type: "ciGreen", config: {} },
        { type: "coverageAbove", config: { threshold: 80 } },
      ],
      trace: {
        prdRefs: ["ci-cd-pipeline", "automated-testing"],
        repoSignals: [],
      },
      priority: 2,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.upsert({
      where: { id: taskData.id },
      update: {},
      create: {
        ...taskData,
        acceptance: JSON.stringify(taskData.acceptance),
        checkers: JSON.stringify(taskData.checkers),
        trace: JSON.stringify(taskData.trace),
      },
    });
  }

  console.log("✅ Created tasks:", tasks.length);

  // Create sample signals
  const signals = [
    {
      projectId: project.id,
      type: "ci_status",
      value: JSON.stringify({
        status: "passing",
        lastRun: "2025-08-27T10:30:00Z",
      }),
      metadata: JSON.stringify({ workflow: "main.yml", branch: "main" }),
    },
    {
      projectId: project.id,
      type: "test_coverage",
      value: JSON.stringify({
        percentage: 85,
        lines: { covered: 340, total: 400 },
      }),
      metadata: JSON.stringify({
        tool: "jest",
        reportPath: "coverage/lcov.info",
      }),
    },
    {
      projectId: project.id,
      type: "route_detected",
      value: JSON.stringify({
        path: "/api/auth/login",
        method: "POST",
        file: "src/routes/auth.ts",
      }),
      metadata: JSON.stringify({ framework: "fastify" }),
    },
  ];

  for (const signalData of signals) {
    await prisma.signal.create({
      data: signalData,
    });
  }

  console.log("✅ Created signals:", signals.length);

  // Create a sample run digest
  const digest = await prisma.runDigest.create({
    data: {
      projectId: project.id,
      userId: user.id,
      type: "daily",
      title: "Daily Progress Update - August 27, 2025",
      summary:
        "Good progress on backend development. Authentication system completed and todo CRUD operations are in progress. Frontend setup is ready to begin.",
      completedTasks: JSON.stringify([
        "task-auth-setup",
        "task-database-setup",
      ]),
      newTasks: JSON.stringify(["task-react-setup"]),
      blockers: JSON.stringify([
        {
          id: "blocker-1",
          description:
            "Waiting for API design review before completing todo endpoints",
          severity: "medium",
          category: "dependency",
          suggestedActions: [
            "Schedule API review meeting",
            "Create API documentation",
          ],
        },
      ]),
      insights: JSON.stringify([
        {
          id: "insight-1",
          type: "progress",
          description: "Authentication implementation ahead of schedule",
          confidence: 0.9,
          actionable: false,
          priority: "low",
        },
        {
          id: "insight-2",
          type: "recommendation",
          description:
            "Consider setting up frontend development environment early to parallelize work",
          confidence: 0.8,
          actionable: true,
          priority: "medium",
        },
      ]),
    },
  });

  console.log("✅ Created run digest:", digest.title);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
