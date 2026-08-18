import { Check, Copy, Download, Loader2, Pencil, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AiOutput({
  value,
  onChange,
  isLoading,
  error,
  emptyHint,
  filename,
}: {
  value: string;
  onChange: (next: string) => void;
  isLoading: boolean;
  error?: string | null;
  emptyHint: string;
  filename: string;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  }

  function download() {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="flex min-h-[26rem] flex-col rounded-2xl border border-border bg-card/70 backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" aria-hidden="true" /> AI output
        </h2>
        {value && !isLoading ? (
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
              <Pencil className="mr-1.5 size-3.5" /> {editing ? "Preview" : "Edit"}
            </Button>
            <Button size="sm" variant="ghost" onClick={copy}>
              {copied ? (
                <Check className="mr-1.5 size-3.5 text-primary" />
              ) : (
                <Copy className="mr-1.5 size-3.5" />
              )}
              Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={download}>
              <Download className="mr-1.5 size-3.5" /> Save
            </Button>
          </div>
        ) : null}
      </header>

      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            Nova is drafting your output…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            <p className="font-semibold">The AI request failed</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
          </div>
        ) : value ? (
          editing ? (
            <Textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-[22rem] resize-y bg-background/60 font-mono text-xs"
            />
          ) : (
            <div className="ai-prose text-sm text-card-foreground">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          )
        ) : (
          <div className="flex h-full min-h-[18rem] items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {emptyHint}
          </div>
        )}
      </div>

      <p className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        AI-generated — verify facts, names and dates, and edit before you send or share.
      </p>
    </section>
  );
}
