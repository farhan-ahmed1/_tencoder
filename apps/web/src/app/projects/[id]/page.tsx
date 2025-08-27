"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@tencoder/ui";
import { config } from "@/lib/config";
import type { Project } from "@tencoder/core";

interface ProjectResponse {
  success: boolean;
  data?: Project;
  error?: {
    code: string;
    message: string;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/api/projects/${projectId}`
        );
        const result: ProjectResponse = await response.json();

        if (result.success && result.data) {
          setProject(result.data);
        } else {
          setError(result.error?.message || "Failed to load project");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error || "Project not found"}
            </div>
            <div className="text-center mt-4">
              <Link href="/projects" className="text-primary hover:underline">
                ← Back to Projects
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/projects" className="hover:text-primary">
            Projects
          </Link>
          <span>→</span>
          <span>{project.name}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={project.isActive ? "success" : "secondary"}>
              {project.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {project.description && (
          <p className="text-muted-foreground text-lg mb-4">
            {project.description}
          </p>
        )}

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span>•</span>
          <span>
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRDs Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Project Requirements Documents</CardTitle>
                <Link
                  href={`/projects/${project.id}/prds/upload`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Upload PRD
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {project.prds && project.prds.length > 0 ? (
                <div className="space-y-3">
                  {project.prds.map(prd => (
                    <div
                      key={prd.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                            href={`/projects/${project.id}/prds/${prd.id}`}
                            className="text-lg font-medium hover:text-primary transition-colors"
                          >
                            {prd.title}
                          </Link>
                          <div className="flex gap-2 mt-2">
                            <Badge
                              variant={prd.isActive ? "success" : "secondary"}
                            >
                              {prd.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">v{prd.version}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            Created{" "}
                            {new Date(prd.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/projects/${project.id}/prds/${prd.id}`}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mb-2">No PRDs uploaded yet</div>
                  <div className="text-sm">
                    Upload your first PRD to get started
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Epics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Epics</CardTitle>
            </CardHeader>
            <CardContent>
              {project.epics && project.epics.length > 0 ? (
                <div className="space-y-3">
                  {project.epics.map(epic => (
                    <div key={epic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{epic.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {epic.description}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {epic.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No epics generated yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.repoUrl && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Repository
                  </div>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {project.repoUrl.replace("https://github.com/", "")}
                  </a>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                <Badge variant={project.isActive ? "success" : "secondary"}>
                  {project.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Created
                </div>
                <div className="text-sm">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </div>
                <div className="text-sm">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">PRDs</span>
                <span className="font-medium">{project.prds?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Epics</span>
                <span className="font-medium">
                  {project.epics?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signals</span>
                <span className="font-medium">
                  {project.signals?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
