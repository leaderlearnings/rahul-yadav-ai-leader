import { titleModel } from "./models";

/**
 * Language models are routed through the Vercel AI Gateway.
 *
 * On Vercel deployments, authentication is handled automatically via OIDC
 * tokens, so no API key is required. For local / non-Vercel runs, set the
 * AI_GATEWAY_API_KEY environment variable.
 *
 * The AI SDK accepts a plain model id string (e.g. "meta/llama-3.1-8b") as a
 * LanguageModel and resolves it through the gateway provider, so we simply
 * return the requested model id.
 */
export function getLanguageModel(modelId: string) {
  return modelId;
}

export function getTitleModel() {
  return titleModel.id;
}
