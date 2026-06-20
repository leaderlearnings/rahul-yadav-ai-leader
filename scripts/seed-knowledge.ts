/**
 * scripts/seed-knowledge.ts
 *
 * CLI script to seed Rahul's knowledge into the vector database.
 * Run with: npx tsx scripts/seed-knowledge.ts
 *
 * HOW TO ADD CONTENT:
 * 1. Add your content to the DATA array below (or load from files)
 * 2. Run this script locally: npx tsx scripts/seed-knowledge.ts
 * 3. The script will generate embeddings and insert into the KnowledgeChunk table
 *
 * CRUD OPERATIONS:
 * - Add:    Run this script with new entries in the DATA array
 * - Update: Change the content and re-run (old entry stays, new one added - then delete old by id)
 * - Delete: Use clearChunksBySource() to wipe a whole category, or delete by id via SQL
 * - View:   SELECT * FROM "KnowledgeChunk" ORDER BY "createdAt" DESC; in Neon Console
 *
 * SOURCES:
 * - 'resume'   : Work history, education, skills, achievements
 * - 'linkedin' : LinkedIn posts / thought leadership content
 * - 'about'    : Elevator pitch, summary, personal philosophy
 * - 'process'  : How-to guides, frameworks, processes Rahul uses
 */

import "dotenv/config";
import { clearChunksBySource, upsertChunk } from "../lib/db/rag";

// ============================================================
// STEP 1: Edit the DATA arrays below with Rahul's content
// Each entry becomes one searchable chunk in the vector DB
// Keep each chunk focused on ONE topic (150-400 words ideal)
// ============================================================

const ABOUT: Array<{ title: string; content: string }> = [
  {
    title: "Elevator Pitch",
    content: `
    [ADD YOUR ELEVATOR PITCH HERE]
    Example: "I'm Rahul Yadav, a technology leader with 15+ years..."
    `.trim(),
  },
  {
    title: "Professional Summary",
    content: `
    [ADD YOUR PROFESSIONAL SUMMARY HERE]
    `.trim(),
  },
];

const RESUME: Array<{ title: string; content: string }> = [
  {
    title: "Current Role",
    content: `
    [ADD YOUR CURRENT ROLE AND RESPONSIBILITIES HERE]
    `.trim(),
  },
  {
    title: "Previous Experience",
    content: `
    [ADD PREVIOUS ROLES AND ACHIEVEMENTS HERE]
    `.trim(),
  },
  {
    title: "Skills",
    content: `
    [ADD YOUR KEY SKILLS HERE]
    `.trim(),
  },
];

const LINKEDIN: Array<{ title: string; content: string }> = [
  // Paste each LinkedIn post as a separate entry
  // Title: topic or date of post
  {
    title: "LinkedIn Post: [Topic]",
    content: `
    [PASTE POST CONTENT HERE]
    `.trim(),
  },
];

const PROCESS: Array<{ title: string; content: string }> = [
  {
    title: "How I Build High-Performance Teams",
    content: `
    [ADD YOUR PROCESS / FRAMEWORK HERE]
    `.trim(),
  },
];

// ============================================================
// STEP 2: Run the seeding (no edits needed below this line)
// ============================================================

async function seed() {
  console.log("Starting knowledge seeding...");

  // Clear existing chunks for each source before re-seeding
  // Comment out if you want to ADD (not replace) content
  console.log("Clearing existing chunks...");
  await clearChunksBySource("about");
  await clearChunksBySource("resume");
  await clearChunksBySource("linkedin");
  await clearChunksBySource("process");

  // Seed ABOUT
  console.log(`Seeding ${ABOUT.length} about chunks...`);
  for (const item of ABOUT) {
    await upsertChunk({ content: item.content, source: "about", title: item.title });
    process.stdout.write(".");
  }

  // Seed RESUME
  console.log(`\nSeeding ${RESUME.length} resume chunks...`);
  for (const item of RESUME) {
    await upsertChunk({ content: item.content, source: "resume", title: item.title });
    process.stdout.write(".");
  }

  // Seed LINKEDIN
  console.log(`\nSeeding ${LINKEDIN.length} LinkedIn post chunks...`);
  for (const item of LINKEDIN) {
    await upsertChunk({ content: item.content, source: "linkedin", title: item.title });
    process.stdout.write(".");
  }

  // Seed PROCESS
  console.log(`\nSeeding ${PROCESS.length} process chunks...`);
  for (const item of PROCESS) {
    await upsertChunk({ content: item.content, source: "process", title: item.title });
    process.stdout.write(".");
  }

  console.log("\n\nSeeding complete!");
  console.log(`Total chunks: ${ABOUT.length + RESUME.length + LINKEDIN.length + PROCESS.length}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
