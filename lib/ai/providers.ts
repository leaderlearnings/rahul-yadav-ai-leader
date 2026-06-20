import { createOpenAI } from "@ai-sdk/openai";
import { isTestEnvironment } from "../constants";
import { titleModel } from "./models";

// Venice.ai is OpenAI-compatible
const venice = createOpenAI({
  baseURL: "https://api.venice.ai/api/v1",
  apiKey: process.env.VENICE_API_KEY ?? "",
});

// Map "venice/<model>" ids to the actual Venice model name
function resolveVeniceModel(modelId: string) {
  const name = modelId.startsWith("venice/") ? modelId.slice(7) : modelId;
  return venice(name);
}

export function getLanguageModel(modelId: string) {
  return resolveVeniceModel(modelId);
}

export function getTitleModel() {
  return resolveVeniceModel(titleModel.id);
}
