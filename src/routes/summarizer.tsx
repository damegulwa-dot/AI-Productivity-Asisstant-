import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks } from "lucide-react";
import { useState } from "react";

import { AiOutput } from "@/components/AiOutput";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Nova Workplace" },
      {
        name: "description",
        content:
          "Turn long meeting notes or transcripts into an executive summary with decisions, owners, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Nova Workplace" },
      {
        property: "og:description",
        content: "Summarise meetings and extract decisions, action items and deadlines instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!notes.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { notes, meetingTitle } });
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
        eyebrow="Feature 02"
        title="Meeting Notes Summarizer"
        description="Paste raw notes, minutes or a transcript. Nova returns a short summary plus the decisions, owners, action items and deadlines hidden inside it."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur"
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Meeting title (optional)</Label>
            <Input
              id="title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Q3 Delivery Review — 18 August"
              className="bg-background/60"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Raw notes or transcript</Label>
            <Textarea
              id="notes"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste everything — bullet fragments, typos and cross-talk are fine."
              className="min-h-[20rem] bg-background/60"
            />
          </div>
          <Button type="submit" disabled={loading || !notes.trim()}>
            <ListChecks className="mr-2 size-4" /> {loading ? "Summarising…" : "Summarise notes"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Remove names or confidential details you don't want processed before pasting.
          </p>
        </form>

        <AiOutput
          value={output}
          onChange={setOutput}
          isLoading={loading}
          error={error}
          filename="nova-meeting-summary"
          emptyHint="Your summary, decisions and action-item table appear here — ready to paste into your minutes or task tracker."
        />
      </div>
    </AppShell>
  );
}
