import { prisma } from "./database";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  CreatePRDDTO,
  UpdatePRDDTO,
  PaginationOptions,
  Project,
  PRD,
} from "@tencoder/core";

/* eslint-disable @typescript-eslint/no-explicit-any */

export class ProjectService {
  async createProject(
    userId: string,
    data: CreateProjectDTO
  ): Promise<Project> {
    // Extract repo owner and name from URL if provided
    let repoOwner: string | undefined;
    let repoName: string | undefined;

    if (data.repoUrl) {
      const match = data.repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        repoOwner = match[1];
        repoName = match[2].replace(/\.git$/, "");
      }
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        repoUrl: data.repoUrl,
        repoOwner,
        repoName,
        userId,
      },
      include: {
        user: true,
        prds: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        epics: {
          orderBy: { priority: "asc" },
        },
        _count: {
          select: {
            signals: true,
            runDigests: true,
          },
        },
      },
    });

    return {
      ...project,
      description: project.description ?? undefined,
      repoUrl: project.repoUrl ?? undefined,
      repoOwner: project.repoOwner ?? undefined,
      repoName: project.repoName ?? undefined,
      user: project.user
        ? {
            ...project.user,
            name: project.user.name ?? undefined,
            avatarUrl: project.user.avatarUrl ?? undefined,
          }
        : undefined,
      prds: project.prds?.map((prd: any) => ({
        ...prd,
        metadata: JSON.parse(prd.metadata),
        createdAt: prd.createdAt,
        updatedAt: prd.updatedAt,
      })),
      epics: project.epics?.map((epic: any) => ({
        ...epic,
        createdAt: epic.createdAt,
        updatedAt: epic.updatedAt,
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async getProjectById(id: string, userId: string): Promise<Project | null> {
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: true,
        prds: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        epics: {
          orderBy: { priority: "asc" },
          include: {
            tasks: {
              orderBy: { priority: "asc" },
            },
          },
        },
        signals: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        runDigests: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!project) return null;

    return {
      ...project,
      description: project.description ?? undefined,
      repoUrl: project.repoUrl ?? undefined,
      repoOwner: project.repoOwner ?? undefined,
      repoName: project.repoName ?? undefined,
      user: project.user
        ? {
            ...project.user,
            name: project.user.name ?? undefined,
            avatarUrl: project.user.avatarUrl ?? undefined,
          }
        : undefined,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      prds: project.prds.map((prd: any) => ({
        ...prd,
        metadata: JSON.parse(prd.metadata),
        createdAt: prd.createdAt,
        updatedAt: prd.updatedAt,
      })),
      epics: project.epics.map((epic: any) => ({
        ...epic,
        createdAt: epic.createdAt,
        updatedAt: epic.updatedAt,
        tasks: epic.tasks?.map((task: any) => ({
          ...task,
          acceptance: JSON.parse(task.acceptance),
          checkers: JSON.parse(task.checkers),
          trace: JSON.parse(task.trace),
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
      })),
      signals: project.signals?.map((signal: any) => ({
        ...signal,
        value: JSON.parse(signal.value),
        metadata: signal.metadata ? JSON.parse(signal.metadata) : undefined,
        timestamp: signal.timestamp,
      })),
      runDigests: project.runDigests?.map((digest: any) => ({
        ...digest,
        completedTasks: JSON.parse(digest.completedTasks),
        newTasks: JSON.parse(digest.newTasks),
        blockers: JSON.parse(digest.blockers),
        insights: JSON.parse(digest.insights),
        createdAt: digest.createdAt,
      })),
    };
  }

  async getProjects(userId: string, options: PaginationOptions = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = options;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        include: {
          prds: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              epics: true,
              signals: true,
              runDigests: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.project.count({ where: { userId } }),
    ]);

    return {
      projects: projects.map((project: any) => ({
        ...project,
        description: project.description ?? undefined,
        repoUrl: project.repoUrl ?? undefined,
        repoOwner: project.repoOwner ?? undefined,
        repoName: project.repoName ?? undefined,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        prds: project.prds.map((prd: any) => ({
          ...prd,
          metadata: JSON.parse(prd.metadata),
          createdAt: prd.createdAt,
          updatedAt: prd.updatedAt,
        })),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateProject(
    id: string,
    userId: string,
    data: UpdateProjectDTO
  ): Promise<Project | null> {
    // Extract repo owner and name from URL if provided
    let repoOwner: string | undefined;
    let repoName: string | undefined;

    if (data.repoUrl) {
      const match = data.repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        repoOwner = match[1];
        repoName = match[2].replace(/\.git$/, "");
      }
    }

    const project = await prisma.project.updateMany({
      where: { id, userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl }),
        ...(repoOwner && { repoOwner }),
        ...(repoName && { repoName }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    if (project.count === 0) return null;

    return this.getProjectById(id, userId);
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const result = await prisma.project.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}

export interface CreatePRDWithActiveDTO extends CreatePRDDTO {
  isActive?: boolean;
}

export class PRDService {
  async createPRD(
    projectId: string,
    userId: string,
    data: CreatePRDWithActiveDTO
  ): Promise<PRD | null> {
    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) return null;

    // Deactivate previous PRD if this is active
    if (data.isActive !== false) {
      await prisma.pRD.updateMany({
        where: { projectId, isActive: true },
        data: { isActive: false },
      });
    }

    const prd = await prisma.pRD.create({
      data: {
        projectId,
        title: data.title,
        content: data.content,
        metadata: JSON.stringify(data.metadata),
        version: data.version || "1.0.0",
        isActive: data.isActive !== false,
      },
      include: {
        project: true,
      },
    });

    return {
      ...prd,
      metadata: JSON.parse(prd.metadata),
      createdAt: prd.createdAt,
      updatedAt: prd.updatedAt,
      project: prd.project
        ? {
            ...prd.project,
            description: prd.project.description ?? undefined,
            repoUrl: prd.project.repoUrl ?? undefined,
            repoOwner: prd.project.repoOwner ?? undefined,
            repoName: prd.project.repoName ?? undefined,
          }
        : undefined,
    };
  }

  async getPRDById(id: string, userId: string): Promise<PRD | null> {
    const prd = await prisma.pRD.findFirst({
      where: {
        id,
        project: { userId },
      },
      include: {
        project: true,
      },
    });

    if (!prd) return null;

    return {
      ...prd,
      metadata: JSON.parse(prd.metadata),
      createdAt: prd.createdAt,
      updatedAt: prd.updatedAt,
      project: prd.project
        ? {
            ...prd.project,
            description: prd.project.description ?? undefined,
            repoUrl: prd.project.repoUrl ?? undefined,
            repoOwner: prd.project.repoOwner ?? undefined,
            repoName: prd.project.repoName ?? undefined,
          }
        : undefined,
    };
  }

  async getPRDsByProject(
    projectId: string,
    userId: string,
    options: PaginationOptions = {}
  ) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;
    const skip = (page - 1) * limit;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return {
        prds: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const [prds, total] = await Promise.all([
      prisma.pRD.findMany({
        where: { projectId },
        include: {
          project: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.pRD.count({ where: { projectId } }),
    ]);

    return {
      prds: prds.map((prd: any) => ({
        ...prd,
        metadata: JSON.parse(prd.metadata),
        createdAt: prd.createdAt,
        updatedAt: prd.updatedAt,
        project: prd.project
          ? {
              ...prd.project,
              description: prd.project.description ?? undefined,
              repoUrl: prd.project.repoUrl ?? undefined,
              repoOwner: prd.project.repoOwner ?? undefined,
              repoName: prd.project.repoName ?? undefined,
            }
          : undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updatePRD(
    id: string,
    userId: string,
    data: UpdatePRDDTO
  ): Promise<PRD | null> {
    // Verify ownership through project
    const existingPRD = await prisma.pRD.findFirst({
      where: {
        id,
        project: { userId },
      },
    });

    if (!existingPRD) return null;

    // If making this PRD active, deactivate others
    if (data.isActive === true) {
      await prisma.pRD.updateMany({
        where: {
          projectId: existingPRD.projectId,
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      });
    }

    const prd = await prisma.pRD.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.metadata && { metadata: JSON.stringify(data.metadata) }),
        ...(data.version && { version: data.version }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        project: true,
      },
    });

    return {
      ...prd,
      metadata: JSON.parse(prd.metadata),
      createdAt: prd.createdAt,
      updatedAt: prd.updatedAt,
      project: prd.project
        ? {
            ...prd.project,
            description: prd.project.description ?? undefined,
            repoUrl: prd.project.repoUrl ?? undefined,
            repoOwner: prd.project.repoOwner ?? undefined,
            repoName: prd.project.repoName ?? undefined,
          }
        : undefined,
    };
  }

  async deletePRD(id: string, userId: string): Promise<boolean> {
    const result = await prisma.pRD.deleteMany({
      where: {
        id,
        project: { userId },
      },
    });
    return result.count > 0;
  }
}
