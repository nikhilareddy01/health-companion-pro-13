import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { Coffee } from "lucide-react";

export const Route = createFileRoute("/diet/breakfast")({ component: Page });

const items = [
  { t: "Oats with berries & nuts", k: "320 kcal", g: "Low GI · High fiber" },
  { t: "Veggie omelette", k: "280 kcal", g: "High protein" },
  { t: "Greek yogurt + chia", k: "240 kcal", g: "Probiotic boost" },
];

function Page() {
  return (
    <Screen title="Breakfast" contentClass="px-5 pb-8">
      <div className="flex h-32 items-center justify-center rounded-3xl bg-[oklch(0.96_0.05_75)]"><Coffee className="h-14 w-14 text-[oklch(0.55_0.12_75)]" /></div>
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
