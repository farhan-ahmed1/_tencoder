"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@tencoder/ui";
import { config } from "@/lib/config";

interface PRD {
  id: string;
  title: string;
  content: string;
  metadata: {
    objectives: string[];
    milestones: Array<{
      name: string;
      description: string;
      dueDate?: string;
      dependencies?: string[];
    }>;
    constraints: string[];
    definitionOfDone: string[];
    targetAudience?: string;
    successMetrics?: Array<{
      name: string;
      target: string;
      measurement: string;
    }>;
  };
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PRDViewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const prdId = params.prdId as string;

  const [prd, setPrd] = useState<PRD | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/api/projects/${projectId}/prds/${prdId}`
        );
        const result = await response.json();

        if (result.success) {
          setPrd(result.data);
        } else {
          setError(result.error?.message || "Failed to load PRD");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchPRD();
  }, [projectId, prdId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Loading PRD...</div>
        </div>
      </div>
    );
  }

  if (error || !prd) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error || "PRD not found"}
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">{prd.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={prd.isActive ? "success" : "secondary"}>
              {prd.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">v{prd.version}</Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Created {new Date(prd.createdAt).toLocaleDateString()} • Updated{" "}
          {new Date(prd.updatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Markdown Content */}
          <Card>
            <CardHeader>
              <CardTitle>Document Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={prd.content} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata Sidebar */}
        <div className="space-y-6">
          {/* Objectives */}
          {prd.metadata.objectives && prd.metadata.objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prd.metadata.objectives.map((objective, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Milestones */}
          {prd.metadata.milestones && prd.metadata.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prd.metadata.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary/20 pl-3"
                    >
                      <div className="font-medium text-sm">
                        {milestone.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {milestone.description}
                      </div>
                      {milestone.dueDate && (
                        <div className="text-xs text-primary mt-1">
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      {milestone.dependencies &&
                        milestone.dependencies.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Depends on: {milestone.dependencies.join(", ")}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Constraints */}
          {prd.metadata.constraints && prd.metadata.constraints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prd.metadata.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-yellow-500">⚠</span>
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Definition of Done */}
          {prd.metadata.definitionOfDone &&
            prd.metadata.definitionOfDone.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Definition of Done</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prd.metadata.definitionOfDone.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm flex items-start gap-2"
                      >
                        <span className="text-green-500">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* Target Audience */}
          {prd.metadata.targetAudience && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{prd.metadata.targetAudience}</p>
              </CardContent>
            </Card>
          )}

          {/* Success Metrics */}
          {prd.metadata.successMetrics &&
            prd.metadata.successMetrics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prd.metadata.successMetrics.map((metric, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{metric.name}</div>
                        <div className="text-muted-foreground">
                          Target: {metric.target}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Measured by: {metric.measurement}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}

// Simple markdown renderer component
function MarkdownRenderer({ content }: { content: string }) {
  // Convert markdown to basic HTML-like structure
  const renderMarkdown = (text: string) => {
    // This is a very basic markdown renderer
    // In production, you'd want to use a proper markdown library
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold mt-6 mb-4">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-bold mt-5 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-bold mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={i} className="ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      } else if (line.trim() === "") {
        elements.push(<br key={i} />);
      } else {
        elements.push(
          <p key={i} className="mb-2">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return <div>{renderMarkdown(content)}</div>;
}
