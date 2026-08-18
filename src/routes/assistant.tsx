import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2, SendHorizonal, ShieldAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Nova AI Chatbot Assistant | Nova Workplace" },
      {
        name: "description",
        content:
          "Chat with Nova, an AI workplace assistant that helps with emails, meetings, prioritisation and workplace communication.",
      },
      { property: "og:title", content: "Nova AI Chatbot Assistant | Nova Workplace" },
      {
        property: "og:description",
        content: "An interactive AI workplace assistant for everyday professional tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I decline a meeting invite politely?",
  "Help me structure a 5-minute project update for exec leadership.",
  "Rewrite this to sound less defensive: 'That wasn't my responsibility.'",
  "What should be on a handover checklist before I go on leave?",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok || !response.body) {
        throw new Error((await response.text()) || "The assistant is unavailable right now.");
      }

      setMessages([...history, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: assistantText }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Feature 05"
        title="Nova AI Chatbot"
        description="An interactive workplace assistant. Ask about wording, meetings, prioritisation or process — Nova keeps the full conversation in context."
      />

      <div className="flex h-[calc(100vh-16rem)] min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-xl py-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Bot className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Hi, I'm Nova.</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Try one of these to get started:
              </p>
              <div className="mt-4 grid gap-2 text-left sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" ? (
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Bot className="size-4" />
                  </span>
                ) : null}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background/60"
                  }`}
                >
                  {message.role === "assistant" ? (
                    message.content ? (
                      <div className="ai-prose">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    )
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === "user" ? (
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))
          )}

          {error ? (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
              {error}
            </p>
          ) : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 sm:p-4"
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask Nova about an email, a meeting, a deadline…"
              className="max-h-40 min-h-11 resize-none bg-background/60"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldAlert className="size-3" /> Nova can be wrong and has no live web access. Don't
            share confidential or personal data.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
