import matter from "gray-matter";
import { PRDMetadataSchema } from "@tencoder/core";
import { z } from "zod";

export interface ParsedMarkdown {
  content: string;
  metadata: unknown;
  rawYaml?: string;
}

export interface ParsedPRD {
  content: string;
  metadata: z.infer<typeof PRDMetadataSchema>;
  rawYaml?: string;
}

/**
 * Parse markdown content with YAML front-matter
 */
export function parseMarkdown(markdownContent: string): ParsedMarkdown {
  try {
    const parsed = matter(markdownContent);

    return {
      content: parsed.content.trim(),
      metadata: parsed.data,
      rawYaml: parsed.matter ? parsed.matter : undefined,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse markdown: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Parse and validate PRD markdown content
 */
export function parsePRDMarkdown(markdownContent: string): ParsedPRD {
  const parsed = parseMarkdown(markdownContent);

  // Validate metadata against PRD schema
  const validationResult = PRDMetadataSchema.safeParse(parsed.metadata);

  if (!validationResult.success) {
    throw new Error(`Invalid PRD metadata: ${validationResult.error.message}`);
  }

  return {
    content: parsed.content,
    metadata: validationResult.data,
    rawYaml: parsed.rawYaml,
  };
}

/**
 * Validate markdown content structure for PRD requirements
 */
export function validatePRDContent(content: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check minimum content length
  if (content.trim().length < 100) {
    errors.push("PRD content must be at least 100 characters long");
  }

  // Check for common PRD sections (optional but recommended)
  const commonSections = [
    "## Problem",
    "## Solution",
    "## Requirements",
    "## Success Criteria",
    "## Timeline",
  ];

  const missingSections = commonSections.filter(
    section => !content.toLowerCase().includes(section.toLowerCase())
  );

  if (missingSections.length > 3) {
    errors.push(
      `Consider adding common PRD sections: ${missingSections.join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Extract title from markdown content if not provided in front-matter
 */
export function extractTitleFromContent(content: string): string | null {
  // Look for first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Look for first H2 heading as fallback
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }

  return null;
}
