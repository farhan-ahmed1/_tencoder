"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TaskCard,
} from "@tencoder/ui";
import { Task } from "@tencoder/core";
import { useProject } from "@/components/project-provider";

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "task-1",
    epicId: "epic-frontend",
    title: "Setup Tailwind CSS configuration",
    status: "done",
    acceptance: [
      "Tailwind config file created",
      "CSS variables defined",
      "PostCSS configured",
    ],
    checkers: [],
    trace: {
      prdRefs: ["frontend-setup"],
      repoSignals: ["tailwind-config"],
    },
    priority: 1,
    createdAt: new Date("2025-08-25T10:00:00Z"),
    updatedAt: new Date("2025-08-27T15:30:00Z"),
  },
  {
    id: "task-2",
    epicId: "epic-frontend",
    title: "Create navigation component",
    status: "in_progress",
    acceptance: [
      "Navigation bar with links",
      "Active route highlighting",
      "Responsive design",
    ],
    checkers: [],
    trace: {
      prdRefs: ["navigation-requirement"],
      repoSignals: ["nav-component"],
    },
    priority: 2,
    createdAt: new Date("2025-08-26T09:00:00Z"),
    updatedAt: new Date("2025-08-27T16:00:00Z"),
  },
  {
    id: "task-3",
    epicId: "epic-ui-components",
    title: "Build shadcn/ui components",
    status: "todo",
    acceptance: [
      "Button component created",
      "Card component created",
      "Badge component created",
    ],
    checkers: [],
    trace: {
      prdRefs: ["ui-library"],
      repoSignals: [],
    },
    priority: 3,
    createdAt: new Date("2025-08-27T08:00:00Z"),
    updatedAt: new Date("2025-08-27T08:00:00Z"),
  },
  {
    id: "task-4",
    epicId: "epic-api-integration",
    title: "Setup API configuration",
    status: "out_of_date",
    acceptance: [
      "Environment variables configured",
      "API client setup",
      "Error handling implemented",
    ],
    checkers: [],
    trace: {
      prdRefs: ["api-integration"],
      repoSignals: ["env-config"],
    },
    priority: 4,
    createdAt: new Date("2025-08-25T14:00:00Z"),
    updatedAt: new Date("2025-08-26T10:00:00Z"),
  },
];

const statusColumns = [
  {
    status: "todo" as const,
    title: "To Do",
    tasks: mockTasks.filter(t => t.status === "todo"),
  },
  {
    status: "in_progress" as const,
    title: "In Progress",
    tasks: mockTasks.filter(t => t.status === "in_progress"),
  },
  {
    status: "done" as const,
    title: "Done",
    tasks: mockTasks.filter(t => t.status === "done"),
  },
  {
    status: "out_of_date" as const,
    title: "Out of Date",
    tasks: mockTasks.filter(t => t.status === "out_of_date"),
  },
];

export default function Board() {
  const { data: session, status } = useSession();
  const { selectedProject, projects, loading } = useProject();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to sign-in
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Project Board</h1>
        <p className="text-muted-foreground">
          Track your project tasks and their current status
          {selectedProject && ` for ${selectedProject.name}`}
        </p>
        {!selectedProject && projects.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              No project selected. Please select a project from the navigation
              menu to view its tasks.
            </p>
          </div>
        )}
        {projects.length === 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              No projects found.
              <button
                onClick={() => router.push("/projects")}
                className="ml-1 underline hover:no-underline"
              >
                Create your first project
              </button>{" "}
              to get started.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusColumns.map(column => (
          <Card key={column.status} className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {column.title}
                <span className="text-sm font-normal text-muted-foreground">
                  {column.tasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks
                </p>
              ) : (
                column.tasks.map(task => (
                  <TaskCard key={task.id} task={task} className="mb-3" />
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
