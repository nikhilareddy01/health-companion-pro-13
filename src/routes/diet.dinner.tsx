import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/diet/dinner")({ component: Page });

const items = [
  { t: "Lentil & veggie soup", k: "380 kcal", g: "Light & warm" },
  { t: "Grilled salmon + greens", k: "520 kcal", g: "Omega-3 rich" },
  { t: "Tofu stir-fry brown rice", k: "490 kcal", g: "Plant-based" },
];

function Page() {
  return (
    <Screen title="Dinner" contentClass="px-5 pb-8">
      <div className="flex h-32 items-center justify-center rounded-3xl bg-primary-soft"><UtensilsCrossed className="h-14 w-14 text-primary" /></div>
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
