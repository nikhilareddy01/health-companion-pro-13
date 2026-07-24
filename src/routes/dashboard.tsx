import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  Droplet,
  Activity,
  Footprints,
  Search,
  Pill,
  Stethoscope,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle2,
  Utensils,
  Edit2,
  RotateCcw,
  Circle,
} from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getApiUrl } from "@/utils/api";
import { pushUserCloud, pullUserCloud, saveAndSync } from "@/utils/userSync";
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
  type: "Breakfast" | "Lunch" | "Snack" | "Dinner";
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

  // Eaten Meals State
  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>({});

  const getTodayStr = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const todayStr = getTodayStr();
    
    const initSyncAndLoad = async () => {
      const { data }: any = await supabase.auth.getUser();
      const uid = data?.user?.id || localStorage.getItem("demo_user_id") || null;
      setUserId(uid);

      if (uid) {
        await pullUserCloud(uid);
      }

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
          setEditMetrics({
            heartRate: parsed.heartRate || parsed.heart_rate || "72 bpm",
            bloodSugar: parsed.bloodSugar || parsed.blood_sugar || "95 mg/dL",
            bloodPressure: parsed.bloodPressure || parsed.blood_pressure || "120/80",
            steps: parsed.steps || "5000",
          });
        } catch {
          // ignore
        }
      }

      // 3. Load Water Intake & Eaten Meals for Today
      const savedWater = localStorage.getItem(`water_intake_${userKey}_${todayStr}`);
      if (savedWater !== null) {
        setWaterIntakeMl(parseInt(savedWater, 10) || 0);
      }

      const savedMeals = localStorage.getItem(`eaten_meals_${userKey}_${todayStr}`);
      if (savedMeals) {
        try {
          setEatenMeals(JSON.parse(savedMeals));
        } catch {
          setEatenMeals({});
        }
      }
    };

    initSyncAndLoad();
  }, []);

  const loadLocalMeds = (key: string) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setMedicines(JSON.parse(saved));
      } catch {
        setMedicines([]);
      }
    }
  };

  // Water Actions
  const addWater = (amountMl: number) => {
    const nextVal = waterIntakeMl + amountMl;
    setWaterIntakeMl(nextVal);
    const userKey = userId || "guest";
    saveAndSync(`water_intake_${userKey}_${getTodayStr()}`, String(nextVal), userKey);
    toast.success(`Added ${amountMl} ml of water! 💧`);
  };

  const resetWater = () => {
    setWaterIntakeMl(0);
    const userKey = userId || "guest";
    saveAndSync(`water_intake_${userKey}_${getTodayStr()}`, "0", userKey);
    toast.info("Water intake reset.");
  };

  // Mark Meal as Eaten (Permanent - No Undo!)
  const markMealEaten = (mealId: string, mealName: string) => {
    if (eatenMeals[mealId]) return; // Once eaten, that's it! No undo!

    const nextState = { ...eatenMeals, [mealId]: true };
    setEatenMeals(nextState);
    const userKey = userId || "guest";
    saveAndSync(`eaten_meals_${userKey}_${getTodayStr()}`, JSON.stringify(nextState), userKey);
    toast.success(`Marked "${mealName}" as Eaten! 🥗`);
  };

  // Save Health Metrics
  const saveMetrics = () => {
    setMetrics(editMetrics);
    setIsEditingMetrics(false);
    const userKey = userId || "guest";
    saveAndSync(`profile_health_${userKey}`, JSON.stringify(editMetrics), userKey);
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
            const isEaten = !!eatenMeals[meal.id];
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
                  disabled={isEaten}
                  onClick={() => markMealEaten(meal.id, meal.name)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isEaten
                      ? "bg-emerald-500 text-white shadow-sm cursor-default opacity-95"
                      : "bg-muted text-foreground hover:bg-primary-soft hover:text-primary"
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
            sub={medicines.length > 0 ? `${medicines.length} scheduled` : "Track prescriptions"}
          />
        </div>
      </div>
    </Screen>
  );
}

function ActionCard({ to, icon, title, sub }: { to: string; icon: any; title: string; sub: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] hover:border hover:border-primary/20 transition-all">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </Link>
  );
}