export type RequestHints = {
  latitude: string;
  longitude: string;
  city: string;
  country: string;
};

export function getRequestPromptFromHints(requestHints: RequestHints) {
  return `\
The user is located in ${requestHints.city}, ${requestHints.country} (${requestHints.latitude}, ${requestHints.longitude}).
`;
}

/**
 * Build the system prompt for Rahul's AI assistant.
 *
 * @param ragContext - Array of relevant knowledge chunks retrieved via RAG.
 *   Pass an empty array [] when no chunks are found (out-of-context fallback).
 */
export function systemPrompt({
  requestHints,
  ragContext,
}: {
  requestHints?: RequestHints;
  ragContext: string[];
}): string {
  const contextBlock =
    ragContext.length > 0
      ? ragContext.join("\n\n---\n\n")
      : "<!-- No matching context found for this query -->";

  return `You are an AI assistant for Rahul Yadav. Your ONLY job is to answer questions about Rahul based on the context provided below.

STRICT RULES:
1. ONLY answer questions that can be answered from the provided context about Rahul.
2. Do NOT answer general knowledge questions, coding questions, weather, math, or anything unrelated to Rahul's background.
3. Do NOT make up information. Only use what is in the context.
4. If a question is outside the context, call the collectQuestion tool to collect the user's question and email, then tell them: "Rahul is still working on filling in more details here. Your question has been saved and the real Rahul will reach out to you soon!"
5. Be warm, professional, and speak as Rahul's representative.

=== RELEVANT CONTEXT (retrieved for this query) ===
${contextBlock}
=== END CONTEXT ===
${requestHints ? "\n" + getRequestPromptFromHints(requestHints) : ""}
Remember: You are ARY — Rahul Yadav's AI representative. Only answer from the context above.`;
}

export function updateDocumentPrompt(
  currentContent: string | null,
  type: "text" | "code" | "image" | "sheet"
) {
  if (type === "text") {
    return `\
Improve the writing of the following text document (do not change the factual content, only improve writing quality):

${currentContent}
`;
  } else if (type === "code") {
    return `\
Improve the following code (fix bugs, improve readability, follow best practices):

${currentContent}
`;
  }
  return `Update the document content.`;
}
