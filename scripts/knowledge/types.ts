/**
 * scripts/knowledge/types.ts
 *
 * Shared types and artifact helpers for the knowledge preparation pipeline.
 *
 * PIPELINE OVERVIEW
 * -----------------
 *   prepare-*.ts  ->  data/knowledge/<source>.json  ->  seed-knowledge.ts  ->  KnowledgeChunk
 *
 * Each prepare-<source>.ts script owns ONE document type. It normalises its raw
 * material into PreparedChunk objects and writes them to a JSON artifact. The
 * seed script then reads those artifacts and pushes them to the datastore, so
 * preparation stays cheap and repeatable while the expensive embedding step
 * runs only when you actually seed.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/** The four knowledge categories supported by lib/db/rag.ts */
export type KnowledgeSource = "resume" | "linkedin" | "about" | "process";

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  "about",
  "resume",
  "linkedin",
  "process",
];

/** A single searchable chunk, before its embedding is generated. */
export type PreparedChunk = {
  title: string;
  content: string;
};

/** The on-disk shape of a prepared artifact. */
export type KnowledgeArtifact = {
  source: KnowledgeSource;
  preparedAt: string;
  chunkCount: number;
  chunks: PreparedChunk[];
};

/** Directory holding the generated artifacts. */
export const ARTIFACT_DIR = path.join(process.cwd(), "data", "knowledge");

export function artifactPath(source: KnowledgeSource): string {
  return path.join(ARTIFACT_DIR, source + ".json");
}

/** Collapse whitespace so chunks embed consistently. */
export function normalizeContent(parts: string[] | string): string {
  const raw = Array.isArray(parts) ? parts.join(" ") : parts;
  return raw.replace(/\s+/g, " ").trim();
}

/** True when a chunk is still an unfilled placeholder such as [PASTE POST CONTENT HERE]. */
export function isPlaceholder(chunk: PreparedChunk): boolean {
  const body = chunk.content.trim();
  return body === "" || /^\[[^\]]*\]$/.test(body);
}

/**
 * Validate and write one source's chunks to its JSON artifact.
 * Placeholder chunks are dropped with a warning so they never reach the vector DB.
 */
export async function writeArtifact(
  source: KnowledgeSource,
  chunks: PreparedChunk[]
): Promise<KnowledgeArtifact> {
  const usable: PreparedChunk[] = [];

  for (const chunk of chunks) {
    if (isPlaceholder(chunk)) {
      console.warn("  ! skipping placeholder chunk: " + chunk.title);
      continue;
    }
    usable.push({
      title: chunk.title.trim(),
      content: normalizeContent(chunk.content),
    });
  }

  const seen = new Set<string>();
  for (const chunk of usable) {
    if (seen.has(chunk.title)) {
      throw new Error("Duplicate chunk title in " + source + ": " + chunk.title);
    }
    seen.add(chunk.title);
  }

  const artifact: KnowledgeArtifact = {
    source,
    preparedAt: new Date().toISOString(),
    chunkCount: usable.length,
    chunks: usable,
  };

  if (!existsSync(ARTIFACT_DIR)) {
    await mkdir(ARTIFACT_DIR, { recursive: true });
  }

  await writeFile(
    artifactPath(source),
    JSON.stringify(artifact, null, 2) + "\n",
    "utf8"
  );
  console.log(
    "  -> wrote " + usable.length + " chunk(s) to data/knowledge/" + source + ".json"
  );

  return artifact;
}

/** Read a prepared artifact. Returns null when the source has not been prepared yet. */
export async function readArtifact(
  source: KnowledgeSource
): Promise<KnowledgeArtifact | null> {
  const file = artifactPath(source);
  if (!existsSync(file)) {
    return null;
  }

  const parsed = JSON.parse(await readFile(file, "utf8")) as KnowledgeArtifact;

  if (parsed.source !== source) {
    throw new Error(
      "Artifact " + file + " declares source " + parsed.source +
        " but was loaded as " + source
    );
  }
  if (!Array.isArray(parsed.chunks)) {
    throw new Error("Artifact " + file + " is malformed: chunks must be an array");
  }

  return parsed;
}

/** Consistent console banner for the prepare scripts. */
export function announce(source: KnowledgeSource): void {
  console.log("Preparing " + source + " chunks...");
}
