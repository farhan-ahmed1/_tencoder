"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@tencoder/ui";
import { config } from "@/lib/config";

interface UploadResult {
  success: boolean;
  data?: {
    prd: {
      id: string;
      title: string;
      content: string;
      metadata: any;
      version: string;
    };
    validation: {
      contentWarnings: string[];
      hasYamlFrontMatter: boolean;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

interface ParsedMetadata {
  objectives?: string[];
  milestones?: Array<{
    name: string;
    description: string;
    dueDate?: string;
  }>;
  constraints?: string[];
  definitionOfDone?: string[];
  targetAudience?: string;
  successMetrics?: Array<{
    name: string;
    target: string;
    measurement: string;
  }>;
}

export default function UploadPRDPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null); // Clear any previous results
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/markdown": [".md", ".markdown"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Use the configured API URL
      const response = await fetch(
        `${config.apiUrl}/api/projects/${projectId}/prds/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result: UploadResult = await response.json();
      setUploadResult(result);

      if (result.success) {
        // Optional: redirect to the PRD view after a delay
        setTimeout(() => {
          router.push(`/projects/${projectId}/prds/${result.data?.prd.id}`);
        }, 3000);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message:
            "Failed to upload file. Please check your connection and try again.",
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload PRD</h1>
        <p className="text-muted-foreground">
          Upload a markdown file with YAML front-matter containing your Project
          Requirements Document
        </p>
      </div>

      <div className="grid gap-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Select Markdown File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : selectedFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-primary"
              }`}
            >
              <input {...getInputProps()} />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="text-green-600 font-medium">
                    File Selected
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)}{" "}
                    KB)
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : isDragActive ? (
                <div>
                  <div className="text-primary font-medium">
                    Drop the file here
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Release to upload your markdown file
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="font-medium">
                    Drag and drop a markdown file here, or click to select
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Supported formats: .md, .markdown (max 5MB)
                  </div>
                </div>
              )}
            </div>

            {selectedFile && !uploadResult && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {isUploading ? "Uploading..." : "Upload PRD"}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Result */}
        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle
                className={
                  uploadResult.success ? "text-green-600" : "text-red-600"
                }
              >
                {uploadResult.success ? "Upload Successful!" : "Upload Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadResult.success && uploadResult.data ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-green-600 mb-2">
                      PRD Created Successfully
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <div>
                        <strong>Title:</strong> {uploadResult.data.prd.title}
                      </div>
                      <div>
                        <strong>Version:</strong>{" "}
                        {uploadResult.data.prd.version}
                      </div>
                      <div>
                        <strong>ID:</strong> {uploadResult.data.prd.id}
                      </div>
                    </div>
                  </div>

                  {/* Metadata Preview */}
                  {uploadResult.data.prd.metadata && (
                    <div>
                      <h4 className="font-medium mb-2">Parsed Metadata</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <MetadataDisplay
                          metadata={uploadResult.data.prd.metadata}
                        />
                      </div>
                    </div>
                  )}

                  {/* Validation Warnings */}
                  {uploadResult.data.validation.contentWarnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">
                        Content Recommendations
                      </h4>
                      <ul className="bg-yellow-50 p-4 rounded-lg list-disc list-inside space-y-1">
                        {uploadResult.data.validation.contentWarnings.map(
                          (warning, index) => (
                            <li key={index} className="text-sm text-yellow-700">
                              {warning}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Redirecting to PRD view in a few seconds...
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-red-600 font-medium">
                    {uploadResult.error?.code}
                  </div>
                  <div className="text-sm text-red-700 mt-1">
                    {uploadResult.error?.message}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>PRD Format Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Required YAML Front-matter</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  {`---
objectives:
  - "Primary objective of the project"
  - "Secondary objective"
milestones:
  - name: "Milestone 1"
    description: "Description of milestone"
    dueDate: "2025-12-31"
constraints:
  - "Technical constraint"
  - "Business constraint"
definitionOfDone:
  - "Criteria for completion"
  - "Acceptance criteria"
---`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Optional Fields</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <code>targetAudience</code> - Who this PRD is for
                  </li>
                  <li>
                    <code>successMetrics</code> - How success will be measured
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Component to display parsed metadata
function MetadataDisplay({ metadata }: { metadata: ParsedMetadata }) {
  return (
    <div className="space-y-3 text-sm">
      {metadata.objectives && metadata.objectives.length > 0 && (
        <div>
          <strong>Objectives:</strong>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
            {metadata.objectives.map((obj, index) => (
              <li key={index}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {metadata.milestones && metadata.milestones.length > 0 && (
        <div>
          <strong>Milestones:</strong>
          <div className="ml-4 mt-1 space-y-2">
            {metadata.milestones.map((milestone, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-3">
                <div className="font-medium">{milestone.name}</div>
                <div className="text-muted-foreground">
                  {milestone.description}
                </div>
                {milestone.dueDate && (
                  <div className="text-xs text-muted-foreground">
                    Due: {milestone.dueDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {metadata.constraints && metadata.constraints.length > 0 && (
        <div>
          <strong>Constraints:</strong>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
            {metadata.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}

      {metadata.definitionOfDone && metadata.definitionOfDone.length > 0 && (
        <div>
          <strong>Definition of Done:</strong>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
            {metadata.definitionOfDone.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {metadata.targetAudience && (
        <div>
          <strong>Target Audience:</strong> {metadata.targetAudience}
        </div>
      )}

      {metadata.successMetrics && metadata.successMetrics.length > 0 && (
        <div>
          <strong>Success Metrics:</strong>
          <div className="ml-4 mt-1 space-y-1">
            {metadata.successMetrics.map((metric, index) => (
              <div key={index}>
                <span className="font-medium">{metric.name}:</span>{" "}
                {metric.target} ({metric.measurement})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
