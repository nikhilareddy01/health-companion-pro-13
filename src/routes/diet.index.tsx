import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Apple,
  Coffee,
  Salad,
  UtensilsCrossed,
  Ban,
  AlertTriangle,
  Droplet,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Circle,
  Edit3,
} from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getDietData,
  setMealSelection,
  DailyDietData,
  getDefaultMealName,
  getDefaultMealCalories,
  getDietTargets,
  saveDietTargets,
  DietTarget,
} from "@/utils/dietStorage";
import { toast } from "sonner";

export const Route = createFileRoute("/diet/")({ component: Page });

export function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [dietData, setDietData] = useState<DailyDietData>({});
  const [targets, setTargets] = useState<DietTarget>({
    calories: "1,800 kcal",
    carbs: "180g",
    protein: "110g",
    fat: "55g",
  });

  // Target Editing State
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
    toast.success("Daily target macros updated successfully!");
  };

  const handleMarkEaten = (
    e: React.MouseEvent,
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    label: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (dietData[mealType]?.isEaten) return; // Permanent! Once eaten, no undo!

    const updated = setMealSelection(
      mealType,
      {
        title: dietData[mealType]?.selectedItem || getDefaultMealName(mealType),
        calories: dietData[mealType]?.calories || getDefaultMealCalories(mealType),
        tags: "Recommended",
      },
      true,
      userId
    );

    setDietData(updated);
    toast.success(`Marked ${label} as Eaten! 🥗`);
  };

  const mealsList = [
    {
      type: "breakfast" as const,
      to: "/diet/breakfast",
      Icon: Coffee,
      title: "Breakfast",
      tone: "warning",
      data: dietData.breakfast,
    },
    {
      type: "lunch" as const,
      to: "/diet/lunch",
      Icon: Salad,
      title: "Lunch",
      tone: "primary",
      data: dietData.lunch,
    },
    {
      type: "snack" as const,
      to: "/diet/snack",
      Icon: Apple,
      title: "Snack",
      tone: "success",
      data: dietData.snack,
    },
    {
      type: "dinner" as const,
      to: "/diet/dinner",
      Icon: UtensilsCrossed,
      title: "Dinner",
      tone: "secondary",
      data: dietData.dinner,
    },
  ];

  return (
    <Screen noHeader bottomNav contentClass="px-5 pb-6">
      <div className="pt-4">
        <p className="text-xs text-muted-foreground">Diet & nutrition</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Today's diet plan</h1>
      </div>

      {/* AI Meal Plan Banner */}
      <Link
        to="/diet/meal-plan"
        className="mt-5 block rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-float)] transition-all hover:opacity-95"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center justify-between">
          <Sparkles className="h-6 w-6" />
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur">
            Personalized
          </span>
        </div>
        <p className="mt-3 text-xs opacity-90">AI MEAL PLAN</p>
        <p className="text-lg font-bold">Diabetes-friendly · {targets.calories}</p>
        <p className="mt-1 text-xs opacity-90">Tailored for your daily conditions</p>
      </Link>

      {/* Daily Target Card with Edit Button */}
      <div className="mt-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border/40">
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
                className="mt-1 w-full rounded-xl bg-muted p-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
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
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-bold">
              <Macro label="Carbs" value={targets.carbs} tone="bg-primary-soft text-primary" />
              <Macro label="Protein" value={targets.protein} tone="bg-secondary-soft text-secondary" />
              <Macro label="Fat" value={targets.fat} tone="bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]" />
            </div>
          </>
        )}
      </div>

      {/* Meals Today Section */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Meals today</h2>
        <span className="text-xs text-muted-foreground">Tap a meal to select choice</span>
      </div>

      <div className="mt-3 space-y-3">
        {mealsList.map((m) => {
          const selectedName = m.data?.selectedItem || getDefaultMealName(m.type);
          const isEaten = m.data?.isEaten || false;

          return (
            <div
              key={m.type}
              onClick={() => navigate({ to: m.to })}
              className={`cursor-pointer rounded-2xl p-4 transition-all shadow-[var(--shadow-soft)] ${
                isEaten
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-card hover:border hover:border-primary/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      m.tone === "primary"
                        ? "bg-primary-soft text-primary"
                        : m.tone === "secondary"
                        ? "bg-secondary-soft text-secondary"
                        : m.tone === "success"
                        ? "bg-success/15 text-success"
                        : "bg-[oklch(0.96_0.05_75)] text-[oklch(0.55_0.12_75)]"
                    }`}
                  >
                    <m.Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{m.title}</p>
                      {isEaten && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          <CheckCircle2 className="h-3 w-3" /> Eaten
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={isEaten}
                    onClick={(e) => handleMarkEaten(e, m.type, m.title)}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                      isEaten
                        ? "bg-emerald-500 text-white cursor-default opacity-95"
                        : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary"
                    }`}
                  >
                    {isEaten ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Eaten ✓
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-muted-foreground" /> Mark as Eaten
                      </>
                    )}
                  </button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Hydration Card */}
        <Link
          to="/diet/water"
          className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Hydration</p>
              <p className="text-xs text-muted-foreground">Track daily water goal</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Smart Guidance Section */}
      <h2 className="mt-6 text-sm font-semibold text-foreground">Smart guidance</h2>
      <div className="mt-3 space-y-2">
        <Row Icon={Ban} to="/diet/avoid" t="Foods to avoid" s="Based on your conditions" />
        <Row
          Icon={AlertTriangle}
          to="/diet/trigger"
          t="Trigger food alerts"
          s="3 items flagged this week"
        />
        <Row
          Icon={Apple}
          to="/diet/nutrition"
          t="Nutrition analysis"
          s="Macros & micros breakdown"
        />
        <Row
          Icon={Sparkles}
          to="/diet/lifestyle"
          t="Lifestyle tips"
          s="Habits for better outcomes"
        />
      </div>
    </Screen>
  );
}

function Macro({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-xl ${tone} px-2 py-2`}>
      <p className="font-bold text-sm">{value}</p>
      <p className="text-[10px] opacity-80 uppercase font-semibold">{label}</p>
    </div>
  );
}

function Row({ Icon, to, t, s }: { Icon: any; to: string; t: string; s: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{t}</p>
        <p className="text-xs text-muted-foreground">{s}</p>
      </div>
    </Link>
  );
}
