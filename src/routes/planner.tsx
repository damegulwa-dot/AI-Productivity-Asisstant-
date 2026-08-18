import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock } from "lucide-react";
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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler | Nova Workplace" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritised, time-blocked daily or weekly schedule using the Eisenhower matrix.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler | Nova Workplace" },
      {
        property: "og:description",
        content: "Prioritise your tasks and get a realistic time-blocked schedule in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [focus, setFocus] = useState("");
  const [workingHours, setWorkingHours] = useState("09:00 - 17:00");
  const [horizon, setHorizon] = useState<"daily" | "weekly">("daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!tasks.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { tasks, focus, workingHours, horizon } });
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
        eyebrow="Feature 03"
        title="AI Task Planner & Scheduler"
        description="Dump every task in your head. Nova ranks them with the Eisenhower matrix, protects your deep-work window and returns a realistic time-blocked plan."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur"
        >
          <div className="grid gap-2">
            <Label htmlFor="tasks">Your tasks (one per line, add deadlines if you have them)</Label>
            <Textarea
              id="tasks"
              required
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Finish sprint report — due today 16:00\nInterview two candidates\nReply to vendor contract email\nPrep Monday exec deck"}
              className="min-h-[15rem] bg-background/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Horizon</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as typeof horizon)}>
                <SelectTrigger className="bg-background/60 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily plan</SelectItem>
                  <SelectItem value="weekly">Weekly plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hours">Working hours</Label>
              <Input
                id="hours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="bg-background/60"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="focus">Main goal for this period (optional)</Label>
            <Input
              id="focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="Ship the client reporting dashboard"
              className="bg-background/60"
            />
          </div>

          <Button type="submit" disabled={loading || !tasks.trim()}>
            <CalendarClock className="mr-2 size-4" /> {loading ? "Planning…" : "Build my schedule"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            You know your context best — treat the plan as a suggestion and adjust it.
          </p>
        </form>

        <AiOutput
          value={output}
          onChange={setOutput}
          isLoading={loading}
          error={error}
          filename="nova-schedule"
          emptyHint="Your priority ranking and time-blocked schedule appear here, with anything worth deferring or delegating called out."
        />
      </div>
    </AppShell>
  );
}
