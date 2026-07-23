import { createFileRoute } from "@tanstack/react-router";
import {
  Pill,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Plus,
  Utensils,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/calendar")({ component: Page });

interface DayPlan {
  isCheatDay?: boolean;
  cheatDayMeal?: string;
  workoutPlan?: string;
  notes?: string;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  // Dynamic Current Date State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // User Calendar Plans State
  const [plans, setPlans] = useState<Record<string, DayPlan>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [isCheatDay, setIsCheatDay] = useState(false);
  const [cheatDayMeal, setCheatDayMeal] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [notes, setNotes] = useState("");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
    selectedDay
  ).padStart(2, "0")}`;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";

      // Load Saved Plans for User
      const savedPlans = localStorage.getItem(`calendar_plans_${userKey}`);
      if (savedPlans) {
        try {
          setPlans(JSON.parse(savedPlans));
        } catch {
          setPlans({});
        }
      } else {
        setPlans({});
      }
    });
  }, []);

  // Update edit form when selected day or month changes
  useEffect(() => {
    const currentPlan = plans[selectedDateStr] || {};
    setIsCheatDay(currentPlan.isCheatDay || false);
    setCheatDayMeal(currentPlan.cheatDayMeal || "");
    setWorkoutPlan(currentPlan.workoutPlan || "");
    setNotes(currentPlan.notes || "");
  }, [selectedDateStr, plans]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(1);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPlan: DayPlan = {
      isCheatDay,
      cheatDayMeal: isCheatDay ? cheatDayMeal.trim() || "Cheat Day Meal" : "",
      workoutPlan: workoutPlan.trim(),
      notes: notes.trim(),
    };

    const nextPlans = { ...plans, [selectedDateStr]: updatedPlan };
    setPlans(nextPlans);
    setIsEditing(false);

    const userKey = userId || "guest";
    localStorage.setItem(`calendar_plans_${userKey}`, JSON.stringify(nextPlans));
    toast.success(`Plan updated for ${selectedDateStr}!`);
  };

  const activePlan = plans[selectedDateStr];

  return (
    <Screen title="Health & Meal Calendar" contentClass="px-5 pb-8">
      {/* Calendar Card Header */}
      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              {monthNames[currentMonth]} {currentYear}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-foreground hover:bg-primary-soft"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleToday}
              className="rounded-xl bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary hover:opacity-90"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-foreground hover:bg-primary-soft"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted-foreground">
          {dayNames.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="mt-1 grid grid-cols-7 gap-1.5">
          {/* Empty padding days for month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const isSelected = d === selectedDay;
            const isToday =
              d === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear();

            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
              d
            ).padStart(2, "0")}`;
            const dayPlan = plans[dateKey];
            const hasCheatDay = dayPlan?.isCheatDay;
            const hasWorkout = !!dayPlan?.workoutPlan;

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : isToday
                    ? "bg-primary-soft text-primary border-2 border-primary"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                <span>{d}</span>
                <div className="mt-0.5 flex gap-0.5">
                  {hasCheatDay && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Cheat Day" />
                  )}
                  {hasWorkout && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Workout" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details & Plan Section */}
      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          Plan for {monthNames[currentMonth]} {selectedDay}, {currentYear}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          {isEditing ? "Close Edit" : "Add / Edit Plan"}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSavePlan} className="mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] space-y-4">
          {/* Cheat Day Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-amber-500/10 p-3">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-foreground">Cheat Day Meal Plan</p>
                <p className="text-[11px] text-muted-foreground">Mark today as a planned cheat day</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCheatDay(!isCheatDay)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isCheatDay ? "bg-amber-500 text-white shadow-sm" : "bg-card text-foreground"
              }`}
            >
              {isCheatDay ? "🍕 Cheat Day Active" : "Set Cheat Day"}
            </button>
          </div>

          {isCheatDay && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Cheat Day Meal Description</label>
              <input
                type="text"
                placeholder="e.g. Pizza & Ice Cream dinner"
                value={cheatDayMeal}
                onChange={(e) => setCheatDayMeal(e.target.value)}
                className="mt-1 w-full rounded-xl bg-muted p-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Workout Plan Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Workout & Fitness Plan</label>
            <input
              type="text"
              placeholder="e.g. 30 min Running or Leg Workout"
              value={workoutPlan}
              onChange={(e) => setWorkoutPlan(e.target.value)}
              className="mt-1 w-full rounded-xl bg-muted p-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notes Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Additional Notes</label>
            <input
              type="text"
              placeholder="e.g. Drink 3L water today"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl bg-muted p-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm"
          >
            Save Day Plan
          </button>
        </form>
      ) : (
        /* Display Selected Day Plan */
        <div className="mt-3 space-y-3">
          {activePlan?.isCheatDay && (
            <div className="flex items-center gap-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 shadow-[var(--shadow-soft)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Utensils className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">Cheat Day Planned</p>
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    🍕 Cheat Day
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activePlan.cheatDayMeal || "Planned cheat day meal"}
                </p>
              </div>
            </div>
          )}

          {activePlan?.workoutPlan && (
            <div className="flex items-center gap-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 shadow-[var(--shadow-soft)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Workout Plan</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activePlan.workoutPlan}</p>
              </div>
            </div>
          )}

          {activePlan?.notes && (
            <div className="flex items-center gap-3.5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Notes</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activePlan.notes}</p>
              </div>
            </div>
          )}

          {!activePlan?.isCheatDay && !activePlan?.workoutPlan && !activePlan?.notes && (
            <div className="rounded-2xl border border-dashed border-muted bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold text-foreground">No plans scheduled for this day</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Tap "Add / Edit Plan" above to schedule a workout or cheat day meal!
              </p>
            </div>
          )}
        </div>
      )}
    </Screen>
  );
}
