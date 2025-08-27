import React from "react";
import { Task } from "@tencoder/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import { cn } from "./utils";

export interface TaskCardProps {
  task: Task;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, className }) => {
  const getStatusVariant = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "success";
      case "in_progress":
        return "info";
      case "out_of_date":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(task.status)}>
            {task.status.replace("_", " ")}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Epic: {task.epicId}
          </span>
        </div>
      </CardHeader>
      {task.acceptance.length > 0 && (
        <CardContent>
          <CardDescription>
            <strong>Acceptance Criteria:</strong>
          </CardDescription>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {task.acceptance.map((criteria, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {criteria}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
};

// Export all components
export * from "./button";
export * from "./card";
export * from "./badge";
export * from "./utils";

// Re-export types from core
export type { Task, Epic, Checker, ProjectSignal } from "@tencoder/core";
