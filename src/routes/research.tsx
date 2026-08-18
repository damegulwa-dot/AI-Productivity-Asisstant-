import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Telescope } from "lucide-react";
import { useState } from "react";

import { AiOutput } from "@/components/AiOutput";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Nova Workplace" },
      {
        name: "description",
        content:
          "Summarise topics or pasted articles into a briefing note with key concepts, opportunities, risks and actionable recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant | Nova Workplace" },
      {
        property: "og:description",
        content: "Get a structured briefing note with insights and recommendations you can act on.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("business stakeholders");
  const [depth, setDepth] = useState<"overview" | "standard" | "deep">("standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { topic, audience, depth } });
      setOutput(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Feature 04"
        title="AI Research Assistant"
        description="Give Nova a topic or paste an article. You get a briefing note: executive summary, key concepts, opportunities, risks, recommendations — plus what you should verify yourself."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur"
        >
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic, question, or pasted article</Label>
            <Textarea
              id="topic"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="How are mid-sized South African firms using AI to reduce customer support backlogs?"
              className="min-h-[15rem] bg-background/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="audience">Audience</Label>
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-background/60"
              />
            </div>
            <div className="grid gap-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
                <SelectTrigger className="bg-background/60 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Quick overview</SelectItem>
                  <SelectItem value="standard">Standard brief</SelectItem>
                  <SelectItem value="deep">Deep dive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading || !topic.trim()}>
            <Telescope className="mr-2 size-4" /> {loading ? "Researching…" : "Build briefing note"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Nova has no live web access and won't invent statistics or citations — confirm figures
            against a primary source.
          </p>
        </form>

        <AiOutput
          value={output}
          onChange={setOutput}
          isLoading={loading}
          error={error}
          filename="nova-research-brief"
          emptyHint="Your briefing note appears here, ending with a checklist of claims to verify before you present them."
        />
      </div>
    </AppShell>
  );
}
