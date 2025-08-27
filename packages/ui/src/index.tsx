import React from "react";
import { Task } from "@tencoder/core";

export interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">Status: {task.status}</p>
    </div>
  );
};

export type { Task } from "@tencoder/core";
