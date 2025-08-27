import { ProjectSignal } from "@tencoder/core";

export class RepoAnalyzer {
  analyzeProject(_repoPath: string): ProjectSignal[] {
    // Placeholder implementation
    return [
      {
        type: "project_type",
        value: "typescript",
        timestamp: Date.now(),
      },
    ];
  }
}
