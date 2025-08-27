import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tencoder/ui";

export default function Settings() {
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
          <Card>
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
              <CardDescription>
                Configure your project settings, repository connections, and
                planning preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Settings configuration will be implemented in future iterations.
              </p>
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
              <p className="text-sm text-muted-foreground">
                GitHub integration will be implemented in future iterations.
              </p>
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
              <p className="text-sm text-muted-foreground">
                PRD management interface will be implemented in future
                iterations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
