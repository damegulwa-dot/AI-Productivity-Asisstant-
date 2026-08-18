import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";

import { getModel } from "@/lib/ai-gateway.server";

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

const SYSTEM_PROMPT = [
  "You are Nova, an AI workplace productivity assistant inside a company dashboard.",
  "You help with emails, meetings, planning, prioritisation, research framing, and workplace communication.",
  "Style: concise, practical, markdown-formatted, with bullets or short numbered steps. Ask one clarifying question when the request is ambiguous.",
  "Responsible AI: never fabricate facts, statistics, citations, policies or people. Say clearly when you are unsure or when a human should verify. Do not give legal, medical, or HR-disciplinary rulings — recommend the relevant professional instead. Never request or repeat sensitive personal data.",
].join("\n");

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = Body.parse(await request.json());
          const result = streamText({
            model: getModel(),
            system: SYSTEM_PROMPT,
            messages,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unexpected error";
          return new Response(message, { status: 400 });
        }
      },
    },
  },
});
