import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { Salad } from "lucide-react";

export const Route = createFileRoute("/diet/lunch")({ component: Page });

const items = [
  { t: "Grilled chicken bowl", k: "520 kcal", g: "Lean protein · Veggies" },
  { t: "Quinoa salad", k: "460 kcal", g: "Plant protein" },
  { t: "Lentil & spinach curry", k: "480 kcal", g: "High fiber" },
];

function Page() {
  return (
    <Screen title="Lunch" contentClass="px-5 pb-8">
      <div className="flex h-32 items-center justify-center rounded-3xl bg-success/15"><Salad className="h-14 w-14 text-success" /></div>
      <p className="mt-4 text-xs font-semibold text-muted-foreground">SUGGESTIONS</p>
      <div className="mt-3 space-y-3">{items.map((i) => (
        <div key={i.t} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold text-foreground">{i.t}</p>
          <p className="text-xs text-muted-foreground">{i.k} · {i.g}</p>
        </div>
      ))}</div>
    </Screen>
  );
}
