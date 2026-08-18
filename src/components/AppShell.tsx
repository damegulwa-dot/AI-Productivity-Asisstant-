import { Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  ShieldAlert,
  Sparkles,
  Telescope,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Overview & activity" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Draft in any tone" },
  { to: "/summarizer", label: "Meeting Notes", icon: NotebookPen, blurb: "Summaries & actions" },
  { to: "/planner", label: "Task Planner", icon: CalendarClock, blurb: "Prioritise & block time" },
  { to: "/research", label: "Research Assistant", icon: Telescope, blurb: "Briefs & insights" },
  { to: "/assistant", label: "AI Chatbot", icon: Bot, blurb: "Ask Nova anything" },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground border-primary/60 shadow-[inset_2px_0_0_0_var(--color-primary)]",
          }}
          inactiveProps={{ className: "text-sidebar-foreground/70 border-transparent" }}
          className="flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
        >
          <item.icon className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            {item.label}
            <span className="text-[11px] font-normal text-muted-foreground">{item.blurb}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-1 py-1">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-sm font-bold tracking-tight">Nova Workplace</span>
        <span className="text-[11px] text-muted-foreground">AI Productivity Assistant</span>
      </span>
    </Link>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl border border-border/70 bg-card/60 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-accent">
          <ShieldAlert className="size-3.5" aria-hidden="true" /> Responsible AI
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Outputs are AI-generated and may be inaccurate. Review and edit before sending, and never
          paste confidential or personal data.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Brand />
        </header>

        <main className="flex-1 glow-grid px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-[11px] text-muted-foreground sm:px-6 lg:px-10">
          Nova Workplace — AI-generated content can be wrong. A human stays accountable for every
          message, plan and decision.
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
