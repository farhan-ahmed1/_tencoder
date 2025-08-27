import { z } from "zod";

// Core validation schemas
export const TaskStatusSchema = z.enum([
  "todo",
  "in_progress",
  "done",
  "out_of_date",
]);
export const EpicStatusSchema = z.enum([
  "todo",
  "in_progress",
  "done",
  "out_of_date",
]);
export const DigestTypeSchema = z.enum(["daily", "weekly", "manual"]);
export const CheckerTypeSchema = z.enum([
  "fileExists",
  "ciGreen",
  "coverageAbove",
  "routeExists",
  "testExists",
  "lintPasses",
  "buildSucceeds",
]);

export const CheckerSchema = z.object({
  type: CheckerTypeSchema,
  config: z.record(z.unknown()),
});

export const TaskTraceSchema = z.object({
  prdRefs: z.array(z.string()),
  repoSignals: z.array(z.string()),
});

export const MilestoneSchema = z.object({
  name: z.string(),
  description: z.string(),
  dueDate: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const SuccessMetricSchema = z.object({
  name: z.string(),
  target: z.string(),
  measurement: z.string(),
});

export const PRDMetadataSchema = z.object({
  objectives: z.array(z.string()),
  milestones: z.array(MilestoneSchema),
  constraints: z.array(z.string()),
  definitionOfDone: z.array(z.string()),
  targetAudience: z.string().optional(),
  successMetrics: z.array(SuccessMetricSchema).optional(),
});

export const BlockerSchema = z.object({
  id: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  category: z.string(),
  suggestedActions: z.array(z.string()).optional(),
});

export const InsightSchema = z.object({
  id: z.string(),
  type: z.enum(["progress", "risk", "opportunity", "recommendation"]),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  actionable: z.boolean(),
  priority: z.enum(["low", "medium", "high"]),
});

// DTO validation schemas
export const CreateProjectDTOSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  repoUrl: z.string().url().optional(),
});

export const UpdateProjectDTOSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  repoUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const CreatePRDDTOSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  metadata: PRDMetadataSchema,
  version: z.string().default("1.0.0"),
});

export const UpdatePRDDTOSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  metadata: PRDMetadataSchema.optional(),
  version: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const CreateEpicDTOSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  priority: z.number().int().min(0).default(0),
});

export const CreateTaskDTOSchema = z.object({
  epicId: z.string(),
  title: z.string().min(1).max(255),
  acceptance: z.array(z.string()),
  checkers: z.array(CheckerSchema),
  priority: z.number().int().min(0).default(0),
});

export const PaginationOptionsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Export types from schemas
export type CreateProjectDTO = z.infer<typeof CreateProjectDTOSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectDTOSchema>;
export type CreatePRDDTO = z.infer<typeof CreatePRDDTOSchema>;
export type UpdatePRDDTO = z.infer<typeof UpdatePRDDTOSchema>;
export type CreateEpicDTO = z.infer<typeof CreateEpicDTOSchema>;
export type CreateTaskDTO = z.infer<typeof CreateTaskDTOSchema>;
export type PaginationOptions = z.infer<typeof PaginationOptionsSchema>;
