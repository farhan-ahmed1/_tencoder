"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProject } from "./project-provider";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Board", href: "/board" },
  { name: "Settings", href: "/settings" },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { selectedProject, setSelectedProject, projects, loading } =
    useProject();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  if (status === "loading" || loading) {
    return (
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                _tencoder
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (!session) {
    return (
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                _tencoder
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signIn()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-md font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                _tencoder
              </Link>
            </div>

            {/* Project Switcher */}
            {projects.length > 0 && (
              <div className="ml-6 flex items-center relative">
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <span>{selectedProject?.name || "Select Project"}</span>
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform",
                      showProjectDropdown && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showProjectDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {projects.map(project => (
                        <button
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setShowProjectDropdown(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                            selectedProject?.id === project.id &&
                              "bg-gray-50 font-medium"
                          )}
                        >
                          <div>
                            <div className="font-medium">{project.name}</div>
                            {project.description && (
                              <div className="text-gray-500 text-xs truncate">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                      <div className="border-t mt-1 pt-1">
                        <Link
                          href="/projects"
                          onClick={() => setShowProjectDropdown(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100"
                        >
                          + Create New Project
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                    pathname === item.href &&
                      "border-primary text-primary hover:text-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              {session.user?.name || session.user?.email}
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
