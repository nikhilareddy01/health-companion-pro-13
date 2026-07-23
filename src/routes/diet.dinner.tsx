import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Screen } from "@/components/mobile/Screen";
import { UtensilsCrossed, CheckCircle2, Circle, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDietData, setMealSelection, DailyDietData } from "@/utils/dietStorage";
import { toast } from "sonner";

export const Route = createFileRoute("/diet/dinner")({ component: Page });

const suggestions = [
  { t: "Lentil & veggie soup", k: "380 kcal", g: "Light & warm" },
  { t: "Grilled salmon + greens", k: "520 kcal", g: "Omega-3 rich" },
  { t: "Tofu stir-fry brown rice", k: "490 kcal", g: "Plant-based" },
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

  const currentDinner = dietData.dinner;
  const selectedItemTitle = currentDinner?.selectedItem || "";
  const isEaten = currentDinner?.isEaten || false;

  const handleSelectMeal = (item: { t: string; k: string; g: string }, markEaten?: boolean) => {
    const updated = setMealSelection(
      "dinner",
      { title: item.t, calories: item.k, tags: item.g },
      markEaten !== undefined ? markEaten : isEaten,
      userId
    );
    setDietData(updated);

    if (markEaten) {
      toast.success(`Selected "${item.t}" & marked as Eaten! 🥗`);
    } else {
      toast.success(`Selected "${item.t}" for Dinner!`);
    }
  };

  const toggleEaten = () => {
    if (!selectedItemTitle) {
      handleSelectMeal(suggestions[0], true);
      return;
    }
    const targetItem = suggestions.find((s) => s.t === selectedItemTitle) || {
      t: selectedItemTitle,
      k: currentDinner?.calories || "380 kcal",
      g: currentDinner?.tags || "Light & warm",
    };
    handleSelectMeal(targetItem, !isEaten);
  };

  return (
    <Screen title="Dinner" contentClass="px-5 pb-8">
      {/* Icon Header */}
      <div className="flex h-32 items-center justify-center rounded-3xl bg-primary-soft shadow-[var(--shadow-soft)]">
        <UtensilsCrossed className="h-14 w-14 text-primary" />
      </div>

      {/* Active Selection Banner */}
      <div className="mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-primary/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Your Dinner Choice</p>
            <p className="text-base font-bold text-foreground mt-1">
              {selectedItemTitle || "No meal selected yet"}
            </p>
            {currentDinner?.calories && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentDinner.calories} · {currentDinner.tags}
              </p>
            )}
          </div>
          <button
            onClick={toggleEaten}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
              isEaten
                ? "bg-emerald-500 text-white"
                : "bg-muted text-foreground hover:bg-primary-soft hover:text-primary"
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
                  ? "bg-primary-soft/40 border-2 border-primary"
                  : "bg-card hover:border hover:border-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.t}</p>
                    {isSelected && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
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
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
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
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 active:scale-98 transition-all"
      >
        <Utensils className="h-4 w-4" /> Save & Back to Meals Today
      </button>
    </Screen>
  );
}
