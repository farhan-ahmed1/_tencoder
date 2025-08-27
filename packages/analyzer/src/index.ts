import { Signal } from "@tencoder/core";

export class RepoAnalyzer {
  analyzeProject(_repoPath: string): Signal[] {
    // Placeholder implementation
    return [
      {
        id: "signal-1",
        projectId: "placeholder",
        type: "project_type",
        value: "typescript",
        timestamp: new Date(),
      },
    ];
  }
}
