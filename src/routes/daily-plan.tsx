import { createFileRoute, Link } from "@tanstack/react-router";
import { Sun, Coffee, Salad, UtensilsCrossed, Moon, CheckCircle2, Circle } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/daily-plan")({ component: Page });

const tasks = [
  { Icon: Sun, time: "7:00 AM", title: "Morning walk", sub: "20 minutes brisk pace", done: true },
  { Icon: Coffee, time: "8:00 AM", title: "Take Metformin", sub: "After breakfast", done: true, to: "/medicine/morning" },
  { Icon: Salad, time: "1:00 PM", title: "Lunch — Grilled chicken bowl", sub: "View recipe", done: false, to: "/diet/lunch" },
  { Icon: UtensilsCrossed, time: "7:30 PM", title: "Dinner — Lentil & veggie soup", sub: "Low GI option", done: false, to: "/diet/dinner" },
  { Icon: Moon, time: "10:30 PM", title: "Wind-down routine", sub: "Tea, no screens", done: false },
];

function Page() {
  return (
    <Screen title="Daily Health Plan" contentClass="px-5 pb-8">
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-xs font-medium text-muted-foreground">TODAY</p>
        <p className="mt-1 text-lg font-bold text-foreground">2 of 5 tasks done</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/5 rounded-full" style={{ background: "var(--gradient-primary)" }} />
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {tasks.map((t, i) => {
          const inner = (
            <div className="flex items-start gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.done ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}`}>
                <t.Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-muted-foreground">{t.time}</p>
                <p className={`text-sm font-semibold ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
              </div>
              {t.done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-border" />}
            </div>
          );
          return t.to ? <Link key={i} to={t.to}>{inner}</Link> : <div key={i}>{inner}</div>;
        })}
      </div>
    </Screen>
  );
}
