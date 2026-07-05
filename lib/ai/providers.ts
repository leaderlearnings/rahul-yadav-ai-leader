import { createOpenAI } from "@ai-sdk/openai";
import { titleModel } from "./models";

const alibaba = createOpenAI({
  apiKey: process.env.ALIBABA_API_KEY,
  baseURL: "https://ws-hf9qipcf8tpnkwez.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
});

/**
 * Language models are configured to use Alibaba Cloud (OpenAI compatible).
 */
export function getLanguageModel(modelId: string) {
  return alibaba(modelId);
}

export function getTitleModel() {
  return titleModel.id;
}
