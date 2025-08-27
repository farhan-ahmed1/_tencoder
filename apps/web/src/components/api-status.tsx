"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@tencoder/ui";
import { Badge } from "@tencoder/ui";

interface HealthResponse {
  ok: boolean;
  version: string;
  timestamp: string;
  environment: string;
  uptime: number;
}

export function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
          setStatus("connected");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          API Status
          <Badge
            variant={
              status === "connected"
                ? "default"
                : status === "error"
                  ? "destructive"
                  : "secondary"
            }
          >
            {status === "loading" && "Checking..."}
            {status === "connected" && "Connected"}
            {status === "error" && "Error"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {health && (
          <div className="space-y-2 text-sm">
            <div>Version: {health.version}</div>
            <div>Environment: {health.environment}</div>
            <div>Uptime: {Math.floor(health.uptime)}s</div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive">Unable to connect to API</p>
        )}
      </CardContent>
    </Card>
  );
}
