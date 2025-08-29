"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@tencoder/ui";
import { useProject } from "@/components/project-provider";

export default function Home() {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to _tencoder
          </h1>
          <p className="text-muted-foreground">
            Your self-updating project planner
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Status */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">User:</span>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.name || session.user?.email}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Mode:</span>
                  <p className="text-sm text-muted-foreground">
                    Single User Mode Enabled
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Authenticated</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Total Projects:</span>
                  <p className="text-sm text-muted-foreground">
                    {projects.length}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Active Project:</span>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject?.name || "None selected"}
                  </p>
                </div>
                {selectedProject && (
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground">
                      {selectedProject.description || "No description"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/projects")}
                  className="w-full text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                >
                  Manage Projects
                </button>
                <button
                  onClick={() => router.push("/board")}
                  className="w-full text-left p-2 text-sm bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                >
                  View Task Board
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status - Day 6</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">✅ Completed</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Minimal session auth with NextAuth.js</li>
                    <li>• Single-user mode toggle via environment variables</li>
                    <li>• Project switcher in navigation</li>
                    <li>• Per-project context and state management</li>
                    <li>• User authentication middleware</li>
                    <li>• Protected routes implementation</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">🔄 Working</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• PRD scoping per project</li>
                    <li>• Multi-project environment settings</li>
                    <li>• Project-specific task isolation</li>
                    <li>• Enhanced settings page</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
