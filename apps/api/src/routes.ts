import { FastifyInstance } from "fastify";
import {
  CreateProjectDTOSchema,
  UpdateProjectDTOSchema,
  CreatePRDDTOSchema,
  UpdatePRDDTOSchema,
  PaginationOptionsSchema,
  APIResponse,
} from "@tencoder/core";
import { ProjectService, PRDService } from "./services";
import {
  parsePRDMarkdown,
  validatePRDContent,
  extractTitleFromContent,
} from "./utils/markdown";

const projectService = new ProjectService();
const prdService = new PRDService();

// Temporary mock user ID - in production this would come from authentication middleware
const MOCK_USER_ID = "cmeudtu8s00005gl4afdqtz8c";

interface ProjectParams {
  id: string;
}

interface ProjectPRDParams {
  projectId: string;
  id?: string;
}

interface QueryParams {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

async function projectRoutes(fastify: FastifyInstance) {
  // GET /api/projects - List all projects for user
  fastify.get<{ Querystring: QueryParams }>("/projects", async request => {
    const paginationResult = PaginationOptionsSchema.safeParse({
      page: request.query.page ? parseInt(request.query.page) : undefined,
      limit: request.query.limit ? parseInt(request.query.limit) : undefined,
      sortBy: request.query.sortBy,
      sortOrder: request.query.sortOrder,
    });

    if (!paginationResult.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid pagination parameters",
          details: paginationResult.error.issues,
        },
      } satisfies APIResponse;
    }

    try {
      const result = await projectService.getProjects(
        MOCK_USER_ID,
        paginationResult.data
      );
      return {
        success: true,
        data: result.projects,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      } satisfies APIResponse;
    } catch (error) {
      fastify.log.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch projects",
        },
      } satisfies APIResponse;
    }
  });

  // GET /api/projects/:id - Get project by ID
  fastify.get<{ Params: ProjectParams }>("/projects/:id", async request => {
    try {
      const project = await projectService.getProjectById(
        request.params.id,
        MOCK_USER_ID
      );

      if (!project) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Project not found",
          },
        } satisfies APIResponse;
      }

      return {
        success: true,
        data: project,
      } satisfies APIResponse;
    } catch (error) {
      fastify.log.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch project",
        },
      } satisfies APIResponse;
    }
  });

  // POST /api/projects - Create new project
  fastify.post<{ Body: unknown }>("/projects", async request => {
    const validationResult = CreateProjectDTOSchema.safeParse(request.body);

    if (!validationResult.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid project data",
          details: validationResult.error.issues,
        },
      } satisfies APIResponse;
    }

    try {
      const project = await projectService.createProject(
        MOCK_USER_ID,
        validationResult.data
      );
      return {
        success: true,
        data: project,
      } satisfies APIResponse;
    } catch (error) {
      fastify.log.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create project",
        },
      } satisfies APIResponse;
    }
  });

  // PUT /api/projects/:id - Update project
  fastify.put<{ Params: ProjectParams; Body: unknown }>(
    "/projects/:id",
    async request => {
      const validationResult = UpdateProjectDTOSchema.safeParse(request.body);

      if (!validationResult.success) {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid project update data",
            details: validationResult.error.issues,
          },
        } satisfies APIResponse;
      }

      try {
        const project = await projectService.updateProject(
          request.params.id,
          MOCK_USER_ID,
          validationResult.data
        );

        if (!project) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "Project not found",
            },
          } satisfies APIResponse;
        }

        return {
          success: true,
          data: project,
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to update project",
          },
        } satisfies APIResponse;
      }
    }
  );

  // DELETE /api/projects/:id - Delete project
  fastify.delete<{ Params: ProjectParams }>("/projects/:id", async request => {
    try {
      const deleted = await projectService.deleteProject(
        request.params.id,
        MOCK_USER_ID
      );

      if (!deleted) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Project not found",
          },
        } satisfies APIResponse;
      }

      return {
        success: true,
        data: { deleted: true },
      } satisfies APIResponse;
    } catch (error) {
      fastify.log.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to delete project",
        },
      } satisfies APIResponse;
    }
  });

  // GET /api/projects/:projectId/prds - List PRDs for project
  fastify.get<{ Params: { projectId: string }; Querystring: QueryParams }>(
    "/projects/:projectId/prds",
    async request => {
      const paginationResult = PaginationOptionsSchema.safeParse({
        page: request.query.page ? parseInt(request.query.page) : undefined,
        limit: request.query.limit ? parseInt(request.query.limit) : undefined,
        sortBy: request.query.sortBy,
        sortOrder: request.query.sortOrder,
      });

      if (!paginationResult.success) {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid pagination parameters",
            details: paginationResult.error.issues,
          },
        } satisfies APIResponse;
      }

      try {
        const result = await prdService.getPRDsByProject(
          request.params.projectId,
          MOCK_USER_ID,
          paginationResult.data
        );
        return {
          success: true,
          data: result.prds,
          meta: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
          },
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to fetch PRDs",
          },
        } satisfies APIResponse;
      }
    }
  );

  // GET /api/projects/:projectId/prds/:id - Get PRD by ID
  fastify.get<{ Params: ProjectPRDParams }>(
    "/projects/:projectId/prds/:id",
    async request => {
      try {
        const prd = await prdService.getPRDById(
          request.params.id!,
          MOCK_USER_ID
        );

        if (!prd) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "PRD not found",
            },
          } satisfies APIResponse;
        }

        return {
          success: true,
          data: prd,
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to fetch PRD",
          },
        } satisfies APIResponse;
      }
    }
  );

  // POST /api/projects/:projectId/prds - Create new PRD
  fastify.post<{ Params: { projectId: string }; Body: unknown }>(
    "/projects/:projectId/prds",
    async request => {
      const validationResult = CreatePRDDTOSchema.safeParse(request.body);

      if (!validationResult.success) {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid PRD data",
            details: validationResult.error.issues,
          },
        } satisfies APIResponse;
      }

      try {
        const prd = await prdService.createPRD(
          request.params.projectId,
          MOCK_USER_ID,
          validationResult.data
        );

        if (!prd) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "Project not found",
            },
          } satisfies APIResponse;
        }

        return {
          success: true,
          data: prd,
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to create PRD",
          },
        } satisfies APIResponse;
      }
    }
  );

  // PUT /api/projects/:projectId/prds/:id - Update PRD
  fastify.put<{ Params: ProjectPRDParams; Body: unknown }>(
    "/projects/:projectId/prds/:id",
    async request => {
      const validationResult = UpdatePRDDTOSchema.safeParse(request.body);

      if (!validationResult.success) {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid PRD update data",
            details: validationResult.error.issues,
          },
        } satisfies APIResponse;
      }

      try {
        const prd = await prdService.updatePRD(
          request.params.id!,
          MOCK_USER_ID,
          validationResult.data
        );

        if (!prd) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "PRD not found",
            },
          } satisfies APIResponse;
        }

        return {
          success: true,
          data: prd,
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to update PRD",
          },
        } satisfies APIResponse;
      }
    }
  );

  // POST /api/projects/:projectId/prds/upload - Upload PRD markdown file
  fastify.post<{ Params: { projectId: string } }>(
    "/projects/:projectId/prds/upload",
    async request => {
      try {
        // Check if file was uploaded
        const data = await request.file();

        if (!data) {
          return {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "No file uploaded",
            },
          } satisfies APIResponse;
        }

        // Validate file type
        if (
          !data.filename?.endsWith(".md") &&
          !data.filename?.endsWith(".markdown")
        ) {
          return {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "File must be a markdown file (.md or .markdown)",
            },
          } satisfies APIResponse;
        }

        // Read file content
        const buffer = await data.toBuffer();
        const content = buffer.toString("utf-8");

        // Parse markdown with YAML front-matter
        let parsedPRD;
        try {
          parsedPRD = parsePRDMarkdown(content);
        } catch (parseError) {
          return {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: `Failed to parse PRD: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
            },
          } satisfies APIResponse;
        }

        // Validate content structure
        const contentValidation = validatePRDContent(parsedPRD.content);

        // Extract title from content if not provided
        let title = extractTitleFromContent(parsedPRD.content);
        if (!title) {
          title =
            data.filename.replace(/\.(md|markdown)$/i, "") || "Untitled PRD";
        }

        // Create PRD using the service
        const prdData = {
          title,
          content: parsedPRD.content,
          metadata: parsedPRD.metadata,
          version: "1.0.0",
        };

        const prd = await prdService.createPRD(
          request.params.projectId,
          MOCK_USER_ID,
          prdData
        );

        if (!prd) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "Project not found",
            },
          } satisfies APIResponse;
        }

        return {
          success: true,
          data: {
            prd,
            validation: {
              contentWarnings: contentValidation.errors,
              hasYamlFrontMatter: !!parsedPRD.rawYaml,
            },
          },
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to upload PRD",
          },
        } satisfies APIResponse;
      }
    }
  );

  // DELETE /api/projects/:projectId/prds/:id - Delete PRD
  fastify.delete<{ Params: ProjectPRDParams }>(
    "/projects/:projectId/prds/:id",
    async request => {
      try {
        const deleted = await prdService.deletePRD(
          request.params.id!,
          MOCK_USER_ID
        );

        if (!deleted) {
          return {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "PRD not found",
            },
          } satisfies APIResponse;
        }

        return {
          success: true,
          data: { deleted: true },
        } satisfies APIResponse;
      } catch (error) {
        fastify.log.error(error);
        return {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to delete PRD",
          },
        } satisfies APIResponse;
      }
    }
  );
}

export default projectRoutes;
