import React from "react";
import { Navigation } from "@/components/navigation";
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
        <Navigation />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
