"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@tencoder/ui";

// Mock data for development
const mockProjects = [
  {
    id: "proj-1",
    name: "_tencoder Development",
    description: "Self-updating project planner implementation",
    repoUrl: "https://github.com/farhan-ahmed1/_tencoder",
    isActive: true,
    createdAt: new Date("2025-08-25T10:00:00Z"),
    updatedAt: new Date("2025-08-27T16:00:00Z"),
    prds: [
      {
        id: "prd-1",
        title: "PRD Ingestion Feature",
        version: "1.0.0",
        isActive: true,
        createdAt: new Date("2025-08-27T14:00:00Z"),
      },
    ],
  },
  {
    id: "proj-2",
    name: "Sample Project",
    description: "A sample project for testing",
    repoUrl: null,
    isActive: true,
    createdAt: new Date("2025-08-26T09:00:00Z"),
    updatedAt: new Date("2025-08-26T09:00:00Z"),
    prds: [],
  },
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and their requirements documents
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            New Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {project.name}
                    </Link>
                  </CardTitle>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                  )}
                </div>
                <Badge variant={project.isActive ? "success" : "secondary"}>
                  {project.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.repoUrl && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Repository: </span>
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

                <div className="text-sm">
                  <span className="text-muted-foreground">PRDs: </span>
                  <span className="font-medium">{project.prds.length}</span>
                  {project.prds.length > 0 && (
                    <span className="text-muted-foreground ml-2">
                      (Latest: {project.prds[0].title})
                    </span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated {project.updatedAt.toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                  >
                    View
                  </Link>
                  <Link
                    href={`/projects/${project.id}/prds/upload`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                  >
                    Upload PRD
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockProjects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No projects found
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by creating your first project
          </p>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create Project
          </Link>
        </div>
      )}
    </div>
  );
}
