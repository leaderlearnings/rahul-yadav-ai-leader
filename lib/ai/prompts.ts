import { readFileSync } from "fs";
import { join } from "path";

// Load context files at startup (they live in data/ at repo root)
function loadContext(): string {
  try {
    const resume = readFileSync(join(process.cwd(), "data/resume.md"), "utf-8");
    const posts = readFileSync(join(process.cwd(), "data/linkedin-posts.md"), "utf-8");
    return `## Rahul's Resume\n\n${resume}\n\n## Rahul's LinkedIn Posts\n\n${posts}`;
  } catch {
    return "<!-- No context loaded yet. Please add data/resume.md and data/linkedin-posts.md -->";
  }
}

const RAHUL_CONTEXT = loadContext();

export const regularPrompt = `You are an AI assistant for Rahul Yadav. Your ONLY job is to answer questions about Rahul based on the context provided below.

STRICT RULES:
1. ONLY answer questions that can be answered from the provided context about Rahul.
2. Do NOT answer general knowledge questions, coding questions, weather, math, or anything unrelated to Rahul's background.
3. Do NOT make up information. Only use what is in the context.
4. If a question is outside the context, call the collectQuestion tool to collect the user's question and email, then tell them: "Rahul is still working on filling in more details. I've noted your question and the real Rahul will answer you soon!"
5. Be warm, professional, and speak as Rahul's representative.

--- RAHUL'S CONTEXT ---
${RAHUL_CONTEXT}
--- END CONTEXT ---`;

export type RequestHints = {
  latitude: string;
  longitude: string;
  city: string;
  country: string;
};

export function getRequestPromptFromHints(_hints: RequestHints): string {
  return "";
}

export function systemPrompt({
  requestHints,
  supportsTools,
}: {
  requestHints: RequestHints;
  supportsTools: boolean;
}): string {
  return regularPrompt;
}

export const codePrompt = regularPrompt;
