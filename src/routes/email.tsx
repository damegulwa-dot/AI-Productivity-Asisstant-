import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Wand2 } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Nova Workplace" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in formal, friendly, persuasive, apologetic or concise tones, then edit before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | Nova Workplace" },
      {
        property: "og:description",
        content: "AI drafts professional emails in the tone you choose — review, edit, send.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["formal", "friendly", "persuasive", "apologetic", "concise"] as const;
const LENGTHS = ["short", "medium", "detailed"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("formal");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!purpose.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { purpose, recipient, keyPoints, tone, length } });
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
        eyebrow="Feature 01"
        title="Smart Email Generator"
        description="Describe the situation and Nova writes a send-ready email. Pick a tone, add the facts that must appear, and edit the draft before it leaves your outbox."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur"
        >
          <div className="grid gap-2">
            <Label htmlFor="purpose">What is the email about?</Label>
            <Textarea
              id="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ask the client for a two-week extension on the reporting deliverable and propose a new date."
              className="min-h-24 bg-background/60"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Thandi Mokoena, Project Sponsor"
              className="bg-background/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger className="bg-background/60 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={(v) => setLength(v as typeof length)}>
                <SelectTrigger className="bg-background/60 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l} className="capitalize">
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="points">Key points to include (one per line)</Label>
            <Textarea
              id="points"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"Data feed arrived 9 days late\nNew delivery date: 12 September\nNo change to project budget"}
              className="min-h-24 bg-background/60"
            />
          </div>

          <Button type="submit" disabled={loading || !purpose.trim()} className="mt-1">
            <Wand2 className="mr-2 size-4" /> {loading ? "Drafting…" : "Generate email"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Nova never invents facts — anything missing comes back as a [placeholder] for you to
            fill in.
          </p>
        </form>

        <AiOutput
          value={output}
          onChange={setOutput}
          isLoading={loading}
          error={error}
          filename="nova-email"
          emptyHint="Your generated email appears here. You can switch to edit mode, tweak the wording, then copy it straight into your mail client."
        />
      </div>
    </AppShell>
  );
}
