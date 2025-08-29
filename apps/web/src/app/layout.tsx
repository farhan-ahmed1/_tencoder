import React from "react";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { ProjectProvider } from "@/components/project-provider";
import "./globals.css";

export const metadata = {
  title: "_tencoder",
  description: "Self-updating project planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <ProjectProvider>
            <Navigation />
            <main className="flex-1">{children}</main>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
