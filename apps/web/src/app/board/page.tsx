"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TaskCard,
} from "@tencoder/ui";
import { Task } from "@tencoder/core";

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
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Project Board</h1>
        <p className="text-muted-foreground">
          Track your project tasks and their current status
        </p>
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
