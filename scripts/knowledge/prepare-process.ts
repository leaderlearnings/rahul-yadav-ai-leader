/**
 * scripts/knowledge/prepare-process.ts
 *
 * Prepares the "process" document type: how-to guides, frameworks and the
 * repeatable processes Rahul uses as a leader.
 *
 * Run with: pnpm knowledge:prepare:process
 * Writes:   data/knowledge/process.json
 *
 * Entries whose content is still a bracketed placeholder are skipped by
 * writeArtifact, so a half-written framework can never reach the vector database.
 */

import { pathToFileURL } from "node:url";
import type { PreparedChunk } from "./types";
import { announce, normalizeContent, writeArtifact } from "./types";

const PROCESSES: PreparedChunk[] = [
  {
    title: "How I Build High-Performance Teams",
    content: normalizeContent("[ADD YOUR PROCESS / FRAMEWORK HERE]"),
  },
];

export async function prepareProcess(): Promise<void> {
  announce("process");
  await writeArtifact("process", PROCESSES);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareProcess().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
