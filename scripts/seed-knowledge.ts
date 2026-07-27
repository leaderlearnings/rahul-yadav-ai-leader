/**
 * scripts/seed-knowledge.ts
 *
 * Pushes prepared knowledge artifacts into the vector database.
 *
 * Run with: pnpm knowledge:seed                 (every source)
 *           pnpm knowledge:seed resume linkedin (only the named sources)
 *           pnpm knowledge:seed resume --keep   (append instead of replace)
 *
 * PIPELINE
 * --------
 *   1. pnpm knowledge:prepare          -> writes data/knowledge/<source>.json
 *   2. pnpm knowledge:seed [sources]   -> embeds those chunks and inserts them
 *
 * This script deliberately holds no content of its own. Content lives in the
 * scripts/knowledge/prepare-*.ts scripts, so a single document type can be
 * rebuilt and re-seeded without re-embedding everything else.
 *
 * CRUD OPERATIONS
 * - Add / update: edit the relevant prepare script, re-run it, then seed that source.
 * - Delete:       seeding a source replaces it; pass --keep to append instead.
 * - View:         SELECT * FROM "KnowledgeChunk" ORDER BY "createdAt" DESC;
 */

import "dotenv/config";
import { clearChunksBySource, upsertChunk } from "../lib/db/rag";
import type { KnowledgeSource } from "./knowledge/types";
import { KNOWLEDGE_SOURCES, readArtifact } from "./knowledge/types";

/** Pause between embedding calls so we stay inside free tier rate limits. */
const DELAY_MS = 3000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isKnowledgeSource(value: string): value is KnowledgeSource {
  return (KNOWLEDGE_SOURCES as string[]).includes(value);
}

function parseArgs(argv: string[]): { sources: KnowledgeSource[]; keep: boolean } {
  const keep = argv.includes("--keep");
  const named = argv.filter((arg) => !arg.startsWith("--"));

  if (named.length === 0) {
    return { sources: [...KNOWLEDGE_SOURCES], keep };
  }

  const sources: KnowledgeSource[] = [];
  for (const arg of named) {
    if (!isKnowledgeSource(arg)) {
      throw new Error(
        "Unknown source: " + arg + ". Expected one of " + KNOWLEDGE_SOURCES.join(", ")
      );
    }
    sources.push(arg);
  }

  return { sources, keep };
}

async function seedSource(source: KnowledgeSource, keep: boolean): Promise<number> {
  const artifact = await readArtifact(source);

  if (!artifact) {
    console.warn(
      "Skipping " + source + ": no artifact found. Run the matching prepare script first."
    );
    return 0;
  }

  if (artifact.chunks.length === 0) {
    console.warn("Skipping " + source + ": artifact contains no chunks.");
    return 0;
  }

  if (keep) {
    console.log("Appending to existing " + source + " chunks...");
  } else {
    console.log("Clearing existing " + source + " chunks...");
    await clearChunksBySource(source);
  }

  console.log(
    "Seeding " + artifact.chunks.length + " " + source +
      " chunk(s), prepared at " + artifact.preparedAt
  );

  for (const chunk of artifact.chunks) {
    await upsertChunk({ content: chunk.content, source, title: chunk.title });
    process.stdout.write(".");
    await delay(DELAY_MS);
  }
  process.stdout.write("\n");

  return artifact.chunks.length;
}

async function seed(): Promise<void> {
  const { sources, keep } = parseArgs(process.argv.slice(2));

  console.log("Starting knowledge seeding for: " + sources.join(", "));

  let total = 0;
  for (const source of sources) {
    total += await seedSource(source, keep);
  }

  console.log("Done. Seeded " + total + " chunk(s).");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
