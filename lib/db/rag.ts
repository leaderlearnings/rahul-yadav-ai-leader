import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { knowledgeChunk } from "./schema";

const EMBEDDING_MODEL = "text-embedding-3-small";
const TOP_K = 8; // number of chunks to retrieve

/**
 * Generate an embedding vector for a given text string.
 * Uses OpenAI text-embedding-3-small (1536 dimensions) via Vercel AI Gateway.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: text,
  });
  return embedding;
}

/**
 * Retrieve the top-K most semantically relevant knowledge chunks for a query.
 * Uses cosine similarity computed in-app (no pgvector extension required).
 * This works on Neon free tier without needing the pgvector extension.
 */
export async function retrieveRelevantChunks(query: string): Promise<string[]> {
  // Generate embedding for the user query
  const queryEmbedding = await generateEmbedding(query);

  // Fetch all chunks from DB (for < 5000 chunks this is fast enough)
  // For larger datasets, switch to pgvector cosine similarity operator
  const chunks = await db
    .select({
      content: knowledgeChunk.content,
      embedding: knowledgeChunk.embedding,
      source: knowledgeChunk.source,
      title: knowledgeChunk.title,
    })
    .from(knowledgeChunk);

  if (chunks.length === 0) return [];

  // Compute cosine similarity between query and each chunk
  const scored = chunks.map((chunk) => {
    const chunkEmbedding: number[] = JSON.parse(chunk.embedding);
    const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
    return { content: chunk.content, source: chunk.source, title: chunk.title, similarity };
  });

  // Sort descending by similarity, take top K
  scored.sort((a, b) => b.similarity - a.similarity);
  const top = scored.slice(0, TOP_K);

  // Return formatted context strings
  return top.map((c) => {
    const label = c.title ? `[${c.source.toUpperCase()}: ${c.title}]` : `[${c.source.toUpperCase()}]`;
    return `${label}\n${c.content}`;
  });
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Insert or update a knowledge chunk.
 * Call this from the seed script to add/replace content.
 */
export async function upsertChunk(params: {
  content: string;
  source: "resume" | "linkedin" | "about" | "process";
  title?: string;
}): Promise<void> {
  const embedding = await generateEmbedding(params.content);
  const embeddingJson = JSON.stringify(embedding);

  await db.insert(knowledgeChunk).values({
    content: params.content,
    embedding: embeddingJson,
    source: params.source,
    title: params.title ?? null,
  });
}

/**
 * Delete all chunks for a given source (e.g. clear 'linkedin' to re-seed posts).
 */
export async function clearChunksBySource(
  source: "resume" | "linkedin" | "about" | "process"
): Promise<void> {
  await db.delete(knowledgeChunk).where(sql`source = ${source}`);
}
