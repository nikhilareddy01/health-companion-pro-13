import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Pill, Apple, Moon, Droplet } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { Card } from "@/components/mobile/Card";

export const Route = createFileRoute("/ai-recommendation")({ component: Page });

function Page() {
  return (
    <Screen title="AI Recommendations" contentClass="px-5 pb-8 space-y-4">
      <div className="rounded-3xl p-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-medium opacity-90">Based on your conditions</span>
        </div>
        <p className="text-lg font-semibold leading-snug">Your blood sugar trend is stable — keep a low-glycemic breakfast and a 20-minute walk today.</p>
      </div>

      {[
        { Icon: Apple, title: "Diet today", text: "Oats with berries, grilled chicken salad, lentil soup with brown rice.", to: "/diet/meal-plan" },
        { Icon: Pill, title: "Medication", text: "Metformin 8 AM & 9 PM, Vitamin D3 1 PM.", to: "/medicine-overview" },
        { Icon: Moon, title: "Sleep", text: "Wind down by 10:30 PM. Target 7h 30m.", to: "/progress/sleep" },
        { Icon: Droplet, title: "Hydration", text: "Drink 2.5L of water — set hourly reminders.", to: "/diet/water" },
      ].map((c) => (
        <Link key={c.title} to={c.to} className="block">
          <Card className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <c.Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          </Card>
        </Link>
      ))}
    </Screen>
  );
}
