import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, MessageSquare, Bug, Sparkles, ChevronRight } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/profile/help")({ component: Page });

const rows = [
  { Icon: HelpCircle, t: "FAQ", s: "Common questions" },
  { Icon: MessageSquare, t: "Contact Support", s: "We're here to help" },
  { Icon: Bug, t: "Report Issue", s: "Tell us what went wrong" },
  { Icon: Sparkles, t: "Chat with AI Health Assistant", s: "Instant answers, 24/7" },
];

function Page() {
  return (
    <Screen title="Help & Support" contentClass="px-5 pb-8">
      <div className="space-y-2">{rows.map((r) => (
        <button key={r.t} className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-soft)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><r.Icon className="h-5 w-5" /></div>
          <div className="flex-1"><p className="text-sm font-semibold text-foreground">{r.t}</p><p className="text-xs text-muted-foreground">{r.s}</p></div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      ))}</div>
    </Screen>
  );
}
