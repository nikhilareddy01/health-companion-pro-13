import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Footprints, Moon, Droplet, Pill, Utensils, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { supabase } from "@/integrations/supabase/client";
import { getDietData, DailyDietData } from "@/utils/dietStorage";

export const Route = createFileRoute("/daily-summary")({ component: Page });

export function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");

  // Dynamic Recorded Data
  const [waterMl, setWaterMl] = useState<number>(0);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [dietData, setDietData] = useState<DailyDietData>({});
  const [healthMetrics, setHealthMetrics] = useState<any>({});

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const dateFormatted = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const currentHour = todayDate.getHours();
  const isEndOfDay = currentHour >= 21; // After 9 PM

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);

      if (data?.user?.user_metadata?.name) {
        setUserName(data.user.user_metadata.name);
      } else if (data?.user?.email) {
        setUserName(data.user.email.split("@")[0]);
      }

      const userKey = uid || "guest";

      // 1. Water Taken
      const savedWater = localStorage.getItem(`water_intake_${userKey}_${todayStr}`);
      setWaterMl(savedWater ? Number(savedWater) || 0 : 0);

      // 2. Medicines Taken
      const savedMeds = localStorage.getItem(uid ? `medicines_${uid}` : "medicines");
      if (savedMeds) {
        try {
          const parsed = JSON.parse(savedMeds);
          setMedicines(Array.isArray(parsed) ? parsed : []);
        } catch {
          setMedicines([]);
        }
      }

      // 3. Diet Data
      setDietData(getDietData(uid));

      // 4. Health Metrics
      const savedMetrics = localStorage.getItem(`profile_health_${userKey}`);
      if (savedMetrics) {
        try {
          setHealthMetrics(JSON.parse(savedMetrics));
        } catch {
          setHealthMetrics({});
        }
      }
    });
  }, [todayStr]);

  const takenMedsCount = medicines.filter((m) => m.taken).length;
  const totalMedsCount = medicines.length;

  const eatenMealsCount = [
    dietData.breakfast?.isEaten,
    dietData.lunch?.isEaten,
    dietData.dinner?.isEaten,
    dietData.snack?.isEaten,
  ].filter(Boolean).length;

  const hasActivity = waterMl > 0 || takenMedsCount > 0 || eatenMealsCount > 0 || healthMetrics.heartRate;

  return (
    <Screen title="Daily Summary" contentClass="px-5 pb-8">
      {/* Banner */}
      <div
        className="rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-float)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <p className="text-xs opacity-90">{dateFormatted}</p>
        <h2 className="mt-1 text-2xl font-bold">
          {isEndOfDay ? "Day Review 🌙" : hasActivity ? "Daily Progress 🌿" : "Today's Summary 📋"}
        </h2>
        <p className="mt-2 text-sm opacity-90">
          {!hasActivity
            ? "No activity entries recorded for today yet. Log water, meals, or vitals to see your summary."
            : `Tracked ${waterMl} ml water, ${takenMedsCount}/${totalMedsCount} medicines, and ${eatenMealsCount} meals today.`}
        </p>
      </div>

      {/* Grid of Dynamic Recorded Activity */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Cell
          Icon={Droplet}
          label="Water Taken"
          value={waterMl > 0 ? `${(waterMl / 1000).toFixed(2)} L (${waterMl} ml)` : "0 ml"}
          sub={waterMl > 0 ? "Goal: 2.5 L" : "No water logged today"}
        />
        <Cell
          Icon={Utensils}
          label="Meals Eaten"
          value={`${eatenMealsCount} / 4 meals`}
          sub={eatenMealsCount > 0 ? "Tracked in diet plan" : "No meals logged"}
        />
        <Cell
          Icon={Heart}
          label="Avg Heart Rate"
          value={healthMetrics.heartRate && healthMetrics.heartRate !== "--" ? `${healthMetrics.heartRate} bpm` : "--"}
          sub={healthMetrics.heartRate ? "Logged today" : "Unrecorded"}
        />
        <Cell
          Icon={Footprints}
          label="Steps"
          value={healthMetrics.steps && healthMetrics.steps !== "--" ? healthMetrics.steps : "--"}
          sub={healthMetrics.steps ? "Logged today" : "Unrecorded"}
        />
      </div>

      {/* Medication Adherence Card */}
      <Link
        to="/medicine-overview"
        className="mt-4 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Medication Adherence</p>
            <p className="text-xs text-muted-foreground">
              {totalMedsCount > 0
                ? `${takenMedsCount}/${totalMedsCount} doses taken today`
                : "No medicines scheduled today"}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-bold ${
            totalMedsCount > 0 && takenMedsCount === totalMedsCount
              ? "text-emerald-600"
              : "text-muted-foreground"
          }`}
        >
          {totalMedsCount > 0 ? `${Math.round((takenMedsCount / totalMedsCount) * 100)}%` : "--"}
        </span>
      </Link>

      {/* End of Day Review Note */}
      {isEndOfDay && (
        <div className="mt-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-primary/20">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" /> End of Day Review Complete
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Great job reviewing your daily health summary for today ({dateFormatted}). Your progress has been saved for your account.
          </p>
        </div>
      )}
    </Screen>
  );
}

function Cell({
  Icon,
  label,
  value,
  sub,
}: {
  Icon: any;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-bold text-foreground mt-0.5">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
