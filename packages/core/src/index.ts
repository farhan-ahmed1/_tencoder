// Core Domain Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  repoUrl?: string;
  repoOwner?: string;
  repoName?: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  prds?: PRD[];
  epics?: Epic[];
  signals?: Signal[];
  runDigests?: RunDigest[];
}

export interface PRD {
  id: string;
  projectId: string;
  title: string;
  content: string; // Markdown content
  metadata: PRDMetadata;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
}

export interface PRDMetadata {
  objectives: string[];
  milestones: Milestone[];
  constraints: string[];
  definitionOfDone: string[];
  targetAudience?: string;
  successMetrics?: SuccessMetric[];
}

export interface Milestone {
  name: string;
  description: string;
  dueDate?: string;
  dependencies?: string[];
}

export interface SuccessMetric {
  name: string;
  target: string;
  measurement: string;
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: EpicStatus;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  tasks?: Task[];
}

export interface Task {
  id: string;
  epicId: string;
  title: string;
  status: TaskStatus;
  acceptance: string[];
  checkers: Checker[];
  trace: TaskTrace;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  epic?: Epic;
}

export interface TaskTrace {
  prdRefs: string[];
  repoSignals: string[];
}

export interface Checker {
  type: CheckerType;
  config: Record<string, unknown>;
}

export interface Signal {
  id: string;
  projectId: string;
  type: string;
  value: unknown;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  project?: Project;
}

export interface RunDigest {
  id: string;
  projectId: string;
  userId: string;
  type: DigestType;
  title: string;
  summary: string;
  completedTasks: string[];
  newTasks: string[];
  blockers: Blocker[];
  insights: Insight[];
  createdAt: Date;
  project?: Project;
  user?: User;
}

export interface Blocker {
  id: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  suggestedActions?: string[];
}

export interface Insight {
  id: string;
  type: "progress" | "risk" | "opportunity" | "recommendation";
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  priority: "low" | "medium" | "high";
}

// Enums and Union Types
export type TaskStatus = "todo" | "in_progress" | "done" | "out_of_date";
export type EpicStatus = "todo" | "in_progress" | "done" | "out_of_date";
export type DigestType = "daily" | "weekly" | "manual";
export type CheckerType =
  | "fileExists"
  | "ciGreen"
  | "coverageAbove"
  | "routeExists"
  | "testExists"
  | "lintPasses"
  | "buildSucceeds";

// DTO Types for API
export interface CreateProjectDTO {
  name: string;
  description?: string;
  repoUrl?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  repoUrl?: string;
  isActive?: boolean;
}

export interface CreatePRDDTO {
  title: string;
  content: string;
  metadata: PRDMetadata;
  version?: string;
}

export interface UpdatePRDDTO {
  title?: string;
  content?: string;
  metadata?: PRDMetadata;
  version?: string;
  isActive?: boolean;
}

export interface CreateEpicDTO {
  title: string;
  description: string;
  priority?: number;
}

export interface CreateTaskDTO {
  epicId: string;
  title: string;
  acceptance: string[];
  checkers: Checker[];
  priority?: number;
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PRDListResponse {
  prds: PRD[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Re-export validation schemas
export * from "./schemas";
