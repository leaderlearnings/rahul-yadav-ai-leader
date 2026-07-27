/**
 * scripts/knowledge/prepare-linkedin.ts
 *
 * Prepares the "linkedin" document type: posts and thought-leadership content.
 *
 * Run with: pnpm knowledge:prepare:linkedin
 * Writes:   data/knowledge/linkedin.json
 *
 * Content comes from two places:
 *   1. The POSTS array below, for pasting one post at a time.
 *   2. Any .md / .txt / .pdf file dropped into content/knowledge/linkedin/.
 *      A single markdown file with one heading per post works well - each
 *      heading becomes its own chunk automatically.
 *
 * Entries whose content is still a bracketed placeholder are skipped by
 * writeArtifact, so an unfinished post can never reach the vector database.
 */

import { pathToFileURL } from "node:url";
import { loadDocumentChunks } from "./documents";
import type { PreparedChunk } from "./types";
import { announce, normalizeContent, writeArtifact } from "./types";

const POSTS: PreparedChunk[] = [
  {
    title: "LinkedIn Post: [Topic]",
    content: normalizeContent("[PASTE POST CONTENT HERE]"),
  },
];

export async function prepareLinkedin(): Promise<void> {
  announce("linkedin");
  const documents = await loadDocumentChunks("linkedin");
  await writeArtifact("linkedin", [...POSTS, ...documents]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareLinkedin().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
