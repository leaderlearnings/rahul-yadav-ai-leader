/**
 * scripts/knowledge/prepare-all.ts
 *
 * Convenience runner: prepares every document type in one go.
 *
 * Run with: pnpm knowledge:prepare
 *
 * Each source is prepared independently so that one bad source does not
 * silently skip the rest. Failures are collected and reported at the end.
 */

import { prepareAbout } from "./prepare-about";
import { prepareLinkedin } from "./prepare-linkedin";
import { prepareProcess } from "./prepare-process";
import { prepareResume } from "./prepare-resume";
import type { KnowledgeSource } from "./types";

const TASKS: Array<{ source: KnowledgeSource; run: () => Promise<void> }> = [
  { source: "about", run: prepareAbout },
  { source: "resume", run: prepareResume },
  { source: "linkedin", run: prepareLinkedin },
  { source: "process", run: prepareProcess },
];

async function prepareAll(): Promise<void> {
  const failures: string[] = [];

  for (const task of TASKS) {
    try {
      await task.run();
    } catch (error) {
      failures.push(task.source);
      console.error("  x failed to prepare " + task.source);
      console.error(error);
    }
  }

  if (failures.length > 0) {
    console.error("Preparation failed for: " + failures.join(", "));
    process.exit(1);
  }

  console.log("All knowledge artifacts prepared. Next run: pnpm knowledge:seed");
}

prepareAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
