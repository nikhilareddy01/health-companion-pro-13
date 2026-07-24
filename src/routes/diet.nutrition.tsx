import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getDietData,
  getDietTargets,
  calculateEatenNutrition,
  DailyDietData,
  DietTarget,
} from "@/utils/dietStorage";
import { CheckCircle2, UtensilsCrossed, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/diet/nutrition")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [dietData, setDietData] = useState<DailyDietData>({});
  const [targets, setTargets] = useState<DietTarget>({
    calories: "1,800 kcal",
    carbs: "180g",
    protein: "110g",
    fat: "55g",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      setDietData(getDietData(uid));
      setTargets(getDietTargets(uid));
    });
  }, []);

  const nutrition = calculateEatenNutrition(dietData);

  const targetCalNum = parseInt(targets.calories.replace(/[^0-9]/g, "") || "1800", 10) || 1800;
  const targetCarbsNum = parseInt(targets.carbs.replace(/[^0-9]/g, "") || "180", 10) || 180;
  const targetProteinNum = parseInt(targets.protein.replace(/[^0-9]/g, "") || "110", 10) || 110;
  const targetFatNum = parseInt(targets.fat.replace(/[^0-9]/g, "") || "55", 10) || 55;
  const targetFiberNum = 30;

  const calPercentage = Math.min(100, Math.round((nutrition.consumedCalories / targetCalNum) * 100));
  const carbsPercentage = Math.min(100, Math.round((nutrition.consumedCarbs / targetCarbsNum) * 100));
  const proteinPercentage = Math.min(100, Math.round((nutrition.consumedProtein / targetProteinNum) * 100));
  const fatPercentage = Math.min(100, Math.round((nutrition.consumedFat / targetFatNum) * 100));
  const fiberPercentage = Math.min(100, Math.round((nutrition.consumedFiber / targetFiberNum) * 100));

  const macrosList = [
    {
      l: "Carbohydrates",
      v: `${nutrition.consumedCarbs} / ${targetCarbsNum}g`,
      p: carbsPercentage,
    },
    {
      l: "Protein",
      v: `${nutrition.consumedProtein} / ${targetProteinNum}g`,
      p: proteinPercentage,
    },
    {
      l: "Fat",
      v: `${nutrition.consumedFat} / ${targetFatNum}g`,
      p: fatPercentage,
    },
    {
      l: "Fiber",
      v: `${nutrition.consumedFiber} / ${targetFiberNum}g`,
      p: fiberPercentage,
    },
  ];

  return (
    <Screen title="Nutrition Analysis" contentClass="px-5 pb-8">
      {/* Today's Consumed Calories Progress Card */}
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border/40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">TODAY</p>
          <span className="text-xs font-semibold text-primary">
            {nutrition.eatenMealsCount} of 4 meals eaten
          </span>
        </div>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {nutrition.consumedCalories.toLocaleString()} / {targetCalNum.toLocaleString()} kcal
        </p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${calPercentage}%`,
              background: "var(--gradient-primary)",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {calPercentage}% of daily goal consumed (
          {targetCalNum - nutrition.consumedCalories > 0
            ? `${(targetCalNum - nutrition.consumedCalories).toLocaleString()} kcal remaining`
            : "Target reached!"}
          )
        </p>
      </div>

      {/* Macro Breakdown List */}
      <div className="mt-4 space-y-3">
        {macrosList.map((m) => (
          <div key={m.l} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-foreground">{m.l}</span>
              <span className="text-muted-foreground">{m.v}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${m.p}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Logged/Eaten Meals List Section */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Eaten Food Items Today</h3>
        {nutrition.eatenList.length === 0 ? (
          <div className="rounded-2xl bg-card p-5 text-center shadow-[var(--shadow-soft)] border border-dashed border-border">
            <UtensilsCrossed className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-foreground">No meals marked as eaten yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Go to "Today's diet plan" and tap "Mark as Eaten" on your meals to calculate consumed calories.
            </p>
            <button
              onClick={() => navigate({ to: "/diet" })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
            >
              Go to Diet Plan <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {nutrition.eatenList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-card p-3.5 shadow-[var(--shadow-soft)] border border-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      {item.mealType}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
                  +{item.calories} kcal
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
