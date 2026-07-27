/**
 * scripts/knowledge/documents.ts
 *
 * Turns a folder of source documents into PreparedChunk objects.
 *
 * Drop files into content/knowledge/<source>/ and the matching prepare script
 * picks them up automatically:
 *
 *   content/knowledge/resume/rahul-yadav-resume.pdf
 *   content/knowledge/process/hiring-framework.md
 *   content/knowledge/linkedin/posts-2025.md
 *
 * Nested folders are walked recursively. Dotfiles and unsupported extensions
 * are skipped with a warning instead of failing the whole run.
 */

import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ChunkOptions } from "./chunker";
import { chunkText, countWords } from "./chunker";
import { isSupported, loadDocument } from "./loaders";
import type { KnowledgeSource, PreparedChunk } from "./types";
import { normalizeContent } from "./types";

/** Root folder holding the raw source documents. */
export const CONTENT_ROOT = path.join(process.cwd(), "content", "knowledge");

export function contentDir(source: KnowledgeSource): string {
  return path.join(CONTENT_ROOT, source);
}

/** Recursively collect supported files beneath a directory. */
async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await listFiles(full);
      files.push(...nested);
    } else if (isSupported(full)) {
      files.push(full);
    } else {
      console.warn("  ! ignoring unsupported file: " + entry.name);
    }
  }

  return files.sort();
}

/** Titles must be unique within a source, so disambiguate collisions. */
function uniquify(title: string, used: Set<string>): string {
  if (!used.has(title)) {
    used.add(title);
    return title;
  }

  let counter = 2;
  while (used.has(title + " [" + counter + "]")) {
    counter += 1;
  }

  const unique = title + " [" + counter + "]";
  used.add(unique);
  return unique;
}

/**
 * Load, split and title every document belonging to one source.
 * Returns an empty array when the folder is absent or has no usable files.
 */
export async function loadDocumentChunks(
  source: KnowledgeSource,
  options: ChunkOptions = {}
): Promise<PreparedChunk[]> {
  const dir = contentDir(source);

  if (!existsSync(dir)) {
    return [];
  }

  const files = await listFiles(dir);

  if (files.length === 0) {
    return [];
  }

  const used = new Set<string>();
  const chunks: PreparedChunk[] = [];

  for (const file of files) {
    const doc = await loadDocument(file, CONTENT_ROOT);
    const isMarkdown = doc.extension === ".md" || doc.extension === ".markdown";
    const pieces = chunkText(doc.text, isMarkdown, options);

    if (pieces.length === 0) {
      console.warn("  ! no readable text in " + doc.relativePath);
      continue;
    }

    pieces.forEach((piece, index) => {
      const base = piece.heading ? doc.name + " - " + piece.heading : doc.name;
      const numbered =
        pieces.length > 1
          ? base + " (" + (index + 1) + "/" + pieces.length + ")"
          : base;

      chunks.push({
        title: uniquify(numbered, used),
        content: normalizeContent(piece.content),
        origin: doc.relativePath,
      });
    });

    console.log(
      "  + " + doc.relativePath + ": " + countWords(doc.text) + " words -> " +
        pieces.length + " chunk(s)"
    );
  }

  return chunks;
}
