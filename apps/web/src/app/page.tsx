import React from "react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">_tencoder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Self-updating project planner that bridges the gap between where
            your project is today and where you want it to be.
          </p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Get started by navigating to the{" "}
            <a
              href="/board"
              className="font-medium text-primary hover:underline"
            >
              Board
            </a>{" "}
            to view your project backlog.
          </p>
        </div>
      </div>
    </main>
  );
}
