import { auth } from "@/app/(auth)/auth";
import { chatModels } from "@/lib/ai/models";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }
  return Response.json(chatModels);
}
