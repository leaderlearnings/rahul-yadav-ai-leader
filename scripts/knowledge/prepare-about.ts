/**
 * scripts/knowledge/prepare-about.ts
 *
 * Prepares the "about" document type: elevator pitch, professional summary and
 * core competencies.
 *
 * Run with: pnpm knowledge:prepare:about
 * Writes:   data/knowledge/about.json
 *
 * This script only shapes content into chunks - it never touches the database,
 * so it is cheap and safe to re-run as often as you like.
 */

import { pathToFileURL } from "node:url";
import type { PreparedChunk } from "./types";
import { announce, normalizeContent, writeArtifact } from "./types";

const ABOUT: PreparedChunk[] = [
  {
    title: "Professional Summary",
    content: normalizeContent([
      "Rahul Yadav is a Strategic Engineering Leader focused on Data Platforms and AI Transformation.",
      "He is an innovative and empathetic leader with 14+ years of experience driving enterprise transformation through AI-powered platforms, scalable architecture, and cross-functional collaboration.",
      "He has a proven track record of aligning stakeholders, building business cases, and delivering measurable impact across customer experience, data strategy, and cloud optimization.",
      "He is passionate about connecting people, platforms, and purpose to shape the future of context engineering and AI adoption.",
      "Contact: ryconnect@gmail.com, +1-215-821-6269, linkedin.com/in/ryaddress",
    ]),
  },
  {
    title: "Core Competencies",
    content: normalizeContent([
      "Rahul's core competencies include:",
      "Operational AI and Agentic Systems;",
      "Business Case Development and KPI Alignment;",
      "Cross-Functional Leadership;",
      "Cloud, FinOps and Cost Optimization;",
      "Agile, SAFe, and Product Lifecycle Management;",
      "Data Governance, Analytics, and Visualization;",
      "Executive Communication and Strategic Planning;",
      "Enterprise Eventing and Data Architecture.",
    ]),
  },
];

export async function prepareAbout(): Promise<void> {
  announce("about");
  await writeArtifact("about", ABOUT);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareAbout().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
