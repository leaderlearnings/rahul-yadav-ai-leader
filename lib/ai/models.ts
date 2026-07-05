export const DEFAULT_CHAT_MODEL = "863320";

export const titleModel = {
  id: "863320",
  name: "Alibaba 863320",
  provider: "alibaba",
  description: "Alibaba Cloud Model 863320 (OpenAI Compatible)",
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
    id: "863320",
    name: "Alibaba 863320",
    provider: "alibaba",
    description: "Alibaba Cloud Model 863320 (OpenAI Compatible)",
    gatewayOrder: [],
  },
];

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export async function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  return Object.fromEntries(
    chatModels.map((m) => [m.id, { tools: true, vision: false, reasoning: false }])
  );
}
