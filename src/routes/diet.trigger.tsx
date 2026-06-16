import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/diet/trigger")({ component: Page });

function Page() {
  return (
    <Screen title="Trigger Food Alert" contentClass="px-5 pb-8">
      <div className="rounded-3xl bg-[oklch(0.96_0.05_75)] p-5 text-[oklch(0.4_0.1_75)]">
        <AlertTriangle className="h-7 w-7" />
        <p className="mt-3 text-base font-bold">3 trigger foods detected this week</p>
        <p className="mt-1 text-sm">Tracking foods that worsened your symptoms.</p>
      </div>
      <div className="mt-5 space-y-3">
        {[{ n: "Aged cheese", s: "Migraine trigger · 2 episodes" }, { n: "Red wine", s: "Migraine + sleep impact" }, { n: "Spicy food", s: "GERD flare-up" }].map((i) => (
          <div key={i.n} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-foreground">{i.n}</p>
            <p className="text-xs text-muted-foreground">{i.s}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}
