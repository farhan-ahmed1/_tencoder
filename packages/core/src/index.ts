export interface Task {
  id: string;
  epicId: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "out_of_date";
  acceptance: string[];
  checkers: Checker[];
  trace: {
    prdRefs: string[];
    repoSignals: string[];
  };
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

export interface Checker {
  type: string;
  config: Record<string, unknown>;
}

export interface ProjectSignal {
  type: string;
  value: unknown;
  timestamp: number;
}
