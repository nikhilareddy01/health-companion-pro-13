import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, Activity, Smile, Moon, TrendingUp, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "@/components/mobile/Screen";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/progress/")({ component: Page });

export function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [weeklyScores, setWeeklyScores] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  // Latest tracker values
  const [symptomCount, setSymptomCount] = useState<number>(0);
  const [painLevel, setPainLevel] = useState<string>("Not set");
  const [mood, setMood] = useState<string>("Not set");
  const [sleepHours, setSleepHours] = useState<string>("Not set");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";

      // 1. Calculate Weekly Scores dynamically for Mon-Sun
      const today = new Date();
      const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
      const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

      const scores: number[] = [];
      for (let i = 0; i < 7; i++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + mondayOffset + i);
        const dateStr = dateObj.toISOString().split("T")[0];

        // Check Water
        const water = Number(localStorage.getItem(`water_intake_${userKey}_${dateStr}`)) || 0;
        // Check Meals
        const mealsStr = localStorage.getItem(`eaten_meals_${userKey}_${dateStr}`);
        let mealsCount = 0;
        if (mealsStr) {
          try {
            mealsCount = Object.values(JSON.parse(mealsStr)).filter(Boolean).length;
          } catch (err) {
            console.error(err);
          }
        }

        let dayScore = 0;
        if (water > 0) dayScore += 30;
        if (mealsCount > 0) dayScore += mealsCount * 15;

        // Cap at 100%
        scores.push(Math.min(100, dayScore));
      }
      setWeeklyScores(scores);

      // 2. Trackers
      const savedSymptoms = localStorage.getItem(`symptoms_${userKey}`);
      if (savedSymptoms) {
        try {
          const parsed = JSON.parse(savedSymptoms);
          if (Array.isArray(parsed)) setSymptomCount(parsed.length);
        } catch (err) {
          console.error(err);
        }
      }

      const savedPain = localStorage.getItem(`pain_${userKey}`);
      if (savedPain) setPainLevel(`${savedPain} / 10`);

      const savedMood = localStorage.getItem(`mood_${userKey}`);
      if (savedMood) setMood(savedMood);

      const savedSleep = localStorage.getItem(`sleep_${userKey}`);
      if (savedSleep) setSleepHours(`${savedSleep} hours`);
    });
  }, []);

  const totalProgress = weeklyScores.reduce((a, b) => a + b, 0);

  return (
    <Screen noHeader bottomNav contentClass="px-5 pb-6">
      <div className="pt-4">
        <p className="text-xs text-muted-foreground">Health monitoring</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your progress</h1>
      </div>

      {/* Weekly Trend Graph Card */}
      <div className="mt-5 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)] border border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <p className="text-sm font-semibold text-foreground">Weekly Activity Trend</p>
          </div>
          <span className="text-xs font-bold text-primary">
            {totalProgress > 0 ? "Dynamic Data" : "No Activity"}
          </span>
        </div>

        {totalProgress === 0 ? (
          <div className="mt-6 rounded-2xl bg-muted/50 p-6 text-center">
            <Info className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-xs font-medium text-foreground">No progress activity recorded yet</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Log your water intake, meals, and medicines to generate your live weekly trend chart.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex h-32 items-end justify-between gap-2 border-b border-border/40 pb-2">
              {weeklyScores.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-muted-foreground">
                    {h > 0 ? `${h}%` : ""}
                  </span>
                  <div
                    className="w-full rounded-t-xl transition-all duration-500"
                    style={{
                      height: `${Math.max(h, 4)}%`,
                      background: h > 0 ? "var(--gradient-primary)" : "var(--muted)",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <span key={i} className="flex-1 text-center">
                  {d}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dynamic Health Trackers */}
      <h2 className="mt-6 text-sm font-semibold text-foreground">Health Trackers</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <T
          to="/progress/symptoms"
          Icon={Stethoscope}
          t="Symptoms"
          sub={symptomCount > 0 ? `${symptomCount} logged` : "No symptoms logged"}
        />
        <T to="/progress/pain" Icon={Activity} t="Pain level" sub={painLevel} />
        <T to="/progress/mood" Icon={Smile} t="Mood" sub={mood} />
        <T to="/progress/sleep" Icon={Moon} t="Sleep" sub={sleepHours} />
      </div>
    </Screen>
  );
}

function T({ to, Icon, t, sub }: { to: string; Icon: any; t: string; sub: string }) {
  return (
    <Link to={to} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] hover:border hover:border-primary/20 transition-all">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{t}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
    </Link>
  );
}
