# Nova Workplace — AI-Powered Workplace Productivity Assistant

One integrated web platform that automates everyday workplace tasks with AI. Built for the ASA 14 (CPT Week 14) AI Project.

## Project Overview

Nova Workplace is a single responsive dashboard containing five AI-powered productivity tools. Professionals paste their raw input, Nova returns structured, editable output that a human reviews before using it.

## Features

1. **Smart Email Generator** — professional emails in formal, friendly, persuasive, apologetic or concise tones, with length control and required key points.
2. **Meeting Notes Summarizer** — turns long notes/transcripts into a summary plus decisions, an Owner/Action/Deadline table, dates and open risks.
3. **AI Task Planner / Scheduler** — Eisenhower-matrix prioritisation and a realistic time-blocked daily or weekly schedule inside your working hours.
4. **AI Research Assistant** — briefing notes with executive summary, key concepts, opportunities, risks, recommendations and a "verify before acting" checklist.
5. **AI Chatbot (Nova)** — streaming interactive assistant that keeps full conversation context.

Every output panel supports **preview / edit / copy / download (.md)**.

## Prompt Engineering Approach

Each feature uses a dedicated system prompt that defines a role, a fixed output structure, and explicit anti-hallucination rules (use `[placeholders]` instead of guessing names, numbers or dates; state uncertainty; never fabricate statistics or citations). User inputs are composed into a labelled, structured prompt rather than a free-form sentence.

## Responsible AI

- Human in the loop: nothing is sent or actioned automatically; all output is editable.
- No invented facts — missing details surface as bracketed placeholders.
- Data minimisation: nothing is persisted; only the submitted text is sent per request.
- Clear limitations disclosed in-app (no live web access, output may be inaccurate or biased).
- Disclaimers appear in the sidebar, under every output panel, in the chat composer and in the footer.

## Tools Used

- Lovable AI (AI Gateway) + Vercel AI SDK — model calls
- TanStack Start (React 19) + TanStack Router — full-stack framework, server functions & API routes
- Tailwind CSS v4 + shadcn/ui + lucide-react — UI
- Zod — input validation
- react-markdown — rendering AI output

## Project Structure

```
src/
  components/AppShell.tsx     sidebar navigation + responsive layout + AI disclaimers
  components/AiOutput.tsx     editable AI output panel (preview/edit/copy/download)
  lib/ai-gateway.server.ts    Lovable AI Gateway provider (server only)
  lib/ai.functions.ts         server functions: email, summarizer, planner, research
  routes/index.tsx            dashboard
  routes/email|summarizer|planner|research|assistant.tsx
  routes/api/chat.ts          streaming chatbot endpoint
```

## Setup Instructions

```bash
bun install     # or npm install
bun run dev     # http://localhost:8080
```

`LOVABLE_API_KEY` is provided automatically by Lovable and is only read server-side. Never expose it to the browser.

## Team Members

- Simamkele Mbili
