import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Heart,
  Droplet,
  Activity,
  Footprints,
  Search,
  Calendar,
  Pill,
  Stethoscope,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle2,
  Utensils,
  Edit2,
  RotateCcw,
} from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getApiUrl } from "@/utils/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MediCare AI" }] }),
  component: Page,
});

interface HealthMetrics {
  heartRate: string;
  bloodSugar: string;
  bloodPressure: string;
  steps: string;
}

interface RecommendedMeal {
  id: string;
  type: "Breakfast" | "Lunch" | "Dinner";
  name: string;
  calories: string;
}

const DEFAULT_RECOMMENDED_MEALS: RecommendedMeal[] = [
  { id: "meal-1", type: "Breakfast", name: "Oatmeal with fresh berries & chia seeds", calories: "320 kcal" },
  { id: "meal-2", type: "Lunch", name: "Grilled chicken breast with quinoa & veggies", calories: "480 kcal" },
  { id: "meal-3", type: "Dinner", name: "Steamed salmon with broccoli & sweet potato", calories: "420 kcal" },
];

export function Page() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<any[]>([]);

  // Dynamic Health Metrics State
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heartRate: "--",
    bloodSugar: "--",
    bloodPressure: "--/--",
    steps: "--",
  });
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [editMetrics, setEditMetrics] = useState<HealthMetrics>({ ...metrics });

  // Water Intake State
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(0);

  // Recommended Meals State
  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);

      if (data?.user) {
        if (data.user.user_metadata?.name) {
          setUserName(data.user.user_metadata.name);
        } else if (data.user.email) {
          const emailName = data.user.email.split("@")[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      } else {
        const demoName = localStorage.getItem("demo_name");
        const demoEmail = localStorage.getItem("demo_email");
        if (demoName) setUserName(demoName);
        else if (demoEmail) {
          const emailName = demoEmail.split("@")[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }

      const userKey = uid || "guest";

      // 1. Load User Medicines
      const storageKey = uid ? `medicines_${uid}` : "medicines";
      if (uid) {
        fetch(getApiUrl(`/api/medicines?user_id=${uid}`))
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && Array.isArray(data)) {
              setMedicines(data);
              localStorage.setItem(storageKey, JSON.stringify(data));
            } else {
              loadLocalMeds(storageKey);
            }
          })
          .catch(() => loadLocalMeds(storageKey));
      } else {
        loadLocalMeds(storageKey);
      }

      // 2. Load User Health Metrics
      const savedMetrics = localStorage.getItem(`profile_health_${userKey}`);
      if (savedMetrics) {
        try {
          const parsed = JSON.parse(savedMetrics);
          setMetrics({
            heartRate: parsed.heartRate || parsed.heart_rate || "--",
            bloodSugar: parsed.bloodSugar || parsed.blood_sugar || "--",
            bloodPressure: parsed.bloodPressure || parsed.blood_pressure || "--/--",
            steps: parsed.steps || "--",
          });
        } catch {
          // Keep defaults
        }
      }

      // 3. Load Water Intake
      const savedWater = localStorage.getItem(`water_intake_${userKey}_${todayStr}`);
      if (savedWater) {
        setWaterIntakeMl(Number(savedWater) || 0);
      }

      // 4. Load Eaten Meals State
      const savedMeals = localStorage.getItem(`eaten_meals_${userKey}_${todayStr}`);
      if (savedMeals) {
        try {
          setEatenMeals(JSON.parse(savedMeals));
        } catch {
          // Keep defaults
        }
      }
    });
  }, []);

  const loadLocalMeds = (key: string) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setMedicines(JSON.parse(saved));
      } catch {
        setMedicines([]);
      }
    } else {
      setMedicines([]);
    }
  };

  // Water Intake Actions
  const addWater = (amountMl: number) => {
    const nextAmount = waterIntakeMl + amountMl;
    setWaterIntakeMl(nextAmount);
    const userKey = userId || "guest";
    localStorage.setItem(`water_intake_${userKey}_${todayStr}`, nextAmount.toString());
    toast.success(`Logged ${amountMl} ml water! (${nextAmount} ml total today)`);
  };

  const resetWater = () => {
    setWaterIntakeMl(0);
    const userKey = userId || "guest";
    localStorage.setItem(`water_intake_${userKey}_${todayStr}`, "0");
    toast.info("Water intake reset for today");
  };

  // Toggle Meal Eaten
  const toggleMealEaten = (mealId: string, mealName: string) => {
    const nextState = { ...eatenMeals, [mealId]: !eatenMeals[mealId] };
    setEatenMeals(nextState);
    const userKey = userId || "guest";
    localStorage.setItem(`eaten_meals_${userKey}_${todayStr}`, JSON.stringify(nextState));

    if (nextState[mealId]) {
      toast.success(`Marked "${mealName}" as Eaten! 🥗`);
    } else {
      toast.info(`Updated "${mealName}" status`);
    }
  };

  // Save Health Metrics
  const saveMetrics = () => {
    setMetrics(editMetrics);
    setIsEditingMetrics(false);
    const userKey = userId || "guest";
    localStorage.setItem(`profile_health_${userKey}`, JSON.stringify(editMetrics));
    toast.success("Today's health overview updated!");
  };

  return (
    <Screen noHeader bottomNav bgClass="bg-muted" contentClass="pb-6">
      <div className="px-5 pt-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Good morning</p>
            <h1 className="text-xl font-bold text-foreground">{userName}</h1>
          </div>
          <Link
            to="/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)]"
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive" />
          </Link>
        </div>

        {/* Search */}
        <Link
          to="/chat"
          className="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-card px-4 shadow-[var(--shadow-soft)]"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search symptoms, ask Aura AI...</span>
        </Link>

        {/* AI Banner */}
        <button
          onClick={() => navigate({ to: "/ai-recommendation" })}
          className="mt-5 flex w-full items-center gap-4 rounded-3xl p-5 text-left text-primary-foreground shadow-[var(--shadow-float)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-90">AI Health Coach</p>
            <p className="text-sm font-semibold">Get today's personalized plan</p>
          </div>
          <ChevronRight className="h-5 w-5 opacity-80" />
        </button>

        {/* Today's Overview Section */}
        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Today's overview</h2>
          <button
            onClick={() => {
              setEditMetrics({ ...metrics });
              setIsEditingMetrics(!isEditingMetrics);
            }}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Edit2 className="h-3.5 w-3.5" />
            {isEditingMetrics ? "Cancel" : "Update Vitals"}
          </button>
        </div>

        {/* Dynamic Metrics Cards */}
        {isEditingMetrics ? (
          <div className="mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold text-foreground mb-3">Record Your Vitals</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-muted-foreground">Heart Rate (bpm)</label>
                <input
                  type="text"
                  placeholder="e.g. 72 bpm"
                  value={editMetrics.heartRate === "--" ? "" : editMetrics.heartRate}
                  onChange={(e) => setEditMetrics({ ...editMetrics, heartRate: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-muted p-2 outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground">Blood Sugar (mg/dL)</label>
                <input
                  type="text"
                  placeholder="e.g. 98 mg/dL"
                  value={editMetrics.bloodSugar === "--" ? "" : editMetrics.bloodSugar}
                  onChange={(e) => setEditMetrics({ ...editMetrics, bloodSugar: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-muted p-2 outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground">Blood Pressure</label>
                <input
                  type="text"
                  placeholder="e.g. 120/80"
                  value={editMetrics.bloodPressure === "--/--" ? "" : editMetrics.bloodPressure}
                  onChange={(e) => setEditMetrics({ ...editMetrics, bloodPressure: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-muted p-2 outline-none"
                />
              </div>
              <div>
                <label className="text-muted-foreground">Steps</label>
                <input
                  type="text"
                  placeholder="e.g. 5,000"
                  value={editMetrics.steps === "--" ? "" : editMetrics.steps}
                  onChange={(e) => setEditMetrics({ ...editMetrics, steps: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-muted p-2 outline-none"
                />
              </div>
            </div>
            <button
              onClick={saveMetrics}
              className="mt-4 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground"
            >
              Save Vitals
            </button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatChip
              icon={<Heart className="h-5 w-5" />}
              label="Heart rate"
              value={metrics.heartRate !== "--" ? metrics.heartRate : "--"}
            />
            <StatChip
              icon={<Droplet className="h-5 w-5" />}
              label="Blood sugar"
              value={metrics.bloodSugar !== "--" ? metrics.bloodSugar : "--"}
              tone="secondary"
            />
            <StatChip
              icon={<Activity className="h-5 w-5 text-emerald-500" />}
              label="Blood pressure"
              value={metrics.bloodPressure !== "--/--" ? metrics.bloodPressure : "--/--"}
              tone="success"
            />
            <StatChip
              icon={<Footprints className="h-5 w-5 text-amber-500" />}
              label="Steps"
              value={metrics.steps !== "--" ? metrics.steps : "--"}
              tone="warning"
            />
          </div>
        )}

        {/* Water Taken Widget */}
        <div className="mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Droplet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Water Taken Today</p>
                <p className="text-sm font-bold text-foreground">
                  {waterIntakeMl > 0 ? `${waterIntakeMl} ml` : "0 ml taken today"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => addWater(250)}
                className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> + 250 ml
              </button>
              {waterIntakeMl > 0 && (
                <button
                  onClick={resetWater}
                  title="Reset water intake"
                  className="p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Meals Section */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Recommended Meals</h2>
          </div>
          <Link to="/diet" className="text-xs font-medium text-primary hover:underline">
            View Diet Plan
          </Link>
        </div>

        <div className="mt-3 space-y-2.5">
          {DEFAULT_RECOMMENDED_MEALS.map((meal) => {
            const isEaten = eatenMeals[meal.id];
            return (
              <div
                key={meal.id}
                className={`flex items-center justify-between rounded-2xl p-3.5 transition-all ${
                  isEaten
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-card shadow-[var(--shadow-soft)]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                      {meal.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">· {meal.calories}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-0.5">{meal.name}</p>
                </div>
                <button
                  onClick={() => toggleMealEaten(meal.id, meal.name)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isEaten
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-muted text-foreground hover:bg-primary-soft hover:text-primary"
                  }`}
                >
                  {isEaten ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Eaten
                    </>
                  ) : (
                    "Mark as Eaten"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Navigation Cards */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <ActionCard
            to="/diseases"
            icon={<Stethoscope className="h-5 w-5" />}
            title="My Conditions"
            sub="Manage diseases"
          />
          <ActionCard
            to="/medicine-overview"
            icon={<Pill className="h-5 w-5" />}
            title="Medicines"
            sub={medicines.length > 0 ? `${medicines.length} today` : "Add medicines"}
          />
          <ActionCard
            to="/chat"
            icon={<Sparkles className="h-5 w-5" />}
            title="AI Chatbot"
            sub="Ask Aura health tips"
          />
          <ActionCard
            to="/calendar"
            icon={<Calendar className="h-5 w-5" />}
            title="Calendar"
            sub="View schedule"
          />
        </div>

        {/* Upcoming Reminders / Medicines */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Upcoming reminders</h2>
          {medicines.length > 0 && (
            <Link to="/medicine-overview" className="text-xs font-medium text-primary">
              See all
            </Link>
          )}
        </div>

        <div className="mt-3 space-y-3">
          {medicines.filter((m) => !m.taken && !m.skipped).length > 0 ? (
            medicines
              .filter((m) => !m.taken && !m.skipped)
              .slice(0, 3)
              .map((m) => (
                <Link
                  key={m.id}
                  to="/medicine-overview"
                  className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      m.color === "primary"
                        ? "bg-primary-soft text-primary"
                        : "bg-secondary-soft text-secondary"
                    }`}
                  >
                    <Pill className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {m.name}{" "}
                      <span className="font-normal text-muted-foreground">· {m.dose}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">1 tablet after meal</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {m.time || "Scheduled"}
                  </span>
                </Link>
              ))
          ) : (
            <div className="rounded-2xl border border-dashed border-muted bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Pill className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">No upcoming reminders</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You haven't added any medicines or recommendations yet.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => navigate({ to: "/medicine/add" })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Medicine
                </button>
                <button
                  onClick={() => navigate({ to: "/ai-recommendation" })}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Recommendations
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Medical History & Summary */}
        <Link
          to="/medical-history"
          className="mt-5 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">Medical history</p>
            <p className="text-xs text-muted-foreground">View past records & visits</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link
          to="/daily-summary"
          className="mt-3 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">Daily summary</p>
            <p className="text-xs text-muted-foreground">Review yesterday's progress</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </Screen>
  );
}

function StatChip({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "primary" | "secondary" | "warning" | "success";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary",
    warning: "bg-amber-500/10 text-amber-600",
    success: "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function ActionCard({ to, icon, title, sub }: { to: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link to={to} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </Link>
  );
}