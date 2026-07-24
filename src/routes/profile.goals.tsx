import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Edit3, Check } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { PrimaryButton } from "@/components/mobile/PrimaryButton";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";
import { saveAndSync } from "@/utils/userSync";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile/goals")({ component: Page });

function Page() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedModal, setSavedModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Goals states
  const [weightGoal, setWeightGoal] = useState("Reach 65 kg");
  const [activityGoal, setActivityGoal] = useState("8,000 steps · 30 min activity");
  const [adherenceGoal, setAdherenceGoal] = useState("100% on-time doses");
  const [dietGoal, setDietGoal] = useState("1,800 kcal · low GI meals");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const uid = data?.user?.id || null;
      setUserId(uid);
      const userKey = uid || "guest";

      // 1. Load from localStorage
      const savedLocal = localStorage.getItem(`profile_goals_${userKey}`);
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          if (parsed.weight) setWeightGoal(parsed.weight);
          if (parsed.activity) setActivityGoal(parsed.activity);
          if (parsed.adherence) setAdherenceGoal(parsed.adherence);
          if (parsed.diet) setDietGoal(parsed.diet);
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Load from backend
      if (uid) {
        fetch(getApiUrl(`/api/profiles/${uid}`))
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && data.goals) {
              const g = data.goals;
              if (g.weight) setWeightGoal(g.weight);
              if (g.activity) setActivityGoal(g.activity);
              if (g.adherence) setAdherenceGoal(g.adherence);
              if (g.diet) setDietGoal(g.diet);
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const userKey = userId || "guest";
    const goalsObj = {
      weight: weightGoal,
      activity: activityGoal,
      adherence: adherenceGoal,
      diet: dietGoal,
    };

    // Save to LocalStorage & Sync to Cloud
    saveAndSync(`profile_goals_${userKey}`, JSON.stringify(goalsObj), userKey);

    if (!userId) {
      setSavedModal(true);
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await fetch(getApiUrl(`/api/profiles/${userId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: goalsObj }),
      });

      setSavedModal(true);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setSavedModal(true);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const goalsList = [
    { label: "WEIGHT MANAGEMENT", value: weightGoal, set: setWeightGoal, placeholder: "e.g. Reach 65 kg" },
    { label: "DAILY HEALTH", value: activityGoal, set: setActivityGoal, placeholder: "e.g. 8,000 steps · 30 min activity" },
    { label: "MEDICINE ADHERENCE", value: adherenceGoal, set: setAdherenceGoal, placeholder: "e.g. 100% on-time doses" },
    { label: "DIET", value: dietGoal, set: setDietGoal, placeholder: "e.g. 1,800 kcal · low GI meals" },
  ];

  return (
    <Screen
      title="Goals"
      headerRight={
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80 transition"
        >
          {isEditing ? <Check className="h-4 w-4 text-primary" /> : <Edit3 className="h-4 w-4" />}
        </button>
      }
      contentClass="px-5 pb-8"
    >
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading goals...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            {goalsList.map((g) => (
              <div
                key={g.label}
                className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] min-h-[72px] flex flex-col justify-center"
              >
                <p className="text-xs font-medium text-muted-foreground">{g.label}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={g.value}
                    onChange={(e) => g.set(e.target.value)}
                    placeholder={g.placeholder}
                    className="mt-2 text-sm font-semibold text-foreground bg-muted px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                ) : (
                  <p className="mt-1 text-sm font-semibold text-foreground">{g.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            {isEditing ? (
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? "Saving goals..." : "Save Goals"}
              </PrimaryButton>
            ) : (
              <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
                Edit Goals
              </PrimaryButton>
            )}
          </div>
        </form>
      )}

      {savedModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-6 sm:items-center"
          onClick={() => setSavedModal(false)}
        >
          <div className="w-full max-w-sm rounded-3xl bg-background p-7 text-center border border-border shadow-[var(--shadow-float)]">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success animate-bounce" />
            <p className="mt-3 text-lg font-bold text-foreground">Goals saved</p>
            <p className="mt-1 text-sm text-muted-foreground">We'll keep you on track with your goals.</p>
            <PrimaryButton className="mt-5" onClick={() => setSavedModal(false)}>
              Done
            </PrimaryButton>
          </div>
        </div>
      )}
    </Screen>
  );
}
