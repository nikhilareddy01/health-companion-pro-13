import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";

export const Route = createFileRoute("/profile/goals")({ component: Page });

const goals = [
  { k: "Weight Management", v: "Reach 65 kg" },
  { k: "Daily Health", v: "8,000 steps · 30 min activity" },
  { k: "Medicine Adherence", v: "100% on-time doses" },
  { k: "Diet", v: "1,800 kcal · low GI meals" },
];

function Page() {
  const [saved, setSaved] = useState(false);
  return (
    <Screen title="Goals" contentClass="px-5 pb-8">
      <div className="space-y-3">{goals.map((g) => (
        <div key={g.k} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-medium text-muted-foreground">{g.k.toUpperCase()}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{g.v}</p>
        </div>
      ))}</div>
      <div className="mt-8"><PrimaryButton onClick={() => setSaved(true)}>Save Goals</PrimaryButton></div>
      {saved && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-6 sm:items-center" onClick={() => setSaved(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-background p-7 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <p className="mt-3 text-lg font-bold text-foreground">Goals saved</p>
            <p className="mt-1 text-sm text-muted-foreground">We'll keep you on track.</p>
            <PrimaryButton className="mt-5" onClick={() => setSaved(false)}>Done</PrimaryButton>
          </div>
        </div>
      )}
    </Screen>
  );
}
