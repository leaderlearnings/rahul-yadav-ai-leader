/**
 * scripts/knowledge/prepare-process.ts
 *
 * Prepares the "process" document type: how-to guides, frameworks and the
 * repeatable processes Rahul uses as a leader.
 *
 * Run with: pnpm knowledge:prepare:process
 * Writes:   data/knowledge/process.json
 *
 * Content comes from two places:
 *   1. The PROCESSES array below, for short hand-written frameworks.
 *   2. Any .md / .txt / .pdf file dropped into content/knowledge/process/.
 *      Markdown is split per heading, so a long playbook becomes several
 *      focused chunks rather than one unretrievable blob.
 *
 * Entries whose content is still a bracketed placeholder are skipped by
 * writeArtifact, so a half-written framework can never reach the vector database.
 */

import { pathToFileURL } from "node:url";
import { loadDocumentChunks } from "./documents";
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
  const documents = await loadDocumentChunks("process");
  await writeArtifact("process", [...PROCESSES, ...documents]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareProcess().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
