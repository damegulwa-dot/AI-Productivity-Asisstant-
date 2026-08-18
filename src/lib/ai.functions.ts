import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().default(""),
  tone: z.enum(["formal", "friendly", "persuasive", "apologetic", "concise"]),
  keyPoints: z.string().default(""),
  length: z.enum(["short", "medium", "detailed"]).default("medium"),
});

const NotesInput = z.object({
  notes: z.string().min(1),
  meetingTitle: z.string().default(""),
});

const PlannerInput = z.object({
  tasks: z.string().min(1),
  horizon: z.enum(["daily", "weekly"]).default("daily"),
  workingHours: z.string().default("09:00 - 17:00"),
  focus: z.string().default(""),
});

const ResearchInput = z.object({
  topic: z.string().min(1),
  audience: z.string().default("business stakeholders"),
  depth: z.enum(["overview", "standard", "deep"]).default("standard"),
});

async function run(system: string, prompt: string) {
  const { streamText } = await import("ai");
  const { getModel } = await import("./ai-gateway.server");
  const result = streamText({ model: getModel(), system, prompt });
  return { text: await result.text };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const system = [
      "You are a senior workplace communication specialist writing on behalf of a professional.",
      "Rules:",
      "- Output ONLY the email: a 'Subject:' line, then the body, then a sign-off placeholder [Your Name].",
      "- Never invent facts, figures, names, dates or commitments that were not supplied. If something is missing, use a clear bracketed placeholder like [date].",
      "- Match the requested tone exactly and keep paragraphs short and scannable.",
      "- Use plain professional English, no emojis unless the tone is friendly and it clearly fits.",
    ].join("\n");
    const prompt = [
      `Tone: ${data.tone}`,
      `Desired length: ${data.length}`,
      `Recipient: ${data.recipient || "unspecified — use a neutral greeting"}`,
      `Purpose of the email: ${data.purpose}`,
      data.keyPoints ? `Key points that MUST appear:\n${data.keyPoints}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    return run(system, prompt);
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const system = [
      "You are a meeting analyst. You convert raw meeting notes or transcripts into an executive-ready brief.",
      "Return markdown with EXACTLY these sections, in this order:",
      "## Summary (3-5 bullets)",
      "## Decisions Made",
      "## Action Items (markdown table: Owner | Action | Deadline)",
      "## Deadlines & Dates",
      "## Risks / Open Questions",
      "Rules: extract only what is present in the notes. Use 'Unassigned' or 'No deadline stated' rather than guessing. Keep every bullet under 25 words.",
    ].join("\n");
    const prompt = [
      data.meetingTitle ? `Meeting: ${data.meetingTitle}` : "",
      "Raw notes:",
      data.notes,
    ]
      .filter(Boolean)
      .join("\n\n");
    return run(system, prompt);
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const system = [
      "You are a productivity coach who builds realistic, time-blocked schedules.",
      "Method: 1) classify every task with the Eisenhower matrix, 2) estimate effort, 3) time-block the highest-leverage work in the first deep-focus slot, 4) batch shallow work, 5) leave buffer time and breaks.",
      "Return markdown with these sections:",
      "## Priority Ranking (table: # | Task | Priority (P1-P4) | Est. effort | Why)",
      "## Time-Blocked Schedule (table: Time | Task | Type (deep/shallow/break))",
      "## Deferred or Delegate",
      "## Coach's Note (max 3 bullets)",
      "Never exceed the stated working hours. Do not invent tasks that were not listed.",
    ].join("\n");
    const prompt = [
      `Planning horizon: ${data.horizon}`,
      `Working hours: ${data.workingHours}`,
      data.focus ? `Primary focus / goal: ${data.focus}` : "",
      `Tasks:\n${data.tasks}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    return run(system, prompt);
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const system = [
      "You are a research analyst producing a briefing note for a workplace audience.",
      "Return markdown with these sections:",
      "## Executive Summary",
      "## Key Concepts",
      "## What the Evidence Suggests",
      "## Opportunities & Risks",
      "## Recommendations (numbered, actionable)",
      "## Verify Before Acting (what the reader should independently confirm)",
      "Rules: you have no live web access, so rely on general knowledge, state uncertainty plainly, never fabricate statistics, studies, citations or URLs. If a claim is contested, say so.",
    ].join("\n");
    const prompt = [
      `Topic or pasted article/notes: ${data.topic}`,
      `Audience: ${data.audience}`,
      `Depth: ${data.depth}`,
    ].join("\n\n");
    return run(system, prompt);
  });
