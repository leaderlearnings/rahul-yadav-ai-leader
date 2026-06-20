export const DEFAULT_CHAT_MODEL = "venice/llama-3.1-8b";

export const titleModel = {
  id: "venice/llama-3.1-8b",
  name: "Llama 3.1 8B",
  provider: "venice",
  description: "Meta Llama 3.1 8B via Venice.ai",
  gatewayOrder: [],
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  gatewayOrder?: string[];
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

export const chatModels: ChatModel[] = [
  {
    id: "venice/llama-3.1-8b",
    name: "Llama 3.1 8B",
    provider: "venice",
    description: "Meta Llama 3.1 8B via Venice.ai",
    gatewayOrder: [],
  },
];

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export async function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  return Object.fromEntries(
    chatModels.map((m) => [m.id, { tools: true, vision: false, reasoning: false }])
  );
}
