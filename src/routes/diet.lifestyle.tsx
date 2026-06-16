import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/diet/lifestyle")({ component: Page });

const tips = [
  "Walk 20 minutes after each main meal to flatten glucose spikes.",
  "Eat fiber and protein before carbs for better blood sugar response.",
  "Aim for 7–9h of sleep — poor sleep raises insulin resistance.",
  "Limit screen time 60 minutes before bed for migraine prevention.",
  "Practice 5 minutes of breathwork to lower stress hormones.",
];

function Page() {
  return (
    <Screen title="Lifestyle Tips" contentClass="px-5 pb-8">
      <div className="space-y-3">{tips.map((t, i) => (
        <div key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Sparkles className="h-4 w-4" /></div>
          <p className="text-sm leading-relaxed text-foreground">{t}</p>
        </div>
      ))}</div>
    </Screen>
  );
}
