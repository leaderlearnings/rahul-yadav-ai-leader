import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { unansweredQuestion } from "@/lib/db/schema";

// Initialize DB connection (same pattern as queries.ts)
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export const collectQuestion = tool({
  description:
    "Call this tool when the user asks something outside Rahul's provided context. Collect the user's question and email address so Rahul can personally follow up.",
  inputSchema: z.object({
    question: z.string().describe("The user's question that is outside Rahul's context"),
    email: z.string().describe("The user's email address for follow-up. If not provided yet, ask them for it first."),
  }),
  execute: async ({ question, email }) => {
    try {
      await db.insert(unansweredQuestion).values({
        question,
        email,
        createdAt: new Date(),
      });
      return {
        success: true,
        message:
          "Got it! Rahul is still working on filling in more details here. Your question has been saved and the real Rahul will reach out to you at " + email + " soon!",
      };
    } catch (err) {
      return {
        success: false,
        message: "There was an issue saving your question. Please try again shortly.",
      };
    }
  },
});
