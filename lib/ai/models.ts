export const DEFAULT_CHAT_MODEL = "qwen3.6-flash";

export const titleModel = {
  id: "qwen3.6-flash",
  name: "Alibaba Qwen3.6-flash",
  provider: "alibaba",
  description: "Alibaba Cloud Model Qwen3.6-flash (OpenAI Compatible)",
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
    id: "qwen3.6-flash",
    name: "Alibaba Qwen3.6-flash",
    provider: "alibaba",
    description: "Alibaba Cloud Model Qwen3.6-flash (OpenAI Compatible)",
    gatewayOrder: [],
  },
];

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export async function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  return Object.fromEntries(
    chatModels.map((m) => [m.id, { tools: true, vision: false, reasoning: false }])
  );
}
