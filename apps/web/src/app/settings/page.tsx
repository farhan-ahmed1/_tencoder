"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tencoder/ui";
import { config } from "@/lib/config";

export default function Settings() {
  const { data: session } = useSession();
  const [singleUserMode, setSingleUserMode] = useState(config.singleUserMode);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your project settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Your current user details and authentication status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {session ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {session.user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {session.user.name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <p className="text-sm text-gray-500 font-mono">
                      {session.user.id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not authenticated. Please sign in.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Authentication Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Mode</CardTitle>
              <CardDescription>
                Configure single-user vs multi-user authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Single User Mode
                  </label>
                  <p className="text-sm text-gray-500">
                    {singleUserMode
                      ? "Single user mode is enabled - no external authentication required."
                      : "Multi-user mode is enabled - external authentication required."}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      singleUserMode
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {singleUserMode ? "Single User" : "Multi User"}
                  </span>
                </div>
              </div>
              {singleUserMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> Single user mode is configured via
                    environment variables. To enable multi-user mode, set
                    SINGLE_USER_MODE=false in your environment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
              <CardDescription>
                Configure your project settings, repository connections, and
                planning preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  API URL
                </label>
                <p className="text-sm text-gray-500 font-mono">
                  {config.apiUrl}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Environment
                </label>
                <p className="text-sm text-gray-500">
                  {config.isDevelopment
                    ? "Development"
                    : config.isProduction
                      ? "Production"
                      : "Unknown"}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-700">
                  Project-specific settings will be configurable once you select
                  a project from the project switcher in the navigation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repository Integration</CardTitle>
              <CardDescription>
                Connect your GitHub repository for automatic analysis and task
                updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-sm text-gray-600">
                  <strong>Coming Soon:</strong> GitHub integration will be
                  implemented in future iterations. This will include automatic
                  repository scanning, webhook setup, and CI/CD integration.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PRD Management</CardTitle>
              <CardDescription>
                Upload and manage your Product Requirements Documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-sm text-gray-600">
                  <strong>Coming Soon:</strong> PRD processing settings will
                  include options for:
                </p>
                <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc">
                  <li>Automatic task generation from PRD updates</li>
                  <li>Coverage target thresholds</li>
                  <li>Custom validation rules</li>
                  <li>Integration with planning tools</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
