"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Project } from "@tencoder/core";
import { config } from "@/lib/config";

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects when user is authenticated
  useEffect(() => {
    const loadProjects = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.apiUrl}/api/projects`, {
          headers: {
            "x-user-id": session.user.id,
          },
        });
        const result = await response.json();

        if (result.success && result.data) {
          setProjects(result.data);

          // Load selected project from localStorage or select first project
          const savedProjectId = localStorage.getItem("selectedProjectId");
          if (savedProjectId) {
            const savedProject = result.data.find(
              (p: Project) => p.id === savedProjectId
            );
            if (savedProject) {
              setSelectedProject(savedProject);
            }
          } else if (result.data.length > 0) {
            setSelectedProject(result.data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [session]);

  // Save selected project to localStorage
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProjectId", selectedProject.id);
    }
  }, [selectedProject]);

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
        setProjects,
        loading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
