import { createFileRoute } from "@tanstack/react-router";
import { Pill, Heart, Bell, AlertTriangle } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/notifications")({ component: Page });

const groups = [
  {
    label: "Today",
    items: [
      { Icon: Pill, tone: "primary", title: "Time to take Metformin", sub: "8:00 AM · 1 tablet after meal" },
      { Icon: Heart, tone: "success", title: "Heart rate is back to normal", sub: "10 min ago" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { Icon: AlertTriangle, tone: "warning", title: "Missed Vitamin D3 dose", sub: "Re-scheduled to today 1 PM" },
      { Icon: Bell, tone: "secondary", title: "Weekly health report ready", sub: "Tap to view summary" },
    ],
  },
];

function Page() {
  return (
    <Screen title="Notifications" contentClass="px-5 pb-8">
      {groups.map((g) => (
        <div key={g.label} className="mt-2 mb-5">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{g.label}</p>
          <div className="space-y-2.5">
            {g.items.map((n, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${n.tone === "primary" ? "bg-primary-soft text-primary" : n.tone === "success" ? "bg-success/15 text-success" : n.tone === "warning" ? "bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" : "bg-secondary-soft text-secondary"}`}>
                  <n.Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Screen>
  );
}
