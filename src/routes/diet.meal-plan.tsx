import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, Salad, UtensilsCrossed, Apple, CheckCircle2, Edit3, Check, X } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getDietData,
  DailyDietData,
  getDefaultMealName,
  getDietTargets,
  saveDietTargets,
  DietTarget,
} from "@/utils/dietStorage";
import { toast } from "sonner";

export const Route = createFileRoute("/diet/meal-plan")({ component: Page });

function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [dietData, setDietData] = useState<DailyDietData>({});
  const [targets, setTargets] = useState<DietTarget>({
    calories: "1,800 kcal",
    carbs: "180g",
    protein: "110g",
    fat: "55g",
  });

  // Edit Targets State
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [editCalories, setEditCalories] = useState("1,800 kcal");
  const [editCarbs, setEditCarbs] = useState("180g");
  const [editProtein, setEditProtein] = useState("110g");
  const [editFat, setEditFat] = useState("55g");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      setDietData(getDietData(uid));

      const loadedTargets = getDietTargets(uid);
      setTargets(loadedTargets);
      setEditCalories(loadedTargets.calories);
      setEditCarbs(loadedTargets.carbs);
      setEditProtein(loadedTargets.protein);
      setEditFat(loadedTargets.fat);
    });
  }, []);

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DietTarget = {
      calories: editCalories.trim().includes("kcal") ? editCalories.trim() : `${editCalories.trim()} kcal`,
      carbs: editCarbs.trim().endsWith("g") ? editCarbs.trim() : `${editCarbs.trim()}g`,
      protein: editProtein.trim().endsWith("g") ? editProtein.trim() : `${editProtein.trim()}g`,
      fat: editFat.trim().endsWith("g") ? editFat.trim() : `${editFat.trim()}g`,
    };

    setTargets(updated);
    saveDietTargets(updated, userId);
    setIsEditingTargets(false);
    toast.success("Daily Target Macros updated successfully!");
  };

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
      {/* Daily Target Card with Edit Option */}
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border/40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">DAILY TARGET</p>
          <button
            onClick={() => setIsEditingTargets(!isEditingTargets)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isEditingTargets ? "Cancel Edit" : "Edit Targets"}
          </button>
        </div>

        {isEditingTargets ? (
          <form onSubmit={handleSaveTargets} className="mt-3 space-y-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Daily Calories (kcal)</label>
              <input
                type="text"
                value={editCalories}
                onChange={(e) => setEditCalories(e.target.value)}
                className="mt-1 w-full rounded-xl bg-muted p-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground">Carbs (g)</label>
                <input
                  type="text"
                  value={editCarbs}
                  onChange={(e) => setEditCarbs(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-muted p-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground">Protein (g)</label>
                <input
                  type="text"
                  value={editProtein}
                  onChange={(e) => setEditProtein(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-muted p-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground">Fat (g)</label>
                <input
                  type="text"
                  value={editFat}
                  onChange={(e) => setEditFat(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-muted p-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm"
            >
              Save Targets
            </button>
          </form>
        ) : (
          <>
            <p className="mt-1 text-2xl font-bold text-foreground">{targets.calories}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <Macro label="Carbs" value={targets.carbs} tone="bg-primary-soft text-primary" />
              <Macro label="Protein" value={targets.protein} tone="bg-secondary-soft text-secondary" />
              <Macro label="Fat" value={targets.fat} tone="bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" />
            </div>
          </>
        )}
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
    <div className={`rounded-xl ${tone} px-2 py-2 font-bold`}>
      <p className="font-bold text-sm">{value}</p>
      <p className="text-[10px] opacity-80 uppercase font-semibold">{label}</p>
    </div>
  );
}
