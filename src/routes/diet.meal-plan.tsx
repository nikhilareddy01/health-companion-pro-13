import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, Salad, UtensilsCrossed } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";

export const Route = createFileRoute("/diet/meal-plan")({ component: Page });

function Page() {
  return (
    <Screen title="Meal Plan" contentClass="px-5 pb-8">
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-xs font-medium text-muted-foreground">DAILY TARGET</p>
        <p className="mt-1 text-2xl font-bold text-foreground">1,800 kcal</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
          <Macro label="Carbs" value="180g" tone="bg-primary-soft text-primary" />
          <Macro label="Protein" value="110g" tone="bg-secondary-soft text-secondary" />
          <Macro label="Fat" value="55g" tone="bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" />
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {[
          { to: "/diet/breakfast", Icon: Coffee, t: "Breakfast", time: "8:00 AM", kcal: 420 },
          { to: "/diet/lunch", Icon: Salad, t: "Lunch", time: "1:00 PM", kcal: 620 },
          { to: "/diet/dinner", Icon: UtensilsCrossed, t: "Dinner", time: "7:30 PM", kcal: 560 },
        ].map((m) => (
          <Link key={m.t} to={m.to} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><m.Icon className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{m.t}</p>
              <p className="text-xs text-muted-foreground">{m.time} · {m.kcal} kcal</p>
            </div>
          </Link>
        ))}
      </div>
    </Screen>
  );
}

function Macro({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className={`rounded-xl ${tone} px-2 py-2`}><p className="font-semibold">{value}</p><p className="text-[10px] opacity-80">{label}</p></div>;
}
