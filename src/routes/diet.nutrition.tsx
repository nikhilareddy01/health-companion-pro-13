import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/diet/nutrition")({ component: Page });

function Page() {
  return (
    <Screen title="Nutrition Analysis" contentClass="px-5 pb-8">
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-xs font-medium text-muted-foreground">TODAY</p>
        <p className="mt-1 text-2xl font-bold text-foreground">1,420 / 1,800 kcal</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[78%] rounded-full" style={{ background: "var(--gradient-primary)" }} />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {[{ l: "Carbohydrates", v: "150 / 180g", p: 83 }, { l: "Protein", v: "85 / 110g", p: 77 }, { l: "Fat", v: "42 / 55g", p: 76 }, { l: "Fiber", v: "22 / 30g", p: 73 }].map((m) => (
          <div key={m.l} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex justify-between text-sm font-medium"><span className="text-foreground">{m.l}</span><span className="text-muted-foreground">{m.v}</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${m.p}%` }} /></div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
