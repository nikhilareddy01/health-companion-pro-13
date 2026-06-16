import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, AlertCircle, Info } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/medicine/insights")({ component: Page });

function Page() {
  return (
    <Screen title="AI Insights" contentClass="px-5 pb-8 space-y-3">
      <div className="rounded-3xl p-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <Sparkles className="h-6 w-6" />
        <p className="mt-3 text-sm font-semibold">Your adherence improved by 18% this month — keep it up.</p>
      </div>
      {[
        { Icon: AlertCircle, tone: "warning", t: "Possible interaction", s: "Avoid taking Metformin and antacids within 2 hours of each other." },
        { Icon: Info, tone: "primary", t: "Best taken with food", s: "Metformin works best when taken with a meal to reduce GI discomfort." },
        { Icon: Sparkles, tone: "success", t: "Smart suggestion", s: "Pair Vitamin D3 with a fat-containing meal for better absorption." },
      ].map((c, i) => (
        <div key={i} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tone === "warning" ? "bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" : c.tone === "success" ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}`}><c.Icon className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{c.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.s}</p>
            </div>
          </div>
        </div>
      ))}
    </Screen>
  );
}
