import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const AI_MODEL = "google/gemini-3.6-flash";

export function getLovableApiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function getModel() {
  return createLovableAiGatewayProvider(getLovableApiKey())(AI_MODEL);
}
