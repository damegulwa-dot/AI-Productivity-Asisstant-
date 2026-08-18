import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Timer, Zap } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { NAV_ITEMS } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova Workplace — AI Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "One AI workspace for professionals: generate emails, summarise meetings, plan and prioritise tasks, research topics and chat with an AI assistant.",
      },
      { property: "og:title", content: "Nova Workplace — AI Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Five AI-powered workplace tools in one dashboard: email drafting, meeting summaries, task planning, research briefs and a chat assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "AI tools in this workspace", value: "5", icon: Zap },
  { label: "Avg. minutes saved per email", value: "8", icon: Timer },
  { label: "Meeting write-up time", value: "-70%", icon: Clock },
  { label: "Human review required", value: "Always", icon: ShieldCheck },
];

const PRINCIPLES = [
  {
    title: "Human in the loop",
    body: "Every output lands in an editable panel. Nothing is sent, saved or actioned automatically.",
  },
  {
    title: "No invented facts",
    body: "Prompts instruct the model to use [placeholders] instead of guessing names, numbers or dates.",
  },
  {
    title: "Data minimisation",
    body: "Nothing is stored. Only the text you paste is sent to the model for that single request.",
  },
  {
    title: "Clear limitations",
    body: "Nova has no live web access and states uncertainty rather than sounding confident.",
  },
];

function Dashboard() {
  const tools = NAV_ITEMS.filter((item) => item.to !== "/");

  return (
    <AppShell>
      <section className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur sm:p-9">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" /> AI-Powered Workplace Productivity Assistant
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Five AI workplace tools.{" "}
          <span className="text-primary">One integrated workspace.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Nova takes the repetitive writing, summarising and planning work off your plate — drafting
          emails, turning messy meeting notes into action items, time-blocking your day, briefing you
          on new topics, and answering workplace questions on demand.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50"
          >
            Chat with Nova
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card/60 p-4">
            <stat.icon className="size-4 text-accent" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Your AI toolkit</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/60"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <tool.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{tool.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{tool.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Open tool
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-accent/30 bg-accent/5 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="size-5 text-accent" aria-hidden="true" /> Responsible AI in Nova
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Nova assists — it does not decide. AI output can be inaccurate, biased or outdated, so
          every feature is built around human review.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-background/40 p-4">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
