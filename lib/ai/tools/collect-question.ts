import { tool } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { unansweredQuestion } from "@/lib/db/schema";

export const collectQuestion = tool({
  description:
    "Call this tool when the user asks something outside Rahul's context. It collects the user's question and email address so Rahul can personally follow up.",
  parameters: z.object({
    question: z.string().describe("The user's question that is outside Rahul's context"),
    email: z.string().email().describe("The user's email address for follow-up"),
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
          "Thank you! Rahul is still working on filling in more details. Your question has been noted and the real Rahul will reach out to you soon!",
      };
    } catch (err) {
      return {
        success: false,
        message: "There was an issue saving your question. Please try again.",
      };
    }
  },
});
