/**
 * scripts/knowledge/prepare-linkedin.ts
 *
 * Prepares the "linkedin" document type: posts and thought-leadership content.
 *
 * Run with: pnpm knowledge:prepare:linkedin
 * Writes:   data/knowledge/linkedin.json
 *
 * HOW TO ADD A POST
 * -----------------
 * Append one entry per post to the POSTS array below. Use the topic (and
 * optionally the date) as the title so retrieved context is easy to attribute.
 *
 * Entries whose content is still a bracketed placeholder are skipped by
 * writeArtifact, so an unfinished post can never reach the vector database.
 */

import { pathToFileURL } from "node:url";
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
  await writeArtifact("linkedin", POSTS);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareLinkedin().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
