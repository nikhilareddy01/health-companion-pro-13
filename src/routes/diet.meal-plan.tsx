import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, Salad, UtensilsCrossed, Apple, CheckCircle2 } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDietData, DailyDietData, getDefaultMealName } from "@/utils/dietStorage";

export const Route = createFileRoute("/diet/meal-plan")({ component: Page });

function Page() {
  const [dietData, setDietData] = useState<DailyDietData>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setDietData(getDietData(uid));
    });
  }, []);

  const meals = [
    {
      to: "/diet/breakfast",
      Icon: Coffee,
      t: "Breakfast",
      time: "8:00 AM",
      data: dietData.breakfast,
      type: "breakfast" as const,
    },
    {
      to: "/diet/lunch",
      Icon: Salad,
      t: "Lunch",
      time: "1:00 PM",
      data: dietData.lunch,
      type: "lunch" as const,
    },
    {
      to: "/diet/snack",
      Icon: Apple,
      t: "Snack",
      time: "4:30 PM",
      data: dietData.snack,
      type: "snack" as const,
    },
    {
      to: "/diet/dinner",
      Icon: UtensilsCrossed,
      t: "Dinner",
      time: "7:30 PM",
      data: dietData.dinner,
      type: "dinner" as const,
    },
  ];

  return (
    <Screen title="Meal Plan" contentClass="px-5 pb-8">
      {/* Daily Target */}
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="text-xs font-medium text-muted-foreground">DAILY TARGET</p>
        <p className="mt-1 text-2xl font-bold text-foreground">1,800 kcal</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
          <Macro label="Carbs" value="180g" tone="bg-primary-soft text-primary" />
          <Macro label="Protein" value="110g" tone="bg-secondary-soft text-secondary" />
          <Macro label="Fat" value="55g" tone="bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" />
        </div>
      </div>

      {/* Meals List */}
      <div className="mt-5 space-y-3">
        {meals.map((m) => {
          const selectedName = m.data?.selectedItem || getDefaultMealName(m.type);
          const isEaten = m.data?.isEaten || false;
          const calories = m.data?.calories || "300 kcal";

          return (
            <Link
              key={m.t}
              to={m.to}
              className={`flex items-center gap-4 rounded-2xl p-4 shadow-[var(--shadow-soft)] transition-all ${
                isEaten ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-card"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <m.Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{m.t}</p>
                  {isEaten && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" /> Eaten
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedName} · {calories}
                </p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{m.time}</span>
            </Link>
          );
        })}
      </div>
    </Screen>
  );
}

function Macro({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-xl ${tone} px-2 py-2`}>
      <p className="font-semibold">{value}</p>
      <p className="text-[10px] opacity-80">{label}</p>
    </div>
  );
}
