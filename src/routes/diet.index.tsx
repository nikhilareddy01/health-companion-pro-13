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
} from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getDietData,
  toggleMealEatenStatus,
  DailyDietData,
  getDefaultMealName,
} from "@/utils/dietStorage";
import { toast } from "sonner";

export const Route = createFileRoute("/diet/")({ component: Page });

export function Page() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [dietData, setDietData] = useState<DailyDietData>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      setDietData(getDietData(uid));
    });
  }, []);

  const handleToggleEaten = (
    e: React.MouseEvent,
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    label: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const { data: updated, newStatus } = toggleMealEatenStatus(mealType, userId);
    setDietData(updated);

    if (newStatus) {
      toast.success(`Marked ${label} as Eaten! 🥗`);
    } else {
      toast.info(`Updated ${label} status`);
    }
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
      tone: "success",
      data: dietData.lunch,
    },
    {
      type: "dinner" as const,
      to: "/diet/dinner",
      Icon: UtensilsCrossed,
      title: "Dinner",
      tone: "primary",
      data: dietData.dinner,
    },
    {
      type: "snack" as const,
      to: "/diet/snack",
      Icon: Apple,
      title: "Snack",
      tone: "secondary",
      data: dietData.snack,
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
        <p className="text-lg font-bold">Diabetes-friendly · 1,800 kcal</p>
        <p className="mt-1 text-xs opacity-90">Tailored for your daily conditions</p>
      </Link>

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
                    onClick={(e) => handleToggleEaten(e, m.type, m.title)}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                      isEaten
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-foreground hover:bg-primary-soft hover:text-primary"
                    }`}
                  >
                    {isEaten ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Eaten
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-muted-foreground" /> Eaten?
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
