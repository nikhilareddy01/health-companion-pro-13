import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { Salad, CheckCircle2, Circle, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDietData, setMealSelection, DailyDietData } from "@/utils/dietStorage";
import { toast } from "sonner";

export const Route = createFileRoute("/diet/lunch")({ component: Page });

const suggestions = [
  { t: "Grilled chicken bowl", k: "520 kcal", g: "Lean protein · Veggies" },
  { t: "Quinoa salad", k: "460 kcal", g: "Plant protein" },
  { t: "Lentil & spinach curry", k: "480 kcal", g: "High fiber" },
];

function Page() {
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

  const currentLunch = dietData.lunch;
  const selectedItemTitle = currentLunch?.selectedItem || "";
  const isEaten = currentLunch?.isEaten || false;

  const handleSelectMeal = (item: { t: string; k: string; g: string }, markEaten?: boolean) => {
    const updated = setMealSelection(
      "lunch",
      { title: item.t, calories: item.k, tags: item.g },
      markEaten !== undefined ? markEaten : isEaten,
      userId
    );
    setDietData(updated);

    if (markEaten) {
      toast.success(`Selected "${item.t}" & marked as Eaten! 🥗`);
    } else {
      toast.success(`Selected "${item.t}" for Lunch!`);
    }
  };

  const toggleEaten = () => {
    if (!selectedItemTitle) {
      handleSelectMeal(suggestions[0], true);
      return;
    }
    const targetItem = suggestions.find((s) => s.t === selectedItemTitle) || {
      t: selectedItemTitle,
      k: currentLunch?.calories || "520 kcal",
      g: currentLunch?.tags || "Lean protein",
    };
    handleSelectMeal(targetItem, !isEaten);
  };

  return (
    <Screen title="Lunch" contentClass="px-5 pb-8">
      {/* Icon Header */}
      <div className="flex h-32 items-center justify-center rounded-3xl bg-success/15 shadow-[var(--shadow-soft)]">
        <Salad className="h-14 w-14 text-success" />
      </div>

      {/* Active Selection Banner */}
      <div className="mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-success/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-success">Your Lunch Choice</p>
            <p className="text-base font-bold text-foreground mt-1">
              {selectedItemTitle || "No meal selected yet"}
            </p>
            {currentLunch?.calories && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentLunch.calories} · {currentLunch.tags}
              </p>
            )}
          </div>
          <button
            onClick={toggleEaten}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
              isEaten
                ? "bg-emerald-500 text-white"
                : "bg-muted text-foreground hover:bg-success/15 hover:text-success"
            }`}
          >
            {isEaten ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Eaten
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" /> Mark as Eaten
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Suggestions (Tap to Select)
      </p>
      <div className="mt-3 space-y-3">
        {suggestions.map((item) => {
          const isSelected = selectedItemTitle === item.t;
          return (
            <div
              key={item.t}
              onClick={() => handleSelectMeal(item)}
              className={`group cursor-pointer rounded-2xl p-4 transition-all shadow-[var(--shadow-soft)] ${
                isSelected
                  ? "bg-success/15 border-2 border-success"
                  : "bg-card hover:border hover:border-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.t}</p>
                    {isSelected && (
                      <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.k} · {item.g}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMeal(item, !isSelected || !isEaten);
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected && isEaten
                        ? "bg-emerald-500 text-white"
                        : isSelected
                        ? "bg-success text-white"
                        : "bg-muted text-foreground hover:bg-success hover:text-white"
                    }`}
                  >
                    {isSelected && isEaten ? "Eaten ✓" : isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Done Button */}
      <button
        onClick={() => navigate({ to: "/diet" })}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-success py-3.5 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-98 transition-all"
      >
        <Utensils className="h-4 w-4" /> Save & Back to Meals Today
      </button>
    </Screen>
  );
}
